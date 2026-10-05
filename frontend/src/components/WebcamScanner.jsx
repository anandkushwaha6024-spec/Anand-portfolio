import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle2, AlertCircle, Image as ImageIcon, Video, Sparkles, SwitchCamera } from 'lucide-react';

const WebcamScanner = ({ onCapture, isProcessing, mode = 'identify' }) => {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Enumerate available video input devices
  const getCameraDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');
      setVideoDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Unable to enumerate camera devices:', err);
    }
  }, [selectedDeviceId]);

  // Initialize WebRTC Video Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const videoConstraints = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      };

      if (selectedDeviceId) {
        videoConstraints.deviceId = { exact: selectedDeviceId };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      getCameraDevices();
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access webcam. Please verify camera permissions or upload an image file instead.');
      setIsCameraActive(false);
    }
  }, [selectedDeviceId, getCameraDevices]);

  // Stop WebRTC Camera Stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab, capturedImage, selectedDeviceId, startCamera, stopCamera]);

  // Capture Snapshot from Video stream
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    // Mirror image for realistic webcam feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(base64Data);
    stopCamera();
  };

  // Handle File Drag & Drop or Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const handleSubmit = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="w-full glass-panel p-5">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              setCapturedImage(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'camera'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Webcam Camera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setCapturedImage(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'upload'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image File</span>
          </button>
        </div>

        {/* Multi-Camera Device Selector */}
        {activeTab === 'camera' && videoDevices.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <SwitchCamera className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="glass-input text-xs py-1 px-2.5 bg-slate-900 border-slate-700"
            >
              {videoDevices.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-[4/3] max-w-xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl">
        {/* Hidden Canvas element for snapshot rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {capturedImage ? (
          /* Preview captured image */
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured preview"
              className="w-full h-full object-cover"
            />
            {/* Visual bounding overlay indicator */}
            <div className="absolute inset-0 border-2 border-cyan-400/60 rounded-2xl pointer-events-none" />
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Image Captured Ready</span>
            </div>
          </div>
        ) : activeTab === 'camera' ? (
          /* Live Camera Stream */
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
            {cameraError ? (
              <div className="p-6 text-center max-w-md">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="text-sm text-slate-300 mb-4">{cameraError}</p>
                <button type="button" onClick={startCamera} className="btn-secondary text-xs mx-auto">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera Permission</span>
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />

                {/* Target Face Frame Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Face Alignment Oval */}
                  <div className="w-56 h-72 rounded-[50%] border-2 border-dashed border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative">
                    <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-[50%] animate-pulse-ring" />
                  </div>
                  {/* Scanline Effect */}
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-scanline" />
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/30 text-xs font-medium text-cyan-300">
                  Align face inside the target frame
                </div>
              </>
            )}
          </div>
        ) : (
          /* File Drag & Drop Uploader */
          <label className="w-full h-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-200 mb-1">
              Click to upload or drag & drop image
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Supports JPEG, PNG, WebP (Max size 5MB)
            </p>
            <span className="btn-secondary text-xs">Browse Local Files</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="mt-5 flex items-center justify-center gap-3">
        {capturedImage ? (
          <>
            <button
              type="button"
              onClick={handleRetake}
              disabled={isProcessing}
              className="btn-secondary text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Image</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="btn-primary text-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing AI Extraction...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{mode === 'enroll' ? 'Submit for Enrollment' : 'Identify Face Now'}</span>
                </>
              )}
            </button>
          </>
        ) : activeTab === 'camera' && isCameraActive ? (
          <button
            type="button"
            onClick={capturePhoto}
            disabled={isProcessing}
            className="btn-primary text-sm px-6"
          >
            <Camera className="w-4 h-4" />
            <span>Capture Photo</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default WebcamScanner;
