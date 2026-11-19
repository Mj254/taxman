import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, '..', 'src', 'lib', 'tax-calculations.ts');
const source = fs.readFileSync(
  sourcePath,
  'utf8'
);
const javascript = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const loadedModule = new Module(sourcePath);
loadedModule.filename = sourcePath;
loadedModule.paths = Module._nodeModulePaths(path.dirname(sourcePath));
loadedModule._compile(javascript, sourcePath);
const tax = loadedModule.exports;

test('annual individual bands and sole-proprietor tax include relief and credits', () => {
  assert.equal(tax.calculateAnnualIncomeTax(1_200_000), 297_400);

  const result = tax.calculateBusinessTax({
    businessType: 'sole_proprietor',
    grossRevenue: 1_800_000,
    allowableExpenses: 600_000,
    isResident: true,
    withholdingTaxCredit: 75_000,
  });

  assert.equal(result.taxableProfit, 1_200_000);
  assert.equal(result.taxPayable, 193_600);
});

test('PAYE applies deductions before bands and personal relief only to residents', () => {
  const deductions = tax.calculatePersonalTax({
    grossIncome: 100_000,
    basicSalary: 100_000,
    pensionContribution: 40_000,
    mortgageInterest: 40_000,
    postRetirementMedicalContribution: 20_000,
  });

  assert.equal(deductions.pensionDeduction, 30_000);
  assert.equal(deductions.mortgageDeduction, 30_000);
  assert.equal(deductions.postRetirementMedicalDeduction, 15_000);
  assert.equal(deductions.taxableIncome, 14_750);
  assert.equal(deductions.payee, 0);

  const nssf = tax.calculateNSSF(100_000);
  assert.deepEqual(nssf, { tierI: 540, tierII: 5_460, total: 6_000 });
  const sampleReceipt = tax.calculatePersonalTax({ grossIncome: 100_000 });
  assert.equal(sampleReceipt.taxableIncome, 89_750);
  assert.equal(sampleReceipt.payeeBeforeRelief, 21_708.35);
  assert.equal(sampleReceipt.payee, 19_308.35);
  assert.equal(sampleReceipt.totalDeductions, 29_558.35);
  assert.equal(sampleReceipt.netPay, 70_441.65);

  const resident = tax.calculatePersonalTax({
    grossIncome: 50_000,
    insurancePremium: 10_000,
    disableNSSF: true,
    disableSHIF: true,
    disableHousingLevy: true,
  });
  const nonresident = tax.calculatePersonalTax({
    grossIncome: 50_000,
    isResident: false,
    insurancePremium: 10_000,
    disableNSSF: true,
    disableSHIF: true,
    disableHousingLevy: true,
  });

  assert.equal(resident.personalRelief, 2_400);
  assert.equal(nonresident.personalRelief, 0);
  assert.equal(nonresident.insuranceRelief, 0);
  assert.equal(resident.payee - nonresident.payee, -3_900);
});

test('turnover tax uses the right rate and excludes ineligible businesses', () => {
  const eligible = tax.calculateBusinessTax({
    businessType: 'turnover_tax',
    grossRevenue: 8_000_000,
    allowableExpenses: 0,
  });
  assert.equal(eligible.taxPayable, 120_000);

  for (const grossRevenue of [1_000_000, 25_000_001]) {
    const result = tax.calculateBusinessTax({
      businessType: 'turnover_tax',
      grossRevenue,
      allowableExpenses: 0,
    });
    assert.equal(result.taxPayable, 0);
  }

  const professionalFees = tax.calculateBusinessTax({
    businessType: 'turnover_tax',
    grossRevenue: 8_000_000,
    allowableExpenses: 0,
    incomeCategory: 'professional',
  });
  assert.equal(professionalFees.taxPayable, 0);
});

test('MRI only taxes eligible resident residential rent', () => {
  const eligible = tax.calculateMriTax({
    grossRentalIncome: 50_000,
    period: 'monthly',
  });
  assert.equal(eligible.usesMri, true);
  assert.equal(eligible.taxPayable, 3_750);

  const threshold = tax.calculateMriTax({
    grossRentalIncome: 288_000,
    period: 'annual',
  });
  assert.equal(threshold.usesMri, false);
  assert.equal(threshold.taxRate, 0);

  const commercial = tax.calculateMriTax({
    grossRentalIncome: 50_000,
    period: 'monthly',
    propertyType: 'commercial',
    annualAllowableExpenses: 120_000,
  });
  assert.equal(commercial.usesMri, false);
  assert.equal(commercial.taxPayable, 4_383.33);
  assert.equal(commercial.netRentalIncome, 35_616.67);

  const nonresident = tax.calculateMriTax({
    grossRentalIncome: 50_000,
    period: 'monthly',
    isResident: false,
    taxpayerType: 'nonresident_landlord',
  });
  assert.equal(nonresident.taxPayable, 15_000);
});

test('installment dates fall on the 20th and exemption uses tax uncovered by PAYE', () => {
  const schedule = tax.calculateInstallmentTax({
    estimatedAnnualTax: 100_000,
    taxCoveredByPAYE: 0,
    yearEndMonth: 'December',
    yearEndYear: 2025,
  });
  assert.deepEqual(
    schedule.schedule.map((entry) => entry.dueDate),
    ['20 April 2025', '20 June 2025', '20 September 2025', '20 December 2025']
  );
  assert.equal(schedule.isMandatory, true);

  const priorYearBasis = tax.calculateInstallmentTax({
    estimatedAnnualTax: 200_000,
    priorYearTax: 100_000,
    calculationBasis: 'prior_year',
    yearEndMonth: 'December',
    yearEndYear: 2025,
  });
  assert.equal(priorYearBasis.applicableBase, 110_000);
  assert.equal(priorYearBasis.appliesSafeHarbor, true);

  const covered = tax.calculateInstallmentTax({
    estimatedAnnualTax: 100_000,
    taxCoveredByPAYE: 60_000,
    yearEndMonth: 'December',
    yearEndYear: 2025,
  });
  assert.equal(covered.isMandatory, false);
  assert.equal(covered.installmentAmount, 0);

  const turnoverTax = tax.calculateInstallmentTax({
    estimatedAnnualTax: 500_000,
    isTurnoverTax: true,
    yearEndMonth: 'December',
    yearEndYear: 2025,
  });
  assert.equal(turnoverTax.isMandatory, false);
});
