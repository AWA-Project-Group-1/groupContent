import React from 'react';
import './styles.css';

const GenreSelector = ({ genres, selectedGenre, onGenreChange }) => {
    return (
        <div className="select-container">
            <select onChange={(e) => onGenreChange(e.target.value)} value={selectedGenre}>
                <option value="" disabled>
                    Select Genre
                </option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default GenreSelector;
