'use client';

import { useState, useMemo } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  calculateInstallmentTax,
  formatKSh,
  formatNumber,
  INSTALLMENT_TAX_THRESHOLD,
  type FinancialYearEndMonth,
} from '@/lib/tax-calculations';
import {
  CalendarClock,
  RefreshCw,
  Info,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const MONTH_OPTIONS: FinancialYearEndMonth[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface InstallmentInput {
  estimatedAnnualTax: number;
  taxCoveredByPAYE: number;
  priorYearTax: number;
  calculationBasis: 'current_year' | 'prior_year';
  isTurnoverTax: boolean;
  yearEndMonth: FinancialYearEndMonth;
  yearEndYear: number;
}

const DEFAULT_INPUT: InstallmentInput = {
  estimatedAnnualTax: 600000,
  taxCoveredByPAYE: 0,
  priorYearTax: 500000,
  calculationBasis: 'current_year',
  isTurnoverTax: false,
  yearEndMonth: "December",
  yearEndYear: 2025,
};

export function InstallmentTaxCalculator() {
  const [input, setInput] = useState<InstallmentInput>(DEFAULT_INPUT);

  const result = useMemo(
    () =>
      calculateInstallmentTax({
        estimatedAnnualTax: input.estimatedAnnualTax,
        taxCoveredByPAYE: input.taxCoveredByPAYE,
        priorYearTax: input.priorYearTax,
        calculationBasis: input.calculationBasis,
        isTurnoverTax: input.isTurnoverTax,
        yearEndMonth: input.yearEndMonth,
        yearEndYear: input.yearEndYear,
      }),
    [input]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* INPUT PANEL */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-emerald-600" />
            Installment Tax Details
          </CardTitle>
          <CardDescription>
            Quarterly provisional tax paid during the financial year.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="est-tax">
              Estimated Annual Tax Before Payments <span className="text-red-500">*</span>
            </Label>
            <Input
              id="est-tax"
              type="number"
              value={input.estimatedAnnualTax || ''}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  estimatedAnnualTax: Number(e.target.value) || 0,
                }))
              }
              placeholder="e.g. 600000"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Use the <strong>Business Income</strong> tab to compute this from
              your projected profit.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paye-covered">Tax Covered by PAYE</Label>
            <Input
              id="paye-covered"
              type="number"
              min="0"
              value={input.taxCoveredByPAYE || ''}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  taxCoveredByPAYE: Number(e.target.value) || 0,
                }))
              }
              placeholder="0"
              className="text-base"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={input.isTurnoverTax}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  isTurnoverTax: e.target.checked,
                }))
              }
            />
            I am subject to Turnover Tax
          </label>

          <div className="space-y-2">
            <Label htmlFor="prior-tax">
              Prior Year Actual Tax{' '}
              <span className="text-muted-foreground">(for safe harbor)</span>
            </Label>
            <Input
              id="prior-tax"
              type="number"
              value={input.priorYearTax || ''}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  priorYearTax: Number(e.target.value) || 0,
                }))
              }
              placeholder="0"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Paying 110% of last year's tax shields you from installment tax
              interest.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Installment Tax Basis</Label>
            <Select
              value={input.calculationBasis}
              onValueChange={(value) =>
                setInput((prev) => ({
                  ...prev,
                  calculationBasis: value as 'current_year' | 'prior_year',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_year">Current-year estimate</SelectItem>
                <SelectItem value="prior_year">110% of prior-year tax</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Financial Year-End</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={input.yearEndMonth}
                onValueChange={(v) =>
                  setInput((prev) => ({
                    ...prev,
                    yearEndMonth: v as FinancialYearEndMonth,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={input.yearEndYear || ''}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    yearEndYear: Number(e.target.value) || 0,
                  }))
                }
                placeholder="2025"
                className="text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              For a Dec 2025 year-end, the FY runs Jan 2025 → Dec 2025.
            </p>
          </div>

          {/* Status banner */}
          <div
            className={`flex items-start gap-2 rounded-md border p-3 ${
              result.isMandatory
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200'
                : 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200'
            }`}
          >
            {result.isMandatory ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            <p className="text-xs">
              {result.isMandatory ? (
                <>
                  Installment Tax is <strong>mandatory</strong> — uncovered tax
                  exceeds KSh {formatNumber(INSTALLMENT_TAX_THRESHOLD)}.
                </>
              ) : (
                <>
                  Installment Tax is <strong>not mandatory</strong> — estimated
                  tax is not above KSh {formatNumber(INSTALLMENT_TAX_THRESHOLD)}
                  , or the Turnover Tax exclusion applies. You still file the
                  required annual return.
                </>
              )}
            </p>
          </div>

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
            title="Uncovered Annual Tax"
            value={formatKSh(Math.max(0, result.estimatedAnnualTax - input.taxCoveredByPAYE))}
            sub="After PAYE credits"
            tone="neutral"
          />
          <SummaryCard
            title="Per-Installment"
            value={formatKSh(result.installmentAmount)}
            sub="Paid quarterly"
            tone="danger"
          />
          <SummaryCard
            title="Total by Year-End"
            value={formatKSh(result.applicableBase)}
            sub={
              result.appliesSafeHarbor
                ? 'Safe harbor applied'
                : 'Based on estimate'
            }
            tone="success"
          />
        </div>

        {/* Safe Harbor Box */}
        {input.priorYearTax > 0 && (
          <Card
            className={`border ${
              result.appliesSafeHarbor
                ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800'
                : 'border-muted bg-muted/30'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className={`h-5 w-5 mt-0.5 ${
                    result.appliesSafeHarbor
                      ? 'text-emerald-600'
                      : 'text-muted-foreground'
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold">
                      Safe Harbor Check (110% Rule)
                    </p>
                    {result.appliesSafeHarbor && (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 text-xs mt-2">
                    <div>
                      <p className="text-muted-foreground">Prior year tax</p>
                      <p className="font-mono font-medium">
                        {formatKSh(result.priorYearTax)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        110% safe harbor
                      </p>
                      <p className="font-mono font-medium">
                        {formatKSh(result.safeHarborAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Installment base</p>
                      <p className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
                        {formatKSh(result.applicableBase)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {result.appliesSafeHarbor
                      ? 'Paying the safe-harbor amount protects you from installment tax interest, even if your actual year-end tax turns out lower than the estimate.'
                      : 'Your estimate already exceeds the safe-harbor floor, so installments are based on the estimate.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Installment Schedule — FY ending {input.yearEndMonth}{' '}
              {input.yearEndYear}
            </CardTitle>
            <CardDescription>
              Four equal payments due on the dates below. Submit via iTax using
              the Installment Tax payment slip.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.isMandatory ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Cumulative Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.schedule.map((entry) => (
                  <TableRow key={entry.installmentNumber}>
                    <TableCell>
                      <Badge variant="outline">
                        Installment {entry.installmentNumber}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.dueDate}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(entry.amount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatNumber(entry.cumulativePaid)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-red-50 dark:bg-red-950/20 border-t-2 border-red-200 dark:border-red-900">
                  <TableCell colSpan={2} className="font-bold text-red-700 dark:text-red-400">
                    Total Paid During FY
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className="text-right font-mono font-bold text-red-700 dark:text-red-400"
                  >
                    {formatKSh(result.applicableBase)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No installment schedule applies to the inputs provided.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Compliance Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-emerald-600" />
              Compliance Notes
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
}: {
  title: string;
  value: string;
  sub?: string;
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
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {title}
        </p>
        <p className={`text-lg font-bold ${valueTone[tone]}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}
