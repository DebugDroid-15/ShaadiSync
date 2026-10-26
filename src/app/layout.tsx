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
    url: "https://shaadisync.com",
    siteName: "ShaadiSync",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory-100 text-navy-900 font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
        {children}
      </body>
    </html>
  );
}
