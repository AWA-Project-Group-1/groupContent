import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

// Fetch top-rated TV series
export const topTVSeries = async (params = {}) => {
    try {
        console.log("Discover TV Series Params:", params); // Debug log
        const response = await axios.get(`${BASE_URL}/discover/tv`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                sort_by: 'popularity.desc', // Sort by popularity or use another sorting method
                ...params, // Additional params
            },
        });
        console.log("Discover TV Series Response:", response.data); // Debug log
        return response.data.results;
    } catch (error) {
        console.error('Error fetching discovered TV series:', error);
        throw error;
    }
};