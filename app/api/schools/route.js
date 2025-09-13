import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "@/app/lib/requireAuth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reusable image upload function
async function uploadImage(file) {
  if (!file || !file.name) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploaded = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "schools" }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .end(buffer);
  });

  return uploaded.secure_url;
}

// ------------------ ADD SCHOOL ------------------
export async function POST(req) {
  await requireAuth();

  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const contact = formData.get("contact");
    const email_id = formData.get("email_id");
    const file = formData.get("image");

    // Check duplicate email
    const existingSchool = await prisma.school.findUnique({ where: { email_id } });
    if (existingSchool) {
      return NextResponse.json({ error: "A school with this email_id already exists" }, { status: 400 });
    }

    const imageUrl = await uploadImage(file);

    const school = await prisma.school.create({
      data: { name, address, city, state, contact, email_id, image: imageUrl },
    });

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create school", details: error.message }, { status: 500 });
  }
}

// ------------------ GET SCHOOL ------------------
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Fetch single school by ID
      const school = await prisma.school.findUnique({ where: { id: Number(id) } });
      if (!school) {
        return NextResponse.json({ error: "School not found" }, { status: 404 });
      }
      return NextResponse.json(school);
    }

    // Fetch all schools if no ID
    const schools = await prisma.school.findMany();
    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 });
  }
}

// ------------------ EDIT SCHOOL ------------------
export async function PUT(req) {
  await requireAuth();

  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const contact = formData.get("contact");
    const email_id = formData.get("email_id");
    const file = formData.get("image");

    const existingSchool = await prisma.school.findUnique({ where: { id: Number(id) } });
    if (!existingSchool) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const imageUrl = file?.name ? await uploadImage(file) : existingSchool.image;

    const updatedSchool = await prisma.school.update({
      where: { id: Number(id) },
      data: { name, address, city, state, contact, email_id, image: imageUrl },
    });

    return NextResponse.json(updatedSchool, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update school", details: error.message }, { status: 500 });
  }
}
