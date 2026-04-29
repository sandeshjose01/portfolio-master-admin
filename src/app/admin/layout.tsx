"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Briefcase, Rocket, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { n: "Home", p: "/admin/home", i: <Home size={20}/> },
    { n: "Experience", p: "/admin/experience", i: <Briefcase size={20}/> },
    { n: "Projects", p: "/admin/projects", i: <Rocket size={20}/> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row">
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center justify-between p-6 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-[100]">
        <span className="font-black tracking-tighter text-xl">SJ.ADMIN</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-white/5 rounded-xl">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-0 z-[90] bg-black lg:relative lg:translate-x-0 lg:w-72 lg:bg-transparent
        transition-transform duration-300 p-6 flex flex-col gap-4 border-r border-white/5
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="hidden lg:block text-2xl font-black text-blue-500 mb-8 text-center italic">SJ.STUDIO</div>
        <nav className="flex flex-col gap-2 flex-1">
          {menu.map(item => (
            <Link 
              key={item.p} 
              href={item.p} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${pathname === item.p ? 'bg-blue-600 text-white' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
            >
              {item.i} {item.n}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
