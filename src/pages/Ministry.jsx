import React from "react";
import { motion } from "framer-motion";
import {
  SectionContainer,
  SectionHeader,
  Card,
  DarkCard,
  Grid,
  IconCard,
} from "../components/UI.jsx";
import {
  FlameIcon,
  BookIcon,
  PeopleIcon,
  GlobeIcon,
  HeartIcon,
  LightIcon,
  HandsIcon,
  ShieldIcon,
  SeedIcon,
} from "../assets/svg/Icons.jsx";
import miniPhilo from "../assets/images/miniPhilo.webp";
import corevalue from "../assets/images/corevalue.webp";
import dynamic from "../assets/images/dynamics.webp";
export default function Ministry() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 px-4 sm:px-6 lg:px-12 xl:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-mono font-semibold tracking-[0.2em] uppercase mb-5 px-4 py-1.5 rounded-full border text-aqua border-aqua/30 bg-aqua/10">
            Ministry
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            How We Serve
          </h1>
        </motion.div>
      </section>

      {/* Ministry Philosophy */}
      <SectionContainer>
        <SectionHeader
          eyebrow="Ministry Philosophy"
          title="Our Approach to Ministry"
        />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* LEFT: CORE CARDS */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: <BookIcon size={22} color="#093C5D" />,
                title: "C",
                description: "Call In",
              },
              {
                icon: <FlameIcon size={22} color="#093C5D" />,
                title: "B",
                description: "Build Up",
              },
              {
                icon: <PeopleIcon size={22} color="#093C5D" />,
                title: "C",
                description: "Cultivate",
              },
              {
                icon: <SeedIcon size={22} color="#093C5D" />,
                title: "C",
                description: "Commission",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 text-center
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-lg hover:shadow-2xl
          transition-all duration-300 hover:-translate-y-2
          flex flex-col justify-center gap-3"
              >
                <div className="flex justify-center">{item.icon}</div>

                <span className="text-5xl font-bold text-[#093C5D] leading-none">
                  {item.title}
                </span>

                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* RIGHT: IMAGE */}
          <div className="lg:col-span-2">
            <div
              className="relative w-[381px] h-[356px] rounded-2xl overflow-hidden
        bg-white/10 backdrop-blur-xl
        border border-white/20 shadow-lg
        hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={miniPhilo}
                alt="ministry philosophy"
                className="w-full h-full object-cover"
                width="381"
                height="356"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#093C5D]/50 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="text-lg font-semibold">Ministry Philosophy</h3>
                <p className="text-sm opacity-80">
                  Call • Build • Cultivate • Commission
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH STATEMENT (FIXED STRUCTURE) */}
        <div className="mt-10">
          <div
            className="w-full rounded-2xl p-6 md:p-10
      bg-white/10 backdrop-blur-xl
      border border-white/20
      shadow-lg
      leading-relaxed text-gray-700"
          >
            <p className="text-sm md:text-base text-center max-w-4xl mx-auto">
              Our ministry philosophy is what we believe as the wisest way to
              operate in carrying out the purposes of the church towards the
              fulfillment of the Great Commission.
              <br />
              <br />
              We believe that as a disciple-making church, our ministry
              philosophy must be focused on{" "}
              <span className="font-semibold text-[#093C5D]">
                Calling in disciples
              </span>
              ,
              <span className="font-semibold text-[#093C5D]">
                {" "}
                Building them up
              </span>
              ,
              <span className="font-semibold text-[#093C5D]">
                {" "}
                Cultivating their skills and abilities
              </span>
              , and{" "}
              <span className="font-semibold text-[#093C5D]">
                {" "}
                Commissioning them
              </span>
              to the glory of God.
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Core Values */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Core Values" title="Our Values" light />

          {/* VALUES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[
              { title: "Jesus glorified" },
              { title: "Transformed life" },
              {
                title:
                  "Great commitment to the Great Commandment of the Great Commission",
              },
              { title: "Biblical holiness" },
              { title: "Unity in the body" },
              { title: "Care for the needy" },
            ].map((prog, i) => (
              <DarkCard key={i} delay={i * 0.06}>
                <div className="w-2 h-2 rounded-full bg-aqua mb-4" />

                <h3 className="font-semibold text-white text-base leading-snug">
                  {prog.title}
                </h3>
              </DarkCard>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <div
              className="relative w-[381px] h-[356px] rounded-2xl overflow-hidden
    bg-white/10 backdrop-blur-xl
    border border-white/20
    shadow-lg"
            >
              <img
                src={corevalue}
                alt="Core values"
                className="w-full h-[320px] object-contain"
                loading="lazy"
                width="381"
                height="356"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

              {/* optional label */}
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-lg font-semibold">Core Values</h3>
                <p className="text-sm opacity-80">
                  Living out Christ-centered principles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Strategy"
              title="Our Strategy"
              center={false}
            />

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                "BRING THEM IN to the fold of CBCC",
                "BUILD THEM UP through God’s Word and fellowship",
                "TRAIN THEM FOR the ministry",
                "SEND THEM OUT for missions",
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-aqua shrink-0" />
                  <span className="text-navy font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 text-center"
          >
            <FlameIcon size={60} color="#6FD1D7" className="mx-auto mb-6" />
            <blockquote className="font-display text-xl text-navy font-bold italic mb-4">
              “Go therefore and make disciples of all nations, baptizing them in
              the name of the Father and of the Son and of the Holy Spirit,
              teaching them to observe all that I have commanded you. And
              behold, I am with you always, to the end of the age.”
            </blockquote>
            <p className="text-steel/50 text-sm font-mono">
              — Matthew 28:19–20
            </p>
          </motion.div>
        </div>
      </SectionContainer>
      {/* Products / Ministry Programs */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Products"
            title="Ministry Programs"
            subtitle="Practical ministry expressions that embody our philosophy and advance our mission."
            light
          />

          <div className="mt-10">
            <div
              className="rounded-2xl p-6 md:p-10
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-lg"
            >
              <div className="w-2 h-2 rounded-full bg-aqua mb-6" />

              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                We strive hard to develop disciples who are growing stronger
                through
                <span className="text-white font-semibold"> WORSHIP</span>,
                becoming wiser through
                <span className="text-white font-semibold"> INSTRUCTION</span>,
                caring through
                <span className="text-white font-semibold"> FELLOWSHIP</span>,
                multiplying through
                <span className="text-white font-semibold"> EVANGELISM</span>,
                and known through
                <span className="text-white font-semibold"> SERVICE</span>.
                <br />
                <br />A fully functioning follower of Jesus who is built up in
                Him through fellowship with the small group and exposure in the
                ministry, rooted and strengthened in the faith by the teaching
                of the Word of God, and overflowing with thankfulness expressed
                in loving worship and a desire to pursue the lost, caring and
                serving them to win the favor of God and man.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Power */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Power"
              title="The Source of Our Power"
              center={false}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 text-center"
          >
            <FlameIcon size={60} color="#6FD1D7" className="mx-auto mb-6" />
            <blockquote className="font-display text-xl text-navy font-bold italic mb-4">
              “But you will receive power when the Holy Spirit comes on you; and
              you will be my witnesses in Jerusalem, and in all Judea and
              Samaria, and to the ends of the earth."
            </blockquote>
            <p className="text-steel/50 text-sm font-mono">— Acts 1:7-8</p>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Dynamics */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Dynamics"
            title="Church Dynamics"
            subtitle="The living, breathing realities that define how we function as a community of faith."
            light
          />

          <div className="mt-10 flex justify-center">
            <div
              className="relative rounded-2xl overflow-hidden
    bg-white/10 backdrop-blur-xl
    border border-white/20
    shadow-lg hover:shadow-2xl
    transition-all duration-300
    w-[381px] h-[356px]"
            >
              <img
                src={dynamic}
                alt="Church Dynamics"
                className="w-full h-[300px] object-contain"
                loading="lazy"
                width="381"
                height="356"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* text overlay */}
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-semibold">Church Dynamics</h3>
                <p className="text-sm opacity-80">
                  Living. Growing. Moving as one body in Christ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
