import React from "react";

// ─── Shared helper: section header (yellow bar matching existing design) ───────
export function SectionHeader({ title, engTitle }) {
  return (
    <div className="mb-3 flex items-center gap-3 border-l-4 border-yellow-400 bg-yellow-50 px-4 py-2.5">
      <div>
        <span className="font-bold text-[13px] text-slate-800">{title}</span>
        {engTitle && (
          <span className="ml-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            / {engTitle}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Shared helper: field row ──────────────────────────────────────────────────
export function FieldRow({ label, engLabel, children, required }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
      <label className="shrink-0 pt-2.5 text-[13px] font-semibold text-slate-700 sm:w-[180px]">
        {label}
        {engLabel && (
          <span className="block text-[11px] font-normal text-slate-400">
            {engLabel}
          </span>
        )}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─── Shared input style ────────────────────────────────────────────────────────
export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[13px] font-sarabun text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100";

export const textareaCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[13px] font-sarabun text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100 resize-none";

// ─── Shared placeholder badge ──────────────────────────────────────────────────
export function PlaceholderSection({ label }) {
  return (
    <div className="flex min-h-[64px] items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center">
      <div>
        <i className="fas fa-clock-rotate-left text-slate-300 text-xl mb-1" />
        <p className="text-[12px] font-medium text-slate-400">
          {label} — รอข้อมูล spec จากทีมงาน
        </p>
      </div>
    </div>
  );
}
