'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { db, Room, RoomCategory } from '../../../lib/db';
import { useAuth } from '../../../context/AuthContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X as CloseIcon, 
  Upload, 
  Sliders, 
  Home, 
  CalendarDays,
  PlusCircle,
  FileImage,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function RoomsManager() {
  const { isDemo } = useAuth();
  
  // Data States
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form Field States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descId, setDescId] = useState('');
  const [shortEn, setShortEn] = useState('');
  const [shortId, setShortId] = useState('');
  const [price, setPrice] = useState(0);
  const [weekendPrice, setWeekendPrice] = useState(0);
  const [capacity, setCapacity] = useState(2);
  const [bedType, setBedType] = useState('1 King Bed');
  const [roomSize, setRoomSize] = useState(50);
  const [isAvailable, setIsAvailable] = useState(true);
  const [mainThumbnail, setMainThumbnail] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  
  // Custom facilities adder
  const [newFacilityInput, setNewFacilityInput] = useState('');
  
  // Custom image URL paste adder
  const [newImageUrl, setNewImageUrl] = useState('');

  // Toast States
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const loadRooms = async () => {
    const r = await db.getRooms();
    setRooms(r);
    const cats = await db.getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleEditClick = (room: Room) => {
    setEditingRoom(room);
    setIsNew(false);
    
    // Set field states
    setName(room.name);
    setSlug(room.slug);
    setCategoryId(room.category_id || '');
    setDescEn(room.description_en);
    setDescId(room.description_id);
    setShortEn(room.short_description_en);
    setShortId(room.short_description_id);
    setPrice(room.price_per_night);
    setWeekendPrice(room.weekend_price || 0);
    setCapacity(room.capacity);
    setBedType(room.bed_type);
    setRoomSize(room.room_size);
    setIsAvailable(room.is_available);
    setMainThumbnail(room.main_thumbnail);
    setGalleryImages(room.gallery_images);
    setFacilities(room.facilities);
  };

  const handleCreateClick = () => {
    setEditingRoom({});
    setIsNew(true);
    
    // Clear states
    setName('');
    setSlug('');
    setCategoryId(categories[0]?.id || '');
    setDescEn('');
    setDescId('');
    setShortEn('');
    setShortId('');
    setPrice(1500000);
    setWeekendPrice(1800000);
    setCapacity(2);
    setBedType('1 King Bed');
    setRoomSize(40);
    setIsAvailable(true);
    setMainThumbnail('https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200');
    setGalleryImages([
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200'
    ]);
    setFacilities(['High-Speed Wi-Fi', 'Complimentary Mini Bar', 'Smart TV']);
  };

  // Re-generate slug on name change
  const handleNameChange = (val: string) => {
    setName(val);
    if (isNew) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Add Facility
  const addFacility = () => {
    if (newFacilityInput.trim() && !facilities.includes(newFacilityInput.trim())) {
      setFacilities([...facilities, newFacilityInput.trim()]);
      setNewFacilityInput('');
    }
  };

  const removeFacility = (idx: number) => {
    setFacilities(facilities.filter((_, i) => i !== idx));
  };

  // Add Image URL
  const addImageUrl = () => {
    if (newImageUrl.trim() && !galleryImages.includes(newImageUrl.trim())) {
      setGalleryImages([...galleryImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (idx: number) => {
    const removed = galleryImages[idx];
    const filtered = galleryImages.filter((_, i) => i !== idx);
    setGalleryImages(filtered);
    if (mainThumbnail === removed && filtered.length > 0) {
      setMainThumbnail(filtered[0]);
    }
  };

  // Sort Images
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= galleryImages.length) return;
    
    const reordered = [...galleryImages];
    const temp = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = temp;
    setGalleryImages(reordered);
  };

  // Simulated File Upload to Supabase Storage (reads file and converts to dataURL / preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Image upload is disabled.', 'error');
      return;
    }
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setGalleryImages([...galleryImages, result]);
          triggerToast('Photo successfully loaded into local storage drawer.');
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Form Submit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (!name || !slug || !descEn || !descId) {
      triggerToast('Please fill out all mandatory inputs.', 'error');
      return;
    }

    const payload = {
      name,
      slug,
      category_id: categoryId,
      description_en: descEn,
      description_id: descId,
      short_description_en: shortEn || name,
      short_description_id: shortId || name,
      price_per_night: price,
      weekend_price: weekendPrice || undefined,
      capacity,
      bed_type: bedType,
      room_size: roomSize,
      is_available: isAvailable,
      main_thumbnail: mainThumbnail || galleryImages[0] || '',
      gallery_images: galleryImages,
      facilities
    };

    try {
      if (isNew) {
        await db.createRoom(payload);
        triggerToast('New luxury room registered successfully.');
      } else {
        await db.saveRoom({ ...payload, id: editingRoom?.id || '' });
        triggerToast('Room updates saved successfully.');
      }
      setEditingRoom(null);
      loadRooms();
    } catch (err) {
      triggerToast('Failed to save room details.', 'error');
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (isDemo) {
      triggerToast('Demo Mode Active. Editing is disabled.', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this room configuration? This deletes all associated booking stats.')) {
      const success = await db.deleteRoom(id);
      if (success) {
        triggerToast('Room deleted from catalog.');
        loadRooms();
      } else {
        triggerToast('Failed to delete room.', 'error');
      }
    }
  };

  return (
    <AdminLayout title="Room Directory">
      
      {/* Toast popup */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border text-xs font-semibold shadow-xl flex items-center gap-2.5 transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-950 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-950 border-rose-500/30 text-rose-455'
        }`}>
          <Check className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* CREATE TRIGGER */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Room
        </button>
      </div>

      {/* ROOMS DIRECTORY LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((r) => (
          <div key={r.id} className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-sm flex flex-col group">
            <div className="aspect-[16/10] bg-neutral-950 relative">
              <img src={r.main_thumbnail} alt={r.name} className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest font-bold text-white px-3 py-1 rounded-full border border-white/10">
                {r.category_name}
              </span>
              <span className={`absolute top-4 right-4 text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
                r.is_available 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
              }`}>
                {r.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-grow space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">{r.name}</h3>
                <span className="text-[10px] text-neutral-500">Slug: {r.slug}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-b border-white/5 py-3.5 text-[10px] text-neutral-400">
                <div>Capacity: <strong className="text-white">{r.capacity} Guests</strong></div>
                <div>Size: <strong className="text-white">{r.room_size} m²</strong></div>
                <div>Weekday: <strong className="text-gold-400">Rp {r.price_per_night.toLocaleString()}</strong></div>
                <div>Weekend: <strong className="text-gold-400">Rp {r.weekend_price?.toLocaleString() || '-'}</strong></div>
              </div>

              <div className="flex gap-2 justify-end mt-auto pt-2">
                <button
                  onClick={() => handleEditClick(r)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-white/5 hover:border-gold-500 bg-neutral-950/20 rounded-xl text-neutral-350 hover:text-white text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit details
                </button>
                <button
                  onClick={() => handleDeleteClick(r.id)}
                  className="p-2 border border-white/5 hover:border-rose-500 bg-neutral-950/20 hover:bg-rose-500/10 rounded-xl text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT/CREATE DIALOG SCREEN */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-neutral-950/20 sticky top-0 z-10">
              <div>
                <h4 className="font-serif text-lg font-bold text-white uppercase">
                  {isNew ? 'Create New Room Villa' : 'Modify Room Details'}
                </h4>
                <span className="text-[9px] text-neutral-550 font-bold uppercase tracking-widest">{slug || 'PENDING'}</span>
              </div>
              <button 
                onClick={() => setEditingRoom(null)}
                className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-8 text-xs">
              
              {/* General details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Room Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Grand Suite Ocean"
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-gold-450"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Slug URL Identifier</label>
                  <input 
                    type="text" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="grand-suite-ocean"
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-gold-450"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Category</label>
                  <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-neutral-300 outline-none focus:border-gold-450 cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-neutral-900">{c.name_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing, Capacity, specs */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-b border-white/5 py-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Weekday Price (IDR)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Weekend Price (IDR)</label>
                  <input 
                    type="number" 
                    value={weekendPrice} 
                    onChange={(e) => setWeekendPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Capacity (Guests)</label>
                  <input 
                    type="number" 
                    value={capacity} 
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Room Size (m²)</label>
                  <input 
                    type="number" 
                    value={roomSize} 
                    onChange={(e) => setRoomSize(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Beds Type</label>
                  <input 
                    type="text" 
                    value={bedType} 
                    onChange={(e) => setBedType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                    required
                  />
                </div>
              </div>

              {/* Descriptions (English & Indonesian) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Short description (English)</label>
                  <input 
                    type="text" 
                    value={shortEn} 
                    onChange={(e) => setShortEn(e.target.value)}
                    placeholder="Breathtaking ocean views..."
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Deskripsi Singkat (Bahasa Indonesia)</label>
                  <input 
                    type="text" 
                    value={shortId} 
                    onChange={(e) => setShortId(e.target.value)}
                    placeholder="Pemandangan samudra spektakuler..."
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Full Description (English)</label>
                  <textarea 
                    value={descEn} 
                    onChange={(e) => setDescEn(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Deskripsi Lengkap (Bahasa Indonesia)</label>
                  <textarea 
                    value={descId} 
                    onChange={(e) => setDescId(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none resize-none"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Facilities Adder */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Room Facilities tags</label>
                <div className="flex gap-2 max-w-md">
                  <input 
                    type="text" 
                    placeholder="Add facility e.g. Private Balcony" 
                    value={newFacilityInput} 
                    onChange={(e) => setNewFacilityInput(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={addFacility}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {facilities.map((fac, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 bg-neutral-955 border border-white/5 text-[11px] rounded-full text-neutral-300">
                      {fac}
                      <button type="button" onClick={() => removeFacility(i)} className="text-neutral-500 hover:text-white ml-1 text-sm font-bold">&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* PHOTO IMAGES MANAGEMENT SECTION */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Photo Management (Storage Drawer)</label>
                
                {/* drag-drop file uploader simulation + URL paste */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Local Drag/Drop simulated */}
                  <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-gold-500 transition-colors flex flex-col items-center justify-center relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                    <span className="block text-xs font-semibold text-neutral-300 mb-1">Drag and Drop File here</span>
                    <span className="block text-[10px] text-neutral-500">Supports PNG, JPG, JPEG up to 5MB</span>
                  </div>

                  {/* Paste URL */}
                  <div className="border border-white/5 bg-neutral-950/20 rounded-2xl p-6 space-y-4">
                    <span className="block text-xs font-bold text-neutral-400">Or Paste Image URL Link</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/..." 
                        value={newImageUrl} 
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-white outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={addImageUrl}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sorting, deleting, reordering, thumbnail selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {galleryImages.map((img, idx) => {
                    const isThumb = mainThumbnail === img;
                    return (
                      <div key={idx} className={`relative rounded-2xl overflow-hidden border-2 bg-neutral-950 p-1.5 flex flex-col group/img ${
                        isThumb ? 'border-gold-500' : 'border-white/5'
                      }`}>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                          <img src={img} alt="room-photo" className="w-full h-full object-cover" />
                          
                          {/* Image Actions overlays */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity space-y-1">
                            <button 
                              type="button" 
                              onClick={() => removeImage(idx)} 
                              className="p-1.5 bg-rose-500 text-white rounded-lg cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <button
                            type="button"
                            onClick={() => setMainThumbnail(img)}
                            className={`w-full py-1 rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all ${
                              isThumb 
                                ? 'bg-gold-500 text-white' 
                                : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300'
                            }`}
                          >
                            {isThumb ? 'Main Thumbnail' : 'Set Thumbnail'}
                          </button>

                          {/* Reordering */}
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveImage(idx, 'up')}
                              className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === galleryImages.length - 1}
                              onClick={() => moveImage(idx, 'down')}
                              className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Availability status */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <input 
                  type="checkbox" 
                  id="avail"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-600 focus:ring-gold-550 bg-neutral-950 border-white/10 cursor-pointer"
                />
                <label htmlFor="avail" className="text-xs text-neutral-350 cursor-pointer">
                  Available for Booking (Check to show in client listings, uncheck to set Fully Booked status)
                </label>
              </div>

              {/* Actions submit */}
              <div className="flex gap-3 justify-end border-t border-white/5 pt-6 bg-neutral-950/20 p-6 -mx-6 -mb-6 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}
