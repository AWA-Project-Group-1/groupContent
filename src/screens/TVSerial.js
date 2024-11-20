import React, { useState, useEffect,useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "../components/Footer"
import styles from "../screens/TVSerial.module.css"
import Navigation from "../components/Navigation"
import TVCards from "../components/TVCards"
import HeroSection from "../components/HeroSection"
// import { TVSeriesContext } from '../context/TVSeriesProvider';
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider"
import {TVGenreContext} from "../context/TVGenreProvider"
// for the year
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


// import MovieCarosel from "../components/MovieCarosel"
const TVSerial = () => {
    // const tvSeriesData = useContext(TVSeriesContext);
   
    const moiveTVSerialData = useContext(MoiveTVSerialContext) 
    const TVGenreData = useContext(TVGenreContext)   
    // const [genres, setGenres] = useState([]);

    const [selectGenre, setSelectGenre] = useState('')   
    const [selectYear, setSelectYear] = useState('');
    const [selectPopularity, setSelectPopularity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // const apiKey = '814d8d230ad1294ccbdbb69cccb0bc29'; // API key
    // const url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`;
    // const url1 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=1&sort_by=popularity.desc`
    // const authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTRkOGQyMzBhZDEyOTRjY2JkYmI2OWNjY2IwYmMyOSIsIm5iZiI6MTczMTQwMTUxNC4zNzIzMjk1LCJzdWIiOiI2NzMzMTViNjI5YWE4ZmYyNDRjMGUzODEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0qof6UxtmX1ZydXb7hPBwnROQT3zdyKAbEXhXQ0OO4A';
    // const urlforTVgenra = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-US`;
   
    // useEffect(() => {
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             accept: 'application/json',
    //             Authorization: authorization,
    //         },
    //     };

    //     fetch(urlforTVgenra, options)
    //         .then((req) => req.json()) // Parse the JSON data
    //         .then((res) => {
    //             setGenres(res.genres); // Use res.results for movie 
    //             console.log(`This is genres: ${JSON.stringify(res.genres)}`);
    //         })
    //         .catch((err) => {
    //             console.error('Error fetching data:', err); // Handle errors
    //         });
    // }, []);

   

    const handleGenreChange = (event) => {
        setSelectGenre(event.target.value);
    };

    const yearChangeHandler = (date) => {
        setSelectYear(date)
    };

    const handlePopularityChange = (event) => {
        setSelectPopularity(event.target.value);
    };

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMovies = moiveTVSerialData.tvSeries?.filter((movie) => {
        let isMatch = true;

        if (selectGenre && !movie.genre_ids.includes(Number(selectGenre))) {
            isMatch = false;
        }
        
        if (selectYear) {
            const movieYear = new Date(movie.first_air_date).getFullYear();
            const selectedYear = selectYear.getFullYear();
            // console.log(typeof movieYear);
            // console.log(typeof selectedYear);
            if (movieYear !== parseInt(selectedYear)) {
               
                isMatch = false;
            }
        }

        // Rating filter: Implement if necessary
        if (selectPopularity && movie.popularity <= selectPopularity) {
            isMatch = false;
        }
        // Search filter: Check if search query matches the movie title
        if (searchQuery && !movie.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            isMatch = false;
        }

        return isMatch;
    });

    return (
        <div className={styles['nav-herosection-moviescard']}>
            <div className={styles['nav-herosection']}>
                <Navigation />
                {/* <hr /> */}
                <HeroSection />
                {/* <MovieCarosel images={filteredMovies}/> */}
            </div>
            <div className={styles['allfilter-container']}>

                <div className={styles['genre-filter-container']}>
                    <label>Filter by Genre: </label>
                    <select value={selectGenre} onChange={handleGenreChange}>
                        <option value="">All</option>
                        {TVGenreData.length > 0 ? (
                            TVGenreData.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>Loading genres...</option>
                        )}
                    </select>                    
                    
                </div>


                <div className={styles['year-filter-container']}>
                    <label>Filter by Year: </label>
                    <DatePicker
                            selected={selectYear}
                            onChange={ yearChangeHandler }
                            showYearPicker
                            dateFormat="yyyy"
                        />
                        {/* <p>Selected Year: {selectYear.getFullYear()}</p> */}

                </div>

                <div className={styles['popularity-filter-container']}>
                    <label>Filter by Popularity: </label>
                    <select value={selectPopularity} onChange={handlePopularityChange}>
                        <option value="">All</option>
                        <option value="1000">Popular (&gt;1000)</option>
                        <option value="5000">Very Popular (&gt;5000)</option>
                        <option value="10000">Most Popular (&gt;10000)</option>
                    </select>
                </div>
                <div  className={styles['search-contianer']}>
                    <label htmlFor="">Search: </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="Search by TV Serial title"
                    />
                </div>

            </div>

            <div>
                <TVCards movieCards={filteredMovies} />
            </div>

            <Footer />
        </div>
    );
}

export default TVSerial;

