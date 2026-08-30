
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "@/lib/db";
import nodemailer from "nodemailer";
export async function POST(request) {

    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
  try {
    const { email } = await request.json();

    // Check required field
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const [users] = await db.execute(
      `SELECT id, email, is_active
       FROM users
       WHERE email = ?`,
      [cleanEmail]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 }
      );
    }

    const user = users[0];

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { message: "Your account is inactive." },
        { status: 403 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP before storing it
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP expires after 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Remove previous OTP for this user
    await db.execute(
      `DELETE FROM password_otps
       WHERE user_id = ?`,
      [user.id]
    );

    // Store new OTP
    await db.execute(
      `INSERT INTO password_otps
       (user_id, otp_hash, expires_at)
       VALUES (?, ?, ?)`,
      [user.id, otpHash, expiresAt]
    );

  await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: cleanEmail,
  subject: "Password Reset OTP",
  text: `Your password reset OTP is ${otp}. This OTP will expire in 10 minutes.`,
});

    return NextResponse.json(
      {
        message: "OTP generated successfully.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Something went wrong while processing your request." },
      { status: 500 }
    );
  }
}