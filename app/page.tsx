"use client";

import React, { useState } from "react";
import Link from "next/link";
import AssetUploader from "@/components/upload/AssetUploader";
import AnnotatedViewer from "@/components/viewer/AnnotatedViewer";
import FindingsPanel from "@/components/findings/FindingsPanel";
import { mockReport } from "@/lib/mockData";
import { CheckReport } from "@/types/preflight";
import { History, SendHorizontal, Shield, Sparkles } from "lucide-react";

export default function WorkspacePage() {
  const [report, setReport] = useState<CheckReport>({ ...mockReport, findings: [...mockReport.findings] });
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(mockReport.findings[0]?.id ?? null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleAssetLoaded = async (data: { file: File; previewUrl: string; channel: string; campaign: string }) => {
    setIsAnalyzing(true); setNotice(null);
    try {
      const body = new FormData(); body.append("file", data.file); body.append("channel", data.channel); body.append("campaign", data.campaign);
      const response = await fetch("/api/analyze", { method: "POST", body });
      if (!response.ok) throw new Error("Analysis service unavailable");
      const payload = await response.json();
      if (!payload.success || !payload.report) throw new Error(payload.error || "Analysis failed");
      const nextReport = { ...payload.report, assetUrl: data.previewUrl } as CheckReport;
      setReport(nextReport); setSelectedFindingId(nextReport.findings[0]?.id ?? null);
    } catch {
      setReport({ ...mockReport, findings: [...mockReport.findings], assetUrl: data.previewUrl });
      setSelectedFindingId(mockReport.findings[0]?.id ?? null);
      setNotice("Live analysis is unavailable, so the local sample checks are shown.");
    } finally { setIsAnalyzing(false); }
  };

  const handleAcceptFix = (id: string) => {
    const findings = report.findings.filter((finding) => finding.id !== id);
    const score = Math.min(100, report.overallScore + 16);
    setReport({ ...report, findings, overallScore: score, status: findings.some((f) => f.severity === "blocking") ? "blocked" : score < 80 ? "review_required" : "passed" });
    setSelectedFindingId(findings[0]?.id ?? null);
  };

  const handleDismiss = (id: string, reason: string) => {
    console.info(`[Audit Trail] Rule ${id} overridden: ${reason}`); handleAcceptFix(id); setNotice("Override logged to the governance trail.");
  };

  return (
    <main className="app-page space-y-5">
      <header className="surface rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20"><Shield className="w-5 h-5 text-white" /></div><div><div className="flex items-center gap-2"><h1 className="text-base font-semibold text-white">Audit Studio</h1><span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">LIVE</span></div><p className="text-xs text-slate-500">Multi-modal brand governance</p></div></div>
        <div className="flex items-center gap-2"><Link href="/override-trail" className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg"><History className="w-3.5 h-3.5" /> Audit history</Link><button disabled={report.status !== "passed"} onClick={() => setNotice("Creative approved for publishing.")} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"><SendHorizontal className="w-3.5 h-3.5" /> Publish creative</button></div>
      </header>
      <AssetUploader onAssetLoaded={handleAssetLoaded} />
      {isAnalyzing && <div className="p-3.5 bg-violet-950/40 border border-violet-700/50 text-violet-300 rounded-xl text-center text-xs font-medium animate-pulse flex items-center justify-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /> Executing copy, visual, and cross-modal verification…</div>}
      {notice && <div role="status" className="p-3 bg-cyan-950/30 border border-cyan-800/50 text-cyan-300 rounded-xl text-xs">{notice}</div>}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start"><div className="xl:col-span-8"><AnnotatedViewer imageUrl={report.assetUrl} findings={report.findings} selectedFindingId={selectedFindingId} onSelectFinding={setSelectedFindingId} /></div><div className="xl:col-span-4"><FindingsPanel score={report.overallScore} status={report.status} findings={report.findings} selectedFindingId={selectedFindingId} onSelectFinding={setSelectedFindingId} onAcceptFix={handleAcceptFix} onDismiss={handleDismiss} /></div></div>
    </main>
  );
}
