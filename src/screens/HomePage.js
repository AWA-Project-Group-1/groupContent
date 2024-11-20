// HomePage.js
import React from 'react';
import CarouselSelection from '../components/homepage/carouselSelection/CarouselSelection';
import MoviePicker from '../components/homepage/randomMovie/MoviePicker';
import { fetchTopMovies, fetchUpcomingMovies } from '../api/movieFetch';
import './HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import styles from "../screens/TVSerial.module.css"
import Navigation from "../components/Navigation"
const HomePage = () => (
    <div className="container mt-4">
          <div >
            <Navigation />
          </div>


        <CarouselSelection
            title="Top Movies"
            fetchMovies={fetchTopMovies}
            viewAllLink="/movies/top-rated"
        />

        <div style={{ marginBottom: '30px', marginTop: '30px' }}>
            <MoviePicker />  {/* Render MoviePicker here */}
        </div>


        <CarouselSelection
            title="Upcoming Movies"
            fetchMovies={fetchUpcomingMovies}
            viewAllLink="/movies/upcoming"
        />
    </div>
);

export default HomePage;
