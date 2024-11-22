// HomePage.js
import React from 'react';
import CarouselSelection from '../components/homepage/carouselSelection/CarouselSelection';
import CarouselSelectionTV from '../components/homepage/carouselSelection/CarouselTV';
import MoviePicker from '../components/homepage/randomMovie/MoviePicker';
import { discoverMovies, discoverOldMovies } from '../api/movieFetch';
import { topTVSeries } from '../api/tvFetch';
import 'bootstrap/dist/css/bootstrap.min.css';
// import styles from "../screens/TVSerial.module.css"
import Navigation from "../components/Navigation"
const HomePage = () => {

    // Fetch popular movies
    const fetchPopularMovies = () => discoverMovies({ sort_by: 'popularity.desc' });


    /* // Fetch upcoming movies function
     const fetchUpcomingMovies = async () => {
         try {
             const movies = await discoverUpcomingMovies();
             console.log("Filtered Upcoming Movies:", movies);
             return movies;
         } catch (error) {
             console.error("Error fetching movies:", error);
         }
     };
     */


    // Fetch old movies
    const fetchOldMovies = () => discoverOldMovies({
        sort_by: 'release_date.asc',
        'release_date.gte': new Date().toISOString().split('T')[0],  // Ensures only upcoming movies
    });

    return (
        <div >
            <div >
                <Navigation />
            </div>


            <CarouselSelection
                title="Popular Movies"
                fetchMovies={fetchPopularMovies} // Use the discover endpoint
                viewAllLink="/movies"
            />

            <div style={{ marginBottom: '30px', marginTop: '30px' }}>
                <MoviePicker />  {/* Render MoviePicker here */}
            </div>

            <CarouselSelection
                title="Timeless Movies (1900s)"
                fetchMovies={fetchOldMovies}
            />

            {/*<CarouselSelection
                title="Upcoming Movies"
                fetchMovies={fetchUpcomingMovies}
            />*/}

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
