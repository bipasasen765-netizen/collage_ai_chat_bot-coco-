"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, UserRoundCog, UserStar, Shield, MessageCircleMore, CalendarDays } from "lucide-react";

export default function SignupPage() {
  const [accountType, setAccountType] = useState("student");

  const [formData, setFormData] = useState({
    college_id: "",
    name: "",
    email: "",
    password: "",
    department: "",
    semester: "",
    is_teacher: false,
    is_admin: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleAccountTypeChange(type) {
    setAccountType(type);

    setFormData({
      college_id: "",
      name: "",
      email: "",
      password: "",
      department: "",
      semester: "",
      is_teacher: false,
      is_admin: false,
    });

    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      accountType === "staff" &&
      !formData.is_teacher &&
      !formData.is_admin
    ) {
      setMessage("Please select Teacher, Admin, or both.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user-auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          account_type: accountType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully! 🎉");

        setFormData({
          college_id: "",
          name: "",
          email: "",
          password: "",
          department: "",
          semester: "",
          is_teacher: false,
          is_admin: false,
        });
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FCFCFD] text-zinc-900 font-sans px-4 sm:px-6 py-6 selection:bg-orange-500 selection:text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Entrance Keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulseAmbient {
          0%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.08) translateY(-8px);
            opacity: 0.5;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-ambient-glow {
          animation: pulseAmbient 8s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient Orange Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-orange-500/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10 animate-ambient-glow" />

      {/* Main Glassmorphic Split Container */}
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl overflow-hidden rounded-[32px] bg-white/95 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-zinc-200/90 hover:border-orange-200/80 transition-all duration-300">

        {/* ================= LEFT SIDE (SHOWCASE & BRANDING) ================= */}
        <section className="hidden w-[45%] h-[calc(100vh-4rem)] flex-shrink-0 flex-col items-center justify-between bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 px-10 py-10 lg:flex border-r border-zinc-100 animate-fade-in-left">
          
          {/* Static Student Illustration with Pure Hover Zoom */}
          <div className="flex flex-1 items-center justify-center">
            <div className="transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <img
                src="/campus-student.svg"
                alt="EIILM College Student"
                className="w-[300px] object-contain drop-shadow-[0_20px_25px_rgba(249,115,22,0.14)] hover:drop-shadow-[0_25px_30px_rgba(249,115,22,0.22)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Welcome Text & Feature Badges with Staggered Entrance */}
          <div className="w-full text-center">

            <div 
              className="space-y-2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                  EIILM Campus AI
                </span>
              </h2>

              <p className="mx-auto max-w-md text-xs sm:text-sm leading-relaxed text-zinc-600">
                EIILM Kolkata Jalpaiguri Campus digital portal for academic tracking, syllabus assistance, and Coco AI services.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div 
              className="mt-6 grid grid-cols-3 gap-3.5 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "280ms" }}
            >

              {/* Card 1 */}
              <div className="group cursor-pointer rounded-2xl bg-white/90 backdrop-blur-sm p-4 shadow-sm ring-1 ring-orange-100 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:shadow-orange-500/10 hover:ring-orange-300">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-orange-500">
                  <GraduationCap size={26} strokeWidth={2} className="text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="mt-3 text-xs font-bold text-zinc-800 transition-colors duration-300 group-hover:text-orange-600">
                  Smart Learning
                </h3>
                <p className="mt-1 text-[10px] leading-tight text-zinc-500">
                  Syllabus & study paths
                </p>
              </div>

              {/* Card 2 */}
              <div className="group cursor-pointer rounded-2xl bg-white/90 backdrop-blur-sm p-4 shadow-sm ring-1 ring-orange-100 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:shadow-orange-500/10 hover:ring-orange-300">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-orange-500">
                  <MessageCircleMore size={24} strokeWidth={2} className="text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="mt-3 text-xs font-bold text-zinc-800 transition-colors duration-300 group-hover:text-orange-600">
                  Coco Co-Pilot
                </h3>
                <p className="mt-1 text-[10px] leading-tight text-zinc-500">
                  Instant 24/7 assistance
                </p>
              </div>

              {/* Card 3 */}
              <div className="group cursor-pointer rounded-2xl bg-white/90 backdrop-blur-sm p-4 shadow-sm ring-1 ring-orange-100 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:shadow-orange-500/10 hover:ring-orange-300">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-orange-500">
                  <CalendarDays size={24} strokeWidth={2} className="text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="mt-3 text-xs font-bold text-zinc-800 transition-colors duration-300 group-hover:text-orange-600">
                  Stay Synced
                </h3>
                <p className="mt-1 text-[10px] leading-tight text-zinc-500">
                  Routines & exam dates
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* ================= RIGHT SIDE (ENROLLMENT FORM) ================= */}
        <section className="flex w-full items-center justify-center px-6 sm:px-10 py-8 lg:w-[55%] lg:px-12 animate-fade-in-right overflow-y-auto">

          <div className="w-full max-w-xl">

            {/* Header */}
            <div 
              className="mb-7 text-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                Create{" "}
                <span className={accountType === "staff" ? "text-amber-600" : "text-orange-600"}>
                  Portal Account
                </span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500">
                EIILM Kolkata Jalpaiguri Campus Registration Desk
              </p>
            </div>

            {/* Account Type Toggle Cards */}
            <div 
              className="mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Select Account Type
              </label>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">

                {/* Student Radio Card */}
                <label
                  className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-300 hover:shadow-md ${
                    accountType === "student"
                      ? "border-orange-500 bg-orange-50/70 shadow-sm scale-[1.01]"
                      : "border-zinc-200 bg-white hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="student"
                    checked={accountType === "student"}
                    onChange={() => handleAccountTypeChange("student")}
                    className="h-5 w-5 appearance-none rounded-full border border-orange-500 bg-white checked:bg-orange-500 checked:border-[5px] checked:border-white checked:ring-2 checked:ring-orange-500 cursor-pointer transition-all"
                  />
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl shadow-inner">
                    <GraduationCap size={26} strokeWidth={2} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-orange-600">
                      Student
                    </p>
                    <p className="text-xs text-zinc-500">
                      Academic enrollment
                    </p>
                  </div>
                </label>

                {/* Staff Radio Card */}
                <label
                  className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-300 hover:shadow-md ${
                    accountType === "staff"
                      ? "border-amber-500 bg-amber-50/70 shadow-sm scale-[1.01]"
                      : "border-zinc-200 bg-white hover:border-amber-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="staff"
                    checked={accountType === "staff"}
                    onChange={() => handleAccountTypeChange("staff")}
                    className="h-5 w-5 appearance-none rounded-full border border-amber-500 bg-white checked:bg-amber-500 checked:border-[5px] checked:border-white checked:ring-2 checked:ring-amber-500 cursor-pointer transition-all"
                  />
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl shadow-inner">
                    <UserRoundCog size={24} strokeWidth={2} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-amber-700">
                      Staff
                    </p>
                    <p className="text-xs text-zinc-500">
                      Faculty / Admin
                    </p>
                  </div>
                </label>

              </div>
            </div>

            {/* Registration Form */}
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >

              {/* College ID + Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="group">
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 group-focus-within:text-orange-600 transition-colors">
                    College Roll / ID
                  </label>
                  <input
                    type="text"
                    name="college_id"
                    value={formData.college_id}
                    onChange={handleChange}
                    placeholder="TEST001"
                    required
                    className={`w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-xs text-zinc-800 outline-none transition-all duration-200 focus:bg-white ${
                      accountType === "staff"
                        ? "focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                        : "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    }`}
                  />
                </div>

                <div className="group">
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 group-focus-within:text-orange-600 transition-colors">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Student's Name"
                    required
                    className={`w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-xs text-zinc-800 outline-none transition-all duration-200 focus:bg-white ${
                      accountType === "staff"
                        ? "focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                        : "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700 group-focus-within:text-orange-600 transition-colors">
                  Institutional Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  required
                  className={`w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-xs text-zinc-800 outline-none transition-all duration-200 focus:bg-white ${
                    accountType === "staff"
                      ? "focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                      : "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  }`}
                />
              </div>

              {/* Password */}
              <div className="group">
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700 group-focus-within:text-orange-600 transition-colors">
                  Create Secure Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                  className={`w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-xs text-zinc-800 outline-none transition-all duration-200 focus:bg-white ${
                    accountType === "staff"
                      ? "focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                      : "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  }`}
                />
              </div>

              {/* Student Fields */}
              {accountType === "student" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in-up">
                  <div className="group">
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-700 group-focus-within:text-orange-600 transition-colors">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-xs text-zinc-700 outline-none transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="HM">HM</option>
                      <option value="Travel & Tourism">Travel & Tourism</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-700 group-focus-within:text-orange-600 transition-colors">
                      Semester
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-xs text-zinc-700 outline-none transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 cursor-pointer"
                    >
                      <option value="">Select Semester</option>
                      <option value="1">1st Semester</option>
                      <option value="2">2nd Semester</option>
                      <option value="3">3rd Semester</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Staff Fields */}
              {accountType === "staff" && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 animate-fade-in-up">
                  <div className="mb-3">
                    <label className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Staff Role Assignment
                    </label>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      Select one or both institutional roles
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-zinc-200 hover:ring-amber-300 transition-all">
                      <input
                        type="checkbox"
                        name="is_teacher"
                        checked={formData.is_teacher}
                        onChange={handleChange}
                        className="h-4 w-4 accent-amber-600 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-zinc-800 whitespace-nowrap flex items-center gap-2">
                        <UserStar size={18} strokeWidth={2} className="text-amber-600" />
                        <span>Teacher</span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-zinc-200 hover:ring-amber-300 transition-all">
                      <input
                        type="checkbox"
                        name="is_admin"
                        checked={formData.is_admin}
                        onChange={handleChange}
                        className="h-4 w-4 accent-amber-600 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-zinc-800 whitespace-nowrap flex items-center gap-2">
                        <Shield size={18} strokeWidth={2} className="text-amber-600 fill-amber-100" />
                        <span>Admin</span>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full
                  rounded-xl
                  py-3.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  bg-[length:200%_100%]
                  transition-all
                  duration-300
                  ease-out
                  hover:bg-[position:100%_0]
                  hover:-translate-y-0.5
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  shadow-lg
                  ${
                    accountType === "staff"
                      ? "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 shadow-amber-600/25 hover:shadow-amber-600/40"
                      : "bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 shadow-orange-600/25 hover:shadow-orange-600/40"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Registry...</span>
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </button>

            </form>

            {/* Message Notification */}
            {message && (
              <div className={`mt-4 rounded-xl px-4 py-3 text-center text-xs font-semibold border animate-fade-in-up ${
                message.includes("successfully")
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm"
                  : "bg-amber-50 text-amber-800 border-amber-200 shadow-sm"
              }`}>
                {message}
              </div>
            )}

            {/* Login Link */}
            <p className="mt-6 text-center text-xs text-zinc-500">
              Already verified in campus registry?{" "}
              <Link
                href="/login"
                className="font-bold text-orange-600 transition hover:text-orange-700 hover:underline ml-0.5"
              >
                Sign In
              </Link>
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}