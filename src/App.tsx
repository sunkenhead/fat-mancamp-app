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
  const { state } = useCamp();
  const { event, timeline } = state!;

  const travelerCount = timeline.travel.length;
  const dayCount = timeline.itinerary.length;
  const hasDates = !!event.dates;

  return (
    <div className="card front-page">
      {/* Hero image */}
      {event.heroImageUrl && (
        <div className="hero-wrapper">
          <img
            src={event.heroImageUrl}
            alt="Fat Man Camp 2026 near Deadwood, South Dakota"
            className="hero-image"
          />
        </div>
      )}

      {/* Title + meta */}
      <h1 className="front-title">{event.title || "Fat Man Camp 2026"}</h1>
      <p className="front-meta">
        {event.location || "Near Deadwood, South Dakota"}
        {hasDates && " · "}
        {event.dates || "Early October 2026 (exact dates TBD)"}
      </p>

      {/* Main copy – cleaned up version of your email */}
      <section className="front-section">
        <h3>Welcome</h3>
        <p>
          Hello everyone. This is the first look at{" "}
          <strong>Fat Man Camp 2026</strong>. We&apos;re still about a year
          out, but sharing the plan early gives everyone a chance to mark
          their calendars and start scheming.
        </p>
        <p>
          This camp will be held near <strong>Deadwood, South Dakota</strong>{" "}
          and will be piggy-backed on the tail end of{" "}
          <strong>Wild West Hackin&apos; Fest (WWHF)</strong> next October.
          WWHF usually runs during the week; Fat Man Camp will pick up on the{" "}
          following weekend.
        </p>
      </section>

      <section className="front-section">
        <h3>The Rough Plan</h3>
        <ul className="front-list">
          <li>
            <strong>When:</strong> Early October 2026 (exact dates TBD; usually
            the weekend after WWHF).
          </li>
          <li>
            <strong>Where:</strong> A rented spot near Deadwood, SD.
          </li>
          <li>
            <strong>How:</strong> Folks can use training budget / TDY funds for
            WWHF travel, then take PTO/leave en-route to roll right into Fat
            Man Camp.
          </li>
          <li>
            <strong>Cost:</strong> Final cost depends on headcount and the
            place we book; that usually locks in about six months out.
          </li>
        </ul>
      </section>

      <section className="front-section front-status">
        <h3>Status & RSVP</h3>
        <p>
          Exact <strong>dates, location, and total cost</strong> are still up
          in the air. Those details will firm up once we&apos;re about six
          months out and we know how many people are coming.
        </p>
        <p>
          If you already know you&apos;d like to attend,{" "}
          <strong>let us know or add yourself in the Travel tab</strong>.
          Early RSVPs help decide how big a place we need. You can always
          change your mind later if life happens.
        </p>
        <p>
          Got questions? Reach out any time — logistics, travel, booze,
          or whether tactical naps count as official activities (they do).
        </p>
      </section>

      {/* Tiny stats row for some &quot;dashboard&quot; feel */}
      <section className="front-section front-stats">
        <div className="stat-pill">
          <span className="stat-label">Potential days</span>
          <span className="stat-value">
            {dayCount > 0 ? dayCount : "TBD"}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-label">People in travel plan</span>
          <span className="stat-value">
            {travelerCount > 0 ? travelerCount : "0 so far"}
          </span>
        </div>
      </section>
    </div>
  );
}

function TimelinePage() {
  const { state, setState } = useCamp();
  const { timeline } = state!;

  const [editingDayId, setEditingDayId] = React.useState<string | null>(null);
  const [editingActivityId, setEditingActivityId] = React.useState<string | null>(null);
  const [editingTravelId, setEditingTravelId] = React.useState<string | null>(null);

  /* ===== Day helpers ===== */

  const updateDayLabel = (dayId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: prev.timeline.itinerary.map((d) =>
          d.id === dayId ? { ...d, label: value } : d
        ),
      },
    }));
  };

  const addDay = () => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: [...prev.timeline.itinerary, { id, label: "New Day", activities: [] }],
      },
    }));
    setEditingDayId(id);
  };

  const removeDay = (dayId: string) => {
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: prev.timeline.itinerary.filter((d) => d.id !== dayId),
      },
    }));
    if (editingDayId === dayId) setEditingDayId(null);
  };

  const moveDay = (from: number, to: number) => {
    if (to < 0 || to >= timeline.itinerary.length) return;
    setState((prev) => {
      const arr = [...prev.timeline.itinerary];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return {
        ...prev,
        timeline: {
          ...prev.timeline,
          itinerary: arr,
        },
      };
    });
  };

  /* ===== Activity helpers ===== */

  const addActivity = (dayId: string) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: prev.timeline.itinerary.map((d) =>
          d.id === dayId
            ? {
                ...d,
                activities: [...d.activities, { id, time: "", label: "New activity" }],
              }
            : d
        ),
      },
    }));
    setEditingActivityId(id);
  };

  const updateActivity = (
    dayId: string,
    activityId: string,
    field: "time" | "label",
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: prev.timeline.itinerary.map((d) =>
          d.id === dayId
            ? {
                ...d,
                activities: d.activities.map((a) =>
                  a.id === activityId ? { ...a, [field]: value } : a
                ),
              }
            : d
        ),
      },
    }));
  };

  const removeActivity = (dayId: string, activityId: string) => {
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: prev.timeline.itinerary.map((d) =>
          d.id === dayId
            ? {
                ...d,
                activities: d.activities.filter((a) => a.id !== activityId),
              }
            : d
        ),
      },
    }));
    if (editingActivityId === activityId) setEditingActivityId(null);
  };

  const moveActivity = (dayId: string, from: number, to: number) => {
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        itinerary: prev.timeline.itinerary.map((d) => {
          if (d.id !== dayId) return d;
          if (to < 0 || to >= d.activities.length) return d;
          const arr = [...d.activities];
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          return { ...d, activities: arr };
        }),
      },
    }));
  };

  /* ===== Travel helpers + grouping ===== */

  const { travel } = timeline;

  const updateTravel = (
    id: string,
    field: "name" | "method" | "details",
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        travel: prev.timeline.travel.map((t) =>
          t.id === id ? { ...t, [field]: value } : t
        ),
      },
    }));
  };

  const addTravel = (method: "flight" | "drive" | "other") => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        travel: [
          ...prev.timeline.travel,
          { id, name: "New Traveler", method, details: "" },
        ],
      },
    }));
    setEditingTravelId(id);
  };

  const removeTravel = (id: string) => {
    setState((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        travel: prev.timeline.travel.filter((t) => t.id !== id),
      },
    }));
    if (editingTravelId === id) setEditingTravelId(null);
  };

  const byName = (a: (typeof travel)[number], b: (typeof travel)[number]) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

  const flyers = travel.filter((t) => t.method === "flight").slice().sort(byName);
  const drivers = travel.filter((t) => t.method === "drive").slice().sort(byName);
  const others = travel.filter((t) => t.method === "other").slice().sort(byName);

  type TravelItem = (typeof travel)[number];

  const TravelCard: React.FC<{ item: TravelItem }> = ({ item }) => {
    const isEditing = editingTravelId === item.id;

    return (
      <div
        className="card"
        style={{ marginBottom: "0.6rem", padding: "0.6rem 0.75rem" }}
      >
        {/* Top row: name + buttons right */}
        <div className="row" style={{ alignItems: "center" }}>
          <input
            value={item.name}
            onChange={(e) => updateTravel(item.id, "name", e.target.value)}
            placeholder="Name"
            readOnly={!isEditing}
            style={{
              flex: "1 1 auto",
              maxWidth: 220,
              opacity: isEditing ? 1 : 0.85,
              cursor: isEditing ? "text" : "default",
            }}
          />

          <div style={{ display: "flex", gap: "0.25rem", marginLeft: "auto" }}>
            <button
              type="button"
              className="secondary"
              onClick={() =>
                setEditingTravelId(isEditing ? null : item.id)
              }
            >
              {isEditing ? "Done" : "Edit"}
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => removeTravel(item.id)}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Second row: method + details */}
        <div className="row" style={{ marginTop: "0.4rem" }}>
          <select
            value={item.method}
            onChange={(e) =>
              updateTravel(item.id, "method", e.target.value as any)
            }
            disabled={!isEditing}
            style={{ flex: "0 0 120px" }}
          >
            <option value="flight">Flight</option>
            <option value="drive">Drive</option>
            <option value="other">Other</option>
          </select>
          <input
            value={item.details}
            onChange={(e) =>
              updateTravel(item.id, "details", e.target.value)
            }
            placeholder="Flight # / ETA / notes"
            readOnly={!isEditing}
            style={{
              flex: "1 1 auto",
              opacity: isEditing ? 1 : 0.85,
              cursor: isEditing ? "text" : "default",
            }}
          />
        </div>
      </div>
    );
  };

  /* ===== Render ===== */

  return (
    <div className="card">
      <h2>Itinerary</h2>

      {timeline.itinerary.map((day, dayIndex) => {
        const isDayEditing = editingDayId === day.id;
        const atTop = dayIndex === 0;
        const atBottom = dayIndex === timeline.itinerary.length - 1;

        return (
          <div key={day.id} style={{ marginBottom: "1rem" }}>
            {/* Day header row */}
            <div
              className="row"
              style={{ marginBottom: "0.35rem", alignItems: "center" }}
            >
              <input
                value={day.label}
                onChange={(e) => updateDayLabel(day.id, e.target.value)}
                placeholder="Day label (e.g. Day 1 - 29 Oct 2025)"
                readOnly={!isDayEditing}
                style={{
                  flex: "1 1 auto",
                  maxWidth: 360,
                  opacity: isDayEditing ? 1 : 0.85,
                  cursor: isDayEditing ? "text" : "default",
                }}
              />

              {/* Right-aligned day actions */}
              <div style={{ display: "flex", gap: "0.25rem", marginLeft: "auto" }}>
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    setEditingDayId(isDayEditing ? null : day.id)
                  }
                >
                  {isDayEditing ? "Done" : "Edit"}
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={atTop}
                  onClick={() => moveDay(dayIndex, dayIndex - 1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={atBottom}
                  onClick={() => moveDay(dayIndex, dayIndex + 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => removeDay(day.id)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Activities under this day */}
            {day.activities.map((a, idx) => {
              const isEditing = editingActivityId === a.id;
              const actAtTop = idx === 0;
              const actAtBottom = idx === day.activities.length - 1;

              return (
                <div
                  key={a.id}
                  className="row"
                  style={{
                    marginBottom: "0.3rem",
                    marginLeft: "2rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    value={a.time}
                    onChange={(e) =>
                      updateActivity(day.id, a.id, "time", e.target.value)
                    }
                    placeholder="1200"
                    readOnly={!isEditing}
                    style={{
                      flex: "0 0 70px",
                      opacity: isEditing ? 1 : 0.85,
                      cursor: isEditing ? "text" : "default",
                    }}
                  />
                  <input
                    value={a.label}
                    onChange={(e) =>
                      updateActivity(day.id, a.id, "label", e.target.value)
                    }
                    placeholder="Arrival"
                    readOnly={!isEditing}
                    style={{
                      flex: "1 1 auto",
                      maxWidth: 260,
                      opacity: isEditing ? 1 : 0.85,
                      cursor: isEditing ? "text" : "default",
                    }}
                  />

                  {/* Right-aligned activity actions */}
                  <div style={{ display: "flex", gap: "0.25rem", marginLeft: "auto" }}>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() =>
                        setEditingActivityId(isEditing ? null : a.id)
                      }
                    >
                      {isEditing ? "Done" : "Edit"}
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      disabled={actAtTop}
                      onClick={() => moveActivity(day.id, idx, idx - 1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      disabled={actAtBottom}
                      onClick={() => moveActivity(day.id, idx, idx + 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => removeActivity(day.id, a.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}

            <div style={{ marginLeft: "2rem", marginTop: "0.2rem" }}>
              <button
                type="button"
                className="secondary"
                onClick={() => addActivity(day.id)}
              >
                ➕ Add Activity
              </button>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className="secondary"
        onClick={addDay}
        style={{ marginTop: "0.5rem" }}
      >
        ➕ Add Day
      </button>

      {/* ===== Travel sections ===== */}
      <h2 style={{ marginTop: "1.5rem" }}>Travel Plan</h2>

      {flyers.length > 0 && <h3>✈️ Flyers</h3>}
      {flyers.map((t) => (
        <TravelCard key={t.id} item={t} />
      ))}

      {drivers.length > 0 && <h3>🚗 Drivers</h3>}
      {drivers.map((t) => (
        <TravelCard key={t.id} item={t} />
      ))}

      {others.length > 0 && <h3>❓ Other</h3>}
      {others.map((t) => (
        <TravelCard key={t.id} item={t} />
      ))}

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button
          type="button"
          className="secondary"
          onClick={() => addTravel("flight")}
        >
          ➕ Add Flyer
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => addTravel("drive")}
        >
          ➕ Add Driver
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => addTravel("other")}
        >
          ➕ Add Other
        </button>
      </div>
    </div>
  );
}

function FoodPage() {
  const { state, setState } = useCamp();
  const food = state!.food;
  const meals = food.meals ?? [];
  const snacks = food.snacks ?? [];

  const [editingMealIndex, setEditingMealIndex] = React.useState<number | null>(
    null
  );
  const [editingSnackId, setEditingSnackId] = React.useState<string | null>(
    null
  );

  /* ===== Meal Helpers ===== */

  const updateMeal = (
    index: number,
    field: "day" | "breakfast" | "lunch" | "dinner",
    value: string
  ) => {
    setState((prev) => {
      const nextMeals = [...prev.food.meals];
      nextMeals[index] = { ...nextMeals[index], [field]: value };
      return {
        ...prev,
        food: {
          ...prev.food,
          meals: nextMeals,
        },
      };
    });
  };

  const addMeal = () => {
    setState((prev) => ({
      ...prev,
      food: {
        ...prev.food,
        meals: [
          ...prev.food.meals,
          { day: "New Day", breakfast: "", lunch: "", dinner: "" },
        ],
      },
    }));
    setEditingMealIndex(meals.length);
  };

  const removeMeal = (index: number) => {
    setState((prev) => ({
      ...prev,
      food: {
        ...prev.food,
        meals: prev.food.meals.filter((_, i) => i !== index),
      },
    }));
    if (editingMealIndex === index) {
      setEditingMealIndex(null);
    }
  };

  /* ===== Snack Helpers ===== */

  const ensureSnackId = (snack: any, index: number) => {
    if (snack.id) return snack.id as string;
    // generate a stable-ish fallback id based on index + name
    return `snack-${index}`;
  };

  const updateSnack = (id: string, value: string) => {
    setState((prev) => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: prev.food.snacks.map((s: any, idx: number) =>
          (s.id ?? `snack-${idx}`) === id ? { ...s, name: value } : s
        ),
      },
    }));
  };

  const addSnack = () => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState((prev) => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: [...prev.food.snacks, { id, name: "New Snack" }],
      },
    }));
    setEditingSnackId(id);
  };

  const removeSnack = (id: string) => {
    setState((prev) => ({
      ...prev,
      food: {
        ...prev.food,
        snacks: prev.food.snacks.filter((s: any, idx: number) => {
          const snackId = s.id ?? `snack-${idx}`;
          return snackId !== id;
        }),
      },
    }));
    if (editingSnackId === id) {
      setEditingSnackId(null);
    }
  };

  return (
    <div className="card">
      <h2>Food Plan</h2>

      {/* ==== MEALS SECTION ==== */}
      <h3>Meals</h3>

      {meals.map((m, index) => {
        const isEditing = editingMealIndex === index;

        return (
          <div
            key={index}
            className="card"
            style={{ padding: "0.75rem", marginBottom: "0.75rem" }}
          >
            {/* Day row */}
            <div className="row" style={{ alignItems: "center" }}>
              <input
                value={m.day}
                onChange={(e) => updateMeal(index, "day", e.target.value)}
                placeholder="Day (e.g. Day 1)"
                readOnly={!isEditing}
                style={{
                  flex: "1 1 auto",
                  maxWidth: 200,
                  opacity: isEditing ? 1 : 0.85,
                  cursor: isEditing ? "text" : "default",
                }}
              />

              {/* Right-aligned edit/delete */}
              <div
                style={{
                  display: "flex",
                  gap: "0.25rem",
                  marginLeft: "auto",
                }}
              >
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    setEditingMealIndex(isEditing ? null : index)
                  }
                >
                  {isEditing ? "Done" : "Edit"}
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => removeMeal(index)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Breakfast */}
            <div className="row" style={{ marginTop: "0.4rem" }}>
              <input
                value={m.breakfast}
                onChange={(e) =>
                  updateMeal(index, "breakfast", e.target.value)
                }
                placeholder="Breakfast"
                readOnly={!isEditing}
                style={{ flex: "1 1 auto" }}
              />
            </div>

            {/* Lunch */}
            <div className="row" style={{ marginTop: "0.4rem" }}>
              <input
                value={m.lunch}
                onChange={(e) =>
                  updateMeal(index, "lunch", e.target.value)
                }
                placeholder="Lunch"
                readOnly={!isEditing}
                style={{ flex: "1 1 auto" }}
              />
            </div>

            {/* Dinner */}
            <div className="row" style={{ marginTop: "0.4rem" }}>
              <input
                value={m.dinner}
                onChange={(e) =>
                  updateMeal(index, "dinner", e.target.value)
                }
                placeholder="Dinner"
                readOnly={!isEditing}
                style={{ flex: "1 1 auto" }}
              />
            </div>
          </div>
        );
      })}

      <button type="button" className="secondary" onClick={addMeal}>
        ➕ Add Meal
      </button>

      {/* ==== SNACKS SECTION ==== */}
      <h3 style={{ marginTop: "1.5rem" }}>Snacks</h3>

      {snacks.map((s: any, idx: number) => {
        const id = ensureSnackId(s, idx);
        const isEditing = editingSnackId === id;

        return (
          <div
            key={id}
            className="row"
            style={{ marginBottom: "0.5rem", alignItems: "center" }}
          >
            <input
              value={s.name}
              onChange={(e) => updateSnack(id, e.target.value)}
              placeholder="Snack"
              readOnly={!isEditing}
              style={{
                flex: "1 1 auto",
                maxWidth: 260,
                opacity: isEditing ? 1 : 0.85,
                cursor: isEditing ? "text" : "default",
              }}
            />

            {/* Right-aligned buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                marginLeft: "auto",
              }}
            >
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setEditingSnackId(isEditing ? null : id)
                }
              >
                {isEditing ? "Done" : "Edit"}
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => removeSnack(id)}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}

      <button type="button" className="secondary" onClick={addSnack}>
        ➕ Add Snack
      </button>
    </div>
  );
}

function BoozePage() {
  const { state, setState } = useCamp();
  const booze = state!.booze ?? [];
  const travelers = state!.timeline.travel ?? [];

  const [editingBoozeId, setEditingBoozeId] = React.useState<string | null>(
    null
  );
  const [editingPrefId, setEditingPrefId] = React.useState<string | null>(null);

  type PreferenceValue = "beer" | "liquor" | "non-alcoholic";

  // Safely read preferences even if they didn't exist in older saved state
  const boozePrefs:
    | { travelerId: string; preference: PreferenceValue }[]
    | [] =
    ((state as any).boozePreferences as {
      travelerId: string;
      preference: PreferenceValue;
    }[]) ?? [];

  /* ===== Inventory helpers ===== */

  const updateItem = (
    id: string,
    field: "type" | "label" | "quantity" | "who",
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      booze: prev.booze.map((b: any) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    }));
  };

  const addItem = () => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setState((prev) => ({
      ...prev,
      booze: [
        ...prev.booze,
        {
          id,
          type: "Whiskey",
          label: "New Bottle",
          quantity: "1",
          who: "",
        },
      ],
    }));
    setEditingBoozeId(id);
  };

  const removeItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      booze: prev.booze.filter((b: any) => b.id !== id),
    }));
    if (editingBoozeId === id) setEditingBoozeId(null);
  };

  /* ===== Preferences helpers ===== */

  const updatePreference = (travelerId: string, preference: PreferenceValue) => {
    setState((prev) => {
      const currentPrefs:
        | { travelerId: string; preference: PreferenceValue }[]
        | [] = ((prev as any).boozePreferences as any[]) ?? [];
      const idx = currentPrefs.findIndex((p) => p.travelerId === travelerId);
      const updated = { travelerId, preference };
      const newPrefs =
        idx === -1
          ? [...currentPrefs, updated]
          : currentPrefs.map((p, i) => (i === idx ? updated : p));

      return {
        ...prev,
        boozePreferences: newPrefs,
      } as any;
    });
  };

  const getPreferenceFor = (
    travelerId: string
  ): PreferenceValue | "" => {
    const pref = boozePrefs.find((p) => p.travelerId === travelerId);
    return pref?.preference ?? "";
  };

  return (
    <div className="card">
      {/* ===== Inventory section ===== */}
      <h2>Booze Inventory</h2>

      {/* Column headers */}
      <div
        className="row"
        style={{
          fontWeight: 600,
          marginBottom: "0.4rem",
          opacity: 0.85,
        }}
      >
        <span style={{ flex: "0 1 140px" }}>Type</span>
        <span style={{ flex: "0 1 180px" }}>Brand / Flavor</span>
        <span style={{ flex: "0 1 80px" }}>Amount</span>
        <span style={{ flex: "0 1 160px" }}>Who</span>
      </div>

      {booze.map((b: any) => {
        const isEditing = editingBoozeId === b.id;

        return (
          <div
            key={b.id}
            className="row"
            style={{ marginBottom: "0.5rem", alignItems: "center" }}
          >
            {/* Type */}
            <input
              value={b.type}
              onChange={(e) =>
                updateItem(b.id, "type", e.target.value)
              }
              placeholder="Type"
              readOnly={!isEditing}
              style={{
                flex: "0 1 140px",
                opacity: isEditing ? 1 : 0.85,
                cursor: isEditing ? "text" : "default",
              }}
            />

            {/* Brand / Flavor */}
            <input
              value={b.label}
              onChange={(e) =>
                updateItem(b.id, "label", e.target.value)
              }
              placeholder="Brand / Flavor"
              readOnly={!isEditing}
              style={{
                flex: "0 1 180px",
                opacity: isEditing ? 1 : 0.85,
                cursor: isEditing ? "text" : "default",
              }}
            />

            {/* Amount */}
            <input
              value={b.quantity}
              onChange={(e) =>
                updateItem(b.id, "quantity", e.target.value)
              }
              placeholder="Qty"
              readOnly={!isEditing}
              style={{
                flex: "0 1 80px",
                opacity: isEditing ? 1 : 0.85,
                cursor: isEditing ? "text" : "default",
              }}
            />

            {/* Who */}
            <select
              value={b.who || ""}
              onChange={(e) =>
                updateItem(b.id, "who", e.target.value)
              }
              disabled={!isEditing}
              style={{
                flex: "0 1 160px",
              }}
            >
              <option value="">Unknown / TBD</option>
              {travelers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Right-aligned actions */}
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                marginLeft: "auto",
              }}
            >
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setEditingBoozeId(isEditing ? null : b.id)
                }
              >
                {isEditing ? "Done" : "Edit"}
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => removeItem(b.id)}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}

      <button type="button" className="secondary" onClick={addItem}>
        ➕ Add Item
      </button>

      {/* ===== Preferences section ===== */}
      <h2 style={{ marginTop: "1.5rem" }}>Preferences</h2>
      <p className="muted" style={{ marginBottom: "0.5rem" }}>
        Set each traveler&apos;s go-to option so booze runs stay efficient.
      </p>

      {travelers.length === 0 && (
        <p className="muted">
          No travelers yet. Add people in the Travel Plan section first.
        </p>
      )}

      {travelers.map((t) => {
        const isEditing = editingPrefId === t.id;
        const value = getPreferenceFor(t.id);

        return (
          <div
            key={t.id}
            className="row"
            style={{ marginBottom: "0.4rem", alignItems: "center" }}
          >
            {/* Name (not editable here) */}
            <span
              style={{
                minWidth: 160,
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              {t.name || "Unnamed traveler"}
            </span>

            {/* Preference dropdown */}
            <select
              value={value}
              onChange={(e) =>
                updatePreference(
                  t.id,
                  e.target.value as PreferenceValue
                )
              }
              disabled={!isEditing}
              style={{ flex: "0 0 180px" }}
            >
              <option value="">Select preference</option>
              <option value="beer">Beer</option>
              <option value="liquor">Liquor</option>
              <option value="non-alcoholic">Non-alcoholic</option>
            </select>

            {/* Right-aligned Edit button */}
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                marginLeft: "auto",
              }}
            >
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setEditingPrefId(isEditing ? null : t.id)
                }
              >
                {isEditing ? "Done" : "Edit"}
              </button>
            </div>
          </div>
        );
      })}
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
