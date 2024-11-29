import React, { useState, useEffect } from 'react';

const Slideshow = ({ images }) => {
    const [currentImage, setCurrentImage] = useState(0);

    // Switch images every 3 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 3000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image.src}
                    alt={`Slideshow Image ${index + 1}`}
                    style={{
                        width: '100%',
                        height: '600px', // Set your desired height
                        objectFit: 'cover', // Ensures the image is cropped
                        objectPosition: image.position, // Adjust the percentage values to your desired position
                        opacity: index === currentImage ? 1 : 0, // Show the current image
                        transition: 'opacity 1s ease-in-out', // Smooth transition for fade-in/out
                        filter: 'blur(5px)', // Add a blur effect to all images
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: index === currentImage ? 1 : 0, // Ensures only the active image is visible
                    }}
                />
            ))}
        </div>
    );
};

export default Slideshow;
