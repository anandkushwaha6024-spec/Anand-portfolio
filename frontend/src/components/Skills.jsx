import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Server, Database, Cpu, Sparkles } from 'lucide-react';

const skillCategories = [
  {
    category: 'Frontend Development',
    icon: Layout,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    skills: [
      { name: 'HTML5', level: 'Structure & Accessibility', icon: '🌐' },
      { name: 'CSS3', level: 'Responsive & Modern UI', icon: '🎨' },
      { name: 'JavaScript', level: 'ES6+ & Asynchronous', icon: '⚡' },
      { name: 'React.js', level: 'Components & State', icon: '⚛️' },
    ],
  },
  {
    category: 'Backend Development',
    icon: Server,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    skills: [
      { name: 'Node.js', level: 'Event-driven Runtime', icon: '🟢' },
      { name: 'Express.js', level: 'RESTful API Architecture', icon: '🚀' },
    ],
  },
  {
    category: 'Database Management',
    icon: Database,
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    skills: [
      { name: 'MongoDB', level: 'NoSQL & Mongoose ODM', icon: '🍃' },
      { name: 'SQL', level: 'Relational Database & Queries', icon: '🗄️' },
    ],
  },
  {
    category: 'Programming & CS Core',
    icon: Cpu,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    skills: [
      { name: 'Java', level: 'Object-Oriented Programming', icon: '☕' },
      { name: 'DSA', level: 'Data Structures & Algorithms', icon: '🧠' },
    ],
  },
];

function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Tech Stack</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Core technologies and tools I use to craft scalable web applications and solve complex algorithmic problems.
          </p>
        </motion.div>

        {/* Skill Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((cat, catIdx) => {
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className="glass-panel p-6 sm:p-8 space-y-6 border border-slate-800/90 hover:border-slate-700 transition-all"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className={`p-3 rounded-xl bg-slate-900 border shadow-md ${cat.color}`}>
                    <CatIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{cat.category}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {cat.skills.length} core technologies
                    </p>
                  </div>
                </div>

                {/* Skill Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cat.skills.map((skill) => (
                    <motion.div
                      key={skill.name}
                      whileHover={{ scale: 1.03, y: -2 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card p-4 flex items-center gap-3 border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-cyan-500/40 cursor-default group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-xl shadow-inner border border-slate-800 group-hover:border-cyan-500/30">
                        {skill.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                          {skill.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                          {skill.level}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Skills;
