import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import WebcamScanner from '../components/WebcamScanner';
import { 
  ScanFace, 
  CheckCircle2, 
  XCircle, 
  User, 
  Mail, 
  Shield, 
  Clock, 
  Award, 
  RefreshCw, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

const FaceIdentificationPage = () => {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleIdentifyFace = async (imageBase64) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const res = await api.post('/face/identify', {
        imageBase64
      });

      if (res.data.success) {
        setResult(res.data);
        if (res.data.matched) {
          showToast(`Match Identified: ${res.data.matchedUser.name} (${res.data.confidencePercentage}%)`, 'success');
        } else {
          showToast(res.data.message || 'Face not recognized.', 'warning');
        }
      } else {
        showToast(res.data.message || 'Identification failed.', 'error');
      }
    } catch (err) {
      console.error('Identification error:', err);
      const msg = err.response?.data?.message || 'Face identification failed. Ensure clear camera lighting.';
      showToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetResult = () => {
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ScanFace className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Face Identification</h1>
            <p className="text-xs text-slate-400">
              Scan candidate facial features to match against enrolled biometric vectors.
            </p>
          </div>
        </div>

        {result && (
          <button onClick={resetResult} className="btn-secondary text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another Face</span>
          </button>
        )}
      </div>

      {/* Main Scanner Section or Identification Result Card */}
      {result ? (
        <div className="glass-panel p-8 space-y-6 animate-fade-in">
          {result.matched ? (
            /* MATCH SUCCESSFUL CARD */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-xl text-emerald-400">FACE IDENTIFIED MATCH</h2>
                    <p className="text-xs text-emerald-200">Biometric match confirmed in database.</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-mono font-extrabold text-cyan-400">
                    {result.confidencePercentage}%
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Cosine Similarity Score
                  </span>
                </div>
              </div>

              {/* Matched User Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                    {result.matchedUser.name ? result.matchedUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{result.matchedUser.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {result.matchedUser.email}
                    </p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      Role: {result.matchedUser.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">User ID:</span>
                    <span className="font-mono text-slate-200">{result.matchedUser.userId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Similarity Metric:</span>
                    <span className="font-mono text-cyan-400 font-bold">{result.similarityScore} / 1.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Identification Date:</span>
                    <span className="text-slate-300">{new Date(result.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Confidence Meter Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Match Certainty Meter</span>
                  <span className="text-cyan-400 font-bold">{result.confidencePercentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, result.confidencePercentage)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* NO MATCH CARD */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
                <XCircle className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Face Not Recognized</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                  The scanned facial vector does not match any enrolled user above the security similarity threshold (70%).
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 max-w-md mx-auto text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Highest Match Score:</span>
                  <span className="font-mono font-bold text-amber-400">{result.confidencePercentage}%</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-slate-400">
                  <span>Required Security Threshold:</span>
                  <span className="font-mono">70.00%</span>
                </div>
              </div>

              <button onClick={resetResult} className="btn-primary text-sm mx-auto">
                <RefreshCw className="w-4 h-4" />
                <span>Try Scanning Again</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <WebcamScanner
          onCapture={handleIdentifyFace}
          isProcessing={isProcessing}
          mode="identify"
        />
      )}
    </div>
  );
};

export default FaceIdentificationPage;
