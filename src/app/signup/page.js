"use client";

import { useState } from "react";
import { GraduationCap, UserRoundCog , UserStar, Shield,MessageCircleMore, CalendarDays  } from "lucide-react";

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
//main
return (
  <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-teal-50 px-6 py-5">

    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

      {/* ================= LEFT SIDE ================= */}
  <section className="hidden w-[45%] h-[calc(100vh-4rem)] flex-shrink-0 flex-col items-center bg-gradient-to-br from-pink-50 via-white to-teal-50 px-10 py-10 lg:flex animate-slide-left">
        <div className="flex flex-1 items-center justify-center">
          <img
            src="/signup-student.png"
            alt="College student"
            className="w-[390px] object-contain drop-shadow-[0_20px_25px_rgba(236,72,153,0.12)]"
          />
        </div>

        {/* Welcome text */}
        <div className="w-full text-center">

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Welcome to{" "}
            <span className="text-teal-600">
              College AI
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-500">
            Your smart college companion for learning,
            information and everyday campus life.
          </p>

          {/* Feature cards */}
          <div className="mt-8 grid grid-cols-3 gap-4">

          <div className="group cursor-pointer rounded-2xl bg-white p-5 shadow-sm ring-1 ring-pink-100 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:ring-pink-200">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-md">
       <GraduationCap size={34} strokeWidth={2}  color="#ec4899"/>
              </div>

            <h3 className="mt-3 text-sm font-bold text-slate-800 transition-colors duration-300 group-hover:text-pink-500">
                Smart Learning
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Access resources and study smart
              </p>
            </div>

         <div className="group cursor-pointer rounded-2xl bg-white p-5 shadow-sm ring-1 ring-teal-100 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:ring-teal-200">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-md">
                     <MessageCircleMore size={30} strokeWidth={2}  color="#ec4899"/>
              </div>


           <h3 className="mt-3 text-sm font-bold text-slate-800 transition-colors duration-300 group-hover:text-teal-500">
                Easy Connection
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Connect with faculty and classmates
              </p>
            </div>
<div className="group cursor-pointer rounded-2xl bg-white p-5 shadow-sm ring-1 ring-pink-100 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:ring-pink-200">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-md">
               <CalendarDays size={30} strokeWidth={2}  color="#ec4899"/>
              </div>

            <h3 className="mt-3 text-sm font-bold text-slate-800 transition-colors duration-300 group-hover:text-pink-500">
                Stay Organized
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Manage tasks and deadlines easily
              </p>
            </div>

          </div>
        </div>

      </section>


      {/* ================= RIGHT SIDE ================= */}
      <section className="flex w-full items-center justify-center px-6 py-8 lg:w-[55%] lg:px-12 animate-slide-right">

        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="mb-8 text-center">

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Create{" "}
           <span className={accountType === "staff" ? "text-teal-500" : "text-pink-500"}>
  Account
</span>
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Create your account and stay connected with your college
            </p>

          </div>


          {/* Account Type */}
          <div className="mb-7">

            <label className="mb-3 block text-sm font-bold text-slate-800">
              Account Type
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Student */}
              <label
                className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200 ${
                  accountType === "student"
                    ? "border-pink-500 bg-pink-50/60 shadow-sm"
                    : "border-slate-200 bg-white hover:border-pink-200"
                }`}
              >

                <input
                  type="radio"
                  name="accountType"
                  value="student"
                  checked={accountType === "student"}
                  onChange={() =>
                    handleAccountTypeChange("student")
                  }
               className="h-5 w-5 appearance-none rounded-full border border-pink-500 bg-white checked:bg-pink-500 checked:border-[5px] checked:border-white checked:ring-2 checked:ring-pink-500 cursor-pointer transition-all"
                />

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl">
                 <GraduationCap size={34} strokeWidth={2}  color="#ec4899"/>
                </div>

                <div>
                  <p className="font-bold text-pink-500">
                    Student
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Student account
                  </p>
                </div>

              </label>


              {/* Staff */}
              <label
                className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200 ${
                  accountType === "staff"
                    ? "border-teal-500 bg-teal-50/60 shadow-sm"
                    : "border-slate-200 bg-white hover:border-teal-200"
                }`}
              >

                <input
                  type="radio"
                  name="accountType"
                  value="staff"
                  checked={accountType === "staff"}
                  onChange={() =>
                    handleAccountTypeChange("staff")
                  }
className="h-5 w-5 appearance-none rounded-full border border-teal-500 bg-white checked:bg-teal-500 checked:border-[5px] checked:border-white checked:ring-2 checked:ring-teal-500 cursor-pointer transition-all"
                />

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-2xl">
                <UserRoundCog size={30} strokeWidth={2} color="#0d9488"/>

                </div>

                <div>
                  <p className="font-bold text-teal-600">
                    Staff
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Teacher / Admin
                  </p>
                </div>

              </label>

            </div>
          </div>


          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* College ID + Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  College ID
                </label>

                <input
                  type="text"
                  name="college_id"
                  value={formData.college_id}
                  onChange={handleChange}
                  placeholder="Enter your college ID"
                  required
                 className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition ${
  accountType === "staff"
    ? "focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
    : "focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
}`}
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition ${
  accountType === "staff"
    ? "focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
    : "focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
}`}
                />
              </div>

            </div>


            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition ${
  accountType === "staff"
    ? "focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
    : "focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
}`}
              />
            </div>


            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
               className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition ${
  accountType === "staff"
    ? "focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
    : "focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
}`}
              />
            </div>


            {/* Student fields */}
            {accountType === "student" && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-600 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="">
                      Select Department
                    </option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                    <option value="HM">HM</option>
                    <option value="Travel & Tourism">
                      Travel & Tourism
                    </option>
                    <option value="IT">IT</option>
                  </select>
                </div>


                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Semester
                  </label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-600 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="">
                      Select Semester
                    </option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                  </select>
                </div>

              </div>
            )}


            {/* Staff fields */}
            {accountType === "staff" && (
          <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5">

                <div className="mb-4">
                  <label className="text-sm font-bold text-teal-600">
                    Staff Role
                  </label>

                  <p className="mt-1 text-xs text-slate-500">
                    Select one or both roles
                  </p>
                </div>


                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100">
                    <input
                      type="checkbox"
                      name="is_teacher"
                      checked={formData.is_teacher}
                      onChange={handleChange}
                  className="h-5 w-5 accent-teal-500"
                    />

               <span className="text-sm font-medium text-slate-700 whitespace-nowrap flex items-center gap-2">
  <UserStar size={20} strokeWidth={2} color="#0d9488" />
  <span>Teacher</span>
</span>
                  </label>


                  <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100">
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={formData.is_admin}
                      onChange={handleChange}
                      className="h-5 w-5 accent-teal-500"
                    />

                    <span className="text-sm font-medium text-slate-700 whitespace-nowrap flex items-center gap-2">
                     <Shield  size={20} strokeWidth={2} color="#0d9488" fill="#ccfbf1" />
                       <span>Admin</span>
                    </span>
                  </label>

                </div>

              </div>
            )}


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
        className={`
  w-full
  rounded-xl
  py-4
  text-sm
  font-bold
  uppercase
  tracking-wide
  text-white
  bg-[length:300%_100%]
  transition-all
  duration-500
  ease-in-out
  hover:bg-[position:100%_0]
  hover:-translate-y-0.5
  active:translate-y-0
  disabled:cursor-not-allowed
  disabled:opacity-60
  ${
    accountType === "staff"
      ? "bg-[linear-gradient(to_right,#2dd4bf,#14b8a6,#0d9488,#2dd4bf)] shadow-[0_4px_15px_rgba(13,148,136,0.22)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.30)]"
      : "bg-[linear-gradient(to_right,#f472b6,#ec4899,#db2777,#f472b6)] shadow-[0_4px_15px_rgba(236,72,153,0.22)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.30)]"
  }
`}>
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>

          </form>


          {/* Message */}
          {message && (
            <div className="mt-5 rounded-xl bg-teal-50 px-4 py-3 text-center text-sm font-medium text-teal-700">
              {message}
            </div>
          )}


          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <a
              href="/"
              className="font-bold text-teal-600 transition hover:text-pink-500"
            >
              Log in
            </a>

          </p>

        </div>

      </section>

    </div>

  </main>
);
}