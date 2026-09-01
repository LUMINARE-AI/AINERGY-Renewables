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
