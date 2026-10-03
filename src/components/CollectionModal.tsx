import React, { useState } from 'react';
import { X, FolderPlus, Check, Plus, Folder } from 'lucide-react';
import { getCollections, createCollection, addItemToCollection } from '../services/db';
import { Wallpaper, Ringtone, ThemePack, Collection } from '../types';

interface CollectionModalProps {
  item: Wallpaper | Ringtone | ThemePack;
  itemType: 'wallpaper' | 'ringtone' | 'theme';
  onClose: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ item, itemType, onClose }) => {
  const [collections, setCollections] = useState<Collection[]>(() => getCollections());
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [addedColId, setAddedColId] = useState<string | null>(null);

  const thumbnailUrl = (item as Wallpaper).thumbnail_url || '/logo.png';

  const handleAddToCollection = (colId: string) => {
    addItemToCollection(colId, itemType, item.id, item.title, thumbnailUrl);
    setAddedColId(colId);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    const newCol = createCollection(newColName.trim(), newColDesc.trim(), thumbnailUrl);
    addItemToCollection(newCol.id, itemType, item.id, item.title, thumbnailUrl);
    setCollections(getCollections());
    setAddedColId(newCol.id);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0c0e24] border border-cyan-500/30 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Save to Collection</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Collections List */}
        {!isCreatingNew ? (
          <div className="mt-4 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {collections.map(col => {
              const alreadyHas = col.items.some(i => i.item_id === item.id);
              const isAddedNow = addedColId === col.id;

              return (
                <div
                  key={col.id}
                  onClick={() => handleAddToCollection(col.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/40 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 flex items-center justify-center">
                      {col.cover_url ? (
                        <img src={col.cover_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Folder className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{col.name}</h4>
                      <p className="text-xs text-slate-400">{col.items.length} items</p>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-full">
                    {isAddedNow || alreadyHas ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full py-3 rounded-2xl border border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition mt-3"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Collection</span>
            </button>
          </div>
        ) : (
          /* New Collection Form */
          <form onSubmit={handleCreateAndAdd} className="mt-4 space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Collection Name *</label>
              <input
                type="text"
                required
                value={newColName}
                onChange={e => setNewColName(e.target.value)}
                placeholder="e.g. Dream Cars, Anime Wallpapers"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Description (Optional)</label>
              <input
                type="text"
                value={newColDesc}
                onChange={e => setNewColDesc(e.target.value)}
                placeholder="My favorite collection..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-md shadow-cyan-500/30"
              >
                Create & Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
