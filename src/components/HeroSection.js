
import React, { useContext} from 'react';
import { Link  } from "react-router-dom";
import styles from "./HeroSection.module.css";
// import { TVSeriesContext } from '../context/TVSeriesProvider';
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider"

const HeroSection = ({type}) => {
  const moiveTVSerialData = useContext(MoiveTVSerialContext) 
  // const { tvormovie } = useParams();
  // console.log(`This is the ${tvormovie}`); 
  // console.log("Params object:", useParams());

 

  const mostPopularSeries = moiveTVSerialData.tvSeries?.reduce((prev, current) => {
    return prev.popularity > current.popularity ? prev : current;
  }, {});

  const mostPopularMovies = moiveTVSerialData.movies?.reduce((prev, current) => {
    return prev.popularity > current.popularity ? prev : current;
  }, {});

  
 
  const BackgroundImageHandler = () => {

    
    // if (!tvormovie) {
    
    //   return `https://image.tmdb.org/t/p/original${mostPopularSeries.backdrop_path}`;
    // }


    const backgroundImageforTV = mostPopularSeries?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${mostPopularSeries.backdrop_path}`
      : " ";
  
    const backgroundImageforMovie = mostPopularMovies?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${mostPopularMovies.backdrop_path}`
      : "";
      if (type === "tvserial") {
        return backgroundImageforTV;
      } 
      if (type === "movie") {
        return backgroundImageforMovie;
      }
      return ""; 
    };

    // if (type ==tv")) {
    //   return backgroundImageforTV;
    // }
    // if (tvormovie.includes("movie")) {
    //   return backgroundImageforMovie;
    // }
    // return ""; 
  // };

  return (
    <div className={`${styles['hero-section']} text-center py-5`} style={{
      backgroundImage: `url(${ BackgroundImageHandler()})`
    }}
  >
      <div className={styles['hero-content']}>
        <h1>Discover Your {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
        <h4>Explore the top-rated and latest {type} shows!</h4>
        {/* <Link className="btn btn-primary mx-2">See More</Link> */}
        
      </div>
    </div>
  );
};

export default HeroSection;
