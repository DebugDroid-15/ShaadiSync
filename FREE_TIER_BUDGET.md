# ShaadiSync — Zero-Cost Architecture & Free-Tier Budget Management

## 1. Zero-Cost Principle (₹0 Operational Budget)
ShaadiSync is engineered under a strict ₹0 development and MVP operational expenditure mandate. The system requires zero paid external subscriptions, commercial API keys, or proprietary cloud services for all 10 core operational modules.

## 2. Infrastructure & Service Tier Breakdown

| Infrastructure Component | Selected Provider / Method | Free Tier Quota / Terms | ShaadiSync Consumption Strategy | Risk Mitigation & Upgrade Threshold |
| :--- | :--- | :--- | :--- | :--- |
| **Web Hosting & Edge** | Vercel / Netlify / Render Free Tier | 100 GB bandwidth, unlimited serverless invocations for non-commercial/hobby MVP | Static asset caching, lightweight React Server Components | Clean migration path to self-hosted Node.js / Docker on VPS if limits approached |
| **Database & Auth** | Supabase Free Tier | 500 MB PostgreSQL database, 50,000 monthly active users, 2 projects | Relational normalization, strict deletion/archival policy, optimized indexes | 500 MB comfortably stores >150,000 guest and check-in rows |
| **Guest Messaging** | Native WhatsApp Web URI (`wa.me`) & SMS links | Unlimited (User device / browser dispatches directly) | Client-side URI generator with pre-filled encoded text | Zero paid Twilio / WhatsApp Cloud API costs |
| **Mapping & Directions** | Open Google Maps / OSM URLs | Unlimited free web navigational links | Pre-composed coordinate links (`https://maps.google.com/?q=lat,lng`) | Zero paid Google Maps JavaScript / Directions API keys |
| **Storage (Passes & Docs)** | Supabase Storage Free Tier (1 GB) / Inline SVG | 1 GB bucket limit | Dynamic SVG QR pass generation in browser; no unnecessary file uploads | Keeps media lightweight and zero-cost |
| **Analytics & Reporting** | Recharts (Client-side) & CSV Generator | Unlimited (Zero cloud telemetry) | All reports calculated in memory from database queries; instant CSV downloads | No paid Mixpanel, Amplitude, or Google Analytics 360 |

## 3. Quota Monitoring & Operational Policies
1. **Never Bypass Limits:** If a free-tier quota is reached, the application will display a transparent notification rather than attempting unauthorized circumvention.
2. **Data Retention:** Completed weddings can be archived and exported as JSON/CSV packages by organisers to keep active database storage well under the 500 MB threshold.
3. **Transparent Reporting:** The system explicitly distinguishes between zero-cost features and future paid premium enterprise add-ons (such as automated SMS gateways).

