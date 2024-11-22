import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_REVIEW_URL;

/**
 * Fetch reviews for a specific movie.
 * @param {string} movieId - The ID of the movie to fetch reviews for.
 * @returns {Promise<Object[]>} - The array of reviews.
 * @throws {Error} - If the fetch fails.
 */
export const fetchReviews = async (movieId) => {
    try {
        const response = await axios.get(`${baseUrl}/${movieId}`);
        return response.data; // Axios automatically parses JSON responses
    } catch (error) {
        console.error('Error fetching reviews:', error.response || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch reviews');
    }
};

/**
 * Submit a new review for a movie.
 * @param {string} movieId - The ID of the movie to review.
 * @param {Object} reviewData - The review data (e.g., rating, comment).
 * @returns {Promise<Object>} - The newly created review.
 * @throws {Error} - If the submission fails.
 */
export const submitReview = async (movieId, reviewData) => {
    try {
        const response = await axios.post(baseUrl, { movieId, ...reviewData }, {
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
        const response = await axios.delete(`${baseUrl}/${reviewId}`);
        return response.data; // Axios automatically parses JSON responses
    } catch (error) {
        console.error('Error deleting review:', error.response || error.message);
        throw new Error(error.response?.data?.error || 'Failed to delete review');
    }
};
