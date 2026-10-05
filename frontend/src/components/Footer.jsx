import React from 'react';
import { Github, Linkedin, Code, Code2 } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Subtitle */}
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-lg font-bold text-white">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <span>Anand Kushwaha</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Full Stack Developer | DSA with Java
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://leetcode.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LeetCode Profile"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-all"
          >
            <Code className="w-4 h-4 text-amber-400" />
          </a>
        </div>

        {/* Copyright Notice */}
        <div className="text-center md:text-right text-xs text-slate-500 font-mono">
          © 2026 Anand Kushwaha. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
