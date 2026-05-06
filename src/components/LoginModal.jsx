import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  XIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CrossIcon,
} from "../assets/svg/Icons.jsx";

import { loginAccount } from "../api/auth.js";
import { supabase } from "../lib/supabaseClient";
export default function LoginModal({ onClose, onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAccount(email, password);

      console.log("LOGIN RESULT:", result);

      if (!result.success) {
        throw new Error(result.error);
      }

      // DEBUG SESSION
      const { data } = await supabase.auth.getSession();
      console.log("SESSION AFTER LOGIN:", data.session);

      if (!data.session) {
        throw new Error("No session found");
      }
      onLogin?.(result.user, data.session);
      onClose?.();
      navigate("/cbccadmin");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/60">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy/10 border border-navy/20 flex items-center justify-center">
                  <CrossIcon size={18} color="#093C5D" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-navy text-xl">
                    Welcome Back
                  </h2>
                  <p className="text-steel/60 text-xs">CBCC Admin Access</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-navy/5 hover:bg-navy/10 flex items-center justify-center"
              >
                <XIcon size={18} color="#093C5D" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <label className="block text-navy/60 text-xs font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <UserIcon size={16} color="#3B7597" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-navy/5 border border-navy/15 rounded-xl"
                    placeholder="admin@cbcc.org"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-navy/60 text-xs font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <LockIcon size={16} color="#3B7597" />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-navy/5 border border-navy/15 rounded-xl"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={16} />
                    ) : (
                      <EyeIcon size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-xs bg-red-50 px-4 py-2 rounded-xl">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-navy text-white font-semibold"
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>

            <p className="text-center text-navy/30 text-xs mt-6">
              Restricted access — authorized personnel only
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
