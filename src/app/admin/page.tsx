"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Play, Plus, Briefcase, RefreshCw, ExternalLink, Youtube, ChevronRight } from 'lucide-react';

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Environment Variables from your .env file
  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;

  const fetchData = async (forceRefresh = false) => {
    const CACHE_KEY = "admin_inspiration_cache";
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    setLoading(true);

    try {
      // 1. Check for Cached Data in Browser
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData && !forceRefresh) {
        const parsedCache = JSON.parse(cachedData);
        const isExpired = Date.now() - parsedCache.timestamp > TWENTY_FOUR_HOURS;

        if (!isExpired) {
          setPhotos(parsedCache.photos);
          setVideos(parsedCache.videos);
          setLoading(false);
          return; // Exit early if cache is fresh
        }
      }

      // 2. Fetch Fresh Data if no cache or expired
      const [photoRes, videoRes] = await Promise.all([
        fetch(`https://api.unsplash.com/photos/random?query=minimalist-branding,ui-design&count=4&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=3`)
      ]);

      const photoData = await photoRes.json();
      const videoData = await videoRes.json();

      const freshPhotos = Array.isArray(photoData) ? photoData : [];
      const freshVideos = videoData.items || [];

      // 3. Update State
      setPhotos(freshPhotos);
      setVideos(freshVideos);

      // 4. Save to Cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        photos: freshPhotos,
        videos: freshVideos
      }));

    } catch (e) {
      console.error("API Error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // Runs on page load (Uses cache)

    // Firebase counts don't need caching (they are fast and free)
    getDocs(collection(db, "projects")).then(snap => setProjectCount(snap.size));

    // Load Pinterest Widget
    const script = document.createElement("script");
    script.src = "//assets.pinterest.com/js/pinit.js";
    script.async = true;
    script.setAttribute("data-pin-build", "doBuild");
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 lg:p-8">
      
      {/* HEADER SECTION (JSX) */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Admin.<span className="text-blue-500">Studio</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1 font-bold italic">Inspired Creator Dashboard</p>
        </div>
        
        <div className="flex items-center gap-4 mt-6 md:mt-0">
           {/* REFRESH BUTTON: Passing 'true' bypasses the cache */}
           <button 
              onClick={() => fetchData(true)} 
              className="p-2.5 bg-zinc-900 rounded-full border border-white/5 hover:bg-zinc-800 transition-colors"
              title="Force Refresh Inspiration"
           >
              <RefreshCw size={18} className={loading ? "animate-spin text-blue-500" : "text-gray-400"} />
           </button>
           
           <Link href="/projects" className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
            <Plus size={18} /> ADD PROJECT
           </Link>
        </div>
      </header>

      {/* THE GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* STATS CARD */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-1 p-8 rounded-[2rem] bg-blue-600 flex flex-col justify-between">
          <Briefcase size={28} className="opacity-30" />
          <div>
            <h2 className="text-5xl font-black">{projectCount}</h2>
            <p className="text-xs font-bold uppercase opacity-60 mt-1">Live Projects</p>
          </div>
        </motion.div>

        {/* UNSPLASH TRENDS CARD */}
        <div className="lg:col-span-1 lg:row-span-2 p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5">
          <div className="flex items-center gap-2 mb-6 opacity-50">
            <ImageIcon size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Unsplash Daily</span>
          </div>
          <div className="space-y-4">
            {photos.map((p: any) => (
              <img key={p.id} src={p.urls.small} className="rounded-2xl w-full h-32 object-cover grayscale hover:grayscale-0 transition-all border border-white/5" />
            ))}
          </div>
        </div>

        {/* PINTEREST CARD */}
        <div className="lg:col-span-2 lg:row-span-3 p-6 rounded-[3rem] bg-white/5 border border-white/10 overflow-hidden min-h-[500px]">
           <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold uppercase text-red-500 tracking-[0.2em]">Moodboard Feed</span>
              <ExternalLink size={14} className="text-zinc-600" />
           </div>
           <div className="w-full h-full flex justify-center rounded-3xl overflow-y-auto pb-10">
              <a 
                data-pin-do="embedBoard" 
                data-pin-board-width="auto" 
                data-pin-scale-height="800" 
                data-pin-scale-width="120" 
                href="https://www.pinterest.com/pinterest/official-news/" 
              ></a>
           </div>
        </div>

        {/* TUTORIALS CARD */}
        <div className="lg:col-span-1 p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5">
           <div className="flex items-center gap-2 mb-6">
             <Youtube size={16} className="text-red-600" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">YouTube Learning</span>
           </div>
           <div className="space-y-4">
             {videos.map((v: any) => (
                <a key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="block group">
                   <img src={v.snippet.thumbnails.medium.url} className="rounded-xl opacity-40 group-hover:opacity-100 transition-opacity mb-2" />
                   <h3 className="text-[10px] font-bold uppercase leading-tight line-clamp-2">{v.snippet.title}</h3>
                </a>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
