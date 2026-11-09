"use client";

import React from "react";
import { History, ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";

export default function OverrideTrailPage() {
  const overrides = [
    {
      id: "OVR-8092",
      assetName: "banner_q4_festive_v2.png",
      ruleId: "RULE-CONTRAST-04",
      ruleCitation: "Visual Guidelines §3.2: 4.5:1 Contrast ratio",
      overriddenBy: "Divyasree Vasudevan (Brand Lead)",
      timestamp: "Nov 08, 2026, 14:22 IST",
      reason: "Artistic neon aesthetic intentional on promotional header; verified readable on mobile screen tests.",
      status: "Approved Override",
    },
    {
      id: "OVR-8091",
      assetName: "social_story_deck_v1.png",
      ruleId: "RULE-CLAIM-12",
      ruleCitation: "Compliance Fact Sheet §1.1: Leadership superlatives",
      overriddenBy: "Compliance Reviewer",
      timestamp: "Nov 07, 2026, 18:40 IST",
      reason: "Audited report ref: AUD-2026-Q3 attached via offline approval ticket #4491.",
      status: "Approved Override",
    },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-indigo-900 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <span>Governance & Override Trail</span>
        </h1>
        <p className="text-xs text-slate-400">
          Immutable audit log tracking who bypassed or modified automated checks and the mandatory justification provided.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
            <tr>
              <th className="p-4">Log ID</th>
              <th className="p-4">Asset</th>
              <th className="p-4">Rule Bypassed</th>
              <th className="p-4">Reviewer</th>
              <th className="p-4">Logged Justification</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {overrides.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/30">
                <td className="p-4 font-mono text-indigo-400 font-semibold">{row.id}</td>
                <td className="p-4 text-white font-medium">{row.assetName}</td>
                <td className="p-4">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {row.ruleId}
                  </span>
                </td>
                <td className="p-4 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{row.overriddenBy}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">{row.timestamp}</span>
                </td>
                <td className="p-4 text-slate-400 max-w-md italic">"{row.reason}"</td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}