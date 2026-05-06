import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "manifestr_admin_dashboard_filters_v1";

/** Baseline dimensions shown on every admin dashboard (aligned with OverviewFilters defaults). */
export const ADMIN_DEFAULT_SELECTIONS = {
  Timeframe: "Last 30d",
  Cohort: "All cohorts",
  Persona: "All personas",
  Device: "All devices",
};

export function adminFiltersToApiParams(selections, search) {
  const s = selections || ADMIN_DEFAULT_SELECTIONS;
  return {
    timeframe: s.Timeframe ?? ADMIN_DEFAULT_SELECTIONS.Timeframe,
    search: search ?? "",
    cohort: s.Cohort ?? ADMIN_DEFAULT_SELECTIONS.Cohort,
    persona: s.Persona ?? ADMIN_DEFAULT_SELECTIONS.Persona,
    device: s.Device ?? ADMIN_DEFAULT_SELECTIONS.Device,
  };
}

function loadStored() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(selections, search) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selections, search }),
    );
  } catch {
    /* ignore quota */
  }
}

const AdminDashboardFiltersContext = createContext(null);

export function AdminDashboardFiltersProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState(() => ({
    ...ADMIN_DEFAULT_SELECTIONS,
  }));

  useEffect(() => {
    const stored = loadStored();
    if (stored?.selections && typeof stored.selections === "object") {
      setSelections({
        ...ADMIN_DEFAULT_SELECTIONS,
        ...stored.selections,
      });
    }
    if (typeof stored?.search === "string") {
      setSearch(stored.search);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(selections, search);
  }, [hydrated, selections, search]);

  const applyFiltersChange = useCallback(({ search: nextSearch, filters }) => {
    if (typeof nextSearch === "string") setSearch(nextSearch);
    if (filters && typeof filters === "object") {
      setSelections((prev) => ({ ...prev, ...filters }));
    }
  }, []);

  const apiParams = useMemo(
    () => adminFiltersToApiParams(selections, search),
    [selections, search],
  );

  const value = useMemo(
    () => ({
      hydrated,
      search,
      selections,
      setSearch,
      setSelections,
      applyFiltersChange,
      apiParams,
    }),
    [hydrated, search, selections, applyFiltersChange, apiParams],
  );

  return (
    <AdminDashboardFiltersContext.Provider value={value}>
      {children}
    </AdminDashboardFiltersContext.Provider>
  );
}

export function useAdminDashboardFilters() {
  const ctx = useContext(AdminDashboardFiltersContext);
  if (!ctx) {
    throw new Error(
      "useAdminDashboardFilters must be used within AdminDashboardFiltersProvider",
    );
  }
  return ctx;
}
