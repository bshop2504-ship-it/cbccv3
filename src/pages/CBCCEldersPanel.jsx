import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminPanel from "../components/admin/AdminPanel.jsx";
import ActivitiesPanel from "../components/admin/ActivitiesPanel.jsx";
import DevotionPanel from "../components/admin/DevotionPanel.jsx";
import LivePanel from "../components/admin/LivePanel.jsx";
import ServicePanel from "../components/admin/ServicePanel.jsx";
import { Icon } from "../assets/svg/Icon.jsx";
import { StatCard } from "../components/UI.jsx";
import LogoutModal from "../components/LogoutModal.jsx";
import { fetchCurrentUser } from "../api/currentUser.js";
import cbcclogo from "../assets/images/cbcclogo.webp";
// ─── GLOBAL STYLES ─────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { font-family: 'DM Sans', system-ui, sans-serif; overflow: hidden; }

  @keyframes liveDot { 0%,100%{opacity:1} 50%{opacity:0.3} }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(6, 8, 9, 0.15); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(9,60,93,0.3); }

  table tr:last-child td { border-bottom: none; }
  button { font-family: 'DM Sans', sans-serif; }
  input, textarea, select { font-family: 'DM Sans', sans-serif; }
  textarea { resize: vertical; min-height: 80px; }
  a { color: inherit; }
`;

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export default function CBCCEldersPanel() {
  const [activePanel, setActivePanel] = useState("devotion");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [devotions, setDevotions] = useState([]);
  const [services, setServices] = useState([]);
  const [live, setLive] = useState([]);
  const [activities, setActivities] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const isSuperAdmin = currentUser?.role === "Super Admin";
  const stats = [
    {
      label: "Devotions",
      value: devotions.length,
      icon: <Icon.Book />,
      color: "#6FD1D7",
    },
    {
      label: "Services",
      value: services.length,
      icon: <Icon.Calendar />,
      color: "#3B7597",
    },
    {
      label: "Live Streams",
      value: live.length,
      icon: <Icon.Radio />,
      color: "#E53E3E",
    },
    {
      label: "Activities",
      value: activities.length,
      icon: <Icon.Camera />,
      color: "#093C5D",
    },
    {
      label: "Admins",
      value: admins.length,
      icon: <Icon.Users />,
      color: "#3B7597",
    },
  ];
  const NAV = [
    {
      id: "devotion",
      label: "Daily Devotion",
      icon: <Icon.Book />,
      color: "#6FD1D7",
    },
    {
      id: "services",
      label: "Weekly Services",
      icon: <Icon.Calendar />,
      color: "#3B7597",
    },
    {
      id: "live",
      label: "Live Service",
      icon: <Icon.Radio />,
      color: "#E53E3E",
    },
    {
      id: "activities",
      label: "Recent Activities",
      icon: <Icon.Camera />,
      color: "#093C5D",
    },

    ...(isSuperAdmin
      ? [
          {
            id: "admins",
            label: "Admin Users",
            icon: <Icon.Users />,
            color: "#3B7597",
          },
        ]
      : []),
  ];

  const activeNav = NAV.find((n) => n.id === activePanel);
  // =====================
  // LOAD CURRENT USER
  // =====================
  useEffect(() => {
    const loadMe = async () => {
      const user = await fetchCurrentUser();
      setCurrentUser(user);
    };

    loadMe();
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "#F0F4F8",
          overflow: "hidden",
        }}
      >
        {/* ── Sidebar ── */}
        <motion.aside
          initial={{ x: -240 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          style={{
            width: sidebarOpen ? 240 : 64,
            flexShrink: 0,
            background: "#093C5D",

            display: "flex",
            flexDirection: "column",

            transition: "width 0.3s ease",

            height: "100dvh",
            overflowY: "auto",
            overflowX: "hidden",

            zIndex: 20,
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: "20px 18px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(111,209,215,0.2)",
                border: "1px solid rgba(111,209,215,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6FD1D7",
                flexShrink: 0,
              }}
            >
              <img
                src={cbcclogo}
                alt="CBCC Logo"
                width="40"
                height="40"
                className="rounded-full object-cover"
              />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  CBCC Elders
                </p>
                <p
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: "rgba(111,209,215,0.6)",
                    textTransform: "uppercase",
                    marginTop: 3,
                  }}
                >
                  Control Panel
                </p>
              </motion.div>
            )}
          </div>

          {/* Nav */}
          <nav
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",

              padding: "14px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {NAV.map((item) => {
              const active = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  title={!sidebarOpen ? item.label : ""}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: sidebarOpen ? "10px 14px" : "10px",
                    borderRadius: 11,
                    border: "none",
                    cursor: "pointer",
                    background: active
                      ? "rgba(111,209,215,0.12)"
                      : "transparent",
                    color: active ? "#6FD1D7" : "rgba(255,255,255,0.45)",
                    transition: "all 0.2s",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    outline: active
                      ? "1px solid rgba(111,209,215,0.2)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                    }
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  {sidebarOpen && (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                  {sidebarOpen && active && (
                    <span
                      style={{
                        marginLeft: "auto",
                        color: "rgba(111,209,215,0.5)",
                      }}
                    >
                      <Icon.ChevronRight />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Collapse toggle + Logout */}

          <div
            style={{
              padding: "12px 10px",
              borderTop: "1px solid rgba(255,255,255,0.08)",

              display: "flex",
              flexDirection: "column",
              gap: 6,

              flexShrink: 0,
              background: "#093C5D",

              position: "sticky",
              bottom: 0,
            }}
          >
            {/* LOGOUT */}
            <button
              onClick={() => setLogoutOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                gap: sidebarOpen ? 10 : 0,
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#E53E3E",
                color: "#fff",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <Icon.Logout />

              {sidebarOpen && (
                <span style={{ fontSize: 12, fontWeight: 600 }}>Logout</span>
              )}
            </button>
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarOpen ? "flex-start" : "center",

                width: "100%",
                minHeight: 44,

                gap: sidebarOpen ? 10 : 0,
                padding: "10px 14px",

                borderRadius: 10,
                border: "none",

                background: "rgba(255,255,255,0.08)",
                color: "#fff",

                cursor: "pointer",
                transition: "all 0.2s",

                flexShrink: 0,
              }}
            >
              <Icon.Menu />

              {sidebarOpen && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#fff",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  Collapse
                </span>
              )}
            </button>
          </div>
        </motion.aside>

        {/* ── Main ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              height: 60,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(9,60,93,0.08)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            ></div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #093C5D, #3B7597)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6FD1D7",
                  fontFamily: "DM Mono, monospace",
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                CBCC
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {/* Stats row — show always */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              }}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                ></motion.div>
              ))}
            </div>

            {/* Panel content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {activePanel === "devotion" && (
                  <DevotionPanel data={devotions} setData={setDevotions} />
                )}
                {activePanel === "services" && (
                  <ServicePanel data={services} setData={setServices} />
                )}
                {activePanel === "live" && (
                  <LivePanel data={live} setData={setLive} />
                )}
                {activePanel === "activities" && (
                  <ActivitiesPanel data={activities} setData={setActivities} />
                )}
                {activePanel === "admins" && isSuperAdmin && (
                  <AdminPanel data={admins} setData={setAdmins} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      </div>
    </>
  );
}
