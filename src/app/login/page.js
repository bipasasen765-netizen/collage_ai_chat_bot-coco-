"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);
const formData = new FormData(e.currentTarget);

const loginEmail = formData.get("email")?.trim();
const loginPassword = formData.get("password");
    try {
    const response = await fetch("/api/user-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
     body: JSON.stringify({
  email: loginEmail,
  password: loginPassword,
}),
      });

      const data = await response.json();

     if (response.ok) {

router.push("/chat");
} else {
        setMessage(data.message || "Login failed.");
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
    {/* ================= LOGIN CARD ================= */}
    <div
      className="login-card-enter"
        style={{
    width: "80%",
   
    maxWidth: "440px",

   
   padding: "20px 36px 22px",

    borderRadius: "22px",

        /* Same soft glass appearance as reference */
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

          fontSize: "48px",
          lineHeight: "1.2",

          fontWeight: "700",

          color: "#075e63",

          letterSpacing: "-1px",
        }}
      >
        Sign In
      </h1>

      <form onSubmit={handleLogin}>

        {/* ================= EMAIL ================= */}
        <div
          style={{
            position: "relative",
            width: "100%",
           
            marginBottom: "15px",
          }}
        >
          <User
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
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username"
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


        {/* ================= PASSWORD ================= */}
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
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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


        {/* ================= LOGIN BUTTON ================= */}
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
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>


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


      {/* ================= BOTTOM LINKS ================= */}
      <div
        style={{
          display: "flex",

          justifyContent: "space-between",
          alignItems: "center",

          marginTop: "28px",

          fontSize: "17px",
        }}
      >
        {/* Forgot Password */}
        <a
          href="/forgot-password"
          style={{
            color: "#075e63",

            textDecoration: "none",

            fontWeight: "500",
          }}
        >
          Forgot Password
        </a>

        {/* Sign Up */}
        <a
          href="/signup"
          style={{
            color: "#d13b70",

            textDecoration: "none",

            fontWeight: "600",
          }}
        >
          Sign Up
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
);}