import React, { useState, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure Bootstrap Icons are imported

const ReviewList = ({ reviews }) => {
    const [sortOption, setSortOption] = useState('');

    // Calculate the total reviews and average rating
    const totalReviews = reviews.length;
    const averageRating = useMemo(() => {
        if (totalReviews === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / totalReviews).toFixed(1); // Round to 1 decimal place
    }, [reviews]);

    // Count the number of reviews per rating value (1-5)
    const ratingCounts = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach((review) => {
            if (review.rating >= 1 && review.rating <= 5) {
                counts[review.rating - 1]++;
            }
        });
        return counts;
    }, [reviews]);

    const renderStars = (rating) => {
        return (
            <>
                {Array.from({ length: 5 }, (_, index) => (
                    <i
                        key={index}
                        className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'}`}
                        style={{
                            color: index < rating ? 'gold' : 'gray',
                            fontSize: '1.3rem',
                        }}
                    ></i>
                ))}
            </>
        );
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const sortReviews = (reviews) => {
        if (sortOption === 'rating-high-to-low') {
            return [...reviews].sort((a, b) => b.rating - a.rating);
        }
        if (sortOption === 'rating-low-to-high') {
            return [...reviews].sort((a, b) => a.rating - b.rating);
        }
        if (sortOption === 'date-new-to-old') {
            return [...reviews].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
        }
        if (sortOption === 'date-old-to-new') {
            return [...reviews].sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
        }
        return reviews;
    };

    const sortedReviews = sortReviews(reviews);

    const interpolateColor = (startColor, endColor, factor) => {
        const [r1, g1, b1] = startColor;
        const [r2, g2, b2] = endColor;
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        return `rgb(${r}, ${g}, ${b})`;
    };

    const getColorFromRating = (rating) => {
        const purple = [48, 3, 54]; // RGB for purple
        const red = [242, 48, 48];   // RGB for red
        const factor = (rating - 1) / 4; // Calculate interpolation factor (0 to 1)
        return interpolateColor(purple, red, factor);
    };

    return (
        <div className="container py-5">
            <h3 className="d-flex mb-4">Reviews</h3>

            {/* If no reviews are available */}
            {totalReviews === 0 ? (
                <div className="text-center text-muted py-5">
                    <i className="bi bi-star" style={{ fontSize: '2rem', color: 'gray' }}></i>
                    <h5>No Reviews Yet</h5>
                    <p>Be the first to share your thoughts and help others!</p>
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-start mb-4">
                        {/* Left Column: Average Rating */}
                        <div className="left-column">
                            <span style={{ fontSize: '2.8rem', fontWeight: 'bold' }}>{averageRating}</span>
                        </div>

                        {/* Right Column: Stars and Review Count */}
                        <div className="right-column" style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {/* First Line: Stars */}
                            <div>
                                {renderStars(Math.round(averageRating))}
                            </div>

                            {/* Second Line: Reviews Text */}
                            <div>
                                <span>from {totalReviews} reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="mb-4">
                        {ratingCounts.map((count, index) => (
                            <div key={index} className="mb-3 d-flex align-items-center">
                                <div className="d-flex align-items-center" style={{ width: '50px' }}>
                                    <span style={{ marginRight: '10px' }}>{index + 1}</span>
                                    {/* Only the filled star and the number */}
                                    <i
                                        className="bi bi-star-fill"
                                        style={{
                                            color: 'gold',
                                            fontSize: '1.3rem',
                                        }}
                                    ></i>
                                </div>
                                <div
                                    style={{
                                        width: `${(count / totalReviews) * 100}%`,
                                        height: '10px',
                                        backgroundColor: getColorFromRating(index + 1),
                                        borderRadius: '5px',
                                        marginLeft: '10px',
                                    }}
                                ></div>
                                <span className="ml-2" style={{ marginLeft: '10px' }}>{count} </span>
                            </div>
                        ))}
                    </div>

                    {/* Sorting Filter */}
                    <div className="mb-3 text-end">
                        <label className="mr-2">Sort reviews by:</label>
                        <select
                            className="form-select form-select-sm d-inline-block"
                            style={{ width: '150px' }}
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">Options</option>
                            <option value="rating-high-to-low">Rating: High to Low</option>
                            <option value="rating-low-to-high">Rating: Low to High</option>
                            <option value="date-new-to-old">Date: New to Old</option>
                            <option value="date-old-to-new">Date: Old to New</option>
                        </select>
                    </div>

                    {/* Reviews */}
                    <div>
                        {sortedReviews.map((review, index) => (
                            <div
                                key={review.email || index}
                                className="card mb-4 shadow-sm"
                                style={{
                                    borderRadius: '10px',
                                    border: '1px solid #d3d3d3',  // Gray border
                                }}
                            >
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-3">
                                        <span><b>{review.email}</b></span>
                                        <span className="text-muted">{formatTimestamp(review.created_at)}</span>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex mb-2" style={{ marginLeft: '10px' }}>
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="d-flex mb-2" style={{ marginLeft: '10px' }}>
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ReviewList;
