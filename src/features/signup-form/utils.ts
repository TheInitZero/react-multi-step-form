export type BillingPeriod = 'Monthly' | 'Yearly';

const priceLabelSuffixes: Record<BillingPeriod, string> = {
  Monthly: 'mo',
  Yearly: 'yr',
};

export function getPriceLabel({
  amount,
  billingPeriod,
  suffixes = priceLabelSuffixes,
  currencySymbol = '$',
}: {
  amount: number;
  billingPeriod: BillingPeriod;
  suffixes?: Record<BillingPeriod, string>;
  currencySymbol?: string;
}): string {
  const suffix = suffixes[billingPeriod];
  return `${currencySymbol}${amount}/${suffix}`;
}
