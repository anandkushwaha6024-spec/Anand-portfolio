import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Code, ArrowRight, Mail, Terminal, Sparkles } from 'lucide-react';

function Hero() {
  return (
    <section id="home" className="min-h-screen pt-28 pb-16 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-sm font-medium shadow-md shadow-cyan-950/40">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>Available for Software Development Roles</span>
            </div>

            {/* Greeting & Main Heading */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-300">
                Hi, I'm <span className="text-white font-bold">Anand Kushwaha</span>
              </h2>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                <span className="text-gradient">Full Stack</span> <br className="hidden sm:inline" />
                <span className="text-white">Developer</span>
              </h1>
            </div>

            {/* Subtitle / Spec Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                DSA with Java
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 text-sm font-semibold">
                MERN Stack
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              I build modern, responsive and scalable web applications using modern web technologies. Focused on writing efficient algorithms and clean code.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 group"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="btn-secondary w-full sm:w-auto px-8 py-3.5 text-base border-slate-700 hover:border-cyan-500/40"
              >
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-4">
              <span className="text-sm font-medium text-slate-400">Connect:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all shadow-md"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all shadow-md"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://leetcode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode Profile"
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all shadow-md flex items-center gap-1 font-semibold text-xs"
                >
                  <Code className="w-5 h-5 text-amber-400" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Glowing Outer Card Frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-30 animate-pulse" />
              
              <div className="relative glass-panel p-6 sm:p-8 space-y-6 border border-slate-700/60 shadow-2xl">
                {/* Code Terminal Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">developer.java</span>
                </div>

                {/* Simulated Code Snippet */}
                <div className="font-mono text-xs sm:text-sm space-y-2 text-slate-300">
                  <p><span className="text-purple-400">class</span> <span className="text-cyan-400">Developer</span> &#123;</p>
                  <p className="pl-4"><span className="text-purple-400">String</span> name = <span className="text-emerald-400">"Anand Kushwaha"</span>;</p>
                  <p className="pl-4"><span className="text-purple-400">String</span> role = <span className="text-emerald-400">"Full Stack Developer"</span>;</p>
                  <p className="pl-4"><span className="text-purple-400">String</span> specialization = <span className="text-emerald-400">"DSA with Java"</span>;</p>
                  <p className="pl-4"><span className="text-purple-400">String[]</span> stack = &#123;<span className="text-amber-400">"React"</span>, <span className="text-amber-400">"Node"</span>, <span className="text-amber-400">"MongoDB"</span>&#125;;</p>
                  <p className="pl-4"><span className="text-purple-400">boolean</span> isReadyToBuild = <span className="text-cyan-400">true</span>;</p>
                  <p>&#125;</p>
                </div>

                {/* Floating Tech Badges */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-400 font-medium">B.Tech IT (2023-2027)</span>
                  </div>
                  <span className="text-cyan-400 font-mono">React.js & Node.js</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
