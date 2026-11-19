'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalTaxCalculator } from '@/components/tax/personal-tax-calculator';
import { BusinessTaxCalculator } from '@/components/tax/business-tax-calculator';
import { MriCalculator } from '@/components/tax/mri-calculator';
import { VatCalculator } from '@/components/tax/vat-calculator';
import { InstallmentTaxCalculator } from '@/components/tax/installment-tax-calculator';
import { TaxRatesInfo } from '@/components/tax/tax-rates-info';
import {
  User,
  Building2,
  Home as HomeIcon,
  Receipt,
  CalendarClock,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/40 via-background to-background">
      {/* HEADER */}
      <header className="border-b border-emerald-100 dark:border-emerald-950 bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold shadow-md">
                KRA
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Kenya Tax Calculator
                </h1>
                <p className="text-xs text-muted-foreground">
                  Personal, Business & Rental Income Tax — based on KRA rates
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Verify rules for your filing year
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Know exactly what you owe the{' '}
            <span className="text-emerald-700 dark:text-emerald-500">taxman</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto sm:mx-0">
            Estimate personal income tax (PAYE), business income tax, rental
            income tax, and VAT using Kenya Revenue Authority guidance. Confirm
            your eligibility and filing-year rules before filing.
          </p>
        </div>

        {/* TABS */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto">
            <TabsTrigger
              value="personal"
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-2 sm:px-3"
            >
              <User className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Personal Income</span>
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-2 sm:px-3"
            >
              <Building2 className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Business Income</span>
            </TabsTrigger>
            <TabsTrigger
              value="mri"
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-2 sm:px-3"
            >
              <HomeIcon className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Rental (MRI)</span>
            </TabsTrigger>
            <TabsTrigger
              value="installment"
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-2 sm:px-3"
            >
              <CalendarClock className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Installment Tax</span>
            </TabsTrigger>
            <TabsTrigger
              value="vat"
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-2 sm:px-3"
            >
              <Receipt className="h-4 w-4" />
              <span className="text-xs sm:text-sm">VAT</span>
            </TabsTrigger>
            <TabsTrigger
              value="reference"
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-2 sm:px-3"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Tax Reference</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <PersonalTaxCalculator />
          </TabsContent>
          <TabsContent value="business" className="mt-6">
            <BusinessTaxCalculator />
          </TabsContent>
          <TabsContent value="mri" className="mt-6">
            <MriCalculator />
          </TabsContent>
          <TabsContent value="installment" className="mt-6">
            <InstallmentTaxCalculator />
          </TabsContent>
          <TabsContent value="vat" className="mt-6">
            <VatCalculator />
          </TabsContent>
          <TabsContent value="reference" className="mt-6">
            <TaxRatesInfo />
          </TabsContent>
        </Tabs>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-emerald-100 dark:border-emerald-950 mt-auto">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              Rates based on KRA publications — Finance Act 2023, Affordable
              Housing Act 2024, SHIF Regulations 2024.
            </p>
            <p className="text-center sm:text-right">
              For informational purposes only. Not tax advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
