import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import { authenticateAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const BLOG_FOLDER = "nivoseas/blogs";

function configureCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
    return true;
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return true;
  }
  return false;
}

export async function GET(req: NextRequest) {
  const auth = await authenticateAdmin(req);
  if (auth.error) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status }
    );
  }

  if (!configureCloudinary()) {
    return NextResponse.json(
      { success: false, error: "Cloudinary credentials are not configured." },
      { status: 500 }
    );
  }

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: `${BLOG_FOLDER}/`,
      max_results: 60,
      direction: "desc",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const images = (result.resources || []).map((r: any) => {
      const ext = r.format ? `.${r.format}` : "";
      return {
        public_id: r.public_id,
        url: `/media/${r.public_id}${ext}`,
        secure_url: r.secure_url,
        created_at: r.created_at,
        width: r.width,
        height: r.height,
      };
    });

    return NextResponse.json({ success: true, data: images });
  } catch (err) {
    console.error("[GET /api/upload]", err);
    return NextResponse.json(
      { success: false, error: "Failed to load uploaded gallery." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, { limit: 30, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  const auth = await authenticateAdmin(req);
  if (auth.error) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status }
    );
  }

  if (!configureCloudinary()) {
    return NextResponse.json(
      { success: false, error: "Cloudinary credentials are not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const slugHint = formData.get("slug");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Image file is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file type. Allowed: jpeg, png, gif, webp, avif.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 5 MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const baseName =
      typeof slugHint === "string" && slugHint.trim()
        ? slugHint.trim()
        : file.name.replace(/\.[^/.]+$/, "");
    const seoSlug = slugify(baseName, { lower: true, strict: true }) || "blog-image";
    const last6 = String(Date.now()).slice(-6);
    const publicId = `${seoSlug}-${last6}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploaded: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: BLOG_FOLDER,
          public_id: publicId,
          resource_type: "image",
        },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
      stream.end(buffer);
    });

    const ext = uploaded.format ? `.${uploaded.format}` : "";
    const proxiedUrl = `/media/${uploaded.public_id}${ext}`;

    return NextResponse.json({
      success: true,
      url: proxiedUrl,
      secure_url: uploaded.secure_url,
      public_id: uploaded.public_id,
    });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json(
      { success: false, error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
