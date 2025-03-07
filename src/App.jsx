import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "./Components/MovieCard";
import MovieModal from "./Components/MovieModal";
import SearchIcon from "./search.svg";
import "./App.css";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  const [searchMovie, setSearchMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 3) {
        searchMovies(query);
      }
    }, 500),
    []
  );

  const searchMovies = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
      ;
      const data = await response.json();
      setMovies(data.Search || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchMovie(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    searchMovies("America");
  }, []);

  return (
    <div className="app">
      <h1 className="fade-in">MovieBox</h1>

      <div className="search slide-in">
        <input
          value={searchMovie}
          onChange={handleSearch}
          placeholder="Search for movies"
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchMovie)}
        />
      </div>

      {loading ? (
        <div className="loading fade-in">
          <div className="loader"></div>
        </div>
      ) : movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.imdbID}
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      ) : (
        <div className="empty fade-in">
          <h2>No movies found</h2>
        </div>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default App;