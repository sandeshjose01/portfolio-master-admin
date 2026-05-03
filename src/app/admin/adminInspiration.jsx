import React, { useState, useEffect } from 'react';
import { Play, Image, Sparkles, PlusCircle, ExternalLink, RefreshCw } from 'lucide-react';

const AdminInspiration = () => {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // CONFIGURATION - Put your keys here
  const UNSPLASH_KEY = "YOUR_UNSPLASH_ACCESS_KEY";
  const YOUTUBE_KEY = "YOUR_YOUTUBE_API_KEY";

  const fetchContent = async () => {
    setLoading(true);
    try {
      // 1. Fetch Business/Portfolio Photos from Unsplash
      const photoRes = await fetch(
        `https://api.unsplash.com/photos/random?query=branding,minimalist-ui,portfolio&count=8&client_id=${UNSPLASH_KEY}`
      );
      const photoData = await photoRes.json();
      setPhotos(photoData);

      // 2. Fetch Latest Tutorials from The Futur (YouTube)
      // Channel ID for The Futur: UC-b3c7kxa5vU-bnmaZgv57A
      const videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_KEY}&channelId=UC-b3c7kxa5vU-bnmaZgv57A&part=snippet,id&order=date&maxResults=3`
      );
      const videoData = await videoRes.json();
      setVideos(videoData.items);
      
    } catch (error) {
      console.error("Error fetching inspiration:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin <span className="text-blue-500">Inspiration</span> Hub</h1>
          <p className="text-gray-400 mt-1">Get inspired, learn, and grow your portfolio today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchContent}
            className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full font-semibold transition-all">
            <PlusCircle size={18} /> New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT: PINTEREST STYLE MASONRY (Photos) */}
        <div className="md:col-span-7">
          <div className="flex items-center gap-2 mb-6 text-gray-300">
            <Image size={18} />
            <h2 className="uppercase tracking-widest text-xs font-bold">Latest Visual Trends</h2>
          </div>
          
          <div className="columns-2 md:columns-2 gap-4 space-y-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group overflow-hidden rounded-2xl cursor-zoom-in">
                <img 
                  src={photo.urls.regular} 
                  alt="trend" 
                  className="w-full h-auto object-cover border border-white/5 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-[10px] uppercase text-white/70">Ref: {photo.user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: YOUTUBE & NEWS */}
        <div className="md:col-span-5 space-y-10">
          
          {/* YouTube Section */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-gray-300">
              <Play size={18} />
              <h2 className="uppercase tracking-widest text-xs font-bold">Design Masterclass</h2>
            </div>
            <div className="space-y-4">
              {videos.map((vid) => (
                <a 
                  key={vid.id.videoId} 
                  href={`https://youtube.com/watch?v=${vid.id.videoId}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="w-32 h-20 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden relative">
                    <img src={vid.snippet.thumbnails.medium.url} className="w-full h-full object-cover group-hover:opacity-50" />
                    <Play className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium line-clamp-2">{vid.snippet.title}</h3>
                    <p className="text-xs text-gray-500 mt-2">The Futur • Tutorial</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Portfolio Pulse (Manual Ideas) */}
          <section className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Sparkles size={18} />
              <h2 className="uppercase tracking-widest text-xs font-bold">Portfolio Ideas</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                "Apply Glassmorphism to your site's contact form."
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                "Create a 3D brand reveal video for your header."
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                "Try a brutalist typography layout for next project."
              </li>
            </ul>
          </section>

          {/* Pinterest Link Card */}
          <a 
            href="https://pinterest.com" 
            target="_blank"
            className="block p-4 rounded-2xl bg-[#E60023]/10 border border-[#E60023]/20 hover:bg-[#E60023]/20 transition-all group"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#E60023] font-bold">Explore Pinterest Trends</span>
              <ExternalLink size={16} className="text-[#E60023]" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminInspiration;
