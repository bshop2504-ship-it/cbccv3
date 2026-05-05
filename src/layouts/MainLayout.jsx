import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function MainLayout({ onLoginClick }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLoginClick={onLoginClick} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
