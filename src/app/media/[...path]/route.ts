import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    return NextResponse.json(
      { success: false, error: "Cloudinary cloud name not configured." },
      { status: 500 }
    );
  }

  const { path } = await context.params;
  if (!path || path.length === 0) {
    return NextResponse.json({ success: false, error: "Missing path." }, { status: 400 });
  }

  const joinedPath = path.map((seg) => encodeURIComponent(seg)).join("/");
  const targetUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${joinedPath}`;

  try {
    const upstream = await fetch(targetUrl, {
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new NextResponse("Image not found", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "image/webp";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("[GET /media/[...path]]", err);
    return new NextResponse("Failed to fetch media", { status: 502 });
  }
}
