export const COPILOT_CAPABILITIES = [
  "Reads bill data using AI",
  "Identifies tariff and consumption information",
  "Estimates current effective energy cost",
  "Evaluates Open Access",
  "Evaluates Captive",
  "Evaluates Group Captive",
  "Calculates indicative landed cost",
  "Compares scenarios",
  "Highlights potential savings",
  "Explains key assumptions",
  "Recommends the next assessment step",
] as const;

export const COMPARISON_SCENARIOS = [
  { id: "grid", label: "Current Grid Cost", short: "Grid" },
  { id: "oa", label: "Third-Party OA Landed Cost", short: "OA" },
  { id: "group-captive", label: "Group Captive", short: "Group" },
  { id: "captive", label: "Captive", short: "Captive" },
  { id: "hybrid", label: "Hybrid + BESS", short: "Hybrid" },
] as const;

export const AI_INSIGHT_TEXT =
  "Under the assumptions used, your estimated OA landed cost is below your current effective cost. The result is most sensitive to wheeling, banking, surcharge, losses and project location.";

export const AI_INSIGHT_HIGHLIGHTS = [
  "wheeling",
  "banking",
  "surcharge",
  "losses",
  "project location",
];

export const COPILOT_DISCLAIMER =
  "The Copilot is an initial analytical tool, not a binding tariff quote, financial guarantee, legal opinion or final OA/captive eligibility determination.";

export const WATTPE_TEASER_TAGS = [
  "Apartment residents",
  "Renters",
  "Small businesses",
  "Community Solar",
  "Participation",
  "AINERGY Credits",
  "Eligible energy uses",
] as const;

export const MOCK_EXTRACTED_FIELDS = [
  { label: "State", value: "Extracted" },
  { label: "Consumer type", value: "HT / C&I" },
  { label: "Sanctioned load", value: "From bill" },
  { label: "Monthly consumption", value: "From bill" },
  { label: "Effective tariff", value: "Calculated" },
] as const;
