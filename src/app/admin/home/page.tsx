"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { ImagePlus, Plus, X, Save, Facebook, Linkedin, Globe, Github, Twitter, Shield, ShieldOff } from "lucide-react";

export default function HomeAdmin() {
  const [name, setName] = useState("");
  const [staticRole, setStaticRole] = useState("I am a Passionate Graphic Designer &");
  const [heroImage, setHeroImage] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [antiScreenshot, setAntiScreenshot] = useState(true); // Security State

  const [facebook, setFacebook] = useState("");
  const [behance, setBehance] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const docRef = doc(db, "siteData", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setStaticRole(data.staticRole || "");
          setHeroImage(data.heroImage || "");
          setRoles(data.roles || []);
          setFacebook(data.socials?.facebook || "");
          setBehance(data.socials?.behance || "");
          setLinkedin(data.socials?.linkedin || "");
          setWebsite(data.socials?.website || "");
          setGithub(data.socials?.github || "");
        }

        // Load Global Security Settings
        const secRef = doc(db, "settings", "security");
        const secSnap = await getDoc(secRef);
        if (secSnap.exists()) {
          setAntiScreenshot(secSnap.data().antiScreenshot);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setIsLoading(false);
    };
    loadHomeData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save Home Data
      await setDoc(doc(db, "siteData", "home"), {
        name, staticRole, heroImage, roles,
        socials: { facebook, behance, linkedin, website, github },
        lastUpdated: new Date()
      }, { merge: true });

      // Save Global Security Toggle
      await setDoc(doc(db, "settings", "security"), {
        antiScreenshot,
        lastUpdated: new Date()
      }, { merge: true });

      alert("Configuration Updated Successfully!");
    } catch (error) {
      alert("Save failed");
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-white">SYNCING CORE...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 p-4 md:p-10">
      <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white">Home Config</h1>

      {/* ANTI-SCREENSHOT TOGGLE */}
      <div className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${antiScreenshot ? 'bg-blue-600/10 border-blue-500/50' : 'bg-red-600/10 border-red-500/50'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${antiScreenshot ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
            {antiScreenshot ? <Shield size={24}/> : <ShieldOff size={24}/>}
          </div>
          <div>
            <h3 className="font-bold text-white">Global Anti-Screenshot</h3>
            <p className="text-[10px] uppercase opacity-50 text-white font-bold tracking-widest">
              {antiScreenshot ? "Protection is Active" : "Protection is Disabled"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setAntiScreenshot(!antiScreenshot)}
          className={`w-14 h-8 rounded-full relative transition-all ${antiScreenshot ? 'bg-blue-500' : 'bg-zinc-700'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${antiScreenshot ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl p-6 md:p-10 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl">
        {/* HERO IMAGE SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/5">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden bg-white/5 border-2 border-blue-500/20 group shrink-0">
            {heroImage ? <img src={heroImage} alt="Hero" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-20 text-white"><ImagePlus size={40}/></div>}
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
              <input type="file" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", CLOUDINARY_PRESET);
                const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
                const data = await res.json();
                setHeroImage(data.secure_url);
              }} />
              <span className="text-[10px] font-bold uppercase text-white">Change</span>
            </label>
          </div>
          <div className="flex-1 space-y-4 w-full text-white">
             <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black opacity-40 ml-4">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 text-xl font-bold" />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black opacity-40 ml-4">Greeting Text</label>
                <input value={staticRole} onChange={e => setStaticRole(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5" />
             </div>
          </div>
        </div>

        {/* ROLES */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-black opacity-40 ml-4 text-white">Animated Roles</label>
          <div className="flex gap-2">
            <input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="e.g. Designer" className="flex-1 bg-white/5 p-4 rounded-2xl outline-none border border-white/5 text-white" />
            <button onClick={() => { if(newRole.trim()){ setRoles([...roles, newRole.trim()]); setNewRole(""); } }} className="px-6 bg-blue-600 rounded-2xl text-white"><Plus/></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.map((role, index) => (
              <div key={index} className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl">
                <span className="text-sm font-bold text-blue-400">{role}</span>
                <button onClick={() => setRoles(roles.filter((_, i) => i !== index))} className="text-red-500"><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* SOCIALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-white/5">
            {[
                { icon: <Facebook size={18}/>, val: facebook, set: setFacebook, ph: "Facebook URL", color: "text-blue-500" },
                { icon: <Twitter size={18}/>, val: behance, set: setBehance, ph: "Behance URL", color: "text-blue-400" },
                { icon: <Linkedin size={18}/>, val: linkedin, set: setLinkedin, ph: "LinkedIn URL", color: "text-blue-700" },
                { icon: <Globe size={18}/>, val: website, set: setWebsite, ph: "Portfolio URL", color: "text-emerald-500" },
            ].map((soc, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <div className={`p-3 bg-white/5 rounded-xl ${soc.color}`}>{soc.icon}</div>
                    <input value={soc.val} onChange={e => soc.set(e.target.value)} placeholder={soc.ph} className="bg-transparent outline-none flex-1 text-sm text-white" />
                </div>
            ))}
        </div>

        <button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
          <Save size={18}/> {isSaving ? "Saving..." : "Update Home Node"}
        </button>
      </div>
    </div>
  );
}
