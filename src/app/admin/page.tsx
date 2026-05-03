"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Sparkles, ImageIcon, Play, Plus, Briefcase, RefreshCw, ExternalLink, Youtube, Clock, ArrowUpRight } from 'lucide-react';

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");

  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;

  const fetchData = async (forceRefresh = false) => {
    const CACHE_KEY = "admin_inspiration_cache";
    setLoading(true);
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData && !forceRefresh) {
        const parsed = JSON.parse(cachedData);
        if (Date.now() - parsed.timestamp < 86400000) {
          setPhotos(parsed.photos); setVideos(parsed.videos);
          setLoading(false); return;
        }
      }

      const [pRes, vRes] = await Promise.all([
        fetch(`https://api.unsplash.com/photos/random?query=minimalist,branding,studio&count=4&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=3`)
      ]);

      const pData = await pRes.json();
      const vData = await vRes.json();

      setPhotos(Array.isArray(pData) ? pData : []);
      setVideos(vData.items || []);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), photos: pData, videos: vData.items }));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    getDocs(collection(db, "projects")).then(snap => setProjectCount(snap.size));
    const hr = new Date().getHours();
    setGreeting(hr < 12 ? "Good Morning" : hr < 18 ? "Good Afternoon" : "Good Evening");

    const script = document.createElement("script");
    script.src = "//assets.pinterest.com/js/pinit.js";
    script.async = true;
    script.setAttribute("data-pin-build", "doBuild");
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-10 hide-scrollbar">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-12 px-4">
        <div>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-1">{greeting}</p>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">SJ.<span className="text-blue-600">STUDIO</span></h1>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => fetchData(true)} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
            <RefreshCw size={18} className={loading ? "animate-spin text-blue-500" : "text-gray-400"} />
          </button>
          <Link href="/projects" className="bg-white text-black px-6 py-3 rounded-2xl font-bold text-xs tracking-tighter flex items-center gap-2 hover:invert transition-all">
            <Plus size={16} /> NEW PROJECT
          </Link>
        </div>
      </header>

      {/* BENTO GRID CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* LEFT COLUMN (STATS + YOUTUBE) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Using your .bento-card class but adding blue bg */}
          <div className="bento-card !bg-blue-600 border-none flex flex-col justify-between h-[200px]">
            <Briefcase size={24} className="opacity-40 text-white" />
            <div>
              <h2 className="text-6xl font-black tracking-tighter text-white">{projectCount}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Portfolio Count</p>
            </div>
          </div>

          <div className="bento-card overflow-hidden">
             <div className="flex items-center gap-2 mb-6 text-zinc-500 uppercase text-[10px] font-black">
                <Youtube size={14} className="text-red-500" /> Learning Lab
             </div>
             <div className="space-y-5">
                {videos.map((v: any) => (
                  <a key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="flex items-center gap-4 group">
                    <img src={v.snippet.thumbnails.medium.url} className="w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="yt" />
                    <h3 className="text-[10px] font-bold leading-tight line-clamp-2 uppercase group-hover:text-blue-500">{v.snippet.title}</h3>
                  </a>
                ))}
             </div>
          </div>
        </div>

        {/* MIDDLE COLUMN (PINTEREST HERO) */}
        <div className="lg:col-span-6">
           <div className="bento-card !p-0 h-full min-h-[600px] flex flex-col overflow-hidden">
              <div className="p-8 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Moodboard</span>
                 </div>
                 <ArrowUpRight size={16} className="text-zinc-700" />
              </div>
              <div className="flex-1 w-full hide-scrollbar overflow-y-auto px-4 pb-8">
                 <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl">
                    <a data-pin-do="embedBoard" data-pin-board-width="auto" data-pin-scale-height="800" data-pin-scale-width="120" href="https://www.pinterest.com/pinterest/official-news/"></a>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN (UNSPLASH + LINKS) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bento-card max-h-[500px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-zinc-500 uppercase text-[10px] font-black">
               <ImageIcon size={14} /> Design Inspo
            </div>
            <div className="space-y-4 overflow-y-auto hide-scrollbar">
              {photos.map((p: any) => (
                <img key={p.id} src={p.urls.small} className="rounded-3xl w-full h-32 object-cover grayscale hover:grayscale-0 transition-all border border-white/5" />
              ))}
            </div>
          </div>

          <div className="bento-card !p-6">
             <div className="grid grid-cols-2 gap-3">
                {['Behance', 'Dribbble'].map(link => (
                  <a key={link} href={`https://${link.toLowerCase()}.com`} target="_blank" className="bg-white/5 p-4 rounded-2xl text-[10px] font-bold text-center hover:bg-blue-600 transition-all uppercase tracking-tighter flex flex-col items-center gap-2">
                    {link} <ArrowUpRight size={10} />
                  </a>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
