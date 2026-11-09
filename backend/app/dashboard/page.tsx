"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Lightbulb, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";

export default function DashboardPage() {
  const gapMetrics = [
    {
      ruleId: "RULE-CONTRAST-04",
      ruleName: "Minimum Contrast Ratio 4.5:1",
      overrides: 42,
      clarityScore: "48%",
      recommendation: "Designers repeatedly override this on gradient buttons. Recommend adding a sanctioned tinted background container class.",
    },
    {
      ruleId: "RULE-CLAIM-12",
      ruleName: "Unsubstantiated Market Leadership",
      overrides: 28,
      clarityScore: "62%",
      recommendation: "Marketing teams often conflate regional rank with global status. Update rule description to distinguish national versus global market claims.",
    },
    {
      ruleId: "RULE-FONT-01",
      ruleName: "Primary Font Inter / Geist Only",
      overrides: 19,
      clarityScore: "78%",
      recommendation: "Headline display fonts are frequently rejected. Consider expanding the display typography roster for festive campaigns.",
    },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Guideline Gap Analytics</h1>
        <p className="text-xs text-slate-400 dark:text-slate-400">
          Identifies frequently overridden rules to spot unclear brand guidelines and recommend rewordings
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Total Audits</span>
          <p className="text-2xl font-bold font-mono text-white">1,482</p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +18% this month
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">First-Pass Pass Rate</span>
          <p className="text-2xl font-bold font-mono text-white">74.2%</p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3" /> +6.4% compliance gain
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Manual Overrides</span>
          <p className="text-2xl font-bold font-mono text-amber-400">89</p>
          <span className="text-[10px] text-slate-400">Across 14 campaigns</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Rules Requiring Clarification</span>
          <p className="text-2xl font-bold font-mono text-rose-400">3</p>
          <span className="text-[10px] text-rose-400 font-medium">High friction detected</span>
        </div>
      </div>

      {/* Guideline Gap Engine Cards */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">High-Friction Guideline Detection</h2>
            <p className="text-xs text-slate-400">Rules that creators frequently override or dismiss with written notes</p>
          </div>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            Autonomous Heuristics
          </span>
        </div>

        <div className="space-y-3">
          {gapMetrics.map((g) => (
            <div
              key={g.ruleId}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                    {g.ruleId}
                  </span>
                  <span className="text-sm font-semibold text-white">{g.ruleName}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 text-xs text-slate-400">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Suggested Guideline Revision:</strong> {g.recommendation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 text-right">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Override Count</span>
                  <span className="text-base font-bold font-mono text-rose-400">{g.overrides}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Clarity Index</span>
                  <span className="text-base font-bold font-mono text-amber-400">{g.clarityScore}</span>
                </div>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700">
                  <span>Edit Rule</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}