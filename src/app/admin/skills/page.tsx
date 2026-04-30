"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Trash2, Edit3, X, GripVertical, Sparkles, ImagePlus } from "lucide-react";

// --- AUTO-ICON MAP ---
const AUTO_ICONS: Record<string, string> = {
  "photoshop": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "illustrator": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "indesign": "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
  "after effects": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "premiere pro": "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "figma": "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  "canva": "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
  "capcut": "https://upload.wikimedia.org/wikipedia/en/2/23/CapCut_logo.png",
};

export default function AdminSkillsPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Software Proficiency");
  const [skillIcon, setSkillIcon] = useState("");
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const search = name.toLowerCase().trim();
    if (AUTO_ICONS[search]) {
      setSkillIcon(AUTO_ICONS[search]);
      setIsAutoDetected(true);
    } else if (isAutoDetected) {
      setSkillIcon("");
      setIsAutoDetected(false);
    }
  }, [name]);

  const fetchSkills = async () => {
    const q = query(collection(db, "skills"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    setSkills(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSave = async () => {
    if (!name || !skillIcon) return alert("Missing Name or Icon");
    setLoading(true);
    try {
      const data = { name, category, icon: skillIcon, updatedAt: new Date() };
      if (editingId) {
        await updateDoc(doc(db, "skills", editingId), data);
      } else {
        await addDoc(collection(db, "skills"), { ...data, createdAt: new Date(), order: skills.length });
      }
      resetForm(); fetchSkills();
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditingId(null); setName(""); setSkillIcon(""); setIsAutoDetected(false);
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
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <h1 className="text-5xl font-black text-white">Skills Admin</h1>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center space-y-6">
            <div className="relative w-32 h-32 mx-auto bg-black/40 rounded-3xl border-2 border-dashed flex items-center justify-center border-white/10">
                {skillIcon ? <img src={skillIcon} className="w-20 h-20 object-contain" alt="" /> : <ImagePlus className="opacity-20 text-white" size={40} />}
                {isAutoDetected && <div className="absolute -top-2 -right-2 bg-blue-500 p-1.5 rounded-full"><Sparkles size={14} /></div>}
            </div>
            <input value={skillIcon} onChange={e => { setSkillIcon(e.target.value); setIsAutoDetected(false); }} placeholder="Paste icon URL..." className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white text-xs text-center" />
        </div>

        <div className="bg-white/[0.03] p-8 border border-white/10 rounded-[3rem] space-y-6 text-white">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Type Name (Photoshop...)" className="w-full bg-white/5 p-5 rounded-2xl outline-none" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0a0a0a] p-5 rounded-2xl border border-white/10">
                <option>Software Proficiency</option>
                <option>Design Skills</option>
                <option>Technical Skills</option>
                <option>Soft Skills</option>
            </select>
            <button onClick={handleSave} disabled={loading} className="w-full bg-white text-black py-8 rounded-2xl font-black uppercase">
              {editingId ? "Update Skill" : "Add Skill"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
         {skills.map((s, idx) => (
            <div key={s.id} draggable onDragStart={() => setDraggedIndex(idx)} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(idx)} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-4 cursor-move hover:border-blue-500/50 transition-all group">
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={14} className="text-white/20"/></div>
                <img src={s.icon} className="w-12 h-12 object-contain" alt="" />
                <p className="text-[10px] font-bold text-white uppercase text-center">{s.name}</p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(s.id); setName(s.name); setCategory(s.category); setSkillIcon(s.icon); }} className="p-2 bg-white/5 rounded-lg text-white"><Edit3 size={14}/></button>
                    <button onClick={() => deleteDoc(doc(db, "skills", s.id)).then(fetchSkills)} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={14}/></button>
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}
