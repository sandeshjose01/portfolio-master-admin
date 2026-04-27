"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { 
  User, 
  Languages, 
  Flag, 
  VenetianMask, 
  Heart, 
  FileText, 
  Globe, 
  Save, 
  Plus, 
  X, 
  MapPin 
} from "lucide-react";

export default function AboutAdmin() {
  // --- 1. STATE MANAGEMENT ---
  const [pageTitle, setPageTitle] = useState(""); // e.g. "Graphic Designer... Based in Nepal"
  const [language, setLanguage] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("Nepal");
  
  // Two different Bio sections
  const [webAbout, setWebAbout] = useState("");
  const [pdfAbout, setPdfAbout] = useState("");

  // Hobbies list
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- 2. FETCH EXISTING DATA ---
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const docRef = doc(db, "siteData", "about");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPageTitle(data.pageTitle || "");
          setLanguage(data.language || "");
          setNationality(data.nationality || "");
          setGender(data.gender || "");
          setCountry(data.country || "");
          setWebAbout(data.webAbout || "");
          setPdfAbout(data.pdfAbout || "");
          setHobbies(data.hobbies || []);
        }
      } catch (error) {
        console.error("Error loading about data:", error);
      }
      setIsLoading(false);
    };
    loadAboutData();
  }, []);

  // --- 3. HANDLERS ---
  const addHobby = () => {
    if (newHobby.trim() && !hobbies.includes(newHobby.trim())) {
      setHobbies([...hobbies, newHobby.trim()]);
      setNewHobby("");
    }
  };

  const removeHobby = (index: number) => {
    setHobbies(hobbies.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "siteData", "about"), {
        pageTitle,
        language,
        nationality,
        gender,
        country,
        webAbout,
        pdfAbout,
        hobbies,
        lastUpdated: new Date()
      }, { merge: true });
      alert("About Me profile updated successfully!");
    } catch (error) {
      alert("Save failed");
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse tracking-widest uppercase">Syncing Bio Node...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 p-4">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter">About Management</h1>

      <div className="bg-white/5 backdrop-blur-3xl p-6 md:p-10 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl">
        
        {/* PAGE MAIN TITLE */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black opacity-40 ml-4 tracking-[0.2em]">Headline Title (Top of Page)</label>
          <input 
            value={pageTitle} 
            onChange={e => setPageTitle(e.target.value)} 
            placeholder="e.g. Graphic Designer, Client Service Executive, Based In Nepal."
            className="w-full bg-white/5 p-5 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 border border-white/5 text-lg font-bold" 
          />
        </div>

        {/* PERSONAL METADATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-4 flex items-center gap-2"><Languages size={10}/> Language</label>
            <input value={language} onChange={e => setLanguage(e.target.value)} placeholder="e.g. English, Nepali, Hindi" className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-4 flex items-center gap-2"><Flag size={10}/> Nationality</label>
            <input value={nationality} onChange={e => setNationality(e.target.value)} placeholder="e.g. Nepalese" className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-4 flex items-center gap-2"><VenetianMask size={10}/> Gender</label>
            <input value={gender} onChange={e => setGender(e.target.value)} placeholder="e.g. Male" className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-4 flex items-center gap-2"><MapPin size={10}/> Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5" />
          </div>
        </div>

        {/* BIO SECTIONS */}
        <div className="space-y-6 pt-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-4 flex items-center gap-2"><Globe size={12}/> Website Biography (Infinite Story)</label>
            <textarea 
              value={webAbout} 
              onChange={e => setWebAbout(e.target.value)} 
              placeholder="Tell your life story here for website visitors..."
              className="w-full bg-white/5 p-6 rounded-[2rem] outline-none border border-white/5 h-64 resize-none leading-relaxed text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-4 flex items-center gap-2"><FileText size={12}/> PDF Resume Biography (Concise & Professional)</label>
            <textarea 
              value={pdfAbout} 
              onChange={e => setPdfAbout(e.target.value)} 
              placeholder="A short professional summary for the downloadable CV..."
              className="w-full bg-white/5 p-6 rounded-[2rem] outline-none border border-white/5 h-32 resize-none leading-relaxed text-sm"
            />
          </div>
        </div>

        {/* HOBBIES TAG SYSTEM */}
        <div className="p-6 border border-white/20 rounded-[2.5rem] bg-white/5 space-y-4">
          <label className="text-[10px] uppercase font-black opacity-40 ml-2 flex items-center gap-2"><Heart size={10}/> Interests & Hobbies</label>
          <div className="flex gap-2">
            <input 
              value={newHobby} 
              onChange={e => setNewHobby(e.target.value)}
              placeholder="e.g. Photography" 
              className="flex-1 bg-white/5 p-4 rounded-2xl outline-none border border-white/5" 
            />
            <button onClick={addHobby} className="px-6 bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all"><Plus/></button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {hobbies.map((hobby, index) => (
              <div key={index} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-tighter">{hobby}</span>
                <button onClick={() => removeHobby(index)} className="text-red-500 hover:text-red-400"><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/40 active:scale-95"
        >
          <Save size={18}/>
          {isSaving ? "Synchronizing Bio..." : "Update About Node"}
        </button>

      </div>
    </div>
  );
}
