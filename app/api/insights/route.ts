import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data: audits, error: auditError } = await supabaseServer
      .from("audits")
      .select("id, score, status, findings, created_at");

    if (auditError) throw auditError;

    const { data: feedback, error: feedbackError } = await supabaseServer
      .from("rule_feedback")
      .select("*");

    if (feedbackError) throw feedbackError;

    const auditRecords = audits || [];
    const feedbackRecords = feedback || [];

    const passedAudits = auditRecords.filter(
      (audit: any) => audit.status === "passed"
    ).length;

    const initialPassRate = auditRecords.length > 0
      ? Math.round((passedAudits / auditRecords.length) * 100)
      : 0;

    const totalOverrides = feedbackRecords.filter(
      (item: any) => item.action_type === "overridden"
    ).length;

    const totalDismissals = feedbackRecords.filter(
      (item: any) => item.action_type === "dismissed"
    ).length;

    const ruleStats: Record<string, {
      triggers: number;
      overrides: number;
      dismissals: number;
      reasons: string[];
    }> = {};

    auditRecords.forEach((audit: any) => {
      (audit.findings || []).forEach((finding: any) => {
        const ruleId = finding.rule_id || finding.ruleId || "UNKNOWN_RULE";

        if (!ruleStats[ruleId]) {
          ruleStats[ruleId] = {
            triggers: 0,
            overrides: 0,
            dismissals: 0,
            reasons: [],
          };
        }

        ruleStats[ruleId].triggers++;
      });
    });

    feedbackRecords.forEach((item: any) => {
      const ruleId = item.rule_id || "UNKNOWN_RULE";

      if (!ruleStats[ruleId]) {
        ruleStats[ruleId] = {
          triggers: 0,
          overrides: 0,
          dismissals: 0,
          reasons: [],
        };
      }

      if (item.action_type === "overridden") {
        ruleStats[ruleId].overrides++;
      }

      if (item.action_type === "dismissed") {
        ruleStats[ruleId].dismissals++;
      }

      if (item.reason) {
        ruleStats[ruleId].reasons.push(item.reason);
      }
    });

    const rules = Object.entries(ruleStats)
      .map(([ruleId, stats]) => ({
        ruleId,
        triggers: stats.triggers,
        overrides: stats.overrides,
        dismissals: stats.dismissals,
        feedbackCount: stats.overrides + stats.dismissals,
        reasons: stats.reasons,
        overrideRate: stats.triggers > 0
          ? Math.round((stats.overrides / stats.triggers) * 100)
          : 0,
      }))
      .sort((a, b) => b.feedbackCount - a.feedbackCount);

    return NextResponse.json({
      success: true,
      totalAudits: auditRecords.length,
      initialPassRate,
      totalOverrides,
      totalDismissals,
      rulesRequiringClarification: rules.filter(
        (rule) => rule.feedbackCount > 0
      ).length,
      rules,
      trends: (() => {
        const days = Array.from({ length: 7 }, (_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - index));
          return date.toISOString().slice(0, 10);
        });

        return days.map((day) => {
          const dayAudits = auditRecords.filter(
            (audit: any) =>
              audit.created_at &&
              new Date(audit.created_at).toISOString().slice(0, 10) === day
          );

          const dayFeedback = feedbackRecords.filter(
            (item: any) =>
              item.created_at &&
              new Date(item.created_at).toISOString().slice(0, 10) === day
          );

          const scores = dayAudits
            .map((audit: any) => Number(audit.score))
            .filter((score: number) => Number.isFinite(score));

          return {
            date: day,
            audits: dayAudits.length,
            averageScore: scores.length
              ? Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length)
              : 0,
            overrides: dayFeedback.filter(
              (item: any) => item.action_type === "overridden"
            ).length,
            dismissals: dayFeedback.filter(
              (item: any) => item.action_type === "dismissed"
            ).length,
          };
        });
      })(),
      message: "Guideline-gap insights generated successfully.",
    });
  } catch (error) {
    console.error("Insights API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate insights.",
      },
      { status: 500 }
    );
  }
}

