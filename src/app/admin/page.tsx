"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Sparkles, ImageIcon, Play, Plus, Briefcase, RefreshCw, Youtube, Globe, CheckCircle2 } from 'lucide-react';

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
  ];

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const [pRes, vRes, nRes] = await Promise.all([
        fetch(`https://api.unsplash.com/photos/random?query=minimal-branding,mockup&count=3&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=6`),
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
      ]);
      const [pData, vData, nData] = await Promise.all([pRes.json(), vRes.json(), nRes.json()]);
      setPhotos(pData); setVideos(vData.items || []); setNasa(nData);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    getDocs(collection(db, "projects")).then(snap => setProjectCount(snap.size));
    const hr = new Date().getHours();
    setGreeting(`Good ${hr < 12 ? "Morning" : hr < 18 ? "Afternoon" : "Evening"}, Boss`);

    const script = document.createElement("script");
    script.src = "//assets.pinterest.com/js/pinit.js";
    script.async = true;
    script.setAttribute("data-pin-build", "doBuild");
    document.body.appendChild(script);
  }, []);

  return (
    <div className="p-8 lg:p-20 hide-scrollbar max-w-[1920px] mx-auto">
      
      {/* BOSS HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            {greeting}
          </h1>
          <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.6em] mt-6">Strategic Intelligence Hub</p>
        </motion.div>

        <div className="flex gap-4">
           <button onClick={() => fetchData(true)} className="p-5 glass-card !rounded-2xl">
              <RefreshCw size={20} className={loading ? "animate-spin text-blue-500" : ""} />
           </button>
           <Link href="/admin/projects" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
              START NEW PROJECT
           </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: PINTEREST (4/12) */}
        <div className="lg:col-span-4 h-[800px] flex flex-col glass-card !p-0 overflow-hidden">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Global Reference Feed</span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
           </div>
           <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
                <a data-pin-do="embedBoard" data-pin-board-width="auto" data-pin-scale-height="800" data-pin-scale-width="120" href="https://www.pinterest.com/sandeshjoshiofficial/creative-references-branding/"></a>
              </div>
           </div>
        </div>

        {/* MIDDLE: YOUTUBE (5/12) */}
        <div className="lg:col-span-5 h-[800px] glass-card flex flex-col">
           <div className="flex items-center gap-3 mb-12">
              <Youtube size={24} className="text-red-600" />
              <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-400">Design Lab: The Futur</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto hide-scrollbar pb-10">
             {videos.map((v: any) => (
               <a key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="block group glass-card !p-4 !rounded-[2.5rem] border-white/5">
                 <div className="relative aspect-video rounded-3xl overflow-hidden mb-5">
                    <img src={v.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all"><Play fill="white" size={32} /></div>
                 </div>
                 <h3 className="text-[9px] font-black uppercase leading-relaxed tracking-tighter text-zinc-400 group-hover:text-blue-500">{v.snippet.title}</h3>
               </a>
             ))}
           </div>
        </div>

        {/* RIGHT: STATS & APIS (3/12) */}
        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card !bg-blue-600 !border-none h-[180px] flex items-center justify-between px-10">
              <h2 className="text-7xl font-black italic tracking-tighter">{projectCount}</h2>
              <div className="text-right">
                <Briefcase size={24} className="ml-auto mb-3 opacity-40" />
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Portfolio Size</p>
              </div>
           </div>

           <div className="glass-card !p-10 border-indigo-500/20 bg-indigo-500/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-8 underline decoration-2">Sprint Milestones</span>
              <div className="space-y-6">
                {milestones.map(m => (
                  <div key={m.id} className="flex items-center gap-5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${m.status==='completed' ? 'bg-green-500 border-green-500' : m.status==='current' ? 'border-blue-500 animate-pulse' : 'border-white/10'}`}>
                      {m.status==='completed' && <CheckCircle2 size={12} />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${m.status==='pending' ? 'text-zinc-600' : 'text-zinc-200'}`}>{m.name}</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="glass-card !p-6 border-orange-500/10">
              <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase text-orange-500"><Globe size={12} /> NASA Deep Space</div>
              {nasa && <img src={nasa.url} className="w-full h-32 rounded-3xl object-cover hover:scale-110 transition-transform duration-1000 shadow-2xl" />}
           </div>

           <div className="glass-card !p-0 overflow-hidden !rounded-[2.5rem]">
              <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DX6VFeBsS201p?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="opacity-60 hover:opacity-100 transition-all grayscale hover:grayscale-0"></iframe>
           </div>
        </div>

      </div>
    </div>
  );
}
