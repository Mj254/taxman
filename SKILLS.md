# Project Skills & Conventions

## Overview
Kenya Tax Calculator - Next.js 16 Web Application for computing Kenyan personal PAYE, business taxes (Corporate, Turnover, Sole Proprietorship), quarterly installment tax, and VAT based on KRA regulations.

## Core Stack & Engine
- Framework: Next.js 16 (React, TypeScript, Tailwind CSS)
- Tax Engine Location: `src/lib/tax-calculations.ts`
- Primary Components:
  - `src/components/tax/personal-tax-calculator.tsx`
  - `src/components/tax/business-tax-calculator.tsx`
  - `src/components/tax/installment-tax-calculator.tsx`
  - `src/components/tax/vat-calculator.tsx`
  - `src/components/tax/tax-rates-info.tsx`

## KRA Tax Regulations & Verification Targets
- **PAYE Monthly Bands** (Finance Act 2023):
  - Up to 24,000: 10%
  - Next 8,333 (24,001 - 32,333): 25%
  - Next 467,667 (32,334 - 500,000): 30%
  - Next 300,000 (500,001 - 800,000): 32.5%
  - Above 800,000: 35%
- **Reliefs**:
  - Personal Relief: KSh 2,400 / month (KSh 28,800 / year)
  - Insurance Relief: 15% of premium (capped at KSh 5,000 / month)
  - SHIF Relief: 15% of SHIF contribution (Finance Act 2023 / SHIF Regs 2024 / Tax Amendment Act)
  - Housing Levy Relief: 15% of Housing Levy contribution (Affordable Housing Act 2024 section 52 / Tax Laws Amendment)
- **Deductions**:
  - NSSF Tier I: 6% of lower limit (KSh 7,000 -> max 420) or 2024 limit (KSh 8,000 -> max 480)
  - NSSF Tier II: 6% of upper limit band
  - SHIF: 2.75% of Gross Income (Minimum KSh 300)
  - Housing Levy: 1.5% of Gross Income
- **Business Taxes**:
  - Resident Corporate Tax: 30%
  - Non-Resident Corporate Tax: 37.5%
  - Turnover Tax (TOT): 3% on gross turnover (Gross turnover threshold KSh 1M to KSh 25M under FA2023)
- **VAT**: 16% standard rate
