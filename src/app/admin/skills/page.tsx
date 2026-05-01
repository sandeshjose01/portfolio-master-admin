"use client";
import React, { useState, useEffect } from "react";
import { db, CLOUDINARY_URL, CLOUDINARY_PRESET } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, doc, updateDoc, deleteDoc, onSnapshot, setDoc } from "firebase/firestore";
import { Trash2, Edit3, GripVertical, Sparkles, ImagePlus, Save, AlertCircle } from "lucide-react";

// --- CATEGORY LIST ---
const CATEGORIES = [
  "Brand & Visual Identity",
  "UI/UX & Web Solutions",
  "Video & Motion Graphics",
  "Digital Marketing",
  "Business & Productivity",
  "Creative Assets",
  "Generative AI Art & Creative Direction",
  "3D Creation Tool",
  "Others"
];

// --- SMART DATABASE (Organized by Sections for easy manual editing) ---
const SOFTWARE_DATABASE: Record<string, { icon: string, category: string }> = {

 // ==========================================
  // SECTION 1: Brand & Visual Identity
  // ==========================================
 
  // Adobe Photoshop
  "photoshop": { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "adobe photoshop": { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "ps":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "adobe ps": { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",

  // Adobe Illustrator
  "illustrator":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "adobe illustrator":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "ai":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "adobe ai":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",

  // Adobe InDesign
  "indesign":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
  "adobe indesign":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
  "id":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
  "adobe id":  { category: "Brand & Visual Identity", icon: "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",

  // Adobe Lightroom
  "lightroom": { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg",
  "adobe lightroom": { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg",
  "lr": { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg",
  "adobe lr": { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg",

  // Coraldraw
  "coreldraw":  { category: "Graphic Designing Tools", icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/coreldraw-icon.png",

   // Procreate
  "procreate":  { category: "Graphic Designing Tools", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmL9NFoRdcC_Bg1zdAp0oSgFrPdum3MpZlUg&s",
   
  // Affinity Designer
  "affinity designer":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/8/86/Affinity_Designer_V2_icon.svg",    
 "ad":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/8/86/Affinity_Designer_V2_icon.svg",  
 "ades":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/8/86/Affinity_Designer_V2_icon.svg",  
                        
  // Affinity Photo
  "affinity photo":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Affinity_Photo_V2_icon.svg",
  "aph":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Affinity_Photo_V2_icon.svg",
  "ap":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Affinity_Photo_V2_icon.svg",
                      
  // Affinity Publishor
  "affinity publisher":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Affinity_Publisher_V2_icon.svg",
  "apu":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Affinity_Publisher_V2_icon.svg",
  "apub":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Affinity_Publisher_V2_icon.svg",

  //Affinity By Canva
  "affinity by canva":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Affinity_%28App%29_Logo.svg",

  // Canva
  "canva":  { category: "Graphic Designing Tools", icon: "https://img.icons8.com/?size=100&id=iWw83PVcBpLw&format=png&color=000000",
   
  // ==========================================
  // SECTION 2: UI/UX & Web Solutions
  // ==========================================

  // Adobe XD (UI/UX)
  "xd": { category: "UI/UX & Web Solutions", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_XD_CC_icon.svg",
  "adobe xd": { category: "UI/UX & Web Solutions", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_XD_CC_icon.svg",

  // Figma
  "figma":  { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",

  // Sketch (UI/UX)
  "sketch": { category: "Graphic Designing Tools", icon: "https://upload.wikimedia.org/wikipedia/commons/5/59/Sketch_Logo.svg",

  // WordPress
  "wordpress": { category: "UI/UX & Web Solutions", icon: "https://upload.wikimedia.org/wikipedia/commons/9/98/WordPress_blue_logo.svg",
  "wp": { category: "UI/UX & Web Solutions", icon: "https://upload.wikimedia.org/wikipedia/commons/9/98/WordPress_blue_logo.svgmons/9/98/WordPress_blue_logo.svg",
             
  // HTML5
  "html": { category: "UI/UX & Web Solutions", icon: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
  "html5": { category: "UI/UX & Web Solutions", icon: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",

  // CSS3
  "css": { category: "UI/UX & Web Solutions", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
  "css3": { category: "UI/UX & Web Solutions", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
        
  
  // ==========================================
  // SECTION 3: Video & Motion Graphics
  // ==========================================

   // Adobe Premiere Pro
  "premiere pro": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "adobe premiere": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "pr": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "adobe pr": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "premiere": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",

  // Adobe After Effects
  "after effects": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "adobe after effects": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "ae": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "adobe ae": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",

 // Adobe Animate / Flash
  "animate": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Adobe_Animate_CC_icon_%282020%29.svg",
  "adobe animate": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Adobe_Animate_CC_icon_%282020%29.svg",
  "an": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Adobe_Animate_CC_icon_%282020%29.svg",
  "adobe an": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Adobe_Animate_CC_icon_%282020%29.svg",
  "flash": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Adobe_Animate_CC_icon_%282020%29.svg",
               
  // DaVinci Resolve
  "davinci resolve": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png",
  "davinci": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png",
  "resolve": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png",
  "dvr": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png",

   // Capcut
  "capcut": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Capcut-icon.svg",  

  // Topaz Video AI (Enhancing video quality)
  "topaz": "https://www.dockhunt.com/_next/image?url=https%3A%2F%2Fdockhunt-images.nyc3.cdn.digitaloceanspaces.com%2F918dc7ce-d47c-40f8-9c20-5c08ab8bac40&w=256&q=75",
               
 // Adobe Audition
  "audition": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Adobe_Audition_CC_2026_icon.svg",
  "adobe audition": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Adobe_Audition_CC_2026_icon.svg",
  "au": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Adobe_Audition_CC_2026_icon.svg",
  "adobe au": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Adobe_Audition_CC_2026_icon.svg",
          
  // Cinema 4D
  "cinema 4d": { category: "Video & Motion Graphics", icon: "https://e7.pngegg.com/pngimages/1017/118/png-clipart-cinema-4d-3d-computer-graphics-autodesk-maya-3d-modeling-motion-graphics-cinema-material-angle-3d-computer-graphics.png",
  "c4d": { category: "Video & Motion Graphics", icon: "https://e7.pngegg.com/pngimages/1017/118/png-clipart-cinema-4d-3d-computer-graphics-autodesk-maya-3d-modeling-motion-graphics-cinema-material-angle-3d-computer-graphics.png",
               
  // Adobe Media Encoder
   "media encoder": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Adobe_Media_Encoder_Icon.svg" },
   "adovbe media encoder": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Adobe_Media_Encoder_Icon.svg" },
   "ame": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Adobe_Media_Encoder_Icon.svg" },
   "adobe me": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Adobe_Media_Encoder_Icon.svg" },
   "me": { category: "Video & Motion Graphics", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Adobe_Media_Encoder_Icon.svg" },
 
  // ==========================================
  // SECTION 4: Digital Marketing
  // ==========================================

  // YouTube Studio/Marketing
  "youtube studio": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg",
  "youtube marketing": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
          
  // TikTok Business & Ads
  "tiktok business": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg",
  "tiktok ads": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg",

  // LinkedIn Business & Ads
  "linkedin business": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  "linkedin ads": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  "linkedin marketing": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",

  // Meta (Facebook/Instagram) Business Suite
  "meta business suite": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "meta ads": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "facebook ads": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",

  // Pinterest Business
  "pinterest business": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Pinterest.svg",
  "pinterest ads": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Pinterest.svg",
                   
  // Google Ads
  "google ads": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg",
  "adwords": { category: "Digital Marketing", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg",
        
  // Mailchimp
  "mailchimp": { category: "Digital Marketing", icon: "https://www.svgrepo.com/show/452053/mailchimp.svg",
  
  // Hootsuit
  "hootsuite": { category: "Digital Marketing", icon: "https://logos-world.net/wp-content/uploads/2021/04/Hootsuite-Symbol.png",

  // Buffer 
  "buffer": "https://cdn-icons-png.flaticon.com/512/10146/10146194.png",
    
  // ==========================================
  // SECTION 5: Business & Productivity
  // ==========================================

   // Microsoft Office
  "office": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Microsoft_Office_logo_%282013%E2%80%932019%29.svg",
  "microsoft office": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Microsoft_Office_logo_%282013%E2%80%932019%29.svg",
  "ms office": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Microsoft_Office_logo_%282013%E2%80%932019%29.svg",
   
   // MS Word
  "word": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Microsoft_Office_Word_%282025%E2%80%93present%29.svg",
  "microsoft word": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Microsoft_Office_Word_%282025%E2%80%93present%29.svg",
  "ms word": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Microsoft_Office_Word_%282025%E2%80%93present%29.svg",
   
   // MS Excel
  "excel": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/6/60/Microsoft_Office_Excel_%282025%E2%80%93present%29.svg",
  "microsoft excel": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/6/60/Microsoft_Office_Excel_%282025%E2%80%93present%29.svg",
  "ms excel": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/6/60/Microsoft_Office_Excel_%282025%E2%80%93present%29.svg",
   
   // MS Powerpoint
  "powerpoint": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_PowerPoint_%282025%E2%80%93present%29.svg",
  "microsoft powerpoint": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_PowerPoint_%282025%E2%80%93present%29.svg",
  "ms powerpoint": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_PowerPoint_%282025%E2%80%93present%29.svg",
  "ppt": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_PowerPoint_%282025%E2%80%93present%29.svg",

   // Notion (Project Management)
  "notion": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",

  // Slack (Team Communication)
  "slack": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",

  // Trello
  "trello": { category: "Business & Productivity", icon: "https://images.icon-icons.com/2699/PNG/512/trello_logo_icon_167765.png",
            
  // Adobe Acrobat / PDF
  "acrobat": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/6/60/Adobe_Acrobat_Reader_icon_%282020%29.svg",
  "adobe acrobat": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/6/60/Adobe_Acrobat_Reader_icon_%282020%29.svg",
  "pdf": { category: "Business & Productivity", icon: "https://upload.wikimedia.org/wikipedia/commons/6/60/Adobe_Acrobat_Reader_icon_%282020%29.svg",             
                
  // ==========================================
  // SECTION 6: Creative Assets
  // ==========================================

  // Canva
  "canva":  { category: "Creative Assets", icon: "https://img.icons8.com/?size=100&id=iWw83PVcBpLw&format=png&color=000000",

  // Adobe Bridge (Asset Management)
  "bridge": { category: "Creative Assets", icon: "https://upload.wikimedia.org/wikipedia/commons/4/44/Adobe_Bridge_CC_2026_icon.svg",
  "adobe bridge": { category: "Creative Assets", icon: "https://upload.wikimedia.org/wikipedia/commons/4/44/Adobe_Bridge_CC_2026_icon.svg",

   // YouTube
  "youtube": { category: "Creative Assets", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_full-color_icon_%282024%29.svg",
  "youtube": { category: "Creative Assets", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_full-color_icon_%282024%29.svg",

  // E-commerce Design
  "shopify": { category: "Creative Assets", icon: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
  "etsy": { category: "Creative Assets", icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Etsy_logo.svg",

  // ==========================================
  // SECTION 7: Generative AI Art & Creative Direction
  // ==========================================

 // Midjourney
  "midjourney": { category: "Generative AI Art & Creative Direction", icon: "https://upload.wikimedia.org/wikipedia/commons/2/24/Midjourney_Emblem.svg",

  // ChatGPT (for Content/Copywriting)
  "chatgpt": { category: "Generative AI Art & Creative Direction", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  "openai": { category: "Generative AI Art & Creative Direction", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  "gpt": { category: "Generative AI Art & Creative Direction", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
           
  // Dal-e
  "dall-e": { category: "Generative AI Art & Creative Direction", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5pewHhLfvF5zfKVjzpvYKPA49Pnuc0jWc9A&s" },
  
  // Leonardo AI
  "leonardo ai": { category: "Generative AI Art & Creative Direction", icon: "https://brandlogos.net/wp-content/uploads/2025/05/leonardo_ai-logo_brandlogos.net_ctjsa-512x497.png" },
  
  // Firefly
  "firefly": { category: "Generative AI Art & Creative Direction", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_Firefly_CC_2026_icon.svg" },
  "adobe firefly": { category: "Generative AI Art & Creative Direction", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_Firefly_CC_2026_icon.svg" },
          
  // Runway
  "runway": { category: "Generative AI Art & Creative Direction", icon: "https://logosandtypes.com/wp-content/uploads/2023/04/Runway.png" },
 
  // Pika
  "pika": { category: "Generative AI Art & Creative Direction", icon: "https://pika.art/favicon.ico" },



  //-------------------------
  // SECTION 8: 3D Creation Tool       
  //--------------------------
          
  // Unreal Engine (Real-time Video/Environments)
  "unreal": { category: "3D Creation Tool", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Unreal_Engine_Logo_%28new_typeface%29.svg",
  "unreal engine": { category: "3D Creation Tool", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Unreal_Engine_Logo_%28new_typeface%29.svg",
  "ue5": { category: "3D Creation Tool", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Unreal_Engine_Logo_%28new_typeface%29.svg",

  //Blinder
  "blender": { category: "3D Creation Tool", icon: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg",
          
  // Maya
  "maya": { category: "3D Creation Tool", icon: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Icon_of_maya_2023.png",
   
      
export default function AdminSkillsPage() {
  const [pageHeading, setPageHeading] = useState("");
  const [pageDesc, setPageDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Brand & Visual Identity");
  const [skillIcon, setSkillIcon] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    onSnapshot(doc(db, "siteData", "skillsPage"), (d) => {
      if(d.exists()){ setPageHeading(d.data().heading); setPageDesc(d.data().description); }
    });
    onSnapshot(query(collection(db, "skills"), orderBy("order", "asc")), (snap) => {
      setSkills(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // --- SMART ENFORCEMENT LOGIC ---
  useEffect(() => {
    const search = name.toLowerCase().trim();
    const found = SOFTWARE_DATABASE[search];

    if (found) {
      if (found.category !== category) {
        setErrorMsg(`"${name}" belongs in "${found.category}", not here!`);
        setSkillIcon("");
      } else {
        setSkillIcon(found.icon);
        setErrorMsg(null);
      }
    } else {
      setErrorMsg(null);
      if (!editingId) setSkillIcon(""); 
    }
  }, [name, category]);

  const handleSaveSkill = async () => {
    if (errorMsg) return alert("Category Mismatch! Check the red error message.");
    if (!name || !skillIcon) return alert("Fill Name and Icon");
    setLoading(true);
    try {
      const data = { name, category, icon: skillIcon, updatedAt: new Date() };
      if (editingId) { await updateDoc(doc(db, "skills", editingId), data); } 
      else { await addDoc(collection(db, "skills"), { ...data, createdAt: new Date(), order: skills.length }); }
      setEditingId(null); setName(""); setSkillIcon("");
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newList = [...skills];
    const item = newList.splice(draggedIndex, 1)[0];
    newList.splice(index, 0, item);
    setDraggedIndex(index);
    setSkills(newList);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 pb-32">
      <h1 className="text-5xl font-black text-white tracking-tighter">Skills Admin</h1>

      <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-4">
          <input value={pageHeading} onChange={e => setPageHeading(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl text-white font-bold border border-white/5" />
          <textarea value={pageDesc} onChange={e => setPageDesc(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl text-white text-sm border border-white/5 h-24" />
          <button onClick={() => setDoc(doc(db, "siteData", "skillsPage"), { heading: pageHeading, description: pageDesc })} className="bg-blue-600 px-6 py-2 rounded-lg text-xs font-bold text-white uppercase transition-all">Save Global Text</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center space-y-6">
            <div className={`relative w-24 h-24 mx-auto rounded-3xl border-2 border-dashed flex items-center justify-center transition-all ${errorMsg ? 'border-red-500 bg-red-500/10' : skillIcon ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-black/40'}`}>
                {skillIcon ? <img src={skillIcon} className="w-16 h-16 object-contain" alt="" /> : <ImagePlus className="opacity-20 text-white" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    setLoading(true);
                    const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", CLOUDINARY_PRESET);
                    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
                    const data = await res.json(); setSkillIcon(data.secure_url); setLoading(false);
                }} />
            </div>
            {errorMsg && <div className="text-red-400 text-[10px] font-bold uppercase animate-pulse flex items-center justify-center gap-1"><AlertCircle size={12}/> {errorMsg}</div>}
            <input value={skillIcon} onChange={e => setSkillIcon(e.target.value)} placeholder="Icon Link" className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-white text-[10px] text-center outline-none" />
        </div>

        <div className="bg-white/[0.03] p-8 border border-white/10 rounded-[2.5rem] space-y-6">
            <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-white/40 ml-4">Software Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Type tool name..." className={`w-full p-5 rounded-2xl outline-none text-white font-bold border transition-all ${errorMsg ? 'border-red-500 bg-red-500/5' : 'border-white/10 bg-white/5'}`} />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-white/40 ml-4">Target Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0a0a0a] p-5 rounded-2xl text-white border border-white/10 cursor-pointer">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <button onClick={handleSaveSkill} disabled={loading || !!errorMsg} className="w-full bg-white text-black py-8 rounded-2xl font-black uppercase text-xs tracking-widest disabled:opacity-10 transition-all">
              {editingId ? "Update Skill" : "Add to Category"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
         {skills.map((s, idx) => (
            <div key={s.id} draggable onDragStart={() => setDraggedIndex(idx)} onDragOver={(e) => onDragOver(e, idx)} onDragEnd={() => { setDraggedIndex(null); skills.forEach((s, i) => updateDoc(doc(db, "skills", s.id), { order: i })); }} className="bg-[#0f0f0f] p-5 rounded-3xl border border-white/5 flex flex-col items-center gap-3 cursor-move transition-all group relative">
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={14} className="text-white/20"/></div>
                <img src={s.icon} className="w-10 h-10 object-contain" alt="" />
                <p className="text-[8px] font-black text-white uppercase text-center">{s.name}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingId(s.id); setName(s.name); setCategory(s.category); setSkillIcon(s.icon); window.scrollTo({top:0, behavior:'smooth'}) }} className="p-2 bg-white/5 rounded-lg text-white"><Edit3 size={12}/></button>
                    <button onClick={() => deleteDoc(doc(db, "skills", s.id))} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={12}/></button>
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}
