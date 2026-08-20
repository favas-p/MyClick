import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import AdminConfig from "@/models/AdminConfig";
import { comparePassword, hashPassword, signAdminToken, TOKEN_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    try {
      await dbConnect();
    } catch (e) {
      console.warn("DB connection failed during login, checking ENV fallback:", e);
    }

    let isValid = false;

    // Check DB first
    let adminRecord = null;
    try {
      adminRecord = await AdminConfig.findOne();
    } catch {
      adminRecord = null;
    }

    if (adminRecord) {
      isValid = await comparePassword(password, adminRecord.passwordHash);
    } else {
      // Fallback to default env password
      const envPassword = process.env.ADMIN_PASSWORD || "admin123";
      isValid = password === envPassword;

      if (isValid) {
        // Initialize AdminConfig in DB for future password changes
        try {
          const hashed = await hashPassword(envPassword);
          await AdminConfig.create({ passwordHash: hashed });
        } catch (e) {
          console.warn("Could not save initial admin config to DB:", e);
        }
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    const token = signAdminToken();
    const response = NextResponse.json({ success: true, message: "Logged in successfully" });

    response.cookies.set({
      name: TOKEN_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
