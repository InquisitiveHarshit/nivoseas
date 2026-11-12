import { NextResponse } from "next/server";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/lib/products-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase();

    let products = getAllProducts();

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    if (query) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.subcategory?.toLowerCase().includes(query) ||
          p.tagline?.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: "Product name and category are required" },
        { status: 400 }
      );
    }

    const created = addProduct(body);

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create product" },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required for update" },
        { status: 400 }
      );
    }

    const updated = updateProduct(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update product" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID or slug is required" },
        { status: 400 }
      );
    }

    const deleted = deleteProduct(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

