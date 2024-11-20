
import React, {useContext} from 'react';
import { useParams } from "react-router-dom";
import styles from "./HeroSection.module.css";
// import { TVSeriesContext } from '../context/TVSeriesProvider';
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider"

const HeroSection = () => {
  const moiveTVSerialData = useContext(MoiveTVSerialContext) 
  const { tvormovie } = useParams();
  // const tvSeriesData = useContext(TVSeriesContext);
 

  const mostPopularSeries = moiveTVSerialData.tvSeries?.reduce((prev, current) => {
    return prev.popularity > current.popularity ? prev : current;
  }, {});

  const mostPopularMovies = moiveTVSerialData.movies?.reduce((prev, current) => {
    return prev.popularity > current.popularity ? prev : current;
  }, {});

  
 
  const BackgroundImageHandler = (tvormovie) => {

    if (!tvormovie) {
    
      return `https://image.tmdb.org/t/p/original${mostPopularSeries.backdrop_path}`; // Example fallback image
    }


    const backgroundImageforTV = mostPopularSeries?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${mostPopularSeries.backdrop_path}`
      : "";
  
    const backgroundImageforMovie = mostPopularMovies?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${mostPopularMovies.backdrop_path}`
      : "";
  

    if (tvormovie.includes("tv")) {
      return backgroundImageforTV;
    }
    if (tvormovie.includes("movie")) {
      return backgroundImageforMovie;
    }
    return ""; 
  };

  return (
    <div className={`${styles['hero-section']} text-center py-5`} style={{
      backgroundImage: `url(${ BackgroundImageHandler(tvormovie)})`
    }}
  >
      <div className={styles['hero-content']}>
        <h1>Discover Your {tvormovie}</h1>
        <p>Explore the top-rated and latest {tvormovie} shows!</p>
        <a href="/movies" className="btn btn-primary mx-2">See More</a>
      </div>
    </div>
  );
};

export default HeroSection;
