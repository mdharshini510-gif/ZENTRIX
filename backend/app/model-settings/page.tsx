"use client";

import React, { useState } from "react";
import { Sliders, Cpu, Shield, Sparkles, Check } from "lucide-react";

export default function ModelSettingsPage() {
  const [minConfidence, setMinConfidence] = useState(85);
  const [contrastThreshold, setContrastThreshold] = useState("4.5");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-indigo-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <span>Model & Engine Settings</span>
        </h1>
        <p className="text-xs text-slate-400">
          Configure multi-modal inference parameters, confidence gates, and deterministic thresholds.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Primary Multimodal Vision Model</span>
              </h3>
              <p className="text-xs text-slate-400">Active engine for OCR extraction and semantic claim-visual alignment</p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              gemini-2.5-flash
            </span>
          </div>

          <div className="space-y-2 pb-4 border-b border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-200">AI Confidence Gate Threshold</span>
              <span className="font-mono text-indigo-400 font-semibold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Findings with model confidence below this score are flagged as "Needs Human Check" and never auto-block content.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-medium text-xs text-slate-200 block">Deterministic Contrast Standard</span>
            <select
              value={contrastThreshold}
              onChange={(e) => setContrastThreshold(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="4.5">WCAG AA Standard (Minimum 4.5:1 for regular text)</option>
              <option value="7.0">WCAG AAA Strict (Minimum 7.0:1 for enhanced legibility)</option>
              <option value="3.0">Large Text & Display Elements (Minimum 3.0:1)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}