import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Cpu, FolderGit2, CheckCircle2, User } from 'lucide-react';

const stats = [
  {
    icon: GraduationCap,
    title: 'B.Tech IT',
    subtitle: '2023 – 2027',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
  },
  {
    icon: Code2,
    title: 'Full Stack',
    subtitle: 'Developer',
    color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400',
  },
  {
    icon: Cpu,
    title: 'DSA',
    subtitle: 'Java',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
  },
  {
    icon: FolderGit2,
    title: 'Projects',
    subtitle: 'Multiple',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
  },
];

const highlights = [
  'Building full-stack web applications using MERN stack',
  'Data Structures & Algorithms with Java',
  'Solving algorithmic problems & optimization',
  'Architecting clean, modular & real-world projects',
];

function About() {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>Get To Know Me</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Passionate Information Technology student & Full Stack Developer dedicated to building efficient web software.
          </p>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Developer Avatar Image & Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Profile Frame Container */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
              <div className="relative glass-panel p-8 text-center space-y-6 border border-slate-800">
                
                {/* Profile Photo Display */}
                <div className="w-36 h-36 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-1 shadow-xl shadow-cyan-500/20 overflow-hidden">
                  {!imageError ? (
                    <img
                      src="/profile.jpg"
                      alt="Anand Kushwaha"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center border border-slate-800">
                      <span className="text-4xl font-extrabold text-gradient">AK</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white">Anand Kushwaha</h3>
                  <p className="text-cyan-400 text-sm font-medium">B.Tech IT Student (2023–2027)</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Aspiring Full Stack Engineer</span>
                </div>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`glass-card p-4 flex items-center gap-3 border bg-gradient-to-br ${stat.color}`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight">{stat.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{stat.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side: Detailed Bio & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="glass-panel p-8 space-y-6 border border-slate-800">
              <h3 className="text-2xl font-bold text-white leading-snug">
                I am a B.Tech IT student & passionate aspiring <span className="text-gradient">Full-Stack Developer</span>.
              </h3>
              
              <p className="text-slate-300 leading-relaxed text-base">
                Currently pursuing my Bachelor of Technology in Information Technology (2023–2027). I have a strong foundation in core computer science principles and software engineering practices.
              </p>

              <p className="text-slate-400 leading-relaxed text-base">
                My primary focus revolves around constructing scalable full-stack web applications using <strong className="text-slate-200">React.js, Node.js, Express.js, and MongoDB</strong>, while continuously sharpening my algorithmic problem-solving capabilities using <strong className="text-slate-200">Java and Data Structures & Algorithms (DSA)</strong>.
              </p>

              {/* Key Technical Focus Items */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Currently Working On:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlights.map((item, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default About;
