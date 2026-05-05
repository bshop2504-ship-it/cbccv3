import React from "react";
import { motion } from "framer-motion";
import {
  SectionContainer,
  SectionHeader,
  Card,
  DarkCard,
  Grid,
} from "../components/UI.jsx";
import {
  PeopleIcon,
  ShieldIcon,
  BookIcon,
  StarIcon,
} from "../assets/svg/Icons.jsx";
import churchStructCom from "../assets/images/churchStructCom.webp";
import jpgcycle from "../assets/images/jpgcycle.webp";
import churchGovOrg from "../assets/images/churchGovOrg.webp";
import wheelofprogress from "../assets/images/wheelofprogress.webp";

const districtChurches = [
  {
    name: "Central District",
    location: "Anao,Cabagan,Isabela",
    pastor: "",
  },
  {
    name: "Northern District",
    location: "TBA",
    pastor: "Ptr.",
  },
  {
    name: "Eastern District",
    location: "TBA",
    pastor: "Ptr.",
  },
  {
    name: "Southern District",
    location: "TBA",
    pastor: "Ptr.Ptr.",
  },
  {
    name: "Western District 1",
    location: "TBA",
    pastor: "Ptr.",
  },
  {
    name: "Western District 2",
    location: "TBA",
    pastor: "Ptr.",
  },
  {
    name: "The Planters District",
    location: "TBA",
    pastor: "Ptr.",
  },
  {
    name: "NCR District",
    location: "TBA",
    pastor: "Ptr.",
  },
  {
    name: "International District",
    location: "TBA",
    pastor: "Ptr.",
  },
];

export default function Structure() {
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
            Structure
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Church Structure
          </h1>
        </motion.div>
      </section>

      {/* Church Structure Composition */}
      <SectionContainer>
        <SectionHeader
          eyebrow="Composition"
          title="Church Structure"
          subtitle="CBCC is a community of disciples embodied by a network of small groups committed to spreading biblical holiness through discipleship."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* GROUP CELEBRATION */}
          <Card>
            <div className="w-12 h-12 rounded-xl bg-navy/10 border border-navy/15 flex items-center justify-center mb-4">
              <PeopleIcon size={22} color="#093C5D" />
            </div>

            <h3 className="font-semibold text-navy text-base mb-3">
              Group Celebration
            </h3>

            <ul className="text-steel/80 text-sm space-y-1 list-disc pl-4">
              <li>Sunday Worship Services</li>
              <li>Mid-Week Service</li>
              <li>Regional Youth Fellowship</li>
              <li>Special Events</li>
            </ul>
          </Card>

          {/* SMALL GROUP NURTURE */}
          <Card>
            <div className="w-12 h-12 rounded-xl bg-navy/10 border border-navy/15 flex items-center justify-center mb-4">
              <BookIcon size={22} color="#093C5D" />
            </div>

            <h3 className="font-semibold text-navy text-base mb-3">
              Small Group Nurture
            </h3>

            <ul className="text-steel/80 text-sm space-y-1 list-disc pl-4">
              <li>Ministry Teams</li>
              <li>Music & Worship Team</li>
              <li>Outreach & Tech Teams</li>
              <li>Bible Study Groups</li>
              <li>Prayer Warriors & Dawn Watch</li>
              <li>Family Prayer Time</li>
            </ul>
          </Card>

          {/* PERSONAL MENTORING */}
          <Card>
            <div className="w-12 h-12 rounded-xl bg-navy/10 border border-navy/15 flex items-center justify-center mb-4">
              <ShieldIcon size={22} color="#093C5D" />
            </div>

            <h3 className="font-semibold text-navy text-base mb-3">
              Personal Mentoring
            </h3>

            <p className="text-steel/80 text-sm leading-relaxed">
              One-on-one reproduction of leaders through intentional
              discipleship and spiritual guidance.
            </p>
          </Card>

          {/* IMAGE CARD (FIXED) */}
          <Card className="overflow-hidden p-0">
            <div className="relative h-full min-h-[220px]">
              <img
                src={churchStructCom}
                alt="Church Structure"
                className="w-full h-full object-contain"
                loading="lazy"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />

              {/* label */}
              <div className="absolute bottom-4 left-4 text-light">
                <h3 className="text-sm font-semibold">Church Structure</h3>
                <p className="text-xs text-light/70">
                  Group Celebration | Small Groups Nurture | Personal Mentoring
                </p>
              </div>
            </div>
          </Card>
        </div>
      </SectionContainer>

      {/* JPG CYCLE OF MENTORING*/}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Church Structure"
            title="JPG Cycle of Monitoring"
            light
          />
          <div className="flex flex-col gap-3">
            <Card className="overflow-hidden p-0">
              <div className="relative h-full min-h-[220px]">
                <img
                  src={jpgcycle}
                  alt="jpg cycle"
                  className="w-full h-full object-contain rounded-lg"
                  loading="lazy"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />

                {/* label */}
                <div className="absolute bottom-4 left-4 text-light">
                  <h3 className="text-sm font-semibold">
                    JPG Cycle of Monitoring
                  </h3>
                  <p className="text-xs text-light/70">
                    Selecting | Enfolding | Molding | Deploying | Supervising |
                    unleashing | Selecting
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Church Government Philosophy */}
      <SectionContainer>
        <SectionHeader
          eyebrow="Government"
          title="Church Government Organization Structure"
        />
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden p-0">
            <div className="relative h-full min-h-[220px]">
              <img
                src={churchGovOrg}
                alt="Church Government Organization Structure"
                className="w-full h-full object-contain"
                loading="lazy"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />

              {/* label */}
              <div className="absolute bottom-4 left-4 text-light">
                <h3 className="text-sm font-semibold">
                  Church Government Organization Structure
                </h3>
                <p className="text-xs text-light/70">
                  CBCC Organization Structure
                </p>
              </div>
            </div>
          </Card>
        </div>
      </SectionContainer>

      {/* CBCC District Churches */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="District"
            title="CBCC District Churches"
            subtitle="CBCC Jerusalem Church"
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {districtChurches.map((church, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-dark rounded-2xl p-5"
              >
                <div className="w-2 h-2 rounded-full bg-aqua mb-4" />
                <h3 className="font-semibold text-white text-sm mb-1">
                  {church.name}
                </h3>
                <p className="text-white/40 text-xs mb-3">{church.location}</p>
                <div className="border-t border-white/10 pt-3">
                  <span className="text-aqua/70 text-xs font-mono">
                    {church.pastor}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 glass-dark rounded-2xl p-6 text-center"
          >
            <p className="text-white/50 text-sm">
              And{" "}
              <span className="text-aqua font-semibold">40+ more churches</span>{" "}
              across the Philippines — all united under the CBCC vision to build
              disciples and transform nations.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Discipleship wheel of progress */}
      <SectionContainer>
        <SectionHeader
          eyebrow="Discipleship"
          title="Discipleship Wheel of Progress"
          subtitle=" We measure disciples’ spiritual condition based on
          the following: 
         "
        />
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden p-0">
            <div className="relative h-full min-h-[220px]">
              <img
                src={wheelofprogress}
                alt="Church Government Organization Structure"
                className="w-full h-full object-contain"
                loading="lazy"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />

              {/* label */}
              <div className="absolute bottom-4 left-4 text-light">
                <h3 className="text-sm font-semibold">
                  Discipleship Wheel of Progress
                </h3>
                <p className="text-xs text-light/70">
                  • Their Worship • Their Word • Their Fellowship • Their Prayer
                  • Their Service • Their Evangelism • Their Obedience
                </p>
              </div>
            </div>
          </Card>
        </div>
      </SectionContainer>
    </>
  );
}
