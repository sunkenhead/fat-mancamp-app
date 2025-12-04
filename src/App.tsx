import React, { useEffect, useState } from "react";
import { CampProvider, useCamp } from "./CampContext";

const THEME_KEY = "fatman_theme";
const LIGHT_ICON_192 = "/icon-192.png";
const DARK_ICON_192 = "/icon-192-dark.png";

type PageKey = "front" | "timeline" | "food" | "booze" | "rules";

export function App() {
  return (
    <CampProvider>
      <Shell />
    </CampProvider>
  );
}

function Shell() {
  const { state, loading, saving, save } = useCamp();
  const { theme, toggleTheme, canInstall, install } = useThemeAndPWA();

  const [page, setPage] = useState<PageKey>("front");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  if (loading || !state) {
    return (
      <div className="layout">
        <div className="main-area">
          <div className="app">
            <p>Loading Fat Man Camp…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <button
          className="sidebar-toggle"
          type="button"
          onClick={() => setSidebarCollapsed((c) => !c)}
        >
          {sidebarCollapsed ? "➡️" : "⬅️"}
        </button>

        <div className="sidebar-logo">
          <img src={theme === "dark" ? DARK_ICON_192 : LIGHT_ICON_192} alt="Fat-Man Camp" />
          {!sidebarCollapsed && <span>Fat-Man Camp</span>}
        </div>

        <nav className="sidebar-nav">
          <SidebarItem
            icon="🏕️"
            label="Front Page"
            active={page === "front"}
            collapsed={sidebarCollapsed}
            onClick={() => setPage("front")}
          />
          <SidebarItem
            icon="🕒"
            label="Timeline"
            active={page === "timeline"}
            collapsed={sidebarCollapsed}
            onClick={() => setPage("timeline")}
          />
          <SidebarItem
            icon="🍳"
            label="Food Plan"
            active={page === "food"}
            collapsed={sidebarCollapsed}
            onClick={() => setPage("food")}
          />
          <SidebarItem
            icon="🥃"
            label="Booze"
            active={page === "booze"}
            collapsed={sidebarCollapsed}
            onClick={() => setPage("booze")}
          />
          <SidebarItem
            icon="📜"
            label="Notes / Rules"
            active={page === "rules"}
            collapsed={sidebarCollapsed}
            onClick={() => setPage("rules")}
          />
        </nav>
      </aside>

      {/* Main content */}
      <div className="main-area">
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
                  Annual reunion of active & retired mischief, way too much food, and war
                  stories.
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

          {/* Pages */}
          {page === "front" && <FrontPage />}
          {page === "timeline" && <TimelinePage />}
          {page === "food" && <FoodPage />}
          {page === "booze" && <BoozePage />}
          {page === "rules" && <RulesPage />}

          <SettingsCard />
          <BackupCard />
        </div>
      </div>
    </div>
  );
}

/* ===== Sidebar components ===== */

type SidebarItemProps = {
  icon: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
};

function SidebarItem({
  icon,
  label,
  active,
  collapsed,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-item-icon">{icon}</span>
      {!collapsed && <span className="sidebar-item-label">{label}</span>}
    </button>
  );
}

/* ===== Pages ===== */

function FrontPage() {
  const { state, setState } = useCamp();
  const { event, timeline, booze } = state!;

  const updateEvent = (field: "title" | "location" | "dates" | "heroImageUrl", value: string) => {
    setState(prev => ({
      ...prev,
      event: {
        ...prev.event,
        [field]: value,
      },
    }));
  };

  const heroSrc = event.heroImageUrl || "https://placehold.co/1200x500?text=Fat+Man+Camp";

  return (
    <div className="card">
      <img
        src={heroSrc}
        alt="Fat Man Camp hero"
        style={{ width: "100%", borderRadius: 12, marginBottom: "0.75rem" }}
      />

      <div className="row" style={{ marginBottom: "0.6rem" }}>
        <input
          value={event.title}
          onChange={(e) => updateEvent("title", e.target.value)}
          placeholder="Event title"
        />
      </div>

      <div className="row" style={{ marginBottom: "0.6rem" }}>
        <input
          value={event.location}
          onChange={(e) => updateEvent("location", e.target.value)}
          placeholder="Location"
        />
        <input
          value={event.dates}
          onChange={(e) => updateEvent("dates", e.target.value)}
          placeholder="Dates"
        />
      </div>

      <div className="row" style={{ marginBottom: "0.4rem" }}>
        <input
          value={event.heroImageUrl}
          onChange={(e) => updateEvent("heroImageUrl", e.target.value)}
          placeholder="Hero image URL"
        />
      </div>

      <p className="muted" style={{ marginBottom: "0.75rem" }}>
        Paste an image URL above to customize the banner. A shared Google Photos link or any
        public image URL usually works.
      </p>

      <div className="row">
        <span className="pill">
          🕒 {timeline.itinerary.length} itinerary item
          {timeline.itinerary.length === 1 ? "" : "s"}
        </span>
        <span className="pill">
          ✈️ {timeline.travel.length} traveler
          {timeline.travel.length === 1 ? "" : "s"}
        </span>
        <span className="pill">
          🥃 {booze.length} booze item
          {booze.length === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

function TimelinePage() {
  const { state, setState } = useCamp();
  const { timeline } = state!;

  const updateItineraryItem = (idx: number, value: string) => {
    setState(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: prev.timeline.itinerary.map((item, i) =>
          i === idx ? value : item
        ),
      },
    }));
  };

  const addItineraryItem = () => {
    setState(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: [...prev.timeline.itinerary, "New itinerary item"],
      },
    }));
  };

  const removeItineraryItem = (idx: number) => {
    setState(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: prev.timeline.itinerary.filter((_, i) => i !== idx),
      },
    }));
  };

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
        ),
      },
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
          { id, name: "New Traveler", method: "flight", details: "" },
        ],
      },
    }));
  };

  const removeTravel = (id: string) => {
    setState(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        travel: prev.timeline.travel.filter(t => t.id !== id),
      },
    }));
  };

  return (
    <div className="card">
      <h2>Itinerary</h2>
      {timeline.itinerary.map((item, idx) => (
        <div key={idx} className="row" style={{ marginBottom: "0.4rem" }}>
          <input
            value={item}
            onChange={(e) => updateItineraryItem(idx, e.target.value)}
            placeholder={`Item ${idx + 1}`}
          />
          <button
            type="button"
            className="danger"
            onClick={() => removeItineraryItem(idx)}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="secondary"
        onClick={addItineraryItem}
        style={{ marginBottom: "1rem" }}
      >
        ➕ Add Itinerary Item
      </button>

      <h2>Travel Plan</h2>
      {timeline.travel.map(t => (
        <div key={t.id} className="row" style={{ marginBottom: "0.5rem" }}>
          <input
            value={t.name}
            onChange={(e) => updateTravel(t.id, "name", e.target.value)}
            placeholder="Name"
          />
          <select
            value={t.method}
            onChange={(e) =>
              updateTravel(t.id, "method", e.target.value as any)
            }
          >
            <option value="flight">Flight</option>
            <option value="drive">Drive</option>
            <option value="other">Other</option>
          </select>
          <input
            value={t.details}
            onChange={(e) => updateTravel(t.id, "details", e.target.value)}
            placeholder="Flight # / ETA / notes"
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
        ),
      },
    }));
  };

  const addMeal = () => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        meals: [
          ...prev.food.meals,
          { day: "New Day", breakfast: "", lunch: "", dinner: "" },
        ],
      },
    }));
  };

  const removeMeal = (idx: number) => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        meals: prev.food.meals.filter((_, i) => i !== idx),
      },
    }));
  };

  const addSnack = () => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: [...prev.food.snacks, { name: "New Snack" }],
      },
    }));
  };

  const updateSnack = (idx: number, value: string) => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: prev.food.snacks.map((s, i) =>
          i === idx ? { ...s, name: value } : s
        ),
      },
    }));
  };

  const removeSnack = (idx: number) => {
    setState(prev => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: prev.food.snacks.filter((_, i) => i !== idx),
      },
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
              onChange={(e) => updateMeal(i, "day", e.target.value)}
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
              onChange={(e) => updateMeal(i, "breakfast", e.target.value)}
              placeholder="Breakfast"
            />
            <input
              value={m.lunch}
              onChange={(e) => updateMeal(i, "lunch", e.target.value)}
              placeholder="Lunch"
            />
            <input
              value={m.dinner}
              onChange={(e) => updateMeal(i, "dinner", e.target.value)}
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
            onChange={(e) => updateSnack(i, e.target.value)}
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
      ),
    }));
  };

  const addItem = () => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState(prev => ({
      ...prev,
      booze: [
        ...prev.booze,
        { id, type: "Whiskey", label: "New Bottle", quantity: "1" },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setState(prev => ({
      ...prev,
      booze: prev.booze.filter(b => b.id !== id),
    }));
  };

  return (
    <div className="card">
      <h2>Booze Inventory</h2>
      {booze.map(b => (
        <div key={b.id} className="row" style={{ marginBottom: "0.5rem" }}>
          <input
            value={b.type}
            onChange={(e) => updateItem(b.id, "type", e.target.value)}
            placeholder="Type (Whiskey, Beer, etc.)"
          />
          <input
            value={b.label}
            onChange={(e) => updateItem(b.id, "label", e.target.value)}
            placeholder="Label / Brand"
          />
          <input
            value={b.quantity}
            onChange={(e) => updateItem(b.id, "quantity", e.target.value)}
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

  // Track which rule (if any) is currently being edited
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const updateRule = (id: string, value: string) => {
    setState(prev => ({
      ...prev,
      rules: prev.rules.map(r =>
        r.id === id ? { ...r, text: value } : r
      ),
    }));
  };

  const addRule = () => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState(prev => ({
      ...prev,
      rules: [...prev.rules, { id, text: "New rule" }],
    }));
    setEditingId(id); // auto-open new rule for editing
  };

  const removeRule = (id: string) => {
    setState(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== id),
    }));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  return (
    <div className="card">
      <h2>Notes & Rules</h2>
      {rules.map((r, idx) => {
        const isEditing = editingId === r.id;

        return (
          <div
            key={r.id}
            className="row"
            style={{ marginBottom: "0.5rem", alignItems: "center" }}
          >
            <span
              className="muted"
              style={{ width: 24, textAlign: "right", marginRight: 4 }}
            >
              {idx + 1}.
            </span>

            <input
              value={r.text}
              onChange={(e) => updateRule(r.id, e.target.value)}
              placeholder="Rule / note"
              readOnly={!isEditing}
              style={{
                flex: "0 1 260px", // shorter box
                opacity: isEditing ? 1 : 0.85,
                cursor: isEditing ? "text" : "default",
              }}
            />

            <button
              type="button"
              className="secondary"
              onClick={() =>
                setEditingId(isEditing ? null : r.id)
              }
            >
              {isEditing ? "Done" : "Edit"}
            </button>

            <button
              type="button"
              className="danger"
              onClick={() => removeRule(r.id)}
            >
              ✕
            </button>
          </div>
        );
      })}

      <button type="button" className="secondary" onClick={addRule}>
        ➕ Add Rule
      </button>
    </div>
  );
}

/* ===== Settings + Backup ===== */

function SettingsCard() {
  const { setState } = useCamp();

  const resetBooze = () => {
    if (!confirm("Reset booze inventory?")) return;
    setState((prev) => ({
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
            <button type="button" className="danger" onClick={resetBooze}>
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
            <label
              className="secondary"
              style={{ padding: "0.4rem 0.9rem", cursor: "pointer" }}
            >
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

/* ===== Theme & PWA hook ===== */

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

  // Apply theme
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
      themeMeta.content = theme === "dark" ? "#020617" : "#03D47C";
    }

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  // PWA install + SW update handling
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
      navigator.serviceWorker.addEventListener("message", (event) => {
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
          .catch((err) => console.error("SW registration failed", err));
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  return { theme, toggleTheme, canInstall, install };
}



