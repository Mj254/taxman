'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  calculatePersonalTax,
  formatKSh,
  formatNumber,
  formatPercent,
  type PersonalTaxInput,
  type PersonalTaxResult,
} from '@/lib/tax-calculations';
import {
  Calculator,
  RefreshCw,
  TrendingDown,
  Wallet,
  Printer,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

const DEFAULT_INPUT: PersonalTaxInput = {
  grossIncome: 100000,
  basicSalary: 100000,
  isResident: true,
  pensionContribution: 0,
  insurancePremium: 0,
  mortgageInterest: 0,
  postRetirementMedicalContribution: 0,
  disableNSSF: false,
  disableSHIF: false,
  disableHousingLevy: false,
};

export function PersonalTaxCalculator() {
  const [input, setInput] = useState<PersonalTaxInput>(DEFAULT_INPUT);

  const result = useMemo(() => calculatePersonalTax(input), [input]);

  const updateField = <K extends keyof PersonalTaxInput>(
    key: K,
    value: PersonalTaxInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setInput(DEFAULT_INPUT);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* INPUT PANEL */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            Income Details
          </CardTitle>
          <CardDescription>
            Enter your monthly figures. All amounts in Kenyan Shillings (KSh).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="gross">
              Gross Monthly Income <span className="text-red-500">*</span>
            </Label>
            <Input
              id="gross"
              type="number"
              value={input.grossIncome || ''}
              onChange={(e) =>
                updateField('grossIncome', Number(e.target.value) || 0)
              }
              placeholder="e.g. 100000"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Total gross pay before any deductions (basic salary + allowances +
              bonuses).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="basic-salary">Monthly Basic Salary</Label>
            <Input
              id="basic-salary"
              type="number"
              min="0"
              value={input.basicSalary || ''}
              onChange={(e) =>
                updateField('basicSalary', Number(e.target.value) || 0)
              }
              placeholder="Used to apply the pension deduction limit"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={input.isResident ?? true}
              onChange={(e) => updateField('isResident', e.target.checked)}
            />
            Kenyan tax resident (eligible for personal relief)
          </label>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Allowable Deductions from Gross Income
              <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                These reduce your taxable income before PAYE is applied.
              </span>
            </Label>

            <div className="space-y-2">
              <Label htmlFor="pension" className="text-xs text-muted-foreground">
                Monthly Pension Contribution (to registered scheme)
              </Label>
              <Input
                id="pension"
                type="number"
                value={input.pensionContribution || ''}
                onChange={(e) =>
                  updateField('pensionContribution', Number(e.target.value) || 0)
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Deducted from gross income, capped at KSh 30,000/month and
                30% of basic salary — ITA S.5(6).
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="insurance"
                className="text-xs text-muted-foreground"
              >
                Monthly Life/Health/Education Insurance Premium
              </Label>
              <Input
                id="insurance"
                type="number"
                value={input.insurancePremium || ''}
                onChange={(e) =>
                  updateField('insurancePremium', Number(e.target.value) || 0)
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                15% tax-credit relief against PAYE, capped at KSh 5,000/month —
                Third Schedule ITA.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="mortgage"
                className="text-xs text-muted-foreground"
              >
                Monthly Mortgage Interest (owner-occupied residential property)
              </Label>
              <Input
                id="mortgage"
                type="number"
                value={input.mortgageInterest || ''}
                onChange={(e) =>
                  updateField('mortgageInterest', Number(e.target.value) || 0)
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Deducted from gross income, capped at KSh 30,000/month — ITA
                S.15(1)(f). Must be on owner-occupied residence.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-retirement-medical" className="text-xs text-muted-foreground">
                Monthly Post-Retirement Medical Fund Contribution
              </Label>
              <Input
                id="post-retirement-medical"
                type="number"
                min="0"
                value={input.postRetirementMedicalContribution || ''}
                onChange={(e) =>
                  updateField(
                    'postRetirementMedicalContribution',
                    Number(e.target.value) || 0
                  )
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Deductible up to KSh 15,000/month when statutory conditions are met.
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Statutory Deductions
            </Label>
            <div className="space-y-3">
              <ToggleRow
                label="NSSF Contribution"
                description="6% of pensionable pay (Tier I + II, max KSh 6,480/mo in 2026)"
                checked={!input.disableNSSF}
                onChange={(v) => updateField('disableNSSF', !v)}
              />
              <ToggleRow
                label="SHIF Contribution"
                description="2.75% of gross income (replaced NHIF Oct 2024)"
                checked={!input.disableSHIF}
                onChange={(v) => updateField('disableSHIF', !v)}
              />
              <ToggleRow
                label="Affordable Housing Levy"
                description="1.5% of gross monthly income"
                checked={!input.disableHousingLevy}
                onChange={(v) => updateField('disableHousingLevy', !v)}
              />
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>

      {/* RESULTS PANEL */}
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-semibold tracking-tight">Calculation Summary</h3>
          <TaxReceiptDialog result={result} />
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Gross Income"
            value={formatKSh(result.grossIncome)}
            icon={<Wallet className="h-4 w-4" />}
            tone="neutral"
          />
          <SummaryCard
            title="Total Deductions"
            value={formatKSh(result.totalDeductions)}
            sub={`${formatPercent(result.effectiveRate)} effective`}
            icon={<TrendingDown className="h-4 w-4" />}
            tone="danger"
          />
          <SummaryCard
            title="Net Take-Home Pay"
            value={formatKSh(result.netPay)}
            icon={<Wallet className="h-4 w-4" />}
            tone="success"
          />
        </div>

        {/* PAYE Band Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              PAYE Tax Band Breakdown
            </CardTitle>
            <CardDescription>
              Monthly bands per Finance Act 2023. Taxable income:{' '}
              <span className="font-semibold text-foreground">
                {formatKSh(result.taxableIncome)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Band (KSh)</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Taxable in Band</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.bands.map((band, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {formatNumber(band.from)} –{' '}
                      {band.to === null
                        ? '∞'
                        : formatNumber(band.to)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {formatPercent(band.rate, band.rate === 0.325 ? 1 : 0)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(band.taxableAmount)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatNumber(band.tax)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Deductions breakdown — KRA-compliant computation flow */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tax Computation (per ITA Cap 470)
            </CardTitle>
            <CardDescription>
              Qualifying deductions reduce taxable income before applying bands;
              payroll contributions are also reflected in take-home pay.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* STEP 1: Gross income */}
            <DeductionRow
              label="Gross Monthly Income"
              value={result.grossIncome}
              isHeader
            />

            {/* STEP 2: Allowable deductions from gross */}
            {result.pensionDeduction > 0 && (
              <DeductionRow
                label="Less: Pension Contribution (max KSh 30,000 and 30% of basic) — S.5(6)"
                value={-result.pensionDeduction}
                isRelief
              />
            )}
            {result.mortgageDeduction > 0 && (
              <DeductionRow
                label="Less: Mortgage Interest (cap KSh 30,000) — S.15(1)(f)"
                value={-result.mortgageDeduction}
                isRelief
              />
            )}
            {result.nssf > 0 && (
              <DeductionRow
                label="Less: NSSF Contribution (Tier I + II) — NSSF Act 2022"
                value={-result.nssf}
                isRelief
              />
            )}
            {result.postRetirementMedicalDeduction > 0 && (
              <DeductionRow
                label="Less: Post-Retirement Medical Fund Contribution (max KSh 15,000)"
                value={-result.postRetirementMedicalDeduction}
                isRelief
              />
            )}
            {result.shif > 0 && (
              <DeductionRow
                label="Less: SHIF contribution"
                value={-result.shif}
                isRelief
              />
            )}
            {result.housingLevy > 0 && (
              <DeductionRow
                label="Less: Affordable Housing Levy"
                value={-result.housingLevy}
                isRelief
              />
            )}

            {/* STEP 3: Taxable income */}
            <Separator />
            <DeductionRow
              label="Taxable Income"
              value={result.taxableIncome}
              isHighlight
            />
            <Separator />

            {/* STEP 4 & 5: PAYE computation */}
            <DeductionRow
              label="Gross PAYE (from bands above)"
              value={result.payeeBeforeRelief}
              isHeader
            />
            <DeductionRow
              label="Less: Personal Relief (KSh 2,400/mo)"
              value={-result.personalRelief}
              isRelief
            />
            {result.insuranceRelief > 0 && (
              <DeductionRow
                label="Less: Insurance Relief (15%, max KSh 5,000)"
                value={-result.insuranceRelief}
                isRelief
              />
            )}

            {/* STEP 6: Net PAYE */}
            <Separator />
            <DeductionRow
              label="Net PAYE Payable to KRA"
              value={result.payee}
              isHighlight
            />
            <Separator />

            {/* STEP 7: Other statutory contributions (NOT reliefs) */}
            <DeductionRow
              label="NSSF contribution (payroll deduction)"
              value={result.nssf}
            />
            <DeductionRow
              label="SHIF contribution (2.75% of gross)"
              value={result.shif}
            />
            <DeductionRow
              label="Affordable Housing Levy (1.5% of gross)"
              value={result.housingLevy}
            />

            {/* STEP 8: Bottom line */}
            <Separator />
            <DeductionRow
              label="Total Monthly Deductions (tax + contributions)"
              value={result.totalDeductions}
              isTotal
            />
            <Separator />
            <DeductionRow
              label="Net Take-Home Pay"
              value={result.netPay}
              isHighlight
              positive
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  sub,
  icon,
  tone,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  tone: 'neutral' | 'danger' | 'success';
}) {
  const toneClasses = {
    neutral: 'bg-muted/50 border-border',
    danger: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
    success:
      'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900',
  };
  const valueTone = {
    neutral: 'text-foreground',
    danger: 'text-red-700 dark:text-red-400',
    success: 'text-emerald-700 dark:text-emerald-400',
  };
  return (
    <Card className={`${toneClasses[tone]} border`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <span className={valueTone[tone]}>{icon}</span>
        </div>
        <p className={`text-lg font-bold ${valueTone[tone]}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function DeductionRow({
  label,
  value,
  isHeader,
  isRelief,
  isHighlight,
  isTotal,
  positive,
}: {
  label: string;
  value: number;
  isHeader?: boolean;
  isRelief?: boolean;
  isHighlight?: boolean;
  isTotal?: boolean;
  positive?: boolean;
}) {
  const isNegative = value < 0;
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        isTotal ? 'text-base font-bold' : ''
      } ${isHighlight ? 'font-semibold' : ''} ${
        isHeader ? 'text-muted-foreground' : ''
      } ${isRelief ? 'pl-4 text-emerald-700 dark:text-emerald-400' : ''}`}
    >
      <span>{label}</span>
      <span
        className={`font-mono ${
          isTotal
            ? 'text-red-700 dark:text-red-400'
            : isHighlight && positive
              ? 'text-emerald-700 dark:text-emerald-400'
              : isNegative
                ? 'text-emerald-700 dark:text-emerald-400'
                : ''
        }`}
      >
        {isNegative ? '−' : ''}
        {formatKSh(Math.abs(value))}
      </span>
    </div>
  );
}

function TaxReceiptDialog({ result }: { result: PersonalTaxResult }) {
  const [copied, setCopied] = useState(false);

  const receiptDate = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const generateSummaryText = () => {
    return `========================================
KENYA REVENUE AUTHORITY (KRA)
PAYE MONTHLY TAX CALCULATION RECEIPT
Date: ${receiptDate}
========================================
Gross Monthly Salary:       ${formatKSh(result.grossIncome)}
Allowable Deductions:
  - NSSF (Tier I + II):     ${formatKSh(result.nssf)}
  - Pension Deduction:      ${formatKSh(result.pensionDeduction)}
  - Mortgage Interest:      ${formatKSh(result.mortgageDeduction)}
  - Post-Retirement Medical:${formatKSh(result.postRetirementMedicalDeduction)}
  - SHIF:                   ${formatKSh(result.shif)}
  - Affordable Housing Levy:${formatKSh(result.housingLevy)}
----------------------------------------
Taxable Income:             ${formatKSh(result.taxableIncome)}
Gross PAYE (Bands):        ${formatKSh(result.payeeBeforeRelief)}

Tax Reliefs Granted:
  - Personal Relief:        ${formatKSh(result.personalRelief)}
  - Insurance Relief:       ${formatKSh(result.insuranceRelief)}
  - Total Relief:           ${formatKSh(result.totalRelief)}
----------------------------------------
Net PAYE Payable:           ${formatKSh(result.payee)}

Other Statutory Contributions:
  - NSSF (Tier I + II):     ${formatKSh(result.nssf)}
  - SHIF Contribution:      ${formatKSh(result.shif)}
  - Housing Levy (1.5%):    ${formatKSh(result.housingLevy)}
========================================
TOTAL DEDUCTIONS:           ${formatKSh(result.totalDeductions)}
NET TAKE-HOME PAY:          ${formatKSh(result.netPay)}
========================================
Calculation estimate only; verify current KRA rules before filing.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2 text-sm">
          <FileText className="h-4 w-4" />
          Generate Tax Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-emerald-600" />
            Monthly PAYE Calculation
          </DialogTitle>
          <DialogDescription>
            Estimate for planning only; this is not a KRA-issued receipt.
          </DialogDescription>
        </DialogHeader>

        {/* Printable Receipt Content */}
        <div id="tax-receipt-print" className="border rounded-lg p-5 bg-card space-y-4 text-xs font-mono">
          <div className="border-b pb-3 text-center space-y-1">
            <h4 className="font-bold text-sm uppercase tracking-wide text-foreground">Kenya Tax Calculation</h4>
            <p className="text-muted-foreground text-[11px]">PAYE estimate—not a KRA-issued statement</p>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Date: {receiptDate}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-sm">
              <span>Gross Monthly Pay</span>
              <span>{formatKSh(result.grossIncome)}</span>
            </div>
            {result.totalAllowableDeductions > 0 && (
              <div className="text-muted-foreground pl-2 space-y-0.5">
                <div className="flex justify-between">
                  <span>Less Pension</span>
                  <span>−{formatKSh(result.pensionDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less Mortgage Interest</span>
                  <span>−{formatKSh(result.mortgageDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less NSSF</span>
                  <span>−{formatKSh(result.nssf)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less post-retirement medical</span>
                  <span>−{formatKSh(result.postRetirementMedicalDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less SHIF</span>
                  <span>−{formatKSh(result.shif)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less Affordable Housing Levy</span>
                  <span>−{formatKSh(result.housingLevy)}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between border-t pt-1 font-semibold">
              <span>Taxable Income</span>
              <span>{formatKSh(result.taxableIncome)}</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t pt-2">
            <div className="flex justify-between">
              <span>Gross PAYE (Bands)</span>
              <span>{formatKSh(result.payeeBeforeRelief)}</span>
            </div>
            <div className="text-emerald-700 dark:text-emerald-400 pl-2 space-y-0.5">
              <div className="flex justify-between">
                <span>Personal Relief</span>
                <span>−{formatKSh(result.personalRelief)}</span>
              </div>
              {result.insuranceRelief > 0 && (
                <div className="flex justify-between">
                  <span>Insurance Relief</span>
                  <span>−{formatKSh(result.insuranceRelief)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between border-t pt-1 font-bold">
              <span>Net PAYE Tax</span>
              <span>{formatKSh(result.payee)}</span>
            </div>
          </div>

          <div className="space-y-1 border-t pt-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>NSSF Contribution</span>
              <span>{formatKSh(result.nssf)}</span>
            </div>
            <div className="flex justify-between">
              <span>SHIF Contribution (2.75%)</span>
              <span>{formatKSh(result.shif)}</span>
            </div>
            <div className="flex justify-between">
              <span>Affordable Housing Levy (1.5%)</span>
              <span>{formatKSh(result.housingLevy)}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed pt-3 space-y-1 bg-muted/30 p-3 rounded-md">
            <div className="flex justify-between font-bold text-red-700 dark:text-red-400">
              <span>TOTAL DEDUCTIONS</span>
              <span>{formatKSh(result.totalDeductions)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-emerald-700 dark:text-emerald-400">
              <span>NET TAKE-HOME PAY</span>
              <span>{formatKSh(result.netPay)}</span>
            </div>
          </div>

          <div className="text-[10px] text-center text-muted-foreground pt-1 border-t">
            Finance Act 2023 | SHIF Regs 2024 | Affordable Housing Act 2024
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button onClick={handlePrint} variant="outline" className="flex-1 gap-2">
            <Printer className="h-4 w-4" /> Print / Save PDF
          </Button>
          <Button onClick={handleCopy} className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Summary'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
