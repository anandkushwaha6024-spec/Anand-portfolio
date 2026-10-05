import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const AttendanceTable = ({ records = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-sm text-slate-400">Loading attendance records...</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <Clock className="h-10 w-10 text-slate-600 mb-2" />
        <p className="text-sm font-medium text-slate-400">No attendance logs found</p>
        <p className="text-xs text-slate-500 mt-1">Logs will appear here once scanning begins.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3.5">Student</th>
            <th className="px-6 py-3.5">Roll Number</th>
            <th className="px-6 py-3.5">Date & Time</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5">AI Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {records.map((row, idx) => {
            const studentName = row.student?.name || row.studentName || 'Student';
            const rollNum = row.student?.rollNumber || row.studentId || '-';
            const isPresent = row.status === 'PRESENT';
            const confidencePct = row.confidence
              ? `${(row.confidence * 100).toFixed(0)}%`
              : '100%';

            return (
              <tr key={row._id || idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-blue-400">
                    {studentName.charAt(0)}
                  </div>
                  {studentName}
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{rollNum}</td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  <div>{row.date}</div>
                  <div className="text-[10px] text-slate-500">{row.time}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isPresent
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {isPresent ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-blue-400">{confidencePct}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
