import React from "react";
import { Link } from "react-router-dom";
import {
  CrossIcon,
  MailIcon,
  LocationIcon,
  PhoneIcon,
} from "../assets/svg/Icons.jsx";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-aqua/20 border border-aqua/40 flex items-center justify-center">
                <CrossIcon size={20} color="#6FD1D7" />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-white">
                  CBCC
                </p>
                <p className="text-aqua/60 text-[10px] tracking-widest uppercase font-mono">
                  Cabagan Bible Community Church
                </p>
              </div>
            </div>

            <p className="text-aqua/60 text-xs font-mono tracking-wider">
              Since 1992
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm tracking-wider uppercase mb-5">
              Navigate
            </h4>
            <div className="flex flex-col gap-3">
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Ministry", "/ministry"],
                ["Discipleship", "/discipleship"],
                ["Beliefs", "/beliefs"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="text-white/50 hover:text-aqua text-sm transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm tracking-wider uppercase mb-5">
              Resources
            </h4>
            <div className="flex flex-col gap-3">
              {[
                ["Structure", "/structure"],
                ["Education", "/education"],
                ["Membership", "/membership"],
                ["Contact", "/contact"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="text-white/50 hover:text-aqua text-sm transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm tracking-wider uppercase mb-5">
              Contact
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <LocationIcon
                  size={16}
                  color="#6FD1D7"
                  className="mt-0.5 shrink-0"
                />
                <p className="text-white/50 text-sm leading-relaxed">
                  Anao, Cabagan, Isabela, Region 2, Philippines
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon size={16} color="#6FD1D7" className="shrink-0" />
                <p className="text-white/50 text-sm">TBA</p>
              </div>
              <div className="flex items-center gap-3">
                <MailIcon size={16} color="#6FD1D7" className="shrink-0" />
                <p className="text-white/50 text-sm">bshop2504@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} CBCC. All rights reserved.
          </p>
          <p className="text-white/20 text-xs font-mono tracking-wider">
            "Building Disciples. Transforming Nations."
          </p>
        </div>
      </div>
    </footer>
  );
}
