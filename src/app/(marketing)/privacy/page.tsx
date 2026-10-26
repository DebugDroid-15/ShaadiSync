import * as React from "react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Badge variant="secondary" className="mb-4">Compliance Notice</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
          Privacy Policy & Data Protection
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Last updated: November 2026 • Designed in alignment with the Digital Personal Data Protection Act (DPDPA), 2023 of India.
        </p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">1. Purpose-Specific Guest Data Collection</h2>
            <p>
              ShaadiSync collects guest data (such as names, phone numbers, dietary preferences, and accommodation requirements) strictly for the operational management of the designated wedding event. Data is accessible solely to authorized event planners and the host families.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">2. No Unsolicited Commercial Messaging</h2>
            <p>
              We do not sell, rent, or monetize guest phone numbers or email addresses. No third-party advertisements or marketing blasts are transmitted through the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">3. Tokenized RSVP Portals</h2>
            <p>
              Guest RSVP links utilize randomized high-entropy tokens. Public invitation pages reveal only information relevant to that specific guest and household.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">4. Right to Erasure & Deletion</h2>
            <p>
              Wedding hosts and guests retain the right to request deletion or export of their contact and RSVP details from the system at the conclusion of the event lifecycle.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
