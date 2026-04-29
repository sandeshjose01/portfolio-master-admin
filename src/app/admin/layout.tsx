"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Menu, X, Home, Briefcase, Rocket, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { n: "Home & Security", p: "/admin/home", i: <Home size={20}/> },
    { n: "Experience", p: "/admin/experience", i: <Briefcase size={20}/> },
    { n: "Projects", p: "/admin/projects", i: <Rocket size={20}/> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center justify-between p-5 border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-[110]">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm italic">SJ</div>
            <span className="font-black tracking-tighter text-lg uppercase">Admin Panel</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-white/5 rounded-xl border border-white/10">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE BACKDROP */}
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] bg-[#0a0a0a] lg:relative lg:translate-x-0 lg:w-72 lg:bg-transparent
        transition-transform duration-500 ease-in-out p-6 flex flex-col gap-4 border-r border-white/5
        ${isOpen ? "translate-x-0 w-[280px]" : "-translate-x-full"}
      `}>
        <div className="hidden lg:flex items-center gap-3 px-4 py-6 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-blue-600/20">SJ</div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none">STUDIO</span>
            <span className="text-[9px] font-bold opacity-30 tracking-[0.3em]">ADMIN V1.0</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menu.map(item => (
            <Link key={item.p} href={item.p} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all border ${pathname === item.p ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'opacity-40 border-transparent hover:opacity-100 hover:bg-white/5'}`}>
              {item.i} {item.n}
            </Link>
          ))}
        </nav>

        <button onClick={async () => { if(confirm("Logout?")){ await signOut(auth); window.location.href = "/"; } }} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all">
            <LogOut size={20}/> Logout Session
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
