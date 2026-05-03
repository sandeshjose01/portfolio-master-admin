"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, Briefcase, User, Code, Sparkles, ShieldCheck, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const nav = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Home & Security', href: '/admin/home', icon: <ShieldCheck size={18} /> },
    { name: 'Projects', href: '/admin/projects', icon: <Briefcase size={18} /> },
    { name: 'Skills', href: '/admin/skills', icon: <Code size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden">
      {/* HAMBURGER TOGGLE */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-8 left-8 z-[100] p-4 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 hover:scale-110 transition-all shadow-2xl"
      >
        <Menu size={24} className="text-blue-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-[300px] z-[120] bg-zinc-950 border-r border-white/10 p-10 flex flex-col">
              <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8"><X /></button>
              <h2 className="text-2xl font-black italic text-blue-500 mb-16 mt-4">SJ.STUDIO</h2>
              <nav className="flex-1 space-y-4">
                {nav.map(item => (
                  <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                    {item.icon} {item.name}
                  </Link>
                ))}
              </nav>
              <button className="mt-auto text-red-500 font-black text-[10px] uppercase tracking-widest p-4 hover:bg-red-500/10 rounded-2xl flex items-center gap-2">
                <LogOut size={16} /> Terminate Session
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="w-full h-screen overflow-y-auto hide-scrollbar">{children}</main>
    </div>
  );
}
