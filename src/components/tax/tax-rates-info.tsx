'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, ExternalLink, Calendar } from 'lucide-react';

export function TaxRatesInfo() {
  return (
    <div className="space-y-6">
      {/* Source attribution */}
      <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            KRA Tax Rate Reference
          </CardTitle>
          <CardDescription>
            Rates and deductions are summarized from linked KRA guidance and
            legislation. Confirm the rules for the year you are filing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" /> Verify current tax year
            </Badge>
            <Badge variant="outline">Finance Act 2023</Badge>
            <Badge variant="outline">Affordable Housing Act 2024</Badge>
            <Badge variant="outline">SHIF Regulations 2024</Badge>
            <Badge variant="outline">NSSF Act 2022</Badge>
            <Badge variant="outline">VAT Act 2013</Badge>
            <Badge variant="outline">Income Tax Act Cap 470</Badge>
          </div>
          <Separator />
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <a
              href="https://www.kra.go.ke/individual/filing-paying/taxation-base"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              KRA — Taxation Base (PAYE)
            </a>
            <a
              href="https://www.kra.go.ke/business/filing-paying/types-of-taxes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              KRA — Types of Taxes
            </a>
            <a
              href="https://www.kra.go.ke/help/faq/pay-943-pay-as-you-earn-paye"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              KRA — PAYE FAQ (official computation)
            </a>
            <a
              href="https://www.kra.go.ke/news-center/publications"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              KRA — Publications
            </a>
            <a
              href="https://kenyalaw.org/kl/index.php?id=10319"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Kenya Law — Finance Act 2023
            </a>
          </div>
        </CardContent>
      </Card>

      {/* PAYE Bands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            PAYE Monthly Tax Bands (Individuals)
          </CardTitle>
          <CardDescription>
            Per Finance Act 2023 — applied to monthly taxable income.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Monthly Taxable Income (KSh)</TableHead>
                <TableHead className="text-right">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono">0 – 24,000</TableCell>
                <TableCell className="text-right">
                  <Badge>10%</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">24,001 – 32,333</TableCell>
                <TableCell className="text-right">
                  <Badge>25%</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">32,334 – 500,000</TableCell>
                <TableCell className="text-right">
                  <Badge>30%</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">500,001 – 800,000</TableCell>
                <TableCell className="text-right">
                  <Badge>32.5%</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">Above 800,000</TableCell>
                <TableCell className="text-right">
                  <Badge>35%</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <InfoRow
              label="Personal Relief"
              value="KSh 2,400/month (KSh 28,800/yr)"
            />
            <InfoRow
              label="Insurance Relief"
              value="15% of qualifying premiums, max KSh 5,000/mo"
            />
            <InfoRow
              label="Pension — deductible from gross"
              value="Up to KSh 30,000/mo, subject to statutory limits — S.5(6)"
            />
            <InfoRow
              label="Mortgage Interest — deductible from gross"
              value="Up to KSh 30,000/mo on owner-occupied home — S.15(1)(f)"
            />
            <InfoRow
              label="Post-retirement medical fund"
              value="Deductible up to KSh 15,000/month"
            />
          </div>
          <div className="mt-4 rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Important distinction:</strong>{' '}
              Personal and insurance relief are <em>tax credits</em>. Pension,
              qualifying mortgage interest,               SHIF and the Affordable Housing Levy reduce taxable employment
              income before bands are applied.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statutory deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Statutory Deductions (Employee)
          </CardTitle>
          <CardDescription>
            Mandatory contributions deducted from gross salary each month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deduction</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Basis / Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">NSSF Tier I</TableCell>
                <TableCell>
                  <Badge>6%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Of first KSh 9,000 (max KSh 540/mo)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">NSSF Tier II</TableCell>
                <TableCell>
                  <Badge>6%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Of KSh 9,001–108,000 (max KSh 5,940/mo in 2026)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  SHIF <span className="text-xs text-muted-foreground">(replaces NHIF)</span>
                </TableCell>
                <TableCell>
                  <Badge>2.75%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Of gross income, min KSh 300/mo (no cap)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Housing Levy
                </TableCell>
                <TableCell>
                  <Badge>1.5%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Of gross income (employer matches 1.5%)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="mt-3 text-xs text-muted-foreground">
            SHIF (Social Health Insurance Fund) became effective 1 October 2024,
            fully replacing the older NHIF slab-based contributions. The
            Affordable Housing Levy came into effect under the Affordable Housing
            Act 2024.
          </p>
        </CardContent>
      </Card>

      {/* Business taxes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Tax Rates</CardTitle>
          <CardDescription>
            Income tax for companies and small businesses in Kenya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tax Type</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Applies To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Corporate Tax (Resident)
                </TableCell>
                <TableCell>
                  <Badge>30%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Locally incorporated companies on net profit
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Corporate Tax (Non-Resident)
                </TableCell>
                <TableCell>
                  <Badge>37.5%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Foreign companies with Kenya branch/PE
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Turnover Tax (ToT)</TableCell>
                <TableCell>
                  <Badge>1.5%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Qualifying resident businesses above KSh 1M up to KSh 25M;
                  excludes specified income types
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Monthly Rental Income (MRI)
                </TableCell>
                <TableCell>
                  <Badge>7.5%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Gross residential rent KSh 288k – KSh 15M/year (Section 6A ITA)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Branch Remittance Tax
                </TableCell>
                <TableCell>
                  <Badge>15%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  On after-tax profits repatriated by non-resident branches
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Withholding Tax (dividends, resident)
                </TableCell>
                <TableCell>
                  <Badge>5% / 10% / 15%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  5% to resident companies; 10% to resident individuals; 15% to
                  non-residents
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Professional fees (resident)
                </TableCell>
                <TableCell>
                  <Badge>5%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Usually a credit against the resident payee’s annual tax
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Professional fees (non-resident)
                </TableCell>
                <TableCell>
                  <Badge>20%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  May be final tax where the recipient has no Kenyan PE
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">VAT (standard)</TableCell>
                <TableCell>
                  <Badge>16%</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Taxable supplies; mandatory registration above KSh 5M turnover
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filing dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Filing Deadlines</CardTitle>
          <CardDescription>
            Stay compliant — late filings attract penalties and interest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            <DeadlineCard
              tax="PAYE (P9A)"
              deadline="9th of following month"
              detail="Monthly PAYE return + payment via iTax"
            />
            <DeadlineCard
              tax="VAT (VAT 3)"
              deadline="20th of following month"
              detail="Monthly VAT return + remittance"
            />
            <DeadlineCard
              tax="Turnover Tax"
              deadline="20th of following month"
              detail="Monthly ToT return and payment"
            />
            <DeadlineCard
              tax="Withholding Tax (WHT)"
              deadline="Within 5 working days"
              detail="After deduction; payer remits through iTax"
            />
            <DeadlineCard
              tax="Corporate Tax (IT2C Return)"
              deadline="6 months after year-end"
              detail="Annual income tax return for companies"
            />
            <DeadlineCard
              tax="Individual Income Tax"
              deadline="30th June each year"
              detail="Annual KRA return (employment + other income)"
            />
            <DeadlineCard
              tax="Installment Tax (Provisional)"
              deadline="20th of 4th, 6th, 9th, 12th mo"
              detail="Quarterly provisional tax payments"
            />
            <DeadlineCard
              tax="NSSF / SHIF / Housing Levy"
              deadline="9th of following month"
              detail="Employer statutory remittance"
            />
          </div>
          <div className="mt-4 rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 p-3 text-xs space-y-1">
            <p className="font-semibold text-foreground">💡 KRA iTax PRN & eTIMS Compliance:</p>
            <p className="text-muted-foreground">
              All tax payments require generating a <strong>Payment Registration Number (PRN)</strong> via the KRA iTax portal prior to paying via M-Pesa (Paybill 222222) or commercial banks. To claim input VAT or corporate tax expense deductions, all invoices must be verified via <strong>eTIMS</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Installment Tax reference */}
      <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10 dark:border-emerald-900">
        <CardHeader>
          <CardTitle className="text-base">
            Installment Tax — Quarterly Payments During the Year
          </CardTitle>
          <CardDescription>
          Taxpayers may pay income tax in installments during the year, then
            reconcile with the applicable annual return.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <InfoRow
              label="Mandatory threshold"
              value="Estimated annual tax > KSh 40,000"
            />
            <InfoRow
              label="Number of installments"
              value="4 per financial year"
            />
            <InfoRow
              label="Each installment"
              value="25% of estimated annual tax"
            />
            <InfoRow
              label="Safe harbor rule"
              value="110% of prior year's tax shields from interest"
            />
            <InfoRow
              label="Underpayment interest"
              value="1% per month on unpaid portion"
            />
            <InfoRow
              label="Annual reconciliation"
              value="Company IT2C return due within 6 months of year-end"
            />
          </div>
          <div className="rounded-md border border-emerald-200 dark:border-emerald-800 p-3 bg-background">
            <p className="text-sm font-medium mb-2">
              Example: December year-end (FY = Jan → Dec)
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Installment</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1st quarter</TableCell>
                  <TableCell>20 April</TableCell>
                  <TableCell className="text-right font-mono">25%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2nd quarter</TableCell>
                  <TableCell>20 June</TableCell>
                  <TableCell className="text-right font-mono">25%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3rd quarter</TableCell>
                  <TableCell>20 September</TableCell>
                  <TableCell className="text-right font-mono">25%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4th quarter</TableCell>
                  <TableCell>20 December</TableCell>
                  <TableCell className="text-right font-mono">25%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-2">
              For other year-ends (e.g. June), the schedule shifts accordingly —
              use the Installment Tax tab to compute exact dates for your FY.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
        <CardContent className="p-4 text-sm text-amber-900 dark:text-amber-200">
          <p>
            <strong>Disclaimer:</strong> This calculator is provided for
            informational purposes only and does not constitute tax advice. While
            every effort is made to keep rates current, you should always verify
            against the latest KRA publications or consult a licensed Kenyan tax
            practitioner for your specific situation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}

function DeadlineCard({
  tax,
  deadline,
  detail,
}: {
  tax: string;
  deadline: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-sm font-medium">{tax}</p>
        <Badge variant="secondary" className="text-xs">
          {deadline}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
