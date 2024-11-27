import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from "../components/Navigation"
import sytles from "./TVDetail.module.css"
import HeroSection from '../components/HeroSection';
import Footer from "../components/Footer"
// import movieapplogo1 from "../assets/images/movieapplogo1.jpg"
import movieapplogo1 from "../assets/images/movieapplogo1.jpg"

import { fetchReviews, submitReview, deleteReview } from '../api/reviews.js'
import SubmitReview from '../components/reviews/SubmitReview'
import ReviewList from '../components/reviews/ReviewList';

const MovieDetail = () => {
    const { id } = useParams();
    const [movieDetail, setMovieDetail] = useState(null);
    const [tvSerialCredit, setTvSerialCredit] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [successMessage, setSuccessMessage] = useState(""); // state for success message

    const apiKey = '814d8d230ad1294ccbdbb69cccb0bc29';  // API key
    const authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTRkOGQyMzBhZDEyOTRjY2JkYmI2OWNjY2IwYmMyOSIsIm5iZiI6MTczMTQwMTUxNC4zNzIzMjk1LCJzdWIiOiI2NzMzMTViNjI5YWE4ZmYyNDRjMGUzODEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0qof6UxtmX1ZydXb7hPBwnROQT3zdyKAbEXhXQ0OO4A';
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;  // API endpoint to fetch movie details
    const urlforcredit = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`;


    // Fetch movie details based on movieId
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: authorization,
            },
        };

        fetch(url, options)
            .then((res) => res.json()) // Parse the JSON response
            .then((data) => {
                setMovieDetail(data); // Set movie details to state
                console.log(`This is the detail: ${data}`)
                console.log(data.seasons)
            })
            .catch((err) => {
                console.error('Error fetching movie details:', err); // Handle errors
            });
    }, [id]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: authorization,
            },
        };
        fetch(urlforcredit, options)
            .then((res) => res.json()) // Parse the JSON response
            .then((data) => {
                setTvSerialCredit(data); // Set movie details to state
                // console.log(data)
                console.log(`This is cast length: ${data?.cast?.length}`);
                console.log(`First cast member: ${JSON.stringify(data?.cast[0])}`);
                console.log(`This is crew length: ${data?.crew?.length}`);
                console.log(`First crew member: ${JSON.stringify(data?.crew[0])}`);
            })
            .catch((err) => {
                console.error('Error fetching movie details:', err); // Handle errors
            });
    }, []);

    // Fetch reviews
    useEffect(() => {
        const getReviews = async () => {
            try {
                const reviewsData = await fetchReviews(id, "movie");
                setReviews(reviewsData);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        getReviews();
    }, [id, reviews]);

    const handleReviewSubmit = async ({ rating, comment }) => {
        if (!rating || !comment) {
            alert('Please provide a rating and comment');
            return;
        }
        try {
            await submitReview(id, { rating, comment, type: "movie" });
            const updatedReviews = await fetchReviews(id); // Fetch updated reviews
            setReviews(updatedReviews); // Update the state with new reviews
            setSuccessMessage("Your review has been submitted successfully!");
            setTimeout(() => setSuccessMessage(""), 5000); // Auto-clear message
        } catch (error) {
            console.error('Error submitting review:', error);
            setSuccessMessage("Failed to submit review, please try again.");
            setTimeout(() => setSuccessMessage(""), 5000); // Auto-clear message
        }
    };


    // Handle review deletion
    const [deletedId, setDeletedId] = useState(null);

    const handleDeleteReview = (reviewId) => {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        setDeletedId(reviewId); // Track the ID of the deleted review

        // Optionally, delete the review from the backend as well:
        deleteReview(reviewId).then(() => {
            setSuccessMessage("Review deleted successfully!");
        }).catch(err => {
            console.error("Error deleting review:", err);
        });
    };

    useEffect(() => {
        if (deletedId !== null) {
            const deletedReview = reviews.find((review) => review.id === deletedId);

            // Restore the review after 5 seconds
            const timer = setTimeout(() => {
                if (deletedReview) {
                    setReviews((prev) => [...prev, deletedReview]);
                }
                setDeletedId(null);
            }, 5000);
            // Cleanup timer
            return () => clearTimeout(timer);
        }
    }, [deletedId, reviews]);


    if (!movieDetail) {
        return <div>Loading...</div>;  // Show a loading message until data is fetched
    }

    return (
        <div>
            <div className={sytles['nav-hero-container']} >

                <Navigation />
                <HeroSection />

            </div>

            <div className={sytles['movie_framework']}>


                <img
                    src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
                    alt={movieDetail.name} />
                <div className={sytles['information_container']}>
                    <h2>{movieDetail.name}</h2>  {/* Display the movie title */}
                    <p>{movieDetail.overview}</p>  {/* Display movie overview */}
                    <p>Release Date: {movieDetail.first_air_date}</p>  {/* Display release date */}
                    <p>Rating: {movieDetail.vote_average}</p>  {/* Display rating */}
                    <p>Genres: {movieDetail.genres.map(genre => genre.name).join(', ')}</p>  {/* Display genres */}

                </div>


            </div>
            <hr />
            <div className={sytles['cast-container']}>
                <h2>Cast</h2>
                <div className={sytles['cast-scroll-container']}>
                    <div className={sytles['cast-list']}>
                        {tvSerialCredit && tvSerialCredit.cast && tvSerialCredit.cast.length > 0 ? (
                            tvSerialCredit.cast.map((actor) => (
                                <div key={actor.id} className={sytles['cast-item']}>
                                    <p >{actor.name} as {actor.character}</p>
                                    {/* Check if profile_path exists */}
                                    {actor.profile_path ? (
                                        <img
                                            className={sytles['poster-container']}
                                            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                                            alt={`Actor ${actor.name}`}
                                        />
                                    ) : (

                                        <img
                                            className={sytles['poster-container']}
                                            src={movieapplogo1}
                                            alt={`No image available for ${actor.name}`}
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'black' }}>No cast information available.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* 
        <div className={sytles['crew-container']}>
            <h2>Crew</h2>
            <div className={sytles['crew-scroll-container']}>            
                <div className={sytles['crew-list']}>
                    { tvSerialCredit && tvSerialCredit.crew && tvSerialCredit.crew.length > 0 ? (
                        tvSerialCredit.crew.map((crew) => (
                            <div  key={crew.id} className={sytles['crew-item']}>
                                {/* <p key={crew.id} className={sytles['cast-item']}></p> */}
            {/* <p>{crew.name} </p>
                                <p> {crew.job} </p>
                        
                            </div>
                            
                        ))
                    ) : (
                        <p>No cast information available.</p>  
                    )}
                    
                </div>
            </div>

        </div> */}
            <hr />
            <div className={sytles['crew-container']}>
                <h2>Crew</h2>
                <div className={sytles['crew-scroll-container']}>
                    <div className={sytles['crew-list']}>
                        {tvSerialCredit && tvSerialCredit.crew && tvSerialCredit.crew.length > 0 ? (
                            tvSerialCredit.crew.map((crew) => (
                                <div key={crew.id} className={sytles['crew-item']}>
                                    <div><p>{crew.name}</p></div>
                                    <div> <p>{crew.job}</p></div>

                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'black' }}>No cast information available.</p>   // More specific fallback message
                        )}
                    </div>
                </div>
            </div>

            <div >
                <h3>Submit a Review</h3>
                <div className="my-3 p-3 border rounded">
                    <SubmitReview onSubmitReview={handleReviewSubmit} movieId={id} />
                </div>

                {successMessage && (
                    <div className="alert alert-success mt-3">
                        {successMessage}
                    </div>
                )}

            </div>

            <div>
                <ReviewList reviews={reviews} onDeleteReview={handleDeleteReview} />
            </div>


            <Footer />
        </div>
    )

};

export default MovieDetail;