"use client";
import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => { 
      setUser(u); 
      setLoading(false); 
    });
  }, []);

  // --- BOOTING SCREEN ---
  if (loading) {
    return (
      <html lang="en">
        <body className="bg-[#020617] flex items-center justify-center h-screen text-white font-black uppercase tracking-[0.5em] text-[10px]">
          Initializing SJ.Studio...
        </body>
      </html>
    );
  }

  // --- LOGIN SCREEN (Shown if not logged in) ---
  if (!user) {
    return (
      <html lang="en">
        <body className="bg-[#020617] flex items-center justify-center h-screen p-6">
          <div className="max-w-md w-full bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 text-center shadow-2xl">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase italic">Master Login</h2>
            <form onSubmit={async (e:any) => {
              e.preventDefault();
              try { 
                await signInWithEmailAndPassword(auth, e.target.email.value, e.target.pass.value); 
              } catch(err:any) { 
                alert("Access Denied: " + err.message); 
              }
            }} className="space-y-4">
              <input name="email" type="email" placeholder="Admin Email" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none text-center placeholder:opacity-30" />
              <input name="pass" type="password" placeholder="Passcode" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none text-center placeholder:opacity-30" />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-full font-black uppercase text-[10px] tracking-widest mt-4 hover:bg-blue-500 transition-all active:scale-95">
                Initialize Session
              </button>
            </form>
          </div>
        </body>
      </html>
    );
  }

  // --- LOGGED IN STATE (No Sidebar here) ---
  return (
    <html lang="en">
      <body className="bg-[#020202] text-slate-100 selection:bg-blue-500/30">
        {/* We simply return the children. 
            The admin/layout.tsx will provide the Hamburger Menu. */}
        {children}
      </body>
    </html>
  );
}
