import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ShieldCheck, Layers, BookOpen, BarChart3, Sliders, History, ArrowUpRight } from "lucide-react";

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
      <body className="bg-[#090a0f] text-slate-100 flex min-h-screen font-sans antialiased selection:bg-violet-500 selection:text-white">
        <aside className="hidden lg:flex w-[248px] border-r border-white/[0.07] bg-[#0d0e14]/95 flex-col justify-between p-5 shrink-0 fixed inset-y-0 z-50">
          <div className="space-y-8">
            {/* Brand Logo & Version */}
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px] tracking-[0.18em] text-white">ZENTRIX</span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Preflight engine</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              <div className="px-2 pb-2 text-[10px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
                Workspace
              </div>
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.07] transition-all group"
              >
                <Layers className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Audit Studio</span>
              </Link>
              <Link
                href="/brand-library"
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
              >
                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Brand library</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
              >
                <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Gap analytics</span>
              </Link>
            </nav>
            <nav className="space-y-1.5 pt-5 border-t border-white/[0.07]">
              <div className="px-2 pb-2 text-[10px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
                Governance
              </div>
              <Link
                href="/override-trail"
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.07] transition-all group"
              >
                <History className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Override Trail</span>
              </Link>
              <Link
                href="/model-settings"
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.07] transition-all group"
              >
                <Sliders className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>Model Settings</span>
              </Link>
            </nav>
          </div>
          {/* Org & Status Pill */}
          <div className="p-3.5 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
              <span className="text-slate-500">Environment</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live API
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span>org_zentrix_prod</span><ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="pl-0 lg:pl-[248px] flex-1 flex flex-col min-h-screen min-w-0">
          {children}
        </div>
      </body>
    </html>
  );
}
