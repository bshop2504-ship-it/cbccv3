import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchCurrentUser } from "../api/currentUser";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const loadUser = async () => {
      const u = await fetchCurrentUser();
      setUser(u);
    };

    loadUser();
  }, []);

  if (user === undefined) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
        <div
          className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl 
                    bg-white/10 border border-white/20 
                    shadow-2xl backdrop-blur-xl text-white"
        >
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

          {/* Text */}
          <p className="text-sm tracking-wide opacity-80">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
