import React from 'react';
import { ShieldAlert, Check, Lock, Trash2, EyeOff, ShieldCheck } from 'lucide-react';

const PrivacyConsentModal = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-lg w-full p-6 border-cyan-500/30 shadow-2xl shadow-cyan-950/50">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Biometric Consent & Privacy Policy</h3>
            <p className="text-xs text-slate-400">Read and acknowledge prior to face enrollment</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300 mb-6">
          <p className="leading-relaxed">
            This system uses advanced AI microservices to process facial features for secure identity verification.
          </p>

          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100 block">Vector Embedding Storage Only</span>
                <span className="text-xs text-slate-400">
                  Your uploaded or captured facial image is processed transiently in memory to extract a 128-dimensional mathematical vector. Raw facial images are <strong>never stored</strong> on our servers.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <EyeOff className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100 block">Biometric Privacy Guarantee</span>
                <span className="text-xs text-slate-400">
                  Facial embeddings are stored with strict database privacy flags (`select: false`) and are never exposed in public API responses.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Trash2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100 block">Complete Control & Deletion Rights</span>
                <span className="text-xs text-slate-400">
                  You can permanently purge your enrolled facial biometric vector from your user profile at any time.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onDecline}
            className="btn-secondary text-sm"
          >
            Decline & Cancel
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="btn-primary text-sm"
          >
            <Check className="w-4 h-4" />
            <span>I Consent & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsentModal;
