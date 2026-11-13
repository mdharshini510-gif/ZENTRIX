"use client";

import React, { useState } from "react";
import Link from "next/link";
import AssetUploader from "@/components/upload/AssetUploader";
import AnnotatedViewer from "@/components/viewer/AnnotatedViewer";
import FindingsPanel from "@/components/findings/FindingsPanel";
import { mockReport } from "@/lib/mockData";
import { CheckReport } from "@/types/preflight";
import { History, SendHorizontal, Shield, Sparkles, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egkragrtaxujahptfrik.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable__oa2LCQ4Jfa-OxpUT4yy_w_D_OUsle3"
);

export default function WorkspacePage() {
  const [report, setReport] = useState<CheckReport>({ ...mockReport, findings: [...mockReport.findings] });
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(mockReport.findings[0]?.id ?? null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [currentAuditId, setCurrentAuditId] = useState<string | null>(null);

  // --- Audit History Drawer State ---
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

 // Fetch past audit runs from Supabase (with fallback)
  async function handleOpenHistory() {
    setIsHistoryOpen(true);
    setLoadingHistory(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egkragrtaxujahptfrik.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    // 1. Fallback mock data if key is missing or invalid
    const fallbackHistory = [
      {
        id: "audit-demo-101",
        score: 84,
        status: "blocked",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        findings: mockReport.findings,
      },
      {
        id: "audit-demo-102",
        score: 96,
        status: "passed",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        findings: [],
      },
    ];

    try {
      if (!supabaseKey || supabaseKey.includes("placeholder")) {
        setHistoryList(fallbackHistory);
        return;
      }

      // Initialize client with explicit header configuration
      const client = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            apikey: supabaseKey,
          },
        },
      });

      const { data, error } = await client
        .from("audits")
        .select("id, score, status, findings, created_at, asset_url")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch returned error, using fallback history:", error.message);
        setHistoryList(fallbackHistory);
      } else if (data && data.length > 0) {
        setHistoryList(data);
      } else {
        setHistoryList(fallbackHistory);
      }
    } catch (err) {
      console.warn("Connection exception, loaded fallback:", err);
      setHistoryList(fallbackHistory);
    } finally {
      setLoadingHistory(false);
    }
  }

  // Restore selected historical audit into studio view
  function handleSelectHistoricalAudit(audit: any) {
    const findings = audit.findings || [];
    setReport({
      assetId: audit.asset_id || report.assetId,
      assetUrl: audit.asset_url || report.assetUrl,
      overallScore: audit.score ?? 82,
      status: audit.status ?? "passed",
      findings: findings,
    });
    setSelectedFindingId(findings[0]?.id ?? null);
    setIsHistoryOpen(false);
    setNotice(`Loaded audit run: ${audit.id.slice(0, 8)}...`);
  }

  const handleAssetLoaded = async (data: { file: File; previewUrl: string; channel: string; campaign: string }) => {
    setIsAnalyzing(true);
    setNotice(null);
    try {
      const body = new FormData();
      body.append("file", data.file);
      body.append("channel", data.channel);
      body.append("campaign", data.campaign);
      const response = await fetch("/api/analyze", { method: "POST", body });
      if (!response.ok) throw new Error("Analysis service unavailable");
      const payload = await response.json();
      if (!payload.success || !payload.report) throw new Error(payload.error || "Analysis failed");
      const nextReport = { ...payload.report, assetUrl: data.previewUrl } as CheckReport;
      setReport(nextReport);
      setSelectedFindingId(nextReport.findings[0]?.id ?? null);

      // Auto-save run to Supabase audits table
      const { data: savedAudit, error: auditError } = await supabase
        .from("audits")
        .insert([
          {
        id: crypto.randomUUID(),
            score: nextReport.overallScore,
            status: nextReport.status,
            findings: nextReport.findings,
    
          },
        ])
        .select("id")
        .single();

      if (auditError) {
        console.error("Audit save failed:", auditError.message);
      } else {
        console.log("Saved Audit ID:", savedAudit.id);
        setCurrentAuditId(savedAudit.id);
      }
    } catch {
      setReport({ ...mockReport, findings: [...mockReport.findings], assetUrl: data.previewUrl });
      setSelectedFindingId(mockReport.findings[0]?.id ?? null);
      setNotice("Live analysis is unavailable, so the local sample checks are shown.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptFix = (id: string) => {
    const findings = report.findings.filter((finding) => finding.id !== id);
    const score = Math.min(100, report.overallScore + 16);
    const hasBlocking = findings.some((f) => f.severity === "blocking");

    setReport({
      ...report,
      findings,
      overallScore: score,
      status: hasBlocking ? "blocked" : "passed",
    });
    setSelectedFindingId(findings[0]?.id ?? null);
  };

  const handleDismiss = async (id: string, reason: string) => {
    const findingToOverride = report.findings.find((f) => f.id === id);

    if (!currentAuditId) {
      setNotice("Please run the analysis again before logging an override.");
      return;
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audit_id: currentAuditId,
          rule_id: findingToOverride?.ruleId || id,
          action_type: "overridden",
          reason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save override.");
      }

      setNotice("Override saved successfully.");
      console.log("Feedback saved:", result);

      handleAcceptFix(id);
    } catch (error) {
      console.error("Override save failed:", error);
      setNotice("Unable to save override. Please try again.");
    }
  };

  return (
    <main className="app-page space-y-5 relative">
      <header className="surface rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-white">Audit Studio</h1>
              <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">Multi-modal brand governance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audit History Drawer Button */}
          <button
            type="button"
            onClick={handleOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition"
          >
            <History className="w-3.5 h-3.5" /> Audit history
          </button>

          <button
            disabled={report.status !== "passed"}
            onClick={() => setNotice("Creative approved for publishing.")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
          >
            <SendHorizontal className="w-3.5 h-3.5" /> Publish creative
          </button>
        </div>
      </header>

      <AssetUploader onAssetLoaded={handleAssetLoaded} />

      {isAnalyzing && (
        <div className="p-3.5 bg-violet-950/40 border border-violet-700/50 text-violet-300 rounded-xl text-center text-xs font-medium animate-pulse flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin" /> Executing copy, visual, and cross-modal verificationâ€¦
        </div>
      )}

      {notice && (
        <div role="status" className="p-3 bg-cyan-950/30 border border-cyan-800/50 text-cyan-300 rounded-xl text-xs">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8">
          <AnnotatedViewer
            imageUrl={report.assetUrl}
            findings={report.findings}
            selectedFindingId={selectedFindingId}
            onSelectFinding={setSelectedFindingId}
          />
        </div>
        <div className="xl:col-span-4">
          <FindingsPanel
            score={report.overallScore}
            status={report.status}
            findings={report.findings}
            selectedFindingId={selectedFindingId}
            onSelectFinding={setSelectedFindingId}
            onAcceptFix={handleAcceptFix}
            onDismiss={handleDismiss}
          />
        </div>
      </div>

      {/* --- Slide-Over Drawer for Audit History --- */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm h-full bg-[#0B0F19] border-l border-slate-800 p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
                Audit History
              </h2>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
              {loadingHistory ? (
                <div className="text-xs text-slate-400 text-center py-8">
                  Loading records from Supabase...
                </div>
              ) : historyList.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-8">
                  No previous audit records found.
                </div>
              ) : (
                historyList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectHistoricalAudit(item)}
                    className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono text-slate-400">
                        {String(item.id).slice(0, 8)}...
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          item.status === "blocked"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200">
                      Preflight Score: {item.score} / 100
                    </div>

                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}






