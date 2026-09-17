import { describe, expect, it } from "vitest";
import { DEFAULT_FORM } from "../defaults";
import { buildEstimatePayload, validateEpcForm } from "../payload";
import { parseFastApiDetail } from "../api";

describe("buildEstimatePayload", () => {
  it("omits dc_ac_ratio when blank so the backend can apply defaults", () => {
    const payload = buildEstimatePayload({ ...DEFAULT_FORM, dc_ac_ratio: "  " });
    expect(payload.dc_ac_ratio).toBeUndefined();
    expect("dc_ac_ratio" in payload).toBe(false);
  });

  it("includes dc_ac_ratio when provided", () => {
    const payload = buildEstimatePayload({ ...DEFAULT_FORM, dc_ac_ratio: "1.32" });
    expect(payload.dc_ac_ratio).toBe(1.32);
  });

  it("zeros evacuation and land when scope is not turnkey", () => {
    const payload = buildEstimatePayload({
      ...DEFAULT_FORM,
      project_scope: "modules_only",
      evacuation_line_km: 12,
      include_land: true,
    });
    expect(payload.evacuation_line_km).toBe(0);
    expect(payload.include_land).toBe(false);
  });

  it("keeps evacuation and land for full turnkey", () => {
    const payload = buildEstimatePayload({
      ...DEFAULT_FORM,
      evacuation_line_km: 5,
      include_land: true,
    });
    expect(payload.evacuation_line_km).toBe(5);
    expect(payload.include_land).toBe(true);
  });

  it("sends snake_case keys expected by the API", () => {
    const payload = buildEstimatePayload(DEFAULT_FORM);
    expect(Object.keys(payload).sort()).toEqual(
      [
        "capacity_ac_mw",
        "evacuation_line_km",
        "include_land",
        "inverter_type",
        "module_type",
        "mounting_type",
        "project_scope",
        "state",
      ].sort()
    );
  });
});

describe("validateEpcForm", () => {
  it("accepts the default 15 MW turnkey form", () => {
    expect(validateEpcForm(DEFAULT_FORM)).toBeNull();
  });

  it("rejects capacity above 500", () => {
    expect(validateEpcForm({ ...DEFAULT_FORM, capacity_ac_mw: 501 })).toMatch(
      /500/
    );
  });

  it("rejects a DC:AC ratio of 1.0", () => {
    expect(validateEpcForm({ ...DEFAULT_FORM, dc_ac_ratio: "1.0" })).toMatch(
      /1\.01/
    );
  });

  it("rejects evacuation km above 200", () => {
    expect(
      validateEpcForm({ ...DEFAULT_FORM, evacuation_line_km: 201 })
    ).toMatch(/200/);
  });
});

describe("parseFastApiDetail", () => {
  it("reads a string detail", () => {
    expect(parseFastApiDetail({ detail: "capacity too high" })).toBe(
      "capacity too high"
    );
  });

  it("joins validation error arrays", () => {
    expect(
      parseFastApiDetail({
        detail: [
          { loc: ["body", "capacity_ac_mw"], msg: "Input should be less than or equal to 500" },
        ],
      })
    ).toBe("capacity_ac_mw: Input should be less than or equal to 500");
  });
});
