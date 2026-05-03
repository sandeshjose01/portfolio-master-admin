"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ImageIcon, Play, Briefcase, RefreshCw, Youtube, Globe, CheckCircle2, Music } from 'lucide-react';

export default function InspirationHub() {
  /* -----------------------------------------------------------
     SECTION 1: CONFIGURATION (Edit your Links & Keywords here)
     ----------------------------------------------------------- */
  
  // Fix 1: Removed the extra "" at the end
  const PINTEREST_BOARD_URL = "https://in.pinterest.com/search/pins/?q=Y2K%20Design&rs=typed";

  // Fix 2: Turned your many IDs into a proper Array []
  const YOUTUBE_CHANNELS = [
    "UC-b3c7kxa5vU-bnmaZgv57A", // The Futur
    "UCWNFzKYNnk9-JEPeoLMI-2w", // Example 2
    "UCP-78oclyS9-j9H2z8S9p3w"  // Flux Academy
    "UC-b3c7kxa5vU-bnmaZgv57A", //
    "Skt0UEpMb0lCcVdxNG84VERMcE", 
    "UCWNfZKYNnk9-JEPeoLMi-2w", 
    "UC5W1k_sWDPsfjTZnTbb8qwg" //Design Sala
  ];

  // This line picks one random channel from your list above
  const YOUTUBE_CHANNEL_ID = YOUTUBE_CHANNELS[Math.floor(Math.random() * YOUTUBE_CHANNELS.length)];

  const PHOTO_KEYWORDS = "Y2K Design,logo-design,mockup,branding,minimalist";
  const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS";
 

  /* -----------------------------------------------------------
     SECTION 2: API KEYS (Pulled from your .env / Vercel)
     ----------------------------------------------------------- */
  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;
  const NASA_KEY = process.env.NEXT_PUBLIC_NASA_KEY;

  /* -----------------------------------------------------------
     SECTION 3: STATE & DATA (The "Engine" of the page)
     ----------------------------------------------------------- */
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [nasa, setNasa] = useState<any>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  const milestones = [
    { name: "Market Research", status: "completed" },
    { name: "Logo & Visual Identity", status: "current" },
    { name: "Portfolio Case Study", status: "pending" },
  ];

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const [pRes, vRes, nRes] = await Promise.all([
        fetch(`https://api.unsplash.com/photos/random?query=${PHOTO_KEYWORDS}&count=3&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=6`),
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
      ]);

      const pData = await pRes.json();
      const vData = await vRes.json();
      const nData = await nRes.json();

      if (Array.isArray(pData)) setPhotos(pData);
      if (vData.items) setVideos(vData.items);
      if (nData) setNasa(nData);

      // Refresh Pinterest Layout
      if (typeof window !== "undefined" && (window as any).PinUtils) {
        setTimeout(() => (window as any).PinUtils.build(), 1000);
      }
    } catch (e) { console.error("Error fetching data:", e); }
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
    document.body.appendChild(script);
  }, []);

  /* -----------------------------------------------------------
     SECTION 4: VISUAL LAYOUT (The UI)
     ----------------------------------------------------------- */
  return (
    <div className="p-10 lg:p-20 pt-32 max-w-[2000px] mx-auto min-h-screen bg-[#020202]">
      
      {/* --- PAGE HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <div>
          <motion.h1 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            {greeting}
          </motion.h1>
          <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.8em] mt-6">Master Creative Command Center</p>
        </div>

        <div className="flex gap-4">
          <button onClick={() => fetchData(true)} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all">
            <RefreshCw size={24} className={loading ? "animate-spin text-blue-500" : "text-zinc-400"} />
          </button>
          <Link href="/admin/projects" className="bg-white text-black px-12 py-6 rounded-[2rem] font-black text-[12px] tracking-widest shadow-2xl hover:bg-blue-600 hover:text-white transition-all uppercase">
            + Start New Project
          </Link>
        </div>
      </header>

      {/* --- THE MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: PINTEREST IDEAS --- */}
        <section className="lg:col-span-4 h-[850px] flex flex-col bg-zinc-950 rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /> Pinterest Moodboard
              </span>
           </div>
           <div className="flex-1 overflow-y-auto hide-scrollbar p-6 bg-white/5">
              <div className="bg-white rounded-[2.5rem] overflow-hidden">
                <a data-pin-do="embedBoard" data-pin-board-width="auto" data-pin-scale-height="800" data-pin-scale-width="120" href={PINTEREST_BOARD_URL}></a>
              </div>
           </div>
           <div className="p-4 grid grid-cols-2 gap-4 bg-zinc-900/50">
              <a href="https://behance.net" target="_blank" className="py-4 text-center text-[9px] font-black uppercase bg-white/5 rounded-2xl hover:bg-blue-600 transition-all">Behance</a>
              <a href="https://dribbble.com" target="_blank" className="py-4 text-center text-[9px] font-black uppercase bg-white/5 rounded-2xl hover:bg-pink-600 transition-all">Dribbble</a>
           </div>
        </section>

        {/* --- MIDDLE: YOUTUBE LEARNING --- */}
        <section className="lg:col-span-5 h-[850px] bg-zinc-950 rounded-[3.5rem] border border-white/5 p-10 flex flex-col shadow-2xl">
           <div className="flex items-center gap-4 mb-12">
              <Youtube size={28} className="text-red-600" />
              <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Tutorial Laboratory</h2>
           </div>
           <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 space-y-8">
             {videos.length > 0 ? videos.map((v: any) => (
               <motion.a whileHover={{x:10}} key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="flex gap-6 p-5 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all group">
                 <div className="w-44 h-24 rounded-3xl overflow-hidden flex-shrink-0 relative">
                    <img src={v.snippet.thumbnails.high.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                    <Play className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100" size={24} fill="white" />
                 </div>
                 <div className="flex flex-col justify-center">
                    <h3 className="text-[10px] font-black uppercase group-hover:text-blue-500 leading-relaxed line-clamp-3">{v.snippet.title}</h3>
                    <span className="text-[8px] text-zinc-600 font-bold mt-2 uppercase tracking-widest">Flux / The Futur</span>
                 </div>
               </a>
             )) : <div className="text-center py-40 opacity-20 uppercase tracking-[1em]">Establishing Connection...</div>}
           </div>
        </section>

        {/* --- RIGHT: STATS, NASA, MUSIC --- */}
        <section className="lg:col-span-3 space-y-8">
           
           {/* Project Counter */}
           <div className="p-12 bg-blue-600 rounded-[3rem] flex items-center justify-between shadow-2xl shadow-blue-900/20">
              <h2 className="text-7xl font-black italic tracking-tighter">{projectCount}</h2>
              <div className="text-right">
                <Briefcase size={28} className="ml-auto mb-4 opacity-40 text-white" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">Live Projects</p>
              </div>
           </div>

           {/* Milestone Tracking */}
           <div className="p-10 bg-zinc-950 border border-white/5 rounded-[3rem] shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-10 underline decoration-indigo-500 decoration-2 underline-offset-8">Boss Milestones</span>
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-6 group">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${m.status==='completed' ? 'bg-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : m.status==='current' ? 'border-blue-500 animate-pulse' : 'border-white/10'}`}>
                      {m.status==='completed' && <CheckCircle2 size={16} />}
                      {m.status==='current' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${m.status==='pending' ? 'opacity-20' : 'opacity-100'}`}>{m.name}</span>
                  </div>
                ))}
              </div>
           </div>

           {/* NASA Inspiration */}
           <div className="p-6 bg-zinc-950 border border-orange-500/20 rounded-[2.5rem] shadow-xl group">
              <div className="flex items-center gap-3 mb-5 text-[9px] font-black uppercase text-orange-500">
                <Globe size={14} /> Universe Sparks
              </div>
              {nasa ? (
                <div className="relative rounded-3xl overflow-hidden">
                   <img src={nasa.url} className="w-full h-36 object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="NASA APOD" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all p-4 text-[8px] font-bold uppercase leading-tight">{nasa.title}</div>
                </div>
              ) : <div className="h-36 bg-white/5 animate-pulse rounded-3xl" />}
           </div>

           {/* SPOTIFY FOCUS MUSIC */}
           <div className="rounded-[3rem] overflow-hidden border border-green-500/20 shadow-2xl">
              <iframe 
                src={SPOTIFY_PLAYLIST_URL} 
                width="100%" height="152" frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy" 
                className="grayscale opacity-50 hover:opacity-100 transition-all hover:grayscale-0"
              ></iframe>
           </div>

        </section>
      </div>
    </div>
  );
}
