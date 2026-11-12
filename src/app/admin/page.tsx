"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FiGrid,
  FiBox,
  FiPlusCircle,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiEdit2,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
  FiMessageSquare,
  FiLayers,
  FiX,
  FiRefreshCw,
  FiArrowRight,
  FiArrowUp,
  FiArrowDown,
  FiRotateCcw,
  FiUploadCloud,
  FiImage,
  FiTag,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { Product, ProductCategory, DEFAULT_TECHNICAL_SPECS } from "@/data/products";

const CATEGORIES: { id: ProductCategory; name: string; icon: string; countHint: string }[] = [
  { id: "decorative", name: "Decorative", icon: "✨", countHint: "Chandeliers, Thali & Pendants" },
  { id: "indoor-lighting", name: "Indoor Lighting", icon: "💡", countHint: "Ceiling, Wall, Hanging, Downlight, Spot, Picture" },
  { id: "outdoor-gate", name: "Outdoor & Gate", icon: "🏡", countHint: "Weather-Rated MS & Casting" },
  { id: "commercial", name: "Commercial", icon: "🏢", countHint: "Office, Track, Panel, High Bay, Industrial" },
  { id: "architectural-led", name: "Architectural LED", icon: "🔦", countHint: "Commercial Panels & Spots" },
  { id: "led-fans", name: "LED Fans", icon: "🌀", countHint: "Integrated Ceiling Units" },
  { id: "brands", name: "Brands", icon: "🏷️", countHint: "Panasonic, GM & Other Brands" },
];

const PRESET_IMAGES = [
  { label: "Model 626/500 Crystal", url: "https://nivoseas.com/wp-content/uploads/2025/12/16-4.jpg" },
  { label: "Luxury Chandelier Lit", url: "/Minimalist Luxury Chandelier Interior.webp" },
  { label: "Modern 3-Light Fixture", url: "https://nivoseas.com/wp-content/uploads/2024/01/nivoseas-109-3.jpg" },
  { label: "Rose Gold Designer", url: "https://nivoseas.com/wp-content/uploads/2024/01/jl8558-rose-gold.jpg" },
  { label: "LED Gate Luminaire", url: "https://nivoseas.com/wp-content/uploads/2024/01/led-prince-gate.jpg" },
  { label: "Architectural LED Panel", url: "https://nivoseas.com/wp-content/uploads/2024/01/panasonic-led-panel.jpg" },
];

const DEFAULT_IMAGES = [
  "https://nivoseas.com/wp-content/uploads/2024/01/jl8558-rose-gold.jpg",
  "/Minimalist Luxury Chandelier Interior.webp",
  "https://nivoseas.com/wp-content/uploads/2025/12/16-4.jpg",
];

export default function AdminPage() {
  const [activeView, setActiveView] = useState<"overview" | "inventory" | "add" | "enquiry">("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit Mode state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Inline SKU editing in inventory table
  const [inlineSkuEdit, setInlineSkuEdit] = useState<{ id: string; value: string } | null>(null);

  const handleInlineSkuSave = async (productId: string) => {
    if (!inlineSkuEdit) return;
    const newSku = inlineSkuEdit.value.trim().toUpperCase();
    if (!newSku) { setInlineSkuEdit(null); return; }

    // Duplicate check
    const dup = products.find(
      (p) => p.id !== productId &&
        ((p.sku && p.sku.toLowerCase() === newSku.toLowerCase()) || p.id.toLowerCase() === newSku.toLowerCase())
    );
    if (dup) {
      setFeedback({ type: "error", text: `SKU "${newSku}" is already used by "${dup.name}".` });
      setInlineSkuEdit(null);
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, sku: newSku }),
      });
      const result = await res.json();
      if (result.success) {
        setFeedback({ type: "success", text: `SKU updated to "${newSku}".` });
        await fetchProducts();
      } else {
        setFeedback({ type: "error", text: result.error || "Failed to update SKU." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error." });
    }
    setInlineSkuEdit(null);
  };

  // Form State
  const [sku, setSku] = useState("CHGM2749");
  const [name, setName] = useState("Luxury Rose Gold & Crystal Chandelier (CHGM2749)");
  const [category, setCategory] = useState<ProductCategory>("decorative");
  const [subcategory, setSubcategory] = useState("Chandelier");
  const [tagline, setTagline] = useState("Handcrafted rose gold and clear crystal tiers with 12-bulb refractive illumination.");
  const [description, setDescription] = useState(
    "An opulent statement chandelier combining precision-cut faceted crystals with a handcrafted rose gold, black, and clear metalwork base. Features 12 E14 bulb holders, height-adjustable suspension from 52 to 90 inches, and mains dimming capability for bespoke architectural living spaces, grand dining halls, and double-height foyers."
  );
  const [featuresText, setFeaturesText] = useState(
    "12-bulb E14 multi-tier refractive crystal lighting arrangement\nAdjustable suspension height from 52 inches up to 90 inches\nHandcrafted base in rose gold, deep black, and optical crystal\nCompatible with 4W to 9W LED E14 bulbs (220-240V)\nSupports smooth dimming directly from the main electric supply\nSupplied with complete installation materials and 1.5m PVC suspension wire"
  );
  const [wattage, setWattage] = useState("12 × E14 Bulbs (4-9W Recommended) / Up to 108W");
  const [colourTemp, setColourTemp] = useState("Warm White / Dimmable");
  const [material, setMaterial] = useState("Metal & Crystal (Rose Gold, Black & Clear)");
  const [warranty, setWarranty] = useState("12 Months Authentic Warranty");
  const [moq, setMoq] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  // View toggles: Live Preview hidden until requested, Specs table collapsible
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [isSpecsDropdownOpen, setIsSpecsDropdownOpen] = useState(false);

  // Technical Specifications (Ordered Table)
  const [techSpecs, setTechSpecs] = useState<{ id: string; label: string; value: string }[]>(() =>
    DEFAULT_TECHNICAL_SPECS.map((s, idx) => ({ id: `spec-${idx}`, label: s.label, value: s.value }))
  );

  const moveSpecRow = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= techSpecs.length) return;
    const updated = [...techSpecs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setTechSpecs(updated);
  };

  const addSpecRow = () => {
    setTechSpecs((prev) => [
      ...prev,
      { id: `spec-${Date.now()}`, label: "Specification Item", value: "" },
    ]);
  };

  const removeSpecRow = (index: number) => {
    setTechSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpecRow = (index: number, field: "label" | "value", val: string) => {
    setTechSpecs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const resetSpecRows = () => {
    setTechSpecs(
      DEFAULT_TECHNICAL_SPECS.map((s, idx) => ({ id: `spec-${idx}`, label: s.label, value: s.value }))
    );
  };

  // Dynamic Gallery Images state (not strictly 5: supports 1, 2, 3, 5 or more)
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_IMAGES);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  const addImageSlot = () => {
    setGalleryImages((prev) => [...prev, ""]);
  };

  const removeImageSlot = (index: number) => {
    if (galleryImages.length <= 1) {
      updateSlotImage(0, "");
      return;
    }
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to connect to backend product store." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Start Editing a product
  const startEditing = (p: Product) => {
    setEditingId(p.id);
    setSku(p.sku || p.id);
    setName(p.name);
    setCategory(p.category);
    setSubcategory(p.subcategory || "");
    setTagline(p.tagline || "");
    setDescription(p.description || "");
    setFeaturesText(p.features && p.features.length > 0 ? p.features.join("\n") : "");
    setWattage(p.wattage || "");
    setColourTemp(p.colourTemp || "");
    setMaterial(p.material || "");
    setWarranty(p.warranty || "");
    setMoq(p.moq?.toString() || "1");

    // Load technical specs with Suggestive Usage autofilled in table
    if (p.technicalSpecs && p.technicalSpecs.length > 0) {
      const loaded = p.technicalSpecs.map((s, idx) => ({
        id: `spec-${idx}-${Date.now()}`,
        label:
          s.label.toLowerCase() === "environment" ||
            s.label.toLowerCase() === "environment application"
            ? "Suggestive Usage"
            : s.label,
        value: s.value,
      }));
      if (!loaded.some((r) => r.label.toLowerCase() === "suggestive usage")) {
        loaded.push({
          id: `spec-usage-${Date.now()}`,
          label: "Suggestive Usage",
          value: p.suggestiveUsage || "Indoor - Living Room, Dining Area & Foyer",
        });
      }
      setTechSpecs(loaded);
    } else if (p.specs && Object.keys(p.specs).length > 0) {
      const loaded = Object.entries(p.specs).map(([label, value], idx) => ({
        id: `spec-${idx}-${Date.now()}`,
        label:
          label.toLowerCase() === "environment" ||
            label.toLowerCase() === "environment application"
            ? "Suggestive Usage"
            : label,
        value,
      }));
      if (!loaded.some((r) => r.label.toLowerCase() === "suggestive usage")) {
        loaded.push({
          id: `spec-usage-${Date.now()}`,
          label: "Suggestive Usage",
          value: p.suggestiveUsage || "Indoor - Living Room, Dining Area & Foyer",
        });
      }
      setTechSpecs(loaded);
    } else {
      resetSpecRows();
    }

    // Load exact number of images: if 2 then 2, if 3 then 3, if 5 then 5 (not strictly 5)
    const imgs = p.images && p.images.length > 0 ? [...p.images] : [""];
    setGalleryImages(imgs);

    setSelectedProduct(null);
    setActiveView("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingId(null);
    setSku("");
    setName("");
    setTagline("");
    setDescription("");
    setFeaturesText("");
    setWattage("");
    setMaterial("");
    resetSpecRows();
    setGalleryImages(DEFAULT_IMAGES);
    setActiveView("inventory");
  };

  // Upload image to Cloudinary (or fallback)
  const handleFileUpload = async (slotIndex: number, file: File) => {
    setUploadingSlot(slotIndex);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "nivoseas_products";

    if (cloudName && uploadPreset) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          updateSlotImage(slotIndex, data.secure_url);
          setFeedback({ type: "success", text: `Photo ${slotIndex + 1} uploaded to Cloudinary successfully!` });
          setUploadingSlot(null);
          return;
        }
      } catch (err) {
        console.warn("Cloudinary upload error, using local data reader:", err);
      }
    }

    // Local Data URL reader fallback
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        updateSlotImage(slotIndex, result);
        setFeedback({ type: "success", text: `Photo ${slotIndex + 1} loaded.` });
      }
      setUploadingSlot(null);
    };
    reader.onerror = () => {
      setFeedback({ type: "error", text: "Failed to read image file." });
      setUploadingSlot(null);
    };
    reader.readAsDataURL(file);
  };

  const updateSlotImage = (index: number, val: string) => {
    setGalleryImages((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSku = sku.trim().toUpperCase();
    if (!trimmedSku) {
      setFeedback({ type: "error", text: "Please provide a valid SKU / Model Number (e.g. CHGM2749)." });
      return;
    }

    if (!name.trim()) {
      setFeedback({ type: "error", text: "Please provide a valid product name." });
      return;
    }

    // Client-side duplicate SKU check
    const duplicate = products.find(
      (p) =>
        (editingId ? p.id !== editingId : true) &&
        ((p.sku && p.sku.toLowerCase() === trimmedSku.toLowerCase()) ||
          p.id.toLowerCase() === trimmedSku.toLowerCase())
    );
    if (duplicate) {
      setFeedback({
        type: "error",
        text: `Duplicate SKU: "${trimmedSku}" already exists on "${duplicate.name}". Each luminaire must have a unique SKU.`,
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    // Filter valid images
    const validImages = galleryImages.map((s) => s.trim()).filter(Boolean);
    const finalImages = validImages.length > 0 ? validImages : ["/Minimalist Luxury Chandelier Interior.webp"];

    // Split features line by line
    const parsedFeatures = featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Filter valid tech specs
    const validTechSpecs = techSpecs
      .filter((row) => row.label.trim().length > 0 && row.value.trim().length > 0)
      .map((row) => ({ label: row.label.trim(), value: row.value.trim() }));

    // Extract suggestive usage directly from table row
    const usageRow = validTechSpecs.find(
      (r) =>
        r.label.toLowerCase() === "suggestive usage" ||
        r.label.toLowerCase().includes("usage")
    );
    const suggestiveUsageVal = usageRow ? usageRow.value : "Indoor - Living Room, Dining Area & Foyer";
    const isOutdoor = suggestiveUsageVal.toLowerCase().includes("outdoor");
    const isIndoor = suggestiveUsageVal.toLowerCase().includes("indoor");
    const derivedUsage = isIndoor && isOutdoor ? "both" : isOutdoor ? "outdoor" : "indoor";

    const payload = {
      ...(editingId ? { id: editingId } : {}),
      sku: trimmedSku,
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || undefined,
      tagline: tagline.trim() || undefined,
      description: description.trim() || undefined,
      features: parsedFeatures.length > 0 ? parsedFeatures : undefined,
      wattage: wattage.trim() || undefined,
      colourTemp: colourTemp.trim() || undefined,
      material: material.trim() || undefined,
      warranty: warranty.trim() || undefined,
      suggestiveUsage: suggestiveUsageVal,
      usage: derivedUsage,
      moq: parseInt(moq, 10) || 1,
      images: finalImages,
      technicalSpecs: validTechSpecs,
      featured: true,
    };

    try {
      const isEdit = Boolean(editingId);
      const res = await fetch("/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setFeedback({
          type: "success",
          text: isEdit
            ? `Luminaire "${result.data.name}" (SKU: ${result.data.sku || result.data.id}) updated successfully!`
            : `Luminaire "${result.data.name}" (SKU: ${result.data.sku || result.data.id}) published successfully!`,
        });
        setEditingId(null);
        setName("");
        setTagline("");
        setDescription("");
        setFeaturesText("");
        setGalleryImages(DEFAULT_IMAGES);
        await fetchProducts();
        setActiveView("inventory");
      } else {
        setFeedback({ type: "error", text: result.error || "Failed to save fixture." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, productName: string) => {
    if (!window.confirm(`Permanently remove "${productName}" from the catalogue?`)) return;

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", text: `Deleted "${productName}".` });
        if (selectedProduct?.id === id) setSelectedProduct(null);
        await fetchProducts();
      } else {
        setFeedback({ type: "error", text: data.error || "Could not delete product." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error occurred." });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.wattage?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, categoryFilter, search]);

  const stats = useMemo(() => {
    const total = products.length;
    const byCat = (id: string) => products.filter((p) => p.category === id).length;
    return {
      total,
      decorative: byCat("decorative"),
      indoor: byCat("indoor-lighting"),
      outdoor: byCat("outdoor-gate"),
      commercial: byCat("commercial"),
      architectural: byCat("architectural-led"),
      fans: byCat("led-fans"),
      brands: byCat("brands"),
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-[#F6F2EC] text-[#2A1810] flex flex-col lg:flex-row antialiased">
      {/* ── Left Sidebar (Dark Architectural Theme) ── */}
      <aside className="w-full lg:w-72 bg-[#1C120C] text-[#F3EDE4] flex flex-col justify-between shrink-0 border-r border-[#2A1810]/30 shadow-2xl z-20">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-black.svg"
                alt="Nivoseas Logo"
                className="h-7 w-auto object-contain brightness-0 invert group-hover:opacity-85 transition-opacity"
              />
            </Link>
            <span className="text-[10px] font-mono uppercase bg-[#C8782A]/20 text-[#C8782A] border border-[#C8782A]/30 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>

          <div className="px-4 py-6">
            <div className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#F3EDE4]/50 px-3 mb-3">
              Management
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveView("overview");
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${activeView === "overview"
                  ? "bg-[#C8782A] text-white shadow-md shadow-[#C8782A]/20"
                  : "text-[#F3EDE4]/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <FiGrid className="text-sm shrink-0" />
                <span>Overview & Analytics</span>
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveView("inventory");
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${activeView === "inventory"
                  ? "bg-[#C8782A] text-white shadow-md shadow-[#C8782A]/20"
                  : "text-[#F3EDE4]/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <FiBox className="text-sm shrink-0" />
                <span>Catalogue Inventory</span>
                <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
                  {stats.total}
                </span>
              </button>

              <button
                onClick={() => {
                  if (editingId) cancelEditing();
                  setActiveView("add");
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${activeView === "add"
                  ? "bg-[#C8782A] text-white shadow-md shadow-[#C8782A]/20"
                  : "text-[#F3EDE4]/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <FiPlusCircle className="text-sm shrink-0" />
                <span>{editingId ? "Edit Luminaire" : "Add Luminaire"}</span>
                {editingId && (
                  <span className="ml-auto text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-bold uppercase">
                    Editing
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveView("enquiry");
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${activeView === "enquiry"
                  ? "bg-[#C8782A] text-white shadow-md shadow-[#C8782A]/20"
                  : "text-[#F3EDE4]/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <FiMessageSquare className="text-sm shrink-0" />
                <span>Concierge & Leads</span>
              </button>
            </nav>
          </div >
        </div >

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/products"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#F3EDE4]/80 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiExternalLink /> View Live Catalogue
            </span>
            <span className="text-[10px] text-[#C8782A]">↗</span>
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#F3EDE4]/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span>Back to Storefront</span>
            <span>←</span>
          </Link>
        </div>
      </aside >

      {/* ── Main Content Area ── */}
      < main className="flex-1 flex flex-col min-w-0 overflow-y-auto" >
        {/* Top bar feedback banner */}
        {
          feedback && (
            <div
              className={`px-6 py-3.5 text-xs font-medium flex items-center justify-between border-b transition-all ${feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
                } `}
            >
              <div className="flex items-center gap-2">
                {feedback.type === "success" ? <FiCheckCircle className="text-emerald-600" /> : <FiAlertCircle className="text-red-600" />}
                <span>{feedback.text}</span>
              </div>
              <button onClick={() => setFeedback(null)} className="text-xs hover:opacity-75">✕</button>
            </div>
          )}

        {/* View: Overview */}
        {activeView === "overview" && (
          <div className="p-6 lg:p-10 space-y-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">
                  Atelier Dashboard
                </h1>
                <p className="text-xs text-[#4A2C1A]/70 mt-0.5">
                  Real-time lighting catalogue status for Sector 104 experience center.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={fetchProducts}
                  className="btn-3d btn-3d-outline text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5"
                >
                  <FiRefreshCw className={`text - xs ${loading ? "animate-spin" : ""} `} />
                  <span>Sync</span>
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setActiveView("add");
                  }}
                  className="btn-3d btn-3d-dark text-xs px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <FiPlusCircle className="text-sm" />
                  <span>Add Luminaire</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-[#2A1810]/10 shadow-sm col-span-2 sm:col-span-4 lg:col-span-1">
                    <div className="flex items-center justify-between text-xs text-[#4A2C1A]/70 mb-2">
                      <span>All Fixtures</span>
                      <FiLayers className="text-[#C8782A]" />
                    </div>
                    <div className="font-display text-3xl font-normal text-[#2A1810]">{stats.total}</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Live
                      </div>
                    </div>

                    {CATEGORIES.map((cat) => {
                      const count = (() => {
                        switch (cat.id) {
                          case "decorative": return stats.decorative;
                          case "indoor-lighting": return stats.indoor;
                          case "outdoor-gate": return stats.outdoor;
                          case "commercial": return stats.commercial;
                          case "architectural-led": return stats.architectural;
                          case "led-fans": return stats.fans;
                          case "brands": return stats.brands;
                          default: return 0;
                        }
                      })();
                      return (
                        <div key={cat.id} className="bg-white rounded-2xl p-4 border border-[#2A1810]/10 shadow-sm">
                          <div className="flex items-center justify-between text-xs text-[#4A2C1A]/70 mb-2">
                            <span className="line-clamp-1">{cat.name}</span>
                            <span className="text-base">{cat.icon}</span>
                          </div>
                          <div className="font-display text-2xl font-normal text-[#2A1810]">{count}</div>
                          <div className="text-[10px] text-[#4A2C1A]/60 mt-2 line-clamp-1">{cat.countHint}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Luminaires */}
                  <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#2A1810]/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-display text-xl text-[#2A1810]">Recently Updated Luminaires</h3>
                        <p className="text-xs text-[#4A2C1A]/70 mt-0.5">Live products with WhatsApp inquiry integration.</p>
                      </div>
                      <button
                        onClick={() => setActiveView("inventory")}
                        className="text-xs font-semibold text-[#C8782A] hover:underline inline-flex items-center gap-1"
                      >
                        <span>See all {stats.total} SKUs</span>
                        <FiArrowRight className="text-xs" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {products.slice(0, 4).map((p) => (
                        <div key={p.id} className="p-3.5 rounded-2xl border border-[#2A1810]/8 hover:border-[#C8782A] transition-all bg-[#F6F2EC]/30 flex flex-col justify-between group">
                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white mb-3 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.images[0] || "/Minimalist Luxury Chandelier Interior.webp"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded">
                              {p.images.length} photos
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C8782A]">{p.subcategory || p.category}</span>
                            <h4 className="font-display text-sm font-semibold text-[#2A1810] line-clamp-1 mt-0.5">{p.name}</h4>
                          </div>
                          <div className="mt-3 pt-2 border-t border-[#2A1810]/5 flex items-center justify-between text-xs">
                            <button
                              onClick={() => startEditing(p)}
                              className="text-[#C8782A] font-medium hover:underline flex items-center gap-1"
                            >
                              <FiEdit2 className="text-xs" /> Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-red-500 hover:text-red-700">
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
        )}

                {/* View: Inventory */}
                {activeView === "inventory" && (
                  <div className="p-6 lg:p-10 space-y-6 max-w-7xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">Catalogue Inventory</h1>
                        <p className="text-xs text-[#4A2C1A]/70 mt-0.5">Manage active fixtures, technical specifications, and galleries.</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setName("");
                          setTagline("");
                          setDescription("");
                          setFeaturesText("");
                          setGalleryImages(DEFAULT_IMAGES);
                          setActiveView("add");
                        }}
                        className="btn-3d btn-3d-dark text-xs px-4 py-2.5 rounded-full flex items-center gap-2"
                      >
                        <FiPlusCircle className="text-sm" />
                        <span>Add Luminaire</span>
                      </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-[#2A1810]/10 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                      <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A1810]/40 text-sm" />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search fixtures by name, wattage, or material..."
                          className="w-full pl-9 pr-4 py-2 bg-[#F6F2EC]/60 border border-[#2A1810]/10 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        <button
                          onClick={() => setCategoryFilter("all")}
                          className={`text - xs px - 3 py - 1.5 rounded - lg whitespace - nowrap transition - colors ${categoryFilter === "all" ? "bg-[#2A1810] text-[#F3EDE4] font-medium" : "bg-[#2A1810]/5 text-[#4A2C1A]"} `}
                        >
                          All ({products.length})
                        </button>
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setCategoryFilter(cat.id)}
                            className={`text - xs px - 3 py - 1.5 rounded - lg whitespace - nowrap transition - colors ${categoryFilter === cat.id ? "bg-[#2A1810] text-[#F3EDE4] font-medium" : "bg-[#2A1810]/5 text-[#4A2C1A]"} `}
                          >
                            {cat.icon} {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="bg-white rounded-3xl border border-[#2A1810]/10 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#2A1810]/5 border-b border-[#2A1810]/10 text-[#4A2C1A]/80 uppercase tracking-wider text-[10px] font-semibold">
                              <th className="py-3.5 px-5">Fixture</th>
                              <th className="py-3.5 px-4">SKU</th>
                              <th className="py-3.5 px-4">Category</th>
                              <th className="py-3.5 px-4">Gallery</th>
                              <th className="py-3.5 px-4">Specifications</th>
                              <th className="py-3.5 px-4">Environment</th>
                              <th className="py-3.5 px-5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2A1810]/5">
                            {filteredProducts.map((p) => (
                              <tr key={p.id} className="hover:bg-[#F6F2EC]/40 transition-colors group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                                <td className="py-3.5 px-5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2A1810]/5 shrink-0 border border-[#2A1810]/8">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={p.images[0] || "/Minimalist Luxury Chandelier Interior.webp"} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-[#2A1810] group-hover:text-[#C8782A] line-clamp-1">{p.name}</div>
                                      <div className="text-[10px] text-[#4A2C1A]/60 font-mono">ID: {p.id}</div>
                                    </div>
                                  </div>
                                </td>

                                {/* ── Inline SKU Cell ── */}
                                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                  {inlineSkuEdit?.id === p.id ? (
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        autoFocus
                                        type="text"
                                        value={inlineSkuEdit.value}
                                        onChange={(e) => setInlineSkuEdit({ id: p.id, value: e.target.value.toUpperCase() })}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleInlineSkuSave(p.id);
                                          if (e.key === "Escape") setInlineSkuEdit(null);
                                        }}
                                        className="w-28 px-2 py-1 border border-[#C8782A] rounded-lg text-[11px] font-mono font-bold text-[#2A1810] focus:outline-none bg-white"
                                      />
                                      <button
                                        onClick={() => handleInlineSkuSave(p.id)}
                                        className="text-emerald-600 hover:text-emerald-800 text-[11px] font-semibold"
                                        title="Save"
                                      >✓</button>
                                      <button
                                        onClick={() => setInlineSkuEdit(null)}
                                        className="text-[#4A2C1A]/50 hover:text-red-500 text-[11px]"
                                        title="Cancel"
                                      >✕</button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setInlineSkuEdit({ id: p.id, value: p.sku || p.id })}
                                      className="group/sku flex items-center gap-1.5 cursor-pointer"
                                      title="Click to edit SKU"
                                    >
                                      <span className="px-2 py-0.5 rounded-md bg-[#2A1810]/5 text-[#2A1810] font-mono font-bold text-[11px] border border-transparent group-hover/sku:border-[#C8782A]/40 group-hover/sku:bg-[#C8782A]/5 transition-all">
                                        {p.sku || p.id}
                                      </span>
                                      <FiEdit2 className="text-[10px] text-[#2A1810]/30 group-hover/sku:text-[#C8782A] transition-colors" />
                                    </button>
                                  )}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="px-2.5 py-1 rounded-full bg-[#2A1810]/5 text-[#2A1810] font-medium text-[11px] capitalize">
                                    {p.subcategory || p.category.replace("-", " ")}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="px-2 py-0.5 rounded-full bg-[#C8782A]/10 text-[#C8782A] font-semibold text-[11px]">
                                    {p.images?.length || 1} photo(s)
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-mono text-[#C8782A] font-bold text-[11px]">{p.wattage}</div>
                                  <div className="text-[#4A2C1A]/70 text-[11px] line-clamp-1">{p.material}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800">
                                    {p.usage || "Indoor"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => startEditing(p)}
                                      title="Edit product specifications & gallery"
                                      className="px-2.5 py-1 rounded-lg bg-[#C8782A]/10 text-[#C8782A] hover:bg-[#C8782A] hover:text-white transition-colors flex items-center gap-1 font-medium text-[11px]"
                                    >
                                      <FiEdit2 className="text-xs" /> Edit
                                    </button>
                                    <Link href={`/ products / ${p.slug} `} target="_blank" className="p-1.5 rounded-lg text-[#4A2C1A]/70 hover:text-[#2A1810]" title="View live page">
                                      <FiExternalLink className="text-sm" />
                                    </Link>
                                    <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-1.5 rounded-lg text-red-500 hover:text-red-700" title="Delete">
                                      <FiTrash2 className="text-sm" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* View: Add OR Edit Luminaire */}
                {activeView === "add" && (
                  <div className="p-6 lg:p-10 space-y-6 max-w-7xl">
                    {/* Header with Edit badge if editing */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">
                            {editingId ? "Edit Luminaire Specifications" : "Add New Luminaire"}
                          </h1>
                          {editingId && (
                            <span className="px-2.5 py-1 bg-[#C8782A] text-white text-[10px] font-bold uppercase rounded-full shadow">
                              Editing Mode
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#4A2C1A]/70 mt-0.5">
                          {editingId
                            ? "Updating live specifications and 5-photo gallery for this catalogue piece."
                            : "Create a new fixture specification with 5-photo gallery that appears live across the catalogue."}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Button to toggle live preview - hidden until user wants it */}
                        <button
                          type="button"
                          onClick={() => setShowLivePreview(!showLivePreview)}
                          className={`btn-3d text-xs px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-all cursor-pointer ${showLivePreview
                            ? "btn-3d-dark text-[#F3EDE4]"
                            : "btn-3d-white text-[#2A1810]"
                            }`}
                        >
                          {showLivePreview ? <FiEyeOff className="text-xs text-[#C8782A]" /> : <FiEye className="text-xs text-[#C8782A]" />}
                          <span>{showLivePreview ? "Hide Card Preview" : "Show Live Card Preview"}</span>
                        </button>

                        {editingId && (
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="btn-3d btn-3d-outline text-xs px-4 py-2 rounded-full flex items-center gap-2"
                          >
                            <FiX /> Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={`grid grid-cols-1 ${showLivePreview ? "lg:grid-cols-12" : "max-w-5xl mx-auto"} gap-8 items-start`}>
                      <form onSubmit={handleSubmit} className={`${showLivePreview ? "lg:col-span-7" : "w-full"} bg-white rounded-3xl p-6 sm:p-8 border border-[#2A1810]/10 shadow-sm space-y-6`}>

                        {/* 1. Identity & SKU */}
                        <div>
                          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#C8782A] mb-4">
                            1. Identity & Classification
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {/* SKU / Model Number */}
                              <div>
                                <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
                                  SKU / Model Number *
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    required
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                                    placeholder="e.g. CHGM2749"
                                    className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs font-mono font-bold text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                                  />
                                </div>
                                <span className="text-[10px] text-[#4A2C1A]/60 mt-1 block">
                                  Unique SKU (e.g. CHGM2749). Duplicates blocked.
                                </span>
                              </div>

                              {/* Luminaire Name */}
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
                                  Luminaire Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="e.g. Luxury Rose Gold & Crystal Chandelier (CHGM2749)"
                                  className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Category *</label>
                                <select
                                  value={category}
                                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                                  className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                                >
                                  {CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Subcategory / Format</label>
                                <input
                                  type="text"
                                  value={subcategory}
                                  onChange={(e) => setSubcategory(e.target.value)}
                                  placeholder="e.g. Chandelier, Thali, Pendant"
                                  className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Wattage / Lamp Rating</label>
                                <input
                                  type="text"
                                  value={wattage}
                                  onChange={(e) => setWattage(e.target.value)}
                                  placeholder="e.g. 12 × E14 Bulbs (4-9W)"
                                  className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Minimum Order Qty (MOQ)</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={moq}
                                  onChange={(e) => setMoq(e.target.value)}
                                  className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Architectural Tagline</label>
                              <input
                                type="text"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                placeholder="e.g. Handcrafted rose gold and clear crystal tiers with 12-bulb refractive illumination."
                                className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">Full Product Description</label>
                              <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="An opulent statement chandelier combining precision-cut faceted crystals..."
                                className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-[#2A1810] mb-1.5">
                                Key Features & Bullets (One feature per line)
                              </label>
                              <textarea
                                rows={4}
                                value={featuresText}
                                onChange={(e) => setFeaturesText(e.target.value)}
                                placeholder="12-bulb E14 multi-tier refractive crystal lighting arrangement&#10;Adjustable suspension height from 52 inches up to 90 inches&#10;Handcrafted base in rose gold, deep black, and optical crystal&#10;Supports smooth dimming directly from the main electric supply"
                                className="w-full px-4 py-2.5 bg-[#F6F2EC]/40 border border-[#2A1810]/15 rounded-xl text-xs text-[#2A1810] font-mono focus:outline-none focus:border-[#C8782A]"
                              />
                              <span className="text-[11px] text-[#4A2C1A]/60 mt-1 block">Each line becomes a verified feature bullet with a checkmark on the product page.</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Technical Specifications (Collapsible Dropdown Table View) */}
                        <div className="pt-4 border-t border-[#2A1810]/8 space-y-4">
                          {/* Dropdown Header Trigger */}
                          <button
                            type="button"
                            onClick={() => setIsSpecsDropdownOpen(!isSpecsDropdownOpen)}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#F6F2EC]/80 hover:bg-[#F6F2EC] border border-[#2A1810]/12 transition-all cursor-pointer group text-left shadow-2xs"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-8 h-8 rounded-xl bg-[#C8782A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                2
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-semibold text-[#2A1810] group-hover:text-[#C8782A] transition-colors">
                                    Technical Specifications
                                  </h3>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C8782A]/10 text-[#C8782A] font-bold">
                                    {techSpecs.length} Rows Configured
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#4A2C1A]/70 mt-0.5">
                                  {isSpecsDropdownOpen
                                    ? "Click to collapse specifications table"
                                    : "Click dropdown to open full specifications table & reordering matrix"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 font-medium text-xs text-[#C8782A]">
                              <span>{isSpecsDropdownOpen ? "Collapse Table" : "Open Table View"}</span>
                              <div
                                className={`w-7 h-7 rounded-lg bg-white border border-[#2A1810]/10 flex items-center justify-center transition-transform duration-200 ${isSpecsDropdownOpen ? "rotate-180" : ""
                                  }`}
                              >
                                <FiChevronDown className="text-sm text-[#2A1810]" />
                              </div>
                            </div>
                          </button>

                          {/* Dropdown Content: Structured HTML Table View */}
                          {isSpecsDropdownOpen && (
                            <div className="space-y-4 pt-1 animate-fadeIn">
                              {/* Top Table Action Bar */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F6F2EC]/40 p-3.5 rounded-2xl border border-[#2A1810]/8">
                                <div>
                                  <span className="text-xs font-semibold text-[#2A1810] block">
                                    Specification Matrix ({techSpecs.length} Active Rows)
                                  </span>
                                  <span className="text-[11px] text-[#4A2C1A]/70">
                                    Edit headings on the left, values on the right, and use ↑ ↓ to set display order.
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={addSpecRow}
                                    className="btn-3d btn-3d-dark text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-medium cursor-pointer"
                                  >
                                    <FiPlus className="text-xs" /> Add Specification Row
                                  </button>
                                  <button
                                    type="button"
                                    onClick={resetSpecRows}
                                    className="btn-3d btn-3d-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 font-medium text-[#4A2C1A] hover:text-[#C8782A] cursor-pointer"
                                    title="Restore standard 19-row luxury luminaire template"
                                  >
                                    <FiRotateCcw className="text-xs" /> Reset Template
                                  </button>
                                </div>
                              </div>

                              {/* Real HTML Table View */}
                              <div className="bg-white rounded-2xl border border-[#2A1810]/12 overflow-hidden shadow-xs">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-[#2A1810]/5 border-b border-[#2A1810]/10 text-[#4A2C1A]/80 uppercase tracking-wider text-[10px] font-semibold">
                                        <th className="py-2.5 px-3 text-center w-[70px]">Order</th>
                                        <th className="py-2.5 px-3 w-[35%]">Specification Heading (Left)</th>
                                        <th className="py-2.5 px-3">Specification Value (Right)</th>
                                        <th className="py-2.5 px-3 text-center w-[50px]">Remove</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2A1810]/8">
                                      {techSpecs.map((row, idx) => (
                                        <tr key={row.id} className="hover:bg-[#F6F2EC]/40 transition-colors group">
                                          {/* Order Controls */}
                                          <td className="py-2 px-3 text-center align-middle">
                                            <div className="flex items-center justify-center gap-1">
                                              <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => moveSpecRow(idx, "up")}
                                                className="w-5 h-5 rounded hover:bg-[#2A1810]/10 flex items-center justify-center text-[10px] text-[#2A1810]/70 hover:text-[#C8782A] disabled:opacity-20 cursor-pointer"
                                                title="Move Up in Table"
                                              >
                                                <FiArrowUp />
                                              </button>
                                              <span className="text-[10px] font-mono font-bold text-[#4A2C1A]/60 w-4 text-center">
                                                {idx + 1}
                                              </span>
                                              <button
                                                type="button"
                                                disabled={idx === techSpecs.length - 1}
                                                onClick={() => moveSpecRow(idx, "down")}
                                                className="w-5 h-5 rounded hover:bg-[#2A1810]/10 flex items-center justify-center text-[10px] text-[#2A1810]/70 hover:text-[#C8782A] disabled:opacity-20 cursor-pointer"
                                                title="Move Down in Table"
                                              >
                                                <FiArrowDown />
                                              </button>
                                            </div>
                                          </td>

                                          {/* Left Heading Input */}
                                          <td className="py-2 px-3 align-middle">
                                            <input
                                              type="text"
                                              value={row.label}
                                              onChange={(e) => updateSpecRow(idx, "label", e.target.value)}
                                              placeholder="e.g. Base Material"
                                              className="w-full px-2.5 py-1.5 bg-[#F6F2EC]/50 border border-[#2A1810]/15 rounded-lg text-xs font-semibold text-[#2A1810] focus:outline-none focus:border-[#C8782A] focus:bg-white"
                                            />
                                          </td>

                                          {/* Right Value Input */}
                                          <td className="py-2 px-3 align-middle">
                                            <input
                                              type="text"
                                              value={row.value}
                                              onChange={(e) => updateSpecRow(idx, "value", e.target.value)}
                                              placeholder="e.g. Metal & Crystal"
                                              className="w-full px-2.5 py-1.5 bg-white border border-[#2A1810]/15 rounded-lg text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                                            />
                                          </td>

                                          {/* Delete Row Button */}
                                          <td className="py-2 px-3 text-center align-middle">
                                            <button
                                              type="button"
                                              onClick={() => removeSpecRow(idx)}
                                              className="w-6 h-6 rounded-md text-red-400 hover:text-red-700 hover:bg-red-50 flex items-center justify-center mx-auto transition-colors cursor-pointer"
                                              title="Remove row"
                                            >
                                              <FiTrash2 className="text-xs" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 3. Dynamic Gallery Photography */}
                        <div className="pt-4 border-t border-[#2A1810]/8 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#C8782A]">
                                3. Gallery Photography
                              </h3>
                              <p className="text-[11px] text-[#4A2C1A]/70 mt-0.5">
                                Upload direct files or paste URLs. Dynamic slots: if 2 then 2, if 3 then 3, if 5 then 5.
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-[#2A1810] font-semibold bg-[#F6F2EC] px-2.5 py-1 rounded-md border border-[#2A1810]/8">
                                {galleryImages.filter((s) => s.trim().length > 0).length} of {galleryImages.length} Photo(s) Active
                              </span>
                              <button
                                type="button"
                                onClick={addImageSlot}
                                className="btn-3d btn-3d-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium cursor-pointer"
                              >
                                <FiPlus className="text-xs" /> Add Photo Slot
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3.5">
                            {
                              galleryImages.map((imgVal, idx) => (
                                <div
                                  key={idx}
                                  className="p-3.5 rounded-2xl bg-[#F6F2EC]/50 border border-[#2A1810]/10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 group hover:border-[#C8782A]/30 transition-colors"
                                >
                                  {/* Image preview thumbnail */}
                                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#2A1810]/10 relative flex items-center justify-center">
                                    {imgVal ? (
                                      <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={imgVal}
                                          alt={`Slot ${idx + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/Minimalist Luxury Chandelier Interior.webp";
                                          }}
                                        />
                                        <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 font-mono">
                                          #{idx + 1}
                                        </span>
                                      </>
                                    ) : (
                                      <div className="text-center p-1 text-[#2A1810]/30">
                                        <FiImage className="mx-auto text-base" />
                                        <span className="text-[9px] block font-mono">#{idx + 1}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Inputs: URL + File Upload */}
                                  <div className="flex-1 w-full space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-semibold text-[#2A1810]">
                                        {idx === 0 ? "Photo 1 (Primary Catalogue Cover)" : `Photo ${idx + 1} (Gallery Angle)`}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {imgVal && (
                                          <button
                                            type="button"
                                            onClick={() => updateSlotImage(idx, "")}
                                            className="text-[10px] text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
                                          >
                                            Clear URL
                                          </button>
                                        )}
                                        {galleryImages.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => removeImageSlot(idx)}
                                            className="text-[10px] text-red-500 hover:text-red-700 font-medium flex items-center gap-0.5 cursor-pointer"
                                            title="Remove this photo slot"
                                          >
                                            <FiTrash2 className="text-[10px]" /> Remove Slot
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={imgVal}
                                        onChange={(e) => updateSlotImage(idx, e.target.value)}
                                        placeholder="Paste image URL (https://...)"
                                        className="flex-1 px-3 py-1.5 bg-white border border-[#2A1810]/15 rounded-lg text-xs text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                                      />

                                      {/* Upload Button */}
                                      <label className="btn-3d btn-3d-outline text-xs px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                                        <FiUploadCloud className="text-sm" />
                                        <span>{uploadingSlot === idx ? "Uploading..." : "Upload File"}</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          disabled={uploadingSlot === idx}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(idx, file);
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* Bottom Add Photo Slot button */}
                          <div className="pt-1 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={addImageSlot}
                              className="btn-3d btn-3d-white text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-medium cursor-pointer"
                            >
                              <FiPlus className="text-xs" /> Add Another Photo Slot
                            </button>
                            <span className="text-[10px] text-[#4A2C1A]/60">
                              {galleryImages.length} slot(s) currently open
                            </span>
                          </div>

                          {/* Preset quick picker */}
                          <div className="pt-2">
                            <span className="text-[11px] text-[#4A2C1A]/70 block mb-1.5">Quick fill Slot 1 from presets:</span>
                            <div className="flex flex-wrap gap-2">
                              {PRESET_IMAGES.map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => updateSlotImage(0, preset.url)}
                                  className="text-[10px] px-2.5 py-1 rounded-lg border bg-white text-[#4A2C1A] border-[#2A1810]/10 hover:border-[#C8782A] transition-colors"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Submit button */}
                        < div className="pt-6 border-t border-[#2A1810]/8 flex items-center justify-between" >
                          {
                            editingId ? (
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="text-xs text-[#4A2C1A]/80 hover:text-[#2A1810] font-medium"
                              >
                                ← Cancel and return to Inventory
                              </button>
                            ) : <div />}

                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn-3d btn-3d-dark text-xs px-7 py-3 rounded-full flex items-center gap-2 font-medium"
                          >
                            {editingId ? <FiEdit2 className="text-sm" /> : <FiPlusCircle className="text-sm" />}
                            <span>{submitting ? "Saving..." : editingId ? "Save Changes" : "Publish Luminaire"}</span>
                          </button>
                        </div>
                      </form>

                      {/* Live Preview Column - Hidden until user clicks button */}
                      {showLivePreview && (
                        <div className="lg:col-span-5 sticky top-24 space-y-4 animate-fadeIn">
                          <div className="bg-white rounded-3xl p-6 border border-[#2A1810]/10 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#C8782A]">
                                Live Card Preview
                              </span>
                              <span className="text-[11px] font-mono text-[#4A2C1A]/70">
                                {galleryImages.filter((s) => s.trim().length > 0).length} Photo(s)
                              </span>
                            </div>

                            < div className="rounded-2xl border border-[#2A1810]/15 overflow-hidden bg-white shadow-md" >
                              <div className="aspect-[4/3] bg-[#F6F2EC] relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={galleryImages[0] || "/Minimalist Luxury Chandelier Interior.webp"}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/Minimalist Luxury Chandelier Interior.webp";
                                  }}
                                />
                                {subcategory && (
                                  <span className="absolute top-2.5 left-2.5 bg-[#2A1810]/85 backdrop-blur-md text-[#F3EDE4] text-[10px] font-medium uppercase px-2.5 py-1 rounded-full">
                                    {subcategory}
                                  </span>
                                )}
                              </div>

                              {/* Small strip of remaining photos */}
                              {galleryImages.filter((s, i) => i > 0 && s.trim().length > 0).length > 0 && (
                                <div className="px-3 py-2 bg-[#F6F2EC]/40 border-t border-[#2A1810]/5 flex items-center gap-2 overflow-x-auto">
                                  {galleryImages.map((img, i) =>
                                    i > 0 && img ? (
                                      <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border border-[#2A1810]/10 shrink-0 bg-white">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                                      </div>
                                    ) : null
                                  )}
                                </div>
                              )}

                              <div className="p-4 space-y-2">
                                <div className="text-[10px] uppercase tracking-wider text-[#C8782A] font-semibold">{category}</div>
                                <h4 className="font-display text-base font-semibold text-[#2A1810] line-clamp-2">
                                  {name || "Untitled Luminaire Design"}
                                </h4>
                                {tagline && <p className="text-xs text-[#4A2C1A]/70 italic line-clamp-1">&ldquo;{tagline}&rdquo;</p>}
                                {material && <p className="text-[11px] text-[#4A2C1A]/60 line-clamp-1">{material}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* View: Enquiry */}
                {activeView === "enquiry" && (
                  <div className="p-6 lg:p-10 space-y-8 max-w-7xl">
                    <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">Concierge & Inquiries</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#2A1810]/10 shadow-sm space-y-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                          <FiMessageSquare />
                        </div>
                        <h3 className="font-display text-lg text-[#2A1810]">WhatsApp Sales Line</h3>
                        <p className="text-xs text-[#4A2C1A]/70 leading-relaxed">+91 99901 79666</p>
                        <a href="https://wa.me/919990179666" target="_blank" rel="noopener noreferrer" className="btn-3d btn-3d-dark text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-2">
                          <span>Open WhatsApp Console</span>
                        </a>
                      </div>

                      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#2A1810]/10 shadow-sm space-y-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl">
                          <FiPhone />
                        </div>
                        <h3 className="font-display text-lg text-[#2A1810]">Sector 104 Experience Center</h3>
                        <p className="text-xs text-[#4A2C1A]/70 leading-relaxed">Khasra No 514, Sector 104, Noida, Uttar Pradesh.</p>
                        <a href="mailto:nivoseasLLP@gmail.com" className="btn-3d btn-3d-outline text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-2">
                          <span>Compose Direct Mail</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </main>

              {/* Slide-over Inspection Drawer */}
              {selectedProduct && (
                <div className="fixed inset-0 z-50 flex justify-end">
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
                  <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto p-6 sm:p-8 border-l border-[#2A1810]/10">
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-[#2A1810]/10 mb-6">
                        <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#C8782A]">Fixture Inspection</span>
                        <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-lg text-[#2A1810]/60 hover:text-[#2A1810]">
                          <FiX className="text-lg" />
                        </button>
                      </div>

                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F6F2EC] mb-5 border border-[#2A1810]/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedProduct.images[0] || "/Minimalist Luxury Chandelier Interior.webp"} alt={selectedProduct.name} className="w-full h-full object-cover" />
                      </div>

                      {selectedProduct.images.length > 1 && (
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                          {selectedProduct.images.map((img, i) => (
                            <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-[#2A1810]/10 shrink-0 bg-white">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt={`Gallery ${i} `} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2 text-xs">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C8782A]">{selectedProduct.category}</span>
                        <h3 className="font-display text-xl font-semibold text-[#2A1810]">{selectedProduct.name}</h3>
                        {selectedProduct.tagline && <p className="text-xs text-[#4A2C1A]/70 italic">&ldquo;{selectedProduct.tagline}&rdquo;</p>}
                        {selectedProduct.description && (
                          <p className="text-xs text-[#4A2C1A] leading-relaxed pt-2 border-t border-[#2A1810]/5">
                            {selectedProduct.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#2A1810]/10 space-y-2">
                      <button
                        onClick={() => startEditing(selectedProduct)}
                        className="btn-3d btn-3d-amber w-full py-2.5 text-center text-xs rounded-xl flex items-center justify-center gap-2 font-medium"
                      >
                        <FiEdit2 className="text-sm" /> Edit Specifications & Gallery
                      </button>
                      <div className="flex items-center gap-2">
                        <Link href={`/ products / ${selectedProduct.slug} `} target="_blank" className="btn-3d btn-3d-dark flex-1 py-2.5 text-center text-xs rounded-xl">
                          View Public Page ↗
                        </Link>
                        <button onClick={() => handleDeleteProduct(selectedProduct.id, selectedProduct.name)} className="btn-3d btn-3d-outline text-red-600 border-red-200 py-2.5 px-4 text-xs rounded-xl">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            );
}
