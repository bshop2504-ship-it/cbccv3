import React from "react";
import { motion } from "framer-motion";
import {
  SectionContainer,
  SectionHeader,
  Card,
  DarkCard,
} from "../components/UI.jsx";
import {
  BookIcon,
  StarIcon,
  PeopleIcon,
  LightIcon,
} from "../assets/svg/Icons.jsx";
import Timeline from "../components/Timeline.jsx";
import { CbccDoctrine } from "../data/CbccDoctrine.js";
export default function Education() {
  return (
    <>
      <section className="hero-gradient pt-32 pb-20 px-4 sm:px-6 lg:px-12 xl:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-mono font-semibold tracking-[0.2em] uppercase mb-5 px-4 py-1.5 rounded-full border text-aqua border-aqua/30 bg-aqua/10">
            Education
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Educational Plan
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            A comprehensive approach to forming mature disciples through formal
            and informal education.
          </p>
        </motion.div>
      </section>

      <SectionContainer>
        <SectionHeader
          eyebrow="Educational Plan"
          title="Our Approach to Education"
          subtitle="Three Categories of Education"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <BookIcon size={22} color="#093C5D" />,
              title: "Informal Education",
              desc: [
                "Bible study groups",
                "Cell groups",
                "Personal mentoring",
                "Discipleship groups",
              ],
            },
            {
              icon: <LightIcon size={22} color="#093C5D" />,
              title: "Non-formal Education",
              desc: [
                "Encounter-Pool of Empowered Ministers (E-POEM)",
                "CBCC discipleship program to help every member become a fully functioning follower of Christ",
                "Theological education by extension",
              ],
            },
            {
              icon: <PeopleIcon size={22} color="#093C5D" />,
              title: "Formal Education (Seminary)",
              desc: [
                "Cabagan Bible Institute (CBI)",
                " Southern Methodist College (SMC)",
              ],
            },
          ].map((item, i) => (
            <Card key={i} delay={i * 0.1}>
              <div className="w-12 h-12 rounded-xl bg-navy/10 border border-navy/15 flex items-center justify-center mb-4">
                {item.icon}
              </div>

              <h3 className="font-semibold text-navy text-base mb-2">
                {item.title}
              </h3>

              {Array.isArray(item.desc) ? (
                <ul className="text-steel/70 text-sm leading-relaxed list-disc pl-5 space-y-1">
                  {item.desc.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-steel/70 text-sm leading-relaxed">
                  {item.desc}
                </p>
              )}
            </Card>
          ))}
        </div>
      </SectionContainer>
      {/* History Timeline */}
      <SectionContainer>
        <SectionHeader
          eyebrow="Beliefs"
          title="CBCC Doctrine"
          subtitle="Section A–P, presenting core biblical teachings that guide faith and Christian living."
        />
        <Timeline events={CbccDoctrine} />
      </SectionContainer>
    </>
  );
}
