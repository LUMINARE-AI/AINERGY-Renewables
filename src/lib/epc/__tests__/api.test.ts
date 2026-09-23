import { describe, expect, it } from "vitest";
import { normalizeApiBaseUrl } from "../api";

describe("normalizeApiBaseUrl", () => {
  it("strips quotes that were stored as part of the env value", () => {
    expect(
      normalizeApiBaseUrl('"https://ainergy-renewables-backend-1.onrender.com"')
    ).toBe("https://ainergy-renewables-backend-1.onrender.com");
  });

  it("keeps an already clean host and drops a trailing slash", () => {
    expect(
      normalizeApiBaseUrl("https://ainergy-renewables-backend-1.onrender.com/")
    ).toBe("https://ainergy-renewables-backend-1.onrender.com");
  });

  it("returns null when the value is empty", () => {
    expect(normalizeApiBaseUrl("  ")).toBeNull();
    expect(normalizeApiBaseUrl(undefined)).toBeNull();
  });
});
