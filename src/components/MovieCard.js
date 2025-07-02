"use client"

import { memo } from "react"
import { Star, Play } from "lucide-react"

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

const MovieCard = memo(({ movie, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const getRatingColor = (rating) => {
    if (rating >= 8) return "bg-green-500"
    if (rating >= 7) return "bg-yellow-500"
    if (rating >= 6) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative w-48 bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">🎬</span>
            </div>
          )}

          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <div
              className={`absolute top-2 right-2 w-10 h-10 ${getRatingColor(movie.vote_average)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}
            >
              {Math.round(movie.vote_average * 10)}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 leading-tight">{movie.title}</h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formatDate(movie.release_date)}</span>
            {movie.vote_average > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

MovieCard.displayName = "MovieCard"

export default MovieCard
