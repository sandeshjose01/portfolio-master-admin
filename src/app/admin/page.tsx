"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ImageIcon, Play, Briefcase, RefreshCw, Youtube, Globe, CheckCircle2 } from 'lucide-react';

export default function InspirationHub() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [nasa, setNasa] = useState<any>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  const YOUTUBE_KEY = process.env.NEXT_PUBLIC_YOUTUBE_KEY;
  const NASA_KEY = process.env.NEXT_PUBLIC_NASA_KEY;

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const [pRes, vRes, nRes] = await Promise.all([
        fetch(`https://api.unsplash.com/photos/random?query=minimal-mockup,logo&count=3&client_id=${UNSPLASH_KEY}`),
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=6`),
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
      ]);
      const pData = await pRes.json();
      const vData = await vRes.json();
      const nData = await nRes.json();
      setPhotos(pData); setVideos(vData.items || []); setNasa(nData);
      
      // Pinterest Widget Rebuild
      if ((window as any).PinUtils) (window as any).PinUtils.build();
    } catch (e) { console.error(e); }
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

  return (
    <div className="p-10 lg:p-20 pt-32 max-w-[1920px] mx-auto">
      <header className="flex justify-between items-end mb-20">
        <div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter">{greeting}</h1>
          <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.6em] mt-4 italic">Strategic Intelligence Hub</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => fetchData(true)} className="p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all"><RefreshCw size={20} className={loading ? "animate-spin text-blue-500" : ""} /></button>
          <Link href="/admin/projects" className="bg-white text-black px-12 py-5 rounded-3xl font-black text-[10px] tracking-widest shadow-2xl transition-all hover:bg-blue-600 hover:text-white underline decoration-black">+ START PROJECT</Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PINTEREST */}
        <div className="lg:col-span-4 h-[800px] flex flex-col bg-zinc-950 rounded-[3rem] border border-white/10 overflow-hidden">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Mockup References</span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
           </div>
           <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
              <div className="bg-white rounded-[2.5rem] overflow-hidden">
                <a data-pin-do="embedBoard" data-pin-board-width="auto" data-pin-scale-height="800" data-pin-scale-width="120" href="https://www.pinterest.com/sandeshjoshiofficial/creative-references-branding/"></a>
              </div>
           </div>
        </div>

        {/* YOUTUBE */}
        <div className="lg:col-span-5 h-[800px] bg-zinc-950 rounded-[3rem] border border-white/10 p-8 flex flex-col">
           <div className="flex items-center gap-3 mb-10"><Youtube size={24} className="text-red-600" /><h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-400">The Futur Lab</h2></div>
           <div className="grid grid-cols-1 gap-6 overflow-y-auto hide-scrollbar pb-10">
             {videos.length > 0 ? videos.map((v: any) => (
               <a key={v.id.videoId} href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" className="flex gap-6 p-4 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group">
                 <div className="w-40 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img src={v.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" />
                    <Play className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100" size={24} fill="white" />
                 </div>
                 <h3 className="text-[9px] font-black uppercase group-hover:text-blue-500">{v.snippet.title}</h3>
               </a>
             )) : <a href="https://youtube.com/@TheFutur" target="_blank" className="p-20 text-center border border-dashed border-white/10 rounded-3xl opacity-30 hover:opacity-100 transition-all">CONNECT YOUTUBE API OR VIEW CHANNEL ↗</a>}
           </div>
        </div>

        {/* STATS & APIS */}
        <div className="lg:col-span-3 space-y-6">
           <div className="p-10 bg-blue-600 rounded-[2.5rem] flex items-center justify-between">
              <h2 className="text-7xl font-black italic tracking-tighter">{projectCount}</h2>
              <div className="text-right"><Briefcase size={24} className="ml-auto mb-3 opacity-40" /><p className="text-[9px] font-black uppercase tracking-widest opacity-40">Portfolio Size</p></div>
           </div>

           <div className="p-8 bg-zinc-950 border border-indigo-500/20 rounded-[2.5rem]">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-8 underline">Milestones</span>
              <div className="space-y-6">
                {['Market Research', 'Logo Design', 'Portfolio Dev'].map((m, i) => (
                  <div key={m} className="flex items-center gap-5">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${i===0 ? 'bg-green-500 border-green-500' : i===1 ? 'border-blue-500 animate-pulse' : 'border-white/10'}`}>
                      {i===0 && <CheckCircle2 size={12} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{m}</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="p-4 bg-zinc-950 border border-orange-500/20 rounded-[2rem]">
              <div className="flex items-center gap-2 mb-4 text-[8px] font-black uppercase text-orange-500"><Globe size={12} /> NASA Space Ref</div>
              {nasa && <img src={nasa.url} className="w-full h-32 rounded-[1.5rem] object-cover hover:scale-110 transition-transform duration-1000" />}
           </div>

           {/* SPOTIFY FIXED URL */}
           <div className="rounded-[2.5rem] overflow-hidden border border-green-500/20">
              <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0Ex7X" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="grayscale opacity-60 hover:opacity-100 transition-all hover:grayscale-0"></iframe>
           </div>
        </div>
      </div>
    </div>
  );
}
