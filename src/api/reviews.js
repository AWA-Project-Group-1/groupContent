import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const baseUrlforReviews = `${baseUrl}/reviews`;

export const fetchReviews = async (movieId, contentType) => {
    try {
        const response = await axios.get(`${baseUrlforReviews}/${contentType}/${movieId}`);
        return response.data; // Axios automatically parses JSON responses
    } catch (error) {
        console.error('Error fetching reviews:', error.response || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch reviews');
    }
};

export const submitReview = async (movieId, reviewData) => {
    try {
        const response = await axios.post(baseUrlforReviews, { movieId, ...reviewData }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Axios automatically parses JSON responses
    } catch (error) {
        console.error('Error submitting review:', error.response || error.message);
        throw new Error(error.response?.data?.error || 'Failed to submit review');
    }
};


export const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(`${baseUrlforReviews}/${reviewId}`);
        return response.data; // Axios automatically parses JSON responses
    } catch (error) {
        console.error('Error deleting review:', error.response || error.message);
        throw new Error(error.response?.data?.error || 'Failed to delete review');
    }
};
