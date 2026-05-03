"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LayoutDashboard, Briefcase, 
  User, Code, GraduationCap, LogOut, Sparkles, ShieldCheck, ChevronRight 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Home & Security', href: '/admin/home', icon: <ShieldCheck size={18} /> },
    { name: 'About Me', href: '/admin/about', icon: <User size={18} /> },
    { name: 'Skills', href: '/admin/skills', icon: <Code size={18} /> },
    { name: 'Experience', href: '/admin/experience', icon: <Sparkles size={18} /> },
    { name: 'Projects', href: '/admin/projects', icon: <Briefcase size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden">
      
      {/* FLOATING HAMBURGER BUTTON */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-8 left-8 z-[100] p-4 glass-container rounded-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <Menu size={24} className="text-blue-500 group-hover:text-white transition-colors" />
      </button>

      {/* OVERLAY GLASS SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />

            {/* The Actual Sidebar */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[300px] z-[120] glass-container !border-y-0 !border-l-0 border-r"
            >
              <div className="p-10 flex flex-col h-full">
                {/* Close Button */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <X size={20} />
                </button>

                {/* Brand */}
                <div className="mb-16 mt-4">
                  <h2 className="text-2xl font-black italic tracking-tighter text-blue-500 uppercase">SJ.STUDIO</h2>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-1">Boss Edition</p>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-3">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center justify-between px-5 py-4 rounded-2xl transition-all group
                          ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'hover:bg-white/5 text-zinc-400 hover:text-white'}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          {item.icon}
                          <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                        </div>
                        {isActive && <ChevronRight size={14} />}
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer / Logout */}
                <button className="mt-auto flex items-center gap-4 px-5 py-5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20">
                  <LogOut size={18} />
                  <span>Terminate Session</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* PAGE CONTENT */}
      <main className="flex-1 w-full h-screen overflow-y-auto hide-scrollbar">
        {children}
      </main>
    </div>
  );
}
