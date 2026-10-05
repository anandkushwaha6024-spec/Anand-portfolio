import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import AttendanceTable from '../components/AttendanceTable';
import Button from '../components/Button';
import { History, Download, Calendar, Search } from 'lucide-react';

const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let url = '/attendance/history';
      const params = new URLSearchParams();
      if (dateFilter) params.append('date', dateFilter);
      if (search) params.append('search', search);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await apiClient.get(url);
      if (res.data.success) {
        setRecords(res.data.history);
      }
    } catch (err) {
      console.error('Error loading attendance history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [dateFilter]);

  const handleExportCSV = async () => {
    try {
      const response = await apiClient.get('/attendance/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-blue-400" />
            Attendance History & Reports
          </h2>
          <p className="text-xs text-slate-400">View and export full attendance logs across sessions</p>
        </div>

        <Button onClick={handleExportCSV} variant="secondary" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV Report
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
            placeholder="Search student or roll number..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Attendance Log Table */}
      <AttendanceTable records={records} loading={loading} />
    </div>
  );
};

export default AttendanceHistory;
