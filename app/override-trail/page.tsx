"use client";

import React, { useEffect, useState } from "react";
import { History, ShieldCheck, UserCheck } from "lucide-react";

interface FeedbackRecord {
  id: string;
  audit_id: string;
  rule_id: string;
  action_type: string;
  reason: string;
  created_at: string;
}

export default function OverrideTrailPage() {
  const [records, setRecords] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load override history.");
        }

        setRecords(result.feedback || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="app-page space-y-7">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <span>Governance & Override Trail</span>
        </h1>
        <p className="text-xs text-slate-400">
          Live audit log of rule overrides and reviewer justifications.
        </p>
      </div>

      <div className="surface rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-sm text-slate-300">
            Feedback Records
          </span>
          <span className="text-xs font-mono text-indigo-400">
            {records.length} records
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400">
            Loading override history...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-400">
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No override records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Audit ID</th>
                  <th className="p-4">Rule ID</th>
                  <th className="p-4">Action Type</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Date & Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {records.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-indigo-400">
                      {row.id.slice(0, 8)}
                    </td>

                    <td className="p-4 font-mono text-slate-400">
                      {row.audit_id.slice(0, 8)}
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {row.rule_id}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        row.action_type === "overridden"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {row.action_type}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400 max-w-sm">
                      {row.reason}
                    </td>

                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {new Date(row.created_at).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
