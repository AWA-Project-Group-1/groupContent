// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetails from './screens/MovieDetailsPage';
import AllMovies from './screens/AllMovies';
import HomePage from './screens/HomePage';
import './App.css';


// heyanwen
import TVSerial from "./screens/TVSerial.js"
import MovieDetail from "./screens/MovieDetail.js"
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowTime from "./screens/ShowTime.js"
import { TVSeriesProvider } from './context/TVSeriesProvider';

const App = () => (
  <TVSeriesProvider>
      <Router>
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/movie/:id" Component={MovieDetails} />
          <Route path="/movies/top-rated" element={<AllMovies type="top-rated" />} />
          <Route path="/movies/upcoming" element={<AllMovies type="upcoming" />} />
          <Route path='/tvserial' element={<TVSerial />} />
          <Route path="/detail/:movieId" element={<MovieDetail />} /> 
          <Route path="/showtime" element={<ShowTime />} /> 
        </Routes>
      </Router>
  </TVSeriesProvider>
  
);

export default App;
