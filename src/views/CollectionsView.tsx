import React, { useState } from 'react';
import { Collection, Wallpaper, Ringtone, ThemePack } from '../types';
import { getCollections, createCollection, deleteCollection, removeItemFromCollection } from '../services/db';
import { Folder, Plus, Trash2, Share2, FolderOpen, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface CollectionsViewProps {
  onPreviewWallpaper: (wp: Wallpaper) => void;
  onNavigate: (tab: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ onPreviewWallpaper, onNavigate }) => {
  const [collections, setCollections] = useState<Collection[]>(() => getCollections());
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const activeCollection = collections.find(c => c.id === activeCollectionId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newCol = createCollection(name.trim(), description.trim());
    setCollections(getCollections());
    setName('');
    setDescription('');
    setIsCreating(false);
    setActiveCollectionId(newCol.id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this collection?')) {
      deleteCollection(id);
      setCollections(getCollections());
      if (activeCollectionId === id) setActiveCollectionId(null);
    }
  };

  const handleRemoveItem = (colId: string, itemId: string) => {
    removeItemFromCollection(colId, itemId);
    setCollections(getCollections());
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Folder className="w-7 h-7 text-cyan-400" />
            <span>My Collections</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize personal moodboards, anime sets, car lineups, and audio presets.
          </p>
        </div>

        {!activeCollection && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-md shadow-cyan-500/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        )}
      </div>

      {/* Creation Modal Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-[#0c0e24] border border-cyan-500/30 space-y-4 max-w-lg">
          <h3 className="text-base font-bold text-white">Create New Collection</h3>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Collection Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. My Dream Supercars"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional notes or mood description..."
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
            >
              Save Collection
            </button>
          </div>
        </form>
      )}

      {/* Details View for Selected Collection */}
      {activeCollection ? (
        <div className="space-y-6">
          <button
            onClick={() => setActiveCollectionId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Collections</span>
          </button>

          <div className="p-6 rounded-3xl bg-[#0c0e24] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">{activeCollection.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{activeCollection.description || 'Custom collection'}</p>
              <span className="text-[11px] text-cyan-400 font-mono mt-1 block">{activeCollection.items.length} items saved</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleDelete(activeCollection.id, e)}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                title="Delete Collection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeCollection.items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2 bg-white/[0.02] rounded-3xl border border-white/5">
              <FolderOpen className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm">This collection is empty.</p>
              <button
                onClick={() => onNavigate('wallpapers')}
                className="text-xs font-bold text-cyan-400 hover:underline"
              >
                Browse wallpapers to add items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {activeCollection.items.map((item) => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-2">
                  <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black mb-2">
                    <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[120px]">{item.title}</span>
                    <button
                      onClick={() => handleRemoveItem(activeCollection.id, item.item_id)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Remove from collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* All Collections Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => setActiveCollectionId(col.id)}
              className="group cursor-pointer rounded-3xl bg-[#0c0e24] border border-white/10 hover:border-cyan-400/50 p-5 shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 flex items-center justify-center shadow-md">
                  {col.cover_url ? (
                    <img src={col.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <Folder className="w-6 h-6 text-cyan-400" />
                  )}
                </div>

                <button
                  onClick={(e) => handleDelete(col.id, e)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors truncate">
                  {col.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {col.description || 'Custom collection'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <span>{col.items.length} items</span>
                <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                  Open →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
