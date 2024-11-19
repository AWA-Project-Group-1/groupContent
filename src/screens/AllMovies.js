import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { fetchTopMovies, fetchUpcomingMovies } from '../api/movieFetch';
import MovieCard from '../components/elements/Card/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllMovies = ({ type }) => {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieData = type === 'top-rated' ? await fetchTopMovies() : await fetchUpcomingMovies();
                setMovies(movieData);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [type]);

    const handleCardClick = (id) => {
        navigate(`/movie/${id}`); // Redirect to MovieDetails page with movie id
    };

    return (
        <div className="container mt-4">
            <h2>{type === 'top-rated' ? 'Top Rated Movies' : 'Upcoming Movies'}</h2>
            {movies.length > 0 ? (
                <div className="row">
                    {movies.map((movie) => (
                        <div key={movie.id} className="col-6 col-md-4 col-lg-2 mb-3">
                            <MovieCard movie={movie} onClick={handleCardClick} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading movies...</p>
            )}
        </div>
    );
};

export default AllMovies;
