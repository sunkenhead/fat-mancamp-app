import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const API_BASE = "https://quiet-mode-c397.broad-night-8709.workers.dev"; // e.g. https://fatman-camp.fancy-frost.workers.dev

type TravelEntry = {
  id: string;
  name: string;
  method: "flight" | "drive" | "other";
  details: string;
};

type MealPlan = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

type SnackItem = { name: string; notes?: string };
type BoozeItem = { id: string; type: string; label: string; quantity: string };
type RuleItem = { id: string; text: string };

export type FatManCampState = {
  event: {
    title: string;
    location: string;
    dates: string;
    heroImageUrl: string;
  };
  timeline: {
    itinerary: string[];
    travel: TravelEntry[];
  };
  food: {
    meals: MealPlan[];
    snacks: SnackItem[];
  };
  booze: BoozeItem[];
  rules: RuleItem[];
};

type CampContextValue = {
  state: FatManCampState | null;
  setState: (updater: (prev: FatManCampState) => FatManCampState) => void;
  save: () => Promise<void>;
  loading: boolean;
  saving: boolean;
};

const CampContext = createContext<CampContextValue | undefined>(undefined);

export function CampProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<FatManCampState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/camp`);
        if (!res.ok) throw new Error("Failed to load camp state");
        const data = (await res.json()) as FatManCampState;
        setStateInternal(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setState = (updater: (prev: FatManCampState) => FatManCampState) => {
    setStateInternal(prev => (prev ? updater(prev) : prev));
  };

  const save = async () => {
    if (!state) return;
    setSaving(true);
    try {
      await fetch(`${API_BASE}/camp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
    } catch (err) {
      console.error("Failed to save camp state", err);
      alert("Could not save changes to the server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CampContext.Provider value={{ state, setState, save, loading, saving }}>
      {children}
    </CampContext.Provider>
  );
}

export function useCamp() {
  const ctx = useContext(CampContext);
  if (!ctx) {
    throw new Error("useCamp must be used within CampProvider");
  }
  return ctx;
}

