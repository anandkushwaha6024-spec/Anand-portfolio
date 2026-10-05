import React, { useState } from 'react';
import Button from '../components/Button';
import { Settings as SettingsIcon, Sliders, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const [threshold, setThreshold] = useState('0.70');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-blue-400" />
          System Settings & AI Thresholds
        </h2>
        <p className="text-xs text-slate-400">Configure face matching sensitivity and system parameters</p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Face Identification Similarity Threshold ({intThreshold(threshold)}%)</span>
            <span className="text-blue-400 font-mono font-bold">{threshold}</span>
          </label>
          <input
            type="range"
            min="0.50"
            max="0.95"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-[11px] text-slate-500 mt-2">
            Higher values (e.g. 0.80+) increase match precision but require clearer camera lighting.
            Default: 0.70 (70% Cosine Similarity).
          </p>
        </div>

        {saved && (
          <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            ✅ System settings updated successfully!
          </div>
        )}

        <Button type="submit">Save Configurations</Button>
      </form>
    </div>
  );
};

function intThreshold(val) {
  return Math.round(parseFloat(val) * 100);
}

export default Settings;
