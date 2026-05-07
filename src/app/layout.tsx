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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hefni-learn.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'hefni·learn',
    template: '%s | hefni·learn',
  },
  description:
    'Interactive Kubernetes learning — hands-on kubectl practice, YAML debugging, quizzes, and scenario challenges. 38 chapters covering pods, deployments, services, RBAC, Helm, and beyond.',
  keywords: [
    'kubernetes',
    'kubectl',
    'k8s',
    'kubernetes tutorial',
    'kubernetes learning',
    'devops',
    'containers',
    'pods',
    'helm',
    'RBAC',
    'kubernetes for beginners',
  ],
  authors: [{ name: 'hefni' }],
  creator: 'hefni',
  openGraph: {
    type: 'website',
    siteName: 'hefni·learn',
    title: 'hefni·learn — Interactive Kubernetes Learning',
    description:
      'Hands-on kubectl practice, YAML debugging, quizzes, and scenario challenges. 38 chapters covering pods to Helm.',
    locale: 'en_US',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hefni·learn — Interactive Kubernetes Learning',
    description:
      'Hands-on kubectl practice, YAML debugging, quizzes, and scenario challenges. 38 chapters covering pods to Helm.',
    creator: '@hefni101',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
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
