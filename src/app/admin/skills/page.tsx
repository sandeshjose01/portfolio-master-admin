"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, onSnapshot, setDoc } from "firebase/firestore";
import { Trash2, Edit3, X, GripVertical, Sparkles, ImagePlus, Save } from "lucide-react";

const AUTO_ICONS: Record<string, string> = {
  "photoshop": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "illustrator": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "indesign": "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
  "after effects": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "premiere pro": "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "canva": "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
};

export default function AdminSkillsPage() {
  // Page Level State
  const [pageHeading, setPageHeading] = useState("My Technical Experience/Skills.");
  const [pageDesc, setPageDesc] = useState("");
  
  // Skill Item State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Graphic Designing Tools");
  const [skillIcon, setSkillIcon] = useState("");
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load Page Header Info
    onSnapshot(doc(db, "siteData", "skillsPage"), (d) => {
      if(d.exists()){
        setPageHeading(d.data().heading);
        setPageDesc(d.data().description);
      }
    });
    // Load Skills
    onSnapshot(query(collection(db, "skills"), orderBy("order", "asc")), (snap) => {
      setSkills(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  useEffect(() => {
    const search = name.toLowerCase().trim();
    if (AUTO_ICONS[search]) { setSkillIcon(AUTO_ICONS[search]); setIsAutoDetected(true); }
  }, [name]);

  const savePageHeader = async () => {
    await setDoc(doc(db, "siteData", "skillsPage"), { heading: pageHeading, description: pageDesc }, { merge: true });
    alert("Header Updated!");
  };

  const handleSaveSkill = async () => {
    if (!name || !skillIcon) return alert("Missing Name or Icon");
    setLoading(true);
    try {
      const data = { name, category, icon: skillIcon, updatedAt: new Date() };
      if (editingId) { await updateDoc(doc(db, "skills", editingId), data); } 
      else { await addDoc(collection(db, "skills"), { ...data, createdAt: new Date(), order: skills.length }); }
      setEditingId(null); setName(""); setSkillIcon(""); setIsAutoDetected(false);
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  const handleDrop = async (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newList = [...skills];
    const item = newList.splice(draggedIndex, 1)[0];
    newList.splice(index, 0, item);
    setSkills(newList);
    setDraggedIndex(null);
    newList.forEach((s, i) => updateDoc(doc(db, "skills", s.id), { order: i }));
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <h1 className="text-5xl font-black text-white tracking-tighter">Skills Editor</h1>

      {/* 1. EDIT PAGE HEADER (Heading & Paragraph) */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4">
          <label className="text-[10px] uppercase font-black opacity-40 text-white ml-2">Main Heading & Intro Paragraph</label>
          <input value={pageHeading} onChange={e => setPageHeading(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl text-white font-bold border border-white/5" placeholder="Heading..." />
          <textarea value={pageDesc} onChange={e => setPageDesc(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl text-white text-sm border border-white/5 h-24" placeholder="Intro Paragraph..." />
          <button onClick={savePageHeader} className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-xl text-xs font-bold uppercase text-white hover:bg-blue-500 transition-all"><Save size={16}/> Save Header</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* 2. ICON PREVIEW */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto bg-black/40 rounded-2xl border-2 border-dashed flex items-center justify-center border-white/10">
                {skillIcon ? <img src={skillIcon} className="w-16 h-16 object-contain" alt="" /> : <ImagePlus className="opacity-20 text-white" />}
                {isAutoDetected && <div className="absolute -top-2 -right-2 bg-blue-500 p-1 rounded-full"><Sparkles size={12} /></div>}
            </div>
            <input value={skillIcon} onChange={e => { setSkillIcon(e.target.value); setIsAutoDetected(false); }} placeholder="Icon URL..." className="w-full bg-white/5 p-3 rounded-lg border border-white/10 text-white text-[10px] text-center" />
        </div>

        {/* 3. ADD SKILL FORM */}
        <div className="bg-white/[0.03] p-8 border border-white/10 rounded-[2.5rem] space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Skill Name (e.g. Adobe Photoshop)" className="w-full bg-white/5 p-4 rounded-xl text-white" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0a0a0a] p-4 rounded-xl text-white border border-white/10">
                <option>Graphic Designing Tools</option>
                <option>Video Editing Tools</option>
                <option>Microsoft Office</option>
                <option>Other Tools</option>
            </select>
            <button onClick={handleSaveSkill} disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest">
              {editingId ? "Update Item" : "Add Tool"}
            </button>
        </div>
      </div>

      {/* 4. DRAGGABLE ARCHIVE */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
         {skills.map((s, idx) => (
            <div key={s.id} draggable onDragStart={() => setDraggedIndex(idx)} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(idx)} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col items-center gap-3 cursor-move hover:border-blue-500/30 transition-all group relative">
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100"><GripVertical size={12} className="text-white/20"/></div>
                <img src={s.icon} className="w-10 h-10 object-contain" alt="" />
                <p className="text-[9px] font-bold text-white uppercase text-center">{s.name}</p>
                <div className="flex gap-1">
                    <button onClick={() => { setEditingId(s.id); setName(s.name); setCategory(s.category); setSkillIcon(s.icon); }} className="p-1.5 bg-white/5 rounded-md text-white"><Edit3 size={12}/></button>
                    <button onClick={() => deleteDoc(doc(db, "skills", s.id))} className="p-1.5 bg-red-500/10 text-red-500 rounded-md"><Trash2 size={12}/></button>
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}
