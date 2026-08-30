import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { email, new_password } = await request.json();

    // Check required fields
    if (!email || !new_password) {
      return NextResponse.json(
        { message: "Email and new password are required." },
        { status: 400 }
      );
    }

    // Check password length
    if (new_password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
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
        { message: "User not found." },
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

    // Check whether OTP was verified
    const [otpRecords] = await db.execute(
      `SELECT id
       FROM password_otps
       WHERE user_id = ?
       AND is_used = 1
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    );

    if (otpRecords.length === 0) {
      return NextResponse.json(
        { message: "Please verify the OTP first." },
        { status: 403 }
      );
    }

    // Hash new password
    const password_hash = await bcrypt.hash(new_password, 10);

    // Update password
    await db.execute(
      `UPDATE users
       SET password_hash = ?
       WHERE id = ?`,
      [password_hash, user.id]
    );

    // Delete OTP after successful password reset
    await db.execute(
      `DELETE FROM password_otps
       WHERE user_id = ?`,
      [user.id]
    );

    return NextResponse.json(
      {
        message: "Password reset successfully.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while resetting your password.",
      },
      { status: 500 }
    );
  }
}