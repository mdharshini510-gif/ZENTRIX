"use client";

import React, { useState } from "react";
import { Finding } from "@/types/preflight";
import { ZoomIn, ZoomOut, RotateCcw, Eye, ShieldAlert, Sparkles } from "lucide-react";

interface AnnotatedViewerProps {
  imageUrl: string;
  findings: Finding[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string) => void;
}

export default function AnnotatedViewer({
  imageUrl,
  findings,
  selectedFindingId,
  onSelectFinding,
}: AnnotatedViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [showOverlays, setShowOverlays] = useState(true);

  const getCategoryColor = (category: Finding["category"], isSelected: boolean) => {
    switch (category) {
      case "copy":
        return isSelected
          ? "border-sky-400 bg-sky-500/20 ring-4 ring-sky-500/30 text-sky-300"
          : "border-sky-500/70 bg-sky-500/10 hover:border-sky-400 text-sky-400";
      case "visual":
        return isSelected
          ? "border-violet-400 bg-violet-500/20 ring-4 ring-violet-500/30 text-violet-300"
          : "border-violet-500/70 bg-violet-500/10 hover:border-violet-400 text-violet-400";
      case "cross-modal":
        return isSelected
          ? "border-rose-400 bg-rose-500/25 ring-4 ring-rose-500/30 text-rose-300"
          : "border-rose-500/70 bg-rose-500/10 hover:border-rose-400 text-rose-400";
    }
  };

  return (
    <div className="relative flex flex-col w-full h-[760px] bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Top Canvas Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-900/40 text-xs text-slate-300 select-none">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px] text-slate-200">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Multi-Modal Canvas
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{findings.length} findings active</span>
        </div>

        {/* HUD Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
              showOverlays
                ? "bg-indigo-950/50 border-indigo-700/60 text-indigo-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Overlays {showOverlays ? "On" : "Off"}
          </button>
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative flex-1 overflow-auto flex items-center justify-center p-8 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
          className="relative inline-block transition-transform duration-200 ease-out shadow-2xl rounded-xl overflow-hidden border border-slate-800"
        >
          <img
            src={imageUrl}
            alt="Uploaded creative"
            className="max-h-[600px] w-auto object-contain block select-none pointer-events-none"
          />

          {showOverlays &&
            findings.map((f) => {
              if (!f.boundingBox) return null;
              const { x, y, width, height } = f.boundingBox;
              const isSelected = f.id === selectedFindingId;
              const isBlocking = f.severity === "blocking";

              return (
                <div
                  key={f.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFinding(f.id);
                  }}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  }}
                  className={`absolute cursor-pointer border-2 transition-all duration-200 rounded group ${getCategoryColor(
                    f.category,
                    isSelected
                  )}`}
                >
                  <div
                    className={`absolute -top-7 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-lg transition-transform ${
                      isSelected ? "scale-105" : "group-hover:scale-105"
                    } ${
                      isBlocking
                        ? "bg-rose-600 text-white shadow-rose-950/60"
                        : "bg-slate-900 border border-slate-700 text-slate-200"
                    }`}
                  >
                    {isBlocking && <ShieldAlert className="w-3 h-3 text-white" />}
                    <span>{f.ruleId}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}