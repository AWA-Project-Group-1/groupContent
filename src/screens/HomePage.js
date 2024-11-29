import React, { useState, useContext, useEffect, useRef } from 'react';
import CarouselSelection from '../components/homepage/carouselSelection/CarouselSelection';
import CarouselSelectionTV from '../components/homepage/carouselSelection/CarouselTV';
import MoviePicker from '../components/homepage/randomMovie/MoviePicker';
import { discoverMovies, discoverOldMovies, fetchTopMovies, fetchUpcomingMovies } from '../api/movieFetch';
import { topTVSeries } from '../api/tvFetch';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from "../components/Navigation";
import poster from "../assets/images/poster.png";
import poster2 from "../assets/images/poster2.jpg";
import poster3 from "../assets/images/poster3 (2).jpg";

// heyanwen
import styles from "./HomePage.module.css";
import { MoiveTVSerialContext } from "../context/MoiveTVSerialProvider";

const HomePage = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const images = [
        { src: poster, position: '30% 75%' },
        { src: poster2, position: '30% 20%' },
        { src: poster3, position: '30% 60%' },
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImage((prevImage) => {
                const nextImage = (prevImage + 1) % images.length;
                console.log('Switching to image', nextImage); // Debug log to track the current image
                return nextImage;
            });
        }, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [images.length]);

    // Fetch popular movies
    const fetchPopularMovies = () => discoverMovies({ sort_by: 'popularity.desc' });

    // Fetch old movies
    const fetchOldMovies = () => discoverOldMovies({
        sort_by: 'release_date.asc',
        'release_date.gte': new Date().toISOString().split('T')[0],  // Ensures only upcoming movies
    });

    const [searchQuery, setSearchQuery] = useState('');
    const moiveTVSerialData = useContext(MoiveTVSerialContext);

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMovies = moiveTVSerialData.movies?.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const filteredTVSerials = moiveTVSerialData.tvSeries?.filter(serial =>
        serial.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Create a ref for the search result section
    const searchResultRef = useRef(null);

    // Scroll to the search result section whenever searchQuery changes
    useEffect(() => {
        if (searchQuery.length > 0 && searchResultRef.current) {
            searchResultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [searchQuery]);

    return (
        <div>
            <div>
                <Navigation />
            </div>

            <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '600px' }}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.src}
                        alt={`Slideshow Image ${index + 1}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: image.position,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: index === currentImage ? 0 : -1,  // Lower z-index for images
                        }}
                    />
                ))}
                {/* Search Bar Overlay */}
                <div className={`${styles['search-container']} d-flex flex-column align-items-center justify-content-center`} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, color: 'white' }}>
                    <h1>Welcome to NordFlix!</h1>
                    <p>Discover Movies and TV Shows. Your Next Favorite is Just a Click Away!</p>
                    <label htmlFor="search" style={{ fontSize: '20px', marginBottom: '10px' }}></label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="   Search by Movie or TV Serial title"
                        style={{ width: '700px', height: '45px', padding: '10px', fontSize: '16px', border: 'none', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
                    />
                </div>
            </div>

            {/* Search Results Section */}
            <div ref={searchResultRef} style={{ marginTop: '50px' }} />

            {/* Display filtered movies and TV Series */}
            {searchQuery.length > 0 && filteredMovies.length > 0 && (
                <CarouselSelection
                    title="Searched Movies"
                    searchedmovies={filteredMovies}
                />
            )}

            {searchQuery.length > 0 && filteredMovies.length === 0 && (
                <h2 className={styles["carousel-selection-title"]}>Searched Movies</h2>
            )}

            {searchQuery.length > 0 && filteredTVSerials.length > 0 && (
                <CarouselSelectionTV
                    title="Searched TV Series"
                    searchedTVseries={filteredTVSerials}
                />
            )}

            {searchQuery.length > 0 && filteredTVSerials.length === 0 && (
                <h2 className={styles["carousel-selection-title"]}>Searched TV Series</h2>
            )}

            <CarouselSelection
                title="Trending Movies"
                fetchMovies={fetchPopularMovies} // Use the discover endpoint
                viewAllLink="/movies"
            />

            <CarouselSelection
                title="Top Movies"
                fetchMovies={fetchTopMovies}
            />

            <div style={{ marginBottom: '30px', marginTop: '30px' }}>
                <MoviePicker />
            </div>

            <CarouselSelection
                title="Timeless Movies (1900s)"
                fetchMovies={fetchOldMovies}
            />

            <CarouselSelection
                title="Coming Soon"
                fetchMovies={fetchUpcomingMovies}
            />

            <CarouselSelectionTV
                title="Popular TV Series"
                fetchMovies={topTVSeries} // Use the discover endpoint
                viewAllLink="/tvserial"
            />
        </div>
    );
}

export default HomePage;
