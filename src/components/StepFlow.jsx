import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRightIcon } from '../assets/svg/Icons.jsx'

export default function StepFlow({ steps, dark = false }) {
  return (
    <div className="relative">
      {/* Desktop horizontal flow */}
      <div className="hidden lg:flex items-stretch gap-0">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="flex-1 relative group"
            >
              <div className={`h-full rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 ${
                dark
                  ? 'glass-dark hover:bg-aqua/10 border-aqua/20 hover:border-aqua/40'
                  : 'glass-card hover:shadow-xl hover:shadow-navy/10'
              }`}>
                {/* Step Number */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono ${
                  dark
                    ? 'bg-aqua/20 text-aqua border border-aqua/30'
                    : 'bg-navy text-white'
                }`}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                {step.icon && (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    dark ? 'bg-white/5' : 'bg-navy/5'
                  }`}>
                    {step.icon}
                  </div>
                )}

                <div>
                  <h3 className={`font-display font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-navy'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-white/50' : 'text-steel/70'}`}>
                    {step.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                {i < steps.length - 1 && (
                  <div className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                    dark ? 'bg-navy border border-aqua/30' : 'bg-white border border-steel/20 shadow-md'
                  }`}>
                    <ChevronRightIcon size={14} color={dark ? '#6FD1D7' : '#3B7597'} />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Spacer for arrow */}
            {i < steps.length - 1 && <div className="w-6" />}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile vertical flow */}
      <div className="flex lg:hidden flex-col gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative"
          >
            <div className={`rounded-2xl p-5 flex gap-4 ${
              dark ? 'glass-dark' : 'glass-card'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono shrink-0 ${
                dark ? 'bg-aqua/20 text-aqua border border-aqua/30' : 'bg-navy text-white'
              }`}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className={`font-display font-bold text-base mb-1 ${dark ? 'text-white' : 'text-navy'}`}>
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-white/50' : 'text-steel/70'}`}>
                  {step.description}
                </p>
              </div>
            </div>

            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <div className={`w-px h-4 ${dark ? 'bg-aqua/30' : 'bg-steel/20'}`} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
