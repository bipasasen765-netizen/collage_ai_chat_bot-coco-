import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT 1 AS connected");

    return Response.json({
      success: true,
      message: "MySQL connected successfully!😁 by Bipasa sen",
      result: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return Response.json(
      {
        success: false,
        message: "MySQL connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}