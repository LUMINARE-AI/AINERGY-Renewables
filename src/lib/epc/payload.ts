import { TURNKEY_SCOPE } from "./defaults";
import type { EpcFormValues, EstimateRequest } from "./types";

export function isTurnkeyScope(scope: string): boolean {
  return scope === TURNKEY_SCOPE;
}

export function buildEstimatePayload(form: EpcFormValues): EstimateRequest {
  const turnkey = isTurnkeyScope(form.project_scope);
  const body: EstimateRequest = {
    capacity_ac_mw: form.capacity_ac_mw,
    module_type: form.module_type,
    mounting_type: form.mounting_type,
    inverter_type: form.inverter_type,
    project_scope: form.project_scope,
    state: form.state,
    evacuation_line_km: turnkey ? form.evacuation_line_km : 0,
    include_land: turnkey ? form.include_land : false,
  };

  const raw = form.dc_ac_ratio.trim();
  if (raw !== "") {
    const ratio = Number(raw);
    if (Number.isFinite(ratio)) {
      body.dc_ac_ratio = ratio;
    }
  }

  return body;
}

export function validateEpcForm(form: EpcFormValues): string | null {
  if (!Number.isFinite(form.capacity_ac_mw) || form.capacity_ac_mw <= 0) {
    return "Plant AC capacity must be greater than 0 MW.";
  }
  if (form.capacity_ac_mw > 500) {
    return "Plant AC capacity cannot exceed 500 MW.";
  }

  if (isTurnkeyScope(form.project_scope)) {
    if (
      !Number.isFinite(form.evacuation_line_km) ||
      form.evacuation_line_km < 0 ||
      form.evacuation_line_km > 200
    ) {
      return "Evacuation line must be between 0 and 200 km.";
    }
  }

  const raw = form.dc_ac_ratio.trim();
  if (raw !== "") {
    const ratio = Number(raw);
    if (!Number.isFinite(ratio) || ratio < 1.01 || ratio > 1.99) {
      return "DC:AC ratio must be blank, or between 1.01 and 1.99.";
    }
  }

  return null;
}
