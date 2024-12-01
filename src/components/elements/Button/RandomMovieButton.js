// RandomMovieButton.js
import React from 'react';
import classes from './RandomMovieButton.module.css'

const RandomMovieButton = ({ onClick, loading, disabled }) => {
    return (
        <div>
            <button onClick={onClick} disabled={disabled} className={classes.RandomButton} >
                {loading ? 'Loading...' : 'Pick a Movie!'}
            </button>
        </div>

    );
};

export default RandomMovieButton;
