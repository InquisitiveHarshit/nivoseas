import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { checkRateLimit } from "@/lib/rate-limit";

  export async function GET(request: Request) {
    const rl = checkRateLimit(request, { limit: 60, windowMs: 60 * 1000 });
    if (rl.response) return rl.response;

    const uri = process.env.MONGODB_URI ?? "";
    const isPlaceholder = !uri || uri.includes("<YOUR-CLUSTER>");

    if (isPlaceholder) {
      return NextResponse.json(
        {
          success: false,
          mongodb: "not_configured",
          message:
            "MONGODB_URI is still a placeholder. Open .env.local and replace <YOUR-CLUSTER> " +
            "with your Atlas cluster host, then restart the dev server.",
          expected_format:
            "mongodb+srv://website:nivoseasdbforadmin@cluster0.xxxxx.mongodb.net/nivoseas?retryWrites=true&w=majority",
        },
        { status: 503 }
      );
    }

    try {
      await connectDB();
      const state = mongoose.connection.readyState;
      const stateMap: Record<number, string> = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
      };
      return NextResponse.json({
        success: state === 1,
        mongodb: stateMap[state] ?? "unknown",
        database: mongoose.connection.name,
      });
    } catch (error: unknown) {
      return NextResponse.json(
        {
          success: false,
          mongodb: "connection_failed",
          error: (error as Error).message,
          hint: "Check your MONGODB_URI, Atlas network access (IP whitelist), and cluster status.",
        },
        { status: 500 }
      );
    }
  }
