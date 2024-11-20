import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

// Fetch genres
export const fetchGenres = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
            params: {
                api_key: API_KEY,
            },
        });
        return response.data.genres; // Returns an array of genres
    } catch (error) {
        console.error('Failed to fetch genres:', error);
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
                sort_by: 'popularity.desc',
            },
        });

        const movies = response.data.results;
        if (!movies.length) {
            throw new Error('No movies found for the selected genre.');
        }

        // Pick a random movie
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        return randomMovie;
    } catch (error) {
        console.error('Failed to fetch random movie:', error);
        throw error;
    }
};

// Update the discoverMovies function to include release_date.gte for unreleased movies
export const discoverMovies = async (params = {}) => {
    try {
        console.log("Discover Movies Params:", params); // Debug log
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                sort_by: 'popularity.desc', // Sort by popularity or use another sorting method
                ...params, // Additional params
            },
        });
        console.log("Discover Movies Response:", response.data); // Debug log
        return response.data.results;
    } catch (error) {
        console.error('Error fetching discovered movies:', error);
        throw error;
    }
};

