"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { Search, Star, TrendingUp, Film, Calendar, Zap, Smile } from "lucide-react"

// Lazy load components for better performance
const MovieGrid = lazy(() => import("./components/MovieGrid"))
const MovieModal = lazy(() => import("./components/MovieModal"))

// TMDB API configuration
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

// Enhanced Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 border-r-purple-500"></div>
      <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-transparent border-t-blue-400 border-r-purple-400 opacity-20"></div>
    </div>
  </div>
)

export default function MovieDiscoveryApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch movies from TMDB API
  const fetchMovies = async (endpoint) => {
    try {
      const hasQuery = endpoint.includes('?')
      const url = `${BASE_URL}${endpoint}${hasQuery ? '&' : '?'}api_key=${API_KEY}`
      const response = await fetch(url)
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("Error fetching movies:", error)
      return []
    }
  }

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      const [popular, topRated, nowPlaying, upcoming, action, comedy] = await Promise.all([
        fetchMovies("/movie/popular"),
        fetchMovies("/movie/top_rated"),
        fetchMovies("/movie/now_playing"),
        fetchMovies("/movie/upcoming"),
      ])
      setPopularMovies(popular)
      setTopRatedMovies(topRated)
      setNowPlayingMovies(nowPlaying)
      setUpcomingMovies(upcoming)
      setLoading(false)
    }

    loadInitialData()
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim()) {
        setSearchLoading(true)
        const results = await fetchMovies(`/search/movie?query=${encodeURIComponent(searchQuery)}`)
        setSearchResults(results)
        setSearchLoading(false)
      } else {
        setSearchResults([])
      }
    }

    const debounceTimer = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Add infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
        loadingMore
      ) {
        return
      }
      loadMoreMovies()
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadingMore])

  const loadMoreMovies = async () => {
    if (searchQuery) return // Don't load more during search

    setLoadingMore(true)
    const nextPage = currentPage + 1

    const [morePopular, moreTopRated] = await Promise.all([
      fetchMovies(`/movie/popular?page=${nextPage}`),
      fetchMovies(`/movie/top_rated?page=${nextPage}`),
    ])

    setPopularMovies((prev) => [...prev, ...morePopular])
    setTopRatedMovies((prev) => [...prev, ...moreTopRated])
    setCurrentPage(nextPage)
    setLoadingMore(false)
  }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
  }

  const closeModal = () => {
    setSelectedMovie(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center relative overflow-hidden">
        <div className="text-center z-10">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-transparent border-t-blue-400 border-r-purple-400 opacity-20 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Loading Movies
          </h2>
          <p className="text-gray-400 animate-pulse">Discovering amazing content for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/95 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Film className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">MovieFlix</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {searchLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-transparent border-t-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search Results */}
        {searchQuery && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <Search className="mr-3 w-6 h-6 text-blue-500" />
              Search Results
              {searchResults.length > 0 && (
                <span className="ml-3 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {searchResults.length}
                </span>
              )}
            </h2>
            {searchLoading ? (
              <LoadingSpinner />
            ) : (
              <Suspense fallback={<LoadingSpinner />}>
                <MovieGrid
                  movies={searchResults}
                  onMovieClick={handleMovieClick}
                  emptyMessage="No movies found. Try a different search term."
                />
              </Suspense>
            )}
          </section>
        )}

        {/* Popular Movies */}
        {!searchQuery && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <TrendingUp className="mr-3 w-6 h-6 text-orange-500" />
              Popular
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <MovieGrid movies={popularMovies} onMovieClick={handleMovieClick} horizontal={true} />
            </Suspense>
          </section>
        )}

        {/* Top Rated Movies */}
        {!searchQuery && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <Star className="mr-3 w-6 h-6 text-yellow-500" />
              Top Rated
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <MovieGrid movies={topRatedMovies} onMovieClick={handleMovieClick} horizontal={true} />
            </Suspense>
          </section>
        )}

        {/* Now Playing Movies */}
        {!searchQuery && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <Film className="mr-3 w-6 h-6 text-green-500" />
              Now Playing
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <MovieGrid movies={nowPlayingMovies} onMovieClick={handleMovieClick} horizontal={true} />
            </Suspense>
          </section>
        )}

        {/* Upcoming Movies */}
        {!searchQuery && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <Calendar className="mr-3 w-6 h-6 text-purple-500" />
              Upcoming
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <MovieGrid movies={upcomingMovies} onMovieClick={handleMovieClick} horizontal={true} />
            </Suspense>
          </section>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}
      </main>

      {/* Movie Modal */}
      {selectedMovie && (
        <Suspense fallback={<LoadingSpinner />}>
          <MovieModal movie={selectedMovie} onClose={closeModal} />
        </Suspense>
      )}
    </div>
  )
}
