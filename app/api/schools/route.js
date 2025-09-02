import { NextResponse } from "next/server";
import prisma from '@/app/lib/prisma'
import { writeFile } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// export async function POST(req) {
//   try {
//     const formData = await req.formData();

//     const name = formData.get("name");
//     const address = formData.get("address");
//     const city = formData.get("city");
//     const state = formData.get("state");
//     const contact = formData.get("contact");
//     const email_id = formData.get("email_id");
//     const file = formData.get("image");

//     // 🔎 1. Check if email already exists
//     const existingSchool = await prisma.school.findUnique({
//       where: { email_id },
//     });

//     if (existingSchool) {
//       return NextResponse.json(
//         { error: "A school with this email_id already exists" },
//         { status: 400 }
//       );
//     }

//     // 🖼️ 2. Upload image to Cloudinary
//     let imageUrl = null;
//     if (file && file.name) {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const uploaded = await new Promise((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream({ folder: "schools" }, (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           })
//           .end(buffer);
//       });

//       imageUrl = uploaded.secure_url; // ✅ permanent image URL
//     }

//     // 🗄️ 3. Save to DB
//     const school = await prisma.school.create({
//       data: {
//         name,
//         address,
//         city,
//         state,
//         contact,
//         email_id,
//         image: imageUrl,
//       },
//     });

//     return NextResponse.json(school, { status: 201 });
//   } catch (error) {
//     console.error("Error:", error);

//     return NextResponse.json(
//       { error: "Failed to create school" },
//       { status: 500 }
//     );
//   }
// }


export async function POST(req) {
  try {
    console.log("📥 Incoming request...");

    const formData = await req.formData();
    console.log("✅ FormData received");

    const name = formData.get("name");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const contact = formData.get("contact");
    const email_id = formData.get("email_id");
    const file = formData.get("image");

    console.log("➡️ Parsed fields:", { name, email_id, hasFile: !!file });

    // 🔎 1. Check if email already exists
    const existingSchool = await prisma.school.findUnique({
      where: { email_id },
    });

    if (existingSchool) {
      console.warn("⚠️ Email already exists:", email_id);
      return NextResponse.json(
        { error: "A school with this email_id already exists" },
        { status: 400 }
      );
    }

    // 🖼️ 2. Upload image to Cloudinary
    let imageUrl = null;
    if (file && file.name) {
      try {
        console.log("📤 Uploading image to Cloudinary...");
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploaded = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "schools" }, (error, result) => {
              if (error) {
                console.error("❌ Cloudinary upload failed:", error);
                reject(error);
              } else {
                console.log("✅ Cloudinary upload success:", result.secure_url);
                resolve(result);
              }
            })
            .end(buffer);
        });

        imageUrl = uploaded.secure_url;
      } catch (uploadError) {
        console.error("🚨 Upload error:", uploadError);
        return NextResponse.json(
          { error: "Image upload failed", details: uploadError.message },
          { status: 500 }
        );
      }
    } else {
      console.log("ℹ️ No image uploaded, skipping Cloudinary.");
    }

    // 🗄️ 3. Save to DB
    console.log("💾 Saving school to DB...");
    const school = await prisma.school.create({
      data: {
        name,
        address,
        city,
        state,
        contact,
        email_id,
        image: imageUrl,
      },
    });

    console.log("✅ School created:", school);

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error("🚨 Unexpected Error:", error);

    return NextResponse.json(
      { error: "Failed to create school", details: error.message },
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
