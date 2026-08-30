import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const {
      account_type,
      college_id,
      name,
      email,
      password,
      department,
      semester,
      is_teacher,
      is_admin,
    } = await request.json();

    // --------------------------------
    // 1. Common required fields
    // --------------------------------
    if (!account_type || !college_id || !name || !email || !password) {
      return NextResponse.json(
        { message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    // ==========================================
    // STUDENT SIGNUP
    // ==========================================
    if (account_type === "student") {
      if (!department || !semester) {
        return NextResponse.json(
          { message: "Department and semester are required." },
          { status: 400 }
        );
      }

      // Check student registry
      const [students] = await db.execute(
        `SELECT 
            sr.*,
            d.name AS department_name
         FROM student_registry sr
         JOIN departments d
           ON sr.department_id = d.id
         WHERE sr.college_id = ?
           AND sr.email = ?`,
        [college_id.trim(), email.trim()]
      );

      if (students.length === 0) {
        return NextResponse.json(
          {
            message:
              "Student not found in college registry. You are not allowed to sign up.",
          },
          { status: 403 }
        );
      }

      const student = students[0];

      // Check name
      if (
        student.name.trim().toLowerCase() !==
        name.trim().toLowerCase()
      ) {
        return NextResponse.json(
          {
            message: "The name does not match the college registry.",
          },
          { status: 403 }
        );
      }

      // Check department
      if (
        student.department_name.trim().toLowerCase() !==
        department.trim().toLowerCase()
      ) {
        return NextResponse.json(
          {
            message:
              "The department does not match the college registry.",
          },
          { status: 403 }
        );
      }

      // Check semester
      if (Number(student.semester) !== Number(semester)) {
        return NextResponse.json(
          {
            message:
              "The semester does not match the college registry.",
          },
          { status: 403 }
        );
      }

      // Check whether already registered
      if (student.registration_status === "registered") {
        return NextResponse.json(
          {
            message: "This student has already created an account.",
          },
          { status: 409 }
        );
      }

      // Check whether email already exists in users
      const [existingUsers] = await db.execute(
        `SELECT id FROM users WHERE email = ?`,
        [email.trim()]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          {
            message: "An account with this email already exists.",
          },
          { status: 409 }
        );
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user account
      const [result] = await db.execute(
        `INSERT INTO users
         (name, email, password_hash, role, is_active)
         VALUES (?, ?, ?, 'student', TRUE)`,
        [name.trim(), email.trim(), password_hash]
      );

      // Connect registry record to user
      await db.execute(
        `UPDATE student_registry
         SET registration_status = 'registered',
             user_id = ?
         WHERE id = ?`,
        [result.insertId, student.id]
      );

   // Create the student profile
await db.execute(
  `INSERT INTO students
   (college_id, name, email, department_id, semester, user_id)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    student.college_id,
    student.name,
    student.email,
    student.department_id,
    student.semester,
    result.insertId,
  ]
);

      return NextResponse.json(
        {
          message: "Student account created successfully!",
          user_id: result.insertId,
        },
        { status: 201 }
      );
    }

    // ==========================================
    // STAFF SIGNUP
    // ==========================================
    if (account_type === "staff") {
      // At least one role must be selected
      if (!is_teacher && !is_admin) {
        return NextResponse.json(
          {
            message: "Please select Teacher, Admin, or both.",
          },
          { status: 400 }
        );
      }

      // Check staff registry
      const [staffMembers] = await db.execute(
        `SELECT *
         FROM staff_registry
         WHERE college_id = ?
           AND email = ?`,
        [college_id.trim(), email.trim()]
      );

      if (staffMembers.length === 0) {
        return NextResponse.json(
          {
            message:
              "Staff member not found in college registry. You are not allowed to sign up.",
          },
          { status: 403 }
        );
      }

      const staff = staffMembers[0];

      // Check name
      if (
        staff.name.trim().toLowerCase() !==
        name.trim().toLowerCase()
      ) {
        return NextResponse.json(
          {
            message: "The name does not match the staff registry.",
          },
          { status: 403 }
        );
      }

      // Check selected roles against registry
      if (
        Boolean(is_teacher) !== Boolean(staff.is_teacher) ||
        Boolean(is_admin) !== Boolean(staff.is_admin)
      ) {
        return NextResponse.json(
          {
            message:
              "The selected staff role does not match the college registry.",
          },
          { status: 403 }
        );
      }

      // Check authorization
      if (!staff.is_authorized) {
        return NextResponse.json(
          {
            message:
              "Your staff account has not been authorized by the college.",
          },
          { status: 403 }
        );
      }

      // Check whether staff already has an account
      if (staff.user_id !== null) {
        return NextResponse.json(
          {
            message: "This staff member has already created an account.",
          },
          { status: 409 }
        );
      }

      // Check email in users
      const [existingUsers] = await db.execute(
        `SELECT id FROM users WHERE email = ?`,
        [email.trim()]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          {
            message: "An account with this email already exists.",
          },
          { status: 409 }
        );
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // users.role can store one main role.
      // If both are selected, we use teacher as the main role.
      const userRole = is_admin ? "admin" : "teacher";

      // Create staff account
      const [result] = await db.execute(
        `INSERT INTO users
         (name, email, password_hash, role, is_active)
         VALUES (?, ?, ?, ?, TRUE)`,
        [
          name.trim(),
          email.trim(),
          password_hash,
          userRole,
        ]
      );

      // Connect staff registry to user
      await db.execute(
        `UPDATE staff_registry
         SET user_id = ?
         WHERE id = ?`,
        [result.insertId, staff.id]
      );
      
      // Create staff profile
await db.execute(
  `INSERT INTO staff
   (college_id, name, email, is_teacher, is_admin, is_authorized, user_id)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    staff.college_id,
    staff.name,
    staff.email,
    staff.is_teacher,
    staff.is_admin,
    staff.is_authorized,
    result.insertId,
  ]
);

      return NextResponse.json(
        {
          message: "Staff account created successfully!",
          user_id: result.insertId,
          is_teacher: Boolean(staff.is_teacher),
          is_admin: Boolean(staff.is_admin),
        },
        { status: 201 }
      );
    }

    // ==========================================
    // INVALID ACCOUNT TYPE
    // ==========================================
    return NextResponse.json(
      {
        message: "Invalid account type.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while creating the account.",
      },
      { status: 500 }
    );
  }
}