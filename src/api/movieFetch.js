import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

// Fetch genres
export const fetchGenres = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
            },
        });
        return response.data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
};

// Fetch top-rated movies
export const fetchTopMovies = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                page: 1,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching top movies:", error);
        throw error;
    }
};

// Fetch random movie based on genre
export const fetchRandomMovie = async (genreId) => {
    try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            params: {
                api_key: API_KEY,
                with_genres: genreId,
                language: 'en-US',
            },
        });
        const randomIndex = Math.floor(Math.random() * response.data.results.length);
        return response.data.results[randomIndex];
    } catch (error) {
        console.error('Error fetching random movie:', error);
        throw error;
    }
};

// Fetch movie details by movie ID (cast, reviews, trailer, etc.)
export const fetchMovieDetails = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                append_to_response: 'credits,reviews,videos',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for movie ID: ${id}`, error);
        throw error;
    }
};

// Fetch upcoming movies
export const fetchUpcomingMovies = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                page: 1,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        throw error;
    }
};
