import * as React from "react";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Badge variant="secondary" className="mb-4">Legal Agreement</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Proposed Effective Date: November 2026 • Proprietary Software of Team SHATRUJEET.
        </p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">1. Proprietary Rights</h2>
            <p>
              ShaadiSync is proprietary software developed by Team SHATRUJEET. Access to this software or public preview deployments does not grant any license to reproduce, copy, or distribute source code without written permission.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">2. Permitted Use</h2>
            <p>
              Organisers, coordinators, and wedding couples are granted access to plan and manage authentic event operations under the applicable tier. Misuse, reverse engineering, or unauthorized automated crawling is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">3. Operational Accuracy</h2>
            <p>
              While ShaadiSync computes automated catering headcount estimates and budget variances, event hosts must verify final contracts directly with their banquet providers and vendors.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
