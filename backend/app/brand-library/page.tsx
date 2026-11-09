"use client";

import React, { useState } from "react";
import { 
  Palette, 
  FileText, 
  AlertCircle, 
  Plus, 
  CheckCircle, 
  Search, 
  Trash2, 
  ExternalLink 
} from "lucide-react";

export default function BrandLibraryPage() {
  const [activeTab, setActiveTab] = useState<"palette" | "terms" | "facts">("palette");

  const colors = [
    { name: "Primary Brand Indigo", hex: "#4F46E5", role: "Primary Buttons & Brand Accents", status: "Active" },
    { name: "Secondary Electric Violet", hex: "#7C3AED", role: "Secondary Badges & Focus Rings", status: "Active" },
    { name: "Dark Neutral Backdrop", hex: "#0F172A", role: "Hero Text & High Contrast Elements", status: "Active" },
    { name: "Surface Slate Background", hex: "#1E293B", role: "Card Canvas Containers", status: "Active" },
  ];

  const bannedTerms = [
    { term: "Guaranteed #1", reason: "Factual violation under ASCI guidelines unless backed by official audit", replacement: "Industry Leader" },
    { term: "Cheapest in Market", reason: "Violates premium positioning tone rules", replacement: "Unmatched Value" },
    { term: "100% Risk Free", reason: "Requires legal disclaimer footer", replacement: "Guaranteed Satisfaction" },
  ];

  const approvedFacts = [
    { id: "FACT-2026-01", claim: "Over 500k+ Active Users", source: "Audited Quarterly SEC/Ministry filing Q2 2026", expiry: "Dec 31, 2026" },
    { id: "FACT-2026-02", claim: "SOC-2 Type II Certified", source: "Coalfire Compliance Audit 2026", expiry: "March 15, 2027" },
    { id: "FACT-2026-03", claim: "99.99% Guaranteed SLA", source: "Enterprise Service Agreement §4.1", expiry: "Ongoing" },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Brand Asset & Rule Library</h1>
          <p className="text-xs text-slate-400">Configured guidelines used for parallel vector-retrieval validation</p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Rule / Fact</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("palette")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "palette"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          <span>Color Palettes & Tolerances</span>
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "terms"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Terminology & Banned Claims</span>
        </button>
        <button
          onClick={() => setActiveTab("facts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "facts"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span>Approved Fact Sheet (pgvector)</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "palette" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {colors.map((c, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div
                className="w-full h-24 rounded-xl shadow-inner border border-white/10"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <h3 className="text-xs font-bold text-white">{c.name}</h3>
                <p className="text-[11px] font-mono text-slate-400">{c.hex}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{c.role}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                <span className="text-emerald-400 font-semibold">{c.status}</span>
                <span className="text-slate-400 font-mono">Max ΔE: 3.5</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "terms" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="p-4">Restricted Term</th>
                <th className="p-4">Governance Rationale</th>
                <th className="p-4">Approved Alternative</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {bannedTerms.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-4 font-semibold text-rose-400 font-mono">{t.term}</td>
                  <td className="p-4 text-slate-400 max-w-sm">{t.reason}</td>
                  <td className="p-4 text-emerald-400 font-medium">{t.replacement}</td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-rose-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "facts" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="p-4">Fact ID</th>
                <th className="p-4">Approved Claim</th>
                <th className="p-4">Verification Source</th>
                <th className="p-4">Expiration</th>
                <th className="p-4 text-right">Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {approvedFacts.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/30">
                  <td className="p-4 font-mono text-indigo-400 font-semibold">{f.id}</td>
                  <td className="p-4 font-medium text-white">{f.claim}</td>
                  <td className="p-4 text-slate-400 max-w-sm">{f.source}</td>
                  <td className="p-4 font-mono text-slate-400">{f.expiry}</td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-400 inline-flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}