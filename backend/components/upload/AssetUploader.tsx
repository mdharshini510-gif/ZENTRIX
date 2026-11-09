"use client";

import React, { useState } from "react";
import { UploadCloud, Layers, Target } from "lucide-react";

interface AssetUploaderProps {
  onAssetLoaded: (data: { file: File; previewUrl: string; channel: string; campaign: string }) => void;
}

export default function AssetUploader({ onAssetLoaded }: AssetUploaderProps) {
  const [channel, setChannel] = useState("Instagram Post");
  const [campaign, setCampaign] = useState("Q4 Launch Campaign");
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    onAssetLoaded({ file, previewUrl, channel, campaign });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          className={`flex-1 border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 transition-all cursor-pointer ${
            dragActive
              ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
              : "border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-300"
          }`}
        >
          <UploadCloud className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-slate-200">Upload Creative</span> or drag & drop (PNG, JPG, WebP)
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {/* Channel & Campaign Metadata */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Instagram Post" className="bg-slate-900">Instagram (1:1 / 4:5)</option>
              <option value="Web Banner" className="bg-slate-900">Web Banner (16:9)</option>
              <option value="LinkedIn Carousel" className="bg-slate-900">LinkedIn Carousel</option>
              <option value="Pitch Deck" className="bg-slate-900">Pitch Deck (16:9)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="Campaign Tag..."
              className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-36"
            />
          </div>
        </div>
      </div>
    </div>
  );
}