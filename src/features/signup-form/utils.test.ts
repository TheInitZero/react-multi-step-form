import { describe, expect, it } from 'vitest';
import { getPriceLabel, calculateTotalPrice, type BillingPeriod } from './utils';

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

describe('calculateTotalPrice', () => {
  it('calculates total with multiple add-ons', () => {
    expect(calculateTotalPrice(10, [5, 3, 2])).toBe(20);
  });

  it('calculates total with one add-on', () => {
    expect(calculateTotalPrice(10, [5])).toBe(15);
  });

  it('calculates total with no add-ons', () => {
    expect(calculateTotalPrice(10, [])).toBe(10);
  });

  it('calculates total with zero subscription price', () => {
    expect(calculateTotalPrice(0, [5, 3])).toBe(8);
  });

  it('handles decimal prices', () => {
    expect(calculateTotalPrice(10.5, [2.25, 1.75])).toBe(14.5);
  });
});
