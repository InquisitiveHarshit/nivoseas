"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
  FiBold,
  FiItalic,
  FiList,
  FiImage,
  FiGrid,
} from "react-icons/fi";
import TiptapImageModal from "./TiptapImageModal";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] p-5 text-sm text-[#2A1810] leading-relaxed focus:outline-none prose prose-sm max-w-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:mt-5 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#2A1810]/20 [&_td]:p-2 [&_th]:border [&_th]:border-[#2A1810]/20 [&_th]:bg-[#F6F2EC] [&_th]:p-2 [&_th]:text-left [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-3",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[360px] rounded-2xl border border-[#2A1810]/15 bg-[#F6F2EC]/50 p-5 text-xs text-[#4A2C1A]/60">
        Loading rich text editor...
      </div>
    );
  }

  const btnClass = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
      active
        ? "bg-[#C8782A] text-white"
        : "bg-white text-[#2A1810] border border-[#2A1810]/15 hover:bg-[#F6F2EC]"
    }`;

  return (
    <div className="rounded-2xl border border-[#2A1810]/15 bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-[#2A1810]/10 bg-[#F6F2EC]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          title="Bold"
        >
          <FiBold />
          <span>Bold</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
          title="Italic"
        >
          <FiItalic />
          <span>Italic</span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btnClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <FiList />
          <span>Bullets</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className={btnClass(editor.isActive("table"))}
          title="Insert 3x3 Table"
        >
          <FiGrid />
          <span>Table</span>
        </button>

        <button
          type="button"
          onClick={() => setImageModalOpen(true)}
          className={btnClass(false)}
          title="Insert Image"
        >
          <FiImage />
          <span>Image</span>
        </button>
      </div>

      <EditorContent editor={editor} />

      <TiptapImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsert={(url, alt) => {
          editor.chain().focus().setImage({ src: url, alt }).run();
        }}
      />
    </div>
  );
}
