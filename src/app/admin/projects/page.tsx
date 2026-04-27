"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { Trash2, Edit3, ArrowUp, ArrowDown, Save, X } from "lucide-react";

// --- Data Map for Categories and Subcategories ---
const CATEGORY_MAP = {
  "Personal Project": {
    description: "Logo Design, Photo Manipulation, Typography Choices.",
    subcategories: ["Social Media Posts", "Logo Design", "Photo Manipulation", "Conceptual Rebrands", "Speculative UI/UX (Concept Apps)", "Artistic & Experimental Design"],
  },
  "Brand Identity": {
    description: "Logo Design, Typography Choices, Brand Color Palettes",
    subcategories: ["Logo Design", "Typography", "Brand Color Palettes", "Corporate Stationery", "Brand Guidelines (Style Guides)", "Iconography & Graphic Devices"],
  },
  "UI/UX Design": {
    description: "Website landing pages, mobile app interfaces",
    subcategories: ["Website Landing Pages", "Mobile App Interfaces", "Portfolio Designs", "Wireframing"],
  },
  "Social Media Post": {
    description: "Instagram grids, ad banners, and posts",
    subcategories: ["Facebook Post", "Instagram Post", "LinkedIn Post & Carousel", "Carousel Design", "Ad Banners", "Email Templates"],
  },
  "Print Media": {
    description: "Flex designs, Calendars, brochures, posters",
    subcategories: ["Brand Guide", "Stationery Suite", "Flex Designs", "Calendars", "Brochures", "Event Posters"],
  },
  "Motion": {
    description: "Product Video, Documentary Video and Advertisnment Video",
    subcategories: ["Brand Documentary", "Product Informational", "Micro-Storytelling"],
  },
};

export default function AdminProjectsPage() {
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<keyof typeof CATEGORY_MAP | "">("");
  const [subCategory, setSubCategory] = useState("");
  const [tags, setTags] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [date, setDate] = useState("");
  const [projectImg, setProjectImg] = useState("");
  const [description, setDescription] = useState("");
  
  // Database State
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch Projects ---
  const fetchProjects = async () => {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  // --- Category Change Handler ---
  const handleCategoryChange = (val: keyof typeof CATEGORY_MAP) => {
    setCategory(val);
    setSubCategory(""); // Reset subcat
    setDescription(CATEGORY_MAP[val].description); // Auto-fill standard description
  };

  // --- Image Upload Logic ---
  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setProjectImg(data.secure_url);
    } catch (err) { alert("Upload failed"); } finally { setLoading(false); }
  };

  // --- Save / Update Project ---
  const handleSave = async () => {
    if (!title || !category || !projectImg) return alert("Fill mandatory fields (Title, Category, Image)");

    const descArray = description.split(/\n|\.(?=\s|$)/).map(l => l.trim()).filter(l => l.length > 0);
    const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t !== "");

    const projectData = {
      title, category, subCategory, tags: tagsArray, demoLink, githubLink, date,
      image: projectImg, description: descArray, 
      order: editingId ? projects.find(p => p.id === editingId).order : projects.length + 1,
      updatedAt: new Date()
    };

    if (editingId) {
      await updateDoc(doc(db, "projects", editingId), projectData);
      alert("Project Updated!");
    } else {
      await addDoc(collection(db, "projects"), { ...projectData, createdAt: new Date() });
      alert("New Project Deployed!");
    }
    resetForm();
    fetchProjects();
  };

  const resetForm = () => {
    setEditingId(null); setTitle(""); setCategory(""); setSubCategory(""); setTags(""); setDemoLink(""); setGithubLink(""); setDate(""); setProjectImg(""); setDescription("");
  };

  // --- Edit Project ---
  const startEdit = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setSubCategory(p.subCategory);
    setTags(p.tags.join(", "));
    setDemoLink(p.demoLink);
    setGithubLink(p.githubLink);
    setDate(p.date);
    setProjectImg(p.image);
    setDescription(Array.isArray(p.description) ? p.description.join(". ") : p.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Delete ---
  const handleDelete = async (id: string) => {
    if (confirm("Delete forever?")) {
      await deleteDoc(doc(db, "projects", id));
      fetchProjects();
    }
  };

  // --- Rearrange Order ---
  const moveProject = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === projects.length - 1)) return;
    const newProjects = [...projects];
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    [newProjects[index], newProjects[swapIdx]] = [newProjects[swapIdx], newProjects[index]];
    
    // Batch update order in Firestore
    for (let i = 0; i < newProjects.length; i++) {
        await updateDoc(doc(db, "projects", newProjects[i].id), { order: i });
    }
    fetchProjects();
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 space-y-24">
      <div className="flex justify-between items-end">
        <h1 className="text-7xl font-black tracking-tighter text-white">Project Studio</h1>
        {editingId && <button onClick={resetForm} className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest border border-red-500/20">Cancel Editing</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT: IMAGE UPLOAD */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] sticky top-12 space-y-6 text-center">
            <label className="text-[12px] uppercase font-bold tracking-widest text-white block opacity-50">Visual Assets</label>
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              className="w-full aspect-square bg-black/40 rounded-[1.5rem] border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center relative cursor-pointer"
            >
              {projectImg ? (
                <img src={projectImg} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs text-white opacity-20 uppercase font-black px-12">Drag Showcase Image or Browser</p>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
            </div>
            <input value={projectImg} onChange={e => setProjectImg(e.target.value)} placeholder="Or paste custom URL" className="w-full bg-white/5 p-4 rounded-xl outline-none text-white text-xs border border-white/5 text-center" />
        </div>

        {/* RIGHT: CONFIGURATION */}
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 bg-white/[0.03] p-8 md:p-10 border border-white/10 rounded-[2rem]">
                <div className="space-y-1">
                    <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50 tracking-widest">Project Name</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nexus UI Design..." className="w-full bg-white/5 p-5 rounded-[1rem] outline-none text-white border border-white/10 focus:border-blue-500 text-lg font-bold" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50">Category</label>
                        <select value={category} onChange={e => handleCategoryChange(e.target.value as any)} className="w-full bg-zinc-900 p-4 rounded-2xl outline-none text-white border border-white/10">
                            <option value="">Select Category</option>
                            {Object.keys(CATEGORY_MAP).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50">Subcategory</label>
                        <select value={subCategory} onChange={e => setSubCategory(e.target.value)} disabled={!category} className="w-full bg-zinc-900 p-4 rounded-2xl outline-none text-white border border-white/10 disabled:opacity-20">
                            <option value="">Select Sub</option>
                            {category && CATEGORY_MAP[category].subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50">Tags (Comma Separated)</label>
                    <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Web, Art, AI..." className="w-full bg-white/5 p-4 rounded-2xl outline-none text-white border border-white/10" />
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50">Process & Features (Sentence Auto-Separator)</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 p-6 rounded-[2.5rem] outline-none text-white h-32 border border-white/10" placeholder="Type sentence 1. Type sentence 2..." />
                </div>

                <button onClick={handleSave} disabled={loading} className="w-full bg-white text-black py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] hover:scale-95 transition-all">
                  {editingId ? "Update Project" : "Deploy Project"}
                </button>
            </div>
        </div>
      </div>

      {/* --- PREVIOUSLY UPLOADED PROJECTS --- */}
      <div className="space-y-12">
          <div className="flex justify-between items-end">
            <h2 className="text-5xl font-black tracking-tighter opacity-1000 uppercase">Archives</h2>
            <p className="text-[10px] uppercase font-bold opacity-30">{projects.length} Total Deployed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {projects.map((p, idx) => (
                <div key={p.id} className="group relative bg-white/[0.03] border border-white/5 rounded-[3rem] p-6 hover:bg-white/[0.06] transition-all flex flex-col gap-4">
                    {/* Move Icons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => moveProject(idx, 'up')} className="p-2 bg-white/5 rounded-full hover:bg-white text-white hover:text-black transition-colors"><ArrowUp size={14}/></button>
                       <button onClick={() => moveProject(idx, 'down')} className="p-2 bg-white/5 rounded-full hover:bg-white text-white hover:text-black transition-colors"><ArrowDown size={14}/></button>
                    </div>

                    <img src={p.image} className="w-full aspect-[4/3] object-cover rounded-[2rem]" />
                    <div>
                        <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-blue-500 mb-1">{p.category} // {p.subCategory}</p>
                        <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1">{p.title}</h3>
                    </div>

                    <div className="mt-auto pt-4 flex gap-3 border-t border-white/5">
                        <button onClick={() => startEdit(p)} className="flex-1 bg-white/5 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            <Edit3 size={14}/> Edit
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-12 h-12 bg-red-500/10 text-red-500 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={16}/>
                        </button>
                    </div>
                </div>
             ))}
          </div>
      </div>
    </div>
  );
}
