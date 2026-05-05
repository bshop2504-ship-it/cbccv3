import React from "react";
import { motion } from "framer-motion";
import {
  SectionContainer,
  SectionHeader,
  Card,
  DarkCard,
} from "../components/UI.jsx";
import StepFlow from "../components/StepFlow.jsx";
import {
  SeedIcon,
  HeartIcon,
  BookIcon,
  HandsIcon,
  GlobeIcon,
  WheelIcon,
  StarIcon,
  LightIcon,
} from "../assets/svg/Icons.jsx";

const steps = [
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

const growthPrinciples = [
  "A disciple begat disciple.",
  "Small group begat small group.",
  "Ministry Team begat Ministry Team.",
  "Local Church begat Local Church.",
  "Church in the Philippines begat Church abroad.",
];

import growthPhilo from "../assets/images/growthPhilo.webp";
export default function Discipleship() {
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
            Discipleship
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            The Disciple's Journey
          </h1>
        </motion.div>
      </section>
      {/* Process of Growing a Disciple */}
      <SectionContainer>
        <SectionHeader
          eyebrow="Process"
          title="Growing a Disciple"
          subtitle="Our church recognizes discipleship as a process in
          which disciples go through five different stages to
          become fully functioning followers of Christ."
        />
        <StepFlow steps={steps} />
        <div className="mt-10 overflow-x-auto">
          <div
            className="min-w-[900px] rounded-2xl overflow-hidden
    bg-[#093C5D]/80 backdrop-blur-xl
    border border-[#3B7597]/30
    shadow-lg"
          >
            <table className="w-full text-sm text-left">
              {/* HEADER */}
              <thead className="bg-[#3B7597]/30 text-[#6FD1D7]">
                <tr>
                  <th className="p-4 font-semibold">STAGE</th>
                  <th className="p-4 font-semibold">TARGET</th>
                  <th className="p-4 font-semibold">OBJECTIVE</th>
                  <th className="p-4 font-semibold">EMPHASIS</th>
                  <th className="p-4 font-semibold">CORE VALUES</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-[#3B7597]/20 text-[#F5F5F5]/90">
                <tr className="hover:bg-[#3B7597]/20 transition">
                  <td className="p-4 font-bold text-[#6FD1D7]">Discovering</td>
                  <td className="p-4">Seekers</td>
                  <td className="p-4">Knowing Christ</td>
                  <td className="p-4">Deciding / Surrendering</td>
                  <td className="p-4">Surrender to Christ</td>
                </tr>

                <tr className="hover:bg-[#3B7597]/20 transition">
                  <td className="p-4 font-bold text-[#6FD1D7]">Enfolding</td>
                  <td className="p-4">New believers</td>
                  <td className="p-4">Growing in Christ</td>
                  <td className="p-4">Building up</td>
                  <td className="p-4">Belongingness</td>
                </tr>

                <tr className="hover:bg-[#3B7597]/20 transition">
                  <td className="p-4 font-bold text-[#6FD1D7]">Equipping</td>
                  <td className="p-4">Growing disciples</td>
                  <td className="p-4">Maturing in Christ</td>
                  <td className="p-4">Higher knowledge</td>
                  <td className="p-4">Christ-like character</td>
                </tr>

                <tr className="hover:bg-[#3B7597]/20 transition">
                  <td className="p-4 font-bold text-[#6FD1D7]">Deploying</td>
                  <td className="p-4">Committed disciples</td>
                  <td className="p-4">Ministering in Christ</td>
                  <td className="p-4">Using gifts</td>
                  <td className="p-4">Committed leaders</td>
                </tr>

                <tr className="hover:bg-[#3B7597]/20 transition">
                  <td className="p-4 font-bold text-[#6FD1D7]">Sending</td>
                  <td className="p-4">Disciplemakers</td>
                  <td className="p-4">Going for Christ</td>
                  <td className="p-4">Fruitbearing</td>
                  <td className="p-4">Fruitfulness</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </SectionContainer>
      {/* Growth Principles */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Growth Principle"
            title="Principles That Drive Growth"
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {growthPrinciples.map((principle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-dark rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-7 h-7 rounded-lg bg-aqua/20 border border-aqua/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-aqua font-mono font-bold text-[10px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {principle}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Growth Philosophy */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Growth Philosophy"
              title="How We Think About Growth"
              center={false}
            />
            <p className="text-steel/80 leading-relaxed mb-5">
              Spiritual growth produces numerical growth that results in
              geographical growth
            </p>
            <div className="mt-6">
              <div
                className="relative rounded-2xl overflow-hidden
                bg-[#093C5D]/40 backdrop-blur-xl
                border border-[#3B7597]/30
                shadow-lg hover:shadow-2xl
                transition-all duration-300"
              >
                <img
                  src={growthPhilo}
                  alt="Growth Philosophy"
                  className="w-full h-auto object-contain"
                />

                {/* overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#093C5D]/60 via-transparent to-transparent" />

                {/* optional label */}
                <div className="absolute bottom-4 left-4 text-[#F5F5F5]">
                  <h3 className="text-sm font-semibold">Growth Philosophy</h3>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: <SeedIcon size={20} color="#093C5D" />,
                label: "Spiritual growth",
              },
              {
                icon: <LightIcon size={20} color="#093C5D" />,
                label: "Numerical growth",
              },
              {
                icon: <StarIcon size={20} color="#093C5D" />,
                label: "Geographical growth",
              },
            ].map((item, i) => (
              <Card
                key={i}
                delay={i * 0.1}
                className="text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <p className="text-navy font-semibold text-sm">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
