'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { useApp } from '@/components/AppContext';
import { Heart, Film, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative">
        {/* Decorative background glows */}
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Page Header */}
        <div className="border-b border-slate-200/60 dark:border-white/5 pb-4.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            My Watchlist
          </h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
            {favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved to your favorites
          </p>
        </div>

        {/* Empty State vs. Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 mt-8 glass-card border border-slate-200/60 dark:border-white/5 rounded-2xl">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-800/80 mb-5 relative group">
              {/* Pulsing ring on hover */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
              <Heart size={32} className="group-hover:scale-110 group-hover:text-rose-500 transition-colors duration-300" />
            </div>
            
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Your Watchlist is Empty
            </h2>
            
            <p className="max-w-xs text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Explore the home page and add movies to your list by clicking the heart icons on the posters.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide shadow-md hover:shadow-indigo-500/10 transition-all duration-200 active:scale-95 cursor-pointer group"
            >
              <span>Explore Movies</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-10">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-[#070913]/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-tight text-slate-800 dark:text-white">
              Movie<span className="text-gradient-primary">Scope</span>
            </span>
            <span className="text-[10px] text-slate-300 dark:text-slate-800 hidden sm:inline">|</span>
            <p className="hidden sm:block">© 2026 MovieScope. All rights reserved.</p>
          </div>
          <p className="sm:hidden text-center">© 2026 MovieScope. All rights reserved.</p>
          <div className="flex items-center gap-4.5 sm:gap-6">
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-200">Privacy</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-200">Terms</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-200">OMDb API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
