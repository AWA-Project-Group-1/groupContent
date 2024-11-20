import React, { useState,useContext } from 'react';
import styles from "./Navigation.module.css";
import movieapplogo from "../assets/images/movieapplogo.jpg";
import { useNavigate } from "react-router-dom"
import {TVGenreContext} from "../context/TVGenreProvider"
import {MovieGenreContext} from "../context/MovieGenreProvider"
// import TVGenreContext from "./context/TVGenreProvider.js"
const Navitation = () => {
  const navigate = useNavigate();
  const [genreSelectedForTV, setGenreSelectedForTV] = useState("")
  const [genreSelectedorMovie, setGenreSelectedForMovie] = useState("")
  
  const TVGenreData= useContext(TVGenreContext) 
  const MovieGenreData= useContext(MovieGenreContext)     
  function showtimeClickHandler(){
    navigate ("/showtime")
  }


  function tvserialClickHandler(){
    navigate ('/tvserial')

  }
  function homeclickedHandler(){
    navigate("/")

  }
  function movieclickHandler(){
    navigate("/movies")
  }

  function TVgenreInNavigationBar(genre){
    navigate(`/tvserial?genre=${genre.name}`)

  }

  function MoviegenreInNavigationBar(genre){
    navigate(`/movies?genre=${genre.name}`)

  }

  function profileclickHandler(){
    navigate("/profile")
  }
  return (
    <div className={styles["nav-container"]}>
      <div className={styles["nav-link" ]} id={styles["movieapplogo-container"]}> 
        <img src={movieapplogo} alt="Movie App Logo" /> {/* Added meaningful alt text */}
      </div>
      {/* <li className={styles["nav-link" ]} id={styles["movieapplogo-container"]}> */}
                {/* <img src={movieapplog} alt="Movie App Logo" /> Added meaningful alt text */}
            {/* </li> */}
        <ul className={styles["nav-links"]}>           

            <li className={styles["nav-link" ]}><a href="" onClick={ homeclickedHandler}>Home</a> </li>     
        
            <li className={styles["nav-link" ]} id="li1">
                <a href="" onClick={movieclickHandler}>Movie  </a>
                <span style={{ verticalAlign: 'middle', position: 'relative', top: '-6px' }}>&#8964;</span>
                <ul className={styles["dropdown1"]}>  


                {MovieGenreData && MovieGenreData.length > 0 ? (
                  MovieGenreData.map((genre) => (
                    <li key={genre.id}>
                      <a href=""  onClick={() => MoviegenreInNavigationBar(genre)}>{genre.name}</a>
                    </li>
                  ))
                ) : (
                  <li>No genres available</li>
                )}          
                </ul>
            </li> 


            <li className={styles["nav-link" ]} id="li1">
                <a href="" onClick={ tvserialClickHandler }>TV Serial  </a>
                <span style={{ verticalAlign: 'middle', position: 'relative', top: '-6px' }}>&#8964;</span>
                <ul className={styles["dropdown1"]}>
                {TVGenreData && TVGenreData.length > 0 ? (
                  TVGenreData.map((genre) => (
                    <li key={genre.id}>
                      <a href=""  onClick={() => TVgenreInNavigationBar(genre)}>{genre.name}</a>
                    </li>
                  ))
                ) : (
                  <li>No genres available</li>
                )}
          </ul>
            </li> 
            <li className={styles["nav-link" ]} id="li1">
                <a href="" onClick={ showtimeClickHandler}>Show Time  </a>
            </li >
          
            <li className={styles["nav-link" ]}><a href="index_hy.html">Group Page</a></li>

            <li className={styles["nav-link" ]}><a href="" onClick={profileclickHandler}>Profile</a></li>
            
        </ul>
        <hr style={{ border: '1px solid balck', margin: '10px 0' }} />
                        

    </div>
        
             
    
  )
}

export default Navitation
