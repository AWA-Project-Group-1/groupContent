import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation'
import HeroSection from '../components/HeroSection'
import Footer from "../components/Footer"
import styles from "./ShowTime.module.css" // Assuming you have styles for your components


const ShowTime = () => {
    const [showTime, setShowTime] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const url = `https://www.finnkino.fi/xml/Schedule/`;

    const [area, setArea] = useState('1029');
    const [movie, setMovie] = useState('');
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    const theatreAreas = [
        { id: '1029', name: 'Choose area/theater' },
        { id: '1014', name: 'Pääkaupunkiseutu' },
        // More areas
    ];

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return date.toLocaleString('en-US', options);
    };

    const generateNext7Days = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            const formattedDate = nextDay.toISOString().split('T')[0];
            dates.push({ label: formatDate(formattedDate), value: formattedDate });
        }
        return dates;
    };

    const fetchMovies = async (selectedArea) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://www.finnkino.fi/xml/Schedule?area=${selectedArea}`);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'application/xml');
            const shows = xmlDoc.getElementsByTagName('Show');
            const movieList = Array.from(shows).map(show => show.getElementsByTagName('Title')[0]?.textContent);
            setMovies([...new Set(movieList)]);
            setMovie(movieList[0] || '');
        } catch (error) {
            setError('Failed to fetch movies');
        } finally {
            setLoading(false);
        }
    };

    const fetchShowtimes = async (selectedArea, selectedMovie, selectedDate) => {
        setLoading(true);
        try {
            const formattedDate = selectedDate.split('-').reverse().join('.');
            const response = await axios.get(`https://www.finnkino.fi/xml/Schedule?area=${selectedArea}&dt=${formattedDate}&nrOfDays=1`);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'application/xml');
            const shows = xmlDoc.getElementsByTagName('Show');
            const filteredShowtimes = Array.from(shows)
                .filter(show => {
                    const time = show.getElementsByTagName('dttmShowStart')[0]?.textContent;
                    if (time) {
                        const date = time.split('T')[0];
                        return show.getElementsByTagName('Title')[0]?.textContent === selectedMovie && date === selectedDate;
                    }
                    return false;
                })
                .map(show => {
                    const time = show.getElementsByTagName('dttmShowStart')[0]?.textContent;
                    const showtime = time ? time.split('T')[1] : 'N/A';
                    return {
                        title: show.getElementsByTagName('Title')[0]?.textContent,
                        time: showtime,
                        date: time ? time.split('T')[0] : 'N/A',
                    };
                });

            setShowtimes(filteredShowtimes);
        } catch (error) {
            setError('Failed to fetch showtimes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (area !== '1029') {
            fetchMovies(area);
        }
    }, [area]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (area !== '1029' && movie && selectedDate) {
            fetchShowtimes(area, movie, selectedDate);
        } else {
            setError('Please select a movie, area, and date.');
        }
    };

    return (
        <div className={styles['all-container']}>
            <div className={styles['navigation-hero-container']}>
                <Navigation />
                <HeroSection type="movie" />
            </div>

            <div className={styles['search-showtime-container']}>
                <div className={styles['search-container']}>
                    <label htmlFor="area">Select a Theatre Area:</label>
                    <select id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                        {theatreAreas.map((areaOption) => (
                            <option key={areaOption.id} value={areaOption.id}>
                                {areaOption.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="movie">Select a Movie:</label>
                    <select id="movie" value={movie} onChange={(e) => setMovie(e.target.value)} disabled={area === '1029'}>
                        <option value="">Select a movie</option>
                        {movies.map((movie, index) => (
                            <option key={index} value={movie}>{movie}</option>
                        ))}
                    </select>

                    <label htmlFor="date">Select a Date:</label>
                    <select id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} disabled={area === '1029' || !movie}>
                        <option value="">Select a date</option>
                        {generateNext7Days().map((dateOption) => (
                            <option key={dateOption.value} value={dateOption.value}>
                                {dateOption.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles['fetch-button-container']}>
                    <button onClick={handleSubmit} disabled={loading || area === '1029' || !movie || !selectedDate}>
                        Fetch Showtimes
                    </button>
                </div>
            </div>

            <div className={styles['show-today']}>
                <h2>{showtimes.length === 0 ? 'Today\'s Showtimes' : 'Searched Movie Showtimes'}</h2>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <ul>
                    {showtimes.length === 0 && !loading ? (
                        showTime.slice(0, 10).map((show, index) => (
                            <li key={index}>{show.title} - {show.showStart} - {show.theatreID}</li>
                        ))
                    ) : (
                        showtimes.map((showtime, index) => (
                            <li key={index}>{showtime.title} - {showtime.time} - {showtime.date}</li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ShowTime;
