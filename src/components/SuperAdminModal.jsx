import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, CrossIcon } from "../assets/svg/Icons.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function SuperAdminModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGotoAdminPanel = async () => {
    setLoading(true);
    try {
      navigate("/cbccadmin");
      onClose?.();
    } catch (err) {
      console.error("Redirect error:", err);
    } finally {
      setLoading(false);
      onClose?.();
    }
  };
  const handleGotoElderPanel = async () => {
    setLoading(true);
    try {
      navigate("/cbccelders");
      onClose?.();
    } catch (err) {
      console.error("Redirect error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      onClose?.();
      await supabase.auth.signOut();
      console.log("success logout");
    } catch (err) {
      console.error("Redirect error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-navy/60 backdrop-blur-md"
            onClick={handleLogout}
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
                      Super Admin Access
                    </h2>
                    <p className="text-steel/60 text-xs">
                      You are about to go to
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-xl bg-navy/5 hover:bg-navy/10 flex items-center justify-center"
                >
                  <XIcon size={18} color="#093C5D" />
                </button>
              </div>

              {/* Message */}
              <p className="text-sm text-navy/70 mb-6">
                Select Panel to redirect
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleGotoAdminPanel}
                  className="flex-1 py-3 rounded-xl bg-navy/10 text-navy font-semibold"
                >
                  {loading ? "Redirecting..." : "Admin Panel"}
                </button>

                <button
                  onClick={handleGotoElderPanel}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-navy/10 text-navy font-semibold"
                >
                  {loading ? "Redirecting..." : "Elders Panel"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
