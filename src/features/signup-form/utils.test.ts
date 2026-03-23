import { describe, expect, it } from 'vitest';
import { getPriceLabel, type BillingPeriod } from './utils';

describe('getPriceLabel', () => {
  it('formats Monthly amounts with the default "/mo" suffix', () => {
    expect(getPriceLabel({ amount: 15, billingPeriod: 'Monthly' })).toBe('$15.00/mo');
  });

  it('formats Yearly amounts with the default "/yr" suffix', () => {
    expect(getPriceLabel({ amount: 120, billingPeriod: 'Yearly' })).toBe('$120.00/yr');
  });

  it('uses the provided suffixes mapping when passed', () => {
    const suffixes: Record<BillingPeriod, string> = { Monthly: 'mth', Yearly: 'year' };

    expect(getPriceLabel({ amount: 15, billingPeriod: 'Monthly', suffixes })).toBe('$15.00/mth');
    expect(getPriceLabel({ amount: 120, billingPeriod: 'Yearly', suffixes })).toBe('$120.00/year');
  });

  it('rounds amounts to 2 decimal places', () => {
    expect(getPriceLabel({ amount: 9.999, billingPeriod: 'Monthly' })).toBe('$10.00/mo');
  });

  it('allows overriding the currency symbol', () => {
    expect(getPriceLabel({ amount: 15, billingPeriod: 'Monthly', currencySymbol: '€' })).toBe(
      '€15.00/mo',
    );
  });
});
