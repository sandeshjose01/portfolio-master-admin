"use client";
import React, { useState } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// --- Square Image Uploader (Shared for Logo and Recommender) ---
const ImageSquareUploader = ({ image, setImage, label }) => {
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
    <div className="flex flex-col gap-3">
      <label className="text-[11px] uppercase font-bold tracking-widest text-white ml-1 opacity-80">{label}</label>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Square Preview / Drop Zone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
          className={`relative group w-32 h-32 md:w-40 md:h-40 rounded-3xl border-2 border-dashed flex-shrink-0 transition-all flex items-center justify-center overflow-hidden
            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
        >
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-[10px] text-center px-4 text-white opacity-40 uppercase font-bold">
              {loading ? "Uploading..." : "Drag Image Here"}
            </div>
          )}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>

        {/* URL Input Area */}
        <div className="flex-1 w-full space-y-2">
          <p className="text-[10px] text-white/40 font-bold uppercase">Or Import via URL</p>
          <input 
            type="text" 
            placeholder="Paste image address or embedded link..." 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 transition-all"
          />
          <p className="text-[9px] text-white/30 italic">Supports Direct URLs, Cloudinary, Imgur, or Google Image Links.</p>
        </div>
      </div>
    </div>
  );
};

// --- LinkedIn Style Date Picker ---
const MonthYearPicker = ({ label, value, onChange, disabled }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  const [m, y] = value && value !== "Present" ? value.split(" ") : ["", ""];

  if (disabled) return (
    <div className="w-full space-y-1">
      <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">{label}</label>
      <div className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white/30 font-bold">Present</div>
    </div>
  );

  return (
    <div className="w-full space-y-1">
      <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">{label}</label>
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

export default function ExperiencePage() {
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [logo, setLogo] = useState("");
  const [roles, setRoles] = useState([{ title: "", workType: "On-site", startDate: "", endDate: "", isCurrent: false, description: "" }]);

  const [recName, setRecName] = useState("");
  const [recRole, setRecRole] = useState("");
  const [recImage, setRecImage] = useState("");
  const [recText, setRecText] = useState("");

  const addPromotion = () => setRoles([...roles, { title: "", workType: "On-site", startDate: "", endDate: "", isCurrent: false, description: "" }]);

  const saveExperience = async () => {
    const formattedRoles = roles.map(r => ({ ...r, description: r.description.split("\n").filter(l => l.trim() !== "") }));
    await addDoc(collection(db, "experience"), { company, location, logo, roles: formattedRoles, createdAt: new Date() });
    alert("Experience Saved!"); window.location.reload();
  };

  const saveRecommendation = async () => {
    const desc = recText.split("\n").filter(l => l.trim() !== "");
    await addDoc(collection(db, "recommendations"), { name: recName, role: recRole, image: recImage, description: desc, createdAt: new Date() });
    alert("Recommendation Saved!"); window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-24">
      
      {/* EXPERIENCE SECTION */}
      <div className="space-y-10">
        <h1 className="text-7xl font-black tracking-tighter text-white">Experience</h1>
        <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 space-y-10">
          <ImageSquareUploader label="Company Logo (Square)" image={logo} setImage={setLogo} />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">Company Name</label>
              <input value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5 focus:border-blue-500/50" placeholder="e.g. Meta" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5 focus:border-blue-500/50" placeholder="e.g. New York, NY" />
            </div>
          </div>

          <div className="space-y-8">
            {roles.map((r, i) => (
              <div key={i} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-blue-500 font-black text-xs uppercase tracking-[0.2em]">Role Level {i+1}</span>
                  <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/40 cursor-pointer">
                    <input type="checkbox" checked={r.isCurrent} onChange={e => { const n = [...roles]; n[i].isCurrent = e.target.checked; n[i].endDate = e.target.checked ? "Present" : ""; setRoles(n); }} className="w-4 h-4 accent-blue-600" />
                    Currently Working Here
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">Job Title</label>
                  <input value={r.title} onChange={e => { const n = [...roles]; n[i].title = e.target.value; setRoles(n); }} className="w-full bg-white/10 p-4 rounded-xl outline-none text-white" placeholder="Product Designer" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <MonthYearPicker label="Start Date" value={r.startDate} onChange={val => { const n = [...roles]; n[i].startDate = val; setRoles(n); }} />
                  <MonthYearPicker label="End Date" value={r.endDate} disabled={r.isCurrent} onChange={val => { const n = [...roles]; n[i].endDate = val; setRoles(n); }} />
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">Work Type</label>
                    <select value={r.workType} onChange={e => { const n = [...roles]; n[i].workType = e.target.value; setRoles(n); }} className="w-full bg-[#1a1a1a] border border-white/10 text-white p-4 rounded-xl outline-none appearance-none">
                      <option>On-site</option><option>Remote</option><option>Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">Role Description</label>
                  <textarea value={r.description} onChange={e => { const n = [...roles]; n[i].description = e.target.value; setRoles(n); }} className="w-full bg-white/5 p-4 rounded-xl outline-none text-white h-32 resize-none" placeholder="Use new lines for bullet points..." />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addPromotion} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-white/40 font-bold uppercase text-[10px] hover:bg-white/5 transition-all">+ Add Promotion / Previous Role at this Company</button>
          <button onClick={saveExperience} className="w-full bg-blue-600 py-6 rounded-[2rem] font-black uppercase text-white text-xs tracking-widest hover:scale-[0.98] transition-transform">Deploy Experience</button>
        </div>
      </div>

      {/* RECOMMENDATIONS SECTION */}
      <div className="space-y-10 pt-10 border-t border-white/10">
        <h2 className="text-7xl font-black tracking-tighter text-white opacity-40 italic">Recommendations</h2>
        <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 space-y-8">
          <ImageSquareUploader label="Recommender Image (Square)" image={recImage} setImage={setRecImage} />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">Recommender Name</label>
              <input value={recName} onChange={e => setRecName(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5" placeholder="John Smith" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">Position / Relationship</label>
              <input value={recRole} onChange={e => setRecRole(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/5" placeholder="Engineering Manager at Google" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-white opacity-50 ml-4">What they said about you</label>
            <textarea value={recText} onChange={e => setRecText(e.target.value)} className="w-full bg-white/5 p-6 rounded-[2rem] outline-none text-white h-48 border border-white/5 resize-none leading-relaxed" placeholder="Write the recommendation here..." />
          </div>

          <button onClick={saveRecommendation} className="w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-[0.98] transition-transform">Save Recommendation</button>
        </div>
      </div>

    </div>
  );
}
