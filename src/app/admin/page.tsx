"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Image as ImageIcon, Play, Plus, LayoutDashboard, Settings, Briefcase } from 'lucide-react';
// Import your firebase config if you want to show real stats
// import { db } from '@/lib/firebase'; 

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  // API KEYS (Move these to .env.local later)
  const UNSPLASH_KEY = "YOUR_UNSPLASH_KEY";
  const YOUTUBE_KEY = "YOUR_YOUTUBE_KEY";

  useEffect(() => {
    // 1. Fetch Inspiration Photos
    fetch(`https://api.unsplash.com/photos/random?query=minimalist-web-design,branding&count=6&client_id=${UNSPLASH_KEY}`)
      .then(res => res.json())
      .then(data => setPhotos(data));

    // 2. Fetch Design Tutorials (The Futur Channel)
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=3`)
      .then(res => res.json())
      .then(data => setVideos(data.items || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* --- TOP NAV / STATS --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Creative <span className="text-blue-500">Command</span></h1>
          <p className="text-gray-400 mt-2">Welcome back. What will you build today?</p>
        </div>
        
        <div className="flex gap-4">
          <Link href="/admin/projects" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-all font-medium">
            <Plus size={18} /> New Project
          </Link>
          <Link href="/home" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all border border-white/10">
            View Site
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: PINTEREST FEED (Masonry-ish) --- */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon size={20} className="text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Visual Trends</h2>
          </div>
          <div className="columns-2 gap-4 space-y-4">
            {photos.map((photo: any) => (
              <div key={photo.id} className="relative group overflow-hidden rounded-2xl border border-white/5">
                <img 
                  src={photo.urls.regular} 
                  alt="Inspiration" 
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-end">
                  <p className="text-xs font-medium uppercase">Reference by {photo.user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT: LEARNING & QUICK LINKS --- */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Admin Navigation */}
          <section className="grid grid-cols-2 gap-4">
            <Link href="/admin/projects" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all flex flex-col gap-3">
              <Briefcase className="text-blue-500" />
              <span className="font-semibold">Projects</span>
            </Link>
            <Link href="/admin/skills" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all flex flex-col gap-3">
              <LayoutDashboard className="text-purple-500" />
              <span className="font-semibold">Skills</span>
            </Link>
          </section>

          {/* YouTube Feed */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Play size={20} className="text-red-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Daily Tutorials</h2>
            </div>
            <div className="space-y-4">
              {videos.map((vid: any) => (
                <a 
                  key={vid.id.videoId} 
                  href={`https://youtube.com/watch?v=${vid.id.videoId}`}
                  target="_blank"
                  className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <img 
                    src={vid.snippet.thumbnails.medium.url} 
                    className="w-28 h-16 object-cover rounded-lg" 
                    alt="thumb" 
                  />
                  <div>
                    <h3 className="text-sm font-medium line-clamp-2">{vid.snippet.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">YouTube • New</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Portfolio Motivation Box */}
          <section className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-400" /> Portfolio Pulse
            </h2>
            <p className="text-sm text-gray-300 mt-2">
              "Add a new case study today using the Grainy Gradient trend you saw."
            </p>
            <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
               <div className="w-2/3 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-right uppercase font-bold">Goal: 10 Projects (7/10)</p>
          </section>

        </div>
      </div>
    </div>
  );
}
