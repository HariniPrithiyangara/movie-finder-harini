'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { MovieDetailsSkeleton } from '@/components/Loader';
import { fetchMovieDetails } from '@/lib/omdb';
import { useApp } from '@/components/AppContext';
import { ArrowLeft, Star, Heart, Calendar, Clock, Globe, Award, Clapperboard, DollarSign } from 'lucide-react';

export default function MoviePage({ params }) {
  const { id } = use(params);
  const { addFavorite, removeFavorite, isFavorite } = useApp();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMovieDetails() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message || 'Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    }
    loadMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <MovieDetailsSkeleton />
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16">
          <div className="p-4 rounded-full bg-rose-500/10 dark:bg-rose-500/5 text-rose-500 border border-rose-500/20 mb-4 animate-bounce">
            <Award size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Movie Not Found
          </h1>
          <p className="max-w-xs text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {error || 'The requested movie could not be loaded.'}
          </p>
          <Link
            href="/"
            className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs tracking-wide shadow-md hover:bg-indigo-500 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Back to Home
          </Link>
        </main>
      </div>
    );
  }

  const isFav = isFavorite(movie.imdbID);
  const hasPoster = movie.Poster && movie.Poster !== 'N/A';

  // Find ratings from different sources
  const getRating = (source) => {
    if (!movie.Ratings) return 'N/A';
    const ratingObj = movie.Ratings.find((r) => r.Source === source);
    return ratingObj ? ratingObj.Value : 'N/A';
  };

  const imdbRatingValue = movie.imdbRating && movie.imdbRating !== 'N/A' ? `${movie.imdbRating}/10` : 'N/A';
  const rottenTomatoesValue = getRating('Rotten Tomatoes');
  const metacriticValue = getRating('Metacritic');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow relative py-8 sm:py-16">
        {/* Large Cinematic Blurry Poster Background */}
        {hasPoster && (
          <div 
            className="absolute top-0 left-0 w-full h-[400px] sm:h-[500px] opacity-20 dark:opacity-10 pointer-events-none -z-10 bg-cover bg-center filter blur-2xl"
            style={{ backgroundImage: `url(${movie.Poster})` }}
          />
        )}
        <div className="absolute top-0 left-0 w-full h-[400px] sm:h-[500px] bg-gradient-to-b from-transparent to-background -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 mb-8 active:scale-95"
          >
            <ArrowLeft size={16} />
            Back to Movies
          </Link>

          {/* Details Main Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-4">
            
            {/* Left: Movie Poster Card */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[340px] aspect-[2/3] rounded-3xl overflow-hidden glass-card border border-slate-200/50 dark:border-white/10 shadow-2xl glow-primary select-none">
                {hasPoster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-indigo-950 text-center">
                    <span className="text-5xl mb-4">🎬</span>
                    <span className="text-lg font-bold text-slate-300">
                      {movie.Title}
                    </span>
                  </div>
                )}

                {/* Rating overlay badge */}
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-slate-900/85 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span>IMDb {movie.imdbRating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Rich Metadata and Details */}
            <div className="md:col-span-2 flex flex-col justify-center space-y-6 sm:space-y-8">
              
              {/* Title & Favorites Actions */}
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-tight">
                    {movie.Title}
                  </h1>

                  <button
                    onClick={() => (isFav ? removeFavorite(movie.imdbID) : addFavorite(movie))}
                    className={`self-start sm:self-auto flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide border transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${
                      isFav
                        ? 'bg-rose-50/80 dark:bg-rose-950/20 text-rose-500 border-rose-500/30'
                        : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-500'
                    }`}
                  >
                    <Heart size={18} className={isFav ? 'fill-rose-500' : ''} />
                    <span>{isFav ? 'Remove Favorite' : 'Add to Favorites'}</span>
                  </button>
                </div>

                {/* Release details line */}
                <div className="flex flex-wrap items-center gap-3.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                  <span className="px-2.5 py-1 rounded bg-slate-200/50 dark:bg-white/5 border border-slate-300/30 dark:border-white/5 uppercase tracking-wider text-[10px]">
                    {movie.Rated && movie.Rated !== 'N/A' ? movie.Rated : 'Unrated'}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={13} />
                    <span>{movie.Released}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={13} />
                    <span>{movie.Runtime}</span>
                  </div>
                </div>
              </div>

              {/* Genre Pills */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="flex flex-wrap gap-2">
                  {movie.Genre.split(',').map((g) => (
                    <span
                      key={g}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 dark:border-indigo-400/10 tracking-wide"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Score Ratings Section */}
              <div className="grid grid-cols-3 gap-3.5 sm:gap-5 max-w-lg">
                {/* IMDb Rating */}
                <div className="p-4 rounded-2xl glass-card border border-slate-200/50 dark:border-white/10 text-center shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">IMDb</p>
                  <p className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">{imdbRatingValue}</p>
                </div>
                
                {/* Rotten Tomatoes Rating */}
                <div className="p-4 rounded-2xl glass-card border border-slate-200/50 dark:border-white/10 text-center shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rotten Tomatoes</p>
                  <p className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">{rottenTomatoesValue}</p>
                </div>

                {/* Metacritic Rating */}
                <div className="p-4 rounded-2xl glass-card border border-slate-200/50 dark:border-white/10 text-center shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Metacritic</p>
                  <p className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">{metacriticValue}</p>
                </div>
              </div>

              {/* Plot Description */}
              <div className="space-y-2 max-w-2xl">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Overview</h2>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  {movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No movie overview is available.'}
                </p>
              </div>

              {/* Cast & Crew Info Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl border-t border-slate-200/60 dark:border-white/5 pt-6 sm:pt-8 text-sm">
                
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/30 dark:border-white/5">
                  <Clapperboard className="text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Director</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{movie.Director}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/30 dark:border-white/5">
                  <Globe className="text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Country & Languages</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{movie.Country} ({movie.Language})</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/30 dark:border-white/5">
                  <Award className="text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Awards</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{movie.Awards}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/30 dark:border-white/5">
                  <DollarSign className="text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Box Office</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{movie.BoxOffice && movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/30 dark:border-white/5">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Starring Cast</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{movie.Actors}</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
