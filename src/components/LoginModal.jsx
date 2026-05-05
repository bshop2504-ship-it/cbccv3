import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon, UserIcon, LockIcon, EyeIcon, EyeOffIcon, CrossIcon } from '../assets/svg/Icons.jsx'

export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const success = onLogin(email, password)
    if (!success) setError('Invalid credentials. Try admin@cbcc.org / admin123')
    setLoading(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-navy/60 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/60">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy/10 border border-navy/20 flex items-center justify-center">
                  <CrossIcon size={18} color="#093C5D" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-navy text-xl">Welcome Back</h2>
                  <p className="text-steel/60 text-xs">CBCC Admin Access</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-navy/5 hover:bg-navy/10 flex items-center justify-center transition-colors"
              >
                <XIcon size={18} color="#093C5D" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="relative">
                <label className="block text-navy/60 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <UserIcon size={16} color="#3B7597" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@cbcc.org"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-navy/5 border border-navy/15 rounded-xl text-navy placeholder-navy/30 focus:outline-none focus:border-steel focus:bg-white/80 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-navy/60 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <LockIcon size={16} color="#3B7597" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-navy/5 border border-navy/15 rounded-xl text-navy placeholder-navy/30 focus:outline-none focus:border-steel focus:bg-white/80 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-navy text-white font-semibold text-sm hover:bg-steel transition-all duration-300 disabled:opacity-60 relative overflow-hidden group"
              >
                <span className={loading ? 'opacity-0' : 'opacity-100'}>Sign In to Dashboard</span>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </button>
            </form>

            <p className="text-center text-navy/30 text-xs mt-6">
              Restricted access — authorized personnel only
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
