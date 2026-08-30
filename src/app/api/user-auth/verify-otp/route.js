import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    // Check required fields
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const [users] = await db.execute(
      `SELECT id, is_active
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

    // Check account status
    if (!user.is_active) {
      return NextResponse.json(
        { message: "Your account is inactive." },
        { status: 403 }
      );
    }

    // Find latest unused OTP
    const [otps] = await db.execute(
      `SELECT id, otp_hash, expires_at
       FROM password_otps
       WHERE user_id = ?
       AND is_used = 0
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    );

    if (otps.length === 0) {
      return NextResponse.json(
        { message: "No valid OTP found. Please request a new OTP." },
        { status: 400 }
      );
    }

    const otpRecord = otps[0];

    // Check OTP expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      await db.execute(
        `DELETE FROM password_otps
         WHERE id = ?`,
        [otpRecord.id]
      );

      return NextResponse.json(
        { message: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Compare entered OTP with stored hash
    const otpMatch = await bcrypt.compare(
      otp.toString(),
      otpRecord.otp_hash
    );

    if (!otpMatch) {
      return NextResponse.json(
        { message: "Invalid OTP." },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await db.execute(
      `UPDATE password_otps
       SET is_used = 1
       WHERE id = ?`,
      [otpRecord.id]
    );

    return NextResponse.json(
      {
        message: "OTP verified successfully.",
        user_id: user.id,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while verifying the OTP.",
      },
      { status: 500 }
    );
  }
}