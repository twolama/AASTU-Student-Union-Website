"use client";

import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import Link from "next/link";
import {
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Check,
  ChevronRight,
  FileText,
  Pin,
  Heading1,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  X,
} from "lucide-react";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Switch } from "@/components/ui/Switch";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AnnouncementCategory } from "@/types/dashboard";

type EditorMode = "create" | "edit";

export interface AnnouncementEditorValues {
  title: string;
  summary: string;
  body: string;
  category: AnnouncementCategory;
  originatingBody: string;
  pinned: boolean;
  coverImageUrl: string;
  coverImageName?: string;
}

interface AnnouncementEditorProps {
  mode: EditorMode;
  initialValues: AnnouncementEditorValues;
  announcementId?: string;
}

const categoryOptions: Array<{ value: AnnouncementCategory; label: string }> = [
  { value: "academic", label: "Academic Updates" },
  { value: "social", label: "Social Events" },
  { value: "union", label: "Union Meetings" },
];

const originatingBodies = [
  "Office of the Registrar",
  "Student Affairs Office",
  "AASTU Student Union",
  "Academic Affairs Office",
];

type SelectionToolbarAction =
  | "bold"
  | "italic"
  | "link"
  | "bulletList"
  | "orderedList"
  | "quote"
  | "heading1"
  | "heading2"
  | "paragraph"
  | "alignLeft"
  | "alignCenter"
  | "alignRight"
  | "alignJustify";

const toolbarActions: Array<{ id: SelectionToolbarAction; icon: ElementType; label: string }> = [
  { id: "bold", icon: Bold, label: "Bold" },
  { id: "italic", icon: Italic, label: "Italic" },
  { id: "link", icon: LinkIcon, label: "Link" },
  { id: "bulletList", icon: List, label: "Bullet list" },
  { id: "orderedList", icon: ListOrdered, label: "Numbered list" },
  { id: "quote", icon: Quote, label: "Quote" },
  { id: "heading1", icon: Heading1, label: "Heading 1" },
  { id: "heading2", icon: Heading2, label: "Heading 2" },
  { id: "paragraph", icon: Pilcrow, label: "Paragraph" },
  { id: "alignLeft", icon: AlignLeft, label: "Align left" },
  { id: "alignCenter", icon: AlignCenter, label: "Align center" },
  { id: "alignRight", icon: AlignRight, label: "Align right" },
  { id: "alignJustify", icon: AlignJustify, label: "Justify" },
];

function normalizeBodyHtml(body: string) {
  const trimmed = body.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("<")) {
    return trimmed;
  }

  return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
}

export function AnnouncementEditor({ mode, initialValues, announcementId }: AnnouncementEditorProps) {
  const [values, setValues] = useState<AnnouncementEditorValues>(initialValues);
  const [bodyHtml, setBodyHtml] = useState(() => normalizeBodyHtml(initialValues.body));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectionToolbar, setSelectionToolbar] = useState({ visible: false, top: 0, left: 0 });
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const editorCanvasRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<Range | null>(null);
  const bodyHtmlRef = useRef(bodyHtml);
  const initialBodySyncedRef = useRef(false);

  useEffect(() => {
    bodyHtmlRef.current = bodyHtml;
  }, [bodyHtml]);

  useEffect(() => {
    if (initialBodySyncedRef.current) {
      return;
    }

    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.innerHTML = bodyHtmlRef.current;
    initialBodySyncedRef.current = true;
  }, []);

  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) {
      return;
    }

    titleElement.style.height = "auto";
    titleElement.style.height = `${titleElement.scrollHeight}px`;
  }, [values.title]);

  const checklist = useMemo(
    () => [
      { label: "Clear and concise title provided", done: values.title.trim().length >= 8 },
      { label: "Department tag is selected", done: Boolean(values.originatingBody) },
      { label: "Featured image uploaded", done: Boolean(values.coverImageUrl || uploadedFile) },
      { label: "Target audience identified", done: values.summary.trim().length >= 20 },
    ],
    [uploadedFile, values.originatingBody, values.summary, values.title, values.coverImageUrl]
  );

  const actionLabel = mode === "create" ? "Publish" : "Update";
  const breadcrumbLabel = mode === "create" ? "Create New Announcement" : "Edit Announcement";

  function updateField<K extends keyof AnnouncementEditorValues>(key: K, value: AnnouncementEditorValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function syncEditorValue() {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const nextHtml = editor.innerHTML;
    bodyHtmlRef.current = nextHtml;
    setBodyHtml(nextHtml);
    updateField("body", nextHtml);
  }

  function getSelectionRange() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const editor = editorRef.current;

    if (!editor || !editor.contains(range.commonAncestorContainer)) {
      return null;
    }

    return range;
  }

  function updateSelectionToolbar() {
    const range = getSelectionRange();
    const canvas = editorCanvasRef.current;

    if (!range || range.collapsed || !canvas) {
      setSelectionToolbar((current) => ({ ...current, visible: false }));
      return;
    }

    selectionRef.current = range.cloneRange();
    const rect = range.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const toolbarWidth = 380;
    const maxLeft = Math.max(12, canvasRect.width - toolbarWidth - 12);
    const rawLeft = rect.left - canvasRect.left + rect.width / 2 - toolbarWidth / 2;
    const left = Math.min(maxLeft, Math.max(12, rawLeft));

    const preferredTop = rect.top - canvasRect.top - 52;
    const top = preferredTop < 8 ? rect.bottom - canvasRect.top + 8 : preferredTop;

    setSelectionToolbar({ visible: true, top, left });
  }

  function restoreSelection() {
    const selection = window.getSelection();
    const range = selectionRef.current;

    if (!selection || !range) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  function applyCommand(command: SelectionToolbarAction) {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.focus();
    restoreSelection();

    if (command === "link") {
      setLinkInputOpen(true);
      return;
    }

    setLinkInputOpen(false);

    switch (command) {
      case "bold":
        document.execCommand("bold");
        break;
      case "italic":
        document.execCommand("italic");
        break;
      case "bulletList":
        document.execCommand("insertUnorderedList");
        break;
      case "orderedList":
        document.execCommand("insertOrderedList");
        break;
      case "quote":
        document.execCommand("formatBlock", false, "blockquote");
        break;
      case "heading1":
        document.execCommand("formatBlock", false, "h1");
        break;
      case "heading2":
        document.execCommand("formatBlock", false, "h2");
        break;
      case "paragraph":
        document.execCommand("formatBlock", false, "p");
        break;
      case "alignLeft":
        document.execCommand("justifyLeft");
        break;
      case "alignCenter":
        document.execCommand("justifyCenter");
        break;
      case "alignRight":
        document.execCommand("justifyRight");
        break;
      case "alignJustify":
        document.execCommand("justifyFull");
        break;
      default:
        break;
    }

    syncEditorValue();
    setSelectionToolbar((current) => ({ ...current, visible: false }));
  }

  function normalizeLink(rawValue: string) {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      return "";
    }

    if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }

  function applyLink() {
    const editor = editorRef.current;
    const normalizedLink = normalizeLink(linkValue);

    if (!editor || !normalizedLink) {
      setLinkInputOpen(false);
      return;
    }

    editor.focus();
    restoreSelection();
    document.execCommand("createLink", false, normalizedLink);
    syncEditorValue();
    setLinkInputOpen(false);
    setLinkValue("");
    setSelectionToolbar((current) => ({ ...current, visible: false }));
  }

  function closeLinkInput() {
    setLinkInputOpen(false);
    setLinkValue("");
  }

  function handleEditorBlur() {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      const toolbar = toolbarRef.current;

      if (toolbar && active && toolbar.contains(active)) {
        return;
      }

      setSelectionToolbar((current) => ({ ...current, visible: false }));
      setLinkInputOpen(false);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(
      mode === "create"
        ? "Announcement ready for publishing."
        : `Announcement ${announcementId ?? ""} updated locally.`.trim()
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/announcements" className="text-gray-500 hover:text-gray-700">
          Announcements
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{breadcrumbLabel}</span>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-[10px] border border-gray-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <FileText size={14} className="text-[#c49a22]" />
              <span>{mode === "create" ? "Drafting Announcement" : "Editing Announcement"}</span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <button
                type="button"
                onClick={() => setSelectionToolbar((current) => ({ ...current, visible: false }))}
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                Preview
              </button>

              <Button type="submit" variant="goldSolid" size="md" className="rounded-xl px-5">
                {actionLabel}
              </Button>
            </div>
          </div>

          <div className="mt-10 flex min-h-[500px] flex-col items-center">
            <div ref={editorCanvasRef} className="relative w-full max-w-[780px]">
              <div
                ref={toolbarRef}
                role="toolbar"
                aria-label="Text formatting toolbar"
                className={cn(
                  "absolute z-[50] flex items-center gap-1 rounded-[10px] border border-[#1f2844] bg-[#1a2238] px-2 py-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.28)]",
                  selectionToolbar.visible ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                style={{ top: selectionToolbar.top, left: selectionToolbar.left }}
              >
                {linkInputOpen ? (
                  <div className="flex items-center gap-2 pl-1">
                    <input
                      type="url"
                      value={linkValue}
                      onChange={(event) => setLinkValue(event.target.value)}
                      placeholder="Paste link"
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          applyLink();
                        }

                        if (event.key === "Escape") {
                          event.preventDefault();
                          closeLinkInput();
                        }
                      }}
                      className="h-8 w-44 rounded-md border border-white/20 bg-white/10 px-2.5 text-xs text-white placeholder:text-white/60 outline-none focus:border-white/40"
                    />
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={applyLink}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Apply link"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={closeLinkInput}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Cancel link"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  toolbarActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => applyCommand(action.id)}
                        className="inline-flex h-8 w-8 items-center justify-center text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label={action.label}
                      >
                        <Icon size={14} />
                      </button>
                    );
                  })
                )}
              </div>

              <div className="text-center">
                <textarea
                  ref={titleRef}
                  value={values.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  rows={1}
                  placeholder="Announcement Title..."
                  className="w-full resize-none overflow-hidden border-0 bg-transparent px-0 text-center text-4xl font-semibold tracking-tight text-gray-700 outline-none placeholder:text-gray-200 sm:text-5xl"
                  style={{ minHeight: "58px" }}
                />
              </div>

              <div className="mt-10 flex justify-center">
                <div
                  ref={editorRef}
                  role="textbox"
                  aria-multiline="true"
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck
                  dir="ltr"
                  onInput={syncEditorValue}
                  onMouseUp={updateSelectionToolbar}
                  onKeyUp={updateSelectionToolbar}
                  onFocus={updateSelectionToolbar}
                  onBlur={handleEditorBlur}
                  data-placeholder="Tell your story or share the latest news with the AASTU community..."
                  className={cn(
                    "min-h-[260px] w-full max-w-[760px] rounded-[10px] outline-none",
                    "text-left text-[18px] leading-[1.95] text-gray-700",
                    "[&:empty:before]:pointer-events-none [&:empty:before]:block [&:empty:before]:px-4 [&:empty:before]:text-left [&:empty:before]:text-gray-300 [&:empty:before]:content-[attr(data-placeholder)]",
                    "[&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-[#c49a22] [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_p]:mb-5 [&_p]:text-left"
                  )}
                />
              </div>

              <div className="mt-4 text-center text-sm text-gray-300">
                Select text to style it.
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-900">
              Publishing Settings
            </h2>

            <div className="mt-5 rounded-[10px] border border-gray-100 bg-[#fafbfe] px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
                    <Pin size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Pin to top</p>
                  </div>
                </div>
                <Switch checked={values.pinned} onCheckedChange={(checked) => updateField("pinned", checked)} />
              </div>
            </div>

            <DropdownSelect
              label="Originating Body"
              value={values.originatingBody}
              options={originatingBodies.map((body) => ({ value: body, label: body }))}
              onValueChange={(value) => updateField("originatingBody", value)}
              className="mt-5"
            />

            <DropdownSelect
              label="Category"
              value={values.category}
              options={categoryOptions}
              onValueChange={(value) => updateField("category", value)}
              className="mt-5"
            />

            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">Cover Image</p>
              <FileUpload
                label=""
                previewUrl={values.coverImageUrl || undefined}
                fileName={uploadedFile?.name || values.coverImageName}
                onChange={setUploadedFile}
                onClear={() => {
                  setUploadedFile(null);
                  updateField("coverImageUrl", "");
                  updateField("coverImageName", undefined);
                }}
                className="[&>label]:rounded-[10px] [&>div]:rounded-[10px]"
              />
            </div>

            <div className="mt-5 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-gray-400">
                <span>Schema: TEXT_4.1</span>
                <span>Status: Draft</span>
              </div>
              <div className="mt-3 text-xs text-gray-400">Last autosaved: 2 mins ago</div>
            </div>
          </section>

          <section className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Draft Checklist</p>

            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-start gap-3 text-sm">
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      item.done
                        ? "border-[#c49a22] bg-[#c49a22] text-white"
                        : "border-gray-200 bg-white text-transparent"
                    )}
                  >
                    ✓
                  </span>
                  <span className={cn(item.done ? "text-gray-700" : "text-gray-400")}>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {statusMessage ? (
            <section className="rounded-[10px] border border-[#c49a22]/20 bg-[#fdf8ec] p-4 text-sm text-[#8c6c14] shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              {statusMessage}
            </section>
          ) : null}

          <div className="flex gap-3">
            <Button type="button" variant="outline" size="md" className="flex-1">
              Save Draft
            </Button>
            <Button type="submit" variant="goldSolid" size="md" className="flex-1">
              {actionLabel}
            </Button>
          </div>
        </aside>
      </div>
    </form>
  );
}