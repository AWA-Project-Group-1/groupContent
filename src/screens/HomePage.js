// HomePage.js
import React from 'react';
import CarouselSelection from '../components/homepage/carouselSelection/CarouselSelection';
import CarouselSelectionTV from '../components/homepage/carouselSelection/CarouselTV';
import MoviePicker from '../components/homepage/randomMovie/MoviePicker';
import { discoverMovies } from '../api/movieFetch';
import { topTVSeries } from '../api/tvFetch';
import 'bootstrap/dist/css/bootstrap.min.css';
//import styles from "../screens/TVSerial.module.css"
import Navigation from "../components/Navigation"
const HomePage = () => {

    // Example for fetching popular movies
    const fetchPopularMovies = () => discoverMovies({ sort_by: 'popularity.desc' });

    return (
        <div >
            <div >
                <Navigation />
            </div>


            <CarouselSelection
                title="Discover Popular Movies"
                fetchMovies={fetchPopularMovies} // Use the discover endpoint
                viewAllLink="/movies"
            />


            <div style={{ marginBottom: '30px', marginTop: '30px' }}>
                <MoviePicker />  {/* Render MoviePicker here */}
            </div>

            {/* TV Series Carousel */}
            <CarouselSelectionTV
                title="Popular TV Series"
                fetchMovies={topTVSeries} // Use the TV series endpoint
                viewAllLink="/tvserial"
            />

        </div>

    )
}


export default HomePage;
