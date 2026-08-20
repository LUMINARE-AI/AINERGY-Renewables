// Gujarat is not yet in the verified TARIFF_TABLE in tariffData.ts. Per the
// spec's testing requirements, it's kept as an explicitly placeholder-flagged
// fixture (used by the Prisma seed and by tests) rather than silently
// skipped or added to the verified table without a primary source.

import type { ConsumerType } from "./tariffData";

export const GUJARAT_PLACEHOLDER_TARIFF: Record<ConsumerType, number> = {
  commercial: 8.2,
  industrial: 7.2,
};
export const GUJARAT_PLACEHOLDER_CSS = 1.2;
export const GUJARAT_PLACEHOLDER_THRESHOLD_KVA = 1000;
export const GUJARAT_PLACEHOLDER_SOURCE = "Illustrative — verify before commercial use.";

// Additional open-access charge placeholders — same "not individually
// researched yet" caveat as the tariff/CSS figures above.
export const GUJARAT_PLACEHOLDER_ASC = 0.3;
export const GUJARAT_PLACEHOLDER_BANKING_PCT = 5;
export const GUJARAT_PLACEHOLDER_GENERATION_YIELD = { rooftop: 4.7, ground: 4.9 };
export const GUJARAT_PLACEHOLDER_GENERATION_COST = { thirdPartyPpa: 3.0, captiveLcoe: 2.6 };
