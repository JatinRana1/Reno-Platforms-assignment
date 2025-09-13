import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email & OTP required" }, { status: 400 });
    }

    const record = await prisma.otp.findFirst({
      where: { email, otp },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const isExpired = new Date().getTime() - new Date(record.createdAt).getTime() > 5 * 60 * 1000;
    if (isExpired) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "OTP verification failed" }, { status: 500 });
  }
}
