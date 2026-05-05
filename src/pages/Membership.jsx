import React from "react";
import { motion } from "framer-motion";
import {
  SectionContainer,
  SectionHeader,
  Card,
  DarkCard,
} from "../components/UI.jsx";
import {
  CrossIcon,
  HeartIcon,
  ShieldIcon,
  StarIcon,
  BookIcon,
  PeopleIcon,
} from "../assets/svg/Icons.jsx";

const membershipSteps = [
  {
    num: "01",
    title: "Attend Membership Class",
    desc: "A 4-week orientation covering CBCC's history, beliefs, vision, and expectations of membership.",
  },
  {
    num: "02",
    title: "Personal Interview",
    desc: "A meeting with an elder or pastor to discuss your faith journey, spiritual life, and commitment.",
  },
  {
    num: "03",
    title: "Sign the Covenant",
    desc: "A formal commitment to the CBCC community — its vision, relationships, and responsibilities.",
  },
  {
    num: "04",
    title: "Public Welcome",
    desc: "The congregation formally receives you as a member in a Sunday celebration service.",
  },
];

const covenantPoints = [
  "I will faithfully gather with the church for worship, teaching, and fellowship.",
  "I will give generously and systematically of my finances for the work of God.",
  "I will pursue intentional discipleship relationships within the body.",
  "I will use my spiritual gifts in active ministry within and through the church.",
  "I will submit to biblical leadership and welcome godly accountability.",
  "I will guard the unity and peace of the church, resolving conflicts biblically.",
  "I will pray regularly for the church, its leaders, and its mission.",
  "I will make disciples and support the church's mission to the nations.",
];

export default function Membership() {
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
            Join Us
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Membership
          </h1>
        </motion.div>
      </section>

      {/* What is Membership */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Membership"
              title="Requirements for Membership"
              center={false}
            />
          </motion.div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: <PeopleIcon size={20} color="#093C5D" />,
                label: "Salvation",
              },
              {
                icon: <ShieldIcon size={20} color="#093C5D" />,
                label: "Finish Four Steps Membership Class",
              },
              {
                icon: <HeartIcon size={20} color="#093C5D" />,
                label: "Accept CBCC Statement of Faith",
              },
              {
                icon: <StarIcon size={20} color="#093C5D" />,
                label: "Follow Jesus through Baptism by Immersion",
              },
              {
                icon: <BookIcon size={20} color="#093C5D" />,
                label: "Sign Church Covenant",
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

      {/* CHURCH COVENANT */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeader eyebrow="Covenant" title="Church Covenant" light />

          <div className="mt-8 space-y-4 text-light/90 leading-relaxed text-base sm:text-lg">
            <p>
              Having been led by the Holy Spirit to accept Christ as my Saviour
              and to confess my faith in Him as Lord through baptism by
              immersion, I now enter this covenant together with my Christian
              brethren as one body in Christ.
            </p>
            <p>
              Megafu ta pangirollu na Espiritu Santo, ay inalawa ku’ si
              Jesu-Cristo tu Gumannavvu’ ku’, ay nakibawtiso nga’ tu melammag tu
              pangilammuyag ku’ ta pangurug ku’ Sa tu Yayya i Yafu’, azzaw
              alawatak-ku’ yaw nga pakkasinabban konsu i wawwaragi’ ira ta kani
              Cristo nga ariga tadday nga baggi kani Cristo.
            </p>
            <p>
              I will live a life in Christian love with the Spirit enabling; I
              will strive for the growth of this church in knowledge, in
              holiness, and in the increase of its membership. I will be
              faithful in all the spiritual activities of this church such as
              its worship, the ordinances, discipline, and teachings.
            </p>
            <p>
              Ta pakapangngua na Espiritu, mattolay nga’ ta nakristianowan nga
              aya. Karagatak-ku’ i paddakal naw nga iglesia ta pakannammu ta
              pamakasanto, anna ta pakkaru na miembro na. Mapasikkal nga’ ta
              nespirituan nga kukukuan naw nga iglesia, tu kagitta na paddayaw,
              panuttul ta dua nga ordinansa, paddisiplina, anna tuddu ira.
            </p>
            <p>
              I promise to be faithful as a steward in the things entrusted to
              me by the Lord. I will give freely of my wealth, my strength, and
              my time in order to assist in areas of service, of financing the
              work of God, for the spreading of the Gospel to other places.
            </p>
            <p>
              Itabba’ tu mapasikkal nga’ manangngaw ta gannug ira tu
              nipatangngaw na Yafu niakan. Mabboluntario nga’ mangiyawa ta
              kukua’ ira, ta sikak-ku’, anna oras ku’ tapenu makkaduffun ta
              passerbi, ta trabahu na Dios nga mawag i kuartu, anna ta
              kewara-wara’ na Evanghelio ta karuan tu luga-lugar ira.
            </p>
            <p>
              I promise to study regularly the Word of God and to pray both
              individually and as a family. I promise to rear my children in the
              knowledge and fear of God so that they may obtain eternal life
            </p>
            <p>
              Itabba’ tu kanayun nga didiamuk-ku’ i Uvovug na Dios anna maddasal
              nga’ magitetadday anna maddasal nga’ konsu i familia’. Itabba’ tu
              padakalak-ku i ana ku’ ira ta pakanammu anna ta paginassing ta
              Dios tapenu mala’ da i inango nga mangngangangay nga egga kani
              Cristo.
            </p>
            <p>
              I promise to live my life for Christ, honourable in all activities
              (in all things), and exemplary in word and deed. I will avoid any
              activity or desire that will bring shame to the name of Christ. My
              sincere desire and purpose is to know and to do the will of God
              daily in my life with the purpose of honouring my Lord and
              Saviour.
            </p>
            <p>
              Itabba’ tu usak-ku’ i pattole’ kani Cristo, mekakua ta ngamin nga
              gannug anna kapianan ta paguvovug anna pangnga-pangngua. Ibita’ i
              anni laman nga trabahu onu karagatan tu mangipasiran ta ngagan ni
              Cristo. I kuruga karagatak-ku’ anna gakkag ku’ ay tu kannamuak-ku’
              anna kuak-ku’ i uray na Dios kada aggaw ta pattole’ tu i gakkag ay
              i pangikakua ta Yafu’ anna Gumannavvu’.
            </p>
            <p>
              I promise to love my Christian brothers, to pray for them, and to
              help them during sickness and hardship. I will help maintain unity
              in our Christian fellowship. I will not be quick to anger, but
              rather I will be ready to be reconciled according to the command
              of the Lord Jesus.
            </p>
            <p>
              Itabba’ tu ayatak-ku’ i wawwaragi’ kani Cristo, tu idasal ku’ ira,
              anna duffunak-ku’ ira ta pattaki anna ta pazziga-riga da. Manuffun
              nga’ mammintini ta kapakatadday na fuddu’ na Cristiano. Ariak-ku’
              iraga i mappatu, ngem siggaparan nga’ makipammapia segun ta mandu
              na Yafu nga Jesus.
            </p>
            <p>
              I promise that when I move to another place, I will join another
              local church where I will be able to fulfill the spirit of this
              covenant and the principles of the Word of God.
            </p>
            <p>
              Itabba’ nu magali nga’ ta tanakuan nga lugar, ay medappil nga’ ta
              iglesia tatun nga lugar nga awayya’ parulattan i ikaya’ naw nga
              pakkasinabban anna tuddu na Uvovug na Dios.
            </p>
          </div>
        </div>
      </section>

      {/* CBCC Anthem */}
      <section className="hero-gradient py-24 px-4 sm:px-6 lg:px-12 xl:px-20 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(111,209,215,0.5) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <CrossIcon size={32} color="#6FD1D7" className="mx-auto mb-6" />
            <span className="inline-block text-xs font-mono font-semibold tracking-[0.2em] uppercase mb-6 px-4 py-1.5 rounded-full border text-aqua border-aqua/30 bg-aqua/10">
              CBCC Anthem
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-10">
              The CBCC Anthem
            </h2>

            <div className="glass-dark rounded-3xl p-8 sm:p-12 text-center">
              {[
                {
                  lines: [
                    "O God of grace, who called our name,",
                    "In Cabagan You planted truth;",
                    "Your Word our light, Your cross our hope,",
                    "Our life transformed, by faith alone.",
                  ],
                },
                {
                  lines: [
                    "You formed us one in Jesus Christ,",
                    "Redeemed by blood, made heirs by grace;",
                    "In love we stand, in truth we serve,",
                    "Proclaiming Christ in every place.",
                  ],
                },
                {
                  lines: [
                    "We are Your church, Your living stone,",
                    "Built on Christ, our foundation;",
                    "Cabagan Bible Community Church,",
                    "Held secure in Your mighty hand.",
                  ],
                },
                {
                  lines: [
                    "Send us forth to teach, to love,",
                    "To reach the lost with gospel light;",
                    "In word and deed, in faith and hope,",
                    "We shine for Christ both day and night",
                  ],
                },
                {
                  lines: [
                    "Until the day our Lord returns,",
                    "We persevere by faith and grace;",
                    "With joyful hearts and steadfast hope,",
                    "We run the race, we finish strong.",
                  ],
                },
                {
                  lines: [
                    "We are Your church, Your living stone,",
                    "Built on Christ, our foundation;",
                    "Cabagan Bible Community Church,",
                    "Held secure in Your mighty hand.",
                  ],
                },
              ].map((section, i) => (
                <div
                  key={i}
                  className={`mb-8 last:mb-0 ${section.label === "Chorus" ? "border-l-2 border-aqua/40 pl-6" : ""}`}
                >
                  {section.lines.map((line, j) => (
                    <p
                      key={j}
                      className="text-white/80 font-display text-base sm:text-lg leading-relaxed italic"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
