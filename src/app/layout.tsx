"use client";
import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
  }, []);

  if (loading) return <html lang="en"><body className="bg-[#020617] flex items-center justify-center h-screen text-white font-black">BOOTING...</body></html>;

  if (!user) {
    return (
      <html lang="en"><body className="bg-[#020617] flex items-center justify-center h-screen p-6">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 text-center shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tighter">MASTER LOGIN</h2>
          <form onSubmit={async (e:any) => {
            e.preventDefault();
            try { await signInWithEmailAndPassword(auth, e.target.email.value, e.target.pass.value); }
            catch(err:any) { alert(err.message); }
          }} className="space-y-4">
            <input name="email" type="email" placeholder="Email" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none text-center" />
            <input name="pass" type="password" placeholder="Passcode" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none text-center" />
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-full font-black uppercase text-[10px] tracking-widest mt-4">Initialize Session</button>
          </form>
        </div>
      </body></html>
    );
  }

  const menu = [
    { n: "Home", p: "/admin/home", i: "🏠" },
    { n: "About Me", p: "/admin/about", i: "👤" },
    { n: "Skills", p: "/admin/skills", i: "⚡" },
    { n: "Education", p: "/admin/education", i: "🎓" },
    { n: "Experience", p: "/admin/experience", i: "💼" },
    { n: "Projects", p: "/admin/projects", i: "🚀" },
    { n: "More", p: "/admin/more", i: "✨" },
  ];

  return (
    <html lang="en">
      <body className="bg-[#020617] text-slate-100 flex h-screen overflow-hidden">
        <aside className="w-72 m-4 rounded-[2.5rem] p-6 flex flex-col gap-4 bg-white/5 backdrop-blur-3xl border border-white/10">
          <div className="text-2xl font-black text-blue-500 mb-8 text-center tracking-tighter italic">SJ.STUDIO</div>
          <nav className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2">
            {menu.map(item => (
              <Link key={item.p} href={item.p} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${pathname === item.p ? 'bg-blue-600 text-white shadow-xl' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}>
                <span className="text-lg">{item.i}</span> {item.n}
              </Link>
            ))}
          </nav>
          <button onClick={() => signOut(auth)} className="mt-4 text-red-500 font-bold text-[10px] uppercase py-4 rounded-2xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all">Logout</button>
        </aside>
        <main className="flex-1 overflow-y-auto p-12 pt-24">{children}</main>
      </body>
    </html>
  );
}
