// Project path: src/app/admin/projects/page.tsx

"use client";
import React, { useState } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// --- Big Square Image Uploader (Shared Layout with Experience but Big Preview) ---
const ProjectImageUploader = ({ image, setImage, label }: { image: string, setImage: (val: string) => void, label: string }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setImage(data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-[12px] uppercase font-bold tracking-[0.2em] text-white ml-1 opacity-100">{label}</label>
      <div className="flex flex-col gap-6">
        {/* BIG Square Preview / Drop Zone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files) handleFile(e.dataTransfer.files[0]); }}
          className={`relative group w-full aspect-square max-w-[450px] mx-auto rounded-[3.5rem] border-2 border-dashed flex-shrink-0 transition-all flex items-center justify-center overflow-hidden
            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
        >
          {image ? (
            <img src={image} alt="Project Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8 space-y-4">
               <div className="text-4xl opacity-20 text-white">🖼️</div>
               <div className="text-[12px] text-center px-4 text-white opacity-50 uppercase font-bold tracking-widest">
                {loading ? "Uploading to Cloud..." : "Drag Project Shot Here"}
              </div>
            </div>
          )}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { if(e.target.files) handleFile(e.target.files[0]); }} />
        </div>

        {/* URL Input Area */}
        <div className="flex-1 w-full space-y-2">
          <p className="text-[12px] text-white/40 font-bold uppercase ml-2">Or Paste Live Project Image URL</p>
          <input 
            type="text" 
            placeholder="https://example.com/project-screenshot.png" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            className="w-full bg-white/5 border border-white/10 p-5 rounded-[2rem] outline-none text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

// --- LinkedIn Style Modern Date Picker ---
const ProjectMonthYearPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);
  const [m, y] = value ? value.split(" ") : ["", ""];

  return (
    <div className="w-full space-y-1">
      <label className="text-[12px] uppercase font-bold text-white opacity-100 ml-4">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <select value={m} onChange={(e) => onChange(`${e.target.value} ${y || years[0]}`)} className="bg-[#1a1a1a] text-white p-4 rounded-2xl outline-none border border-white/10 appearance-none cursor-pointer">
          <option value="">Month</option>
          {months.map(mon => <option key={mon} value={mon}>{mon}</option>)}
        </select>
        <select value={y} onChange={(e) => onChange(`${m || "January"} ${e.target.value}`)} className="bg-[#1a1a1a] text-white p-4 rounded-2xl outline-none border border-white/10 appearance-none cursor-pointer">
          <option value="">Year</option>
          {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
        </select>
      </div>
    </div>
  );
};

export default function AdminProjectsPage() {
  const [title, setTitle] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [techStack, setTechStack] = useState("");
  const [date, setDate] = useState("");
  const [projectImg, setProjectImg] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    if(!title || !projectImg) return alert("Title and Image are required.");

    // Process Tech Stack: Comma separated string to array
    const techArray = techStack.split(",").map(t => t.trim()).filter(t => t !== "");
    
    // Process Description: Every sentence or new line becomes a bullet point
    const descArray = description.split(/\n|\.(?=\s|$)/).map(l => l.trim()).filter(l => l.length > 0);

    await addDoc(collection(db, "projects"), {
      title,
      demoLink,
      githubLink,
      techStack: techArray,
      date,
      image: projectImg,
      description: descArray,
      createdAt: new Date(),
      order: Date.now()
    });

    alert("Project Deployed to Portfolio!");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-16">
      <h1 className="text-7xl font-black tracking-tighter text-white">Projects</h1>

      {/* Bento Main Form */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[4rem] p-10 md:p-14 space-y-12">
        
        {/* Section 1: Image (Big Preview) */}
        <ProjectImageUploader 
          label="Project Cover Artwork" 
          image={projectImg} 
          setImage={setProjectImg} 
        />

        {/* Section 2: Core Details */}
        <div className="grid grid-cols-1 gap-8 pt-4">
          
          <div className="space-y-1">
            <label className="text-[12px] uppercase font-bold text-white ml-4">Project Title</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. AI Portfolio Dashboard"
              className="w-full bg-white/5 p-6 rounded-[2rem] outline-none text-white border border-white/5 focus:border-blue-500/50 text-xl font-bold"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-white ml-4">Live Link</label>
              <input 
                value={demoLink} 
                onChange={e => setDemoLink(e.target.value)}
                placeholder="https://live-demo.com"
                className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-white ml-4">Github Repository URL</label>
              <input 
                value={githubLink} 
                onChange={e => setGithubLink(e.target.value)}
                placeholder="https://github.com/youruser/project"
                className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-1">
                <label className="text-[12px] uppercase font-bold text-white ml-4">Tech Stack (Separate by commas)</label>
                <input 
                  value={techStack} 
                  onChange={e => setTechStack(e.target.value)}
                  placeholder="React, Next.js, TypeScript, Tailwind"
                  className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5"
                />
              </div>
              <ProjectMonthYearPicker label="Completion Date" value={date} onChange={setDate} />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] uppercase font-bold text-white ml-4">Project Description (Every sentence becomes a bullet point)</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Architected a full-stack dashboard. Optimized data fetching by 40%. Implemented responsive Bento grid UI."
              className="w-full bg-white/5 p-6 rounded-[2.5rem] outline-none text-white h-48 border border-white/5 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Deploy Button */}
        <button 
          onClick={handleSave}
          className="w-full bg-white text-black py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] hover:scale-[0.98] transition-transform active:scale-95 shadow-xl"
        >
          Deploy Project
        </button>
      </div>
    </div>
  );
}
