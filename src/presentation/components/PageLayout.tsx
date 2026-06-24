// src/presentation/components/PageLayout.tsx
"use client";

import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Optional right column (e.g. filters panel) */
  aside?: React.ReactNode;
}

export function PageLayout({ children, aside }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-app-bg flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 ml-20 min-h-screen flex flex-col">
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Optional aside */}
      {aside && (
        <aside className="w-80 border-l border-white/10 p-4 bg-panel-bg/30 backdrop-blur-sm overflow-y-auto">
          {aside}
        </aside>
      )}
    </div>
  );
}
