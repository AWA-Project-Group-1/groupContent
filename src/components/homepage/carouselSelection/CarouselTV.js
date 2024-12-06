import React, { useState, useEffect } from 'react';
import CustomCarouselTV from '../../elements/Carousel/TvCarousel'; // Assuming CustomCarouselTV is the carousel component
import ViewAllButton from '../../elements/Button/ViewAllButton'; // Import ViewAllButton component
import './CarouselSelection.css'; // Import the CSS file
import { fetchReviews } from "../../../api/reviews";
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * Custom hook to fetch movies using the provided fetch function.
 * @param {Function} fetchFunction - API fetch function.
 */
function useFetchMovies(fetchFunction) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFunction();
                setMovies(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [fetchFunction]);

    return movies;
}

const CarouselSelection = ({ title, fetchMovies, searchedTVseries, viewAllLink }) => {
    // Always call the hook, but decide later which data to use.
    const fetchedMovies = useFetchMovies(fetchMovies);
    const movies = searchedTVseries || fetchedMovies;

    const [averageRatings, setAverageRatings] = useState({});
    const [reviewCounts, setReviewCounts] = useState({});

    // Fetch average ratings and review counts for movies
    useEffect(() => {
        async function loadRatings() {
            const ratings = {};
            const counts = {};

<<<<<<< HEAD
            try {
                const reviewsData = await Promise.all(
                    movies.map((movie) =>
                        fetchReviews(movie.id, 'tv') // Fetch reviews for TV series
                            .then((reviews) => ({
                                id: movie.id,
                                average:
                                    reviews.length > 0
                                        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                                        : 0,
                                count: reviews.length,
                            }))
                            .catch(() => ({ id: movie.id, average: 0, count: 0 }))
                    )
                );
=======
            for (const movie of movies) {
                try {
                    const reviews = await fetchReviews(movie.id, 'tv');
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
>>>>>>> e375476712710d03bc75abd47f157d824505aaae

                reviewsData.forEach(({ id, average, count }) => {
                    ratings[id] = average;
                    counts[id] = count;
                });

                setAverageRatings(ratings);
                setReviewCounts(counts);
            } catch (error) {
                console.error('Error loading ratings:', error);
            }
        }

        if (movies.length > 0) {
            loadRatings();
        }
    }, [movies]);

<<<<<<< HEAD
=======
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
        averageRating: averageRatings[movie.id] || 0,
        reviewCount: reviewCounts[movie.id] || 0,
    }));

>>>>>>> e375476712710d03bc75abd47f157d824505aaae
    return (
        <div className="carousel-selection">
            <div className="carousel-selection-header">
                <h2 className="carousel-selection-title">{title}</h2>
                {viewAllLink && <ViewAllButton link={viewAllLink} />}
            </div>

            {movies.length > 0 ? (
                <CustomCarouselTV
                    data={movies.map((movie) => ({
                        id: movie.id,
                        src: movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : '/placeholder.png',
                        name: movie.name,
                        release_date: movie.first_air_date,
                        averageRating: averageRatings[movie.id]?.toFixed(1) || 'N/A',
                        reviewCount: reviewCounts[movie.id] || 0,
                    }))}
                    gridTheme={{ md: 768 }}
                    renderItem={(movie) => (
                        <div className="carousel-item">
                            <img src={movie.src} alt={movie.name} className="movie-poster" />
                            <div className="movie-info">
                                <h5>{movie.name}</h5>
                                <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                                <p>
                                    <i className="bi bi-star-fill text-warning"></i> {movie.averageRating} 
                                    <span className="text-muted">({movie.reviewCount} reviews)</span>
                                </p>
                            </div>
                        </div>
                    )}
                />
            ) : (
                <div className="loading-spinner">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarouselSelection;

