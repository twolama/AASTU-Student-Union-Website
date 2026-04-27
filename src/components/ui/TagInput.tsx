import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "./Input";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  helpText?: string;
}

export function TagInput({ label, tags, onChange, placeholder = "Add tag...", className, helpText }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="default" className="flex items-center gap-1 py-1 px-2.5">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full p-0.5 hover:bg-gray-200 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} className="text-gray-500" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <button
          type="button"
          onClick={addTag}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
      {helpText && <p className="text-xs text-gray-400">{helpText}</p>}
    </div>
  );
}
