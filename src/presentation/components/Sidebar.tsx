// src/presentation/components/Sidebar.tsx
"use client";

import { Home, Map, BarChart3, Settings, Radar } from "lucide-react";

interface NavItem {
  id: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "map", icon: Map, label: "Map" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-2.5">
      {/* Logo mark */}
      <div className="w-9 h-9 rounded-xl bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center mb-1">
        <Radar size={16} className="text-accent-primary" strokeWidth={2} />
      </div>

      <div className="w-full h-px bg-white/10 my-1" />

      {/* Nav items */}
      {navItems.map((item) => {
        const isActive = activeNav === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`
              group relative w-10 h-10 rounded-xl flex items-center justify-center
              transition-all duration-200
              ${
                isActive
                  ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/30"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }
            `}
            title={item.label}
            aria-label={item.label}
          >
            <item.icon size={17} strokeWidth={isActive ? 2.5 : 2} />

            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-panel-bg border border-white/10 text-xs font-medium text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
              {item.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full bg-accent-primary" />
            )}
          </button>
        );
      })}
    </aside>
  );
}
