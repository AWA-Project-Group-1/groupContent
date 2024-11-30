import React from 'react';
import { Link } from 'react-router-dom';
import BearCarousel, { BearSlideCard } from 'bear-react-carousel';
import 'bear-react-carousel/dist/index.css';  // Importing the carousel's default styles
import './carouselStyles.css'; // Import custom CSS file for additional styles

// Photo component to display images
const Photo = ({ src, alt }) => (
    <img
        src={src}
        alt={alt}
        className="carousel-photo" // Apply class for styling
    />
);

const CarouselSlide = ({ src, title, movieId, release_date, averageRating, reviewCount }) => {
    const releaseDate = new Date(release_date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedReleaseDate = `${months[releaseDate.getMonth()]} ${releaseDate.getDate()}, ${releaseDate.getFullYear()}`;

    const renderStars = (average) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (average >= i) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>); // Filled star
            } else if (average >= i - 0.5) {
                stars.push(<i key={i} className="bi bi-star-half text-warning"></i>); // Half-filled star
            } else {
                stars.push(<i key={i} className="bi bi-star text-warning"></i>); // Empty star
            }
        }
        return stars;
    };

    return (
        <BearSlideCard>
            <Link to={`/detail/movie/${movieId}`} className="carousel-link">
                <div className="carousel-card">
                    <Photo src={src} alt={title} />
                    <h3 className="carousel-title">{title}</h3>
                    <p className="carousel-release-date">{formattedReleaseDate}</p>
                    <div className="carousel-rating">
                        {renderStars(averageRating)} {/* Display stars here */}
                        <span className="carousel-review-count">({reviewCount})</span> {/* Display review count inside parentheses */}
                    </div>
                </div>
            </Link>
        </BearSlideCard>
    );
};


// CustomCarousel component to render the carousel
const CustomCarousel = ({ data, gridTheme }) => {
    const slideData = data.map((row) => (
        <CarouselSlide
            key={row.id}
            src={row.src}
            title={row.title}
            movieId={row.id}
            release_date={row.release_date}
            averageRating={row.averageRating}  // Passing the average rating
            reviewCount={row.reviewCount}  // Passing the review count
        />
    ));

    return (
        <BearCarousel
            data={slideData}
            height="auto"
            slidesPerView={1}
            isEnableNavButton
            isEnablePagination
            isEnableLoop={false}  // Disable looping after the last slide
            breakpoints={{
                [gridTheme.md]: {
                    slidesPerView: 5,
                    isEnablePagination: false,
                },
            }}
        />
    );
};

export default CustomCarousel;
