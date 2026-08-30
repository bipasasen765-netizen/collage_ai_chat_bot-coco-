"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Lock } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // STEP 1 - SEND OTP
  // ==============================
  const handleSendOtp = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/user-auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP has been sent to your email.");
        setStep(2);
      } else {
        setMessage(data.message || "Unable to send OTP.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // STEP 2 - VERIFY OTP
  // ==============================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/user-auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP verified successfully.");
        setStep(3);
      } else {
        setMessage(data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // STEP 3 - RESET PASSWORD
  // ==============================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user-auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully. You can now login.");

        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMessage(data.message || "Unable to reset password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        backgroundImage: "url('/login_page_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* ================= RESET PASSWORD CARD ================= */}
      <div
        className="reset-card-enter"
        style={{
          width: "80%",
          maxWidth: "440px",

          padding: "20px 36px 22px",

          borderRadius: "22px",
            transform: "translateX(100px)",
          background: "rgba(255, 255, 255, 0.28)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(16px)",

          border: "1px solid rgba(255, 255, 255, 0.45)",

          boxShadow:
            "0 15px 40px rgba(0, 70, 70, 0.14)",

          boxSizing: "border-box",
        }}
      >
        {/* ================= TITLE ================= */}
        <h1
          style={{
            margin: "0 0 26px 0",

            textAlign: "center",

            fontSize: "42px",
            lineHeight: "1.2",

            fontWeight: "700",

            color: "#075e63",

            letterSpacing: "-1px",
          }}
        >
          Reset Password
        </h1>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: "25px",
              }}
            >
              <Mail
                size={26}
                strokeWidth={1.8}
                style={{
                  position: "absolute",

                  left: "20px",
                  top: "50%",

                  transform: "translateY(-50%)",

                  color: "#7d9fa2",

                  pointerEvents: "none",
                }}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: "100%",
                  height: "65px",

                  padding: "0 20px 0 60px",

                  border: "1px solid #d2e0e1",
                  borderRadius: "12px",

                  background: "rgba(255, 255, 255, 0.92)",

                  color: "#164e63",

                  fontSize: "18px",

                  outline: "none",

                  boxSizing: "border-box",

                  transition: "all 0.25s ease",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "65px",

                border: "none",
                borderRadius: "12px",

                background: "#0d8f8b",

                color: "#ffffff",

                fontSize: "20px",
                fontWeight: "600",

                cursor: loading ? "not-allowed" : "pointer",

                boxShadow:
                  "0 7px 18px rgba(13, 143, 139, 0.25)",

                transition: "all 0.25s ease",
              }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: "25px",
              }}
            >
              <ShieldCheck
                size={26}
                strokeWidth={1.8}
                style={{
                  position: "absolute",

                  left: "20px",
                  top: "50%",

                  transform: "translateY(-50%)",

                  color: "#7d9fa2",

                  pointerEvents: "none",
                }}
              />

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                required
                style={{
                  width: "100%",
                  height: "65px",

                  padding: "0 20px 0 60px",

                  border: "1px solid #d2e0e1",
                  borderRadius: "12px",

                  background: "rgba(255, 255, 255, 0.92)",

                  color: "#164e63",

                  fontSize: "18px",

                  outline: "none",

                  boxSizing: "border-box",

                  transition: "all 0.25s ease",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "65px",

                border: "none",
                borderRadius: "12px",

                background: "#0d8f8b",

                color: "#ffffff",

                fontSize: "20px",
                fontWeight: "600",

                cursor: loading ? "not-allowed" : "pointer",

                boxShadow:
                  "0 7px 18px rgba(13, 143, 139, 0.25)",

                transition: "all 0.25s ease",
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setMessage("");
              }}
              style={{
                width: "100%",

                marginTop: "12px",

                background: "transparent",
                border: "none",

                color: "#075e63",

                fontSize: "16px",
                fontWeight: "500",

                cursor: "pointer",
              }}
            >
              Change Email
            </button>
          </form>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            {/* NEW PASSWORD */}
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: "15px",
              }}
            >
              <Lock
                size={24}
                strokeWidth={1.8}
                style={{
                  position: "absolute",

                  left: "20px",
                  top: "50%",

                  transform: "translateY(-50%)",

                  color: "#7d9fa2",

                  pointerEvents: "none",
                }}
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength="6"
                required
                style={{
                  width: "100%",
                  height: "65px",

                  padding: "0 20px 0 60px",

                  border: "1px solid #d2e0e1",
                  borderRadius: "12px",

                  background: "rgba(255, 255, 255, 0.92)",

                  color: "#164e63",

                  fontSize: "18px",

                  outline: "none",

                  boxSizing: "border-box",

                  transition: "all 0.25s ease",
                }}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: "25px",
              }}
            >
              <Lock
                size={24}
                strokeWidth={1.8}
                style={{
                  position: "absolute",

                  left: "20px",
                  top: "50%",

                  transform: "translateY(-50%)",

                  color: "#7d9fa2",

                  pointerEvents: "none",
                }}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                minLength="6"
                required
                style={{
                  width: "100%",
                  height: "65px",

                  padding: "0 20px 0 60px",

                  border: "1px solid #d2e0e1",
                  borderRadius: "12px",

                  background: "rgba(255, 255, 255, 0.92)",

                  color: "#164e63",

                  fontSize: "18px",

                  outline: "none",

                  boxSizing: "border-box",

                  transition: "all 0.25s ease",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "65px",

                border: "none",
                borderRadius: "12px",

                background: "#0d8f8b",

                color: "#ffffff",

                fontSize: "20px",
                fontWeight: "600",

                cursor: loading ? "not-allowed" : "pointer",

                boxShadow:
                  "0 7px 18px rgba(13, 143, 139, 0.25)",

                transition: "all 0.25s ease",
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* ================= MESSAGE ================= */}
        {message && (
          <p
            style={{
              marginTop: "20px",

              textAlign: "center",

              color: "#0d7f7b",

              fontWeight: "500",

              fontSize: "15px",
            }}
          >
            {message}
          </p>
        )}

        {/* ================= BACK TO LOGIN ================= */}
        <div
          style={{
            display: "flex",

            justifyContent: "center",
            alignItems: "center",

            marginTop: "28px",

            fontSize: "17px",
          }}
        >
          <a
            href="/login"
            style={{
              color: "#075e63",

              textDecoration: "none",

              fontWeight: "500",
            }}
          >
            Back to Login
          </a>
        </div>
      </div>

      {/* ================= HOVER / FOCUS EFFECTS ================= */}
      <style jsx>{`
        input::placeholder {
          color: #91a8ab;
        }

        input:focus {
          border-color: #0d9488 !important;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
        }

        button:not(:disabled):hover {
          background: #087f7a !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(13, 143, 139, 0.3) !important;
        }

        a:hover {
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
}