import React from 'react';
import { X, Download, ExternalLink, GraduationCap, Code2, FolderGit2, Mail, Github, Linkedin, Code } from 'lucide-react';

function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Open resume.pdf in a new tab or trigger direct download
    window.open('/resume.pdf', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl custom-scrollbar">
        
        {/* Header Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              Curriculum Vitae
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Anand_Kushwaha_Resume.pdf</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download / Open PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clean Resume Paper Body */}
        <div className="glass-panel p-6 sm:p-8 space-y-8 border border-slate-800/90 text-slate-200">
          
          {/* Resume Name & Contact Header */}
          <div className="border-b border-slate-800 pb-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Anand Kushwaha</h1>
              <p className="text-cyan-400 font-semibold text-sm mt-1">
                Full Stack Developer | DSA with Java | B.Tech IT (2023–2027)
              </p>
            </div>
            <div className="text-xs text-slate-400 space-y-1 text-center sm:text-right font-mono">
              <p>Email: anandkushwaha6024@gmail.com</p>
              <p>GitHub: github.com/anandkushwaha</p>
              <p>LinkedIn: linkedin.com/in/anandkushwaha</p>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" /> Professional Summary
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Aspiring Full Stack Web Developer & B.Tech Information Technology student (2023–2027). Skilled in building modern, responsive MERN stack applications and solving algorithmic problems using Java and Data Structures & Algorithms. Passionate about clean code, computer vision integrations, and real-world software architecture.
            </p>
          </div>

          {/* Education */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" /> Education
            </h2>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">Bachelor of Technology (B.Tech)</h3>
                <p className="text-xs text-cyan-400 font-semibold">Information Technology</p>
              </div>
              <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                2023 – 2027
              </span>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" /> Core Technical Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Frontend:</span>
                <span className="text-slate-200">HTML5, CSS3, JavaScript (ES6+), React.js, Tailwind CSS</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Backend & Database:</span>
                <span className="text-slate-200">Node.js, Express.js, REST APIs, MongoDB, SQL</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Programming Languages:</span>
                <span className="text-slate-200">Java, Data Structures & Algorithms (DSA), JavaScript</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Tools & Platforms:</span>
                <span className="text-slate-200">Git, GitHub, VS Code, Postman, ESLint, Vite</span>
              </div>
            </div>
          </div>

          {/* Featured Projects */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" /> Featured Projects
            </h2>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-sm">Face Identification System</h3>
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">Computer Vision</span>
                </div>
                <p className="text-slate-300">
                  Developed an interactive face identification system using OpenCV, Python, FastAPI, React.js, Node.js, Express.js, and MongoDB.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <h3 className="font-bold text-white text-sm">Full Stack Task Management System</h3>
                <p className="text-slate-300">
                  Built a real-time team task manager app using React.js, Node.js, Express.js, MongoDB, and Tailwind CSS.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ResumeModal;
