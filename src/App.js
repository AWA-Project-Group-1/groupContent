// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import MovieDetails from './screens/MovieDetailsPage';
// import AllMovies from './screens/AllMovies';
import HomePage from './screens/HomePage';
import './App.css';


// heyanwen
import TVSerial from "./screens/TVSerial.js"
// import TVDetail from "./screens/TVDetail.js"
import {MoiveTVSerialProvider} from "./context/MoiveTVSerialProvider"
import MoviePage from "./screens/MoviePage.js"
import MovieDetail from "./screens/MovieDetail.js";
import TVDetail from './screens/TVDetail.js';
import HeroSection from './components/HeroSection.js';
import {TVGenreProvider} from "./context/TVGenreProvider.js"
import { MovieGenreProvider} from "./context/MovieGenreProvider.js"
import Profile from './screens/ProfilePage.js';
import SharedFavoritesPage from './screens/SharedFavoritesPage.js';
// import TVGenreProvider from "./context/TVGenreProvider.js"

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowTime from "./screens/ShowTime.js"
// import { TVSeriesProvider } from './context/TVSeriesProvider';

const App = () => (
  <MoiveTVSerialProvider>
    <TVGenreProvider>
      <MovieGenreProvider>

      <Router>
          <Routes>
            <Route path="/" Component={HomePage} />
            {/* <Route path="/movie/:id" Component={MovieDetails} /> */}
            {/* <Route path="/movies/top-rated" element={<AllMovies type="top-rated" />} />
            <Route path="/movies/upcoming" element={<AllMovies type="upcoming" />} /> */}
            <Route path='/tvserial' element={<TVSerial />} />
            <Route path='/movies' element={<MoviePage/>} />
            {/* <Route path="/detail/:movieId" element={<TVDetail />} />  */}
            <Route path="/showtime" element={<ShowTime />} /> 
            <Route path="/detail/movie/:id" element={<MovieDetail />} />
            <Route path="/detail/tv/:id" element={<TVDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shared-favorites/:userId" element={<SharedFavoritesPage />} />
           
            <Route path="/:tvormovie" element={<HeroSection />} />


          </Routes>
        </Router>

        </MovieGenreProvider>         
      </TVGenreProvider>
        
  </MoiveTVSerialProvider>
  
  
);
      
export default App;
