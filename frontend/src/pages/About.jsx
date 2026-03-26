import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code2, Server, Cpu } from 'lucide-react';
import { Vortex } from '@/components/ui/vortex';

import sumantImg from '@/assets/sumant.jpeg';
import atharvImg from '@/assets/atharv.jpeg';
import prathameshImg from '@/assets/prathamesh.jpeg';

const About = () => {
  const team = [
    {
      name: "Sumant Khalatkar",
      role: "Full-Stack Engineer",
      bio: "Architects robust, high-performance web applications using the MERN stack while actively integrating machine learning models to build seamless, intelligent platforms.",
      icon: <Code2 className="text-cyan-400" size={20} />,
      image: sumantImg,
      links: { github: "https://github.com/SumantK13", linkedin: "https://www.linkedin.com/in/sumant-khalatkar-549899290/", email: "mailto:smntkhalatkar@gmail.com" }
    },
    {
      name: "Atharv Gavade",
      role: "Backend Engineer",
      bio: "Focuses on building scalable server-side architectures, secure API integrations, and efficient database management to power complex financial operations.",
      icon: <Server className="text-purple-400" size={20} />,
      image: atharvImg,
      links: { github: "https://github.com/Atharv-72", linkedin: "https://www.linkedin.com/in/atharv-gavade/", email: "mailto:gavadeatharv@gmail.com" }
    },
    {
      name: "Prathamesh Talekar",
      role: "Backend & ML Engineer",
      bio: "Specializes in developing advanced AI neural engines, data pipelines, and intelligent backend systems to accurately predict financial risk and automate decisions.",
      icon: <Cpu className="text-emerald-400" size={20} />,
      image: prathameshImg,
      links: { github: "https://github.com/Prathamesht-14", linkedin: "https://www.linkedin.com/in/prathamesh-talekar-919a40308/", email: "mailto:prathameshtalekar18@gmail.com" }
    }
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />

      {/* THE VORTEX HERO SECTION - HEIGHT REDUCED TO 45vh */}
      <div className="w-full h-[45vh] relative">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={250}       
          baseHue={190}             
          baseSpeed={0.0}           
          rangeSpeed={0.4}          
          className="flex items-center flex-col justify-center px-4 w-full h-full pt-20"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md shadow-xl">
              <Code2 size={14} /> Meet the Creators
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white drop-shadow-2xl">
              The minds behind <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                CreditWiseAi.
              </span>
            </h1>
            
            <p className="text-neutral-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              We are a team of developers passionate about leveraging artificial intelligence, clean architecture, and intuitive design to demystify personal finance.
            </p>
          </motion.div>
        </Vortex>
        
        {/* Fading gradient to blend into the grid section - Made shorter */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20"></div>
      </div>

      {/* TEAM GRID - PULLED UP TIGHTER */}
      <main className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch"
        >
          {team.map((member, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="group relative h-full flex flex-col bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-neutral-900/60 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>

              <div className="relative z-10 flex flex-col items-center text-center h-full">
                
                <div className="relative w-32 h-32 mb-6 shrink-0">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-purple-400 group-hover:rotate-180 transition-transform duration-700 ease-in-out"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover rounded-full border border-white/10 p-1 bg-black"
                  />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 shrink-0">{member.name}</h3>
                
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/50 border border-white/5 mb-4 shrink-0">
                  {member.icon}
                  <span className="text-sm font-semibold text-neutral-300">{member.role}</span>
                </div>

                <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-grow">
                  {member.bio}
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10 w-full justify-center shrink-0">
                  <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:scale-110 transition-all shadow-[0_0_15px_rgba(255,255,255,0)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <Github size={18} />
                  </a>
                  <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:scale-110 transition-all shadow-none hover:shadow-[0_0_15px_rgba(10,102,194,0.4)]">
                    <Linkedin size={18} />
                  </a>
                  <a href={member.links.email} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 hover:scale-110 transition-all shadow-none hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Mail size={18} />
                  </a>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </main>
    </div>
  );
};

export default About;