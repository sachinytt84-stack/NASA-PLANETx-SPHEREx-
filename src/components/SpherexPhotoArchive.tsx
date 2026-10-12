import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon,
  Search,
  Filter,
  Grid,
  Columns,
  Maximize2,
  Download,
  ExternalLink,
  Sparkles,
  Calendar,
  Building,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  CheckCircle2,
  ZoomIn,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { NasaFeedItem } from '../types';

interface SpherexPhotoArchiveProps {
  items: NasaFeedItem[];
  isLoading: boolean;
  onRefresh: () => void;
  plainEnglishMode: boolean;
  onSelectImage: (item: NasaFeedItem) => void;
  onAskAiAboutItem?: (item: NasaFeedItem) => void;
}

export const SpherexPhotoArchive: React.FC<SpherexPhotoArchiveProps> = ({
  items,
  isLoading,
  onRefresh,
  plainEnglishMode,
  onSelectImage,
  onAskAiAboutItem,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCenter, setSelectedCenter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'id'>('newest');
  const [viewMode, setViewMode] = useState<'compact' | 'editorial' | 'cinema'>('compact');
  const [displayCount, setDisplayCount] = useState<number>(36);

  // Cinema Mode State
  const [cinemaIndex, setCinemaIndex] = useState<number>(0);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState<boolean>(false);

  const categories = [
    { label: 'All Photos', value: 'All' },
    { label: 'Launch & Falcon 9', value: 'Launch & Operations' },
    { label: 'Spacecraft & Optics', value: 'Spacecraft & Engineering' },
    { label: 'Testing & Prep', value: 'Testing & Prep' },
    { label: 'Science & Deep Space', value: 'Science & Cosmos' }
  ];

  const centers = ['All', 'NASA JPL', 'KSC', 'AFRC', 'VSFB'];

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by Center
    if (selectedCenter !== 'All') {
      result = result.filter(item => {
        const c = item.center.toLowerCase();
        const sc = selectedCenter.toLowerCase();
        return c.includes(sc) || item.nasaId.toLowerCase().includes(sc);
      });
    }

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.nasaId.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.plainEnglishSummary.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'id') {
        return a.nasaId.localeCompare(b.nasaId);
      }
      return 0;
    });

    return result;
  }, [items, selectedCategory, selectedCenter, searchQuery, sortBy]);

  // Items currently displayed on screen (for performance & pagination)
  const visibleItems = useMemo(() => {
    return filteredAndSortedItems.slice(0, displayCount);
  }, [filteredAndSortedItems, displayCount]);

  // Cinema Mode Autoplay Loop
  const handleNextCinema = useCallback(() => {
    if (filteredAndSortedItems.length === 0) return;
    setCinemaIndex(prev => (prev + 1) % filteredAndSortedItems.length);
  }, [filteredAndSortedItems.length]);

  const handlePrevCinema = useCallback(() => {
    if (filteredAndSortedItems.length === 0) return;
    setCinemaIndex(prev => (prev - 1 + filteredAndSortedItems.length) % filteredAndSortedItems.length);
  }, [filteredAndSortedItems.length]);

  useEffect(() => {
    if (viewMode !== 'cinema' || !isCinemaPlaying) return;
    const timer = setInterval(() => {
      handleNextCinema();
    }, 4500);
    return () => clearInterval(timer);
  }, [viewMode, isCinemaPlaying, handleNextCinema]);

  // Keyboard navigation for Cinema Mode
  useEffect(() => {
    if (viewMode !== 'cinema') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextCinema();
      if (e.key === 'ArrowLeft') handlePrevCinema();
      if (e.key === ' ') {
        e.preventDefault();
        setIsCinemaPlaying(p => !p);
      }
      if (e.key === 'Escape') setViewMode('compact');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleNextCinema, handlePrevCinema]);

  const currentCinemaItem = filteredAndSortedItems[cinemaIndex] || filteredAndSortedItems[0];

  return (
    <div className="space-y-6 animate-fade-in" id="spherex-photo-archive">
      {/* Top Archive Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-50 via-indigo-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Complete Official Photo Archive</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-emerald-700">{items.length} Photos Pre-Installed</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Every Available Photo of the SPHEREx Mission
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore every single photograph released by NASA for the SPHEREx space observatory—pre-installed into the application so everything loads instantly without live network dependence. Includes cleanroom unboxings, photon shield assembly, SpaceX Falcon 9 rocket integration, and cosmic infrared surveys.
            </p>
          </div>

          {/* Quick Counter Badges & Refresh */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Pre-Installed</div>
              <div className="text-xl font-black font-mono text-slate-950">
                {items.length} <span className="text-xs font-sans text-slate-500 font-normal">photos</span>
              </div>
            </div>

            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Reset filters and reload archive"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Reset Archive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Category Filters, View Switcher & Sort */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        {/* Row 1: Search & View Modes */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search all 159 photos (e.g. Sunset, Uncrating, Shield, PIA26543)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 focus:bg-white shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Controls: Sort & View Mode */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="id">NASA ID</option>
              </select>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 sm:px-2.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Compact Grid: Browse dozens of photos quickly"
              >
                <Grid className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Mosaic Grid</span>
              </button>

              <button
                onClick={() => setViewMode('editorial')}
                className={`p-1.5 sm:px-2.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'editorial'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Detailed Cards: View with full explanations"
              >
                <Columns className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Detailed Cards</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('cinema');
                  setIsCinemaPlaying(false);
                }}
                className={`p-1.5 sm:px-2.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'cinema'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Cinema Slideshow: Fullscreen step-through of all photos"
              >
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Cinema Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category and Center Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => {
              const count = cat.value === 'All'
                ? items.length
                : items.filter(it => it.category === cat.value).length;

              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat.value
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    selectedCategory === cat.value ? 'bg-slate-800 text-sky-300' : 'bg-slate-200/70 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Center Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">NASA Center:</span>
            <div className="flex items-center gap-1">
              {centers.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCenter(c)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedCenter === c
                      ? 'bg-sky-100 text-sky-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{visibleItems.length}</strong> of <strong>{filteredAndSortedItems.length}</strong> matching photos
          {filteredAndSortedItems.length !== items.length && ` (filtered from ${items.length} total photos)`}
        </span>

        {visibleItems.length < filteredAndSortedItems.length && (
          <button
            onClick={() => setDisplayCount(filteredAndSortedItems.length)}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
          >
            Show All {filteredAndSortedItems.length} Photos at Once →
          </button>
        )}
      </div>

      {/* VIEW MODE 1: COMPACT MOSAIC GRID (Ideal for seeing dozens to hundreds of photos at once) */}
      {viewMode === 'compact' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {visibleItems.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 hover:border-sky-400 hover:shadow-lg transition-all duration-300 aspect-square flex flex-col justify-end cursor-pointer"
            >
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Badges on top */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white/90 text-slate-900 backdrop-blur shadow-2xs">
                  {item.nasaId.split('-')[0]}
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur">
                  {new Date(item.date).getFullYear()}
                </span>
              </div>

              {/* Title & Caption at Bottom */}
              <div className="relative z-10 p-2.5 space-y-1">
                <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug group-hover:text-sky-300 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-300">
                  <span className="truncate max-w-[90px]">{item.center}</span>
                  <ZoomIn className="w-3 h-3 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: EDITORIAL DETAILED CARDS (Standard rich cards with plain-English summary) */}
      {viewMode === 'editorial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map(item => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col overflow-hidden shadow-xs group"
            >
              {/* Photo */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-200">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/95 text-slate-900 border border-slate-200 shadow-2xs backdrop-blur">
                    {item.nasaId}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur">
                    {item.category}
                  </span>
                </div>

                <button
                  onClick={() => onSelectImage(item)}
                  className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-slate-950/90 hover:bg-slate-950 text-white border border-slate-700 text-xs font-medium flex items-center gap-1 shadow cursor-pointer transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[11px] pr-1">Full Image</span>
                </button>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {item.center}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-950 text-base leading-snug group-hover:text-sky-800 transition-colors">
                    {item.title}
                  </h3>

                  {/* Plain English explanation */}
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Plain English Summary:</span>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-950">
                      {item.plainEnglishSummary}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectImage(item)}
                    className="text-sky-600 hover:text-sky-800 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  {onAskAiAboutItem && (
                    <button
                      onClick={() => onAskAiAboutItem(item)}
                      className="text-indigo-700 hover:text-indigo-900 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Explain with AI</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 3: CINEMA SLIDESHOW MODE (Step through all 159 photos one-by-one with full captions) */}
      {viewMode === 'cinema' && currentCinemaItem && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
          {/* Top Cinema Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-sky-400 bg-sky-950/80 border border-sky-800 px-3 py-1 rounded-full font-bold">
                PHOTO {cinemaIndex + 1} OF {filteredAndSortedItems.length}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Press [Left] / [Right] arrow keys to navigate
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCinemaPlaying(!isCinemaPlaying)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCinemaPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {isCinemaPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isCinemaPlaying ? 'Pause Slideshow' : 'Autoplay'}</span>
              </button>

              <button
                onClick={() => setViewMode('compact')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Exit Cinema Mode
              </button>
            </div>
          </div>

          {/* Main Cinema Stage */}
          <div className="relative rounded-2xl bg-black overflow-hidden flex items-center justify-center min-h-[350px] sm:min-h-[500px] max-h-[65vh] border border-slate-800">
            <img
              src={currentCinemaItem.fullImageUrl || currentCinemaItem.thumbnailUrl}
              alt={currentCinemaItem.title}
              className="max-h-[60vh] w-auto max-w-full object-contain mx-auto transition-opacity duration-300"
            />

            {/* Left / Right Nav Arrows */}
            <button
              onClick={handlePrevCinema}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-white hover:text-slate-950 text-white border border-slate-700 backdrop-blur transition-all cursor-pointer shadow-lg"
              title="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextCinema}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-white hover:text-slate-950 text-white border border-slate-700 backdrop-blur transition-all cursor-pointer shadow-lg"
              title="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* NASA ID Watermark */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-slate-300">
              {currentCinemaItem.nasaId}
            </div>

            {/* Enlarge in Modal Button */}
            <button
              onClick={() => onSelectImage(currentCinemaItem)}
              className="absolute bottom-4 right-4 bg-slate-950/80 hover:bg-white hover:text-slate-950 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow"
            >
              <ZoomIn className="w-4 h-4 text-sky-400" />
              <span>Full Screen Details</span>
            </button>
          </div>

          {/* Cinema Caption & Plain English Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{new Date(currentCinemaItem.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span>{currentCinemaItem.center}</span>
                <span>•</span>
                <span className="text-sky-400 font-bold uppercase">{currentCinemaItem.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {currentCinemaItem.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-h-24 overflow-y-auto">
                {currentCinemaItem.description}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Plain English Translation:</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200">
                {currentCinemaItem.plainEnglishSummary}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300">
                <strong>Why it matters:</strong> {currentCinemaItem.plainEnglishKeyTakeaway}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination / "Load More" & "Show All" Bar */}
      {visibleItems.length < filteredAndSortedItems.length && viewMode !== 'cinema' && (
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <button
            onClick={() => setDisplayCount(prev => Math.min(prev + 36, filteredAndSortedItems.length))}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            Load 36 More Photos ({filteredAndSortedItems.length - visibleItems.length} remaining)
          </button>

          <button
            onClick={() => setDisplayCount(filteredAndSortedItems.length)}
            className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            Show All {filteredAndSortedItems.length} Photos at Once
          </button>
        </div>
      )}
    </div>
  );
};
