"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LayoutDashboard, Briefcase, User, 
  Code, GraduationCap, LogOut, Sparkles, ShieldCheck, ChevronRight 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  /* -----------------------------------------------------------
     SECTION 1: SIDEBAR CONFIGURATION (Edit your Menu Links here)
     ----------------------------------------------------------- */
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const MENU_LINKS = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Home & Security', href: '/admin/home', icon: <ShieldCheck size={18} /> },
    { name: 'Projects', href: '/admin/projects', icon: <Briefcase size={18} /> },
    { name: 'Skills', href: '/admin/skills', icon: <Code size={18} /> },
    { name: 'Experience', href: '/admin/experience', icon: <Sparkles size={18} /> },
    { name: 'Education', href: '/admin/education', icon: <GraduationCap size={18} /> },
  ];

  /* -----------------------------------------------------------
     SECTION 2: RENDER LOGIC
     ----------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden selection:bg-blue-500/30">
      
      {/* HAMBURGER TRIGGER */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-8 left-8 z-[100] p-4 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 hover:scale-110 active:scale-95 transition-all shadow-2xl"
      >
        <Menu size={24} className="text-blue-500" />
      </button>

      {/* GLASS SIDEBAR PANEL */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]" />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[320px] z-[120] bg-zinc-950/40 backdrop-blur-3xl border-r border-white/10 p-10 flex flex-col"
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
              
              <div className="mb-16 mt-4">
                <h2 className="text-2xl font-black italic tracking-tighter text-blue-500 uppercase">SJ.STUDIO</h2>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-1 italic">Boss Edition Console</p>
              </div>

              <nav className="flex-1 space-y-2 overflow-y-auto hide-scrollbar">
                {MENU_LINKS.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${pathname === item.href ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-4">{item.icon} <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span></div>
                    {pathname === item.href && <ChevronRight size={14} />}
                  </Link>
                ))}
              </nav>

              <button className="mt-10 flex items-center gap-4 px-6 py-5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20">
                <LogOut size={18} /> <span>Terminate Session</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full h-screen overflow-y-auto hide-scrollbar">{children}</main>
    </div>
  );
}
