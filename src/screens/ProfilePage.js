import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites, removeFromFavorites } from '../api/favoriteapi';
import Navigation from '../components/Navigation';
import styles from './ProfilePage.module.css';
import UserContext from '../context/UserContext';

const ITEMS_PER_PAGE = 10;

const Profile = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteDetails, setFavoriteDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(UserContext); // Access the logged-in user's token and email
  const navigate = useNavigate();

  useEffect(() => {
    async function getFavorites() {
      try {
        if (user?.token) {
          const response = await fetchFavorites(user.token);
          const favoriteItems = response.data;

          const details = await Promise.all(
            favoriteItems.map(async ({ movie_id, type }) => {
              const endpoint =
                type === 'movie'
                  ? `https://api.themoviedb.org/3/movie/${movie_id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`
                  : `https://api.themoviedb.org/3/tv/${movie_id}?api_key=8e00f8de49614d9ebf140af3901aa5b5`;

              const response = await fetch(endpoint);
              return await response.json();
            })
          );

          setFavorites(favoriteItems);
          setFavoriteDetails(details);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    getFavorites();
  }, [user]);
  

  async function removeButtonClickHandler(movieId) {
    if (!user?.token) return;

    try {
      await removeFromFavorites(movieId, user.token);
      setFavorites(favorites.filter((item) => item.movie_id !== movieId));
      setFavoriteDetails(favoriteDetails.filter((item) => item.id !== movieId));
    } catch (error) {
      console.error('Error removing item from favorites:', error);
    }
  }

  const totalPages = Math.ceil(favoriteDetails.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleFavorites = favoriteDetails.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const shareableLink = `${window.location.origin}/shared-favorites/${user.userId}`; // Use the logged-in user's ID

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Sharable link copied to clipboard!');
  };

  return (
    <div>
      <Navigation />
      <div className={styles.profileContainer}>
        <h1>Profile</h1>
        <p>Welcome to your profile site</p>
        <div className={styles.profileDetails}>
          <div>
            <label>Email:</label>
            <span>{user?.email || 'No email available'}</span>
          </div>
        </div>
        <div className={styles.shareableLinkContainer}>
          <button onClick={copyToClipboard} className={styles.copyButton}>
            Copy Link to share favorites
          </button>
        </div>
      </div>
      <div className={styles.favoritesContainer}>
        <h2 className={styles.favoritesHeading}>Your Favorites</h2>
        <div className={styles.moviesContainer}>
          {visibleFavorites.length > 0 ? (
            visibleFavorites.map((item) => (
              <div
                key={item.id}
                className={styles.movieCard}
                onClick={() => navigate(`/detail/${item.type}/${item.id}`)}
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
                    e.stopPropagation();
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
        {favoriteDetails.length > ITEMS_PER_PAGE && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`${styles.pageButton} ${
                  currentPage === i + 1 ? styles.activePage : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;