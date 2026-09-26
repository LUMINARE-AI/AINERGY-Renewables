"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CopilotApiError,
  createReport,
  getHealth,
  getRecommendations,
  getStates,
} from "@/lib/api/copilotClient";
import { compactProfile } from "@/lib/copilot/profile";
import {
  RECOMMENDATION_ROUTES,
  type EnergyProfile,
  type RecommendationRoute,
  type RecommendationsResponse,
  type StateCatalogEntry,
} from "@/lib/copilot/types";
import { CopilotWakeBanner, ErrorNote } from "./copilot/ApiState";
import { BillUploadStep } from "./copilot/BillUploadStep";
import { ChatPanel } from "./copilot/ChatPanel";
import { ProfileFollowUp } from "./copilot/ProfileFollowUp";
import { RecommendationsPanel } from "./copilot/RecommendationsPanel";

const ROUTE_SET = new Set<string>(RECOMMENDATION_ROUTES);

function asRecommendationRoute(route: string | null | undefined): RecommendationRoute | undefined {
  if (route && ROUTE_SET.has(route)) return route as RecommendationRoute;
  return undefined;
}

export function EnergyPlanner() {
  const router = useRouter();
  const [states, setStates] = useState<StateCatalogEntry[]>([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [statesError, setStatesError] = useState<string | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [stage, setStage] = useState<"upload" | "questions" | "results">("upload");
  const [reviewing, setReviewing] = useState(false);
  const [session, setSession] = useState(0);
  const [profile, setProfile] = useState<EnergyProfile>({});
  const [recs, setRecs] = useState<RecommendationsResponse | null>(null);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const loadStates = useCallback(async () => {
    setStatesLoading(true);
    setStatesError(null);
    try {
      const catalog = await getStates();
      setStates(catalog);
      if (catalog.length === 0) setStatesError("No supported states came back.");
    } catch (err) {
      setStatesError(err instanceof CopilotApiError ? err.message : "Could not load states.");
    } finally {
      setStatesLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    setHealthError(null);
    try {
      const health = await getHealth();
      if (!health.ok) setHealthError("The copilot is not ready.");
    } catch (err) {
      setHealthError(err instanceof CopilotApiError ? err.message : "Could not reach the copilot.");
    }
  }, []);

  useEffect(() => {
    void loadStates();
    void checkHealth();
  }, [loadStates, checkHealth]);

  const loadRecommendations = useCallback(async (next: EnergyProfile) => {
    setRecsLoading(true);
    setRecsError(null);
    try {
      const data = await getRecommendations(compactProfile(next), {});
      setRecs(data);
      const ranked = data.rankedOptions.find((option) => asRecommendationRoute(option.route) && option.status === "available")
        ?? data.rankedOptions.find((option) => asRecommendationRoute(option.route));
      setSelectedRoute(asRecommendationRoute(data.comparison.recommendedRoute) ?? ranked?.route ?? null);
    } catch (err) {
      setRecs(null);
      setRecsError(err instanceof CopilotApiError ? err.message : "Could not build the comparison.");
    } finally {
      setRecsLoading(false);
    }
  }, []);

  const finishProfile = useCallback((next: EnergyProfile) => {
    const cleaned = compactProfile(next);
    setProfile(cleaned);
    setReviewing(false);
    setStage("results");
    void loadRecommendations(cleaned);
  }, [loadRecommendations]);

  function begin(next: EnergyProfile) {
    setProfile(compactProfile(next));
    setReviewing(false);
    setRecs(null);
    setRecsError(null);
    setReportError(null);
    setSession((value) => value + 1);
    setStage("questions");
  }

  async function generateReport() {
    setReportLoading(true);
    setReportError(null);
    try {
      const report = await createReport({
        profile,
        analysisAssumptions: {},
        selectedRoute: asRecommendationRoute(selectedRoute),
      });
      router.push(`/reports/${report.reportId}`);
    } catch (err) {
      setReportError(err instanceof CopilotApiError ? err.message : "Could not generate the report.");
      setReportLoading(false);
    }
  }

  return (
    <div className={stage === "upload" ? "mx-auto max-w-5xl" : "mx-auto max-w-6xl"}>
      <CopilotWakeBanner />
      {healthError && (
        <div className="mb-4">
          <ErrorNote message={healthError} onRetry={() => void checkHealth()} />
        </div>
      )}

      {stage === "upload" ? (
        <BillUploadStep
          states={states}
          statesLoading={statesLoading}
          statesError={statesError}
          onRetryStates={() => void loadStates()}
          onConfirm={(next) => begin(next)}
          onSkip={() => begin({})}
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {stage === "questions" ? (
            <ProfileFollowUp
              key={session}
              initialProfile={profile}
              states={states}
              reviewing={reviewing}
              onComplete={finishProfile}
            />
          ) : (
            <RecommendationsPanel
              profile={profile}
              result={recs}
              loading={recsLoading}
              error={recsError}
              onRetry={() => void loadRecommendations(profile)}
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
              onGenerateReport={() => void generateReport()}
              reportLoading={reportLoading}
              reportError={reportError}
              onEdit={() => {
                setReviewing(true);
                setSession((value) => value + 1);
                setStage("questions");
              }}
              onStartOver={() => {
                setStage("upload");
                setProfile({});
                setRecs(null);
                setReviewing(false);
              }}
            />
          )}
          <ChatPanel profile={profile} />
        </div>
      )}
    </div>
  );
}
