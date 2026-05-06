import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { ADMIN_DEFAULT_SELECTIONS } from "../../../contexts/AdminDashboardFiltersContext";

const DEFAULT_FILTERS = {
  Timeframe: ["Last 7d", "Last 30d", "Last 90d", "This year", "All time"],
  Cohort: ["All cohorts", "New users", "Returning", "Power users"],
  Persona: ["All personas", "Freelancer", "Agency", "Enterprise"],
  Device: ["All devices", "Desktop", "Mobile", "Tablet"],
};

const GLOBAL_FILTER_ORDER = [
  "Timeframe",
  "Cohort",
  "Persona",
  "Device",
];

function FilterDropdown({ label, options, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const displayLabel = value || label;

  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);

  return (
    <div
      className={`relative min-w-0 w-full lg:w-auto ${open ? "z-[200]" : "z-40"}`}
      ref={ref}
    >
      <button
        type="button"
        onClick={() => {
          if (!disabled) setOpen(!open);
        }}
        disabled={disabled}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-[#e4e4e7] bg-white px-4 py-2 text-left text-[14px] font-medium leading-5 text-[#18181b] transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#f4f4f5]"
        } lg:inline-flex lg:w-auto`}
      >
        <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#18181b] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full z-[300] mt-1 max-h-[min(280px,50vh)] overflow-y-auto rounded-[6px] border border-[#e4e4e7] bg-white py-1 shadow-lg lg:left-auto lg:right-0 lg:min-w-[180px] lg:w-max lg:max-w-[min(320px,90vw)]">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[14px] leading-5 transition-colors whitespace-nowrap ${
                value === opt
                  ? "bg-[#f4f4f5] text-[#18181b] font-medium"
                  : "text-[#52525b] hover:bg-[#f4f4f5]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function mergeFilterDefinitions(apiFilters) {
  const base = { ...DEFAULT_FILTERS, ...(apiFilters || {}) };
  const keys = new Set(Object.keys(base));
  const ordered = [];

  for (const k of GLOBAL_FILTER_ORDER) {
    if (keys.has(k)) {
      ordered.push([k, base[k]]);
      keys.delete(k);
    }
  }
  const rest = [...keys].sort();
  for (const k of rest) {
    ordered.push([k, base[k]]);
  }
  return ordered;
}

export default function OverviewFilters({
  filters = DEFAULT_FILTERS,
  searchPlaceholder = "Search files, content, and tags...",
  onFiltersChange,
  /** When using shared admin dashboard state, parent passes these and omits defaultSelections. */
  selections: controlledSelections,
  search: controlledSearch,
  /** @deprecated — use controlled `selections` from AdminDashboardFiltersContext */
  defaultSelections,
}) {
  const mergedDefaults = {
    ...ADMIN_DEFAULT_SELECTIONS,
    ...(defaultSelections || {}),
  };

  const isControlled =
    controlledSelections !== undefined && controlledSearch !== undefined;

  const [internalSearch, setInternalSearch] = useState("");
  const [internalSelected, setInternalSelected] = useState(() => ({
    ...mergedDefaults,
  }));

  const searchValue = isControlled ? controlledSearch : internalSearch;
  const selectedFilters = isControlled ? controlledSelections : internalSelected;

  const normalizedFilters = useMemo(
    () => mergeFilterDefinitions(filters),
    [filters],
  );

  const updateFilter = (label, value) => {
    if (isControlled) {
      const next = { ...selectedFilters, [label]: value };
      onFiltersChange?.({ search: searchValue, filters: next });
      return;
    }
    const next = { ...selectedFilters, [label]: value };
    setInternalSelected(next);
    onFiltersChange?.({ search: internalSearch, filters: next });
  };

  return (
    <div className="relative flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      <div className="w-full shrink-0 lg:w-[400px] lg:max-w-[400px]">
        <div className="flex h-10 items-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white px-3">
          <Search
            className="h-5 w-5 shrink-0 text-[#71717a]"
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => {
              const v = e.target.value;
              if (isControlled) {
                onFiltersChange?.({ search: v, filters: selectedFilters });
              } else {
                setInternalSearch(v);
                onFiltersChange?.({ search: v, filters: selectedFilters });
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-[16px] font-normal leading-6 text-[#18181b] outline-none placeholder:text-[#71717a]"
          />
        </div>
      </div>

      <div className="grid w-full min-w-0 grid-cols-2 gap-2 lg:flex lg:w-auto lg:flex-nowrap lg:items-center lg:gap-2">
        {normalizedFilters.map(([label, options]) => (
          <FilterDropdown
            key={label}
            label={label}
            options={options}
            value={selectedFilters[label]}
            onChange={(value) => updateFilter(label, value)}
            disabled={
              label.toLowerCase() === "channel" ||
              label.toLowerCase() === "plan" ||
              label.toLowerCase() === "region" ||
              label.toLowerCase() === "source" ||
              label.toLowerCase() === "segment" ||
              label.toLowerCase() === "stage" ||
              label.toLowerCase() === "tool" ||
              label.toLowerCase() === "feature"
            }
          />
        ))}
      </div>
    </div>
  );
}
