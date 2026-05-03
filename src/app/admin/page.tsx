"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Sparkles, ImageIcon, Play, Plus, Briefcase, RefreshCw, ExternalLink, Youtube } from 'lucide-react';

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;

// Inside your AdminInspirationHub component...

const fetchData = async (forceRefresh = false) => {
  const CACHE_KEY = "admin_inspiration_cache";
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // 1. Check for Cached Data first (unless we click the refresh button)
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData && !forceRefresh) {
    const parsedCache = JSON.parse(cachedData);
    const isExpired = Date.now() - parsedCache.timestamp > TWENTY_FOUR_HOURS;

    if (!isExpired) {
      console.log("Using cached inspiration data...");
      setPhotos(parsedCache.photos);
      setVideos(parsedCache.videos);
      setLoading(false);
      return; // Stop here, no need to call APIs
    }
  }

  // 2. If no cache or it's expired, Fetch Fresh Data
  console.log("Fetching fresh inspiration from APIs...");
  setLoading(true);
  try {
    // Fetch Unsplash
    const photoRes = await fetch(`https://api.unsplash.com/photos/random?query=minimalist-design,branding&count=4&client_id=${UNSPLASH_KEY}`);
    const photoData = await photoRes.json();

    // Fetch YouTube
    const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=3`);
    const videoData = await videoRes.json();

    // 3. Update State
    const freshPhotos = Array.isArray(photoData) ? photoData : [];
    const freshVideos = videoData.items || [];
    
    setPhotos(freshPhotos);
    setVideos(freshVideos);

    // 4. Save to Local Storage for next time
    const cacheObject = {
      timestamp: Date.now(),
      photos: freshPhotos,
      videos: freshVideos
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));

  } catch (e) {
    console.error("API Error:", e);
  }
  setLoading(false);
};

// Update the useEffect to call fetchData
useEffect(() => {
  fetchData(); // This will use cache if available

  // Also fetch the project count from Firebase every time (Firebase is free and fast)
  getDocs(collection(db, "projects")).then(snap => setProjectCount(snap.size));

  // Pinterest build trigger
  const script = document.createElement("script");
  script.src = "//assets.pinterest.com/js/pinit.js";
  script.async = true;
  script.setAttribute("data-pin-build", "doBuild");
  document.body.appendChild(script);
}, []);
  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 lg:p-8">
      
      {/* HEADER AREA */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
            ADMIN.<span className="text-blue-500 underline decoration-blue-500/30">STUDIO</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1 font-bold">Creative Command Center</p>
        </div>
        
        <div className="flex items-center gap-4 mt-6 md:mt-0">
           <button onClick={fetchData} className="p-2.5 bg-zinc-900 rounded-full border border-white/5 hover:bg-zinc-800 transition-colors">
              <RefreshCw size={18} className={loading ? "animate-spin text-blue-500" : "text-gray-400"} />
           </button>
           <Link href="/projects" className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5">
            <Plus size={18} /> ADD PROJECT
           </Link>
        </div>
      </header>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
        
        {/* CARD 1: STATS (Small) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 p-6 rounded-[2rem] bg-blue-600 flex flex-col justify-between min-h-[200px]">
          <div>
            <Briefcase size={24} className="mb-4 opacity-50" />
            <h2 className="text-4xl font-black italic">{projectCount}</h2>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Projects Live</p>
          </div>
          <div className="text-[10px] font-bold bg-white/20 p-2 rounded-lg text-center">GOAL: 10 PROJECTS</div>
        </motion.div>

        {/* CARD 2: UNSPLASH TRENDS (Long) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 lg:row-span-2 p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 mb-6 text-gray-500">
            <ImageIcon size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Visual Trends</span>
          </div>
          <div className="space-y-4">
            {photos.length > 0 ? photos.map((p: any) => (
              <img key={p.id} src={p.urls.small} className="rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full object-cover h-32 border border-white/5" alt="Trend" />
            )) : <div className="h-40 w-full bg-white/5 rounded-2xl animate-pulse" />}
          </div>
        </motion.div>

        {/* CARD 3: PINTEREST MOODBOARD (Central / Double Width) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 lg:row-span-3 p-6 rounded-[3rem] bg-white/[0.03] border border-white/10 overflow-hidden min-h-[600px]">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" /> Pinterest Board
             </div>
             <a href="https://pinterest.com" target="_blank" className="text-gray-600 hover:text-white transition-colors"><ExternalLink size={14} /></a>
          </div>
          <div className="w-full h-full flex justify-center rounded-3xl overflow-y-auto scrollbar-hide pb-10">
              <a 
                data-pin-do="embedBoard" 
                data-pin-board-width="auto" 
                data-pin-scale-height="800" 
                data-pin-scale-width="120" 
                href="https://www.pinterest.com/pinterest/official-news/" 
              ></a>
          </div>
        </motion.div>

        {/* CARD 4: LEARNING HUB (YouTube) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1 p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5">
           <div className="flex items-center gap-2 mb-6 text-gray-500">
             <Youtube size={16} className="text-red-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">Tutorials</span>
           </div>
           <div className="space-y-4">
             {videos.length > 0 ? videos.map((v: any) => (
                <a key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="block group">
                   <div className="relative rounded-xl overflow-hidden aspect-video mb-2">
                      <img src={v.snippet.thumbnails.medium.url} className="w-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" alt="YT" />
                      <Play className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                   </div>
                   <h3 className="text-[10px] font-bold uppercase leading-tight line-clamp-2">{v.snippet.title}</h3>
                </a>
             )) : (
               <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                 <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Check API Key</p>
               </div>
             )}
           </div>
        </motion.div>

        {/* CARD 5: QUICK PORTALS */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1 p-6 rounded-[2rem] bg-white/5 border border-white/10">
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4 italic underline decoration-blue-500">Fast Access</span>
           <div className="grid grid-cols-1 gap-2">
              {['Dribbble', 'Behance', 'Instagram'].map(link => (
                <a key={link} href={`https://${link.toLowerCase()}.com`} target="_blank" className="text-xs font-bold p-3 bg-white/5 rounded-xl hover:bg-blue-500 transition-all flex justify-between items-center group">
                  {link}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                </a>
              ))}
           </div>
        </motion.div>

      </div>
    </div>
  );
}

// Simple Chevron Icon for the portal list
function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
