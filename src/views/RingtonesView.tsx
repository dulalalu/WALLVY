import React, { useState, useMemo } from 'react';
import { Ringtone, RingtoneCategory } from '../types';
import { RingtoneCard } from '../components/RingtoneCard';
import { Music, Bell, Flame, Sparkles, Sliders } from 'lucide-react';

interface RingtonesViewProps {
  ringtones: Ringtone[];
  onRequirePremium: () => void;
  onShare?: (rt: Ringtone) => void;
}

const RINGTONE_CATEGORIES: RingtoneCategory[] = [
  'Trending',
  'Notification',
  'Alarm',
  'Funny',
  'Gaming',
  'Love',
  'Nature',
  'Cinematic',
  'Electronic',
  'Lo-fi',
  'Bass',
  'Neon',
  'Short Sounds',
];

export const RingtonesView: React.FC<RingtonesViewProps> = ({
  ringtones,
  onRequirePremium,
  onShare,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'premium'>('all');

  const filteredRingtones = useMemo(() => {
    return ringtones.filter((rt) => {
      if (selectedCategory !== 'all' && rt.category !== selectedCategory) return false;
      if (activeFilter === 'free' && rt.is_premium) return false;
      if (activeFilter === 'premium' && !rt.is_premium) return false;
      return true;
    });
  }, [ringtones, selectedCategory, activeFilter]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Music className="w-7 h-7 text-cyan-400" />
            <span>Ringtones & Sound Effects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Studio-quality synthesized ringtones, alerts, and alarm chimes designed for high clarity.
          </p>
        </div>

        {/* Free / Premium filter */}
        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition ${
              activeFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('free')}
            className={`px-3 py-1.5 rounded-xl font-medium transition ${
              activeFilter === 'free' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setActiveFilter('premium')}
            className={`px-3 py-1.5 rounded-xl font-medium transition ${
              activeFilter === 'premium' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            PRO Sounds
          </button>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          All Sounds
        </button>
        {RINGTONE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Audio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRingtones.map((rt) => (
          <RingtoneCard
            key={rt.id}
            ringtone={rt}
            onRequirePremium={onRequirePremium}
            onShare={onShare}
          />
        ))}
      </div>
    </div>
  );
};
