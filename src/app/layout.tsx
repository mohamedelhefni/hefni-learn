import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hefni·learn",
  description: "Interactive Kubernetes learning — YAML, kubectl, and beyond.",
};

// Runs before paint — reads localStorage/system pref and applies class to <html>
const themeInitScript = `(function(){try{var s=localStorage.getItem('kubepath-theme');var m=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.classList.add(s||m);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <AnalyticsProvider />
        <ThemeProvider>
          <div className="max-w-5xl mx-auto w-full min-h-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
