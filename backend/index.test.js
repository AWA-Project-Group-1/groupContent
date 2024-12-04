import { expect } from 'chai';
import fetch from 'node-fetch'; // Ensure node-fetch is installed
import { initializeTestDb, insertTestUser, getToken } from './helpers/test.js';
import { pool } from './helpers/db.js';

const base_url = 'http://localhost:3001';


//Integration test for browsing both movies' and Tv shows' reviews
describe('Integration Tests - Adding and Getting Reviews', () => {

    let userId;
    let token;

    before(async () => {
        // Initialize the test database
        await initializeTestDb();

        // Create a test user
        const email = 'review@foo.com';
        const password = 'review1234';
        userId = await insertTestUser(email, password);

        token = getToken(email, userId);
    });


    let movieReviewId;
    let tvReviewId;

    after(async () => {
        // Delete the movie and TV reviews after tests
        if (movieReviewId) {
            await pool.query('DELETE FROM reviews WHERE id = $1', [movieReviewId]);
        }
        if (tvReviewId) {
            await pool.query('DELETE FROM reviews WHERE id = $1', [tvReviewId]);
        }

        // Optionally, you can delete the test user after tests
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    });

    it('should add a review for a movie', async () => {
        const movieTestReview = {
            movieId: "2",
            rating: "5",
            comment: "Test review for movie!",
            type: "movie",
        };

        const response = await fetch(base_url + '/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(movieTestReview),
        });

        const data = await response.json();
        console.log('Movie Review Response:', data);

        // Assertions
        expect(response.status).to.equal(201); // 201 for created
        expect(data).to.include.all.keys('id', 'movies_id', 'rating', 'comment', 'created_at', 'type');
        expect(data.type).to.equal('movie');
        movieReviewId = data.id; // Save the movie review ID
    });

    it('should add a review for a TV show', async () => {

        const tvSeriesTestReview = {
            movieId: "3",
            rating: "5",
            comment: "Test review for TV show!",
            type: "tv",
        };

        const response = await fetch(base_url + '/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(tvSeriesTestReview),
        });

        const data = await response.json();
        console.log('TV Show Review Response:', data);

        // Assertions
        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys('id', 'movies_id', 'rating', 'comment', 'created_at', 'type');
        expect(data.type).to.equal('tv');
        tvReviewId = data.id; // Save the TV review ID
    });

    it('should get all reviews for a movie', async () => {
        const response = await fetch(base_url + '/api/reviews/movie/2');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'movies_id', 'email', 'rating', 'comment', 'created_at', 'type');
    });

    it('should get all reviews for a TV show', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/3')
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'movies_id', 'email', 'rating', 'comment', 'created_at', 'type');
    });

    it('should return an empty array if movie has no reviews', async () => {
        const response = await fetch(base_url + '/api/reviews/movie/6');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should return an empty array if tv show has no reviews', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/6');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should return an error if the movieId is not valid', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/x');
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data).to.be.an('object').that.has.property('error', 'Missing or invalid movieId.');
    });

    it('should return an error if the type is not valid', async () => {
        const response = await fetch(base_url + '/api/reviews/x/1');
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data).to.be.an('object').that.has.property('error', 'Missing or invalid contentType. Expected "movie" or "tv".');
    });

});

// Unit tests to get reviews for movies and TV shows

describe('GET reviews for a spesific movie or TV', () => {

    it('should get reviews for a spesific movie (id=1)', async () => {
        const response = await fetch(base_url + '/api/reviews/movie/1');
        const data = await response.json();

        // Assertions
        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'movies_id', 'email', 'rating', 'comment', 'created_at', 'type');
    });

    it('should get reviews for a spesific mtv show (id=1)', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/1');
        const data = await response.json();

        // Assertions
        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'movies_id', 'email', 'rating', 'comment', 'created_at', 'type');
    });

    it('should return an empty array for movies with no reviews', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/6');
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should return an empty array for tv shows with no reviews', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/6');
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should return an error if a the movieId is not valid', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/x');
        const data = await response.json();
        expect(response.status).to.equal(400);
        expect(data).to.be.an('object').that.has.property('error', 'Missing or invalid movieId.');
    });

    it('should return an error if a the type is not valid', async () => {
        const response = await fetch(base_url + '/api/reviews/x/1');
        const data = await response.json();
        expect(response.status).to.equal(400);
        expect(data).to.be.an('object').that.has.property('error', 'Missing or invalid contentType. Expected "movie" or "tv".');
    });

});