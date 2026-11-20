import { connectDB } from "@/lib/mongodb";
import LeadModel from "@/models/Lead";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectType?: string;
  message?: string;
  productName?: string;
  productId?: string;
  status: "new" | "contacted" | "in-progress" | "closed";
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

  function docToLead(d: Record<string, unknown>): Lead {
    return {
      id: (d._id as object).toString(),
      name: d.name as string,
      phone: d.phone as string,
      email: d.email as string | undefined,
      projectType: d.projectType as string | undefined,
      message: d.message as string | undefined,
      productName: d.productName as string | undefined,
      productId: d.productId as string | undefined,
      status: d.status as Lead["status"],
      source: d.source as string | undefined,
      notes: d.notes as string | undefined,
      createdAt: d.createdAt
        ? new Date(d.createdAt as string).toISOString()
        : new Date().toISOString(),
      updatedAt: d.updatedAt
        ? new Date(d.updatedAt as string).toISOString()
        : undefined,
    };
  }

  /** Fetch all leads sorted by newest first */
  export async function getDbLeads(): Promise<Lead[]> {
    await connectDB();
    const docs = await LeadModel.find({}).sort({ createdAt: -1 }).lean();
    return (docs as unknown as Record<string, unknown>[]).map(docToLead);
  }

  /** Create a new lead */
  export async function createLead(data: {
    name: string;
    phone: string;
    email?: string;
    projectType?: string;
    message?: string;
    productName?: string;
    productId?: string;
    source?: string;
  }): Promise<Lead> {
      await connectDB();
      const created = await LeadModel.create({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || undefined,
        projectType: data.projectType?.trim() || "Residential",
        message: data.message?.trim() || "",
        productName: data.productName?.trim(),
        productId: data.productId?.trim(),
        status: "new",
        source: data.source || "contact-form",
    });
    return docToLead(created.toObject() as unknown as Record<string, unknown>);
  }

  /** Update lead status or notes */
  export async function updateLead(
    id: string,
  updates: { status?: Lead["status"]; notes?: string }
  ): Promise<boolean> {
    await connectDB();
    const res = await LeadModel.findByIdAndUpdate(
      id,
      { $set: { ...updates, updatedAt: new Date() } },
      { new: true }
    );
    return !!res;
  }

  /** Delete a lead */
  export async function deleteLead(id: string): Promise<boolean> {
    await connectDB();
    const res = await LeadModel.findByIdAndDelete(id);
    return !!res;
  }
