import React, { useState, lazy, Suspense, createContext } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import LoginModal from "./components/LoginModal.jsx";
import SuperAdminModal from "./components/SuperAdminModal.jsx";
import SkeletonCard from "./components/SkeletonCard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Ministry = lazy(() => import("./pages/Ministry.jsx"));
const Discipleship = lazy(() => import("./pages/Discipleship.jsx"));
const Structure = lazy(() => import("./pages/Structure.jsx"));
const Education = lazy(() => import("./pages/Education.jsx"));
const Membership = lazy(() => import("./pages/Membership.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const CBCCUpdates = lazy(() => import("./pages/CBCCUpdates.jsx"));
const CBCCAdminPanel = lazy(() => import("./pages/CBCCAdminPanel.jsx"));
const CBCCEldersPanel = lazy(() => import("./pages/CBCCEldersPanel.jsx"));
// Auth Context
export const AuthContext = createContext(null);

// Reusable wrapper
const Lazy = ({ children }) => (
  <Suspense fallback={<SkeletonCard />}>{children}</Suspense>
);

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [showSuperAdminModal, setSuperAdminModal] = useState(false);

  const handleLogin = (userData, session, role) => {
    setUser(userData);
    setShowLogin(false);

    if (role === "Super Admin") {
      setSuperAdminModal(true);
      return;
    }
  };
  const handleSuperAdminModal = (userData) => {
    setUser(userData);
    setSuperAdminModal(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        {/* MAIN LAYOUT */}
        <Route
          path="/"
          element={<MainLayout onLoginClick={() => setShowLogin(true)} />}
        >
          <Route
            index
            element={
              <Lazy>
                <Home />
              </Lazy>
            }
          />

          <Route
            path="about"
            element={
              <Lazy>
                <About />
              </Lazy>
            }
          />
          <Route
            path="updates"
            element={
              <Lazy>
                <CBCCUpdates />
              </Lazy>
            }
          />
          <Route
            path="ministry"
            element={
              <Lazy>
                <Ministry />
              </Lazy>
            }
          />
          <Route
            path="discipleship"
            element={
              <Lazy>
                <Discipleship />
              </Lazy>
            }
          />
          <Route
            path="structure"
            element={
              <Lazy>
                <Structure />
              </Lazy>
            }
          />
          <Route
            path="education"
            element={
              <Lazy>
                <Education />
              </Lazy>
            }
          />
          <Route
            path="membership"
            element={
              <Lazy>
                <Membership />
              </Lazy>
            }
          />
          <Route
            path="contact"
            element={
              <Lazy>
                <Contact />
              </Lazy>
            }
          />
        </Route>

        {/* ADMIN */}
        <Route
          path="cbccadmin"
          element={
            <ProtectedRoute allowedRoles={["Super Admin", "Editor"]}>
              <Lazy>
                <CBCCAdminPanel />
              </Lazy>
            </ProtectedRoute>
          }
        />
        {/* ELDERS */}
        <Route
          path="cbccelders"
          element={
            <ProtectedRoute allowedRoles={["Super Admin", "Elder"]}>
              <Lazy>
                <CBCCEldersPanel />
              </Lazy>
            </ProtectedRoute>
          }
        />
      </Routes>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
      {showSuperAdminModal && (
        <SuperAdminModal
          isOpen={showSuperAdminModal}
          onClose={() => setSuperAdminModal(false)}
        />
      )}
    </AuthContext.Provider>
  );
}
