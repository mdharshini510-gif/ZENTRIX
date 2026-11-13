"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

interface RuleInsight {
  ruleId: string;
  triggers: number;
  overrides: number;
  dismissals: number;
  feedbackCount: number;
  reasons: string[];
  overrideRate: number;
}

interface DashboardData {
  totalAudits: number;
  initialPassRate: number;
  totalOverrides: number;
  totalDismissals: number;
  rulesRequiringClarification: number;
  rules: RuleInsight[];
  trends: {
    date: string;
    audits: number;
    averageScore: number;
    overrides: number;
    dismissals: number;
  }[];
}

const recommendations: Record<string, string> = {
  "RULE-CONTRAST-04":
    "Review contrast requirements and consider providing approved background and typography alternatives.",
  "RULE-CLAIM-12":
    "Clarify the difference between regional, national and global marketing claims.",
  "RULE-FONT-01":
    "Consider reviewing the approved display typography options for campaign designs.",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const response = await fetch("/api/insights");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load dashboard data.");
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  const gapMetrics = (data?.rules || []).slice(0, 5);

  return (
    <div className="app-page space-y-7">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-violet-400 mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          Governance intelligence
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Guideline Gap Analytics
        </h1>
        <p className="text-xs text-slate-400">
          Identifies frequently overridden rules to spot unclear brand guidelines and recommend improvements.
        </p>
      </div>

      {loading ? (
        <div className="surface rounded-2xl p-8 text-center text-slate-400">
          Loading live dashboard insights...
        </div>
      ) : error ? (
        <div className="surface rounded-2xl p-6 text-rose-400">
          {error}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="surface rounded-2xl p-5 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Total Audits
              </span>
              <p className="text-2xl font-bold font-mono text-white">
                {data.totalAudits}
              </p>
              <span className="text-[10px] text-slate-400">
                Live database records
              </span>
            </div>

            <div className="surface rounded-2xl p-5 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                First-Pass Pass Rate
              </span>
              <p className="text-2xl font-bold font-mono text-white">
                {data.initialPassRate}%
              </p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Based on saved audit statuses
              </span>
            </div>

            <div className="surface rounded-2xl p-5 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Manual Overrides
              </span>
              <p className="text-2xl font-bold font-mono text-amber-400">
                {data.totalOverrides}
              </p>
              <span className="text-[10px] text-slate-400">
                Approved rule overrides
              </span>
            </div>

            <div className="surface rounded-2xl p-5 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Rules Requiring Clarification
              </span>
              <p className="text-2xl font-bold font-mono text-rose-400">
                {data.rulesRequiringClarification}
              </p>
              <span className="text-[10px] text-rose-400">
                Based on user feedback
              </span>
            </div>
          </div>

          <div className="surface rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">
                  High-Friction Guideline Detection
                </h2>
                <p className="text-xs text-slate-400">
                  Rules frequently overridden or dismissed with written notes
                </p>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                Live Insights
              </span>
            </div>

            {gapMetrics.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">
                No rule feedback available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {gapMetrics.map((g) => (
                  <div
                    key={g.ruleId}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        {g.ruleId}
                      </span>

                      <div className="flex items-start gap-2 pt-1 text-xs text-slate-400">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-300">
                            Suggested Guideline Revision:
                          </strong>{" "}
                          {recommendations[g.ruleId] ||
                            "Review this guideline and clarify its requirements based on reviewer feedback."}
                        </span>
                      </div>

                      {g.reasons.length > 0 && (
                        <p className="text-[11px] text-slate-500">
                          Latest feedback: {g.reasons[g.reasons.length - 1]}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-6 shrink-0 text-right">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          Overrides
                        </span>
                        <span className="text-base font-bold font-mono text-rose-400">
                          {g.overrides}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          Dismissals
                        </span>
                        <span className="text-base font-bold font-mono text-amber-400">
                          {g.dismissals}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          Override Rate
                        </span>
                        <span className="text-base font-bold font-mono text-white">
                          {g.overrideRate}%
                        </span>
                      </div>

                      <span className="px-3 py-1.5 text-slate-400 text-xs flex items-center gap-1">
                        <span>Insights</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seven-Day Trend Charts */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Seven-Day Performance Trends</h2>
              <p className="text-xs text-slate-400">
                Visual summary of actual audit and feedback activity
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Audit Activity */}
              <div className="surface rounded-2xl p-5">
                <h3 className="text-xs font-semibold text-white mb-5">
                  Audit Activity
                </h3>
                <div className="flex items-end justify-between gap-2 h-36">
                  {data.trends.map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {day.audits}
                      </span>
                      <div className="w-full h-24 flex items-end">
                        <div
                          className="w-full rounded-t bg-violet-500"
                          style={{
                            height: `${day.audits === 0 ? 2 : (day.audits / Math.max(1, ...data.trends.map(d => d.audits))) * 100}%`,
                            minHeight: "2px",
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500">
                        {day.date.slice(8)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-3">
                  Daily number of audits
                </p>
              </div>

              {/* Compliance Score */}
              <div className="surface rounded-2xl p-5">
                <h3 className="text-xs font-semibold text-white mb-5">
                  Average Compliance Score
                </h3>
                <div className="flex items-end justify-between gap-2 h-36">
                  {data.trends.map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {day.averageScore ? `${day.averageScore}` : "-"}
                      </span>
                      <div className="w-full h-24 flex items-end">
                        <div
                          className="w-full rounded-t bg-cyan-500"
                          style={{
                            height: `${day.averageScore}%`,
                            minHeight: day.averageScore > 0 ? "2px" : "0px",
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500">
                        {day.date.slice(8)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-3">
                  Score out of 100
                </p>
              </div>

              {/* Feedback Comparison */}
              <div className="surface rounded-2xl p-5">
                <h3 className="text-xs font-semibold text-white mb-5">
                  Override vs Dismissal
                </h3>
                <div className="flex items-end justify-between gap-2 h-36">
                  {data.trends.map((day) => {
                    const total = day.overrides + day.dismissals;
                    const maxFeedback = Math.max(
                      1,
                      ...data.trends.map(d => d.overrides + d.dismissals)
                    );

                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                          {total}
                        </span>
                        <div className="w-full h-24 flex items-end gap-0.5">
                          <div
                            className="flex-1 rounded-t bg-amber-400"
                            style={{
                              height: `${(day.overrides / maxFeedback) * 100}%`,
                              minHeight: day.overrides > 0 ? "2px" : "0px",
                            }}
                          />
                          <div
                            className="flex-1 rounded-t bg-rose-500"
                            style={{
                              height: `${(day.dismissals / maxFeedback) * 100}%`,
                              minHeight: day.dismissals > 0 ? "2px" : "0px",
                            }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-500">
                          {day.date.slice(8)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Overrides
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Dismissals
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

