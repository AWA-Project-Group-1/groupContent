import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchFavorites, removeFromFavorites } from '../api/favoriteapi';
import Navigation from '../components/Navigation';
import styles from './ProfilePage.module.css';

const Profile = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteDetails, setFavoriteDetails] = useState([]); // Store detailed data for movies/TV shows
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    async function getFavorites() {
      try {
        const response = await fetchFavorites();
        const favoriteItems = response.data; // [{ movie_id, type }]

        // Fetch detailed data for each favorite item
        const details = await Promise.all(
          favoriteItems.map(async ({ movie_id, type }) => {
            const endpoint =
              type === 'movie'
                ? `https://api.themoviedb.org/3/movie/${movie_id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`
                : `https://api.themoviedb.org/3/tv/${movie_id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`;

            const response = await fetch(endpoint);
            const data = await response.json();
            return { ...data, type }; // Attach the type to the data
          })
        );

        setFavorites(favoriteItems); // Store raw favorite items
        setFavoriteDetails(details); // Store detailed data
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    getFavorites();
  }, []);

  async function removeButtonClickHandler(movieId) {
    try {
      await removeFromFavorites(movieId);
      setFavorites(favorites.filter((item) => item.movie_id !== movieId));
      setFavoriteDetails(favoriteDetails.filter((item) => item.id !== movieId));
      alert('Item removed from favorites!');
    } catch (error) {
      console.error('Error removing item from favorites:', error);
    }
  }

  function handleCardClick(item) {
    if (item.type === 'movie') {
      navigate(`/detail/movie/${item.id}`); // Navigate to MovieDetail page
    } else if (item.type === 'tv') {
      navigate(`/detail/tv/${item.id}`); // Navigate to TVDetail page
    }
  }

  return (
    <div>
      <Navigation />
      <div className={styles.profileContainer}>
        <h1>Profile</h1>
        <p>Welcome to your profile site</p>
        <div className={styles.profileDetails}>
          <div>
            <label>Name:</label>
            <span>John Doe</span>
          </div>
          <div>
            <label>Email:</label>
            <span>john.doe@example.com</span>
          </div>
        </div>
      </div>
      <div className={styles.favoritesContainer}>
      <h2 className={styles.favoritesHeading}>Your Favorites</h2>
        <div className={styles.moviesContainer}>
          {favoriteDetails.length > 0 ? (
            favoriteDetails.map((item) => (
              <div
                key={item.id}
                className={styles.movieCard}
                onClick={() => handleCardClick(item)} // Add click handler
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className={styles.movieImage}
                />
                <h5>{item.title || item.name}</h5>
                <p>{item.release_date || item.first_air_date}</p>
                <button
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    removeButtonClickHandler(item.id);
                  }}
                >
                  Remove from favorites
                </button>
              </div>
            ))
          ) : (
            <p>No favorites added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;