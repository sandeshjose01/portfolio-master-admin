"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Trash2, Edit3, Loader2, X, GripVertical } from "lucide-react";

const CATEGORY_MAP = {
  "Personal Project": { description: "Logo Design, Photo Manipulation, Typography Choices.", subcategories:["Social Media Posts", "Logo Design", "Photo Manipulation", "Conceptual Rebrands", "Speculative UI/UX (Concept Apps)", "Artistic & Experimental Design"] },
  "Brand Identity": { description: "Logo Design, Typography Choices, Brand Color Palettes", subcategories:["Logo Design", "Typography", "Brand Color Palettes", "Corporate Stationery", "Brand Guidelines (Style Guides)", "Iconography & Graphic Devices"] },
  "UI/UX Design": { description: "Website landing pages, mobile app interfaces", subcategories:["Website Landing Pages", "Mobile App Interfaces", "Portfolio Designs", "Wireframing"] },
  "Social Media Post": { description: "Instagram grids, ad banners, and posts", subcategories:["Facebook Post", "Instagram Post", "LinkedIn Post & Carousel", "Carousel Design", "Ad Banners", "Email Templates"] },
  "Print Media": { description: "Flex designs, Calendars, brochures, posters", subcategories:["Brand Guide", "Stationery Suite", "Flex Designs", "Calendars", "Brochures", "Event Posters"] },
  "Motion": { description: "Product Video, Documentary Video and Advertisnment Video", subcategories:["Brand Documentary", "Product Informational", "Micro-Storytelling"] },
};

export default function AdminProjectsPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("");
  const [subCategory, setSubCategory] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");
  const [projectImg, setProjectImg] = useState("");
  const [description, setDescription] = useState("");
  const [softwareUsed, setSoftwareUsed] = useState<string[]>([]);
  const [demoLink, setDemoLink] = useState(""); 
  const [smartLinks, setSmartLinks] = useState<string[]>([""]); 
  
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fetchProjects = async () => {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  // --- DRAG & DROP FOR LINKS ---
  const handleLinkDragStart = (index: number) => setDraggedIndex(index);
  const handleLinkDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newList = [...smartLinks];
    const item = newList.splice(draggedIndex, 1)[0];
    newList.splice(index, 0, item);
    setDraggedIndex(index);
    setSmartLinks(newList);
  };

  // --- DRAG & DROP FOR PROJECTS ---
  const handleProjectDragStart = (index: number) => setDraggedIndex(index);
  const handleProjectDrop = async (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newList = [...projects];
    const item = newList.splice(draggedIndex, 1)[0];
    newList.splice(index, 0, item);
    setProjects(newList);
    setDraggedIndex(null);
    setIsReordering(true);
    const promises = newList.map((p, i) => updateDoc(doc(db, "projects", p.id), { order: i }));
    await Promise.all(promises);
    setIsReordering(false);
  };

  const handleSave = async () => {
    if (!title || !category || !projectImg) return alert("Fill mandatory fields");
    setLoading(true);
    try {
      const descArray = description.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t !== "");
      const cleanedSmartLinks = smartLinks.filter(link => link.trim() !== "");

      const projectData = {
        title, category, subCategory, tags: tagsArray, demoLink, date,
        image: projectImg, description: descArray, softwareUsed, 
        smartLinks: cleanedSmartLinks, updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
        alert("Updated!");
      } else {
        await addDoc(collection(db, "projects"), { ...projectData, createdAt: new Date(), order: projects.length });
        alert("Deployed!");
      }
      resetForm(); fetchProjects();
    } catch (error: any) { alert(error.message); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditingId(null); setTitle(""); setCategory(""); setSubCategory(""); setTags(""); setDate(""); setProjectImg(""); setDescription(""); setSoftwareUsed([]); setDemoLink(""); setSmartLinks([""]);
  };

  const startEdit = (p: any) => {
    setEditingId(p.id); setTitle(p.title); setCategory(p.category); setSubCategory(p.subCategory); setTags(p.tags ? p.tags.join(", ") : ""); setDate(p.date || ""); setProjectImg(p.image); 
    setDescription(Array.isArray(p.description) ? p.description.join("\n") : p.description); 
    setSoftwareUsed(p.softwareUsed ||[]); setDemoLink(p.demoLink || ""); setSmartLinks(p.smartLinks?.length ? p.smartLinks : [""]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 lg:py-20 px-4 md:px-10 space-y-12 lg:space-y-24">
      <div className="flex justify-between items-end">
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">Project Studio</h1>
        {editingId && <button onClick={resetForm} className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest border border-red-500/20">Cancel</button>}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* IMAGE PREVIEW: lg:sticky makes it stick only on desktop */}
        <div className="w-full lg:sticky lg:top-10 bg-white/5 border border-white/10 p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] space-y-6 text-center z-10">
            <div className="w-full aspect-square bg-black/40 rounded-[2rem] border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center relative">
              {projectImg ? <img src={projectImg} alt="Preview" className="w-full h-full object-cover" /> : <p className="opacity-30 text-white font-bold uppercase text-[10px]">Drag Visuals Here</p>}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                 const file = e.target.files?.[0]; if (!file) return;
                 setLoading(true);
                 const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", CLOUDINARY_PRESET);
                 const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
                 const data = await res.json(); setProjectImg(data.secure_url); setLoading(false);
              }} />
            </div>
            <input value={projectImg} onChange={e => setProjectImg(e.target.value)} placeholder="URL Override" className="w-full bg-white/5 p-4 rounded-xl outline-none text-white text-xs border border-white/10 text-center" />
        </div>

        <div className="w-full space-y-6">
            <div className="bg-white/[0.03] p-6 lg:p-10 border border-white/10 rounded-[2.5rem] lg:rounded-[3rem] space-y-8">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className="w-full bg-white/5 p-5 rounded-[1rem] outline-none text-white border border-white/10 text-lg font-bold" />
                
                <div className="p-6 bg-black/20 rounded-[2rem] border border-white/5 space-y-4">
                    <label className="text-[11px] uppercase font-black text-blue-400 ml-2">Live / Visit Link</label>
                    <input value={demoLink} onChange={e => setDemoLink(e.target.value)} placeholder="Main Live URL" className="w-full bg-white/5 p-4 rounded-xl outline-none text-white text-sm border border-white/10" />
                    
                    <label className="text-[11px] uppercase font-black text-white ml-2 opacity-50 block pt-4">Smart Platform Links (Drag to Reorder)</label>
                    {smartLinks.map((link, index) => (
                        <div key={index} draggable onDragStart={() => handleLinkDragStart(index)} onDragOver={(e) => handleLinkDragOver(e, index)} onDragEnd={() => setDraggedIndex(null)} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 cursor-move active:scale-95 transition-all">
                            <GripVertical className="text-white/20" size={20}/>
                            <input value={link} onChange={e => { const n = [...smartLinks]; n[index] = e.target.value; setSmartLinks(n); }} placeholder="Paste Social/Platform URL..." className="flex-1 bg-transparent outline-none text-white text-sm p-2" />
                            <button onClick={() => setSmartLinks(smartLinks.filter((_, i) => i !== index))} className="p-2 text-red-500"><X size={16}/></button>
                        </div>
                    ))}
                    <button onClick={() => setSmartLinks([...smartLinks, ""])} className="text-[10px] font-black text-white/40 uppercase ml-2">+ Add Another Link</button>
                </div>

                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 p-6 rounded-[1.5rem] outline-none text-white h-48 border border-white/10 resize-none" placeholder="Project Description (Paragraphs)..." />

                <button onClick={handleSave} disabled={loading} className="w-full bg-white text-black py-8 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.4em] hover:scale-95 transition-all active:scale-90 shadow-2xl">
                  {loading ? "SAVING..." : editingId ? "OVERWRITE" : "DEPLOY"}
                </button>
            </div>
        </div>
      </div>

      <div className="space-y-12">
          <h2 className="text-4xl font-black text-white italic uppercase flex items-center gap-4">Archives {isReordering && <Loader2 className="animate-spin text-blue-500" size={24}/>}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {projects.map((p, idx) => (
                <div key={p.id} draggable onDragStart={() => handleProjectDragStart(idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleProjectDrop(idx)} onDragEnd={() => setDraggedIndex(null)} className="group relative bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-7 flex flex-col gap-5 cursor-move hover:border-blue-500/50 transition-all">
                    <div className="absolute top-4 left-4 z-20 bg-blue-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={16} className="text-white"/></div>
                    <img src={p.image} className="w-full aspect-[4/3] object-cover rounded-[2rem] border border-white/10" alt="Preview" />
                    <div>
                        <p className="text-[9px] uppercase font-black text-blue-500 mb-2">{p.category} // {p.subCategory}</p>
                        <h3 className="text-2xl font-bold text-white line-clamp-1">{p.title}</h3>
                    </div>
                    <div className="mt-auto pt-6 flex gap-3">
                        <button onClick={() => startEdit(p)} className="flex-1 bg-white/5 py-4 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-white hover:text-black transition-all">Modify</button>
                        <button onClick={() => { if(confirm("Delete?")) deleteDoc(doc(db, "projects", p.id)).then(fetchProjects); }} className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"><Trash2 size={20}/></button>
                    </div>
                </div>
             ))}
          </div>
      </div>
    </div>
  );
}
