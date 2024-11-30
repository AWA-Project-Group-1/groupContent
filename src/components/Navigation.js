import React, { useState,useContext} from 'react';
import { Link } from 'react-router-dom';
import styles from "./Navigation.module.css";
import movieapplogo from "../assets/images/movieapplogo.jpg";
import { useNavigate } from "react-router-dom"
import {TVGenreContext} from "../context/TVGenreProvider"
import {MovieGenreContext} from "../context/MovieGenreProvider"
import UserContext from "../context/UserContext"
// import TVGenreContext from "./context/TVGenreProvider.js"
const Navitation = () => {
  const navigate = useNavigate();
  // const [genreSelectedForTV, setGenreSelectedForTV] = useState("")
  // const [genreSelectedorMovie, setGenreSelectedForMovie] = useState("")
  const [hamburgerMenu, setHamburgerMenuMenu] = useState(false)
  const { user, setUser } = useContext(UserContext);

  function hamburgerMenuClickedHandler() {
    setHamburgerMenuMenu((prevState) => !prevState);
  }
   
  // }

  // function hamburgerMenuClickedHandler() {
  //   setHamburgerMenuMenu((prevState) => {
  //     console.log("Hamburger menu toggled: ", !prevState);
  //     return !prevState;
  //   });
  // }

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

  function logoutHandler() {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  }
  
  return (
    <div className={styles["nav-container"]}>
      <div className={styles["logo-contianer" ]} id={styles["movieapplogo-container"]}> 
        <img src={movieapplogo} alt="Movie App Logo" /> 
      </div>


      <div className={styles["hamburger-container"]}>

        <button
          className={styles["hamburger"]}
          onClick={hamburgerMenuClickedHandler}
          aria-label="Toggle Menu">
          <span className={hamburgerMenu && styles.active }></span>
          <span className={hamburgerMenu &&  styles.active }></span>
          <span className={hamburgerMenu &&  styles.active }></span>
        </button>


      {/* <div className={`${hamburgerMenu ? styles["show-menu"] : ""}`}> */}
      
      <ul className={`${hamburgerMenu ? styles["show-menu"] : styles["hide-menu"]}`}>
          <li><Link onClick={homeclickedHandler} to="/">Home</Link></li>
          <li><Link onClick={movieclickHandler} to="/movies">Movies</Link></li>
          <li><Link onClick={tvserialClickHandler} to="/tvserial">TV Serial</Link></li>
          <li><Link onClick={showtimeClickHandler} to="/showtime">Show Time</Link></li>
          <li><Link onClick={homeclickedHandler} to="/profile">Profile</Link></li>
          <li><Link onClick={homeclickedHandler} to="/group">Group Page</Link></li>
          <li><Link onClick={homeclickedHandler} to="/sign-in">SignIn/SignUp</Link></li>
        </ul>


      </div>
      
     

      {/* <li className={styles["nav-link" ]} id={styles["movieapplogo-container"]}> */}
                {/* <img src={movieapplog} alt="Movie App Logo" /> Added meaningful alt text */}
            {/* </li> */}
    <ul className={styles["nav-links"]}>           

        <li className={styles["nav-link" ]}><Link onClick={homeclickedHandler} to="/">Home</Link></li>     
    
        <li className={styles["nav-link" ]} id="li1">
            {/* <a href="" onClick={movieclickHandler}>Movie  </a> */}
            <Link onClick={movieclickHandler} to="/movies">Movies</Link>
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
          <Link onClick={ tvserialClickHandler} to="/tvserial"> TV Serial</Link>
          
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
          <Link onClick={showtimeClickHandler} to="/showtime">Show Time</Link>
        </li >
      
        <li className={styles["nav-link" ]}><Link onClick={homeclickedHandler} to="/group">Group Page</Link></li>

        <li className={styles["nav-link" ]} id="li1">
          <Link onClick={homeclickedHandler} to="/profile">Profile</Link>
        </li >

        <li className={styles["nav-link"]}>
  {user ? (
    <div className={styles["logout-container"]}>
      <span>Welcome, {user.username || "User"}!</span>
      <button onClick={logoutHandler} className={styles["logout-button"]}>Logout</button>
    </div>
    
  ) : (
    <div>
      <Link to="/sign-in">Sign In</Link> | <Link to="/sign-up">Sign Up</Link>
    </div>
  )}
</li>
      </ul>
      <hr style={{ border: '1px solid black', margin: '10px 0' }} />
    </div>
  );
};

export default Navitation
