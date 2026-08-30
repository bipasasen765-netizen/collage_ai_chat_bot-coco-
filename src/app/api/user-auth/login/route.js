import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import crypto from "crypto";
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Check required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user
    const [users] = await db.execute(
      `SELECT id, name, email, password_hash, role, is_active
       FROM users
       WHERE email = ?`,
      [email.trim()]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
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

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");

const expiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000
);

await db.execute(
  `INSERT INTO user_sessions
   (user_id, session_token, expires_at)
   VALUES (?, ?, ?)`,
  [user.id, sessionToken, expiresAt]
);

    // Successful login
   const response = NextResponse.json(
  {
    message: "Login successful!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  },
  { status: 200 }
);

response.cookies.set({
  name: "session_token",
  value: sessionToken,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
});

return response;

  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Something went wrong while logging in." },
      { status: 500 }
    );
  }
}