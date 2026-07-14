// src/presentation/components/MapBackground.tsx
"use client";

export function MapBackground({ frameBase64 }: { frameBase64?: string | null }) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-app-bg" />

      {/* Live Video Feed (if available) */}
      {frameBase64 && (
        <img 
          src={frameBase64.startsWith('data:image') ? frameBase64 : `data:image/jpeg;base64,${frameBase64}`} 
          alt="Live Stream Feed" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Radial vignette from corners to blend video with the UI */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #1A171A 100%)",
        }}
      />
    </div>
  );
}
