import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { History, Search, Filter, Trash2, Calendar, CheckCircle2, XCircle, RefreshCw, Eye, Download } from 'lucide-react';

const IdentificationHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { showToast } = useToast();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/identifications?search=${encodeURIComponent(search)}`;
      if (resultFilter) url += `&result=${resultFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      showToast('Failed to fetch identification logs.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, resultFilter, showToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this identification history record?')) return;

    try {
      const res = await api.delete(`/identifications/${id}`);
      if (res.data.success) {
        showToast('History log deleted.', 'info');
        setHistory((prev) => prev.filter((item) => item._id !== id));
        if (selectedRecord?._id === id) setSelectedRecord(null);
      }
    } catch (err) {
      showToast('Failed to delete history record.', 'error');
    }
  };

  const exportToCSV = () => {
    if (history.length === 0) {
      showToast('No history records available to export.', 'warning');
      return;
    }

    const headers = ['Record ID', 'Result', 'Matched User Name', 'Matched User Email', 'Confidence (%)', 'Similarity Metric', 'Identified By', 'Timestamp', 'Message'];
    const rows = history.map(r => [
      r._id,
      r.result,
      `"${r.matchedUser?.name || 'N/A'}"`,
      `"${r.matchedUser?.email || 'N/A'}"`,
      r.confidencePercentage || 0,
      r.similarityScore || 0,
      `"${r.identifiedBy?.name || 'System'}"`,
      `"${new Date(r.timestamp).toISOString()}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Face_ID_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Audit logs exported to CSV successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Identification History Logs</h1>
            <p className="text-xs text-slate-400">
              Audit trails, similarity scores, and verification timestamps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button onClick={exportToCSV} className="btn-secondary text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button onClick={fetchHistory} className="btn-secondary text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by matched user name, email, or message..."
            className="glass-input w-full pl-10 text-xs py-2"
          />
        </div>

        {/* Status filter dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="glass-input text-xs py-2 bg-slate-900"
          >
            <option value="">All Results</option>
            <option value="SUCCESS">Matched (SUCCESS)</option>
            <option value="NO_MATCH">Unrecognized (NO_MATCH)</option>
            <option value="MULTIPLE_FACES">Multiple Faces Error</option>
            <option value="NO_FACE">No Face Detected Error</option>
          </select>
        </div>
      </div>

      {/* History Logs Table */}
      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading history logs...</div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No identification history records found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Matched Profile</th>
                  <th className="py-3.5 px-4">Confidence %</th>
                  <th className="py-3.5 px-4">Identified By</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {history.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        record.result === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {record.result === 'SUCCESS' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {record.result}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {record.matchedUser?.name || 'Unrecognized Face'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {record.confidencePercentage ? `${record.confidencePercentage}%` : '0%'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {record.identifiedBy?.name || 'System Operator'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record._id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Identification Log Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Record ID:</span>
                <span className="font-mono text-slate-200">{selectedRecord._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Result:</span>
                <span className="font-bold text-cyan-400">{selectedRecord.result}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Matched User:</span>
                <span className="font-bold text-white">{selectedRecord.matchedUser?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence Percentage:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedRecord.confidencePercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Similarity Metric:</span>
                <span className="font-mono text-cyan-300">{selectedRecord.similarityScore} / 1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-slate-300">{new Date(selectedRecord.timestamp).toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-800 pt-2">
                <span className="text-slate-400 block mb-1">Message:</span>
                <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                  {selectedRecord.message || 'No additional message.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="btn-secondary w-full text-xs mt-2"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentificationHistoryPage;
