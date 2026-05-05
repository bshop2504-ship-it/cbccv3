import React, { useState } from "react";
import { motion } from "framer-motion";
import { SectionContainer, SectionHeader, Card } from "../components/UI.jsx";
import { MailIcon, LocationIcon, PhoneIcon } from "../assets/svg/Icons.jsx";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            Get in Touch
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Contact Us
          </h1>
        </motion.div>
      </section>

      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <SectionHeader
              eyebrow="Reach Us"
              title="Contact Information"
              center={false}
            />
            {[
              {
                icon: <LocationIcon size={20} color="#3B7597" />,
                label: "Address",
                value: "Anao, Cabagan, Isabela, Philippines",
              },
              {
                icon: <PhoneIcon size={20} color="#3B7597" />,
                label: "Phone",
                value: "TBA",
              },
              {
                icon: <MailIcon size={20} color="#3B7597" />,
                label: "Email",
                value: "bshop2504@gmail.com",
              },
            ].map((item, i) => (
              <Card key={i} delay={i * 0.1} hover={false}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy/10 border border-navy/15 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-navy/50 text-xs font-mono tracking-wider uppercase mb-1">
                      {item.label}
                    </p>
                    <p className="text-navy font-medium text-sm leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            <Card hover={false}>
              <h4 className="font-semibold text-navy mb-3">Service Schedule</h4>
              <div className="flex flex-col gap-2">
                {[
                  ["Sunday Worship", "9:00 AM & 11:00 AM"],
                  ["Wednesday Prayer", "7:00 PM"],
                  ["Friday Youth", "6:30 PM"],
                ].map(([name, time], i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-navy/8 last:border-0"
                  >
                    <span className="text-steel/70 text-sm">{name}</span>
                    <span className="text-navy font-mono text-xs font-semibold">
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="glass-card rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-aqua/20 border border-aqua/30 flex items-center justify-center mx-auto mb-6">
                  <MailIcon size={28} color="#6FD1D7" />
                </div>
                <h3 className="font-display font-bold text-navy text-2xl mb-3">
                  Message Sent!
                </h3>
                <p className="text-steel/70 mb-6">
                  Thank you for reaching out. We'll get back to you within 1–2
                  business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-xl bg-navy text-white font-medium hover:bg-steel transition-colors text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-8">
                <h3 className="font-display font-bold text-navy text-2xl mb-6">
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-navy/60 text-xs font-semibold uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-navy/5 border border-navy/15 rounded-xl text-navy placeholder-navy/30 focus:outline-none focus:border-steel transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-navy/60 text-xs font-semibold uppercase tracking-wider mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-navy/5 border border-navy/15 rounded-xl text-navy placeholder-navy/30 focus:outline-none focus:border-steel transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy/60 text-xs font-semibold uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="What's on your heart?"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-navy/5 border border-navy/15 rounded-xl text-navy placeholder-navy/30 focus:outline-none focus:border-steel transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-navy/60 text-xs font-semibold uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      placeholder="Share your thoughts, questions, or prayer requests..."
                      rows={6}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-navy/5 border border-navy/15 rounded-xl text-navy placeholder-navy/30 focus:outline-none focus:border-steel transition-all text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-navy text-white font-semibold hover:bg-steel transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </SectionContainer>
    </>
  );
}
