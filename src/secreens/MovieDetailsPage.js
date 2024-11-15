import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../api/movieFetch';
import 'bootstrap/dist/css/bootstrap.min.css';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [successMessage, setSuccessMessage] = useState(""); // state for success message

    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const movieData = await fetchMovieDetails(id);
                setMovie(movieData);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        getMovieDetails();
    }, [id]);


    return movie ? (
        <div className="container mt-5">
            <div>
                <h2>{movie.title}</h2>
                <img
                    style={{ width: '200px', borderRadius: '8px' }}
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <p>{movie.overview}</p>
            </div>

        </div>
    ) : (
        <div className="container mt-4">
            <p>Loading movie details...</p>
        </div>
    );
};

export default MovieDetails;
