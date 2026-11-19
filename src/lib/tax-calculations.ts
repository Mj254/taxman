/**
 * Kenya Revenue Authority (KRA) Tax Calculation Engine
 *
 * Rates sourced from KRA official publications:
 * - PAYE Tax Bands (Finance Act 2023, effective July 2023)
 * - NSSF Act 2022 (effective February 2023, reviewed annually)
 * - SHIF Regulations 2024 (effective October 2024, replacing NHIF)
 * - Affordable Housing Act 2024 (Affordable Housing Levy 1.5%)
 * - Income Tax Act Cap 470 (Corporate tax rates)
 * - Turnover Tax (1.5% of gross sales)
 * - VAT Act 2013 (Standard rate 16%)
 *
 * All figures in Kenyan Shillings (KSh).
 */

// ============================================================================
// PERSONAL INCOME TAX (PAYE) — Monthly bands, Finance Act 2023
// ============================================================================
export interface PayeeBand {
  from: number;
  to: number | null; // null = no upper limit
  rate: number; // decimal, e.g. 0.10
}

export const PAYE_BANDS_MONTHLY: PayeeBand[] = [
  { from: 0, to: 24_000, rate: 0.10 },
  { from: 24_000, to: 32_333, rate: 0.25 },
  { from: 32_333, to: 500_000, rate: 0.30 },
  { from: 500_000, to: 800_000, rate: 0.325 },
  { from: 800_000, to: null, rate: 0.35 },
];

export const PAYE_BANDS_ANNUAL: PayeeBand[] = [
  { from: 0, to: 288_000, rate: 0.10 },
  { from: 288_000, to: 388_000, rate: 0.25 },
  { from: 388_000, to: 6_000_000, rate: 0.30 },
  { from: 6_000_000, to: 9_600_000, rate: 0.325 },
  { from: 9_600_000, to: null, rate: 0.35 },
];

export const PERSONAL_RELIEF_MONTHLY = 2_400; // KSh 2,400/month (KSh 28,800/year)
export const PERSONAL_RELIEF_ANNUAL = 28_800;

// Insurance relief: 15% of premium, max KSh 5,000/month (KSh 60,000/year)
export const INSURANCE_RELIEF_RATE = 0.15;
export const INSURANCE_RELIEF_MAX_MONTHLY = 5_000;

// ============================================================================
// PENSION CONTRIBUTION — Income Tax Act Section 5(6) + Third Schedule
// ============================================================================
// Pension contributions to a registered scheme are DEDUCTED from gross income
// (NOT a tax credit). The deduction is capped at the LOWER of:
//   - 30% of basic salary, OR
//   - KSh 30,000 per month (KSh 360,000 per year)
// There is NO additional "15% pension relief" in Kenyan tax law — the
// deduction from gross income is itself the tax benefit.
// ============================================================================
export const PENSION_DEDUCTION_LIMIT_MONTHLY = 30_000; // KSh 30,000/mo (KSh 360,000/yr)
export const PENSION_DEDUCTION_RATE_OF_BASIC = 0.30; // 30% of basic salary

// ============================================================================
// MORTGAGE INTEREST — Income Tax Act Section 15(1)(f)
// ============================================================================
// Mortgage interest on an OWNER-OCCUPIED residential property is DEDUCTED
// from gross income (NOT a tax credit). Capped at KSh 30,000/month
// (KSh 360,000/year). The property must be the taxpayer's own residence.
// ============================================================================
export const MORTGAGE_DEDUCTION_MAX_MONTHLY = 30_000; // KSh 30,000/mo (KSh 360,000/yr)
export const POST_RETIREMENT_MEDICAL_DEDUCTION_MAX_MONTHLY = 15_000;

// ============================================================================
// NSSF — NSSF Act 2022 (Tier I + Tier II), 2026 rates
// ============================================================================
export const NSSF_TIER_I_LOWER_LIMIT = 0;
export const NSSF_TIER_I_UPPER_LIMIT = 9_000;
export const NSSF_TIER_II_UPPER_LIMIT = 108_000; // 2026 rate cap (KSh 108,000)
export const NSSF_RATE = 0.06; // 6% employee contribution

// ============================================================================
// SHIF — Social Health Insurance Fund (replaced NHIF on Oct 1, 2024)
// ============================================================================
export const SHIF_RATE = 0.0275; // 2.75% of gross income
export const SHIF_MINIMUM = 300; // minimum KSh 300/month

// ============================================================================
// Affordable Housing Levy — Affordable Housing Act 2024
// ============================================================================
export const HOUSING_LEVY_RATE = 0.015; // 1.5% of gross income (employee share)

// ============================================================================
// CORPORATE INCOME TAX — Income Tax Act Cap 470
// ============================================================================
export const CORPORATE_TAX_RATE_RESIDENT = 0.30; // 30%
export const CORPORATE_TAX_RATE_NON_RESIDENT = 0.375; // 37.5%

// Turnover Tax (effective Jan 2024) — for resident businesses with turnover KSh 1M to KSh 25M
export const TURNOVER_TAX_RATE = 0.015; // 1.5% of gross turnover
export const TURNOVER_TAX_MIN_THRESHOLD = 1_000_000; // KSh 1M annual turnover
export const TURNOVER_TAX_THRESHOLD = 25_000_000; // KSh 25M annual turnover (Finance Act 2023)

// ============================================================================
// MONTHLY RENTAL INCOME TAX (MRI) — Section 6A Income Tax Act Cap 470
// ============================================================================
// Reduced to 7.5% of gross residential rental income under Finance Act 2023.
// Applies to gross residential rental income between KSh 288,000/yr (24,000/mo)
// and KSh 15,000,000/yr (1,250,000/mo). Final tax — no expense deductions.
// ============================================================================
export const MRI_TAX_RATE = 0.075; // 7.5% of gross rental income (Finance Act 2023)
export const MRI_MIN_MONTHLY_THRESHOLD = 24_000; // KSh 24,000/month (KSh 288,000/year)
export const MRI_MAX_MONTHLY_THRESHOLD = 1_250_000; // KSh 1,250,000/month (KSh 15M/year)
export const MRI_MIN_ANNUAL_THRESHOLD = 288_000;
export const MRI_MAX_ANNUAL_THRESHOLD = 15_000_000;

// ============================================================================
// VALUE ADDED TAX (VAT) — VAT Act 2013
// ============================================================================
export const VAT_STANDARD_RATE = 0.16; // 16% (standard rate as of 2024)

// ============================================================================
// INSTALLMENT (PROVISIONAL) TAX — Income Tax Act Cap 470
// ============================================================================
// Companies (and individuals with non-PAYE income) whose estimated annual tax
// exceeds KSh 40,000 must pay tax in 4 quarterly installments during the year.
// The "safe harbor" rule: paying at least 110% of the prior year's actual tax
// shields the taxpayer from installment tax interest, even if current-year
// profits surge.
// ============================================================================
export const INSTALLMENT_TAX_THRESHOLD = 40_000; // KSh 40,000 estimated annual tax
export const INSTALLMENT_TAX_SAFE_HARBOR_RATE = 1.10; // 110% of prior year's tax
export const INSTALLMENT_TAX_INTEREST_RATE = 0.01; // 1% per month on underpayment
export const INSTALLMENT_COUNT = 4; // 4 quarterly installments

export type FinancialYearEndMonth =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export interface InstallmentScheduleEntry {
  installmentNumber: 1 | 2 | 3 | 4;
  dueDate: string; // formatted "DD Month YYYY"
  amount: number;
  cumulativePaid: number;
}

export interface InstallmentTaxInput {
  estimatedAnnualTax: number; // current year's projected tax
  taxCoveredByPAYE?: number;
  priorYearTax?: number; // last year's actual tax (for safe harbor)
  calculationBasis?: "current_year" | "prior_year";
  isTurnoverTax?: boolean;
  yearEndMonth: FinancialYearEndMonth;
  yearEndYear: number; // e.g. 2024 for FY ending Dec 2024
}

export interface InstallmentTaxResult {
  estimatedAnnualTax: number;
  priorYearTax: number;
  safeHarborAmount: number; // 110% of prior year tax
  applicableBase: number; // max(estimated, safeHarbor) → used to compute installments
  installmentAmount: number; // per-quarter amount
  schedule: InstallmentScheduleEntry[];
  isMandatory: boolean; // true if uncovered tax exceeds KSh 40,000
  appliesSafeHarbor: boolean;
  calculationBasis: "current_year" | "prior_year";
  notes: string[];
}

const MONTHS: FinancialYearEndMonth[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthIndex(m: FinancialYearEndMonth): number {
  return MONTHS.indexOf(m); // 0-11
}

function addMonths(year: number, monthIdx: number, offset: number): { year: number; monthIdx: number } {
  const total = year * 12 + monthIdx + offset;
  return { year: Math.floor(total / 12), monthIdx: ((total % 12) + 12) % 12 };
}

function formatDate(year: number, monthIdx: number): string {
  return `20 ${MONTHS[monthIdx]} ${year}`;
}

/**
 * Compute Installment Tax schedule.
 *
 * Installment due dates fall on the 20th of the 4th, 6th, 9th, and 12th
 * months of the financial year.
 *
 * For a December year-end (Jan–Dec FY):
 *   - Installment 1: 20 April
 *   - Installment 2: 20 June
 *   - Installment 3: 20 September
 *   - Installment 4: 20 December
 */
export function calculateInstallmentTax(
  input: InstallmentTaxInput
): InstallmentTaxResult {
  const { estimatedAnnualTax, yearEndMonth, yearEndYear } = input;
  const taxCoveredByPAYE = input.taxCoveredByPAYE ?? 0;
  const isTurnoverTax = input.isTurnoverTax ?? false;
  const priorYearTax = input.priorYearTax ?? 0;
  const calculationBasis =
    input.calculationBasis === "prior_year" && priorYearTax > 0
      ? "prior_year"
      : "current_year";
  const notes: string[] = [];
  const uncoveredTax = Math.max(0, estimatedAnnualTax - taxCoveredByPAYE);

  // Safe harbor: 110% of prior year's tax
  const safeHarborAmount = priorYearTax * INSTALLMENT_TAX_SAFE_HARBOR_RATE;

  const isMandatory =
    !isTurnoverTax && uncoveredTax > INSTALLMENT_TAX_THRESHOLD;
  const applicableBase = isMandatory
    ? calculationBasis === "prior_year"
      ? safeHarborAmount
      : uncoveredTax
    : 0;
  const appliesSafeHarbor = isMandatory && calculationBasis === "prior_year";
  const installmentAmount = isMandatory
    ? round2(applicableBase / INSTALLMENT_COUNT)
    : 0;

  // Compute due dates: financial year ends at end of yearEndMonth in yearEndYear.
  // FY start = yearEndMonth + 1 of (yearEndYear - 1).
  // For Dec 2024 year-end: FY runs Jan 2024 → Dec 2024.
  const fyStartMonthIdx = (monthIndex(yearEndMonth) + 1) % 12;
  const fyStartYear = monthIndex(yearEndMonth) === 11 ? yearEndYear : yearEndYear - 1;

  // Installment months: month 4, 6, 9, 12 (1-indexed) of the FY → offsets 3, 5, 8, 11 from start
  const installmentOffsets = [3, 5, 8, 11];
  const schedule: InstallmentScheduleEntry[] = [];
  let cumulative = 0;
  installmentOffsets.forEach((offset, idx) => {
    const { year, monthIdx } = addMonths(fyStartYear, fyStartMonthIdx, offset);
    cumulative += installmentAmount;
    schedule.push({
      installmentNumber: (idx + 1) as 1 | 2 | 3 | 4,
      dueDate: formatDate(year, monthIdx),
      amount: installmentAmount,
      cumulativePaid: round2(cumulative),
    });
  });

  // Compliance notes
  notes.push(isTurnoverTax
    ? "Turnover Tax taxpayers are not subject to installment tax."
    : "For individuals, installment tax applies when tax not covered by PAYE exceeds KSh 40,000."
  );
  if (input.calculationBasis === "prior_year" && priorYearTax <= 0) {
    notes.push("Prior-year basis needs a positive prior-year tax amount; the current-year estimate is used instead.");
  }
  if (isMandatory) {
    notes.push(
      "Tax is paid in 4 equal installments due on the 20th of the 4th, 6th, 9th and 12th months of the financial year."
    );
  }
  if (isMandatory) {
    notes.push(
      "✓ Your estimated annual tax exceeds the KSh 40,000 threshold — Installment Tax is mandatory."
    );
  } else {
    notes.push(
      "ℹ️ Installment Tax does not apply to the inputs provided; the required annual return must still be filed."
    );
  }
  if (isMandatory && appliesSafeHarbor && priorYearTax > 0) {
    notes.push(
      `Safe harbor applies: paying 110% of last year's tax (KSh ${formatNumber(
        safeHarborAmount
      )}) shields you from installment tax interest even if profits surge.`
    );
  } else if (isMandatory && calculationBasis === "current_year" && priorYearTax > 0) {
    notes.push(
      "Safe harbor not triggered — your estimated tax already exceeds 110% of last year's tax, so installments are based on the higher estimate."
    );
  }
  notes.push(
    "Underpayment attracts interest at 1% per month on the unpaid portion (ITA Cap 470)."
  );
  notes.push(
    "Final reconciliation: the annual income tax return is due within 6 months of year-end for companies. Any shortfall is paid with the return."
  );

  return {
    estimatedAnnualTax: round2(estimatedAnnualTax),
    priorYearTax: round2(priorYearTax),
    safeHarborAmount: round2(safeHarborAmount),
    applicableBase: round2(applicableBase),
    installmentAmount,
    schedule,
    isMandatory,
    appliesSafeHarbor,
    calculationBasis,
    notes,
  };
}

// ============================================================================
// TYPES
// ============================================================================
export interface PersonalTaxInput {
  grossIncome: number; // monthly gross
  basicSalary?: number;
  isResident?: boolean;
  pensionContribution?: number; // monthly pension contribution
  insurancePremium?: number; // monthly life/health insurance premium
  mortgageInterest?: number; // monthly mortgage interest paid
  postRetirementMedicalContribution?: number;
  disableNSSF?: boolean;
  disableSHIF?: boolean;
  disableHousingLevy?: boolean;
}

export interface PayeeBandBreakdown {
  from: number;
  to: number | null;
  rate: number;
  taxableAmount: number;
  tax: number;
}

export interface PersonalTaxResult {
  grossIncome: number;
  // Deductions from gross income
  pensionDeduction: number;
  mortgageDeduction: number;
  postRetirementMedicalDeduction: number;
  shif: number;
  housingLevy: number;
  nssf: number; // employee contribution deducted before computing PAYE
  totalAllowableDeductions: number;
  taxableIncome: number; // gross − allowable deductions
  // PAYE computation
  payeeBeforeRelief: number; // gross PAYE from bands
  // Reliefs (tax credits against PAYE — per Third Schedule ITA & Affordable Housing Act 2024)
  personalRelief: number; // KSh 2,400/month statutory
  insuranceRelief: number; // 15% of premium, max KSh 5,000/month
  totalRelief: number;
  payee: number; // net PAYE after reliefs (max 0)
  // Statutory payroll contributions
  // Bottom line
  totalDeductions: number; // PAYE + NSSF + SHIF + Housing Levy
  netPay: number;
  bands: PayeeBandBreakdown[];
  effectiveRate: number; // total statutory deductions / gross
}

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate PAYE tax from taxable income using the progressive bands.
 */
export function calculatePayeeFromBands(
  taxableIncome: number,
  bands: PayeeBand[] = PAYE_BANDS_MONTHLY
): { tax: number; bands: PayeeBandBreakdown[] } {
  const breakdown: PayeeBandBreakdown[] = [];
  let totalTax = 0;

  for (const band of bands) {
    if (taxableIncome <= band.from) {
      breakdown.push({
        from: band.from,
        to: band.to,
        rate: band.rate,
        taxableAmount: 0,
        tax: 0,
      });
      continue;
    }
    const upper = band.to === null ? Infinity : band.to;
    const taxableInBand = Math.min(taxableIncome, upper) - band.from;
    const taxInBand = taxableInBand * band.rate;
    totalTax += taxInBand;
    breakdown.push({
      from: band.from,
      to: band.to,
      rate: band.rate,
      taxableAmount: taxableInBand,
      tax: taxInBand,
    });
  }

  return { tax: totalTax, bands: breakdown };
}

export function calculateAnnualIncomeTax(taxableIncome: number): number {
  return calculatePayeeFromBands(taxableIncome, PAYE_BANDS_ANNUAL).tax;
}

/**
 * Calculate NSSF contribution (employee).
 * Tier I: 6% of first KSh 9,000 → max KSh 540
 * Tier II: 6% of pensionable pay between the Tier I and Tier II limits.
 */
export function calculateNSSF(grossIncome: number): {
  tierI: number;
  tierII: number;
  total: number;
} {
  const pensionablePay = Math.max(0, grossIncome);
  const tierI = Math.min(pensionablePay, NSSF_TIER_I_UPPER_LIMIT) * NSSF_RATE;
  const tierII =
    pensionablePay > NSSF_TIER_I_UPPER_LIMIT
      ? (Math.min(pensionablePay, NSSF_TIER_II_UPPER_LIMIT) -
          NSSF_TIER_I_UPPER_LIMIT) *
        NSSF_RATE
      : 0;
  return {
    tierI: round2(tierI),
    tierII: round2(tierII),
    total: round2(tierI + tierII),
  };
}

/**
 * Calculate SHIF contribution (replaced NHIF on Oct 1, 2024).
 * 2.75% of gross income, minimum KSh 300/month.
 */
export function calculateSHIF(grossIncome: number): number {
  if (grossIncome <= 0) return 0;
  const contribution = grossIncome * SHIF_RATE;
  return round2(Math.max(contribution, SHIF_MINIMUM));
}

/**
 * Calculate Affordable Housing Levy (employee share).
 * 1.5% of gross monthly income.
 */
export function calculateHousingLevy(grossIncome: number): number {
  return round2(Math.max(0, grossIncome) * HOUSING_LEVY_RATE);
}

/**
 * Full personal income tax calculation per KRA standards.
 *
 * Computation order (per Income Tax Act Cap 470, Third Schedule):
 *   1. Gross Income (basic salary + allowances + bonuses)
 *   2. Less ALLOWABLE DEDUCTIONS:
 *        a. Registered pension contribution (max KSh 30,000/mo and 30% of basic salary)
 *        b. Mortgage interest on owner-occupied property (max KSh 30,000/mo)
 *        c. Post-retirement medical contribution (max KSh 15,000/mo)
 *        d. Employee NSSF, SHIF contribution and Affordable Housing Levy
 *   3. = TAXABLE INCOME
 *   4. Apply PAYE bands → GROSS PAYE
 *   5. Less RELIEFS (tax credits):
 *        a. Personal Relief (KSh 2,400/mo) — Third Schedule
 *        b. Insurance Relief (15% of premium, max KSh 5,000/mo) — Third Schedule
 *   6. = NET PAYE (min 0)
 *   7. Deduct employee NSSF, SHIF and Affordable Housing Levy from net pay
 *   8. = NET PAY
 */
export function calculatePersonalTax(
  input: PersonalTaxInput
): PersonalTaxResult {
  const {
    grossIncome,
    basicSalary = grossIncome,
    isResident = true,
    pensionContribution = 0,
    insurancePremium = 0,
    mortgageInterest = 0,
    postRetirementMedicalContribution = 0,
    disableNSSF = false,
    disableSHIF = false,
    disableHousingLevy = false,
  } = input;

  // ---- Step 2a: Registered pension deduction ----
  const pensionDeduction = Math.min(
    pensionContribution,
    PENSION_DEDUCTION_LIMIT_MONTHLY,
    Math.min(Math.max(0, basicSalary), Math.max(0, grossIncome)) *
      PENSION_DEDUCTION_RATE_OF_BASIC
  );

  // ---- Step 2b: Mortgage interest deduction ----
  const mortgageDeduction = Math.min(
    mortgageInterest,
    MORTGAGE_DEDUCTION_MAX_MONTHLY
  );

  const postRetirementMedicalDeduction = Math.min(
    postRetirementMedicalContribution,
    POST_RETIREMENT_MEDICAL_DEDUCTION_MAX_MONTHLY
  );

  // ---- Statutory contributions ----
  const nssf = disableNSSF ? 0 : calculateNSSF(grossIncome).total;
  const shif = disableSHIF ? 0 : calculateSHIF(grossIncome);
  const housingLevy = disableHousingLevy
    ? 0
    : calculateHousingLevy(grossIncome);

  // ---- Step 3: Taxable income ----
  const totalAllowableDeductions =
    pensionDeduction +
    mortgageDeduction +
    postRetirementMedicalDeduction +
    nssf +
    shif +
    housingLevy;
  const taxableIncome = Math.max(0, grossIncome - totalAllowableDeductions);

  // ---- Step 4: Gross PAYE from bands ----
  const { tax: payeeBeforeRelief, bands } =
    calculatePayeeFromBands(taxableIncome);

  // ---- Step 5: Tax Reliefs ----
  const personalRelief = isResident ? PERSONAL_RELIEF_MONTHLY : 0;
  const rawInsuranceRelief = isResident
    ? insurancePremium * INSURANCE_RELIEF_RATE
    : 0;
  const insuranceRelief = Math.min(
    rawInsuranceRelief,
    INSURANCE_RELIEF_MAX_MONTHLY
  );
  const totalRelief = personalRelief + insuranceRelief;

  // ---- Step 7: Net PAYE (cannot be negative) ----
  const payee = Math.max(0, payeeBeforeRelief - totalRelief);

  // ---- Step 8: Net pay ----
  const totalDeductions = payee + totalAllowableDeductions;
  const netPay = grossIncome - totalDeductions;
  const effectiveRate = grossIncome > 0 ? totalDeductions / grossIncome : 0;

  return {
    grossIncome: round2(grossIncome),
    pensionDeduction: round2(pensionDeduction),
    mortgageDeduction: round2(mortgageDeduction),
    postRetirementMedicalDeduction: round2(postRetirementMedicalDeduction),
    nssf: round2(nssf),
    totalAllowableDeductions: round2(totalAllowableDeductions),
    taxableIncome: round2(taxableIncome),
    payeeBeforeRelief: round2(payeeBeforeRelief),
    personalRelief: round2(personalRelief),
    insuranceRelief: round2(insuranceRelief),
    totalRelief: round2(totalRelief),
    payee: round2(payee),
    shif: round2(shif),
    housingLevy: round2(housingLevy),
    totalDeductions: round2(totalDeductions),
    netPay: round2(netPay),
    bands,
    effectiveRate: round4(effectiveRate),
  };
}

// ============================================================================
// BUSINESS INCOME TAX
// ============================================================================
export type BusinessType = "resident_company" | "non_resident_company" | "turnover_tax" | "sole_proprietor";

export interface BusinessTaxInput {
  businessType: BusinessType;
  grossRevenue: number; // annual
  allowableExpenses: number; // annual (for corporate — net profit calc)
  incomeCategory?: BusinessIncomeCategory;
  isResident?: boolean;
  otherAnnualTaxableIncome?: number;
  withholdingTaxCredit?: number;
}

export type BusinessIncomeCategory =
  | "ordinary"
  | "professional"
  | "management"
  | "training"
  | "rental"
  | "final_withholding";

export interface BusinessTaxResult {
  businessType: BusinessType;
  grossRevenue: number;
  allowableExpenses: number;
  taxableProfit: number;
  taxRate: number;
  taxPayable: number;
  afterTaxProfit: number;
  notes: string[];
  effectiveRate: number;
}

export function calculateBusinessTax(
  input: BusinessTaxInput
): BusinessTaxResult {
  const { businessType, grossRevenue, allowableExpenses } = input;
  const incomeCategory = input.incomeCategory ?? "ordinary";
  const isResident = input.isResident ?? true;
  const notes: string[] = [];
  let taxRate = 0;
  let taxableProfit = 0;
  let taxPayable = 0;

  switch (businessType) {
    case "resident_company":
      taxRate = CORPORATE_TAX_RATE_RESIDENT;
      taxableProfit = Math.max(0, grossRevenue - allowableExpenses);
      taxPayable = taxableProfit * taxRate;
      notes.push(
        "Resident companies are taxed at 30% on their taxable profits (Income Tax Act Cap 470)."
      );
      notes.push(
        "Taxable profit = Gross revenue − Allowable expenses (per ITA Cap 470)."
      );
      notes.push(
        "Filing deadline: IT2C return due within 6 months after year-end."
      );
      break;
    case "non_resident_company":
      taxRate = CORPORATE_TAX_RATE_NON_RESIDENT;
      taxableProfit = Math.max(0, grossRevenue - allowableExpenses);
      taxPayable = taxableProfit * taxRate;
      notes.push(
        "Non-resident companies are taxed at 37.5% on their taxable profits."
      );
      notes.push(
        "Branch profits repatriated are subject to an additional 15% remittance tax."
      );
      break;
    case "turnover_tax":
      taxRate = TURNOVER_TAX_RATE;
      taxableProfit = grossRevenue;
      {
        const excludedCategories: BusinessIncomeCategory[] = [
          "professional",
          "management",
          "training",
          "rental",
          "final_withholding",
        ];
        const eligible =
          isResident &&
          grossRevenue > TURNOVER_TAX_MIN_THRESHOLD &&
          grossRevenue <= TURNOVER_TAX_THRESHOLD &&
          !excludedCategories.includes(incomeCategory);
        taxPayable = eligible ? grossRevenue * taxRate : 0;
        notes.push(
          "Turnover Tax is 1.5% of gross sales; no expense deductions are allowed."
        );
        if (eligible) {
          notes.push(
            "Eligible resident business: annual turnover is above KSh 1M and does not exceed KSh 25M."
          );
          notes.push(
            "Monthly return and payment are due via iTax by the 20th of the following month."
          );
        } else {
          notes.push(
            "Turnover Tax does not apply: check residency, annual turnover limits and excluded income types; use the applicable ordinary income-tax regime."
          );
        }
      }
      break;
    case "sole_proprietor":
      taxRate = 0; // sole proprietor income is taxed under PAYE bands
      taxableProfit = Math.max(0, grossRevenue - allowableExpenses);
      {
        const annualTaxableIncome =
          taxableProfit + Math.max(0, input.otherAnnualTaxableIncome ?? 0);
        const annualTaxBeforeRelief =
          calculateAnnualIncomeTax(annualTaxableIncome);
        const personalRelief = isResident ? PERSONAL_RELIEF_ANNUAL : 0;
        const withholdingTaxCredit = Math.max(0, input.withholdingTaxCredit ?? 0);
        taxPayable = Math.max(
          0,
          annualTaxBeforeRelief - personalRelief - withholdingTaxCredit
        );
      }
      notes.push(
        "Sole-proprietor and freelance profit is added to other annual taxable income and taxed using individual progressive bands."
      );
      notes.push(
        "Annual individual return is due by 30 June following the year of income. Claim qualifying withholding certificates as tax credits."
      );
      notes.push(
        "Resident professional-fee withholding is generally 5%; non-resident service withholding is generally 20% and may be final when there is no Kenyan permanent establishment. Payers generally remit withholding within five working days."
      );
      notes.push(
        "Estimated balance payable is reduced by the entered PAYE or withholding-tax credits."
      );
      break;
  }

  const afterTaxProfit = taxableProfit - taxPayable;
  const effectiveRate = grossRevenue > 0 ? taxPayable / grossRevenue : 0;

  return {
    businessType,
    grossRevenue: round2(grossRevenue),
    allowableExpenses: round2(allowableExpenses),
    taxableProfit: round2(taxableProfit),
    taxRate,
    taxPayable: round2(taxPayable),
    afterTaxProfit: round2(afterTaxProfit),
    notes,
    effectiveRate: round4(effectiveRate),
  };
}

// ============================================================================
// VAT CALCULATION
// ============================================================================
export type VatType = "add_vat" | "remove_vat";

export interface VatInput {
  amount: number;
  type: VatType;
  rate?: number; // default 16%
}

export interface VatResult {
  type: VatType;
  rate: number;
  baseAmount: number; // the net amount (before VAT)
  vatAmount: number;
  grossAmount: number; // base + VAT
  notes: string[];
}

export function calculateVAT(input: VatInput): VatResult {
  const rate = input.rate ?? VAT_STANDARD_RATE;
  const notes: string[] = [];
  let baseAmount = 0;
  let vatAmount = 0;
  let grossAmount = 0;

  if (input.type === "add_vat") {
    baseAmount = input.amount;
    vatAmount = baseAmount * rate;
    grossAmount = baseAmount + vatAmount;
    notes.push("VAT is added on top of the taxable supply value.");
  } else {
    // remove VAT
    grossAmount = input.amount;
    baseAmount = grossAmount / (1 + rate);
    vatAmount = grossAmount - baseAmount;
    notes.push("VAT is removed from the gross (VAT-inclusive) amount.");
  }

  notes.push(
    `Standard VAT rate in Kenya is ${rate * 100}% (VAT Act 2013, as amended).`
  );
  notes.push(
    "VAT registration threshold: KSh 5M annual turnover (compulsory registration)."
  );
  notes.push(
    "Some supplies are zero-rated (0%) — e.g. exports — while others are exempt (e.g. basic food, financial services)."
  );
  notes.push(
    "VAT returns are filed monthly via iTax on or before the 20th of the following month."
  );

  return {
    type: input.type,
    rate,
    baseAmount: round2(baseAmount),
    vatAmount: round2(vatAmount),
    grossAmount: round2(grossAmount),
    notes,
  };
}

// ============================================================================
// MONTHLY RENTAL INCOME TAX (MRI) CALCULATION
// ============================================================================
export type MriPeriod = "monthly" | "annual";

export interface MriTaxInput {
  grossRentalIncome: number;
  period: MriPeriod;
  isResident?: boolean;
  propertyType?: "residential" | "commercial";
  optOutOfMri?: boolean;
  taxpayerType?: "individual" | "company" | "nonresident_landlord";
  annualAllowableExpenses?: number;
  otherAnnualTaxableIncome?: number;
  withholdingTaxCredit?: number;
}

export interface MriTaxResult {
  period: MriPeriod;
  grossRentalIncome: number;
  monthlyEquivalent: number;
  annualEquivalent: number;
  taxRate: number;
  taxPayable: number;
  netRentalIncome: number;
  isEligible: boolean;
  isBelowThreshold: boolean;
  isAboveThreshold: boolean;
  usesMri: boolean;
  notes: string[];
}

export function calculateMriTax(input: MriTaxInput): MriTaxResult {
  const { grossRentalIncome, period } = input;
  const isResident = input.isResident ?? true;
  const propertyType = input.propertyType ?? "residential";
  const optOutOfMri = input.optOutOfMri ?? false;
  const taxpayerType = input.taxpayerType ?? "individual";
  const monthlyEquivalent =
    period === "annual" ? grossRentalIncome / 12 : grossRentalIncome;
  const annualEquivalent =
    period === "monthly" ? grossRentalIncome * 12 : grossRentalIncome;

  const isBelowThreshold =
    annualEquivalent <= MRI_MIN_ANNUAL_THRESHOLD && annualEquivalent > 0;
  const isAboveThreshold = annualEquivalent > MRI_MAX_ANNUAL_THRESHOLD;
  const isEligible =
    isResident &&
    propertyType === "residential" &&
    !isBelowThreshold &&
    !isAboveThreshold &&
    annualEquivalent > 0;
  const usesMri = isEligible && !optOutOfMri;

  const mriTaxPayable = usesMri
    ? round2(grossRentalIncome * MRI_TAX_RATE)
    : 0;
  const annualExpenses =
    taxpayerType === "nonresident_landlord"
      ? 0
      : Math.max(0, input.annualAllowableExpenses ?? 0);
  const annualNetRentalProfit = Math.max(0, annualEquivalent - annualExpenses);
  const otherAnnualTaxableIncome = Math.max(
    0,
    input.otherAnnualTaxableIncome ?? 0
  );
  const annualTaxableIncome =
    (taxpayerType === "nonresident_landlord"
      ? annualEquivalent
      : annualNetRentalProfit) + otherAnnualTaxableIncome;
  const annualOrdinaryTax =
    taxpayerType === "nonresident_landlord"
      ? annualEquivalent * 0.30
      : taxpayerType === "company"
        ? annualTaxableIncome * CORPORATE_TAX_RATE_RESIDENT
        : Math.max(
            0,
            calculateAnnualIncomeTax(annualTaxableIncome) -
              (isResident ? PERSONAL_RELIEF_ANNUAL : 0)
          );
  const annualCredits = Math.max(0, input.withholdingTaxCredit ?? 0);
  const ordinaryTaxForPeriod =
    Math.max(0, annualOrdinaryTax - annualCredits) /
    (period === "monthly" ? 12 : 1);
  const taxPayable = usesMri ? mriTaxPayable : round2(ordinaryTaxForPeriod);
  const effectiveRate =
    grossRentalIncome > 0 ? taxPayable / grossRentalIncome : 0;
  const expensesForPeriod = usesMri
    ? 0
    : period === "monthly"
      ? annualExpenses / 12
      : annualExpenses;
  const netRentalIncome = round2(
    grossRentalIncome - expensesForPeriod - taxPayable
  );

  const notes: string[] = usesMri ? [
    "Monthly Rental Income Tax (MRI) is 7.5% of gross residential rental income (Finance Act 2023, effective Jan 1, 2024).",
    "It is a FINAL TAX — no expense deductions (repairs, agent fees, insurance) or personal reliefs are allowed.",
    "Applies to gross residential rental income between KSh 288,000/year (KSh 24,000/month) and KSh 15,000,000/year (KSh 1.25M/month).",
    "Filing & Payment: Must be filed and paid monthly on or before the 20th day of the following month via the KRA iTax portal (generating a PRN).",
    "Opt-out Provision: Landlords can write to KRA to elect to be taxed under regular corporate/individual income tax rates with expense deductions."
  ] : [
    "MRI does not apply or was opted out of. Ordinary rental income tax is estimated on net rent after entered allowable expenses.",
    taxpayerType === "nonresident_landlord"
      ? "Non-resident building rent is estimated at 30% of gross rent; confirm withholding and treaty treatment."
      : taxpayerType === "company"
        ? "Company estimate uses the resident-company rate; confirm residency and any other company income before filing."
        : "Individual estimate combines rental profit with entered other annual taxable income and applies resident personal relief where eligible.",
    "This estimate is not a substitute for the annual return; confirm the applicable filing obligation and credits with KRA."
  ];

  if (isBelowThreshold) {
    notes.unshift(
      "MRI applies only when annual residential rent is over KSh 288,000."
    );
  } else if (isAboveThreshold) {
    notes.unshift(
      "Annual rent exceeds KSh 15,000,000; calculate under ordinary income-tax rules."
    );
  }
  if (!isResident) notes.unshift("MRI applies to resident persons; this estimate uses ordinary income-tax treatment.");
  if (propertyType === "commercial") notes.unshift("MRI applies to residential rental income, not commercial rent.");

  return {
    period,
    grossRentalIncome: round2(grossRentalIncome),
    monthlyEquivalent: round2(monthlyEquivalent),
    annualEquivalent: round2(annualEquivalent),
    taxRate: usesMri ? MRI_TAX_RATE : round4(effectiveRate),
    taxPayable,
    netRentalIncome,
    isEligible,
    isBelowThreshold,
    isAboveThreshold,
    usesMri,
    notes,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
}

export function formatKSh(n: number): string {
  return `KSh ${formatNumber(n)}`;
}

export function formatPercent(n: number, decimals = 2): string {
  return `${(n * 100).toFixed(decimals)}%`;
}
