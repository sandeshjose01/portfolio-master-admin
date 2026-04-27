"use client";
import React, { useState } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// --- Big Square Image Uploader for Project Previews ---
const ProjectImageUploader = ({ image, setImage, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file) => {
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
      <label className="text-[14px] uppercase font-black tracking-[0.2em] text-white ml-1">{label}</label>
      <div className="flex flex-col gap-6">
        {/* BIG Square Preview Area */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
          className={`relative group w-full aspect-square max-w-[500px] mx-auto rounded-[3rem] border-2 border-dashed flex-shrink-0 transition-all flex items-center justify-center overflow-hidden
            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
        >
          {image ? (
            <img src={image} alt="Project Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center px-10 space-y-4">
              <div className="text-4xl opacity-20">🖼️</div>
              <div className="text-[12px] text-white opacity-50 uppercase font-bold tracking-widest">
                {loading ? "Uploading to Cloud..." : "Drop Project Screenshot Here"}
              </div>
            </div>
          )}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>

        {/* URL Input Area */}
        <div className="w-full space-y-2">
          <p className="text-[12px] text-white/40 font-bold uppercase ml-2">Or Paste Project Image URL</p>
          <input 
            type="text" 
            placeholder="https://example.com/my-project-shot.png" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            className="w-full bg-white/5 border border-white/10 p-5 rounded-[2rem] outline-none text-white text-sm focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

// --- LinkedIn Style Date Picker ---
const MonthYearPicker = ({ label, value, onChange }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  const [m, y] = value ? value.split(" ") : ["", ""];

  return (
    <div className="w-full space-y-1">
      <label className="text-[12px] uppercase font-bold text-white opacity-100 ml-4">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <select value={m} onChange={(e) => onChange(`${e.target.value} ${y || years[0]}`)} className="bg-[#1a1a1a] text-white p-4 rounded-xl outline-none border border-white/10 appearance-none cursor-pointer">
          <option value="">Month</option>
          {months.map(mon => <option key={mon} value={mon}>{mon}</option>)}
        </select>
        <select value={y} onChange={(e) => onChange(`${m || "January"} ${e.target.value}`)} className="bg-[#1a1a1a] text-white p-4 rounded-xl outline-none border border-white/10 appearance-none cursor-pointer">
          <option value="">Year</option>
          {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
        </select>
      </div>
    </div>
  );
};

export default function ProjectsPage() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [github, setGithub] = useState("");
  const [techStack, setTechStack] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveProject = async () => {
    if (!title || !image) return alert("Please add at least a title and an image.");

    const formattedTech = techStack.split(",").map(item => item.trim()).filter(item => item !== "");
    // Bullet point logic for projects (similar to experience)
    const formattedDesc = description.split("\n").filter(l => l.trim() !== "");

    await addDoc(collection(db, "projects"), {
      title,
      link,
      github,
      techStack: formattedTech,
      date,
      image,
      description: formattedDesc,
      createdAt: new Date(),
      order: Date.now()
    });

    alert("Project Deployed!");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-16">
      <h1 className="text-7xl font-black tracking-tighter text-white">Projects</h1>

      <div className="bg-white/[0.03] border border-white/10 rounded-[4rem] p-8 md:p-12 space-y-12">
        
        {/* BIG IMAGE PREVIEW */}
        <ProjectImageUploader 
          label="Project Cover Screenshot" 
          image={image} 
          setImage={setImage} 
        />

        <div className="grid grid-cols-1 gap-8">
          {/* Project Title */}
          <div className="space-y-1">
            <label className="text-[12px] uppercase font-bold text-white ml-4">Project Title</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full bg-white/5 p-5 rounded-[2rem] outline-none text-white border border-white/5 focus:border-blue-500/50 transition-all text-lg font-bold" 
              placeholder="e.g. AI Portfolio Builder" 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Live Link */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-white ml-4">Live Demo URL</label>
              <input 
                value={link} 
                onChange={e => setLink(e.target.value)} 
                className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5" 
                placeholder="https://myproject.com" 
              />
            </div>
            {/* GitHub Link */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-white ml-4">GitHub Repository</label>
              <input 
                value={github} 
                onChange={e => setGithub(e.target.value)} 
                className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5" 
                placeholder="https://github.com/user/repo" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             {/* Tech Stack */}
             <div className="space-y-1">
                <label className="text-[12px] uppercase font-bold text-white ml-4">Tech Stack (Comma Separated)</label>
                <input 
                  value={techStack} 
                  onChange={e => setTechStack(e.target.value)} 
                  className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5" 
                  placeholder="Next.js, Tailwind, Firebase, Three.js" 
                />
              </div>
              {/* Date */}
              <MonthYearPicker 
                label="Completion Date" 
                value={date} 
                onChange={setDate} 
              />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[12px] uppercase font-bold text-white ml-4">Project Description (New lines for bullet points)</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full bg-white/5 p-6 rounded-[2.5rem] outline-none text-white h-48 border border-white/5 resize-none leading-relaxed" 
              placeholder="Describe the problem you solved, the features you built, and the impact it had..." 
            />
          </div>
        </div>

        {/* Deploy Button */}
        <button 
          onClick={handleSaveProject} 
          className="w-full bg-white text-black py-8 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.3em] hover:scale-[0.98] transition-transform shadow-2xl"
        >
          Deploy Project to Portfolio
        </button>
      </div>
    </div>
  );
}
