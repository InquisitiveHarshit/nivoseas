"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  FiLogOut,
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
  FiMail,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { Product, ProductCategory, DEFAULT_TECHNICAL_SPECS } from "@/data/products";
import type { Lead } from "@/lib/leads-store";

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
  const router = useRouter();
  const [activeView, setActiveView] = useState<"overview" | "inventory" | "add" | "enquiry" | "collections" | "blogs">("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");
  const [leadSearchTerm, setLeadSearchTerm] = useState<string>("");

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
  const [categories, setCategories] = useState<ProductCategory[]>(["decorative"]);

  const toggleCategory = (catId: ProductCategory) => {
    setCategories((prev) => {
      if (prev.includes(catId)) {
        if (prev.length <= 1) return prev; // must keep at least 1 category selected
        const updated = prev.filter((c) => c !== catId);
        setCategory(updated[0]);
        return updated;
      } else {
        return [...prev, catId];
      }
    });
  };
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

  // Real-time live SKU validation BEFORE publish
  const skuValidation = useMemo(() => {
    const trimmed = sku.trim().toUpperCase();
    if (!trimmed) {
      return { status: "empty" as const, text: "SKU / Model Number is required." };
    }
    const dup = products.find(
      (p) =>
        (editingId ? p.id !== editingId && (p.sku || p.id).toUpperCase() !== (editingId || "").toUpperCase() : true) &&
        (((p.sku || p.id) && (p.sku || p.id).toUpperCase() === trimmed))
    );
    if (dup) {
      return {
        status: "duplicate" as const,
        text: `SKU already exists on "${dup.name}". Please provide a unique SKU.`,
        productName: dup.name,
      };
    }
    return {
      status: "ok" as const,
      text: `SKU "${trimmed}" is unique & ready for publish.`,
    };
  }, [sku, products, editingId]);

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

  // Category Images state (for Collections admin view)
  const [catImages, setCatImages] = useState<
    { id: string; name: string; slug: string; heroImage: string | null; defaultImage: string | null; hasOverride: boolean }[]
  >([]);
  const [catImagesLoading, setCatImagesLoading] = useState(false);
  const [catUploadingSlot, setCatUploadingSlot] = useState<string | null>(null);
  const [catUrlInputs, setCatUrlInputs] = useState<Record<string, string>>({});

  // Blog Articles state (for Blogs admin tab)
  interface AdminBlogSummary {
    _id: string;
    title: string;
    slug: string;
    category?: string;
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
    coverImage?: string;
  }
  const [adminBlogs, setAdminBlogs] = useState<AdminBlogSummary[]>([]);
  const [adminBlogsLoading, setAdminBlogsLoading] = useState(false);
  const [blogSearchTerm, setBlogSearchTerm] = useState("");

  const fetchAdminBlogs = async () => {
    setAdminBlogsLoading(true);
    try {
      const res = await fetch("/api/blogs?published=false");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAdminBlogs(json.data);
      }
    } catch {
      console.warn("Failed to load blog posts in admin.");
    } finally {
      setAdminBlogsLoading(false);
    }
  };

  const fetchCatImages = async () => {
    setCatImagesLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) {
        setCatImages(json.data);
        const inputs: Record<string, string> = {};
        for (const c of json.data) inputs[c.id] = c.heroImage || "";
        setCatUrlInputs(inputs);
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to load category images." });
    } finally {
      setCatImagesLoading(false);
    }
  };

  const saveCatImage = async (categoryId: string, heroImage: string) => {
    if (!heroImage.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, heroImage: heroImage.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: "success", text: "Category image updated." });
        await fetchCatImages();
      } else {
        setFeedback({ type: "error", text: json.error || "Failed to save." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error saving category image." });
    }
  };

  const resetCatImage = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/categories?categoryId=${encodeURIComponent(categoryId)}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: "success", text: "Reset to default image." });
        await fetchCatImages();
      } else {
        setFeedback({ type: "error", text: json.error || "Failed to reset." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error resetting image." });
    }
  };

  const handleCatFileUpload = async (categoryId: string, file: File) => {
    setCatUploadingSlot(categoryId);
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
          await saveCatImage(categoryId, data.secure_url);
          setCatUploadingSlot(null);
          return;
        }
      } catch (e) {
        console.warn("Cloudinary upload failed, using data URL", e);
      }
    }
    // Fallback: data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (result) await saveCatImage(categoryId, result);
      setCatUploadingSlot(null);
    };
    reader.onerror = () => {
      setFeedback({ type: "error", text: "Failed to read image file." });
      setCatUploadingSlot(null);
    };
    reader.readAsDataURL(file);
  };

  // Fetch category images when navigating to collections view
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

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLeads(json.data);
      }
    } catch {
      console.warn("Could not load leads.");
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: Lead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        setFeedback({ type: "success", text: `Lead marked as ${newStatus}.` });
      } else {
        setFeedback({ type: "error", text: json.error || "Failed to update lead." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error updating lead." });
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead inquiry?")) return;
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        setFeedback({ type: "success", text: "Lead inquiry deleted." });
      } else {
        setFeedback({ type: "error", text: json.error || "Failed to delete lead." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error deleting lead." });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLeads();
  }, []);

  useEffect(() => {
    if (activeView === "collections" && catImages.length === 0) {
      fetchCatImages();
    }
    if (activeView === "blogs" && adminBlogs.length === 0) {
      fetchAdminBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);

  const newLeadsCount = useMemo(() => {
    return leads.filter((l) => l.status === "new").length;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (leadStatusFilter !== "all" && l.status !== leadStatusFilter) return false;
      if (leadSearchTerm.trim()) {
        const q = leadSearchTerm.toLowerCase();
        const matches =
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.projectType && l.projectType.toLowerCase().includes(q)) ||
          (l.message && l.message.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [leads, leadStatusFilter, leadSearchTerm]);

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
    const itemCats: ProductCategory[] = p.categories && p.categories.length > 0
      ? (p.categories as ProductCategory[])
      : [p.category];
    setCategories(itemCats);
    setCategory(itemCats[0] || p.category);
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
    setCategories(["decorative"]);
    setCategory("decorative");
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

    const finalCategories = categories.length > 0 ? categories : [category];
    const primaryCategory = finalCategories[0];

    const payload = {
      ...(editingId ? { id: editingId } : {}),
      sku: trimmedSku,
      name: name.trim(),
      category: primaryCategory,
      categories: finalCategories,
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
      const matchesCat =
        categoryFilter === "all" ||
        (p.categories && p.categories.length > 0
          ? p.categories.includes(categoryFilter as any)
          : p.category === categoryFilter);
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
    const byCat = (id: string) =>
      products.filter((p) =>
        p.categories && p.categories.length > 0
          ? p.categories.includes(id as any)
          : p.category === id
      ).length;
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${activeView === "enquiry"
                  ? "bg-[#C8782A] text-white shadow-md shadow-[#C8782A]/20"
                  : "text-[#F3EDE4]/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <FiMessageSquare className="text-sm shrink-0" />
                  <span>Customer Leads</span>
                </div>
                {newLeadsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white animate-pulse">
                    {newLeadsCount} New
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveView("collections");
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${activeView === "collections"
                  ? "bg-[#C8782A] text-white shadow-md shadow-[#C8782A]/20"
                  : "text-[#F3EDE4]/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <FiImage className="text-sm shrink-0" />
                <span>Category Images</span>
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveView("blogs");
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${activeView === "blogs"
                  ? "bg-[#C8782A] text-white shadow-md shadow-[#C8782A]/20"
                  : "text-[#F3EDE4]/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <FiLayers className="text-sm shrink-0" />
                  <span>Blog Articles</span>
                </div>
                {adminBlogs.length > 0 && (
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
                    {adminBlogs.length}
                  </span>
                )}
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
          <button
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } finally {
                router.push("/admin/login");
                router.refresh();
              }
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-red-400/90 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FiLogOut /> Sign Out
            </span>
          </button>
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
            <div className="bg-white p-4 rounded-2xl border border-[#2A1810]/10 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A1810]/40 text-sm" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by fixture name, SKU, wattage, or material..."
                    className="w-full pl-9 pr-8 py-2 bg-[#F6F2EC]/60 border border-[#2A1810]/12 rounded-xl text-xs text-[#2A1810] placeholder-[#2A1810]/40 focus:outline-none focus:border-[#C8782A] focus:bg-white transition-all"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#2A1810]/40 hover:text-[#2A1810] text-xs p-1 cursor-pointer"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Dropdown (Compact & Clean) */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-[11px] font-semibold text-[#4A2C1A]/70 uppercase tracking-wider">
                    Category:
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3.5 py-2 bg-[#F6F2EC]/80 border border-[#2A1810]/15 rounded-xl text-xs font-semibold text-[#2A1810] focus:outline-none focus:border-[#C8782A] cursor-pointer"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {CATEGORIES.map((cat) => {
                      const count = products.filter((p) =>
                        p.categories && p.categories.length > 0
                          ? p.categories.includes(cat.id as any)
                          : p.category === cat.id
                      ).length;
                      return (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name} ({count})
                        </option>
                      );
                    })}
                  </select>

                  <span className="text-[11px] font-mono text-[#4A2C1A]/60 bg-[#F6F2EC] px-2.5 py-1.5 rounded-lg border border-[#2A1810]/8 hidden sm:inline-block">
                    {filteredProducts.length} fixture(s)
                  </span>
                </div>
              </div>

              {/* Horizontal Pills row with proper spacing, icons & count badges */}
              <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 border-t border-[#2A1810]/6">
                <button
                  type="button"
                  onClick={() => setCategoryFilter("all")}
                  className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer flex items-center gap-1.5 shrink-0 ${categoryFilter === "all"
                    ? "bg-[#2A1810] text-[#F3EDE4] shadow-xs"
                    : "bg-[#F6F2EC] text-[#4A2C1A] hover:bg-[#2A1810]/10 border border-[#2A1810]/8"
                    }`}
                >
                  <span>All Fixtures</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${categoryFilter === "all"
                      ? "bg-white/20 text-white"
                      : "bg-[#2A1810]/10 text-[#4A2C1A]"
                      }`}
                  >
                    {products.length}
                  </span>
                </button>

                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) =>
                    p.categories && p.categories.length > 0
                      ? p.categories.includes(cat.id as any)
                      : p.category === cat.id
                  ).length;
                  const isSelected = categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer flex items-center gap-1.5 shrink-0 ${isSelected
                        ? "bg-[#C8782A] text-white shadow-xs shadow-[#C8782A]/20"
                        : "bg-[#F6F2EC] text-[#4A2C1A] hover:bg-[#2A1810]/10 border border-[#2A1810]/8"
                        }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected
                          ? "bg-white/25 text-white"
                          : "bg-[#2A1810]/10 text-[#4A2C1A]"
                          }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
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
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {(p.categories && p.categories.length > 0 ? p.categories : [p.category]).map((cId) => {
                              const meta = CATEGORIES.find((c) => c.id === cId);
                              return (
                                <span
                                  key={cId}
                                  className="px-2 py-0.5 rounded-md bg-[#2A1810]/5 text-[#2A1810] font-medium text-[10.5px] whitespace-nowrap flex items-center gap-1 border border-[#2A1810]/8"
                                >
                                  <span>{meta?.icon || "💡"}</span>
                                  <span>{meta?.name || cId.replace("-", " ")}</span>
                                </span>
                              );
                            })}
                          </div>
                          {p.subcategory && (
                            <div className="text-[10px] text-[#4A2C1A]/50 mt-1 font-mono">{p.subcategory}</div>
                          )}
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
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-[#2A1810]">
                            SKU / Model Number *
                          </label>
                          {skuValidation.status === "ok" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                              <FiCheckCircle className="text-xs" /> SKU OK
                            </span>
                          )}
                          {skuValidation.status === "duplicate" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md animate-pulse">
                              <FiAlertCircle className="text-xs" /> Already Exists
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={sku}
                            onChange={(e) => setSku(e.target.value.toUpperCase())}
                            placeholder="e.g. CHGM2749 or 626-500"
                            className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all focus:outline-none ${skuValidation.status === "duplicate"
                              ? "bg-rose-50/40 border-2 border-rose-500 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20"
                              : skuValidation.status === "ok"
                                ? "bg-emerald-50/20 border border-emerald-500 text-[#2A1810] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                                : "bg-[#F6F2EC]/40 border border-[#2A1810]/15 text-[#2A1810] focus:border-[#C8782A]"
                              }`}
                          />
                        </div>
                        {skuValidation.status === "duplicate" ? (
                          <div className="mt-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-medium flex items-start gap-1.5">
                            <FiAlertCircle className="text-xs shrink-0 mt-0.5 text-rose-600" />
                            <span>
                              <strong>SKU already exists:</strong> &ldquo;{skuValidation.productName}&rdquo; is using this SKU. Provide a unique SKU before publishing.
                            </span>
                          </div>
                        ) : skuValidation.status === "ok" ? (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                            <FiCheckCircle className="text-xs shrink-0 text-emerald-600" />
                            <span>✓ SKU Available — verified OK to publish.</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-700 mt-1 block">
                            ⚠️ Please enter a unique SKU (e.g. CHGM2749, 626-500).
                          </span>
                        )}
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

                    {/* Multi-Category Selector */}
                    <div className="p-4 bg-[#F6F2EC]/60 border border-[#2A1810]/10 rounded-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-[#2A1810]">
                            Categories * <span className="text-[11px] font-normal text-[#4A2C1A]/70">(Select one or more categories to cross-list this fixture)</span>
                          </label>
                        </div>
                        <span className="text-[11px] font-mono text-[#C8782A] font-semibold">
                          {categories.length} selected
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => {
                          const isSelected = categories.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => toggleCategory(cat.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                ? "bg-[#C8782A] text-white shadow-xs font-semibold"
                                : "bg-white/80 text-[#2A1810] border border-[#2A1810]/15 hover:bg-white"
                                }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                              {isSelected && <span className="text-[10px] ml-0.5 font-bold">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    disabled={submitting || skuValidation.status === "duplicate" || skuValidation.status === "empty"}
                    className={`btn-3d text-xs px-7 py-3 rounded-full flex items-center gap-2 font-medium transition-all ${skuValidation.status === "duplicate"
                      ? "bg-rose-900/60 text-white cursor-not-allowed opacity-60"
                      : skuValidation.status === "empty"
                        ? "bg-[#2A1810]/40 text-white cursor-not-allowed opacity-60"
                        : "btn-3d-dark"
                      }`}
                  >
                    {editingId ? <FiEdit2 className="text-sm" /> : <FiPlusCircle className="text-sm" />}
                    <span>
                      {submitting
                        ? "Saving..."
                        : skuValidation.status === "duplicate"
                          ? "Cannot Publish: SKU Already Exists"
                          : skuValidation.status === "empty"
                            ? "Provide SKU to Publish"
                            : editingId
                              ? "Save Changes"
                              : "Publish Luminaire"}
                    </span>
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

        {/* View: Enquiry & Leads */}
        {activeView === "enquiry" && (
          <div className="p-6 lg:p-10 space-y-8 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A1810]/10">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">
                  Customer Leads & Inquiries
                </h1>
                <p className="text-xs text-[#4A2C1A]/70 mt-1">
                  Real-time inquiries received from the website contact form, custom drop requests, and WhatsApp console.
                </p>
              </div>
              <button
                onClick={fetchLeads}
                disabled={leadsLoading}
                className="btn-3d btn-3d-outline text-xs px-4 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <FiRefreshCw className={`text-xs ${leadsLoading ? "animate-spin" : ""}`} />
                <span>{leadsLoading ? "Refreshing..." : "Refresh Leads"}</span>
              </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#2A1810]/10 shadow-sm">
                <span className="text-[11px] uppercase tracking-wider text-[#4A2C1A]/60 font-semibold">
                  Total Inquiries
                </span>
                <p className="font-display text-2xl lg:text-3xl font-bold text-[#2A1810] mt-1">
                  {leads.length}
                </p>
              </div>

              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 shadow-sm">
                <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  New / Pending
                </span>
                <p className="font-display text-2xl lg:text-3xl font-bold text-emerald-900 mt-1">
                  {newLeadsCount}
                </p>
              </div>

              <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200 shadow-sm">
                <span className="text-[11px] uppercase tracking-wider text-blue-800 font-semibold">
                  Contacted / Active
                </span>
                <p className="font-display text-2xl lg:text-3xl font-bold text-blue-900 mt-1">
                  {leads.filter((l) => l.status === "contacted" || l.status === "in-progress").length}
                </p>
              </div>

              <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 shadow-sm">
                <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold">
                  Closed / Converted
                </span>
                <p className="font-display text-2xl lg:text-3xl font-bold text-amber-900 mt-1">
                  {leads.filter((l) => l.status === "closed").length}
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#2A1810]/10 shadow-sm">
              {/* Status Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: `All (${leads.length})` },
                  { id: "new", label: `New (${newLeadsCount})` },
                  { id: "contacted", label: "Contacted" },
                  { id: "in-progress", label: "In Progress" },
                  { id: "closed", label: "Closed" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setLeadStatusFilter(tab.id)}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${leadStatusFilter === tab.id
                      ? "bg-[#2A1810] text-[#F3EDE4] shadow-sm"
                      : "bg-[#F3EDE4]/50 text-[#2A1810]/70 hover:bg-[#F3EDE4] hover:text-[#2A1810]"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#2A1810]/40" />
                <input
                  type="text"
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  placeholder="Search name, phone, message..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#F3EDE4]/30 border border-[#2A1810]/10 focus:bg-white focus:border-[#C8782A] focus:outline-none"
                />
              </div>
            </div>

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#2A1810]/10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#F3EDE4] text-[#C8782A] flex items-center justify-center mx-auto text-2xl">
                  <FiMessageSquare />
                </div>
                <h3 className="font-display text-lg font-medium text-[#2A1810]">
                  No Leads Match Your Filter
                </h3>
                <p className="text-xs text-[#4A2C1A]/70 max-w-md mx-auto">
                  {leads.length === 0
                    ? "When prospective clients submit inquiries on the contact form, their contact details and requirements will appear here in real-time."
                    : "Try selecting another status tab or clearing your search keywords."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead) => {
                  const initials = lead.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  const formattedDate = new Date(lead.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                  const waLink = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=Hi%20${encodeURIComponent(
                    lead.name
                  )}%2C%20thank%20you%20for%20contacting%20Nivoseas%20Lighting.%20I%20am%20following%20up%20on%20your%20inquiry.`;

                  return (
                    <div
                      key={lead.id}
                      className="bg-white rounded-2xl p-6 border border-[#2A1810]/10 shadow-sm hover:shadow-md transition-all space-y-4"
                    >
                      {/* Top Row: Name, Date, Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A1810]/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#C8782A]/15 text-[#C8782A] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials || "LD"}
                          </div>
                          <div>
                            <h4 className="font-display text-base font-semibold text-[#2A1810]">
                              {lead.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-[#4A2C1A]/60">
                              <FiCalendar className="text-[10px]" />
                              <span>{formattedDate}</span>
                              <span>•</span>
                              <span className="capitalize">{lead.source?.replace("-", " ") || "Website"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] uppercase tracking-wider text-[#4A2C1A]/60 font-semibold">
                            Status:
                          </span>
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleUpdateLeadStatus(lead.id, e.target.value as Lead["status"])
                            }
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${lead.status === "new"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : lead.status === "contacted"
                                ? "bg-blue-50 text-blue-800 border-blue-300"
                                : lead.status === "in-progress"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                              }`}
                          >
                            <option value="new">● New Inquiry</option>
                            <option value="contacted">● Contacted</option>
                            <option value="in-progress">● In Progress</option>
                            <option value="closed">● Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Contact Info & Metadata */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                        <a
                          href={`tel:${lead.phone}`}
                          className="font-medium text-[#2A1810] hover:text-[#C8782A] flex items-center gap-1.5 bg-[#F3EDE4]/40 px-3 py-1 rounded-lg"
                        >
                          <FiPhone className="text-xs text-[#C8782A]" />
                          <span>{lead.phone}</span>
                        </a>

                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="font-medium text-[#2A1810] hover:text-[#C8782A] flex items-center gap-1.5 bg-[#F3EDE4]/40 px-3 py-1 rounded-lg"
                          >
                            <FiMail className="text-xs text-[#C8782A]" />
                            <span>{lead.email}</span>
                          </a>
                        )}

                        {lead.projectType && (
                          <span className="font-semibold text-[#C8782A] bg-[#C8782A]/10 px-3 py-1 rounded-lg">
                            {lead.projectType}
                          </span>
                        )}

                        {lead.productName && (
                          <span className="font-medium text-[#2A1810]/70 bg-gray-100 px-3 py-1 rounded-lg">
                            Product: {lead.productName}
                          </span>
                        )}
                      </div>

                      {/* Lead Message / Requirements */}
                      {lead.message && (
                        <div className="p-3.5 rounded-xl bg-[#F3EDE4]/30 border border-[#2A1810]/8 text-xs text-[#2A1810]/85 leading-relaxed">
                          <span className="font-semibold text-[#4A2C1A]/70 block text-[10px] uppercase tracking-wider mb-1">
                            Customer Note:
                          </span>
                          {lead.message}
                        </div>
                      )}

                      {/* Action Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-3d text-[11px] font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5"
                          >
                            <FiMessageSquare className="text-xs" />
                            <span>Chat on WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${lead.phone}`}
                            className="btn-3d btn-3d-outline text-[11px] font-semibold px-4 py-2 rounded-xl inline-flex items-center gap-1.5"
                          >
                            <FiPhone className="text-xs" />
                            <span>Direct Call</span>
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          title="Delete Lead"
                        >
                          <FiTrash2 className="text-sm" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Concierge Info Cards at Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#2A1810]/10">
              <div className="bg-white rounded-3xl p-6 border border-[#2A1810]/10 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                  <FiMessageSquare />
                </div>
                <h3 className="font-display text-base text-[#2A1810] font-semibold">WhatsApp Official Line</h3>
                <p className="text-xs text-[#4A2C1A]/70">+91 99901 79666</p>
                <a
                  href="https://wa.me/919990179666"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d btn-3d-dark text-xs px-4 py-2 rounded-full inline-flex items-center gap-2"
                >
                  <span>Open WhatsApp Web</span>
                </a>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#2A1810]/10 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl">
                  <FiPhone />
                </div>
                <h3 className="font-display text-base text-[#2A1810] font-semibold">Sector 104 Experience Center</h3>
                <p className="text-xs text-[#4A2C1A]/70">Sector 104, Noida, Uttar Pradesh 201301</p>
                <a
                  href="mailto:nivoseasLLP@gmail.com"
                  className="btn-3d btn-3d-outline text-xs px-4 py-2 rounded-full inline-flex items-center gap-2"
                >
                  <span>Compose Direct Mail</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* View: Category Images */}
        {activeView === "collections" && (
          <div className="p-6 lg:p-10 space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">
                  Category Images
                </h1>
                <p className="text-xs text-[#4A2C1A]/70 mt-0.5">
                  Manage hero images shown on the Collections page and Homepage cards. Changes take effect immediately.
                </p>
              </div>
              <button
                onClick={fetchCatImages}
                disabled={catImagesLoading}
                className="btn-3d btn-3d-outline text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 shrink-0"
              >
                <FiRefreshCw className={`text-xs ${catImagesLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {catImagesLoading ? (
              <div className="flex items-center justify-center py-20">
                <FiRefreshCw className="animate-spin text-[#C8782A] text-2xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {catImages.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-3xl border border-[#2A1810]/10 shadow-sm overflow-hidden"
                  >
                    {/* Image preview */}
                    <div className="relative h-44 bg-[#F6F2EC] overflow-hidden">
                      {cat.heroImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.heroImage}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#2A1810]/30">
                          <FiImage className="text-4xl" />
                        </div>
                      )}
                      {/* Overlay badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider bg-black/50 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {cat.name}
                        </span>
                        {cat.hasOverride ? (
                          <span className="text-[10px] font-mono uppercase tracking-wider bg-[#C8782A]/90 text-white px-2.5 py-1 rounded-full">
                            Custom
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase tracking-wider bg-white/70 text-[#4A2C1A] px-2.5 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="p-5 space-y-3">
                      {/* URL input + Save */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={catUrlInputs[cat.id] ?? ""}
                          onChange={(e) =>
                            setCatUrlInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))
                          }
                          placeholder="Paste image URL or upload below"
                          className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#2A1810]/15 bg-[#F6F2EC] text-[#2A1810] focus:outline-none focus:border-[#C8782A] placeholder:text-[#4A2C1A]/40"
                        />
                        <button
                          onClick={() => saveCatImage(cat.id, catUrlInputs[cat.id] ?? "")}
                          disabled={!catUrlInputs[cat.id]?.trim()}
                          className="btn-3d btn-3d-dark text-xs px-3.5 py-2 rounded-xl shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                      </div>

                      {/* Upload from device */}
                      <label className="relative flex items-center gap-2 cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCatFileUpload(cat.id, file);
                            e.target.value = "";
                          }}
                        />
                        <span
                          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border border-dashed transition-all ${catUploadingSlot === cat.id
                              ? "border-[#C8782A] text-[#C8782A] bg-[#C8782A]/5"
                              : "border-[#2A1810]/20 text-[#4A2C1A]/70 hover:border-[#C8782A] hover:text-[#C8782A]"
                            }`}
                        >
                          {catUploadingSlot === cat.id ? (
                            <>
                              <FiRefreshCw className="animate-spin text-xs" />
                              Uploading to Cloudinary…
                            </>
                          ) : (
                            <>
                              <FiUploadCloud className="text-sm" />
                              Upload from device
                            </>
                          )}
                        </span>
                      </label>

                      {/* Reset to default */}
                      {cat.hasOverride && (
                        <button
                          onClick={() => resetCatImage(cat.id)}
                          className="w-full flex items-center justify-center gap-1.5 text-xs text-[#4A2C1A]/60 hover:text-red-600 transition-colors py-1"
                        >
                          <FiRotateCcw className="text-xs" />
                          Reset to default image
                        </button>
                      )}

                      {/* Default image note */}
                      {!cat.hasOverride && cat.defaultImage && (
                        <p className="text-[10px] text-[#4A2C1A]/40 text-center">
                          Using default: <span className="font-mono">{cat.defaultImage.length > 40 ? cat.defaultImage.slice(0, 40) + "…" : cat.defaultImage}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info note */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex gap-3">
              <FiAlertCircle className="text-amber-500 text-base shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">How it works</p>
                <p>Images saved here override the defaults in <code className="bg-amber-100 px-1 rounded">categories.ts</code>. Changes are stored in MongoDB and reflected immediately on the Collections page and Homepage category cards. Upload to Cloudinary for the best performance.</p>
              </div>
            </div>
          </div>
        )}

        {/* View: Blog Articles */}
        {activeView === "blogs" && (
          <div className="p-6 lg:p-10 space-y-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-normal text-[#2A1810]">
                  Blog Articles &amp; Editorial Content
                </h1>
                <p className="text-xs text-[#4A2C1A]/70 mt-0.5">
                  Manage architectural articles, crystal guides, and design journal posts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAdminBlogs}
                  disabled={adminBlogsLoading}
                  className="btn-3d btn-3d-outline text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 shrink-0"
                >
                  <FiRefreshCw className={`text-xs ${adminBlogsLoading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
                <Link
                  href="/admin/blogs/create"
                  className="btn-3d btn-3d-dark text-xs px-4 py-2 rounded-full flex items-center gap-2 shrink-0"
                >
                  <FiPlus className="text-sm" />
                  <span>New Post</span>
                </Link>
                <Link
                  href="/admin/blogs"
                  className="btn-3d btn-3d-amber text-xs px-4 py-2 rounded-full flex items-center gap-2 shrink-0"
                >
                  <span>Open Full Blog Studio ↗</span>
                </Link>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A2C1A]/40 text-xs" />
                <input
                  type="text"
                  value={blogSearchTerm}
                  onChange={(e) => setBlogSearchTerm(e.target.value)}
                  placeholder="Filter articles by title or category..."
                  className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-[#2A1810]/15 rounded-xl text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
                />
              </div>
            </div>

            {/* Posts Grid / Cards */}
            {adminBlogsLoading ? (
              <div className="py-20 flex items-center justify-center">
                <FiRefreshCw className="animate-spin text-2xl text-[#C8782A]" />
              </div>
            ) : adminBlogs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#2A1810]/10 space-y-3">
                <FiLayers className="text-4xl mx-auto opacity-30 text-[#C8782A]" />
                <p className="text-sm font-medium text-[#2A1810]">No articles published yet.</p>
                <p className="text-xs text-[#4A2C1A]/60">Create your first architectural post using our rich-text Tiptap editor.</p>
                <Link
                  href="/admin/blogs/create"
                  className="btn-3d btn-3d-dark text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 mt-2"
                >
                  <FiPlus />
                  <span>Write New Article</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminBlogs
                  .filter((b) => {
                    if (!blogSearchTerm.trim()) return true;
                    const q = blogSearchTerm.toLowerCase();
                    return (
                      b.title.toLowerCase().includes(q) ||
                      (b.category && b.category.toLowerCase().includes(q))
                    );
                  })
                  .map((post) => (
                    <div
                      key={post._id}
                      className="bg-white rounded-3xl border border-[#2A1810]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] bg-[#F6F2EC] overflow-hidden">
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#2A1810]/20 text-3xl font-display">
                            N
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {post.isPublished ? (
                            <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                              Published
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                              Draft
                            </span>
                          )}
                          {post.category && (
                            <span className="text-[10px] font-mono uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                              {post.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="text-[10px] font-mono text-[#4A2C1A]/50 block mb-1">
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Unpublished"}
                          </span>
                          <h3 className="font-semibold text-sm text-[#2A1810] line-clamp-2">
                            {post.title}
                          </h3>
                        </div>

                        <div className="pt-3 border-t border-[#2A1810]/8 flex items-center justify-between text-xs">
                          <Link
                            href={`/admin/blogs/${post.slug}`}
                            className="text-[#C8782A] font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <FiEdit2 className="text-xs" /> Edit Post
                          </Link>
                          {post.isPublished && (
                            <Link
                              href={`/blog-details/${post.slug}`}
                              target="_blank"
                              className="text-[#4A2C1A]/70 hover:text-[#2A1810] inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <FiExternalLink className="text-[10px]" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
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
