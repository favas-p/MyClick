import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Registration from "@/models/Registration";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const slug = params.slug.toLowerCase().trim();
    await dbConnect();

    const registration = await Registration.findOne({ slug });

    if (!registration) {
      return NextResponse.json({ error: "Registration page not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      registration: {
        title: registration.title,
        subtitle: registration.subtitle,
        slug: registration.slug,
        googleFormUrl: registration.googleFormUrl,
        about: registration.about,
        contact: registration.contact,
        terms: registration.terms,
        isActive: registration.isActive,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
