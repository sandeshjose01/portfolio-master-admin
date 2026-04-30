"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, doc, updateDoc, deleteDoc, onSnapshot, setDoc } from "firebase/firestore";
import { Trash2, Edit3, GripVertical, Sparkles, ImagePlus, Save } from "lucide-react";

// --- EXPANDED SMART ICON LIBRARY ---
const AUTO_ICONS: Record<string, string> = {
 
  // Adobe Photoshop
  "photoshop": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "adobe photoshop": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "ps": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "adobe ps": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",

  // Adobe Illustrator
  "illustrator": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "adobe illustrator": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "ai": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "adobe ai": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",

  // Adobe InDesign
  "indesign": "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
  "adobe indesign": "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
  "id": "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
  "adobe id": "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",

  // Adobe After Effects
  "after effects": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "adobe after effects": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "ae": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "adobe ae": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",

  // Adobe Premiere Pro
  "premiere pro": "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "adobe premiere": "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "pr": "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "adobe pr": "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "premiere": "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",

  // Adobe Lightroom
  "lightroom": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg",
  "adobe lightroom": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg",
  "lr": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg",
  "adobe lr": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg",

  // Adobe Audition
  "audition": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Adobe_Audition_CC_icon.svg",
  "adobe audition": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Adobe_Audition_CC_icon.svg",
  "au": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Adobe_Audition_CC_icon.svg",
  "adobe au": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Adobe_Audition_CC_icon.svg",

  // Adobe Animate / Flash
  "animate": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Animate_CC_icon.svg",
  "adobe animate": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Animate_CC_icon.svg",
  "an": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Animate_CC_icon.svg",
  "adobe an": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Animate_CC_icon.svg",
  "flash": "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Animate_CC_icon.svg",

  // Adobe Media Encoder
  "media encoder": "https://upload.wikimedia.org/wikipedia/commons/4/47/Adobe_Media_Encoder_CC_icon.svg",
  "me": "https://upload.wikimedia.org/wikipedia/commons/4/47/Adobe_Media_Encoder_CC_icon.svg",
  "adobe me": "https://upload.wikimedia.org/wikipedia/commons/4/47/Adobe_Media_Encoder_CC_icon.svg",

  // Adobe Acrobat / PDF
  "acrobat": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Adobe_Acrobat_DC_logo_2020.svg",
  "adobe acrobat": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Adobe_Acrobat_DC_logo_2020.svg",
  "pdf": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Adobe_Acrobat_DC_logo_2020.svg",

  // DaVinci Resolve
  "davinci resolve": "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio_17_logo.png",
  "davinci": "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio_17_logo.png",
  "resolve": "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio_17_logo.png",
  "dvr": "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio_17_logo.png",

  // Figma
  "figma": "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
   
   // Canva
  "canva": "https://img.icons8.com/?size=100&id=iWw83PVcBpLw&format=png&color=000000",
   
   // Capcut
  "capcut": "https://upload.wikimedia.org/wikipedia/en/2/23/CapCut_logo.png",
   
   //Blinder
  "blender": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg",
   
   // Coraldraw
  "coreldraw": "https://upload.wikimedia.org/wikipedia/commons/d/d0/CorelDraw_X8_Icon.png",
   
   // Microsoft Office
  "office": "https://upload.wikimedia.org/wikipedia/commons/4/42/Microsoft_Office_2013_logo_and_wordmark.svg",
  "microsoft office": "https://upload.wikimedia.org/wikipedia/commons/4/42/Microsoft_Office_2013_logo_and_wordmark.svg",
  "ms office": "https://upload.wikimedia.org/wikipedia/commons/4/42/Microsoft_Office_2013_logo_and_wordmark.svg",
   
   // MS Word
  "word": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Word_2013-2019_logo.svg",
  "microsoft word": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Word_2013-2019_logo.svg",
  "ms word": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Word_2013-2019_logo.svg",
   
   // MS Excel
  "excel": "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Excel_2013-2019_logo.svg",
  "microsoft excel": "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Excel_2013-2019_logo.svg",
  "ms excel": "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Excel_2013-2019_logo.svg",
   
   // MS Powerpoint
  "powerpoint": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Microsoft_PowerPoint_2013-2019_logo.svg",
  "microsoft powerpoint": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Microsoft_PowerPoint_2013-2019_logo.svg",
  "ms powerpoint": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Microsoft_PowerPoint_2013-2019_logo.svg",
  "ppt": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Microsoft_PowerPoint_2013-2019_logo.svg",

  // Adobe XD (UI/UX)
  "xd": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_XD_CC_icon.svg",
  "adobe xd": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_XD_CC_icon.svg",

  // Adobe Bridge (Asset Management)
  "bridge": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Adobe_Bridge_CC_icon.svg",
  "adobe bridge": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Adobe_Bridge_CC_icon.svg",

  // Procreate (Digital Illustration)
  "procreate": "https://upload.wikimedia.org/wikipedia/commons/7/73/Procreate_logo.png",

  // Affinity Designer
  "affinity designer": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Affinity_Designer_Icon.png",
  
  // Sketch (UI/UX)
  "sketch": "https://upload.wikimedia.org/wikipedia/commons/5/59/Sketch_Logo.svg",

  // Cinema 4D
  "cinema 4d": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Cinema_4D_Logo.png",
  "c4d": "https://upload.wikimedia.org/wikipedia/e/e3/Cinema_4D_Logo.png",

  // Unreal Engine (Real-time Video/Environments)
  "unreal": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Unreal_Engine_Logo.svg",
  "unreal engine": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Unreal_Engine_Logo.svg",
  "ue5": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Unreal_Engine_Logo.svg",

  // Maya
  "maya": "https://upload.wikimedia.org/wikipedia/commons/1/12/Autodesk_Maya_logo.svg",

  // Topaz Video AI (Enhancing video quality)
  "topaz": "https://upload.wikimedia.org/wikipedia/en/2/27/Topaz_Labs_logo.png",

  // Meta Business Suite (Facebook/Instagram Ads)
  "meta": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "meta business": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",

  // Notion (Project Management)
  "notion": "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",

  // Slack (Team Communication)
  "slack": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",

  // Trello
  "trello": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Trello-logo.svg",

  // WordPress
  "wordpress": "https://upload.wikimedia.org/wikipedia/commons/9/93/Wordpress_Blue_logo.svg",
  "wp": "https://upload.wikimedia.org/wikipedia/commons/9/93/Wordpress_Blue_logo.svg",

  // HTML5
  "html": "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
  "html5": "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",

  // CSS3
  "css": "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
  "css3": "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",

  // Midjourney
  "midjourney": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.svg",

  // ChatGPT (for Content/Copywriting)
  "chatgpt": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  "openai": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",

  // TikTok Business & Ads
  "tiktok business": "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
  "tiktok ads": "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",

  // LinkedIn Business & Ads
  "linkedin business": "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  "linkedin ads": "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  "linkedin marketing": "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",

  // Meta (Facebook/Instagram) Business Suite
  "meta business suite": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "meta ads": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "facebook ads": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",

  // Google Ads
  "google ads": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg",
  "adwords": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg",

  // YouTube Studio/Marketing
  "youtube studio": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg",
  "youtube marketing": "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",

  // Pinterest Business
  "pinterest business": "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
  "pinterest ads": "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",

  // Email Marketing
  "mailchimp": "https://upload.wikimedia.org/wikipedia/en/c/cc/Mailchimp_Logo.svg",
  
  // Social Media Management
  "hootsuite": "https://upload.wikimedia.org/wikipedia/en/2/23/Hootsuite_logo.svg",
  "buffer": "https://upload.wikimedia.org/wikipedia/commons/3/30/Buffer_logo.svg",

  // E-commerce Design
  "shopify": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
  "etsy": "https://upload.wikimedia.org/wikipedia/commons/8/89/Etsy_logo.svg",

};

export default function AdminSkillsPage() {
  const [pageHeading, setPageHeading] = useState("");
  const [pageDesc, setPageDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Graphic Designing Tools");
  const [skillIcon, setSkillIcon] = useState("");
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    onSnapshot(doc(db, "siteData", "skillsPage"), (d) => {
      if(d.exists()){ setPageHeading(d.data().heading); setPageDesc(d.data().description); }
    });
    onSnapshot(query(collection(db, "skills"), orderBy("order", "asc")), (snap) => {
      setSkills(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // --- SMART AUTO-DETECTION ---
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

  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setSkillIcon(data.secure_url);
      setIsAutoDetected(false);
    } catch (err) { alert("Upload failed"); } finally { setLoading(false); }
  };

  const handleSaveSkill = async () => {
    if (!name || !skillIcon) return alert("Fill Name and Icon");
    setLoading(true);
    try {
      const data = { name, category, icon: skillIcon, updatedAt: new Date() };
      if (editingId) { await updateDoc(doc(db, "skills", editingId), data); } 
      else { await addDoc(collection(db, "skills"), { ...data, createdAt: new Date(), order: skills.length }); }
      setEditingId(null); setName(""); setSkillIcon(""); setIsAutoDetected(false);
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  // --- REFINED DRAG & DROP LOGIC ---
  const onDragStart = (index: number) => setDraggedIndex(index);
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newList = [...skills];
    const item = newList.splice(draggedIndex, 1)[0];
    newList.splice(index, 0, item);
    setDraggedIndex(index);
    setSkills(newList);
  };
  const onDragEnd = async () => {
    setDraggedIndex(null);
    const promises = skills.map((s, i) => updateDoc(doc(db, "skills", s.id), { order: i }));
    await Promise.all(promises);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 pb-32">
      <h1 className="text-5xl font-black text-white tracking-tighter">Skills Editor</h1>

      {/* HEADER SECTION */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4 shadow-2xl">
          <label className="text-[10px] uppercase font-black opacity-30 text-white tracking-widest">Main Text Controls</label>
          <input value={pageHeading} onChange={e => setPageHeading(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl text-white font-bold border border-white/10 focus:border-blue-500" />
          <textarea value={pageDesc} onChange={e => setPageDesc(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl text-white text-sm border border-white/10 h-24 focus:border-blue-500" />
          <button onClick={() => setDoc(doc(db, "siteData", "skillsPage"), { heading: pageHeading, description: pageDesc })} className="bg-blue-600 px-8 py-3 rounded-xl text-xs font-black text-white uppercase hover:bg-blue-500 transition-all flex items-center gap-2"><Save size={16}/> Sync Portfolio Header</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* ICON CONTROL */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center space-y-6">
            <div className={`relative w-28 h-24 mx-auto rounded-3xl border-2 border-dashed flex items-center justify-center transition-all ${isAutoDetected ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'border-white/10 bg-black/40'}`}>
                {skillIcon ? <img src={skillIcon} className="w-16 h-16 object-contain" alt="" /> : <ImagePlus className="opacity-20 text-white" />}
                {isAutoDetected && <div className="absolute -top-2 -right-2 bg-blue-500 p-1.5 rounded-full ring-4 ring-black animate-pulse"><Sparkles size={14} className="text-white" /></div>}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
            </div>
            <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Type name to auto-detect icon</p>
            <input value={skillIcon} onChange={e => { setSkillIcon(e.target.value); setIsAutoDetected(false); }} placeholder="Or paste icon link manually..." className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-white text-[10px] text-center" />
        </div>

        {/* INPUT FORM */}
        <div className="bg-white/[0.03] p-8 border border-white/10 rounded-[2.5rem] space-y-5">
            <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-white/40 ml-4">Software Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="PS, AE, DaVinci..." className="w-full bg-white/5 p-5 rounded-2xl outline-none text-white font-bold border border-white/5 focus:border-blue-500" />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-white/40 ml-4">Section Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0a0a0a] p-5 rounded-2xl text-white border border-white/10 cursor-pointer">
                    <option>Graphic Designing Tools</option>
                    <option>Video Editing Tools</option>
                    <option>Marketing & Ad Tools</option> {/* NEW CATEGORY */}
                    <option>Microsoft Office</option>
                    <option>Other Tools</option>
                </select>
            </div>
            <button onClick={handleSaveSkill} disabled={loading} className="w-full bg-white text-black py-8 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:scale-95 transition-all">
              {editingId ? "Overwrite Existing" : "Add to Portfolio"}
            </button>
        </div>
      </div>

      {/* DRAGGABLE LIST */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white/20 uppercase tracking-[0.4em] ml-2">Drag to Reorder Inventory</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
           {skills.map((s, idx) => (
              <div 
                key={s.id} 
                draggable 
                onDragStart={() => onDragStart(idx)} 
                onDragOver={(e) => onDragOver(e, idx)} 
                onDragEnd={onDragEnd}
                className={`bg-[#0f0f0f] p-5 rounded-3xl border border-white/5 flex flex-col items-center gap-3 cursor-move transition-all group relative ${draggedIndex === idx ? 'opacity-30 scale-90 border-blue-500' : 'opacity-100 hover:border-white/20'}`}
              >
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={14} className="text-white/20"/></div>
                  <img src={s.icon} className="w-12 h-12 object-contain" alt="" />
                  <p className="text-[10px] font-black text-white uppercase text-center leading-tight truncate w-full">{s.name}</p>
                  <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(s.id); setName(s.name); setCategory(s.category); setSkillIcon(s.icon); window.scrollTo({top:0, behavior:'smooth'}) }} className="p-2 bg-white/5 rounded-lg text-white hover:bg-white hover:text-black"><Edit3 size={14}/></button>
                      <button onClick={() => deleteDoc(doc(db, "skills", s.id))} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={14}/></button>
                  </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
