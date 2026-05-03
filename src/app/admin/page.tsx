"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; // Importing your db from your config
import { collection, getDocs } from 'firebase/firestore';
import { Sparkles, Image as ImageIcon, Play, Plus, LayoutDashboard, Briefcase, RefreshCw, ChevronRight } from 'lucide-react';

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- CONFIGURATION ---
  // Replace these with your actual keys (Get them for free from Unsplash/Google Cloud)
  const UNSPLASH_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; 
  const YOUTUBE_KEY = "YOUR_YOUTUBE_API_KEY";

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Inspiration Photos (Pinterest style)
      const photoRes = await fetch(
        `https://api.unsplash.com/photos/random?query=minimalist-web-design,branding,editorial-layout&count=6&client_id=${UNSPLASH_KEY}`
      );
      const photoData = await photoRes.json();
      setPhotos(photoData);

      // 2. Fetch Latest Tutorials (The Futur)
      const videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=3`
      );
      const videoData = await videoRes.json();
      setVideos(videoData.items || []);

      // 3. Fetch Real Stats from your Firebase
      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjectCount(querySnapshot.size);

    } catch (error) {
      console.error("Error loading inspiration:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 font-sans">
      
      {/* --- TOP BAR --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-gray-400 to-gray-600 bg-clip-text text-transparent">
            Creator Hub
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Design inspiration & portfolio control center.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={fetchData} className="p-3 bg-white/5 rounded-full hover:bg-white/10 border border-white/10 transition-all">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <Link href="/admin/projects" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl transition-all font-bold shadow-lg shadow-blue-900/20 text-sm">
            <Plus size={18} /> Add New Work
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: PINTEREST FEED --- */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-400" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Visual Trends</h2>
            </div>
            <span className="text-[10px] text-gray-600">Auto-refreshing via Unsplash</span>
          </div>

          <div className="columns-2 gap-5 space-y-5">
            {photos.map((photo: any) => (
              <div key={photo.id} className="relative group overflow-hidden rounded-3xl border border-white/5 bg-gray-900">
                <img 
                  src={photo.urls.regular} 
                  alt="trend" 
                  className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent p-5 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Inspiration</p>
                  <p className="text-xs text-white/80">{photo.alt_description || "Visual Trend"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT: ACTIONS & LEARNING --- */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Portfolio Pulse (REAL FIREBASE DATA) */}
          <section className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={80} />
            </div>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              <Briefcase size={20} className="text-blue-500" /> Portfolio Pulse
            </h2>
            <p className="text-gray-400 text-sm mb-6">You have built <span className="text-white font-bold">{projectCount}</span> masterpieces.</p>
            
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                 <span>Progress</span>
                 <span>{projectCount} / 15 Projects</span>
               </div>
               <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <div 
                   className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_#3b82f6]" 
                   style={{ width: `${(projectCount / 15) * 100}%` }}
                 />
               </div>
            </div>
          </section>

          {/* Quick Navigation Hooks */}
          <section className="grid grid-cols-2 gap-4">
            <Link href="/admin/skills" className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all group">
              <LayoutDashboard size={20} className="mb-3 text-gray-500 group-hover:text-white" />
              <p className="text-sm font-bold tracking-tight">Skills Matrix</p>
            </Link>
            <Link href="/admin/experience" className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all group">
              <Sparkles size={20} className="mb-3 text-gray-500 group-hover:text-white" />
              <p className="text-sm font-bold tracking-tight">Experience</p>
            </Link>
          </section>

          {/* YouTube Tutorials */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Play size={18} className="text-red-500" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Design Learning</h2>
            </div>
            <div className="space-y-4">
              {videos.map((vid: any) => (
                <a 
                  key={vid.id.videoId} 
                  href={`https://youtube.com/watch?v=${vid.id.videoId}`}
                  target="_blank"
                  className="flex gap-5 p-4 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all group"
                >
                  <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <img src={vid.snippet.thumbnails.medium.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xs font-bold line-clamp-2 leading-relaxed group-hover:text-blue-400 transition-colors">
                      {vid.snippet.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Flux Academy</span>
                      <ChevronRight size={10} className="text-gray-700" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
