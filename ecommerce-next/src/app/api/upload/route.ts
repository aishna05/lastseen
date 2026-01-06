import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
// Cloudinary SDK requires Node APIs (Buffer, streams). Force Node runtime.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary env vars missing in upload route");
      return NextResponse.json({ error: "Server misconfiguration: missing Cloudinary credentials" }, { status: 500 });
    }

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "uploads" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          ).end(buffer);
        });

        uploadedUrls.push(result.secure_url);
      } catch (innerErr) {
        console.error("Upload error for one file:", innerErr);
        // continue with other files
      }
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: "Upload failed", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
