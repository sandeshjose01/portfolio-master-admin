"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ImagePlus, Plus, X, Save, Facebook, Linkedin, Globe, Github, Twitter } from "lucide-react";

export default function HomeAdmin() {
  // --- 1. STATE MANAGEMENT ---
  const [name, setName] = useState("");
  const [staticRole, setStaticRole] = useState("I am a Creative Graphic Designer &");
  const [heroImage, setHeroImage] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  
  // Social Links
  const [facebook, setFacebook] = useState("");
  const [behance, setBehance] = useState(""); // You mentioned Twitter icon but Behance URL
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- 2. FETCH EXISTING DATA ---
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
      } catch (error) {
        console.error("Error loading home data:", error);
      }
      setIsLoading(false);
    };
    loadHomeData();
  }, []);

  // --- 3. HANDLERS ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setHeroImage(data.secure_url);
    } catch (error) {
      alert("Image upload failed");
    }
  };

  const addRole = () => {
    if (newRole.trim()) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
    }
  };

  const removeRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "siteData", "home"), {
        name,
        staticRole,
        heroImage,
        roles,
        socials: {
          facebook,
          behance,
          linkedin,
          website,
          github
        },
        lastUpdated: new Date()
      }, { merge: true });
      alert("Home Page updated successfully!");
    } catch (error) {
      alert("Save failed");
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse">SYNCING HOME NODE...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 p-4">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Home Configuration</h1>

      <div className="bg-white/5 backdrop-blur-3xl p-6 md:p-10 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl">
        
        {/* HERO IMAGE SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/5">
          <div className="relative w-40 h-40 rounded-[2rem] overflow-hidden bg-white/5 border-2 border-blue-500/20 group">
            {heroImage ? (
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20"><ImagePlus size={40}/></div>
            )}
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
              <input type="checkbox" className="hidden" /> {/* Dummy */}
              <input type="file" className="hidden" onChange={handleImageUpload} />
              <span className="text-xs font-bold uppercase text-white">Change Photo</span>
            </label>
          </div>
          <div className="flex-1 space-y-4 w-full">
             <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black opacity-40 ml-4">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 border border-white/5 text-xl font-bold" />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black opacity-40 ml-4">Static Greeting Text</label>
                <input value={staticRole} onChange={e => setStaticRole(e.target.value)} className="w-full bg-white/5 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 border border-white/5" />
             </div>
          </div>
        </div>

        {/* ANIMATED ROLES (INFINITE LIST) */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-black opacity-40 ml-4">Animated Roles (Infinite Typing Loop)</label>
          <div className="flex gap-2">
            <input 
              value={newRole} 
              onChange={e => setNewRole(e.target.value)}
              placeholder="e.g. Freelancer" 
              className="flex-1 bg-white/5 p-4 rounded-2xl outline-none border border-white/5" 
            />
            <button onClick={addRole} className="px-6 bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all"><Plus/></button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {roles.map((role, index) => (
              <div key={index} className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl">
                <span className="text-sm font-bold text-blue-400">{role}</span>
                <button onClick={() => removeRole(index)} className="text-red-500 hover:text-red-400"><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* SOCIAL LINKS SECTION */}
        <div className="space-y-4 pt-8 border-t border-white/5">
          <label className="text-[10px] uppercase font-black opacity-40 ml-4">Social Network Hub</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                <div className="p-3 bg-blue-600/20 text-blue-500 rounded-xl"><Facebook size={18}/></div>
                <input value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="Facebook URL" className="bg-transparent outline-none flex-1 text-sm" />
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                <div className="p-3 bg-blue-400/20 text-blue-400 rounded-xl"><Twitter size={18}/></div>
                <input value={behance} onChange={e => setBehance(e.target.value)} placeholder="Twitter/Behance URL" className="bg-transparent outline-none flex-1 text-sm" />
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                <div className="p-3 bg-blue-700/20 text-blue-700 rounded-xl"><Linkedin size={18}/></div>
                <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="LinkedIn URL" className="bg-transparent outline-none flex-1 text-sm" />
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                <div className="p-3 bg-emerald-600/20 text-emerald-500 rounded-xl"><Globe size={18}/></div>
                <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Portfolio URL" className="bg-transparent outline-none flex-1 text-sm" />
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 md:col-span-2">
                <div className="p-3 bg-white/10 text-white rounded-xl"><Github size={18}/></div>
                <input value={github} onChange={e => setGithub(e.target.value)} placeholder="GitHub Profile URL" className="bg-transparent outline-none flex-1 text-sm" />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Save size={18}/>
          {isSaving ? "Synchronizing..." : "Update Home Node"}
        </button>

      </div>
    </div>
  );
}
