// Profit: Ensures margin math stays honest as we evolve pricing tricks.
import { describe, it, expect } from 'vitest';
import { computeMargin, MARGIN_DEFAULTS } from '../ebay-api-fortress/src/lib/margin.js';

describe('computeMargin', () => {
  it('uses default feesPct when none is provided', () => {
    const margin = computeMargin({ price: 10, quantity: 1 });
    const expected = 10 * (1 - MARGIN_DEFAULTS.DEFAULT_FEES_PCT / 100);
    expect(margin).toBeCloseTo(expected, 5);
  });

  it('applies low-value fixed fee when sale total is below threshold', () => {
    const margin = computeMargin({ price: 2, quantity: 3 }); // saleTotal = 6 < 10
    const saleTotal = 2 * 3;
    const base = saleTotal * (1 - MARGIN_DEFAULTS.DEFAULT_FEES_PCT / 100);
    const expected = base - MARGIN_DEFAULTS.LOW_VALUE_FEE;

    expect(margin).toBeCloseTo(expected, 5);
  });

  it('does not apply fixed fee when sale total meets or exceeds threshold', () => {
    const margin = computeMargin({ price: 5, quantity: 2 }); // saleTotal = 10
    const saleTotal = 5 * 2;
    const expected = saleTotal * (1 - MARGIN_DEFAULTS.DEFAULT_FEES_PCT / 100);

    expect(margin).toBeCloseTo(expected, 5);
  });

  it('respects an explicit feesPct override', () => {
    const margin = computeMargin({ price: 100, quantity: 1, feesPct: 20 });
    const expected = 100 * (1 - 0.2); // no fixed fee since saleTotal >= 10

    expect(margin).toBeCloseTo(expected, 5);
  });

  it('throws for invalid numeric inputs', () => {
    expect(() => computeMargin({ price: 'not-a-number', quantity: 1 })).toThrow();
    expect(() => computeMargin({ price: 10, quantity: 0 })).toThrow();
    expect(() => computeMargin({ price: -1, quantity: 1 })).toThrow();
  });
});
