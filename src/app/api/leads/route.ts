import { NextResponse } from "next/server";
import { getDbLeads, createLead, updateLead, deleteLead } from "@/lib/leads-store";
import { checkRateLimit } from "@/lib/rate-limit";

// GET /api/leads — Fetch all leads sorted by newest first
export async function GET(request: Request) {
  try {
    const leads = await getDbLeads();
    return NextResponse.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    console.error("[GET /api/leads]", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST /api/leads — Capture a new lead from contact form / whatsapp / product enquiry
export async function POST(request: Request) {
  const rl = checkRateLimit(request, { limit: 60, windowMs: 60 * 1000 });
  if (rl.response) return rl.response;

  try {
    const body = await request.json();
    const { name, phone, email, projectType, message, productName, productId, source } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    const lead = await createLead({
      name,
      phone,
      email,
      projectType,
      message,
      productName,
      productId,
      source,
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

// PATCH /api/leads — Update lead status or notes
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Lead ID is required" },
        { status: 400 }
      );
    }

    const success = await updateLead(id, { status, notes });
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Lead updated successfully" });
  } catch (err) {
    console.error("[PATCH /api/leads]", err);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

// DELETE /api/leads?id=... — Delete a lead
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lead ID parameter is required" },
        { status: 400 }
      );
    }

    const success = await deleteLead(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Lead not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    console.error("[DELETE /api/leads]", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
