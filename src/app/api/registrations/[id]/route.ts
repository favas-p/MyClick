import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Registration from "@/models/Registration";
import { isAdminAuthenticated } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

// GET single registration by ID
export async function GET(req: Request, { params }: Params) {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const registration = await Registration.findById(params.id);

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, registration });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// PUT update registration by ID
export async function PUT(req: Request, { params }: Params) {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const registration = await Registration.findById(params.id);
    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (body.title !== undefined) registration.title = body.title;
    if (body.subtitle !== undefined) registration.subtitle = body.subtitle;
    if (body.googleFormUrl !== undefined) registration.googleFormUrl = body.googleFormUrl;
    if (body.about !== undefined) registration.about = body.about;
    if (body.contact !== undefined) registration.contact = body.contact;
    if (body.terms !== undefined) registration.terms = body.terms;
    if (body.isActive !== undefined) registration.isActive = Boolean(body.isActive);

    await registration.save();

    return NextResponse.json({ success: true, registration });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// DELETE registration by ID
export async function DELETE(req: Request, { params }: Params) {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const registration = await Registration.findByIdAndDelete(params.id);

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Registration deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
