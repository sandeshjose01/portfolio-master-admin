"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Play, Plus, LayoutDashboard, Briefcase, RefreshCw, ExternalLink } from 'lucide-react';

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  // Inside your AdminInspirationHub component
  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;


  useEffect(() => {
    // Fetch Unsplash
    fetch(`https://api.unsplash.com/photos/random?query=minimalist-design,branding&count=4&client_id=${UNSPLASH_KEY}`)
      .then(res => res.json()).then(data => setPhotos(data));

    // Fetch YouTube (The Futur)
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=3`)
      .then(res => res.json()).then(data => setVideos(data.items || []));

    // Fetch Firebase Count
    getDocs(collection(db, "projects")).then(snap => setProjectCount(snap.size));

    // Load Pinterest Widget Script
    const script = document.createElement("script");
    script.src = "//assets.pinterest.com/js/pinit.js";
    script.async = true;
    script.setAttribute("data-pin-build", "doBuild");
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-10">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start mb-12">
        <div className="mb-6 md:mb-0">
          <h1 className="text-4xl font-black tracking-tighter">ADMIN.<span className="text-blue-500">STUDIO</span></h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Creative Command Center</p>
        </div>
        <Link href="/admin/projects" className="bg-white text-black px-8 py-3 rounded-full font-black hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2">
          <Plus size={20} /> ADD PROJECT
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: LIVE TRENDS */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5">
             <h2 className="text-xs font-black uppercase text-gray-500 mb-6 flex items-center gap-2">
               <ImageIcon size={14} /> Unsplash Trends
             </h2>
             <div className="grid grid-cols-1 gap-4">
               {photos.map((p: any) => (
                 <img key={p.id} src={p.urls.small} className="rounded-2xl grayscale hover:grayscale-0 transition-all duration-500 w-full object-cover h-40" />
               ))}
             </div>
          </section>

          {/* QUICK LINKS FOR BEHANCE/DRIBBBLE */}
          <section className="space-y-3">
             <h2 className="text-xs font-black uppercase text-gray-500 mb-4 px-2 tracking-widest">Industry Portals</h2>
             <a href="https://www.behance.net" target="_blank" className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl hover:bg-[#0057ff] transition-all group">
               <span className="font-bold">Behance</span>
               <ExternalLink size={16} className="opacity-0 group-hover:opacity-100" />
             </a>
             <a href="https://dribbble.com" target="_blank" className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl hover:bg-[#ea4c89] transition-all group">
               <span className="font-bold">Dribbble</span>
               <ExternalLink size={16} className="opacity-0 group-hover:opacity-100" />
             </a>
          </section>
        </div>

        {/* MIDDLE COLUMN: YOUR PINTEREST MOODBOARD */}
        <div className="lg:col-span-5">
           <section className="bg-white/5 p-6 rounded-[2rem] border border-white/10 h-full overflow-hidden">
              <h2 className="text-xs font-black uppercase text-red-500 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Your Pinterest Moodboard
              </h2>
              {/* CHANGE THE URL BELOW TO YOUR ACTUAL PINTEREST BOARD URL */}
              <div className="w-full flex justify-center">
                <a 
                  data-pin-do="embedBoard" 
                  data-pin-board-width="400" 
                  data-pin-scale-height="600" 
                  data-pin-scale-width="80" 
                  href="https://www.pinterest.com/pinterest/official-news/" 
                ></a>
              </div>
           </section>
        </div>

        {/* RIGHT COLUMN: TUTORIALS & STATS */}
        <div className="lg:col-span-3 space-y-8">
           <section className="p-6 bg-blue-600 rounded-[2rem] text-white">
              <h2 className="font-black text-2xl tracking-tighter italic">Portfolio Live: {projectCount}</h2>
              <p className="text-sm mt-2 opacity-80">Next Goal: 10 Projects</p>
              <div className="mt-4 h-1 bg-white/20 rounded-full">
                <div className="h-full bg-white rounded-full" style={{width: '60%'}}></div>
              </div>
           </section>

           <section>
              <h2 className="text-xs font-black uppercase text-gray-500 mb-6">Learning Hub</h2>
              <div className="space-y-4">
                {videos.map((v: any) => (
                  <a key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="block group">
                    <img src={v.snippet.thumbnails.medium.url} className="rounded-xl mb-2 w-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-[10px] font-bold uppercase leading-tight">{v.snippet.title}</h3>
                  </a>
                ))}
              </div>
           </section>
        </div>

      </div>
    </div>
  );
}
