import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGenres, fetchRandomMovie } from '../../../api/movieFetch';
import GenreSelector from './GenreSelector';
import RandomMovieButton from '../../elements/Button/RandomMovieButton';
import './styles.css'; // Ensure the CSS file is imported

const MoviePicker = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch genres from TMDb
    useEffect(() => {
        const fetchAvailableGenres = async () => {
            try {
                const genreList = await fetchGenres();
                setGenres(genreList);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchAvailableGenres();
    }, []);

    // Fetch random movie based on selected genre
    const handleRandomMovieFetch = async () => {
        setLoading(true);
        try {
            const movie = await fetchRandomMovie(selectedGenre);
            // Redirect to movie details page
            navigate(`/movie/${movie.id}`);
        } catch (error) {
            console.error('Error fetching random movie:', error);
        }
        setLoading(false);
    };

    return (
        <div className="movie-picker-container">
            <h1>Need a Movie? We've Got You Covered!</h1>
            <p>Feeling overwhelmed by the endless options? Let us help you pick a movie! Select a category below and discover a random movie to watch.</p>
            <GenreSelector
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
            />
            <RandomMovieButton
                onClick={handleRandomMovieFetch}
                loading={loading}
                disabled={!selectedGenre || loading}
            />
        </div>
    );
};

export default MoviePicker;
