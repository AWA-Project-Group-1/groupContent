// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetails from './secreens/MovieDetailsPage';
import AllMovies from './secreens/AllMovies';
import HomePage from './secreens/HomePage';
import './App.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" Component={HomePage} />
      <Route path="/movie/:id" Component={MovieDetails} />
      <Route path="/movies/top-rated" element={<AllMovies type="top-rated" />} />
      <Route path="/movies/upcoming" element={<AllMovies type="upcoming" />} />
    </Routes>
  </Router>
);

export default App;
