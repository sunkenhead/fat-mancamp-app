import React, { useEffect, useState } from "react";
import { CampProvider, useCamp } from "./CampContext";

const THEME_KEY = "fatman_theme";
const LIGHT_ICON_192 = "/icon-192.png";
const DARK_ICON_192 = "/icon-192-dark.png";

export function App() {
  return (
    <CampProvider>
      <Shell />
    </CampProvider>
  );
}

type PageKey = "front" | "timeline" | "food" | "booze" | "rules";

function Shell() {
  const [page, setPage] = useState<PageKey>("front");
  const { state, loading, saving, save } = useCamp();

  const { theme, toggleTheme, canInstall, install } = useThemeAndPWA();

  if (loading || !state) {
    return <div className="app">Loading Fat Man Camp…</div>;
  }

  return (
    <div className="app">
      {/* Top bar */}
      <div className="top-bar">
        <div className="top-left">
          <img
            id="cow-inline-icon"
            className="cow-icon-inline"
            src={theme === "dark" ? DARK_ICON_192 : LIGHT_ICON_192}
            alt="Fat Man Camp icon"
          />
          <div>
            <h1>Fat Man Camp</h1>
            <div className="subtitle">
              Annual reunion of active & retired mischief.
            </div>
          </div>
        </div>
        <div className="top-right">
          <div className="top-buttons">
            <button
              id="theme-toggle-btn"
              className="secondary"
              type="button"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
            </button>
            {canInstall && (
              <button
                id="install-app-btn"
                className="primary"
                type="button"
                onClick={install}
              >
                📲 Install app
              </button>
            )}
            <button
              className="primary"
              type="button"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="card">
        <div className="row">
          <NavButton label="Front Page" active={page === "front"} onClick={() => setPage("front")} />
          <NavButton label="Timeline" active={page === "timeline"} onClick={() => setPage("timeline")} />
          <NavButton label="Food Plan" active={page === "food"} onClick={() => setPage("food")} />
          <NavButton label="Booze" active={page === "booze"} onClick={() => setPage("booze")} />
          <NavButton label="Notes / Rules" active={page === "rules"} onClick={() => setPage("rules")} />
        </div>
      </div>

      {page === "front" && <FrontPage />}
      {page === "timeline" && <TimelinePage />}
      {page === "food" && <FoodPage />}
      {page === "booze" && <BoozePage />}
      {page === "rules" && <RulesPage />}

      <SettingsCard />
      <BackupCard />
    </div>
  );
}

function NavButton(props: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={props.active ? "primary" : "secondary"}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

/* ===== Pages ===== */

function FrontPage() {
  const { state } = useCamp();
  const { event } = state!;
  return (
    <div className="card">
      <img
        src={event.heroImageUrl}
        alt="Fat Man Camp hero"
        style={{ width: "100%", borderRadius: 12, marginBottom: "0.75rem" }}
      />
      <h2>{event.title}</h2>
      <p>{event.location}</p>
      <p>{event.dates}</p>
    </div>
  );
}

function TimelinePage() {
  const { state, setState } = useCamp();
  const { timeline } = state!;

  const updateTravel = (
    id: string,
    field: "name" | "method" | "details",
    value: string
  ) => {
    setState(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        travel: prev.timeline.travel.map(t =>
          t.id === id ? { ...t, [field]: value } : t
        )
      }
    }));
  };

  const addTravel = () => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        travel: [
          ...prev.timeline.travel,
          { id, name: "New Guy", method: "flight", details: "" }
        ]
      }
    }));
  };

  const removeTravel = (id: string) => {
    setState(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        travel: prev.timeline.travel.filter(t => t.id !== id)
      }
    }));
  };

  return (
    <div className="card">
      <h2>Itinerary</h2>
      <ul className="list">
        {timeline.itinerary.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2>Travel Plan</h2>
      {timeline.travel.map(t => (
        <div key={t.id} className="row" style={{ marginBottom: "0.5rem" }}>
          <input
            value={t.name}
            onChange={e => updateTravel(t.id, "name", e.target.value)}
            placeholder="Name"
          />
          <select
            value={t.method}
            onChange={e =>
              updateTravel(t.id, "method", e.target.value as any)
            }
          >
            <option value="flight">Flight</option>
            <option value="drive">Drive</option>
            <option value="other">Other</option>
          </select>
          <input
            value={t.details}
            onChange={e => updateTravel(t.id, "details", e.target.value)}
            placeholder="Flight # / ETA"
          />
          <button
            type="button"
            className="danger"
            onClick={() => removeTravel(t.id)}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="secondary" onClick={addTravel}>
        ➕ Add Traveler
      </button>
    </div>
  );
}

function FoodPage() {
  const { state, setState } = useCamp();
  const { food } = state!;

  const updateMeal = (
    idx: number,
    field: "day" | "breakfast" | "lunch" | "dinner",
    value: string
  ) => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        meals: prev.food.meals.map((m, i) =>
          i === idx ? { ...m, [field]: value } : m
        )
      }
    }));
  };

  const addMeal = () => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        meals: [
          ...prev.food.meals,
          {
            day: "New Day",
            breakfast: "",
            lunch: "",
            dinner: ""
          }
        ]
      }
    }));
  };

  const removeMeal = (idx: number) => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        meals: prev.food.meals.filter((_, i) => i !== idx)
      }
    }));
  };

  const addSnack = () => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: [...prev.food.snacks, { name: "New Snack" }]
      }
    }));
  };

  const updateSnack = (idx: number, value: string) => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: prev.food.snacks.map((s, i) =>
          i === idx ? { ...s, name: value } : s
        )
      }
    }));
  };

  const removeSnack = (idx: number) => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: prev.food.snacks.filter((_, i) => i !== idx)
      }
    }));
  };

  return (
    <div className="card">
      <h2>Meal Plan</h2>
      {food.meals.map((m, i) => (
        <div key={i} className="card" style={{ marginBottom: "0.5rem" }}>
          <div className="row">
            <input
              value={m.day}
              onChange={e => updateMeal(i, "day", e.target.value)}
              placeholder="Day"
            />
            <button
              type="button"
              className="danger"
              onClick={() => removeMeal(i)}
            >
              ✕
            </button>
          </div>
          <div className="row">
            <input
              value={m.breakfast}
              onChange={e => updateMeal(i, "breakfast", e.target.value)}
              placeholder="Breakfast"
            />
            <input
              value={m.lunch}
              onChange={e => updateMeal(i, "lunch", e.target.value)}
              placeholder="Lunch"
            />
            <input
              value={m.dinner}
              onChange={e => updateMeal(i, "dinner", e.target.value)}
              placeholder="Dinner"
            />
          </div>
        </div>
      ))}
      <button type="button" className="secondary" onClick={addMeal}>
        ➕ Add Day
      </button>

      <h2 style={{ marginTop: "1rem" }}>Snacks</h2>
      {food.snacks.map((s, i) => (
        <div key={i} className="row" style={{ marginBottom: "0.5rem" }}>
          <input
            value={s.name}
            onChange={e => updateSnack(i, e.target.value)}
            placeholder="Snack"
          />
          <button
            type="button"
            className="danger"
            onClick={() => removeSnack(i)}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="secondary" onClick={addSnack}>
        ➕ Add Snack
      </button>
    </div>
  );
}

function BoozePage() {
  const { state, setState } = useCamp();
  const booze = state!.booze;

  const updateItem = (
    id: string,
    field: "type" | "label" | "quantity",
    value: string
  ) => {
    setState(prev => ({
      ...prev,
      booze: prev.booze.map(b =>
        b.id === id ? { ...b, [field]: value } : b
      )
    }));
  };

  const addItem = () => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState(prev => ({
      ...prev,
      booze: [
        ...prev.booze,
        { id, type: "Whiskey", label: "New Bottle", quantity: "1" }
      ]
    }));
  };

  const removeItem = (id: string) => {
    setState(prev => ({
      ...prev,
      booze: prev.booze.filter(b => b.id !== id)
    }));
  };

  return (
    <div className="card">
      <h2>Booze Inventory</h2>
      {booze.map(b => (
        <div key={b.id} className="row" style={{ marginBottom: "0.5rem" }}>
          <input
            value={b.type}
            onChange={e => updateItem(b.id, "type", e.target.value)}
            placeholder="Type"
          />
          <input
            value={b.label}
            onChange={e => updateItem(b.id, "label", e.target.value)}
            placeholder="Label / Brand"
          />
          <input
            value={b.quantity}
            onChange={e => updateItem(b.id, "quantity", e.target.value)}
            placeholder="Quantity"
          />
          <button
            type="button"
            className="danger"
            onClick={() => removeItem(b.id)}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="secondary" onClick={addItem}>
        ➕ Add Item
      </button>
    </div>
  );
}

function RulesPage() {
  const { state, setState } = useCamp();
  const rules = state!.rules;

  const updateRule = (id: string, value: string) => {
    setState(prev => ({
      ...prev,
      rules: prev.rules.map(r => (r.id === id ? { ...r, text: value } : r))
    }));
  };

  const addRule = () => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState(prev => ({
      ...prev,
      rules: [...prev.rules, { id, text: "New rule" }]
    }));
  };

  const removeRule = (id: string) => {
    setState(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== id)
    }));
  };

  return (
    <div className="card">
      <h2>Notes & Rules</h2>
      {rules.map(r => (
        <div key={r.id} className="row" style={{ marginBottom: "0.5rem" }}>
          <input
            value={r.text}
            onChange={e => updateRule(r.id, e.target.value)}
            placeholder="Rule / note"
          />
          <button
            type="button"
            className="danger"
            onClick={() => removeRule(r.id)}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="secondary" onClick={addRule}>
        ➕ Add Rule
      </button>
    </div>
  );
}

/* ===== Settings + Backup (similar idea to dinner app) ===== */

function SettingsCard() {
  const { setState } = useCamp();

  const resetAll = () => {
    if (!confirm("Reset travel, food, booze, and rules to defaults?")) return;
    // You can choose how aggressive this is; for now just clears booze.
    setState(prev => ({
      ...prev,
      booze: [],
    }));
  };

  return (
    <div className="card">
      <details>
        <summary>
          <span className="summary-title">Settings</span>
          <span className="summary-arrow">▶</span>
        </summary>
        <div className="section-body">
          <div className="row">
            <button type="button" className="danger" onClick={resetAll}>
              Reset Booze (example)
            </button>
          </div>
          <p className="muted" style={{ marginTop: "0.5rem" }}>
            We can wire more settings here later (per-member auth, NFC, etc.).
          </p>
        </div>
      </details>
    </div>
  );
}

function BackupCard() {
  const { state, setState, save } = useCamp();

  const exportBackup = () => {
    if (!state) return;
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fatman-camp-backup.json";
    a.click();
  };

  const importBackup = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    setState(() => parsed);
    await save();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void importBackup(file);
    e.target.value = "";
  };

  return (
    <div className="card">
      <details>
        <summary>
          <span className="summary-title">Backup &amp; Restore</span>
          <span className="summary-arrow">▶</span>
        </summary>
        <div className="section-body">
          <div className="row">
            <button type="button" className="secondary" onClick={exportBackup}>
              Download Backup
            </button>
            <label className="secondary" style={{ padding: "0.4rem 0.9rem", cursor: "pointer" }}>
              Restore Backup
              <input
                type="file"
                accept="application/json"
                style={{ display: "none" }}
                onChange={onFileChange}
              />
            </label>
          </div>
          <p className="muted" style={{ marginTop: "0.5rem" }}>
            Backup includes event info, timeline, food, booze, and rules.
          </p>
        </div>
      </details>
    </div>
  );
}

/* ===== Theme & PWA hook (ported from your index.html logic) ===== */

function useThemeAndPWA() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  // Init theme
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch {}
    if (!stored) {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      stored = prefersDark ? "dark" : "light";
    }
    setTheme(stored === "dark" ? "dark" : "light");
  }, []);

  // Apply theme to DOM (icons, meta tag like your original app)
  useEffect(() => {
    const root = document.documentElement;
    const appIconLink = document.getElementById(
      "app-icon"
    ) as HTMLLinkElement | null;
    const inlineIcon = document.getElementById(
      "cow-inline-icon"
    ) as HTMLImageElement | null;
    const themeMeta = document.querySelector(
      'meta[name="theme-color"]'
    ) as HTMLMetaElement | null;

    root.setAttribute("data-theme", theme);

    if (appIconLink) {
      appIconLink.href = theme === "dark" ? DARK_ICON_192 : LIGHT_ICON_192;
    }
    if (inlineIcon) {
      inlineIcon.src = theme === "dark" ? DARK_ICON_192 : LIGHT_ICON_192;
    }
    if (themeMeta) {
      themeMeta.content = theme === "dark" ? "#020617" : "#111827";
    }

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  // PWA install + SW auto-refresh (same idea as your existing app) 
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    let hasReloadedForSW =
      sessionStorage.getItem("reloadedForSW") === "yes";

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", event => {
        if (event.data && event.data.type === "NEW_VERSION") {
          if (!hasReloadedForSW) {
            hasReloadedForSW = true;
            sessionStorage.setItem("reloadedForSW", "yes");
            window.location.reload();
          }
        }
      });

      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .catch(err => console.error("SW registration failed", err));
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const toggleTheme = () =>
    setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  return { theme, toggleTheme, canInstall, install };
}
