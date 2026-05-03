"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion'; // Using your Framer Motion package
import { Sparkles, Image as ImageIcon, Play, Plus, LayoutDashboard, Briefcase, RefreshCw, ChevronRight } from 'lucide-react';

export default function AdminInspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // API KEYS - Replace with yours
  const UNSPLASH_KEY = "YOUR_UNSPLASH_KEY";
  const YOUTUBE_KEY = "YOUR_YOUTUBE_KEY";

  const fetchData = async () => {
    setLoading(true);
    try {
      const photoRes = await fetch(`https://api.unsplash.com/photos/random?query=minimalist-branding,ui-design,business&count=6&client_id=${UNSPLASH_KEY}`);
      const photoData = await photoRes.json();
      setPhotos(photoData);

      const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=3`);
      const videoData = await videoRes.json();
      setVideos(videoData.items || []);

      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjectCount(querySnapshot.size);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white p-6 lg:p-12"
    >
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Admin.<span className="text-blue-500">Center</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Where inspiration meets management.</p>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <button onClick={fetchData} className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <Link href="/admin/projects" className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95">
            <Plus size={18} /> New Work
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: PINTEREST FEED */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-8 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
            <ImageIcon size={14} /> <span>Live Visual Inspiration</span>
          </div>
          <div className="columns-2 gap-5 space-y-5">
            {photos.map((photo: any, index: number) => (
              <motion.div 
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-3xl border border-white/5 bg-zinc-900"
              >
                <img src={photo.urls.regular} className="w-full grayscale hover:grayscale-0 transition-all duration-700" alt="trend" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: DATA & TUTORIALS */}
        <div className="lg:col-span-5 space-y-10">
          {/* STATS CARD */}
          <motion.section 
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/10"
          >
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Briefcase size={20} className="text-blue-500" /> Portfolio Pulse
            </h2>
            <p className="text-4xl font-black mb-4">{projectCount} <span className="text-sm font-normal text-gray-500 uppercase tracking-widest">Projects Live</span></p>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${(projectCount / 15) * 100}%` }}
                className="h-full bg-blue-500" 
               />
            </div>
          </motion.section>

          {/* TUTORIALS */}
          <section>
             <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Play size={14} className="text-red-500" /> Tutorials for today
             </h2>
             <div className="space-y-4">
              {videos.map((vid: any) => (
                <a key={vid.id.videoId} href={`https://youtube.com/watch?v=${vid.id.videoId}`} target="_blank" className="flex gap-5 p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <img src={vid.snippet.thumbnails.medium.url} className="w-24 h-16 rounded-xl object-cover" alt="thumb" />
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xs font-bold leading-relaxed line-clamp-2">{vid.snippet.title}</h3>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-tighter">Watch on YouTube</p>
                  </div>
                </a>
              ))}
             </div>
          </section>

          {/* QUICK LINKS */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {['Home', 'Skills', 'Experience', 'About'].map((item) => (
              <Link key={item} href={`/admin/${item.toLowerCase()}`} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500 text-center text-xs font-bold transition-all uppercase tracking-widest">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
