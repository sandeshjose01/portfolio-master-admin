"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ImageIcon, Play, Briefcase, RefreshCw, Youtube, Globe, CheckCircle2 } from 'lucide-react';

export default function InspirationHub() {
  /* -----------------------------------------------------------
     SECTION 1: BOSS CONFIGURATION (Edit your Links here)
     ----------------------------------------------------------- */
  
  // Pinterest Board
  const PINTEREST_BOARD_URL = "https://in.pinterest.com/search/pins/?q=Y2K%20Design&rs=typed";

  // List of YouTube Channel IDs
  const YOUTUBE_CHANNELS = [
    "UC-b3c7kxa5vU-bnmaZgv57A", // The Futur
    "UCWNFzKYNnk9-JEPeoLMI-2w", // Channel 2
    "UCP-78oclyS9-j9H2z8S9p3w", // Flux Academy
    "UC5W1k_sWDpsfjTZnTbb8qwg"  // Design Sala
  ];

  // List of Normal Spotify Links (Array format)
  const SPOTIFY_LINKS = [
    "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS",
    "https://open.spotify.com/playlist/37i9dQZF1DX8Ueb990u60a",
    "https://open.spotify.com/playlist/37i9dQZF1DX6VFeBsS201p",
    "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0Ex7X"
  ];

  const PHOTO_KEYWORDS = "Y2K Design,logo-design,mockup,branding,minimalist";

  /* -----------------------------------------------------------
     SECTION 2: LOGIC ENGINE (Brackets carefully checked here)
     ----------------------------------------------------------- */
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [nasa, setNasa] = useState<any>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [spotifyEmbed, setSpotifyEmbed] = useState("");

  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;
  const NASA_KEY = process.env.NEXT_PUBLIC_NASA_KEY;

  const milestones = [
    { name: "Market Research", status: "completed" },
    { name: "Logo & Visual Identity", status: "current" },
    { name: "Portfolio Case Study", status: "pending" },
  ];

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      // Pick random YouTube and Spotify from the lists
      const randomYT = YOUTUBE_CHANNELS[Math.floor(Math.random() * YOUTUBE_CHANNELS.length)];
      const randomSpotify = SPOTIFY_LINKS[Math.floor(Math.random() * SPOTIFY_LINKS.length)];
      setSpotifyEmbed(randomSpotify.replace("open.spotify.com/", "open.spotify.com/embed/"));

      const [pRes, vRes, nRes] = await Promise.all([
        fetch(`https://api.unsplash.com/photos/random?query=${PHOTO_KEYWORDS}&count=3&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=${randomYT}&part=snippet,id&order=date&maxResults=6`),
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
      ]);

      const pData = await pRes.json();
      const vData = await vRes.json();
      const nData = await nRes.json();

      if (Array.isArray(pData)) setPhotos(pData);
      if (vData.items) setVideos(vData.items);
      if (nData) setNasa(nData);

      if (typeof window !== "undefined" && (window as any).PinUtils) {
        setTimeout(() => (window as any).PinUtils.build(), 1000);
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    }
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
     SECTION 3: VISUAL LAYOUT (The UI)
     ----------------------------------------------------------- */
  return (
    <div className="p-10 lg:p-20 pt-32 max-w-[2000px] mx-auto min-h-screen bg-[#020202]">
      
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <div>
          <motion.h1 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            {greeting}
          </motion.h1>
          <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.8em] mt-6">Strategic Intelligence Hub</p>
        </div>

        <div className="flex gap-4">
          <button onClick={() => fetchData(true)} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all">
            <RefreshCw size={24} className={loading ? "animate-spin text-blue-500" : "text-zinc-400"} />
          </button>
          <Link href="/admin/projects" className="bg-white text-black px-12 py-6 rounded-[2rem] font-black text-[12px] tracking-widest shadow-2xl hover:bg-blue-600 hover:text-white transition-all uppercase underline decoration-2">
            + New Project
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* PINTEREST */}
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

        {/* YOUTUBE */}
        <section className="lg:col-span-5 h-[850px] bg-zinc-950 rounded-[3.5rem] border border-white/5 p-10 flex flex-col shadow-2xl">
           <div className="flex items-center gap-4 mb-12 text-zinc-400">
              <Youtube size={28} className="text-red-600" />
              <h2 className="text-[14px] font-black uppercase tracking-[0.4em] italic">Tutorial Laboratory</h2>
           </div>
           <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 space-y-8 pr-2">
             {videos.length > 0 ? videos.map((v: any) => (
               <motion.a whileHover={{x:10}} key={v.id.videoId} href={`https://www.youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="flex gap-6 p-5 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all group">
                 <div className="w-44 h-24 rounded-3xl overflow-hidden flex-shrink-0 relative">
                    <img src={v.snippet.thumbnails.high.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" alt="tutorial" />
                    <Play className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100" size={24} fill="white" />
                 </div>
                 <h3 className="text-[10px] font-black uppercase group-hover:text-blue-500 leading-relaxed line-clamp-3">{v.snippet.title}</h3>
               </motion.a>
             )) : <div className="text-center py-40 opacity-20 uppercase tracking-[1em]">Establishing Connection...</div>}
           </div>
        </section>

        {/* RIGHT */}
        <section className="lg:col-span-3 space-y-8">
           <div className="p-12 bg-blue-600 rounded-[3rem] flex items-center justify-between shadow-2xl shadow-blue-900/20">
              <h2 className="text-7xl font-black italic tracking-tighter text-white">{projectCount}</h2>
              <div className="text-right">
                <Briefcase size={28} className="ml-auto mb-4 opacity-40 text-white" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white italic">Live Works</p>
              </div>
           </div>

           <div className="p-10 bg-zinc-950 border border-white/5 rounded-[3rem]">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-10 underline decoration-indigo-500 decoration-2 italic underline-offset-8">Boss Milestones</span>
              <div className="space-y-8">
                {milestones.map((m) => (
                  <div key={m.name} className="flex items-center gap-6">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${m.status==='completed' ? 'bg-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : m.status==='current' ? 'border-blue-500 animate-pulse' : 'border-white/10'}`}>
                      {m.status==='completed' && <CheckCircle2 size={16} />}
                      {m.status==='current' && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${m.status==='pending' ? 'opacity-20' : 'opacity-100'}`}>{m.name}</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="p-6 bg-zinc-950 border border-orange-500/20 rounded-[2.5rem] group shadow-xl">
              <div className="flex items-center gap-3 mb-5 text-[9px] font-black uppercase text-orange-500 italic"><Globe size={14} /> Universe Sparks</div>
              {nasa ? <img src={nasa.url} className="w-full h-36 rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="NASA" /> : <div className="h-36 bg-white/5 animate-pulse rounded-3xl" />}
           </div>

           <div className="rounded-[3rem] overflow-hidden border border-green-500/20 shadow-2xl">
              {spotifyEmbed && (
                <iframe src={spotifyEmbed} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="grayscale opacity-50 hover:opacity-100 transition-all hover:grayscale-0"></iframe>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
