import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  BarChart3, 
  Sliders, 
  History, 
  ExternalLink 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Brand Preflight Engine | Autonomous Governance",
  description: "Enterprise multi-modal creative verification and compliance engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white">
        {/* Left Global App Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl flex flex-col justify-between p-4 shrink-0 fixed inset-y-0 z-50">
          <div className="space-y-6">
            {/* Brand Logo & Version */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm bg-gradient-to-r from-indigo-200 via-sky-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
  Preflight
</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold">
                    ZENTRIX
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-400">Enterprise Governance</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Core Engine
              </div>
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
              >
                <Layers className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Audit Studio</span>
              </Link>
              <Link
                href="/brand-library"
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
              >
                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Brand Rules & Assets</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
              >
                <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Guideline Gap Insights</span>
              </Link>
            </nav>
            <nav className="space-y-1 pt-4 border-t border-slate-900">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Governance Logs
              </div>
              <Link
                href="/override-trail"
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
              >
                <History className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Override Trail</span>
              </Link>
              <Link
                href="/model-settings"
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
              >
                <Sliders className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Model Settings</span>
              </Link>
            </nav>
          </div>
          {/* Org & Status Pill */}
          <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Environment</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live API
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono truncate">
              org_zentrix_prod
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="pl-64 flex-1 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}