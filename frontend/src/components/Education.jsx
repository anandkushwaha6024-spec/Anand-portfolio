import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, BookOpen, Award, CheckCircle2 } from 'lucide-react';

const educationData = [
  {
    degree: 'Bachelor of Technology (B.Tech)',
    branch: 'Information Technology',
    duration: '2023 – 2027',
    status: 'Currently Pursuing',
    description:
      'Pursuing a comprehensive curriculum in Information Technology focusing on core Computer Science principles, Software Engineering, Data Structures & Algorithms, Database Management Systems, and Modern Web Application Architectures.',
    subjects: [
      'Data Structures & Algorithms (Java)',
      'Full Stack Web Development (MERN)',
      'Database Management Systems (SQL & MongoDB)',
      'Object Oriented Programming',
      'Operating Systems & Networks',
    ],
  },
];

function Education() {
  return (
    <section id="education" className="py-24 relative overflow-hidden bg-slate-950/60">
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
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            My <span className="text-gradient">Education</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Academic qualifications and computer science engineering coursework foundation.
          </p>
        </motion.div>

        {/* Modern Timeline Container */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical Glowing Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-600 to-indigo-600 transform -translate-x-1/2 hidden sm:block opacity-40" />

          {educationData.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline Node Icon (Center Desktop / Left Mobile) */}
              <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 top-0 mb-4 sm:mb-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/25">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Education Card Box */}
              <div className="sm:w-[calc(50%-2.5rem)] ml-auto sm:ml-0 glass-panel p-6 sm:p-8 space-y-5 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl">
                
                {/* Duration Badge & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.duration}</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {edu.status}
                  </span>
                </div>

                {/* Degree & Branch */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white">{edu.degree}</h3>
                  <p className="text-lg font-semibold text-gradient">{edu.branch}</p>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed">
                  {edu.description}
                </p>

                {/* Key Coursework Focus */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Core Engineering Coursework:
                  </h4>
                  <div className="space-y-2">
                    {edu.subjects.map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Education;
