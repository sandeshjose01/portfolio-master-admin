"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Sparkles, ImageIcon, Play, Plus, Briefcase, RefreshCw, ExternalLink, Youtube, Clock, Globe, CheckCircle2 } from 'lucide-react';

export default function InspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [nasa, setNasa] = useState<any>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;
  const NASA_KEY = process.env.NEXT_PUBLIC_NASA_KEY;

  const milestones = [
    { id: 1, name: "Market Research", status: "completed" },
    { id: 2, name: "Logo & Visual Identity", status: "current" },
    { id: 3, name: "Prototype Dev", status: "pending" },
    { id: 4, name: "Portfolio Deployment", status: "pending" },
  ];

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const [pRes, vRes, nRes] = await Promise.all([
        fetch(`https://api.unsplash.com/photos/random?query=minimal-mockup,editorial-design&count=3&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=6`),
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
      ]);
      const pData = await pRes.json();
      const vData = await vRes.json();
      const nData = await nRes.json();
      setPhotos(pData); setVideos(vData.items || []); setNasa(nData);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    getDocs(collection(db, "projects")).then(snap => setProjectCount(snap.size));
    const hr = new Date().getHours();
    const time = hr < 12 ? "Morning" : hr < 18 ? "Afternoon" : "Evening";
    setGreeting(`Good ${time}, Boss`);

    const script = document.createElement("script");
    script.src = "//assets.pinterest.com/js/pinit.js";
    script.async = true;
    script.setAttribute("data-pin-build", "doBuild");
    document.body.appendChild(script);
  }, []);

  return (
    <div className="p-8 lg:p-12 hide-scrollbar">
      
      {/* BOSS HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-16 pl-12 gap-6">
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="flex items-center gap-2 text-blue-500 mb-2 font-black uppercase text-[10px] tracking-[0.4em]">
            <Clock size={12} /> {new Date().toLocaleDateString()}
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            {greeting}
          </h1>
          <p className="text-zinc-600 font-bold text-[9px] uppercase tracking-[0.5em] mt-3">Strategic Inspiration Hub</p>
        </motion.div>

        <div className="flex gap-4">
           <button onClick={() => fetchData(true)} className="p-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
           </button>
           <Link href="/admin/projects" className="bg-white text-black px-10 py-4 rounded-3xl font-black text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
              + START NEW PROJECT
           </Link>
        </div>
      </header>

      {/* THE STUDIO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PINTEREST & LINKS (LEFT) */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bento-card !p-0 h-[650px] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Logo & Mockup Refs</span>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
                 <div className="bg-white rounded-[2rem] overflow-hidden">
                    <a data-pin-do="embedBoard" data-pin-board-width="auto" data-pin-scale-height="800" data-pin-scale-width="120" href="https://www.pinterest.com/sandeshjoshiofficial/creative-references-branding/"></a>
                 </div>
              </div>
           </div>
           <div className="flex gap-4">
              <a href="https://behance.net" target="_blank" className="flex-1 bento-card !p-4 text-center text-[9px] font-black uppercase hover:bg-blue-600 transition-all">Behance</a>
              <a href="https://dribbble.com" target="_blank" className="flex-1 bento-card !p-4 text-center text-[9px] font-black uppercase hover:bg-pink-600 transition-all">Dribbble</a>
           </div>
        </div>

        {/* YOUTUBE LEARNING (MIDDLE) */}
        <div className="lg:col-span-6">
           <div className="bento-card h-full bg-zinc-900/10">
              <div className="flex items-center gap-3 mb-10">
                 <Youtube size={24} className="text-red-600" />
                 <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Design Lab: The Futur</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto hide-scrollbar h-[700px] pb-10">
                {videos.map((v: any) => (
                  <a key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="block group bg-white/5 p-4 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 shadow-2xl">
                       <img src={v.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all"><Play fill="white" size={32} /></div>
                    </div>
                    <h3 className="text-[9px] font-bold uppercase leading-relaxed tracking-tighter">{v.snippet.title}</h3>
                  </a>
                ))}
              </div>
           </div>
        </div>

        {/* STATS & NASA (RIGHT) */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bento-card bg-blue-600 border-none h-[140px] flex items-center justify-between px-10">
              <h2 className="text-6xl font-black italic tracking-tighter">{projectCount}</h2>
              <div className="text-right">
                <Briefcase size={20} className="ml-auto mb-2 opacity-50 text-white" />
                <p className="text-[8px] font-black uppercase tracking-widest text-white/50 italic">Portfolio Count</p>
              </div>
           </div>

           {/* TRACKING MILESTONES */}
           <div className="bento-card !p-8 border-indigo-500/20 bg-indigo-500/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-6">Current Sprint</span>
              <div className="space-y-5">
                {milestones.map(m => (
                  <div key={m.id} className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${m.status==='completed' ? 'bg-green-500 border-green-500' : m.status==='current' ? 'border-blue-500 animate-pulse' : 'border-white/10'}`}>
                      {m.status==='completed' && <CheckCircle2 size={12} />}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${m.status==='pending' ? 'text-zinc-600' : 'text-zinc-200'}`}>{m.name}</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="bento-card !p-5 border-orange-500/20">
              <div className="flex items-center gap-2 mb-3 text-[8px] font-black uppercase text-orange-500"><Globe size={10} /> NASA Reference</div>
              {nasa && <img src={nasa.url} className="w-full h-24 rounded-2xl object-cover hover:scale-110 transition-transform duration-700 shadow-xl" />}
           </div>

           <div className="bento-card !p-0 overflow-hidden">
              <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DX6VFeBsS201p?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="opacity-60 hover:opacity-100 transition-all grayscale hover:grayscale-0"></iframe>
           </div>
        </div>

      </div>
    </div>
  );
}
