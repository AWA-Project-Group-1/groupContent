import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import styles from "./MovieCards.module.css";
import { MovieGenreContext } from "../context/MovieGenreProvider";
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../api/favoriteapi';
import UserContext from '../context/UserContext';

const MovieCards = ({ movieCards }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext); // Access the logged-in user's token
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // To parse query parameters
  const genreName = queryParams.get('genre');
  const genreList = useContext(MovieGenreContext);

  useEffect(() => {
    async function loadFavorites() {
      try {
        if (user?.token) {
          const response = await fetchFavorites(user.token);
          setFavorites(response.data.map((item) => item.movie_id)); // Store favorite movie IDs
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    loadFavorites();
  }, [user]);

  const filteredMovies = genreName
    ? movieCards.filter((movie) => {
        const movieGenreNames = movie.genre_ids.map(
          (id) => genreList.find((genre) => genre.id === id)?.name
        );
        return movieGenreNames.includes(genreName);
      })
    : movieCards;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

  function productClickHandler(movieId) {
    navigate(`/detail/movie/${movieId}`);
  }

  function toggleFavoriteHandler(event, movieId) {
    event.stopPropagation();
    if (!user?.token) return; // Prevent action if user is not logged in

    if (favorites.includes(movieId)) {
      removeFromFavorites(movieId, user.token)
        .then(() => setFavorites(favorites.filter((id) => id !== movieId)))
        .catch((error) => console.error('Error removing movie from favorites:', error));
    } else {
      addToFavorites(movieId, 'movie', user.token)
        .then(() => setFavorites([...favorites, movieId]))
        .catch((error) => console.error('Error adding movie to favorites:', error));
    }
  }

  function nextPage() {
    if (currentMovies.length === itemsPerPage) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div>
      <div className={styles['productcards_container']}>
        {currentMovies.map((item) => (
          <div 
            className={styles['product-card-framework']} 
            onClick={() => productClickHandler(item.id)}  
            key={item.id}
          >
            <div className={styles['image-container']}> 
              <img 
                className={styles['product-card']} 
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                alt={item.name} 
              />
            </div>
            <div className={styles['text-container']}>
              <h5>{item.title.length > 17 ? `${item.title.slice(0, 17)}...` : item.title}</h5>
              <p>{item.release_date}</p>
              <div className={styles['button-container']}>
                {/* Review Button */}
                <div className={styles['review-button-container']}>
                  <button className={styles['button-click']}>
                    ✍️ Give <br /> Review
                  </button>
                </div>
                <div className={styles['addfavourites-button-container']}>
                  <button
                    className={styles['button-click']}
                    onClick={(e) => toggleFavoriteHandler(e, item.id)}
                  >
                    {favorites.includes(item.id) ? '🖤Delete from favorites' : '❤️Add to favorites'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles['pagination-controls']}>
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage} disabled={currentMovies.length < itemsPerPage}>Next</button>
      </div>
    </div>
  );
};

export default MovieCards;