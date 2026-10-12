import React from 'react';
import { X, ExternalLink, Sparkles, Calendar, Building, Info, Download } from 'lucide-react';
import { NasaFeedItem, MissionMilestone } from '../types';

interface ImageModalProps {
  item: NasaFeedItem | MissionMilestone | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const title = item.title;
  const imageUrl = 'fullImageUrl' in item ? item.fullImageUrl : item.imageUrl;
  const origUrl = 'origImageUrl' in item && item.origImageUrl ? item.origImageUrl : imageUrl;
  const date = 'date' in item ? item.date : '';
  const nasaId = item.nasaId || 'NASA-SPHEREx';
  const center = 'center' in item ? item.center : 'NASA JPL';
  const plainSummary = 'plainEnglishSummary' in item ? item.plainEnglishSummary : ('plainEnglishWhatHappened' in item ? item.plainEnglishWhatHappened : '');
  const rawDesc = 'description' in item ? item.description : ('summary' in item ? item.summary : '');
  const whyItMatters = 'plainEnglishKeyTakeaway' in item ? item.plainEnglishKeyTakeaway : ('whyItMattersToYou' in item ? item.whyItMattersToYou : '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-800 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 font-bold shadow-2xs">
              NASA ID: {nasaId}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline font-medium">
              Center: {center}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-white transition-colors text-xs flex items-center gap-1 cursor-pointer font-medium"
              title="View record on NASA Image & Video Library"
            >
              <span>NASA Record</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={origUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200/80 transition-colors text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
              title="Open full resolution original image"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Full Res / Original</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Image Display */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[50vh] border border-slate-200 shadow-inner">
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[50vh] w-auto object-contain mx-auto"
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                {title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
                {date && (
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {center}
                </span>
              </div>
            </div>

            {/* Plain English Summary */}
            {plainSummary && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  What This Shows in Everyday Words:
                </div>
                <p className="text-sm leading-relaxed text-amber-950 font-normal">
                  {plainSummary}
                </p>
                {whyItMatters && (
                  <div className="pt-2 border-t border-amber-200 text-xs text-amber-900 font-medium">
                    <strong>Why it matters:</strong> {whyItMatters}
                  </div>
                )}
              </div>
            )}

            {/* Official Technical Description */}
            {rawDesc && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  Official NASA Archive Text:
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-h-48 overflow-y-auto p-4 rounded-xl bg-slate-50 border border-slate-200">
                  {rawDesc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
