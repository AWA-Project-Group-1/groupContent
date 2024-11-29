import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
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

const CarouselSlide = ({ src, title, movieId, release_date }) => {
    const releaseDate = new Date(release_date);

    // Format the date as 'year-month-day'
    const formattedReleaseDate = releaseDate.toISOString().split('T')[0];

    return (
        <BearSlideCard>
            <Link to={`/detail/movie/${movieId}`} className="carousel-link">  {/* Updated path */}
                <div className="carousel-card">
                    <Photo src={src} alt={title} />
                    <h3 className="carousel-title">{title}</h3>
                    <p className="carousel-release-date">{formattedReleaseDate}</p>
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
