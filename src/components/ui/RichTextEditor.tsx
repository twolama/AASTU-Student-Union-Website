"use client";

import React, { useRef, useEffect } from "react";
import { Bold, Italic, List, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  error?: string[];
  id?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder,
  className,
  minHeight = "150px",
  error,
  id
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const isFirstRender = useRef(true);
  const lastEmittedHtml = useRef(value);

  // Handle initial value and external updates
  useEffect(() => {
    if (editorRef.current) {
      // If it's an external update (value differs from what we last sent)
      // AND we are not currently focused (meaning it's not a user typing)
      const isFocused = document.activeElement === editorRef.current;
      const isExternalChange = value !== lastEmittedHtml.current;

      if (isFirstRender.current || (isExternalChange && !isFocused)) {
        editorRef.current.innerHTML = value || "";
        lastEmittedHtml.current = value;
        isFirstRender.current = false;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastEmittedHtml.current = html;
      onChange(html);
    }
  };

  const handleFormat = (command: string, arg?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      const html = editorRef.current.innerHTML;
      lastEmittedHtml.current = html;
      onChange(html);
    }
  };

  const handleLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      handleFormat("createLink", url);
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className={cn(
        "rounded-[8px] border bg-white shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#c49a22]/20 focus-within:border-[#c49a22]",
        error ? "border-red-500" : "border-gray-200"
      )}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-2 py-1.5 bg-gray-50/50">
          <button
            type="button"
            onClick={() => handleFormat("bold")}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat("italic")}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat("insertUnorderedList")}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={handleLink}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Link"
          >
            <LinkIcon size={14} />
          </button>
        </div>

        {/* Editable Area - React will NOT manage the children here to avoid cursor jumps */}
        <div
          id={id}
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className={cn(
            "p-3 text-sm focus:outline-none prose prose-sm max-w-none",
            "overflow-y-auto"
          )}
          style={{ minHeight }}
          data-placeholder={placeholder}
        />
      </div>
      {error && error.length > 0 && (
        <p className="text-xs text-red-500">{error.join(" ")}</p>
      )}
      
      {/* Basic placeholder support for contentEditable */}
      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
}
