import React from 'react'
import { motion } from 'framer-motion'

export default function Timeline({ events }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-aqua/60 via-steel/40 to-transparent -translate-x-1/2" />

      <div className="flex flex-col gap-12">
        {events.map((event, i) => {
          const isLeft = i % 2 === 0
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`relative flex items-center gap-8 ${
                isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
              } flex-row`}
            >
              {/* Content */}
              <div className={`flex-1 ml-16 sm:ml-0 ${isLeft ? 'sm:text-right' : 'sm:text-left'}`}>
                <div className={`glass-card rounded-2xl p-6 inline-block max-w-sm w-full ${isLeft ? 'sm:ml-auto' : ''}`}>
                  <span className="text-xs font-mono font-bold text-aqua tracking-widest block mb-2">
                    {event.year}
                  </span>
                  <h3 className="font-display font-bold text-navy text-lg mb-2">{event.title}</h3>
                  <p className="text-steel/70 text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>

              {/* Dot */}
              <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-aqua border-4 border-white shadow-lg shadow-aqua/30" />
              </div>

              {/* Spacer for opposite side */}
              <div className="hidden sm:block flex-1" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
