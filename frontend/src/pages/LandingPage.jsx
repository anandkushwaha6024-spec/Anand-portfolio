import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, ShieldCheck, Cpu, Zap, ArrowRight, UserPlus, Lock, CheckCircle2, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Next-Gen Full-Stack AI Facial Recognition System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
          Production-Ready <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
            Face Identification System
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Powered by React, Node.js Express REST APIs, MongoDB, and a high-performance Python OpenCV AI service extracting 128-dimensional biometric vector embeddings.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link to="/login" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
            <span>Sign In to Portal</span>
          </Link>
        </div>

        {/* System Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          <div className="glass-panel p-6 glass-panel-hover">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Python OpenCV Microservice</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dedicated Python FastAPI microservice providing `/detect`, `/encode`, and `/compare` endpoints with OpenCV single-face validation.
            </p>
          </div>

          <div className="glass-panel p-6 glass-panel-hover">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Biometric Privacy Guard</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Zero raw image retention. Facial images are processed transiently into 128d mathematical vector arrays stored securely in MongoDB.
            </p>
          </div>

          <div className="glass-panel p-6 glass-panel-hover">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Real-Time WebRTC Scanner</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Live webcam capture with face alignment target frame, multi-face rejection, instant snapshot processing, and confidence scoring.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Face Identification System &copy; 2026. B.Tech Major AI Project.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React.js + Vite</span>
            <span>•</span>
            <span>Node.js Express</span>
            <span>•</span>
            <span>MongoDB</span>
            <span>•</span>
            <span>Python FastAPI & OpenCV</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
