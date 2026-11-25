import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getJwtSecret } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

async function seedDefaultAdminIfEmpty() {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "nivoseas@admin123";
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash, role: "admin" });
  }
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, { limit: 20, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  try {
    await connectDB();
    await seedDefaultAdminIfEmpty();

    const body = await req.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { role: admin.role || "admin", username: admin.username },
      getJwtSecret(),
      { algorithm: "HS256", expiresIn: "24h" }
    );

    const res = NextResponse.json({
      success: true,
      user: { username: admin.username, role: admin.role },
    });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return res;
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json(
      { success: false, error: "Login failed." },
      { status: 500 }
    );
  }
}
