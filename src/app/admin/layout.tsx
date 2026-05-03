"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, LayoutDashboard, Briefcase, 
  User, Code, GraduationCap, LogOut, Sparkles, ShieldCheck 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Home & Security', href: '/admin/home', icon: <ShieldCheck size={18} /> },
    { name: 'About Me', href: '/admin/about', icon: <User size={18} /> },
    { name: 'Skills', href: '/admin/skills', icon: <Code size={18} /> },
    { name: 'Education', href: '/admin/education', icon: <GraduationCap size={18} /> },
    { name: 'Experience', href: '/admin/experience', icon: <Sparkles size={18} /> },
    { name: 'Projects', href: '/admin/projects', icon: <Briefcase size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden">
      
      {/* 3-LINE MENU TOGGLE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-[100] p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/20 transition-all active:scale-90"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 h-full bg-[#050505] border-r border-white/5 z-[90]
        transition-all duration-500 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
      `}>
        <div className="p-8 flex flex-col h-full overflow-hidden">
          <div className="mb-12 mt-10">
             <h2 className="text-xl font-black italic tracking-tighter text-blue-500 uppercase">SJ.STUDIO</h2>
             <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Command Center</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-widest
                    ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <button className="mt-auto flex items-center gap-4 px-4 py-4 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={18} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-500 ${isOpen ? 'pl-64' : 'pl-0'}`}>
        <div className="h-full w-full overflow-y-auto hide-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
