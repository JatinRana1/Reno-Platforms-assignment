import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import nodemailer from "nodemailer";
import prisma from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const otp = randomInt(100000, 999999).toString();

    // Save OTP in DB
    await prisma.otp.create({
      data: {
        email,
        otp,
      },
    });

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
