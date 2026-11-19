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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  calculateMriTax,
  formatKSh,
  formatPercent,
  MRI_TAX_RATE,
  type MriPeriod,
  type MriTaxInput,
  type MriTaxResult,
} from '@/lib/tax-calculations';
import {
  Home,
  RefreshCw,
  TrendingDown,
  Wallet,
  Printer,
  FileText,
  Copy,
  Check,
  Info,
  AlertTriangle,
  CalendarCheck,
} from 'lucide-react';

const DEFAULT_INPUT: MriTaxInput = {
  grossRentalIncome: 100000,
  period: 'monthly',
  isResident: true,
  propertyType: 'residential',
  optOutOfMri: false,
  taxpayerType: 'individual',
  annualAllowableExpenses: 0,
  otherAnnualTaxableIncome: 0,
  withholdingTaxCredit: 0,
};

export function MriCalculator() {
  const [input, setInput] = useState<MriTaxInput>(DEFAULT_INPUT);

  const result = useMemo(() => calculateMriTax(input), [input]);

  const reset = () => setInput(DEFAULT_INPUT);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* INPUT PANEL */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-emerald-600" />
            Rental Property Income
          </CardTitle>
          <CardDescription>
            Enter your gross residential rental income in Kenyan Shillings (KSh).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Calculation Period</Label>
            <RadioGroup
              value={input.period}
              onValueChange={(v) =>
                setInput((prev) => ({ ...prev, period: v as MriPeriod }))
              }
              className="grid grid-cols-2 gap-3"
            >
              <label
                htmlFor="period-monthly"
                className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 dark:has-[:checked]:bg-emerald-950/20"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="monthly" id="period-monthly" />
                  <span className="text-sm font-medium">Monthly</span>
                </div>
              </label>
              <label
                htmlFor="period-annual"
                className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 dark:has-[:checked]:bg-emerald-950/20"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="annual" id="period-annual" />
                  <span className="text-sm font-medium">Annual</span>
                </div>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="property-type">Property type</Label>
            <select
              id="property-type"
              value={input.propertyType ?? 'residential'}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  propertyType: e.target.value as 'residential' | 'commercial',
                }))
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={input.isResident ?? true}
              onChange={(e) => {
                const isResident = e.target.checked;
                setInput((prev) => ({
                  ...prev,
                  isResident,
                  taxpayerType:
                    !isResident
                      ? 'nonresident_landlord'
                      : prev.taxpayerType === 'nonresident_landlord'
                        ? 'individual'
                        : prev.taxpayerType,
                }));
              }}
            />
            Kenyan tax resident
          </label>
          {result.isEligible && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={input.optOutOfMri ?? false}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    optOutOfMri: e.target.checked,
                  }))
                }
              />
              Elect to use ordinary rental-income taxation
            </label>
          )}
          {!result.usesMri && (
            <div className="space-y-3 rounded-md border p-3">
              <Label htmlFor="rental-taxpayer">Ordinary-tax taxpayer type</Label>
              <select
                id="rental-taxpayer"
                value={input.taxpayerType ?? 'individual'}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    taxpayerType: e.target.value as
                      | 'individual'
                      | 'company'
                      | 'nonresident_landlord',
                    isResident:
                      e.target.value === 'nonresident_landlord'
                        ? false
                        : prev.isResident,
                  }))
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="individual">Individual</option>
                <option value="company">Resident company</option>
                <option value="nonresident_landlord">Non-resident landlord</option>
              </select>
              <Label htmlFor="rental-expenses">
                Annual allowable rental expenses
              </Label>
              <Input
                id="rental-expenses"
                type="number"
                min="0"
                value={input.annualAllowableExpenses || ''}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    annualAllowableExpenses: Number(e.target.value) || 0,
                  }))
                }
                placeholder="e.g. repairs, agent fees, rates"
              />
              {input.taxpayerType === 'individual' && (
                <>
                  <Label htmlFor="rental-other-income">
                    Other annual taxable income
                  </Label>
                  <Input
                    id="rental-other-income"
                    type="number"
                    min="0"
                    value={input.otherAnnualTaxableIncome || ''}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        otherAnnualTaxableIncome: Number(e.target.value) || 0,
                      }))
                    }
                    placeholder="Optional"
                  />
                </>
              )}
              <Label htmlFor="rental-withholding-credit">
                Annual tax already paid or withheld
              </Label>
              <Input
                id="rental-withholding-credit"
                type="number"
                min="0"
                value={input.withholdingTaxCredit || ''}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    withholdingTaxCredit: Number(e.target.value) || 0,
                  }))
                }
                placeholder="From KRA certificates"
              />
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="grossRent">
              Gross {input.period === 'monthly' ? 'Monthly' : 'Annual'} Rent{' '}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="grossRent"
              type="number"
              value={input.grossRentalIncome || ''}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  grossRentalIncome: Number(e.target.value) || 0,
                }))
              }
              placeholder="e.g. 100000"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Total gross rent collected before agent fees, repairs, or property expenses.
            </p>
          </div>

          <div className="rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-3 space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <p className="font-semibold flex items-center gap-1.5">
              <Info className="h-4 w-4 text-amber-600" />
              Final Tax Rule (Section 6A ITA):
            </p>
            <p>
              MRI is a <strong>final tax</strong>. You cannot deduct maintenance, utility, or agency expenses.
            </p>
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
          <h3 className="text-lg font-semibold tracking-tight">
            {result.usesMri ? 'MRI Tax Breakdown' : 'Ordinary Rental Tax Estimate'}
          </h3>
          <MriReceiptDialog
            result={result}
            annualAllowableExpenses={input.annualAllowableExpenses ?? 0}
          />
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title={`Gross ${result.period === 'monthly' ? 'Monthly' : 'Annual'} Rent`}
            value={formatKSh(result.grossRentalIncome)}
            icon={<Wallet className="h-4 w-4" />}
            tone="neutral"
          />
          <SummaryCard
            title={result.usesMri ? 'MRI Tax Payable (7.5%)' : 'Rental Tax Payable'}
            value={formatKSh(result.taxPayable)}
            sub={result.usesMri ? `${formatPercent(MRI_TAX_RATE)} flat tax` : 'Ordinary income-tax estimate'}
            icon={<TrendingDown className="h-4 w-4" />}
            tone="danger"
          />
          <SummaryCard
            title="Net Rental Income"
            value={formatKSh(result.netRentalIncome)}
            icon={<Wallet className="h-4 w-4" />}
            tone="success"
          />
        </div>

        {/* Status Alerts */}
        {result.isBelowThreshold && (
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Info className="h-4 w-4" />
                Below KSh 288,000/year Threshold
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground pb-3">
              Your annual rent ({formatKSh(result.annualEquivalent)}) is below the KSh 288,000 annual limit (KSh 24,000/month). MRI tax does not apply.
            </CardContent>
          </Card>
        )}

        {!result.isEligible && !result.isBelowThreshold && !result.isAboveThreshold && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
            <CardContent className="text-xs text-muted-foreground py-3">
              MRI is limited to resident landlords with residential rental
              income. The amount below uses the ordinary income-tax estimate.
            </CardContent>
          </Card>
        )}

        {result.isAboveThreshold && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                Exceeds KSh 15 Million/year Threshold
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground pb-3">
              Your annual rent ({formatKSh(result.annualEquivalent)}) exceeds the KSh 15,000,000 ceiling. You must file under standard corporate or individual income tax rates with allowable expenses.
            </CardContent>
          </Card>
        )}

        {/* Breakdown Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>{result.usesMri ? 'MRI Tax Computation' : 'Ordinary Rental Tax Computation'}</span>
              <Badge variant="secondary" className="font-mono">
                {result.usesMri ? 'Finance Act 2023' : 'Estimate'}
              </Badge>
            </CardTitle>
            <CardDescription>
              {result.usesMri
                ? 'Section 6A Income Tax Act — 7.5% on eligible gross residential rent.'
                : 'Ordinary-regime estimate using entered expenses, other income and tax credits.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-1.5 font-semibold">
              <span>Gross Rental Collection ({result.period})</span>
              <span className="font-mono">{formatKSh(result.grossRentalIncome)}</span>
            </div>
            {!result.usesMri && (
              <div className="flex items-center justify-between py-1.5 text-muted-foreground">
                <span>Less: Allowable expenses ({result.period})</span>
                <span className="font-mono">
                  −{formatKSh(
                    input.period === 'monthly'
                      ? (input.annualAllowableExpenses ?? 0) / 12
                      : input.annualAllowableExpenses ?? 0
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-1.5 text-red-700 dark:text-red-400 font-semibold border-t">
              <span>{result.usesMri ? 'Less: MRI (7.5% of gross rent)' : 'Estimated rental income tax'}</span>
              <span className="font-mono">−{formatKSh(result.taxPayable)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-1.5 font-bold text-base text-emerald-700 dark:text-emerald-400">
              <span>Net Take-Home Rental Income</span>
              <span className="font-mono">{formatKSh(result.netRentalIncome)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notes */}
        <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10 dark:border-emerald-900">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-emerald-600" />
              {result.usesMri ? 'KRA iTax MRI Filing & Payment Rules' : 'Filing and estimate notes'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            {result.notes.map((note, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{note}</span>
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
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

function MriReceiptDialog({
  result,
  annualAllowableExpenses,
}: {
  result: MriTaxResult;
  annualAllowableExpenses: number;
}) {
  const [copied, setCopied] = useState(false);

  const receiptDate = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const generateSummaryText = () => {
    return `========================================
KENYA REVENUE AUTHORITY (KRA)
RENTAL INCOME TAX CALCULATION SUMMARY
Date: ${receiptDate}
========================================
Gross Rental Collection:   ${formatKSh(result.grossRentalIncome)} (${result.period})
Allowable Expenses:        ${formatKSh(
      result.usesMri
        ? 0
        : result.period === 'monthly'
          ? annualAllowableExpenses / 12
          : annualAllowableExpenses
    )}
Equivalent Monthly Rent:   ${formatKSh(result.monthlyEquivalent)}
Equivalent Annual Rent:    ${formatKSh(result.annualEquivalent)}
----------------------------------------
Tax regime:                ${result.usesMri ? 'MRI final tax' : 'Ordinary income-tax estimate'}
Rate/effective rate:       ${formatPercent(result.taxRate)}
Estimated tax:             ${formatKSh(result.taxPayable)}
----------------------------------------
NET RENTAL TAKE-HOME:      ${formatKSh(result.netRentalIncome)}
========================================
${result.usesMri ? 'MRI return/payment due by the 20th of the following month via iTax.' : 'Confirm annual filing and payment obligations with KRA.'}`;
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
            Rental Income Tax Calculation
          </DialogTitle>
          <DialogDescription>
          Estimate for planning only; this is not a KRA-issued receipt.
          </DialogDescription>
        </DialogHeader>

        {/* Printable Receipt Content */}
        <div id="mri-receipt-print" className="border rounded-lg p-5 bg-card space-y-4 text-xs font-mono">
          <div className="border-b pb-3 text-center space-y-1">
            <h4 className="font-bold text-sm uppercase tracking-wide text-foreground">Kenya Rental Tax Calculation</h4>
            <p className="text-muted-foreground text-[11px]">Tax calculation summary</p>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Date: {receiptDate}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-sm">
              <span>Gross Rent ({result.period})</span>
              <span>{formatKSh(result.grossRentalIncome)}</span>
            </div>
            <div className="text-muted-foreground text-[11px] flex justify-between">
              <span>Annual Equivalent</span>
              <span>{formatKSh(result.annualEquivalent)}</span>
            </div>
            {!result.usesMri && (
              <div className="text-muted-foreground text-[11px] flex justify-between">
                <span>Allowable Expenses</span>
                <span>
                  {formatKSh(
                    result.period === 'monthly'
                      ? annualAllowableExpenses / 12
                      : annualAllowableExpenses
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 border-t pt-2">
            <div className="flex justify-between font-bold text-red-700 dark:text-red-400">
              <span>{result.usesMri ? 'MRI tax payable (7.5%)' : 'Estimated tax payable'}</span>
              <span>−{formatKSh(result.taxPayable)}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed pt-3 space-y-1 bg-muted/30 p-3 rounded-md">
            <div className="flex justify-between font-bold text-sm text-emerald-700 dark:text-emerald-400">
              <span>NET TAKE-HOME RENT</span>
              <span>{formatKSh(result.netRentalIncome)}</span>
            </div>
          </div>

          <div className="text-[10px] text-center text-muted-foreground pt-1 border-t">
            {result.usesMri
              ? 'MRI filing/payment generally due by the 20th of the following month.'
              : 'Ordinary regime: confirm annual filing/payment dates.'}
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
