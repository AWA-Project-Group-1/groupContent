import { useNavigate } from 'react-router-dom';
import React, {useState} from 'react'
import styles from "./MovieCards.module.css"

const MovieCards = ({ movieCards}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = movieCards.slice(startIndex, endIndex);


  function productClickHandler(movieId){
    navigate(`/detail/${movieId}`);
  }

  function addButtonClickHandler(event){
    event.stopPropagation();
    navigate(`/profile`);
    
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
      <div className={styles['productcards_container']} > {/* Apply the class here */}
      { currentMovies.map(item => (
        <div 
          className={styles['product-card-framework']} 
          onClick={() => productClickHandler(item.id)}  
          key={item.itemid}>
          <img className={styles['product-card']} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.name} />
         
          <h5>{item.name}</h5>
          
          <p>{item.first_air_date}</p>
          <div className={styles['button-container']}>
            <button className={styles['button-click']} onClick={addButtonClickHandler}>Add to favourite</button>
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

export default MovieCards