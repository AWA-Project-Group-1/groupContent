import React, { useState, useEffect } from 'react';
import { topTVSeries } from '../../../api/tvFetch'; // Example API function for fetching popular movies
import CustomCarouselTV from '../../elements/Carousel/TvCarousel';  // Assuming CustomCarousel is the carousel component
import ViewAllButton from '../../elements/Button/ViewAllButton';  // Import ViewAllButton component
import './CarouselSelection.css';  // Import the CSS file
import { fetchReviews } from "../../../api/reviews";
import 'bootstrap-icons/font/bootstrap-icons.css';

const CarouselSelection = ({ title, fetchMovies, searchedTVseries, viewAllLink }) => {
    const [movies, setMovies] = useState([]);
    const [showAllMovies, /*setShowAllMovies*/] = useState(false);  // State to toggle between showing first 10 and all movies
    const [averageRatings, setAverageRatings] = useState({});
    const [reviewCounts, setReviewCounts] = useState({});

    useEffect(() => {
        if (searchedTVseries) {
            setMovies(searchedTVseries);
            return; // Early return to prevent fetching if searchedmovies are available
        }
        const fetchData = async () => {
            try {
                const movieData = await topTVSeries();
                console.log("API Response:", movieData);
                setMovies(movieData); // Store the fetched movies in state
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };

        fetchData(); // Fetch movies when the component mounts
    }, [fetchMovies, searchedTVseries]);

    useEffect(() => {
        async function loadRatings() {
            const ratings = {};
            const counts = {};

            for (const movie of movies) {
                try {
                    const reviews = await fetchReviews(movie.id, 'movie');
                    const average =
                        reviews.length > 0
                            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                            : 0;
                    ratings[movie.id] = average;
                    counts[movie.id] = reviews.length;
                } catch (error) {
                    console.error('Error fetching reviews for movie ID:', movie.id, error);
                }
            }

            setAverageRatings(ratings);
            setReviewCounts(counts);
        }
        if (movies.length > 0) {
            loadRatings();
        }
    }, [movies]);

    // Show first 10 movies for carousel
    const carouselMovies = movies.slice(0, 15).map((movie) => ({
        id: movie.id,
        src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        name: movie.name,
        release_date: movie.first_air_date,
        averageRating: averageRatings[movie.id] || 0,
        reviewCount: reviewCounts[movie.id] || 0,
    }));

    // Show all movies when "View All" button is clicked
    const allMovies = movies.map((movie) => ({
        id: movie.id,
        src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        name: movie.name,
        release_date: movie.first_air_date,
    }));

    return (
        <div className="carousel-selection">
            <div className="carousel-selection-header">
                <h2 className="carousel-selection-title">{title}</h2>
                {/* Using ViewAllButton to toggle the view */}
                <ViewAllButton link={viewAllLink} />
            </div>

            {movies.length > 0 ? (
                <div className="carousel-selection-carousel">
                    <CustomCarouselTV data={showAllMovies ? allMovies : carouselMovies} gridTheme={{ md: 768 }} />
                </div>
            ) : (
                <p className="carousel-selection-loading">Loading movies...</p>
            )}
        </div>
    );
};

export default CarouselSelection;
