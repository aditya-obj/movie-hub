"use client"

import { memo, useRef } from "react"
import MovieCard from "./MovieCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

const MovieGrid = memo(({ movies, onMovieClick, horizontal = false, emptyMessage }) => {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollAmount = clientWidth * 0.8
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      })
    }
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎬</span>
          </div>
          <p className="text-gray-400 text-lg">{emptyMessage || "No movies available"}</p>
        </div>
      </div>
    )
  }

  if (horizontal) {
    return (
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg focus:outline-none"
          style={{ display: movies.length > 4 ? "block" : "none" }}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
            </div>
          ))}
        </div>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg focus:outline-none"
          style={{ display: movies.length > 4 ? "block" : "none" }}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie)} />
      ))}
    </div>
  )
})

MovieGrid.displayName = "MovieGrid"

export default MovieGrid
