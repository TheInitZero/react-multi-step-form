import { describe, expect, it } from 'vitest';
import { getPriceLabel, type BillingPeriod } from './utils';

describe('getPriceLabel', () => {
  it('formats Monthly amounts with the default "/mo" suffix', () => {
    expect(getPriceLabel({ amount: 15, billingPeriod: 'Monthly' })).toBe('$15/mo');
  });

  it('formats Yearly amounts with the default "/yr" suffix', () => {
    expect(getPriceLabel({ amount: 120, billingPeriod: 'Yearly' })).toBe('$120/yr');
  });

  it('uses the provided suffixes mapping when passed', () => {
    const suffixes: Record<BillingPeriod, string> = { Monthly: 'mth', Yearly: 'year' };

    expect(getPriceLabel({ amount: 15, billingPeriod: 'Monthly', suffixes })).toBe('$15/mth');
    expect(getPriceLabel({ amount: 120, billingPeriod: 'Yearly', suffixes })).toBe('$120/year');
  });

  it('renders amounts as-is without rounding or fixed decimals', () => {
    expect(getPriceLabel({ amount: 9.999, billingPeriod: 'Monthly' })).toBe('$9.999/mo');
  });

  it('allows overriding the currency symbol', () => {
    expect(getPriceLabel({ amount: 15, billingPeriod: 'Monthly', currencySymbol: '€' })).toBe(
      '€15/mo',
    );
  });
});
