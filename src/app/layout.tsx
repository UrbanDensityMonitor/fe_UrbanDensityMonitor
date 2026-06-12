// src/app/layout.tsx
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Urban Density — ML Vision Dashboard",
  description:
    "Real-time urban density monitoring powered by CCTV ML inference",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={spaceGrotesk.variable}>
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  );
}
