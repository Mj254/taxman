'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  calculateBusinessTax,
  formatKSh,
  formatNumber,
  formatPercent,
  TURNOVER_TAX_THRESHOLD,
  TURNOVER_TAX_MIN_THRESHOLD,
  type BusinessIncomeCategory,
  type BusinessType,
} from '@/lib/tax-calculations';
import {
  Building2,
  RefreshCw,
  Info,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

const BUSINESS_OPTIONS: {
  value: BusinessType;
  label: string;
  description: string;
  rate: string;
}[] = [
  {
    value: 'resident_company',
    label: 'Resident Company',
    description: 'Locally incorporated company or branch of a resident entity',
    rate: '30% of taxable profit',
  },
  {
    value: 'non_resident_company',
    label: 'Non-Resident Company',
    description: 'Foreign company with a branch or PE in Kenya',
    rate: '37.5% of taxable profit',
  },
  {
    value: 'turnover_tax',
    label: 'Turnover Tax (ToT)',
    description: `Qualifying resident business; turnover above KSh 1M up to KSh 25M`,
    rate: '1.5% of gross turnover',
  },
  {
    value: 'sole_proprietor',
    label: 'Sole Proprietor / Freelancer',
    description: 'Individual reporting business or professional income',
    rate: 'PAYE bands (10%–35%)',
  },
];

interface BusinessInput {
  businessType: BusinessType;
  grossRevenue: number;
  allowableExpenses: number;
  incomeCategory: BusinessIncomeCategory;
  isResident: boolean;
  otherAnnualTaxableIncome: number;
  withholdingTaxCredit: number;
}

const DEFAULT_INPUT: BusinessInput = {
  businessType: 'resident_company',
  grossRevenue: 5_000_000,
  allowableExpenses: 3_000_000,
  incomeCategory: 'ordinary',
  isResident: true,
  otherAnnualTaxableIncome: 0,
  withholdingTaxCredit: 0,
};

export function BusinessTaxCalculator() {
  const [input, setInput] = useState<BusinessInput>(DEFAULT_INPUT);

  const result = useMemo(
    () =>
      calculateBusinessTax({
        businessType: input.businessType,
        grossRevenue: input.grossRevenue,
        allowableExpenses: input.allowableExpenses,
        incomeCategory: input.incomeCategory,
        isResident: input.isResident,
        otherAnnualTaxableIncome: input.otherAnnualTaxableIncome,
        withholdingTaxCredit: input.withholdingTaxCredit,
      }),
    [input]
  );

  const isTurnover = input.businessType === 'turnover_tax';
  const isSoleProp = input.businessType === 'sole_proprietor';
  const turnoverTaxIneligible = isTurnover && result.taxPayable === 0;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* INPUT PANEL */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Business Details
          </CardTitle>
          <CardDescription>
            Enter your annual figures in Kenyan Shillings (KSh).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Business Type</Label>
            <RadioGroup
              value={input.businessType}
              onValueChange={(v) =>
                setInput((prev) => ({ ...prev, businessType: v as BusinessType }))
              }
              className="space-y-2"
            >
              {BUSINESS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`biz-${opt.value}`}
                  className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 dark:has-[:checked]:bg-emerald-950/20"
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`biz-${opt.value}`}
                    className="mt-0.5"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-medium">{opt.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {opt.rate}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="revenue">
              Annual Gross Revenue <span className="text-red-500">*</span>
            </Label>
            <Input
              id="revenue"
              type="number"
              value={input.grossRevenue || ''}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  grossRevenue: Number(e.target.value) || 0,
                }))
              }
              placeholder="e.g. 5000000"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Total sales / turnover for the financial year before any
              deductions.
            </p>
          </div>

          {!isTurnover && (
            <div className="space-y-2">
              <Label htmlFor="expenses">
                Annual Allowable Expenses{' '}
                {isSoleProp && (
                  <span className="text-muted-foreground">(optional)</span>
                )}
              </Label>
              <Input
                id="expenses"
                type="number"
                value={input.allowableExpenses || ''}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    allowableExpenses: Number(e.target.value) || 0,
                  }))
                }
                placeholder="e.g. 3000000"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Expenses allowable under Income Tax Act Cap 470 (rent, salaries,
                utilities, cost of sales, depreciation, etc.).
              </p>
            </div>
          )}

          {isSoleProp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="other-income">
                  Other Annual Taxable Income (optional)
                </Label>
                <Input
                  id="other-income"
                  type="number"
                  min="0"
                  value={input.otherAnnualTaxableIncome || ''}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      otherAnnualTaxableIncome: Number(e.target.value) || 0,
                    }))
                  }
                  placeholder="e.g. salary taxable income"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="withholding-credit">
                  PAYE / Withholding Tax Credits (annual, optional)
                </Label>
                <Input
                  id="withholding-credit"
                  type="number"
                  min="0"
                  value={input.withholdingTaxCredit || ''}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      withholdingTaxCredit: Number(e.target.value) || 0,
                    }))
                  }
                  placeholder="From KRA withholding certificates"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={input.isResident}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      isResident: e.target.checked,
                    }))
                  }
                />
                Kenyan tax resident (eligible for personal relief)
              </label>
            </>
          )}

          {isTurnover && (
            <>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={input.isResident}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      isResident: e.target.checked,
                    }))
                  }
                />
                Kenyan tax resident
              </label>
              <div className="space-y-2">
                <Label htmlFor="income-category">Type of business income</Label>
                <select
                  id="income-category"
                  value={input.incomeCategory}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      incomeCategory: e.target.value as BusinessIncomeCategory,
                    }))
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="ordinary">Ordinary business sales</option>
                  <option value="professional">Professional fees</option>
                  <option value="management">Management fees</option>
                  <option value="training">Training fees</option>
                  <option value="rental">Rental income</option>
                  <option value="final_withholding">Final withholding income</option>
                </select>
              </div>
            </>
          )}

          {turnoverTaxIneligible && (
            <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-xs">
                Turnover Tax does not apply. Eligibility requires a resident
                business with turnover above KSh{' '}
                {formatNumber(TURNOVER_TAX_MIN_THRESHOLD)} and not over KSh{' '}
                {formatNumber(TURNOVER_TAX_THRESHOLD)}, and excludes selected
                income types.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => setInput(DEFAULT_INPUT)}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>

      {/* RESULTS PANEL */}
      <div className="lg:col-span-3 space-y-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Taxable Profit"
            value={formatKSh(result.taxableProfit)}
            sub={
              isTurnover
                ? 'Gross turnover (no expenses allowed)'
                : 'Revenue − Allowable expenses'
            }
            tone="neutral"
          />
          <SummaryCard
            title="Tax Payable to KRA"
            value={formatKSh(result.taxPayable)}
            sub={
              isSoleProp
                ? 'Individual liability after entered credits'
                : `${formatPercent(result.effectiveRate, 2)} of revenue`
            }
            tone="danger"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <SummaryCard
            title="After-Tax Profit"
            value={isSoleProp ? 'Not isolated' : formatKSh(result.afterTaxProfit)}
            sub={
              isSoleProp
                ? 'Tax includes other personal income'
                : 'What your business keeps'
            }
            tone="success"
          />
        </div>

        {/* Computation Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tax Computation</CardTitle>
            <CardDescription>
              Step-by-step calculation based on your inputs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Gross Revenue (annual)
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(result.grossRevenue)}
                  </TableCell>
                </TableRow>
                {!isTurnover && !isSoleProp && (
                  <TableRow>
                    <TableCell className="font-medium">
                      Less: Allowable Expenses
                    </TableCell>
                    <TableCell className="text-right font-mono text-red-700 dark:text-red-400">
                      ({formatNumber(result.allowableExpenses)})
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">
                    Taxable {isTurnover ? 'Turnover' : 'Profit'}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatNumber(result.taxableProfit)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tax Rate</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">
                      {result.taxRate === 0
                        ? 'PAYE bands'
                        : formatPercent(result.taxRate, 1)}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-red-50 dark:bg-red-950/20 border-t-2 border-red-200 dark:border-red-900">
                  <TableCell className="font-bold text-red-700 dark:text-red-400">
                    Tax Payable to KRA
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-red-700 dark:text-red-400">
                    {formatNumber(result.taxPayable)}
                  </TableCell>
                </TableRow>
                {!isTurnover && (
                  <TableRow className="bg-emerald-50 dark:bg-emerald-950/20">
                    <TableCell className="font-semibold text-emerald-700 dark:text-emerald-400">
                      After-Tax Profit (Retained)
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatNumber(result.afterTaxProfit)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Notes / Guidance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-emerald-600" />
              KRA Compliance Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.notes.map((note, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-emerald-600 mt-0.5">▸</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
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
  tone,
  icon,
}: {
  title: string;
  value: string;
  sub?: string;
  tone: 'neutral' | 'danger' | 'success';
  icon?: React.ReactNode;
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
          {icon && <span className={valueTone[tone]}>{icon}</span>}
        </div>
        <p className={`text-lg font-bold ${valueTone[tone]}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}
