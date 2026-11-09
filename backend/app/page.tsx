"use client";

import React, { useState } from "react";
import AssetUploader from "@/components/upload/AssetUploader";
import AnnotatedViewer from "@/components/viewer/AnnotatedViewer";
import FindingsPanel from "@/components/findings/FindingsPanel";
import { mockReport } from "@/lib/mockData";
import { CheckReport } from "@/types/preflight";
import { Shield, Sparkles, SendHorizontal, History } from "lucide-react";

export default function WorkspacePage() {
  const [report, setReport] = useState<CheckReport | null>(mockReport);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>("f-1");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAssetLoaded = async (data: {
    file: File;
    previewUrl: string;
    channel: string;
    campaign: string;
  }) => {
    setIsAnalyzing(true);
    try {
      const body = new FormData();
      body.append("file", data.file);
      body.append("channel", data.channel);
      body.append("campaign", data.campaign);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body,
      });

      if (!res.ok) throw new Error("API call failed");

      const result: CheckReport = await res.json();
      result.assetUrl = data.previewUrl;
      setReport(result);
      if (result.findings.length > 0) {
        setSelectedFindingId(result.findings[0].id);
      }
    } catch {
      // Graceful fallback to client preview if backend is not yet populated
      setReport({
        ...mockReport,
        assetUrl: data.previewUrl,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptFix = (id: string) => {
    if (!report) return;
    const updated = report.findings.filter((f) => f.id !== id);
    setReport({
      ...report,
      findings: updated,
      overallScore: Math.min(100, report.overallScore + 16),
      status: updated.some((f) => f.severity === "blocking") ? "blocked" : "passed",
    });
  };

  const handleDismiss = (id: string, reason: string) => {
    console.log(`[Audit Trail] Rule ${id} overridden:`, reason);
    handleAcceptFix(id);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6 font-sans">
      <div className="max-w-[1550px] w-full mx-auto space-y-5">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-slate-900/60 border border-slate-800/90 rounded-2xl shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">Brand Preflight</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Multi-Modal Brand Governance Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Audit History</span>
            </button>
            <button
              disabled={report?.status === "blocked"}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>Publish Creative</span>
            </button>
          </div>
        </header>

        {/* Top Asset Dropzone */}
        <AssetUploader onAssetLoaded={handleAssetLoaded} />

        {/* Parallel Check Progress Banner */}
        {isAnalyzing && (
          <div className="p-3.5 bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 rounded-2xl text-center text-xs font-medium animate-pulse flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            Executing parallel Copy, Visual, and Cross-Modal verification...
          </div>
        )}

        {/* Workspace Grid */}
        {report && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8">
              <AnnotatedViewer
                imageUrl={report.assetUrl}
                findings={report.findings}
                selectedFindingId={selectedFindingId}
                onSelectFinding={setSelectedFindingId}
              />
            </div>
            <div className="lg:col-span-4">
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
        )}
      </div>
    </main>
  );
}