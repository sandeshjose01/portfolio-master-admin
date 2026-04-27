"use client";
import React, { useState } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// --- Reusable Image Uploader Component ---
const ImageUploader = ({ image, setImage, label, rounded = false }) => {
  const[isDragging, setIsDragging] = useState(false);
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

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] uppercase font-bold opacity-100 ml-4 text-white">{label}</label>
      <div 
        className={`border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 bg-white/5'} p-6 flex flex-col items-center justify-center gap-4 transition-all ${rounded ? 'rounded-[3rem] w-48 h-48 mx-auto' : 'rounded-3xl w-full'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Preview" className={`w-full h-full object-cover ${rounded ? 'rounded-full' : 'rounded-xl max-h-32'}`} />
        ) : (
          <div className="text-center opacity-60 text-white text-sm">
            {loading ? "Uploading..." : "Drag & Drop Image here"}
          </div>
        )}
        
        <div className="flex flex-col w-full items-center gap-2 mt-2">
          <span className="text-[10px] uppercase opacity-40 text-white font-bold">OR</span>
          <div className="flex w-full gap-2">
            <input 
              type="text" 
              placeholder="Paste Image URL / Embed Link" 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
              className="flex-1 bg-white/10 p-3 rounded-xl text-xs outline-none text-white placeholder:text-white/40"
            />
            <label className="bg-white/10 px-4 py-3 rounded-xl cursor-pointer text-xs text-white hover:bg-white/20 font-bold transition-all">
              Browse
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- LinkedIn Style Date Picker Component ---
const MonthYearPicker = ({ label, value, onChange, disabled }) => {
  const months =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const [month, year] = value && value !== "Present" ? value.split(" ") : ["", ""];

  if (disabled) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[20px] uppercase font-bold opacity-100 ml-4 text-white">{label}</label>
        <div className="w-full bg-white/5 p-4 rounded-xl text-white/50 cursor-not-allowed">Present</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] uppercase font-bold opacity-50 ml-4 text-white">{label}</label>
      <div className="flex gap-2">
        <select 
          className="w-1/2 bg-white/5 p-4 rounded-xl outline-none text-white appearance-none cursor-pointer"
          value={month}
          onChange={(e) => onChange(e.target.value ? `${e.target.value} ${year || currentYear}` : "")}
        >
          <option value="" className="text-black">Month</option>
          {months.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
        </select>
        <select 
          className="w-1/2 bg-white/5 p-4 rounded-xl outline-none text-white appearance-none cursor-pointer"
          value={year}
          onChange={(e) => onChange(e.target.value ? `${month || "January"} ${e.target.value}` : "")}
        >
          <option value="" className="text-black">Year</option>
          {years.map(y => <option key={y} value={y} className="text-black">{y}</option>)}
        </select>
      </div>
    </div>
  );
};

export default function ExperiencePage() {
  // Experience State
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [logo, setLogo] = useState("");
  const [roles, setRoles] = useState([{ title: "", workType: "On-site", startDate: "", endDate: "", isCurrent: false, description: "" }]);

  // Recommendation State
  const[recName, setRecName] = useState("");
  const [recRole, setRecRole] = useState("");
  const [recImage, setRecImage] = useState("");
  const [recText, setRecText] = useState("");

  const addPromotion = () => setRoles([...roles, { title: "", workType: "On-site", startDate: "", endDate: "", isCurrent: false, description: "" }]);

  const handleSaveExperience = async () => {
    const formattedRoles = roles.map(r => ({
      ...r,
      description: r.description.split("\n").filter(l => l.trim() !== "") // Keeps paragraphs intact for portfolio rendering
    }));
    await addDoc(collection(db, "experience"), {
      company, location, logo, roles: formattedRoles,
      createdAt: new Date(), order: Date.now()
    });
    alert("Experience Saved!");
    window.location.reload();
  };

  const handleSaveRecommendation = async () => {
    const formattedDesc = recText.split("\n").filter(l => l.trim() !== ""); // Keeps paragraphs intact
    await addDoc(collection(db, "recommendations"), {
      name: recName, role: recRole, image: recImage, description: formattedDesc,
      createdAt: new Date(), order: Date.now()
    });
    alert("Recommendation Saved!");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-20 pb-32 pt-12">
      
      {/* --- EXPERIENCE SECTION --- */}
      <section className="space-y-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Experience</h1>
        
        <div className="bento-card space-y-8 bg-black/20 p-8 rounded-[2rem] border border-white/10">
          
          <ImageUploader image={logo} setImage={setLogo} label="Company Logo" />
          <img src={image} alt="Preview" className={`w-full h-full object-cover ${rounded ? 'rounded-full' : 'rounded-xl max-h-32'}`} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-1">
               <label className="text-[20px] uppercase font-bold opacity-100 ml-4 text-white">Company Name</label>
               <input placeholder="e.g. Google" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white placeholder:text-white/30" />
             </div>
             <div className="flex flex-col gap-1">
               <label className="text-[20px] uppercase font-bold opacity-100 ml-4 text-white">Location</label>
               <input placeholder="e.g. San Francisco, CA" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white placeholder:text-white/30" />
             </div>
          </div>

          <div className="space-y-6">
            {roles.map((r, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-6 relative">
                <p className="text-blue-400 font-bold text-[20px] uppercase tracking-widest bg-blue-500/10 inline-block px-3 py-1 rounded-full">Role #{i+1}</p>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold opacity-50 ml-4 text-white">Job Title</label>
                  <input placeholder="e.g. Senior Software Engineer" value={r.title} className="w-full bg-white/5 p-4 rounded-xl outline-none text-white placeholder:text-white/30" onChange={e => { const n = [...roles]; n[i].title = e.target.value; setRoles(n); }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MonthYearPicker label="Start Date" value={r.startDate} onChange={(val) => { const n = [...roles]; n[i].startDate = val; setRoles(n); }} />
                  <MonthYearPicker label="End Date" value={r.endDate} disabled={r.isCurrent} onChange={(val) => { const n = [...roles]; n[i].endDate = val; setRoles(n); }} />
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold opacity-50 ml-4 text-white">Work Type</label>
                    <select value={r.workType} className="bg-white/5 p-4 rounded-xl text-white outline-none appearance-none cursor-pointer" onChange={e => { const n = [...roles]; n[i].workType = e.target.value; setRoles(n); }}>
                      <option className="text-black">On-site</option>
                      <option className="text-black">Remote</option>
                      <option className="text-black">Hybrid</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer ml-2 mt-[-10px]">
                  <input type="checkbox" className="w-4 h-4 accent-blue-500" checked={r.isCurrent} onChange={e => { const n = [...roles]; n[i].isCurrent = e.target.checked; n[i].endDate = e.target.checked ? "Present" : ""; setRoles(n); }} />
                  I currently work in this role
                </label>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold opacity-50 ml-4 text-white">Role Description (New line for paragraphs/bullets)</label>
                  <textarea placeholder="Describe your responsibilities, achievements, and technologies used..." value={r.description} className="w-full bg-white/5 p-4 rounded-xl outline-none h-40 text-white placeholder:text-white/30 resize-none leading-relaxed" onChange={e => { const n = [...roles]; n[i].description = e.target.value; setRoles(n); }} />
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={addPromotion} className="w-full py-5 border-2 border-dashed border-white/20 rounded-2xl text-white opacity-60 hover:opacity-100 hover:bg-white/5 transition-all font-bold">+ Add Another Role / Promotion</button>
          <button onClick={handleSaveExperience} className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-6 rounded-3xl font-black uppercase text-sm tracking-widest text-white shadow-lg shadow-blue-500/20">Deploy Experience</button>
        </div>
      </section>

      {/* --- RECOMMENDATIONS SECTION --- */}
      <section className="space-y-8 mt-16 pt-16 border-t border-white/10">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Recommendations</h2>
        
        <div className="bento-card space-y-8 bg-black/20 p-8 rounded-[2rem] border border-white/10">
          
          <ImageUploader image={recImage} setImage={setRecImage} label="Recommender's Profile Picture" rounded={true} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-1">
               <label className="text-[20px] uppercase font-bold opacity-100 ml-4 text-white">Recommender's Name</label>
               <input placeholder="e.g. Jane Doe" value={recName} onChange={e => setRecName(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white placeholder:text-white/30" />
             </div>
             <div className="flex flex-col gap-1">
               <label className="text-[20px] uppercase font-bold opacity-100 ml-4 text-white">Recommender's Role / Company</label>
               <input placeholder="e.g. CTO at TechCorp" value={recRole} onChange={e => setRecRole(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white placeholder:text-white/30" />
             </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[20px] uppercase font-bold opacity-100 ml-4 text-white">Recommendation Text (New lines become separated paragraphs)</label>
            <textarea 
              placeholder="What did they say about you?&#10;&#10;Leave empty line breaks to separate paragraphs beautifully in your portfolio." 
              value={recText} 
              onChange={e => setRecText(e.target.value)} 
              className="w-full bg-white/5 p-6 rounded-2xl outline-none h-48 text-white placeholder:text-white/30 resize-none leading-relaxed" 
            />
          </div>

          <button onClick={handleSaveRecommendation} className="w-full bg-accent-blue-600 hover:bg-accent-blue-500 transition-colors py-6 rounded-3xl font-black uppercase text-sm tracking-widest text-white shadow-lg shadow-green-500/20">Deploy Recommendation</button>
        </div>
      </section>

    </div>
  );
}
