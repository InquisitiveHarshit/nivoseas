import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  role: string;
  username?: string;
  iat: number;
  exp: number;
}

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || "nivoseas_dev_jwt_secret_change_in_prod";
}

export async function authenticateAdmin(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return { error: "Missing or invalid token in cookies.", status: 401 as const };
    }

    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    }) as JwtPayload;

    if (decoded.role !== "admin") {
      return { error: "Forbidden: Admin access required.", status: 403 as const };
    }

    return { user: decoded, error: null };
  } catch {
    return { error: "Invalid or expired token.", status: 401 as const };
  }
}
