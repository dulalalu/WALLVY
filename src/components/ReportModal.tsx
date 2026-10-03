import React, { useState } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import { submitReport } from '../services/db';

interface ReportModalProps {
  itemId: string;
  itemTitle: string;
  itemType: 'wallpaper' | 'ringtone' | 'theme';
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ itemId, itemTitle, itemType, onClose }) => {
  const [reason, setReason] = useState<'copyright' | 'inappropriate' | 'spam' | 'misleading' | 'other'>('copyright');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      reporter_id: 'user-current',
      item_type: itemType,
      item_id: itemId,
      item_title: itemTitle,
      reason,
      notes,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0d0f28] border border-rose-500/40 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-rose-400">
            <Flag className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Report Content</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white">Report Submitted</h4>
            <p className="text-xs text-slate-400">Our safety & moderation team will review this item within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <p className="text-xs text-slate-300">
              Reporting: <strong className="text-white">{itemTitle}</strong>
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Reason for report</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as any)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
              >
                <option value="copyright" className="bg-[#0d0f28]">Copyright Infringement</option>
                <option value="inappropriate" className="bg-[#0d0f28]">Inappropriate / NSFW Content</option>
                <option value="spam" className="bg-[#0d0f28]">Spam / Low Quality</option>
                <option value="misleading" className="bg-[#0d0f28]">Misleading Tags / Title</option>
                <option value="other" className="bg-[#0d0f28]">Other Issue</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Additional Details (Optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Explain the violation or provide proof..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
