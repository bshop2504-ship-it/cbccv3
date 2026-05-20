import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeOffIcon } from "../assets/svg/Icons";
import { supabase } from "../lib/supabaseClient";
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState("idle");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef();

  // Password strength
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score];
  const strengthColor = ["", "#e05252", "#f0a500", "#3B7597", "#6FD1D7"][score];
  const strengthWidth = ["0%", "25%", "50%", "75%", "100%"][score];

  const canSubmit = score === 4;
  const showError = touched && password.length > 0 && !canSubmit;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched(true);

    if (!canSubmit) return;

    try {
      setStatus("loading");

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        alert(error.message);
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setStatus("idle");
    }
  };

  // Auto-focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes floatA   { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-18px) scale(1.04);} }
        @keyframes floatB   { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(14px) scale(0.97);} }
        @keyframes floatC   { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-10px) scale(1.02);} }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes checkPop { 0%{transform:scale(0) rotate(-10deg);opacity:0;} 60%{transform:scale(1.2) rotate(4deg);} 100%{transform:scale(1) rotate(0);opacity:1;} }
        @keyframes gridFade { from{opacity:0;} to{opacity:1;} }
        @keyframes barGrow  { from{width:0;} to{width:var(--w);} }

        .rp-root {
          font-family: 'DM Sans', system-ui, sans-serif;
          min-height: 100vh;
          background: #0a1f30;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; position: relative; overflow: hidden;
        }

        /* Animated background orbs */
        .orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(60px);
        }
        .orb-1 { width:440px; height:440px; top:-120px; left:-100px;
          background: radial-gradient(circle, rgba(9,60,93,0.7) 0%, transparent 70%);
          animation: floatA 9s ease-in-out infinite; }
        .orb-2 { width:360px; height:360px; bottom:-80px; right:-80px;
          background: radial-gradient(circle, rgba(59,117,151,0.5) 0%, transparent 70%);
          animation: floatB 11s ease-in-out infinite; }
        .orb-3 { width:260px; height:260px; top:40%; left:60%;
          background: radial-gradient(circle, rgba(111,209,215,0.12) 0%, transparent 70%);
          animation: floatC 7s ease-in-out infinite; }

        /* Subtle dot grid */
        .dot-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(111,209,215,0.08) 1px, transparent 1px);
          background-size: 32px 32px;
          animation: gridFade 1.5s ease both;
        }

        /* Card */
        .card {
          position: relative; z-index: 10;
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          padding: 44px 40px 40px;
          box-shadow:
            0 0 0 1px rgba(111,209,215,0.06),
            0 24px 64px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.1);
          animation: fadeUp 0.6s ease both;
        }
        @media(max-width:480px){ .card { padding: 36px 24px 32px; } }

        /* Logo badge */
        .logo-badge {
          width: 52px; height: 52px; border-radius: 16px;
          background: linear-gradient(135deg, rgba(111,209,215,0.15), rgba(9,60,93,0.4));
          border: 1px solid rgba(111,209,215,0.25);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2), 0 0 0 6px rgba(111,209,215,0.04);
        }
        .logo-cross {
          color: #6FD1D7; font-size: 22px; line-height: 1;
          text-shadow: 0 0 12px rgba(111,209,215,0.5);
        }

        /* Headings */
        .eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(111,209,215,0.6); margin-bottom: 8px;
          display: flex; align-items: center; gap: 7px;
        }
        .eyebrow-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(111,209,215,0.5); }
        .card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px; font-weight: 900;
          color: #fff; line-height: 1.1; letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .card-title em { font-style: italic; color: #6FD1D7; }
        .card-sub {
          font-size: 13px; color: rgba(255,255,255,0.38);
          line-height: 1.55; margin-bottom: 32px;
        }

        /* Input group */
        .input-group { position: relative; margin-bottom: 16px; }
        .input-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.45); margin-bottom: 8px; display: block;
        }
        .input-shell {
          position: relative;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          overflow: hidden;
        }
        .input-shell.focused {
          border-color: rgba(111,209,215,0.5);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(111,209,215,0.1), 0 4px 16px rgba(0,0,0,0.15);
        }
        .input-shell.error {
          border-color: rgba(224,82,82,0.5);
          box-shadow: 0 0 0 3px rgba(224,82,82,0.08);
        }
        .pw-input {
          width: 100%; background: transparent; border: none; outline: none;
          padding: 14px 52px 14px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #fff;
          letter-spacing: 0.04em;
        }
        .pw-input::placeholder { color: rgba(255,255,255,0.2); letter-spacing: 0; }
        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: transparent; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); font-size: 16px; line-height: 1;
          transition: color 0.2s; padding: 4px;
        }
        .eye-btn:hover { color: rgba(111,209,215,0.8); }

        /* Strength bar */
        .strength-bar-track {
          height: 3px; background: rgba(255,255,255,0.06);
          border-radius: 2px; overflow: hidden; margin-bottom: 10px;
        }
        .strength-bar-fill {
          height: 100%; border-radius: 2px;
          transition: width 0.4s ease, background-color 0.4s ease;
        }

        /* Checklist */
        .check-list {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 6px; margin-bottom: 28px;
        }
        .check-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 11px; color: rgba(255,255,255,0.3);
          transition: color 0.25s;
        }
        .check-item.pass { color: rgba(111,209,215,0.8); }
        .check-dot {
          width: 16px; height: 16px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 9px;
          transition: border-color 0.25s, background 0.25s;
        }
        .check-item.pass .check-dot {
          border-color: #6FD1D7;
          background: rgba(111,209,215,0.12);
          color: #6FD1D7;
        }

        /* Submit button */
        .submit-btn {
          width: 100%; padding: 15px;
          border-radius: 14px; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.25s;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn.ready {
          background: linear-gradient(135deg, #6FD1D7 0%, #3B7597 100%);
          color: #093C5D;
          box-shadow: 0 8px 24px rgba(111,209,215,0.25), 0 2px 8px rgba(0,0,0,0.2);
        }
        .submit-btn.ready:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(111,209,215,0.35), 0 4px 12px rgba(0,0,0,0.2);
        }
        .submit-btn.ready:active { transform: translateY(0); }
        .submit-btn.disabled {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.25); cursor: not-allowed;
        }
        .submit-btn.loading {
          background: rgba(111,209,215,0.15);
          border: 1px solid rgba(111,209,215,0.25);
          color: #6FD1D7; cursor: not-allowed;
        }
        .spinner {
          width: 16px; height: 16px; border: 2px solid rgba(111,209,215,0.3);
          border-top-color: #6FD1D7; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Success state */
        .success-view {
          text-align: center; animation: fadeIn 0.5s ease;
        }
        .success-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(111,209,215,0.1);
          border: 2px solid rgba(111,209,215,0.3);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          animation: checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
          font-size: 28px;
          box-shadow: 0 0 0 12px rgba(111,209,215,0.05), 0 0 40px rgba(111,209,215,0.15);
        }
        .success-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 900; color: #fff;
          margin-bottom: 8px; letter-spacing: -0.02em;
        }
        .success-sub {
          font-size: 13px; color: rgba(255,255,255,0.38);
          line-height: 1.6; margin-bottom: 28px;
        }
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(111,209,215,0.6);
          background: rgba(111,209,215,0.06);
          border: 1px solid rgba(111,209,215,0.18);
          border-radius: 10px; padding: 9px 18px; cursor: pointer;
          transition: all 0.2s; text-decoration: none;
        }
        .back-btn:hover {
          background: rgba(111,209,215,0.12);
          color: rgba(111,209,215,0.9);
        }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="rp-root">
        {/* Background */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="dot-grid" />

        {/* Card */}
        <div className="card">
          {status === "success" ? (
            <div className="success-view">
              <div className="success-icon">✓</div>
              <p className="success-title">Password Reset!</p>
              <p className="success-sub">
                Your new password has been set successfully.
                <br />
                You can now sign in with your new credentials.
              </p>
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">CBCC</span>
                <div className="divider-line" />
              </div>
              <a href="#" className="back-btn">
                ← Back to Sign In
              </a>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div className="logo-badge">
                <span className="logo-cross">✝</span>
              </div>

              {/* Heading */}
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                CBCC Account
                <span className="eyebrow-dot" />
              </div>
              <h1 className="card-title">
                New <em>Password</em>
              </h1>
              <p className="card-sub">
                Choose a strong password to secure
                <br />
                your CBCC account.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Input */}
                <div className="input-group">
                  <label className="input-label" htmlFor="pw">
                    New Password
                  </label>
                  <div
                    className={`input-shell ${focused ? "focused" : ""} ${showError ? "error" : ""}`}
                  >
                    <input
                      ref={inputRef}
                      id="pw"
                      className="pw-input"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setTouched(true);
                      }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="Enter your new password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShow((s) => !s)}
                      tabIndex={-1}
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.25)",
                        }}
                      >
                        Strength
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          color: strengthColor,
                          transition: "color 0.3s",
                        }}
                      >
                        {strengthLabel}
                      </span>
                    </div>
                    <div className="strength-bar-track">
                      <div
                        className="strength-bar-fill"
                        style={{
                          width: strengthWidth,
                          backgroundColor: strengthColor,
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Checklist */}
                <div className="check-list">
                  {[
                    { key: "length", label: "8+ characters" },
                    { key: "upper", label: "Uppercase letter" },
                    { key: "number", label: "Number (0–9)" },
                    { key: "special", label: "Special character" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className={`check-item ${checks[key] ? "pass" : ""}`}
                    >
                      <div className="check-dot">{checks[key] ? "✓" : ""}</div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`submit-btn ${
                    status === "loading"
                      ? "loading"
                      : canSubmit
                        ? "ready"
                        : "disabled"
                  }`}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <div className="spinner" />
                      Resetting…
                    </>
                  ) : (
                    <>
                      {canSubmit && <span>🔐</span>}
                      Reset Password
                    </>
                  )}
                </button>
              </form>

              {/* Footer link */}
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">or</span>
                <div className="divider-line" />
              </div>
              <div style={{ textAlign: "center" }}>
                <a
                  href="/"
                  className="back-btn"
                  style={{ display: "inline-flex" }}
                >
                  ← Back to Sign In
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
