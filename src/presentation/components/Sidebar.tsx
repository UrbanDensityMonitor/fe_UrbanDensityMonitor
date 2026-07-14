// src/presentation/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  BellRing,
  History,
  BarChart3,
  Users,
  Radar,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { authService } from "@/infrastructure/services/authService";
import { useRouter } from "next/navigation";

interface NavItem {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: "dashboard", href: "/", icon: Home, label: "Dashboard" },
  { id: "streams", href: "/streams", icon: Video, label: "Streams" },
  { id: "alerts", href: "/alerts", icon: BellRing, label: "Alerts" },
  { id: "history", href: "/history", icon: History, label: "History" },
  { id: "analytics", href: "/analytics", icon: BarChart3, label: "Analytics" },
  { id: "admin-users", href: "/admin/users", icon: Users, label: "Users", adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, user } = useAuth();
  const router = useRouter();

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || role === "admin"
  );

  const handleLogout = async () => {
    await authService.signOut();
    router.push("/auth");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-surface-1 border-r border-border-default flex flex-col">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-border-subtle">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center shadow-inner-glow transition-all duration-300 group-hover:shadow-card-glow">
            <Radar size={20} className="text-accent-primary" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-text-primary leading-none tracking-tight">
              Urban Density
            </h1>
            <p className="text-[11px] text-text-muted mt-0.5 font-medium tracking-wide uppercase">
              ML Vision
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          Main Menu
        </p>
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 text-sm font-medium
                ${
                  isActive
                    ? "bg-accent-muted text-accent-primary nav-active-bar"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
                }
              `}
              title={item.label}
            >
              <item.icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? "text-accent-primary" : "text-text-muted group-hover:text-text-secondary"
                }`}
              />
              <span className="flex-1">{item.label}</span>

              {/* Active arrow indicator */}
              {isActive && (
                <ChevronRight size={14} className="text-accent-primary/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section — User + Logout */}
      <div className="px-3 py-4 border-t border-border-subtle space-y-2">
        {/* System Status */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs text-status-success font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse-dot" />
            System Online
          </span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-2">
          <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center">
            <span className="text-xs font-bold text-accent-primary">
              {user?.email?.charAt(0).toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">
              {user?.email?.split("@")[0] ?? "User"}
            </p>
            <p className="text-[10px] text-text-muted capitalize">{role ?? "user"}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          aria-label="Sign Out"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-status-danger hover:bg-red-500/[0.08] transition-all duration-200"
        >
          <LogOut size={17} strokeWidth={1.8} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
