import React, { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import LoginModal from "./components/LoginModal.jsx";
import SkeletonCard from "./components/SkeletonCard.jsx";
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

// Auth Context
export const AuthContext = React.createContext(null);

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      <>
        <Routes>
          <Route
            path="/"
            element={<MainLayout onLoginClick={() => setShowLogin(true)} />}
          >
            <Route
              index
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <Home />
                </Suspense>
              }
            />

            <Route
              path="about"
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <About />
                </Suspense>
              }
            />

            <Route
              path="updates"
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <CBCCUpdates />
                </Suspense>
              }
            />

            <Route
              path="ministry"
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <Ministry />
                </Suspense>
              }
            />

            <Route
              path="discipleship"
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <Discipleship />
                </Suspense>
              }
            />

            <Route
              path="structure"
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <Structure />
                </Suspense>
              }
            />

            <Route
              path="education"
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <Education />
                </Suspense>
              }
            />

            <Route
              path="membership"
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <Membership />
                </Suspense>
              }
            />

            <Route
              path="contact"
              element={
                <Suspense fallback={<SkeletonCard />}>
                  <Contact />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="cbccadmin"
            element={
              <Suspense fallback={<SkeletonCard />}>
                <CBCCAdminPanel />
              </Suspense>
            }
          />
        </Routes>
      </>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </AuthContext.Provider>
  );
}
