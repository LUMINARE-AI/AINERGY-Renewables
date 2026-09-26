// Types for the AINERGY Open Access Expert Copilot API.
// Field names match the live contract at camelCase.

export const STATE_VALUES = ["Karnataka", "Maharashtra", "Rajasthan", "Other"] as const;
export type StateName = (typeof STATE_VALUES)[number];

export const CONSUMER_TYPES = ["commercial", "industrial"] as const;
export type ConsumerType = (typeof CONSUMER_TYPES)[number];

export const VOLTAGE_LEVELS = ["11kV", "33kV", "66kV", "132kV"] as const;
export type VoltageLevel = (typeof VOLTAGE_LEVELS)[number];

export const RECOMMENDATION_ROUTES = [
  "rooftop",
  "third_party",
  "rooftop_plus_third_party",
  "captive",
  "group_captive",
] as const;
export type RecommendationRoute = (typeof RECOMMENDATION_ROUTES)[number];

export const LANDED_COST_ROUTES = ["grid", "third_party", "captive", "group_captive"] as const;
export type LandedCostRoute = (typeof LANDED_COST_ROUTES)[number];

export type EnergyProfile = {
  state?: StateName | null;
  consumerType?: ConsumerType | null;
  voltageLevel?: VoltageLevel | null;
  sanctionedLoadKw?: number | null;
  sanctionedLoadKva?: number | null;
  monthlyConsumptionKwh?: number | null;
  monthlyBillRs?: number | null;
  fixedChargesRs?: number | null;
  gridTariffRsPerKwh?: number | null;
  gridTariffInclFixedRsPerKwh?: number | null;
  gridTariffExclFixedRsPerKwh?: number | null;
  utilityOrDiscom?: string | null;
  roofAreaSqM?: number | null;
  rooftopCapacityKw?: number | null;
  targetRenewableSharePct?: number | null;
};

export type FinancialAnalysisAssumptions = {
  annualConsumptionKwh?: number | null;
  sanctionedLoadKw?: number | null;
  powerFactor?: number | null;
  minimumGreenOpenAccessLoadKw?: number | null;
  thirdPartyPpaRateRsPerKwh?: number | null;
  ppaSharePct?: number | null;
  rooftopCapacityKw?: number | null;
  rooftopCapexRsPerKw?: number | null;
  rooftopGenerationKwhPerKwYear?: number | null;
  rooftopLossPct?: number | null;
  rooftopOpexRsPerYear?: number | null;
  captiveCapacityKw?: number | null;
  captiveCapexRsPerKw?: number | null;
  groundMountGenerationKwhPerKwYear?: number | null;
  groupCaptiveCapacityKw?: number | null;
  groupCaptiveCapexRsPerKw?: number | null;
  debtFundedPct?: number | null;
  debtInterestRatePct?: number | null;
  debtTenorYears?: number | null;
  annualEscalationPct?: number | null;
  annualDegradationPct?: number | null;
  projectLifeYears?: number | null;
  discountRatePct?: number | null;
};

export type StateCatalogEntry = {
  state: string;
  minimumGreenOpenAccessLoadKw: number;
  voltageLevelsCovered: string[];
  anyPlaceholder: boolean;
  lastVerified: string;
};

export type BillExtractionResult = {
  profile: EnergyProfile;
  extractedFields: string[];
  missingFields: string[];
  warnings: string[];
  source: string;
  normalizedDocument?: string;
};

export type ExtractBillResponse = {
  extraction: BillExtractionResult;
};

export type NextQuestionResponse = {
  profile: EnergyProfile;
  complete: boolean;
  missingFields: string[];
  nextQuestion: string | null;
  nextField: string | null;
};

export type CostLineItem = {
  label: string;
  valueRsPerKwh: number | null;
  note?: string | null;
};

export type CostRoute = {
  route: string;
  landedCostRsPerKwh: number | null;
  lineItems: CostLineItem[];
  isPlaceholder: boolean;
  notes: string[];
};

export type RouteSavings = {
  vsGridRsPerKwh: number | null;
  vsGridPct: number | null;
};

export type EligibilityCheck = {
  sanctionedLoadKw: number | null;
  thresholdKw: number | null;
  eligible: boolean;
};

export type FinancialScenario = {
  route: string;
  annualEnergyKwh: number | null;
  annualCostRs: number | null;
  annualSavingsRs: number | null;
  investmentRs: number | null;
  paybackYears: number | null;
  npvRs: number | null;
  irrPct: number | null;
  equityInvestmentRs: number | null;
  debtRs: number | null;
  debtServiceRsPerYear: number | null;
  equityIrrPct: number | null;
  cashFlowsRs: number[];
  notes: string[];
};

export type LandedCostResult = {
  state: string;
  consumerType: string;
  voltageLevel: string;
  gridTariffRsPerKwh: number | null;
  eligibility: EligibilityCheck;
  captiveEligibility: EligibilityCheck;
  routes: Partial<Record<LandedCostRoute, CostRoute>> & Record<string, CostRoute | undefined>;
  savings: Record<string, RouteSavings>;
  recommendedRoute: string | null;
  dataQualityWarning: string | null;
  financialAnalysis: Record<string, FinancialScenario> | FinancialScenario[] | null;
};

export type RankedOption = {
  route: RecommendationRoute | string;
  annualSavingsRs: number | null;
  irrPct: number | null;
  equityIrrPct: number | null;
  paybackYears: number | null;
  status: "available" | "ineligible";
  reason: string | null;
};

export type RecommendationsResponse = {
  profile: EnergyProfile;
  comparison: LandedCostResult;
  rankedOptions: RankedOption[];
};

export type LandedCostRequest = {
  state: StateName;
  consumerType: ConsumerType;
  voltageLevel: VoltageLevel;
  gridTariffRsPerKwh?: number | null;
  monthlyBillRs?: number | null;
  monthlyConsumptionKwh?: number | null;
  sanctionedLoadKva?: number | null;
  analysisAssumptions?: FinancialAnalysisAssumptions | null;
};

export type LandedCostResponse = {
  result: LandedCostResult;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type BillContext = {
  state?: string | null;
  consumerType?: string | null;
  voltageLevel?: string | null;
  sanctionedLoadKva?: number | null;
  monthlyConsumptionKwh?: number | null;
  monthlyBillRs?: number | null;
  averageTariffRsPerKwh?: number | null;
  utilityOrDiscom?: string | null;
};

export type AgentChatRequest = {
  messages: ChatMessage[];
  billContext?: BillContext;
  analysisAssumptions?: FinancialAnalysisAssumptions;
};

export type AgentChatResponse = {
  reply: string;
  landedCost: LandedCostResult | null;
  pendingTariffUpdates: unknown[];
};

export type ReportRequest = {
  profile: EnergyProfile;
  analysisAssumptions: FinancialAnalysisAssumptions;
  selectedRoute?: RecommendationRoute | null;
};

export type EnergyReport = {
  reportId: string;
  createdAt: string;
  selectedRoute: string | null;
  assumptions: FinancialAnalysisAssumptions;
  profile: EnergyProfile;
  comparison: LandedCostResult;
  rankedOptions: RankedOption[];
};

export type CopilotErrorBody = {
  error: string;
  message: string;
  issues?: unknown[];
};
