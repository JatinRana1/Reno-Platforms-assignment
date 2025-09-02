import { NextResponse } from "next/server";
import prisma from '@/app/lib/prisma'
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const contact = formData.get("contact");
    const email_id = formData.get("email_id");
    const file = formData.get("image");

    // 🔎 1. Check if email already exists
    const existingSchool = await prisma.school.findUnique({
      where: { email_id },
    });

    if (existingSchool) {
      return NextResponse.json(
        { error: "A school with this email_id already exists" },
        { status: 400 }
      );
    }

    // 🖼️ 2. Only save file if email is unique
    let fileName = null;
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
    }

    // 🗄️ 3. Create school in DB
    const school = await prisma.school.create({
      data: {
        name,
        address,
        city,
        state,
        contact,
        email_id,
        image: fileName,
      },
    });

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const schools = await prisma.school.findMany();
    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 });
  }
}
