# Kenya Tax Calculator

A web-based calculator for estimating selected Kenyan taxes. The project is built with Next.js, React, and TypeScript.

## Features

- Personal income tax (PAYE) estimates
- Business tax estimates, including turnover tax and sole-proprietor income tax
- Residential rental income tax estimates
- Installment tax estimates
- VAT calculations
- A reference panel for tax rates and deductions

## Requirements

- Node.js 20.9 or later
- npm

## Run locally

```powershell
npm install
npx next dev -p 3000
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

Run the tax calculation tests with:

```powershell
npm test
```

## Project structure

- `src/lib/tax-calculations.ts` — tax calculation logic and rate constants
- `src/components/tax/` — tax calculators and tax reference UI
- `tests/tax-calculations.test.mjs` — calculation regression tests

## Tax information

Tax rates and rules can change and may depend on a person's circumstances. This calculator provides estimates, not tax or legal advice, and does not file returns. Verify the applicable rules with official sources before relying on an estimate:

- [Kenya Revenue Authority](https://www.kra.go.ke/)
- [Kenya Law](https://kenyalaw.org/)

For more project notes, see [README-tax-app.md](README-tax-app.md).
