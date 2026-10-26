import * as React from "react";
import { Navbar } from "@/components/layout/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
