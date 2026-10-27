import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShaadiSync — Complete Indian Wedding Management SaaS",
  description: "The all-in-one operations platform for Indian weddings. Seamlessly manage multi-day functions, guest RSVPs, catering headcounts, vendors, budgets, and event-day QR check-ins.",
  keywords: [
    "Indian wedding management",
    "wedding SaaS",
    "ShaadiSync",
    "RSVP tracking",
    "wedding catering headcount",
    "wedding planner software",
    "baraat check-in",
    "Sangeet guest list"
  ],
  authors: [{ name: "Team SHATRUJEET" }],
  openGraph: {
    title: "ShaadiSync — Indian Wedding Management & Event Operations Platform",
    description: "One connected system for wedding guests, multiple functions, RSVP tracking, catering, vendors, budgets, and event-day check-in.",
    url: "https://shaadisync-rho.vercel.app",
    siteName: "ShaadiSync",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "ShaadiSync — Indian Wedding Management",
      },
    ],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#172B4D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.info('ServiceWorker registration skipped:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-ivory-100 text-navy-900 font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
        {children}
      </body>
    </html>
  );
}
