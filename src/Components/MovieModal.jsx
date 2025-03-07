import React, { useState, useEffect } from 'react';
import './MovieModal.css';

const MovieModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  
  useEffect(() => {
    if (!movie || !movie.imdbID) {
      console.error('Movie or movie.imdbID is missing', movie);
      return;
    }
    
    const fetchMovieDetails = async () => {
      try {
        const apiKey = import.meta.env.VITE_OMDB_API_KEY;
        console.log("API Key:", apiKey);
        const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=full`;
        console.log("Fetching URL:", url);
        
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched Data:", data);
        
        if (data.Response === "True") {
          setDetails(data);
        } else {
          console.error("Error from API:", data.Error);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movie]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {details ? (
          <>
            <button className="close-button" onClick={onClose}>&times;</button>
            <div className="modal-grid">
              <div className="modal-poster">
                <img 
                  src={details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/300x450'} 
                  alt={details.Title} 
                />
              </div>
              <div className="modal-info">
                <h2>{details.Title}</h2>
                <p className="year">{details.Year} • {details.Rated} • {details.Runtime}</p>
                <div className="ratings">
                  {details.Ratings?.map((rating, index) => (
                    <div key={index} className="rating">
                      <span>{rating.Source}: </span>
                      <span>{rating.Value}</span>
                    </div>
                  ))}
                </div>
                <p className="plot">{details.Plot}</p>
                <div className="details-grid">
                  <div>
                    <h3>Director</h3>
                    <p>{details.Director}</p>
                  </div>
                  <div>
                    <h3>Cast</h3>
                    <p>{details.Actors}</p>
                  </div>
                  <div>
                    <h3>Genre</h3>
                    <p>{details.Genre}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
