"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";

export default function ExperiencePage() {
  const [roles, setRoles] = useState([{ title: "", workType: "On-site", startDate: "", endDate: "", description: "" }]);
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [logo, setLogo] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  // Function to add a promotion block
  const addPromotion = () => setRoles([...roles, { title: "", workType: "On-site", startDate: "", endDate: "", description: "" }]);

  const handleSave = async () => {
    const formattedRoles = roles.map(r => ({
      ...r,
      description: r.description.split("\n").filter(l => l.trim() !== "")
    }));
    await addDoc(collection(db, "experience"), {
      company, location, logo, roles: formattedRoles,
      createdAt: new Date(), order: Date.now()
    });
    alert("Saved!");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32">
      <h1 className="text-7xl font-black tracking-tighter">Experience</h1>
      
      <div className="bento-card space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col gap-1">
             <label className="text-[10px] uppercase font-bold opacity-40 ml-4">Company</label>
             <input value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none" />
           </div>
           <div className="flex flex-col gap-1">
             <label className="text-[10px] uppercase font-bold opacity-40 ml-4">Location</label>
             <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none" />
           </div>
        </div>

        {roles.map((r, i) => (
          <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
             <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest">Role #{i+1}</p>
             <input placeholder="Job Title" className="w-full bg-white/5 p-4 rounded-xl outline-none" onChange={e => { const n = [...roles]; n[i].title = e.target.value; setRoles(n); }} />
             <div className="grid grid-cols-3 gap-2">
                <input type="month" className="bg-white/5 p-4 rounded-xl outline-none" onChange={e => { const n = [...roles]; n[i].startDate = e.target.value; setRoles(n); }} />
                <input type="month" className="bg-white/5 p-4 rounded-xl outline-none" onChange={e => { const n = [...roles]; n[i].endDate = e.target.value; setRoles(n); }} />
                <select className="bg-white p-4 rounded-xl text-black" onChange={e => { const n = [...roles]; n[i].workType = e.target.value; setRoles(n); }}>
                  <option>On-site</option><option>Remote</option><option>Hybrid</option>
                </select>
             </div>
             <textarea placeholder="Description (Bullet points on new lines)" className="w-full bg-white/5 p-4 rounded-xl outline-none h-32" onChange={e => { const n = [...roles]; n[i].description = e.target.value; setRoles(n); }} />
          </div>
        ))}
        <button onClick={addPromotion} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl opacity-40 hover:opacity-100">+ Add Promotion</button>
        <button onClick={handleSave} className="w-full bg-blue-600 py-6 rounded-3xl font-black uppercase text-xs tracking-widest">Deploy History</button>
      </div>

      <h2 className="text-3xl font-black opacity-30 italic">Recommendations</h2>
      {/* ... Add Recommendation form here using same logic ... */}
    </div>
  );
}
