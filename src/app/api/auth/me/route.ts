import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await authenticateAdmin(req);
  if (auth.error) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status }
    );
  }

  return NextResponse.json({
    success: true,
    user: auth.user,
  });
}
