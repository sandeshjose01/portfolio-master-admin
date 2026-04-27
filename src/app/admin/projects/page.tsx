// Project path: src/app/admin/projects/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Trash2, Edit3, ArrowUp, ArrowDown, X, Loader2 } from "lucide-react";

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
  
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // --- Fetch Projects (Must be ordered by "order" for automatic syncing) ---
  const fetchProjects = async () => {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCategoryChange = (val: keyof typeof CATEGORY_MAP) => {
    setCategory(val);
    setSubCategory(""); 
    setDescription(CATEGORY_MAP[val].description);
  };

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

  const handleSave = async () => {
    if (!title || !category || !projectImg) return alert("Fill mandatory fields (Title, Category, Image)");

    setLoading(true);
    try {
      const descArray = description.split(/\n|\.(?=\s|$)/).map(l => l.trim()).filter(l => l.length > 0);
      const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t !== "");

      if (editingId) {
        // UPDATE MODE
        const projectRef = doc(db, "projects", editingId);
        // Find existing project to keep the order the same during basic updates
        const existingProject = projects.find(p => p.id === editingId);
        
        await updateDoc(projectRef, {
          title, category, subCategory, 
          tags: tagsArray, demoLink, githubLink, date,
          image: projectImg, description: descArray,
          updatedAt: new Date(),
          order: existingProject?.order ?? projects.length // Backup if order missing
        });
        alert("Project Updated!");
      } else {
        // ADD NEW MODE (Place at end of order list)
        await addDoc(collection(db, "projects"), {
          title, category, subCategory, 
          tags: tagsArray, demoLink, githubLink, date,
          image: projectImg, description: descArray,
          createdAt: new Date(),
          order: projects.length 
        });
        alert("New Project Deployed!");
      }

      resetForm();
      await fetchProjects();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- AUTOMATIC REARRANGING LOGIC ---
  const moveProject = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === projects.length - 1)) return;
    
    setIsReordering(true);
    const newProjects = [...projects];
    const swapIdx = direction === 'up' ? index - 1 : index + 1;

    // Local swap for UI responsiveness
    const temp = newProjects[index];
    newProjects[index] = newProjects[swapIdx];
    newProjects[swapIdx] = temp;

    setProjects(newProjects); // Update UI immediately

    try {
      // Sync every document with its new index in the background
      // This ensures your portfolio sort is always clean and automatic
      const syncPromises = newProjects.map((p, i) => {
        const ref = doc(db, "projects", p.id);
        return updateDoc(ref, { order: i });
      });

      await Promise.all(syncPromises);
    } catch (err) {
      console.error("Reorder failed in database", err);
      fetchProjects(); // Revert to database state if failed
    } finally {
      setIsReordering(false);
    }
  };

  const resetForm = () => {
    setEditingId(null); setTitle(""); setCategory(""); setSubCategory(""); setTags(""); setDemoLink(""); setGithubLink(""); setDate(""); setProjectImg(""); setDescription("");
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setSubCategory(p.subCategory);
    setTags(p.tags ? p.tags.join(", ") : "");
    setDemoLink(p.demoLink || "");
    setGithubLink(p.githubLink || "");
    setDate(p.date || "");
    setProjectImg(p.image);
    setDescription(Array.isArray(p.description) ? p.description.join(". ") : p.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete forever?")) {
      await deleteDoc(doc(db, "projects", id));
      fetchProjects();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 space-y-24">
      <div className="flex justify-between items-end">
        <h1 className="text-7xl font-black tracking-tighter text-white">Project Studio</h1>
        {editingId && (
            <button onClick={resetForm} className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest border border-red-500/20 transition-all hover:bg-red-500 hover:text-white">
                Cancel Editing
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT: IMAGE PREVIEW */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] sticky top-12 space-y-6 text-center">
            <label className="text-[12px] uppercase font-bold tracking-[0.2em] text-white block opacity-100">Project Screenshot</label>
            <div 
              className="w-full aspect-square bg-black/40 rounded-[2rem] border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center relative"
            >
              {projectImg ? (
                <img src={projectImg} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="p-10 space-y-2 opacity-30 text-white font-bold uppercase text-[10px]">
                    <p>Drag Visuals Here</p>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
            </div>
            <input value={projectImg} onChange={e => setProjectImg(e.target.value)} placeholder="URL Override" className="w-full bg-white/5 p-4 rounded-xl outline-none text-white text-xs border border-white/10 text-center" />
        </div>

        {/* RIGHT: INPUT FORM */}
        <div className="space-y-6">
            <div className="bg-white/[0.03] p-10 border border-white/10 rounded-[3rem] space-y-6">
                <div className="space-y-1">
                    <label className="text-[11px] uppercase font-black text-white ml-4 tracking-[0.15em]">Project Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Main Title" className="w-full bg-white/5 p-5 rounded-[1rem] outline-none text-white border border-white/10 focus:border-blue-500 text-lg font-bold" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50">Category</label>
                        <select value={category} onChange={e => handleCategoryChange(e.target.value as any)} className="w-full bg-[#0a0a0a] p-5 rounded-[1rem] outline-none text-white border border-white/10 cursor-pointer">
                            <option value="">Choose Main</option>
                            {Object.keys(CATEGORY_MAP).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50">Subcategory</label>
                        <select value={subCategory} onChange={e => setSubCategory(e.target.value)} disabled={!category} className="w-full bg-[#0a0a0a] p-5 rounded-[1rem] outline-none text-white border border-white/10 disabled:opacity-10 cursor-pointer">
                            <option value="">Choose Sub</option>
                            {category && CATEGORY_MAP[category].subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50">Project Metadata Tags</label>
                    <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Split with commas" className="w-full bg-white/5 p-4 rounded-[1rem] outline-none text-white border border-white/10" />
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] uppercase font-black text-white ml-4 opacity-50">Detail / Bullet Points</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 p-6 rounded-[1.5rem] outline-none text-white h-48 border border-white/10 resize-none leading-relaxed" placeholder="Press enter for each new point..." />
                </div>

                <button onClick={handleSave} disabled={loading} className="w-full bg-white text-black py-8 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.4em] hover:scale-95 transition-all active:scale-90 shadow-2xl disabled:opacity-30">
                  {loading ? "SAVING NODE..." : editingId ? "OVERWRITE RECORD" : "DEPLOY TO DATABASE"}
                </button>
            </div>
        </div>
      </div>

      {/* --- REARRANGEABLE LIST --- */}
      <div className="space-y-12">
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <h2 className="text-4xl font-black tracking-tight text-white italic uppercase flex items-center gap-4">
                Portfolio Order
                {isReordering && <Loader2 className="animate-spin text-blue-500" size={24}/>}
            </h2>
            <p className="text-[11px] uppercase font-black opacity-30 tracking-[0.2em]">Total Objects: {projects.length}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {projects.map((p, idx) => (
                <div key={p.id} className="group relative bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-7 transition-all flex flex-col gap-5 hover:border-white/30">
                    
                    {/* Position Handle Buttons */}
                    <div className="absolute top-4 right-6 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => moveProject(idx, 'up')} className="p-3 bg-blue-600 rounded-full hover:bg-white text-white hover:text-black shadow-lg"><ArrowUp size={18}/></button>
                       <button onClick={() => moveProject(idx, 'down')} className="p-3 bg-blue-600 rounded-full hover:bg-white text-white hover:text-black shadow-lg"><ArrowDown size={18}/></button>
                    </div>

                    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10">
                        <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="Preview" />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                            <span className="text-[10px] font-black text-white italic">NO. {idx + 1}</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] uppercase font-black tracking-[0.2em] text-blue-500 mb-2">{p.category} // {p.subCategory}</p>
                        <h3 className="text-2xl font-bold tracking-tight text-white line-clamp-1">{p.title}</h3>
                    </div>

                    <div className="mt-auto pt-6 flex gap-3">
                        <button onClick={() => startEdit(p)} className="flex-1 bg-white/5 border border-white/5 py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all">
                            <Edit3 size={16}/> Modify
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/10 flex items-center justify-center rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                            <Trash2 size={20}/>
                        </button>
                    </div>
                </div>
             ))}
          </div>
      </div>
    </div>
  );
}
