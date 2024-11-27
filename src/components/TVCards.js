import { useNavigate,useParams, useLocation } from 'react-router-dom';
import { fetchFavorites, removeFromFavorites, addToFavorites } from '../api/favoriteapi';

import React, {useState,useContext, useEffect} from 'react'
import styles from "./MovieCards.module.css"
import { TVGenreContext} from "../context/TVGenreProvider"
const TVCards = ({ movieCards}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  // const { genreName } = useParams();
  
  const [favorites, setFavorites] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // To parse query parameters
  const genreName = queryParams.get('genre');
  // Calculate the index range for the current page
  const genreList = useContext(TVGenreContext);


  // Fetch favorites on component load
  useEffect(() => {
    async function loadFavorites() {
      try {
        const response = await fetchFavorites();
        setFavorites(response.data); // Store favorite TV show IDs
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    loadFavorites();
  }, []);


  const filteredMovies = genreName
  ? movieCards.filter((movie) => {
    
      const movieGenreNames = movie.genre_ids.map(
        (id) => genreList.find((genre) => genre.id === id)?.name
      );

      
      return movieGenreNames.includes(genreName);
    })
  : movieCards;


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, endIndex);


  function productClickHandler(movieId){
    // console.log("This is movieTVSerialData:", data);
    navigate(`/detail/tv/${movieId}`);
  }

  function toggleFavoriteHandler(event, movieId) {
    event.stopPropagation();
    if (favorites.includes(movieId)) {
      removeFromFavorites(movieId)
        .then(() => {
          setFavorites(favorites.filter((id) => id !== movieId));
          alert('TV show removed from favorites!');
        })
        .catch((error) => console.error('Error removing TV show from favorites:', error));
    } else {
      addToFavorites(movieId, 'tv') // Add the type 'tv'
        .then(() => {
          setFavorites([...favorites, movieId]);
          alert('TV show added to favorites!');
        })
        .catch((error) => console.error('Error adding TV show to favorites:', error));
    }
  }
// for th navi from page to page
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
      <div className={styles['productcards_container']} > 
      { currentMovies.map(item => (
        <div 
          className={styles['product-card-framework']} 
          onClick={() => productClickHandler(item.id)}  
          key={item.id}>
            <div className={styles['image-container']}>
              <img className={styles['product-card']} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.name} />
            </div>

            <div className={styles['text-container']}>
              {/* <h5>{item.name}</h5>   */}
              <h5>{item.name.length > 17? `${item.name.slice(0, 17)}...` : item.name}</h5>     
              <p>{item.first_air_date}</p>
              <div className={styles['button-container']}>
                {/* Review Button */}
                <div className={styles['review-button-container']}>
                    <button className={styles['button-click']}>
                      ✍️ Give <br></br> Review
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

export default TVCards