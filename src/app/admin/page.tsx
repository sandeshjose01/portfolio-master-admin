"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Sparkles, ImageIcon, Play, Plus, Briefcase, RefreshCw, ExternalLink, Youtube, Clock, Globe, Music } from 'lucide-react';

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [nasa, setNasa] = useState<any>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;
  const NASA_KEY = process.env.NEXT_PUBLIC_NASA_KEY || "DEMO_KEY";

  const fetchData = async (forceRefresh = false) => {
    const CACHE_KEY = "admin_v3_cache";
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
        fetch(`https://api.unsplash.com/photos/random?query=minimalist,abstract&count=3&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=6`),
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
      ]);

      const pData = await pRes.json();
      const vData = await vRes.json();
      const nData = await nRes.json();

      setPhotos(pData);
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
    const script = document.createElement("script");
    script.src = "//assets.pinterest.com/js/pinit.js";
    script.async = true;
    script.setAttribute("data-pin-build", "doBuild");
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 lg:p-8 hide-scrollbar">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-2xl font-black tracking-tighter italic uppercase">SJ.<span className="text-blue-600">STUDIO</span></h1>
        <div className="flex gap-3">
          <button onClick={() => fetchData(true)} className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/15 transition-all">
            <RefreshCw size={18} className={loading ? "animate-spin text-blue-500" : "text-gray-400"} />
          </button>
          <Link href="/projects" className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-[10px] tracking-widest flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
            <Plus size={14} /> NEW PROJECT
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1800px] mx-auto">
        
        {/* LEFT COLUMN: PINTEREST & LINKS (4/12) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bento-card !p-0 h-[700px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pinterest Moodboard</span>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
                <div className="bg-white rounded-3xl overflow-hidden">
                  <a data-pin-do="embedBoard" data-pin-board-width="auto" data-pin-scale-height="800" data-pin-scale-width="120" href="https://www.pinterest.com/pinterest/official-news/"></a>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              {['Behance', 'Dribbble'].map(site => (
                <a key={site} href={`https://${site.toLowerCase()}.com`} target="_blank" className="bento-card !p-4 text-center text-[10px] font-bold uppercase hover:bg-blue-600 transition-all">{site}</a>
              ))}
           </div>
        </div>

        {/* MIDDLE COLUMN: YOUTUBE (5/12) */}
        <div className="lg:col-span-5 h-full">
           <div className="bento-card h-[810px] flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                <Youtube size={20} className="text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Learning Lab (The Futur)</span>
              </div>
              <div className="space-y-6 overflow-y-auto hide-scrollbar pr-2">
                {videos.map((v: any) => (
                  <motion.a whileHover={{ x: 5 }} key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="block group">
                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-3 border border-white/5">
                       <img src={v.snippet.thumbnails.high.url} className="w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40">
                          <Play size={40} fill="white" />
                       </div>
                    </div>
                    <h3 className="text-xs font-bold leading-relaxed uppercase group-hover:text-blue-500 transition-colors">{v.snippet.title}</h3>
                  </motion.a>
                ))}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: STATS, NASA, UNSPLASH (3/12) */}
        <div className="lg:col-span-3 space-y-6">
           {/* PROJECT RECORD (Top Right) */}
           <div className="bento-card !bg-blue-600 !border-none h-[160px] flex flex-col justify-between">
              <Briefcase size={20} className="opacity-50" />
              <div>
                <h2 className="text-5xl font-black italic">{projectCount}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Live Masterpieces</p>
              </div>
           </div>

           {/* UNSPLASH (Small) */}
           <div className="bento-card !p-5">
              <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase text-zinc-600">
                 <ImageIcon size={12} /> Visual Sparks
              </div>
              <div className="grid grid-cols-3 gap-2">
                 {photos.map((p: any) => (
                   <img key={p.id} src={p.urls.small} className="w-full h-14 rounded-lg object-cover grayscale hover:grayscale-0 transition-all" />
                 ))}
              </div>
           </div>

           {/* NASA API (Space Inspiration) */}
           <div className="bento-card !p-5">
              <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase text-orange-500">
                 <Globe size={12} /> NASA APOD
              </div>
              {nasa && (
                <div className="group relative rounded-xl overflow-hidden">
                  <img src={nasa.url} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all p-3 text-[8px] overflow-hidden">
                    {nasa.title}
                  </div>
                </div>
              )}
           </div>

           {/* SPOTIFY (Focus Player) */}
           <div className="bento-card !p-0 overflow-hidden border-green-500/20">
              <iframe 
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb990u60a?utm_source=generator&theme=0" 
                width="100%" height="152" frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="opacity-80 hover:opacity-100 transition-opacity"
              ></iframe>
           </div>
        </div>

      </div>
    </div>
  );
}
