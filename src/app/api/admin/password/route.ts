import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import AdminConfig from "@/models/AdminConfig";
import { comparePassword, hashPassword, isAdminAuthenticated } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: "New password must be at least 4 characters" }, { status: 400 });
    }

    await dbConnect();

    let adminRecord = await AdminConfig.findOne();

    if (adminRecord) {
      const isValid = await comparePassword(currentPassword, adminRecord.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }
      adminRecord.passwordHash = await hashPassword(newPassword);
      await adminRecord.save();
    } else {
      const envPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (currentPassword !== envPassword) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }
      const newHash = await hashPassword(newPassword);
      await AdminConfig.create({ passwordHash: newHash });
    }

    return NextResponse.json({ success: true, message: "Admin password updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
