import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Registration from "@/models/Registration";
import { isAdminAuthenticated } from "@/lib/auth";

// Helper to generate slug from title
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET all registrations (Admin only)
export async function GET() {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const registrations = await Registration.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, registrations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// POST create new registration (Admin only)
export async function POST(req: Request) {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, subtitle, customSlug, googleFormUrl, about, contact, terms, isActive } = body;

    if (!title || !googleFormUrl) {
      return NextResponse.json(
        { error: "Community Title and Google Form URL are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Determine slug
    let slug = customSlug ? generateSlug(customSlug) : generateSlug(title);
    if (!slug) {
      slug = `reg-${Date.now()}`;
    }

    // Check slug collision
    const existing = await Registration.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const registration = await Registration.create({
      title,
      subtitle: subtitle || "",
      slug,
      googleFormUrl,
      about: about || "",
      contact: contact || {},
      terms: terms || "",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
