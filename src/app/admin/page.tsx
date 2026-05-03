"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ImageIcon, Play, Plus, Briefcase, RefreshCw, 
  ExternalLink, Youtube, Clock, Globe, Menu, X, CheckCircle2 
} from 'lucide-react';

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [nasa, setNasa] = useState<any>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;
  const NASA_KEY = process.env.NEXT_PUBLIC_NASA_KEY;

  // Milestones Data for Tracking
  const milestones = [
    { id: 1, name: "Research", status: "completed" },
    { id: 2, name: "Design", status: "current" },
    { id: 3, name: "Development", status: "pending" },
    { id: 4, name: "Launch", status: "pending" },
  ];

  const fetchData = async (forceRefresh = false) => {
    const CACHE_KEY = "admin_boss_cache";
    setLoading(true);
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData && !forceRefresh) {
        const parsed = JSON.parse(cachedData);
        if (Date.now() - parsed.timestamp < 86400000) {
          setPhotos(parsed.photos); setVideos(parsed.videos); setNasa(parsed.nasa);
          setLoading(false); return;
        }
      }

      const [pRes, vRes, nRes] = await Promise.all([
        fetch(`https://api.unsplash.com/photos/random?query=minimal-mockup,logo-design&count=3&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=6`),
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
      ]);

      const pData = await pRes.json();
      const vData = await vRes.json();
      const nData = await nRes.json();

      setPhotos(Array.isArray(pData) ? pData : []);
      setVideos(vData.items || []);
      setNasa(nData);

      localStorage.setItem(CACHE_KEY, JSON.stringify({ 
        timestamp: Date.now(), photos: pData, videos: vData.items, nasa: nData 
      }));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    getDocs(collection(db, "projects")).then(snap => setProjectCount(snap.size));
    
    // Warm Greeting logic
    const hr = new Date().getHours();
    const timeOfDay = hr < 12 ? "Morning" : hr < 18 ? "Afternoon" : "Evening";
    setGreeting(`Good ${timeOfDay}, Boss`);

    const script = document.createElement("script");
    script.src = "//assets.pinterest.com/js/pinit.js";
    script.async = true;
    script.setAttribute("data-pin-build", "doBuild");
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white flex hide-scrollbar overflow-hidden">
      
      {/* 3-LINE MENU TOGGLE (Floating) */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/20 transition-all active:scale-90 shadow-2xl"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* THE MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-700 p-4 lg:p-10 ${sidebarOpen ? 'ml-0 md:ml-64 opacity-40 grayscale pointer-events-none' : 'ml-0'}`}>
        
        {/* TOP BAR: Greeting & New Project */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 pl-16">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-zinc-600 bg-clip-text text-transparent">
              {greeting}
            </h1>
            <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.5em] mt-2">Design Strategy Engine</p>
          </motion.div>

          <div className="flex gap-4">
             <Link href="/admin" onClick={() => window.location.reload()} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Dashboard
             </Link>
             <Link href="/admin/projects" className="bg-white text-black px-8 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5">
                + NEW PROJECT
             </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1800px] mx-auto">
          
          {/* COLUMN 1: PINTEREST & BEHANCE (3/12) */}
          <div className="lg:col-span-3 space-y-6 h-full flex flex-col">
            <div className="bento-card !p-0 flex-1 min-h-[600px] flex flex-col overflow-hidden relative">
               <div className="p-6 border-b border-white/5 flex items-center gap-2 bg-zinc-900/50">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reference Search</span>
               </div>
               <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                    {/* Pinterest widget pointed to a "Graphic Design Ideas" board */}
                    <a data-pin-do="embedBoard" data-pin-board-width="auto" data-pin-scale-height="800" data-pin-scale-width="120" href="https://www.pinterest.com/sandeshjoshiofficial/creative-references-branding/"></a>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {['Behance', 'Dribbble'].map(site => (
                 <a key={site} href={`https://${site.toLowerCase()}.com`} target="_blank" className="bento-card !p-4 text-center text-[10px] font-bold uppercase hover:bg-blue-600 transition-all border-none bg-zinc-900/80">{site}</a>
               ))}
            </div>
          </div>

          {/* COLUMN 2: YOUTUBE HUB (6/12) - THE BIGGEST SECTION */}
          <div className="lg:col-span-6 h-full min-h-[800px]">
             <div className="bento-card h-full flex flex-col bg-zinc-900/20">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <Youtube size={24} className="text-red-600" />
                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-400">Learning Laboratory</span>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-600 uppercase">The Futur / Flux</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto hide-scrollbar pb-10">
                  {videos.length > 0 ? videos.map((v: any) => (
                    <motion.a whileHover={{ y: -5 }} key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="block group bg-white/5 p-4 rounded-[2rem] border border-white/5">
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
                         <img src={v.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all">
                            <Play size={40} fill="white" />
                         </div>
                      </div>
                      <h3 className="text-[10px] font-bold leading-relaxed uppercase tracking-tighter group-hover:text-blue-500">{v.snippet.title}</h3>
                    </motion.a>
                  )) : <div className="col-span-2 text-center py-20 opacity-20 italic uppercase tracking-[1em]">Establishing Link...</div>}
                </div>
             </div>
          </div>

          {/* COLUMN 3: STATS, NASA, MILESTONES (3/12) */}
          <div className="lg:col-span-3 space-y-6">
             
             {/* PROJECT MILESTONES (NEW Eye-Catching Tracking) */}
             <div className="bento-card bg-gradient-to-br from-indigo-900/40 to-transparent border-indigo-500/20">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Milestone</span>
                </div>
                <div className="space-y-4">
                  {milestones.map((m) => (
                    <div key={m.id} className="flex items-center gap-4 group">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${m.status === 'completed' ? 'bg-green-500 border-green-500' : m.status === 'current' ? 'bg-blue-600 border-blue-600 animate-pulse' : 'border-white/10'}`}>
                        {m.status === 'completed' && <CheckCircle2 size={14} />}
                        {m.status === 'current' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${m.status === 'pending' ? 'text-zinc-600' : 'text-zinc-200'}`}>{m.name}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bento-card !bg-blue-600 !border-none h-[120px] flex items-center justify-between px-8">
                <h2 className="text-6xl font-black italic tracking-tighter">{projectCount}</h2>
                <div className="text-right">
                  <Briefcase size={20} className="ml-auto mb-2 opacity-50" />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Works</p>
                </div>
             </div>

             {/* NASA (Smaller Visual Spark) */}
             <div className="bento-card !p-4 border-orange-500/20">
                <div className="flex items-center gap-2 mb-3 text-[8px] font-black uppercase text-orange-500">
                   <Globe size={10} /> Deep Space Reference
                </div>
                {nasa && <img src={nasa.url} className="w-full h-20 rounded-xl object-cover hover:scale-150 transition-transform duration-1000 cursor-zoom-in" />}
             </div>

             {/* FIXED SPOTIFY PLAYER */}
             <div className="bento-card !p-0 overflow-hidden border-green-500/10">
                <iframe 
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX6VFeBsS201p?utm_source=generator&theme=0" 
                  width="100%" height="152" frameBorder="0" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="opacity-70 hover:opacity-100 transition-all grayscale hover:grayscale-0"
                ></iframe>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
