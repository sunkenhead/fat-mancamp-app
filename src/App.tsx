// pseudo-structure; adapt to your current App
import React, { useState } from "react";
import { CampProvider } from "./CampContext";

export function App() {
  const [activeSection, setActiveSection] = useState<"front" | "timeline" | "food" | "booze" | "rules">("front");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <CampProvider>
      <div className="layout">
        <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setSidebarCollapsed(c => !c)}
          >
            {sidebarCollapsed ? "➡️" : "⬅️"}
          </button>

          <div className="sidebar-logo">
            <img src="/icon-192.png" alt="Fat Man Camp" />
            {!sidebarCollapsed && <span>Fat-Man Camp</span>}
          </div>

          <nav className="sidebar-nav">
            <SidebarItem
              icon="🏕️"
              label="Front Page"
              active={activeSection === "front"}
              collapsed={sidebarCollapsed}
              onClick={() => setActiveSection("front")}
            />
            <SidebarItem
              icon="🕒"
              label="Timeline"
              active={activeSection === "timeline"}
              collapsed={sidebarCollapsed}
              onClick={() => setActiveSection("timeline")}
            />
            <SidebarItem
              icon="🍳"
              label="Food Plan"
              active={activeSection === "food"}
              collapsed={sidebarCollapsed}
              onClick={() => setActiveSection("food")}
            />
            <SidebarItem
              icon="🥃"
              label="Booze"
              active={activeSection === "booze"}
              collapsed={sidebarCollapsed}
              onClick={() => setActiveSection("booze")}
            />
            <SidebarItem
              icon="📜"
              label="Notes / Rules"
              active={activeSection === "rules"}
              collapsed={sidebarCollapsed}
              onClick={() => setActiveSection("rules")}
            />
          </nav>
        </aside>

        <div className="main-area">
          {/* your existing top bar (title, save, theme, install) can live here */}
          <div className="app">
            {/* instead of using tab buttons, just conditionally show sections: */}
            {activeSection === "front" && <FrontSection />}
            {activeSection === "timeline" && <TimelineSection />}
            {activeSection === "food" && <FoodSection />}
            {activeSection === "booze" && <BoozeSection />}
            {activeSection === "rules" && <RulesSection />}
            {/* backup/restore card can stay at the bottom */}
          </div>
        </div>
      </div>
    </CampProvider>
  );
}

type SidebarItemProps = {
  icon: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
};

function SidebarItem({ icon, label, active, collapsed, onClick }: SidebarItemProps) {
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
