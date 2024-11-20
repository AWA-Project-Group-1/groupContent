// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './screens/HomePage';
import './App.css';


// heyanwen
import TVSerial from "./screens/TVSerial.js"
// import TVDetail from "./screens/TVDetail.js"
import { MoiveTVSerialProvider } from "./context/MoiveTVSerialProvider"
import MoviePage from "./screens/MoviePage.js"
import MovieDetail from "./screens/MovieDetail.js";
import TVDetail from './screens/TVDetail.js';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowTime from "./screens/ShowTime.js"
// import { TVSeriesProvider } from './context/TVSeriesProvider';

const App = () => (
  <MoiveTVSerialProvider>

    <Router>
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path='/movies' element={<MoviePage />} />
        <Route path='/tvserial' element={<TVSerial />} />
        <Route path='/movies' element={<MoviePage />} />
        {/* <Route path="/detail/:movieId" element={<TVDetail />} />  */}
        <Route path="/showtime" element={<ShowTime />} />
        <Route path="/detail/movie/:id" element={<MovieDetail />} />
        <Route path="/detail/tv/:id" element={<TVDetail />} />
      </Routes>
    </Router>

  </MoiveTVSerialProvider>


);

export default App;
