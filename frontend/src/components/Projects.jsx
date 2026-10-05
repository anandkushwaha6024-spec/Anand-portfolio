import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, FolderGit2, Sparkles, Scan, LayoutGrid } from 'lucide-react';

const projects = [
  {
    id: 'face-id',
    title: 'Face Identification System',
    description:
      'Developed a face identification system using computer vision and modern web technologies. The system allows users to identify faces through an interactive application with high precision and low latency.',
    featured: true,
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'FastAPI', 'OpenCV'],
    githubUrl: 'https://github.com/anandkushwaha/face-identification-system',
    liveUrl: 'https://face-id-demo.example.com',
    icon: Scan,
    gradient: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/20',
  },
  {
    id: 'task-management',
    title: 'Full Stack Task Management System',
    description:
      'A comprehensive web application designed to streamline personal and team productivity with real-time updates, task assignments, and progress analytics.',
    featured: false,
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/anandkushwaha/task-management-app',
    liveUrl: 'https://task-demo.example.com',
    icon: LayoutGrid,
    gradient: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
  },
];

function Projects() {
  return (
    <section id="projects" className="py-24 relative overflow-hidden">
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
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Work</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Selected <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Showcase of real-world full-stack web applications and software systems built with modern tech stacks.
          </p>
        </motion.div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, idx) => {
            const ProjectIcon = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative"
              >
                {/* Background Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" />

                <div className="relative glass-panel p-6 sm:p-8 space-y-6 flex flex-col justify-between h-full border border-slate-800/90 group-hover:border-cyan-500/50 transition-all">
                  
                  {/* Top Card Info */}
                  <div className="space-y-4">
                    {/* Badge & Icon Header */}
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 shadow-inner group-hover:scale-105 transition-transform">
                        <ProjectIcon className="w-6 h-6" />
                      </div>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                          <Sparkles className="w-3.5 h-3.5" />
                          Featured Project
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Tags & Action Buttons */}
                  <div className="space-y-6 pt-4 border-t border-slate-800/80">
                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-4">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 group/btn"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 border-slate-700 hover:border-cyan-500/40"
                      >
                        <Github className="w-4 h-4 text-cyan-400" />
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Projects;
