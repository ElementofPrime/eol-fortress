// ebay-api-fortress/src/lib/margin.js
// Profit: Centralized margin calculation so every automation speaks the same money language.

const DEFAULT_FEES_PCT = 13.25; // Sandbox-stable US default; override via env when wiring getEbayEnv.
const LOW_VALUE_THRESHOLD = 10; // USD; below this, eBay low-value fee applies.
const LOW_VALUE_FEE = 0.3; // USD per order when sale total < LOW_VALUE_THRESHOLD.

/**
 * Compute projected margin for a listing batch.
 *
 * Formula:
 *   saleTotal = price * quantity
 *   feesPct   = feesPctOverride ?? DEFAULT_FEES_PCT
 *   fixedFee  = saleTotal < LOW_VALUE_THRESHOLD ? LOW_VALUE_FEE : 0
 *   margin    = saleTotal * (1 - feesPct / 100) - fixedFee
 *
 * NOTE: This function is intentionally pure and does not read env variables.
 * Callers should pass an env-derived feesPct if available; otherwise the
 * DEFAULT_FEES_PCT fallback keeps sandbox runs stable.
 */
export function computeMargin({ price, quantity, feesPct }) {
  const numericPrice = Number(price);
  const numericQuantity = Number(quantity);

  if (!Number.isFinite(numericPrice) || !Number.isFinite(numericQuantity)) {
    throw new Error('Invalid price or quantity: must be finite numbers');
  }

  if (numericPrice < 0 || numericQuantity <= 0) {
    throw new Error('Invalid price or quantity: price must be >= 0 and quantity > 0');
  }

  const saleTotal = numericPrice * numericQuantity;
  const effectiveFeesPct =
    typeof feesPct === 'number' && !Number.isNaN(feesPct) ? feesPct : DEFAULT_FEES_PCT;

  const fixedFee = saleTotal < LOW_VALUE_THRESHOLD ? LOW_VALUE_FEE : 0;

  return saleTotal * (1 - effectiveFeesPct / 100) - fixedFee;
}

export const MARGIN_DEFAULTS = {
  DEFAULT_FEES_PCT,
  LOW_VALUE_THRESHOLD,
  LOW_VALUE_FEE,
};
