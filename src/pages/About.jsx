import React from "react";
import { motion } from "framer-motion";
import {
  SectionContainer,
  SectionHeader,
  Card,
  Divider,
} from "../components/UI.jsx";
import Timeline from "../components/Timeline.jsx";
import { CrossIcon, BookIcon, PeopleIcon } from "../assets/svg/Icons.jsx";
import AffiliatePhoto from "../assets/images/affiliationPhoto.webp";
const historyEvents = [
  {
    year: "Before 1992",
    title: "Mission to the Ibanag Begins",
    description:
      "The Ibanag people group had no indigenous church. Pastor Jimmy and Vita Guingab answered the call to reach them, supported by their family, believers from their previous ministry, and missionaries from Baptist General Conference (Steve Abelman) and The Evangelical Alliance Mission (Rev. Paul and Dee Zellmer).",
  },
  {
    year: "September 21, 1992",
    title: "First Baptism and Church Foundation",
    description:
      "The first baptism, covenant signing, and worship service were held, marking the official beginning of CBCC’s growing ministry",
  },
];

export default function About() {
  return (
    <>
      {/* Page Hero */}
      <section className="hero-gradient pt-32 pb-20 px-4 sm:px-6 lg:px-12 xl:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-mono font-semibold tracking-[0.2em] uppercase mb-5 px-4 py-1.5 rounded-full border text-aqua border-aqua/30 bg-aqua/10">
            Our Story
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            About CBCC
          </h1>
        </motion.div>
      </section>

      {/* Rationale */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeader
              eyebrow="Rationale"
              title="Why We Exist"
              center={false}
            />
            <p className="text-steel/80 leading-relaxed mb-5 text-justify">
              The Cabagan Community Church (CBCC) exists to change the Ibanag
              ethnic group from being classified as an “unreached people group”
              to being a “reached people group” by seeing strong churches
              planted throughout their regions, churches which are able to reach
              out and minister themselves. Moreover, CBCC envisioned to see both
              the Ibanags and the other people in their regions evangelized.
              Thus, the Cabagan Bible Community Church (CBCC) exists.
            </p>
            <p className="text-steel/70 leading-relaxed mb-5 text-justify">
              The “Ibanag region” is any place where there is an Ibanag. What
              does this mean? This means, if you are an Ibanag, wherever you go,
              if there’s an Ibanag there that makes that an “Ibanag region” and
              we, as a church, want to reach out there. So, our church has a
              vision to reach out to the Filipino people in various provinces of
              the Philippines specifically in the Cagayan Valley Region (Isabela
              and Cagayan) and beyond (other countries) wherever we find
              ourselves. But, of course, our emphasis is where there are
              concentrations of Ibanags.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "34", label: "Years of Ministry" },
              { num: "50+", label: "Affiliated Churches" },
            ].map((stat, i) => (
              <Card key={i} delay={i * 0.1} className="text-center">
                <p className="font-display font-black text-navy text-3xl">
                  {stat.num}
                </p>
                <p className="text-steel/60 text-sm mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* History Timeline */}
      <SectionContainer>
        <SectionHeader
          eyebrow="Brief History"
          title="Our Journey Through Time"
          subtitle="From 12 founding believers to a movement spanning decades — a story of faithfulness and grace."
        />
        <Timeline events={historyEvents} />
      </SectionContainer>

      {/* Vision */}
      <section className="hero-gradient py-24 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* TOP: 3 CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-dark rounded-3xl p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-aqua/20 border border-aqua/30 flex items-center justify-center mb-5">
                <CrossIcon size={24} color="#6FD1D7" />
              </div>

              <span className="text-aqua text-xs font-mono uppercase tracking-widest">
                Vision
              </span>

              <h3 className="font-display text-white text-2xl font-bold mt-2 mb-4">
                Where We're Going
              </h3>

              <p className="text-white/70 leading-relaxed text-sm">
                Reaching out the Ibanags and beyond.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-dark rounded-3xl p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-aqua/20 border border-aqua/30 flex items-center justify-center mb-5">
                <PeopleIcon size={24} color="#6FD1D7" />
              </div>

              <span className="text-aqua text-xs font-mono uppercase tracking-widest">
                Mission
              </span>

              <h3 className="font-display text-white text-2xl font-bold mt-2 mb-4">
                Our Purpose
              </h3>

              <ul className="text-white/70 space-y-2 text-sm">
                <li>• We exist to Worship</li>
                <li>• We exist to Instruct</li>
                <li>• We exist to Fellowship</li>
                <li>• We exist to Evangelize</li>
                <li>• We exist to Serve</li>
              </ul>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-dark rounded-3xl p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-aqua/20 border border-aqua/30 flex items-center justify-center mb-5">
                <BookIcon size={24} color="#6FD1D7" />
              </div>

              <span className="text-aqua text-xs font-mono uppercase tracking-widest">
                Mission Focus
              </span>

              <h3 className="font-display text-white text-2xl font-bold mt-2 mb-4">
                What We Commit To
              </h3>

              <ul className="text-white/70 space-y-2 text-sm">
                <li>• To make disciples of all nations</li>
                <li>• To provide services of worship and fellowship</li>
                <li>• To train in the Bible and Theology</li>
                <li>• To initiate and maintain ministries of social concern</li>
                <li>
                  • To do all things in the name of and for the honor and glory
                  of God, King of kings, Lord of lords and Savior Jesus Christ
                </li>
              </ul>
            </motion.div>
          </div>

          {/* BOTTOM: FEATURED FULL MISSION */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-3xl p-10 md:p-14"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-aqua/20 border border-aqua/30 flex items-center justify-center">
                  <BookIcon size={26} color="#6FD1D7" />
                </div>
              </div>

              <span className="text-aqua text-xs font-mono uppercase tracking-widest">
                CBCC Full Mission Statement
              </span>

              <h2 className="text-white text-3xl md:text-4xl font-bold mt-3 mb-6 font-display">
                Our Calling and Commitment
              </h2>

              <p className="text-white/70 leading-relaxed text-base md:text-lg">
                The main purpose of any Christian is to give glory to God. To do
                this, CBCC has set its main mission as making disciples of all
                nations. This is not done on the organizational level, however.
                It is done individually by church members. Therefore, to support
                and enable the members to accomplish the mission of the church,
                it provides worship and fellowship for both members and
                potential members so that people feel a part of a group.
              </p>

              <p className="text-white/60 leading-relaxed mt-4">
                It trains members so that they know and can explain God’s
                message to the world, and it assists in meeting the physical and
                emotional needs of the members and the community in order to
                free the members from concerns that may prevent them from
                accomplishing their mission and to show that the church really
                cares for the ones they are trying to reach.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Affiliations */}
      <SectionContainer>
        <SectionHeader
          eyebrow="Affiliations"
          title="History of Relationship"
          subtitle="CBCC is part of a broader family of churches committed to the same vision and mission."
        />

        <div className="max-w-5xl mx-auto">
          <Card delay={0.1}>
            <div className="space-y-6 text-sm leading-relaxed text-steel/70">
              {/* Development */}
              <p className="text-justify">
                The Southern Methodist Foreign Missions (SMFM), the Baptist
                General Conference (BGC), and The Evangelical Alliance Missions
                (TEAM) have been God’s powerful instruments in the birth of the
                Cabagan Bible Community Church (CBCC) in 1992. For more than a
                decade now, however, it is the Southern Methodist Foreign
                Missions that has been directly and actively involved in many
                aspects of CBCC's ministries through the presence of its
                missionaries and their work in the area. This is because TEAM
                has left the area, having been led to another mission field in
                the Philippines, while BGC, for some reason, has focused its
                efforts on other areas, especially in urban places in Luzon.
                During that period, the SMFM missionaries deployed in Cabagan,
                Isabela, played a major role in the growth of CBCC by working
                alongside and supporting Pastor Jimmy Guingab, the national
                pastor who led CBCC into a fruitful and powerful ministry. As
                the relationship between SMFM and CBCC grew closer, more
                dynamic, and meaningful, the Lord, by His grace and sovereignty,
                led SMFM to commission Pastor Jimmy Guingab as a missionary in
                the Philippine field. Furthermore, an agreement was forged
                between CBCC (or Pastor Jimmy Guingab) and SMFM that, in light
                of the work in which the Lord had previously led Southern
                Methodist missionaries, the following objectives be pursued by
                the Southern Methodist Missions— Philippine Field:
                <ol>
                  <li>1. To evangelize the Ibanags and other peoples</li>
                  <li>
                    2. To plant churches throughout the Ibanag region,
                    especially in the outlying areas
                  </li>
                  <li>
                    3. To identify, recruit, and train church leaders from among
                    the Ibanags and other peoples
                  </li>
                  <li>
                    4. To translate the Bible and other study materials into the
                    Ibanag language.
                  </li>
                </ol>
                Currently, this work is being done in concert with the CBCC
                churches and Christians in the area, with the long-term goal of
                SMFM relinquishing the entire ministry to the hands of nationals
                in the future. As the Lord leads into new areas, it is
                envisioned that this mission statement or agreement between CBCC
                and SMFM be reviewed and revised. To sum up, the working
                relationship between SMFM and CBCC in the past, Pastor Jimmy
                Guingab’s relationship with the Southern Methodist churches, and
                the current agreement regarding the mission of SMFM in the area
                demonstrate a close tie between CBCC and SMFM. It is hoped that
                this working relationship will be enhanced and strengthened, and
                that this close tie will be preserved by the Lord in the coming
                years.
              </p>
            </div>
            <img
              src={AffiliatePhoto}
              alt="Core Values"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </Card>
        </div>
      </SectionContainer>
    </>
  );
}
