import { useState } from "react";
import {
  useModelCatalog,
  type ModelCatalogEntry,
} from "@/queries/plans.queries";
import { tierDescription } from "@/lib/model-catalog";
import { ProviderIcon } from "@/components/models/ProviderIcon";

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5 shrink-0">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 7.2v3.6M8 5.2v.01"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function fallbackEntry(name: string): ModelCatalogEntry {
  return {
    name,
    displayName: name.includes("/") ? name.split("/")[1] : name,
    provider: name.split("/")[0] ?? "openai",
    tier: "MEDIUM",
    supportsVision: false,
    sortOrder: 0,
  };
}

interface ModelShowcaseProps {
  allowedModels: string[];
  description: string;
  isFree: boolean;
}

export function ModelShowcase({
  allowedModels,
  description,
  isFree,
}: ModelShowcaseProps) {
  const { data: catalog } = useModelCatalog();
  const [open, setOpen] = useState(false);

  const allEntries = allowedModels.map(
    (n) => catalog?.find((m) => m.name === n) ?? fallbackEntry(n),
  );

  return (
    <>
      <p className="text-sm leading-relaxed text-slate-300">{description}</p>

      {/* لیست واقعی مدل‌ها فقط با کلیک روی این دکمه (داخل مودال) نشان داده می‌شود */}
      {!isFree && allowedModels.length > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 py-2.5 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
        >
          مشاهده {allowedModels.length} مدل
          <InfoIcon />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                مدل‌های این پلن
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {allEntries.map((m) => (
                <div
                  key={m.name}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-4"
                >
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <ProviderIcon provider={m.provider} size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">
                      {m.displayName}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {tierDescription(m.tier)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
