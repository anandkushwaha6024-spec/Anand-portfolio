import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import WebcamScanner from '../components/WebcamScanner';
import PrivacyConsentModal from '../components/PrivacyConsentModal';
import { UserPlus, CheckCircle2, ShieldCheck, ArrowRight, Lock, AlertCircle } from 'lucide-react';

const FaceEnrollmentPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [hasConsented, setHasConsented] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(!hasConsented);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAcceptConsent = () => {
    setHasConsented(true);
    setShowConsentModal(false);
  };

  const handleDeclineConsent = () => {
    setShowConsentModal(false);
    navigate('/dashboard');
  };

  const handleEnrollFace = async (imageBase64) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await api.post('/face/enroll', {
        imageBase64,
        userId: user._id
      });

      if (res.data.success) {
        setEnrollSuccess(true);
        updateUserProfile({ isFaceEnrolled: true });
        showToast(res.data.message || 'Face successfully enrolled!', 'success');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      const msg = err.response?.data?.message || 'Face enrollment failed. Ensure a single face is clearly visible.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Privacy Consent Modal */}
      <PrivacyConsentModal
        isOpen={showConsentModal}
        onAccept={handleAcceptConsent}
        onDecline={handleDeclineConsent}
      />

      {/* Header Banner */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Face Biometric Enrollment</h1>
            <p className="text-xs text-slate-400">
              Register your facial vector embedding for automated AI identification.
            </p>
          </div>
        </div>
      </div>

      {/* Consent Reminder Badge */}
      {!hasConsented && (
        <div className="glass-panel p-4 bg-cyan-950/20 border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Biometric Privacy Consent required before camera capture.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowConsentModal(true)}
            className="btn-secondary text-xs"
          >
            Review Consent Policy
          </button>
        </div>
      )}

      {/* Error Message Box */}
      {errorMessage && (
        <div className="glass-panel p-4 bg-rose-950/30 border-rose-500/40 flex items-center gap-3 text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Enrollment Scanner or Success State */}
      {enrollSuccess ? (
        <div className="glass-panel p-8 text-center border-emerald-500/40 bg-emerald-950/20 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">Face Enrolled Successfully!</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Your 128-dimensional facial vector embedding has been processed and saved securely in MongoDB.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setEnrollSuccess(false)}
              className="btn-secondary text-sm"
            >
              Re-enroll Face
            </button>
            <button
              onClick={() => navigate('/identify')}
              className="btn-primary text-sm"
            >
              <span>Test Face Identification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <WebcamScanner
          onCapture={handleEnrollFace}
          isProcessing={isProcessing}
          mode="enroll"
        />
      )}
    </div>
  );
};

export default FaceEnrollmentPage;
