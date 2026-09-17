import type {
  InverterType,
  ModuleType,
  MountingType,
  ProjectScope,
  ScopeOption,
  StateOption,
} from "./types";

export const FALLBACK_STATES: StateOption[] = [
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "karnataka", label: "Karnataka" },
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "telangana", label: "Telangana" },
  { value: "gujarat", label: "Gujarat" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "other", label: "Other" },
];

export const FALLBACK_SCOPES: ScopeOption[] = [
  { value: "modules_only", label: "PV modules only" },
  { value: "modules_mounting", label: "Modules + mounting structure" },
  {
    value: "modules_mounting_inverter",
    label: "Modules, mounting and inverters",
  },
  {
    value: "bos_excl_evacuation",
    label: "Full BOS excluding evacuation",
  },
  {
    value: "full_epc_turnkey",
    label: "Full EPC turnkey (incl. evacuation; land optional)",
  },
];

export const MODULE_OPTIONS: { value: ModuleType; label: string; hint: string }[] =
  [
    {
      value: "dcr",
      label: "DCR / ALMM Indian cells",
      hint: "Domestic Content Requirement — typically required for govt/PSU tenders. More expensive.",
    },
    {
      value: "non_dcr",
      label: "Non-DCR",
      hint: "Imported or non-DCR modules. Usually cheaper.",
    },
  ];

export const MOUNTING_OPTIONS: { value: MountingType; label: string; hint: string }[] =
  [
    { value: "fixed", label: "Fixed-tilt", hint: "Standard fixed-tilt mounting." },
    {
      value: "tracker",
      label: "Single-axis tracker",
      hint: "Costs more and uses more land.",
    },
  ];

export const INVERTER_OPTIONS: { value: InverterType; label: string }[] = [
  { value: "string", label: "String" },
  { value: "central", label: "Central" },
];

export const DEFAULT_FORM = {
  capacity_ac_mw: 15,
  dc_ac_ratio: "",
  module_type: "dcr" as ModuleType,
  mounting_type: "fixed" as MountingType,
  inverter_type: "string" as InverterType,
  project_scope: "full_epc_turnkey" as ProjectScope,
  state: "tamil_nadu",
  evacuation_line_km: 5,
  include_land: false,
};

export const TURNKEY_SCOPE: ProjectScope = "full_epc_turnkey";
