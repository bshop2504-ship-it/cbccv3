import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "../sections/HeroSection.jsx";
import {
  SectionContainer,
  SectionHeader,
  Card,
  DarkCard,
  Grid,
  IconCard,
  Divider,
} from "../components/UI.jsx";
import StepFlow from "../components/StepFlow.jsx";
import {
  CrossIcon,
  HeartIcon,
  GlobeIcon,
  BookIcon,
  FlameIcon,
  ShieldIcon,
  PeopleIcon,
  SeedIcon,
  LightIcon,
  HandsIcon,
  StarIcon,
  ChevronRightIcon,
} from "../assets/svg/Icons.jsx";
import miniPhilosophyImg from "../assets/images/miniPhilo.webp";
import coreValuesImg from "../assets/images/corevalue.webp";
import { fetchCurrentUser } from "../api/currentUser.js";
const coreValues = [
  {
    icon: <BookIcon size={22} color="#093C5D" />,
    title: "Jesus glorified",
  },
  {
    icon: <HeartIcon size={22} color="#093C5D" />,
    title: "Transformed life",
  },
  {
    icon: <PeopleIcon size={22} color="#093C5D" />,
    title: "Great commitment to the Great Commandment of the Great Commission",
  },
  {
    icon: <GlobeIcon size={22} color="#093C5D" />,
    title: "Biblical holiness",
  },
  {
    icon: <ShieldIcon size={22} color="#093C5D" />,
    title: "Unity in the body",
  },
  {
    icon: <FlameIcon size={22} color="#093C5D" />,
    title: "Care for the needy",
  },
];

const discipleshipSteps = [
  {
    title: "Discovering",
    description:
      "Observing Investigating Analyzing Believing Deciding Repenting",
    icon: <SeedIcon size={22} color="#6FD1D7" />,
  },
  {
    title: "Enfolding",
    description:
      "Enlisting Identifying Belonging Worshipping Fellowshipping Praying Listening Growing Testifying",
    icon: <HeartIcon size={22} color="#6FD1D7" />,
  },
  {
    title: "Equipping",
    description: "Learning Maturing Following Ministering",
    icon: <BookIcon size={22} color="#6FD1D7" />,
  },
  {
    title: "Deploying",
    description: "Evangelizing Mentoring Partnering Ministering",
    icon: <HandsIcon size={22} color="#6FD1D7" />,
  },
  {
    title: "Sending",
    description: "Leading Mentoring Bestowing",
    icon: <GlobeIcon size={22} color="#6FD1D7" />,
  },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Rationale */}
      <SectionContainer id="rationale">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-xs font-mono font-semibold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full border text-steel border-steel/30 bg-steel/10">
              Why We Exist
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-navy leading-tight mb-6">
              Our Rationale
            </h2>
            <Divider />
            <p className="text-steel/80 text-lg leading-relaxed mb-6 text-justify">
              The Cabagan Community Church (CBCC) exists to change the Ibanag
              ethnic group from being classified as an “unreached people group”
              to being a “reached people group” by seeing strong churches
              planted throughout their regions, churches which are able to reach
              out and minister themselves. Moreover, CBCC envisioned to see both
              the Ibanags and the other people in their regions evangelized.
              Thus, the Cabagan Bible Community Church (CBCC) exists. The
              “Ibanag region” is any place where there is an Ibanag. What does
              this mean? This means, if you are an Ibanag, wherever you go, if
              there’s an Ibanag there that makes that an “Ibanag region” and we,
              as a church, want to reach out there. So, our church has a vision
              to reach out to the Filipino people in various provinces of the
              Philippines specifically in the Cagayan Valley Region (Isabela and
              Cagayan) and beyond (other countries) wherever we find ourselves.
              But, of course, our emphasis is where there are concentrations of
              Ibanags.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-steel font-semibold hover:text-navy transition-colors group"
            >
              Learn More About Us{" "}
              <ChevronRightIcon
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass-card rounded-3xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-aqua/20 border border-aqua/30 flex items-center justify-center mb-6">
                <CrossIcon size={28} color="#6FD1D7" />
              </div>
              <blockquote className="font-display text-2xl text-navy font-bold italic leading-relaxed mb-6">
                "Go therefore and make disciples of all nations, baptizing them
                in the name of the Father and of the Son and of the Holy Spirit,
                teaching them to observe all that I have commanded you. And
                behold, I am with you always, to the end of the age."
              </blockquote>
              <p className="text-steel/60 text-sm font-mono">
                — Matthew 28:19-20 ESV
              </p>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-aqua/10 border border-aqua/20 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl bg-navy/5 border border-navy/10 -z-10" />
          </motion.div>
        </div>
      </SectionContainer>

      {/* 3. Vision & Mission */}
      <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Our Direction"
            title="Vision & Mission"
            light
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DarkCard>
              <div className="w-12 h-12 rounded-xl bg-aqua/20 border border-aqua/30 flex items-center justify-center mb-5">
                <LightIcon size={22} color="#6FD1D7" />
              </div>
              <h3 className="font-display font-bold text-white text-2xl mb-4">
                Our Vision
              </h3>
              <p className="text-white/60 leading-relaxed">
                Reaching out the Ibanags and beyond.
              </p>
            </DarkCard>
            <DarkCard delay={0.15}>
              <div className="w-12 h-12 rounded-xl bg-aqua/20 border border-aqua/30 flex items-center justify-center mb-5">
                <GlobeIcon size={22} color="#6FD1D7" />
              </div>
              <h3 className="font-display font-bold text-white text-2xl mb-4">
                Our Mission
              </h3>
              <p className="text-white/60 leading-relaxed">
                • We exist to Worship • We exist to Instruct • We exist to
                Fellowship • We exist to Evangelize • We exist to Serve
              </p>
            </DarkCard>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <SectionContainer id="values">
        <SectionHeader eyebrow="What We Stand On" title="Core Values" />

        <div className="grid lg:grid-cols-4 gap-6 items-start">
          {/* Core Values Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coreValues.map((val, i) => (
              <IconCard
                key={i}
                icon={val.icon}
                title={val.title}
                delay={i * 0.08}
              />
            ))}
          </div>

          {/* Feature Image Card */}
          <div className="group relative w-full h-80 sm:h-72 lg:h-full overflow-hidden rounded-2xl shadow-xl">
            {/* Image */}
            <img
              src={coreValuesImg}
              alt="Core Values"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition duration-500" />

            {/* Text */}
            <div className="absolute bottom-0 left-0 p-5">
              <h3 className="text-white text-lg font-semibold tracking-wide">
                CBCC Values
              </h3>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* 5. Ministry Philosophy */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <SectionHeader
                eyebrow="How We Minister"
                title="Ministry Philosophy"
                light
                center={false}
              />
              <p className="text-white/60 leading-relaxed text-justify">
                Our ministry philosophy is what we believe as the wisest way to
                operate in carrying out the purposes of the church towards the
                fulfillment of the Great Commission. We believe that as a
                disciple-making church, our ministry philosophy must be focused
                on Calling in disciples, Building them up, Cultivating their
                skills and abilities, and Commissioning them to the glory of
                God.
              </p>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group relative overflow-hidden rounded-2xl shadow-xl">
                {/* Image */}
                <img
                  src={miniPhilosophyImg}
                  alt="Ministry Philosophy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition duration-500" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="text-white text-lg font-semibold tracking-wide">
                    CBCC
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Discipleship Flow */}
      <SectionContainer id="discipleship">
        <SectionHeader
          eyebrow="The Journey"
          title="Process of Growing Disciples"
          subtitle="Our church recognizes discipleship as a process in which disciples go through five different stages tobecome fully functioning followers of Christ."
        />
        <StepFlow steps={discipleshipSteps} />
        <div className="mt-12 text-center">
          <Link
            to="/discipleship"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-navy text-white font-semibold hover:bg-steel transition-all duration-300"
          >
            Explore Full Discipleship Path{" "}
            <ChevronRightIcon size={18} color="white" />
          </Link>
        </div>
      </SectionContainer>

      {/* 7. Strategy */}
      <section className="mesh-bg py-20 px-4 sm:px-6 lg:px-12 xl:px-20 border-y border-navy/10">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="How We Grow" title="Our Strategy" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "RING THEM IN to the fold of CBCC",
              },
              {
                num: "02",
                title: "BUILD THEM UP through God’s Word and fellowship",
              },
              {
                num: "03",
                title: "TRAIN THEM FOR the ministry",
              },
              {
                num: "04",
                title: "SEND THEM OUT for missions",
              },
            ].map((item, i) => (
              <Card key={i} delay={i * 0.1}>
                <div className="text-4xl font-display font-black text-navy/10 mb-4">
                  {item.num}
                </div>
                <h3 className="font-display font-bold text-navy text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-steel/70 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Motto & CTA */}
      <section className="hero-gradient py-24 px-4 sm:px-6 lg:px-12 xl:px-20 text-center relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Our Motto
            </h2>
            <p className="font-display text-2xl sm:text-3xl text-aqua italic font-bold mb-6">
              “A Church in every community, the Gospel for every person”
            </p>
            <p className="text-white/50 mb-12 max-w-lg mx-auto">
              We are engaged in saturation church planting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="px-8 py-4 rounded-2xl bg-aqua text-navy font-semibold hover:bg-white transition-all"
              >
                Join Our Community
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-2xl glass border border-white/30 text-white font-medium hover:bg-white/15 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
