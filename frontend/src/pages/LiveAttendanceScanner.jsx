import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../services/apiClient';
import Button from '../components/Button';
import AttendanceTable from '../components/AttendanceTable';
import { Camera, CheckCircle2, AlertCircle, Play, Square, RefreshCw } from 'lucide-react';

const LiveAttendanceScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Camera idle. Click "Start Attendance Scanner" to begin.');
  const [lastIdentifiedStudent, setLastIdentifiedStudent] = useState(null);
  const [liveScans, setLiveScans] = useState([]);
  const [confidence, setConfidence] = useState(0);

  const intervalRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        setStatusMessage('Scanning webcam frames for faces...');
      }
    } catch (err) {
      console.error('Webcam access error:', err);
      setStatusMessage('Camera error: Unable to access camera device.');
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setStatusMessage('Camera scanner stopped.');
  };

  // Periodic Frame Processing Loop (every 2.5 seconds)
  useEffect(() => {
    if (isScanning) {
      intervalRef.current = setInterval(() => {
        captureAndRecognizeFrame();
      }, 2500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isScanning]);

  const captureAndRecognizeFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL('image/jpeg', 0.85);

    try {
      setStatusMessage('Recognizing face against database...');
      const res = await apiClient.post('/attendance/recognize-and-mark', {
        imageBase64,
        threshold: 0.70
      });

      if (res.data.success && res.data.matched) {
        const { student, confidencePercentage, alreadyMarked, record } = res.data;
        setConfidence(confidencePercentage || 94);
        setLastIdentifiedStudent(student);

        if (alreadyMarked) {
          setStatusMessage(`⚠️ Attendance already marked today for ${student.name} (${student.rollNumber}).`);
        } else {
          setStatusMessage(`✅ ${student.name} (${student.rollNumber}) identified! Attendance marked successfully.`);
          if (record) {
            setLiveScans((prev) => [record, ...prev]);
          }
        }
      } else {
        setStatusMessage(res.data.message || 'Face not recognized.');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setStatusMessage('Scan error communicating with AI server.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-400" />
            Live Camera Attendance Scanner
          </h2>
          <p className="text-xs text-slate-400">Automated facial recognition & instant attendance logger</p>
        </div>

        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startCamera} variant="success" className="flex items-center gap-2">
              <Play className="h-4 w-4" /> Start Scanner
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="danger" className="flex items-center gap-2">
              <Square className="h-4 w-4" /> Stop Scanner
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Webcam Viewport Frame */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col items-center justify-center min-h-[380px]">
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hidden" />

            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-center p-6">
                <Camera className="h-16 w-16 text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-300">Camera Scanner is Stopped</p>
                <p className="text-xs text-slate-500 mt-1">Click "Start Scanner" above to launch live attendance.</p>
              </div>
            )}
          </div>

          {/* Scanner Status Bar */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${isScanning ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`}></div>
            <p className="text-xs font-semibold text-slate-200">{statusMessage}</p>
          </div>
        </div>

        {/* Real-time Result Overlay Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white">Latest Identified Student</h3>

            {lastIdentifiedStudent ? (
              <div className="space-y-3 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-extrabold text-lg border border-blue-500/30">
                    {lastIdentifiedStudent.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{lastIdentifiedStudent.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">{lastIdentifiedStudent.rollNumber || 'Roll N/A'}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <p>Department: <span className="text-slate-200">{lastIdentifiedStudent.department || 'CSE'}</span></p>
                  <p>AI Match Confidence: <span className="font-mono text-emerald-400 font-bold">{confidence}%</span></p>
                  <p>Status: <span className="text-emerald-400 font-semibold">PRESENT</span></p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Waiting for student face match...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Session Scans Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4">Today's Live Scanned Session Logs</h3>
        <AttendanceTable records={liveScans} />
      </div>
    </div>
  );
};

export default LiveAttendanceScanner;
