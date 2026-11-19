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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  calculateVAT,
  formatKSh,
  formatPercent,
  VAT_STANDARD_RATE,
  type VatType,
} from '@/lib/tax-calculations';
import { Receipt, RefreshCw, Info } from 'lucide-react';

interface VatInput {
  amount: number;
  type: VatType;
}

const DEFAULT_INPUT: VatInput = {
  amount: 100000,
  type: 'add_vat',
};

export function VatCalculator() {
  const [input, setInput] = useState<VatInput>(DEFAULT_INPUT);

  const result = useMemo(
    () => calculateVAT({ amount: input.amount, type: input.type }),
    [input]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* INPUT PANEL */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600" />
            VAT Calculation
          </CardTitle>
          <CardDescription>
            Add or remove VAT at the standard Kenya rate of 16%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Calculation Type</Label>
            <RadioGroup
              value={input.type}
              onValueChange={(v) =>
                setInput((prev) => ({ ...prev, type: v as VatType }))
              }
              className="grid grid-cols-1 gap-2"
            >
              <label
                htmlFor="add-vat"
                className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 dark:has-[:checked]:bg-emerald-950/20"
              >
                <RadioGroupItem value="add_vat" id="add-vat" className="mt-0.5" />
                <div className="space-y-1">
                  <span className="text-sm font-medium">Add VAT to amount</span>
                  <p className="text-xs text-muted-foreground">
                    You have a net (VAT-exclusive) amount and want to compute the
                    VAT-inclusive total.
                  </p>
                </div>
              </label>
              <label
                htmlFor="remove-vat"
                className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 dark:has-[:checked]:bg-emerald-950/20"
              >
                <RadioGroupItem
                  value="remove_vat"
                  id="remove-vat"
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <span className="text-sm font-medium">
                    Remove VAT from amount
                  </span>
                  <p className="text-xs text-muted-foreground">
                    You have a VAT-inclusive total and want to extract the net
                    amount and the VAT portion.
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="vat-amount">
              {input.type === 'add_vat' ? 'Net Amount' : 'Gross Amount'}{' '}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="vat-amount"
              type="number"
              value={input.amount || ''}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  amount: Number(e.target.value) || 0,
                }))
              }
              placeholder="e.g. 100000"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              {input.type === 'add_vat'
                ? 'Amount before VAT is applied.'
                : 'Total amount that already includes VAT.'}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">VAT Rate</p>
              <p className="text-xs text-muted-foreground">
                Standard rate per VAT Act 2013
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {formatPercent(VAT_STANDARD_RATE, 0)}
            </Badge>
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
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Net Amount"
            value={formatKSh(result.baseAmount)}
            tone="neutral"
          />
          <SummaryCard
            title="VAT @ 16%"
            value={formatKSh(result.vatAmount)}
            tone="danger"
          />
          <SummaryCard
            title="Gross Total"
            value={formatKSh(result.grossAmount)}
            tone="success"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Computation</CardTitle>
            <CardDescription>
              {input.type === 'add_vat'
                ? `${formatKSh(result.baseAmount)} × 16% = ${formatKSh(result.vatAmount)} VAT`
                : `${formatKSh(result.grossAmount)} ÷ 1.16 = ${formatKSh(result.baseAmount)} net`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row
              label="Net Amount (VAT-exclusive)"
              value={formatKSh(result.baseAmount)}
            />
            <Row
              label="VAT Charged (16%)"
              value={formatKSh(result.vatAmount)}
              tone="danger"
            />
            <Separator />
            <Row
              label="Gross Amount (VAT-inclusive)"
              value={formatKSh(result.grossAmount)}
              tone="success"
              isBold
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-emerald-600" />
              VAT Compliance Notes
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
  tone,
}: {
  title: string;
  value: string;
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
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  tone,
  isBold,
}: {
  label: string;
  value: string;
  tone?: 'danger' | 'success';
  isBold?: boolean;
}) {
  const toneClass =
    tone === 'danger'
      ? 'text-red-700 dark:text-red-400'
      : tone === 'success'
        ? 'text-emerald-700 dark:text-emerald-400'
        : '';
  return (
    <div
      className={`flex items-center justify-between py-1 ${
        isBold ? 'text-base font-bold' : ''
      }`}
    >
      <span>{label}</span>
      <span className={`font-mono ${toneClass} ${isBold ? 'font-bold' : ''}`}>
        {value}
      </span>
    </div>
  );
}
