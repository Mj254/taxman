# Kenya Tax Calculator (KRA)

A Next.js 16 web app that calculates Kenyan income tax for **individuals (PAYE)**, **businesses**, **VAT**, and **Installment Tax**, with a built-in KRA rates reference panel.

All rates follow the **Income Tax Act Cap 470**, **Finance Act 2023**, **NSSF Act 2022**, **SHIF Regulations 2024**, and the **Affordable Housing Act 2024**.

---

## What's inside

```
src/
  app/
    page.tsx              # Main page with 5 tabs
    layout.tsx            # Root layout + metadata
    globals.css           # Tailwind theme
  components/
    tax/
      personal-tax-calculator.tsx       # PAYE calculator
      business-tax-calculator.tsx       # Corporate / Turnover / Sole prop
      installment-tax-calculator.tsx    # Quarterly installment tax
      vat-calculator.tsx                # VAT add/remove at 16%
      tax-rates-info.tsx                # KRA reference panel
    ui/                                  # shadcn/ui primitives
  lib/
    tax-calculations.ts   # All KRA rates + calculation engine
    utils.ts
```

The entire calculation engine lives in **`src/lib/tax-calculations.ts`** — every rate, band, and threshold is a named constant you can audit at a glance.

---

## Prerequisites (install on your PC first)

1. **Node.js 18.18+** (or 20+) — download from https://nodejs.org/
2. **A package manager** — pick one:
   - `npm` (comes with Node.js), or
   - `bun` (faster, recommended) — https://bun.sh/
   - `pnpm` — https://pnpm.io/

Verify:
```bash
node --version
npm --version
```

---

## Setup

### 1. Unzip the project
```bash
unzip kenya-tax-calculator.zip -d kenya-tax-calculator
cd kenya-tax-calculator
```

### 2. Install dependencies
```bash
# with npm
npm install

# OR with bun (faster)
bun install

# OR with pnpm
pnpm install
```

### 3. Run the dev server
```bash
npm run dev
# or: bun dev
```

Open **http://localhost:3000** in your browser. You should see the Kenya Tax Calculator with 5 tabs:
- **Personal Income** (PAYE)
- **Business Income** (Corporate / Turnover / Sole proprietor)
- **Installment Tax** (quarterly KRA installments)
- **VAT** (16% add/remove)
- **Tax Reference** (all KRA rates in one panel)

---

## Build for production (optional)

```bash
npm run build
npm run start
```

---

## Where to verify the calculations

Every number used in this app comes from `src/lib/tax-calculations.ts`. Open that file and you'll find:

| Constant | Value | Source |
|---|---|---|
| `PAYE_BANDS_MONTHLY` | 10% / 25% / 30% / 32.5% / 35% | Finance Act 2023 |
| `PERSONAL_RELIEF_MONTHLY` | KSh 2,400 | Income Tax Act |
| `NSSF_RATE` | 6% (Tier I + II) | NSSF Act 2022 |
| `SHIF_RATE` / `SHIF_MINIMUM` | 2.75% / min KSh 300 | SHIF Reg 2024 |
| `HOUSING_LEVY_RATE` | 1.5% | Affordable Housing Act 2024 |
| `CORPORATE_TAX_RATE_RESIDENT` | 30% | Income Tax Act |
| `CORPORATE_TAX_RATE_NON_RESIDENT` | 37.5% | Income Tax Act |
| `TURNOVER_TAX_RATE` / `THRESHOLD` | 1.5% / KSh 1M–25M eligibility range | Income Tax Act / KRA guidance |
| `VAT_STANDARD_RATE` | 16% | VAT Act 2013 |
| `INSTALLMENT_TAX_THRESHOLD` | KSh 40,000 | Income Tax Act |
| `INSTALLMENT_TAX_SAFE_HARBOR_RATE` | 110% | KRA Installment Tax rules |

Cross-check against:
- KRA: https://www.kra.go.ke/
- Kenya Law: https://kenyalaw.org/
- KRA Tax Rates: https://www.kra.go.ke/individual/filing-paying/types-of-taxes

Run the tax-engine regression tests with `npm test`.

---

## Customizing

- **Change a tax rate** → edit the constant in `src/lib/tax-calculations.ts`, then the UI updates automatically.
- **Change a UI tab** → edit `src/app/page.tsx`.
- **Re-theme colors** → edit `src/app/globals.css` and `tailwind.config.ts`.

---

## Notes

- `node_modules/` and `.next/` build artifacts are NOT included in the zip — they're regenerated when you run `npm install`.
- No database is required for the tax calculators (Prisma is in package.json for unrelated scaffolding; the tax app is stateless).
- All calculations run client-side — no data leaves your browser.

---

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Install fails on Windows?**
Use `bun install` instead of `npm install` — it handles native deps better.

**TypeScript errors after install?**
```bash
npm run lint
```
to see what's wrong, or just `npm run dev` — Next.js will hot-reload and surface errors in the browser.

---

Built for Kenyan taxpayers. Verify every figure against KRA publications before filing.
