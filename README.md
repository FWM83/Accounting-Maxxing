# Accounting-Maxxing

Accounting Maxxing is a SaaS ERP and accounting platform purpose-built for small and medium **cannabis dispensaries** in **Colorado** and **Illinois**. It plugs into the inventory and POS tools dispensaries already use (Flowhub, Dutchie, Treez, Cova, BioTrack, METRC) and gives operators and their CPAs one shared place to handle 280E classification, monthly excise tax filings, license tracking, and audit-ready bookkeeping.

## Why cannabis, why CO and IL

Cannabis operators face problems that off-the-shelf accounting tools ignore:

- **IRC 280E** disallows ordinary selling and G&A expense deductions; only direct COGS is deductible. Misclassifying expenses can cost six figures.
- **State-mandated METRC track-and-trace** (CO MED, IL IDFPR) must reconcile to POS sales and inventory on the books.
- **Excise + sales tax** is multi-layered:
  - Colorado: 15% retail marijuana excise tax (DR 0500), 2.9% state sales tax + Denver/local + RTD.
  - Illinois: cannabis purchaser excise tax 10-25% by THC potency, plus 6.25% state sales tax + local.
- **Cash-heavy operations** with limited banking access (SAFE Banking pending). Daily cash drops, vault drops, and BSA-aligned cash logs need first-class support.
- **License tracking** for retail, cultivation, manufacturing, and transporter licenses with renewal calendars.

## Stack

- Next.js, React, TypeScript
- PostgreSQL-ready schema in `db/schema.sql`
- Local typed sample data in `src/domain/sample-data.ts` (a Denver + Chicago dispensary operator)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the prototype.

Routes:

- `/` - Operator dashboard with KPIs, compliance + METRC snapshot, license tracker
- `/inventory` - METRC sync status, POS integrations (Flowhub, Dutchie, Treez, Cova, BioTrack, CSV)
- `/compliance` - 280E classification helper, monthly excise tax filings, license renewals
- `/portal` - Shared client/auditor portal for document requests and conversations

## Implemented Vertical Slice

- Multi-tenant SaaS model (tenant -> company -> users) with role-based permissions
- Cannabis-aware chart of accounts: Cannabis Inventory (1300), Excise Tax Payable - CO (2100), Excise Tax Payable - IL (2110), Sales Tax Payable (2200), Cannabis Sales Revenue (4000), COGS - Cannabis 280E-deductible (5000), Security & Vault Services 280E-disallowed (6300), Compliance & Licensing (6400)
- Double-entry journal entries with period open/close/lock states
- Bank reconciliation with confidence scoring and auditor evidence drill-down
- AR/AP for wholesale customers and vendors (e.g. Cannabis Co-op of Colorado, Northside Wellness IL)
- License entities for CO retail, CO cultivation, IL retail, with status and renewal tracking
- Integration catalog (Flowhub, Dutchie, Treez, Cova, BioTrack, METRC CO, METRC IL, CSV) with sync status and last-sync timestamps
- Inventory snapshot by category (Flower, Pre-rolls, Concentrates, Edibles, Vapes, Topicals) tied to METRC packages
- Compliance work queue covering 280E review, METRC variance, cash drop reconciliation, license renewal, and tax filings
- Tax filing calendar for CO and IL excise + sales tax with estimated amounts and rates
- Client/auditor portal for document requests, attachments, and conversations

## Next Product Steps

1. Live METRC API integration and POS adapter SDKs (Flowhub, Dutchie, Treez, Cova, BioTrack).
2. Automated daily journal posting from POS sales (debit Cash, credit Sales + Excise + Sales Tax Payable).
3. 280E classifier: rules + ML over expense memos to suggest COGS vs disallowed buckets.
4. Cash management module: vault drop logging, courier reconciliation, BSA-aligned cash logs.
5. Real database persistence (PostgreSQL + Prisma/Drizzle) and tenant isolation.
6. Pilot with 3-5 dispensary operators across Denver and Chicago metros.
