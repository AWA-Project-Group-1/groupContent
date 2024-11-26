// HomePage.js
import React, { useState,useContext } from 'react';
import CarouselSelection from '../components/homepage/carouselSelection/CarouselSelection';
import CarouselSelectionTV from '../components/homepage/carouselSelection/CarouselTV';
import MoviePicker from '../components/homepage/randomMovie/MoviePicker';
import { discoverMovies, discoverOldMovies } from '../api/movieFetch';
import { topTVSeries } from '../api/tvFetch';
import 'bootstrap/dist/css/bootstrap.min.css';
// import styles from "../screens/TVSerial.module.css"
import Navigation from "../components/Navigation"

// heyanwen
import styles from "./HomePage.module.css"
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider"
const HomePage = () => {

    // Fetch popular movies
    const fetchPopularMovies = () => discoverMovies({ sort_by: 'popularity.desc' });




    // Fetch old movies
    const fetchOldMovies = () => discoverOldMovies({
        sort_by: 'release_date.asc',
        'release_date.gte': new Date().toISOString().split('T')[0],  // Ensures only upcoming movies
    });


    // heyanwen
    const [searchQuery, setSearchQuery] = useState('');
    const moiveTVSerialData = useContext(MoiveTVSerialContext) 

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMovies = moiveTVSerialData.movies?.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    
    const filteredTVSerials = moiveTVSerialData.tvSeries?.filter(serial => 
        serial.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // const searchedmovies=[...filteredMovies, ...filteredTVSerials]
    return (
        <div >
            <div >
                <Navigation />
            </div>
        {/* He made for the search */}
        <div className={`${styles['search-contianer']} flex flex-row items-center gap-2`}>
                    <label htmlFor="">Search :  </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="   Search by Movie or TV Serial title"
                    />
            </div>

            
        {/* He made changes */}

            {searchQuery.length > 0 && filteredMovies.length > 0 && (
                <CarouselSelection
                    title="Searched Movies"
                    searchedmovies={filteredMovies}
                />
            )}
            
            {searchQuery.length > 0 && ( filteredMovies.length === 0 ) && (
                <>
                    <h2 className={styles["carousel-selection-title"]}>Searched Movies</h2>
                    <p>No Movie found</p>
                </>
                
            )}

            {searchQuery.length > 0 && filteredTVSerials.length > 0 && (
                <CarouselSelectionTV
                    title="Searched TV Series"
                    searchedTVseries={filteredTVSerials}
                />
            )}

            
            {searchQuery.length > 0 && filteredTVSerials.length === 0 && (
                    <>
                        <h2 className={styles["carousel-selection-title"]}>Searched TV Series</h2>
                        <p>No TV Series found</p>
                    </>
                        
                        )}


          
           




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

       


            <CarouselSelectionTV
                            title="Popular TV Series"
                            fetchMovies={topTVSeries} // Use the discover endpoint
                            viewAllLink="/tvserial"
                        />

           
        </div>

    )
}


export default HomePage;
