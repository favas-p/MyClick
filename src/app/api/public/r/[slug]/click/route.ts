import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Registration from "@/models/Registration";

interface Params {
  params: {
    slug: string;
  };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const slug = params.slug.toLowerCase().trim();
    await dbConnect();

    await Registration.findOneAndUpdate({ slug }, { $inc: { clickCount: 1 } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
