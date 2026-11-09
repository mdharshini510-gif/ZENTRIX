"use client";

import React, { useState } from "react";
import { Finding } from "@/types/preflight";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

interface FindingsPanelProps {
  score: number;
  status: "passed" | "blocked" | "review_required";
  findings: Finding[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string) => void;
  onAcceptFix: (id: string) => void;
  onDismiss: (id: string, reason: string) => void;
}

export default function FindingsPanel({
  score,
  status,
  findings,
  selectedFindingId,
  onSelectFinding,
  onAcceptFix,
  onDismiss,
}: FindingsPanelProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dismissReason, setDismissReason] = useState<{ [key: string]: string }>({});
  const [activeDismissId, setActiveDismissId] = useState<string | null>(null);

  const filteredFindings = findings.filter(
    (f) => filterCategory === "all" || f.category === filterCategory
  );

  const copyCount = findings.filter((f) => f.category === "copy").length;
  const visualCount = findings.filter((f) => f.category === "visual").length;
  const crossModalCount = findings.filter((f) => f.category === "cross-modal").length;

  return (
    <div className="flex flex-col h-[760px] bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Preflight Score & Status Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Preflight Audit Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                {score}
              </span>
              <span className="text-sm font-medium text-slate-500">/ 100</span>
            </div>
          </div>

          <div>
            {status === "blocked" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-full border border-rose-500/20 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5" /> Blocked
              </span>
            )}
            {status === "review_required" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5" /> Review Required
              </span>
            )}
            {status === "passed" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
              </span>
            )}
          </div>
        </div>

        {/* 3 Pillar Summary */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-center">
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Copy</span>
            <p className="text-xs font-semibold text-sky-400 font-mono mt-0.5">{copyCount} Issues</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Visual</span>
            <p className="text-xs font-semibold text-violet-400 font-mono mt-0.5">{visualCount} Issues</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Cross-Modal</span>
            <p className="text-xs font-semibold text-rose-400 font-mono mt-0.5">{crossModalCount} Issues</p>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <Filter className="w-3.5 h-3.5 mr-1" />
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              filterCategory === "all"
                ? "bg-slate-800 text-white font-semibold"
                : "hover:text-slate-200"
            }`}
          >
            All ({findings.length})
          </button>
          <button
            onClick={() => setFilterCategory("cross-modal")}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              filterCategory === "cross-modal"
                ? "bg-rose-950/50 text-rose-300 font-semibold border border-rose-800/40"
                : "hover:text-slate-200"
            }`}
          >
            Cross-Modal
          </button>
          <button
            onClick={() => setFilterCategory("copy")}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              filterCategory === "copy"
                ? "bg-sky-950/50 text-sky-300 font-semibold border border-sky-800/40"
                : "hover:text-slate-200"
            }`}
          >
            Copy
          </button>
          <button
            onClick={() => setFilterCategory("visual")}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              filterCategory === "visual"
                ? "bg-violet-950/50 text-violet-300 font-semibold border border-violet-800/40"
                : "hover:text-slate-200"
            }`}
          >
            Visual
          </button>
        </div>
      </div>

      {/* Findings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredFindings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 text-slate-500">
            <FileCheck2 className="w-12 h-12 mb-3 text-emerald-500/80" />
            <p className="text-sm font-medium text-slate-300">Clean Preflight Report</p>
            <p className="text-xs text-slate-500 mt-0.5 max-w-[200px]">
              No compliance or visual rule violations in this category.
            </p>
          </div>
        ) : (
          filteredFindings.map((f) => {
            const isSelected = f.id === selectedFindingId;
            return (
              <div
                key={f.id}
                onClick={() => onSelectFinding(f.id)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-slate-800/80 border-indigo-500/70 shadow-lg ring-1 ring-indigo-500/30"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700/80 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 font-medium">
                    {f.ruleId}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400">
                      {Math.round(f.confidence * 100)}% conf
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        f.severity === "blocking"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {f.severity}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic mb-2 pl-2 border-l-2 border-indigo-500/50">
                  {f.ruleCitation}
                </p>

                <p className="text-sm text-slate-200 font-medium leading-relaxed mb-3">
                  {f.message}
                </p>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong className="text-indigo-300">Suggested Correction:</strong>{" "}
                      {f.suggestedFix}
                    </span>
                  </div>
                </div>

                {activeDismissId === f.id ? (
                  <div className="space-y-2 mt-2 pt-2 border-t border-slate-800" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Audit Note: Reason for overriding rule..."
                      value={dismissReason[f.id] || ""}
                      onChange={(e) =>
                        setDismissReason({ ...dismissReason, [f.id]: e.target.value })
                      }
                      className="w-full text-xs bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setActiveDismissId(null)}
                        className="text-xs px-2.5 py-1 text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!dismissReason[f.id]}
                        onClick={() => onDismiss(f.id, dismissReason[f.id])}
                        className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-medium disabled:opacity-40"
                      >
                        Log Override
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/70">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDismissId(f.id);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-md hover:bg-slate-800 transition-colors"
                    >
                      Override
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptFix(f.id);
                      }}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <span>Accept Fix</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}