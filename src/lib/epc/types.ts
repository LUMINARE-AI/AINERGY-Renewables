export type ModuleType = "dcr" | "non_dcr";
export type MountingType = "fixed" | "tracker";
export type InverterType = "string" | "central";
export type ProjectScope =
  | "modules_only"
  | "modules_mounting"
  | "modules_mounting_inverter"
  | "bos_excl_evacuation"
  | "full_epc_turnkey";

export type EstimateRequest = {
  capacity_ac_mw: number;
  dc_ac_ratio?: number;
  module_type: ModuleType;
  mounting_type: MountingType;
  inverter_type: InverterType;
  project_scope: ProjectScope;
  state: string;
  evacuation_line_km: number;
  include_land: boolean;
};

export type CostRange = {
  low: number;
  base: number;
  high: number;
};

export type LineItem = {
  key: string;
  label: string;
  rs_per_wp_dc: number;
  amount_inr: number;
};

export type EstimateResponse = {
  inputs: EstimateRequest & Record<string, unknown>;
  resolved_dc_ac_ratio: number;
  capacity_ac_mw: number;
  capacity_dc_mw: number;
  line_items: LineItem[];
  epc_subtotal_ex_gst_inr: CostRange;
  land_cost_inr: number | null;
  total_ex_gst_inr: CostRange;
  blended_gst_rate_pct: number;
  gst_amount_inr: CostRange;
  total_incl_gst_inr: CostRange;
  rs_per_wp_dc: CostRange;
  cr_per_mw_dc: CostRange;
  cr_per_mw_ac: CostRange;
  assumptions: string[];
  disclaimer: string;
};

export type StateOption = {
  value: string;
  label: string;
  logistics_multiplier?: number;
  land_rs_per_acre?: number;
};

export type ScopeOption = {
  value: ProjectScope | string;
  label: string;
  includes?: string[];
};

export type RateCardEntry = {
  key: string;
  label: string;
  rs_per_wp?: number;
  value?: string;
};

export type EpcFormValues = {
  capacity_ac_mw: number;
  dc_ac_ratio: string;
  module_type: ModuleType;
  mounting_type: MountingType;
  inverter_type: InverterType;
  project_scope: ProjectScope;
  state: string;
  evacuation_line_km: number;
  include_land: boolean;
};
