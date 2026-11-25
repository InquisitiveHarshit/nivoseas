"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { IFaqItem } from "@/models/Blog";

interface FaqEditorProps {
  faqs: IFaqItem[];
  onChange: (faqs: IFaqItem[]) => void;
}

export default function FaqEditor({ faqs, onChange }: FaqEditorProps) {
  const addFaq = () => {
    onChange([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (idx: number) => {
    onChange(faqs.filter((_, i) => i !== idx));
  };

  const updateFaq = (idx: number, field: "question" | "answer", value: string) => {
    const next = [...faqs];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-[#2A1810]">
            Structured FAQs (JSON-LD)
          </h4>
          <p className="text-xs text-[#4A2C1A]/65">
            Rendered as an interactive FAQ accordion and Schema.org FAQPage JSON-LD.
          </p>
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="btn-3d btn-3d-outline text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
        >
          <FiPlus /> Add FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-xs text-[#4A2C1A]/60 bg-[#F6F2EC] border border-dashed border-[#2A1810]/15 rounded-2xl p-6 text-center">
          No FAQs added yet. Click &ldquo;Add FAQ&rdquo; to add a question &amp; answer.
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F6F2EC] border border-[#2A1810]/10 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C8782A] font-semibold">
                  FAQ #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(idx, "question", e.target.value)}
                placeholder="Question (e.g. What ceiling height is ideal for crystal chandeliers?)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-white text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
              />
              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                placeholder="Detailed answer..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2A1810]/15 bg-white text-[#2A1810] focus:outline-none focus:border-[#C8782A]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
