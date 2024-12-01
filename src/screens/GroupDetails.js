import React, { useState, useEffect } from 'react';
import './GroupDetails.css';
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';
import useUser from '../context/useUser.js';
import { useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';

const SearchMovies = ({ groupId }) => {
    const { user } = useUser(); // Sử dụng context để lấy user
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [query, setQuery] = useState('Avatar');
    const [selectedMovies, setSelectedMovies] = useState({});

    const fetchMovies = useCallback(() => {
        fetch(
            `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
            {
                headers: {
                    Authorization:
                        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjZhY2ZhNDZjMGExOWM5OGUwMjQwYzdjY2M3YTRlNiIsIm5iZiI6MTczMTk0OTYyMS4zMzQ1MTM0LCJzdWIiOiI2NzM0OTcwYjMwZWUxMGFhMWI5YjNiODkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ibcOCPjPpcJ_lk7zJ82exhSIYBV6iJSvtAO9ibqMBBM',
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((response) => response.json())
            .then((json) => {
                setMovies(json.results);
                setPageCount(json.total_pages);
            })
            .catch((err) => console.log(err));
    }, [query, page]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleCheckboxChange = (movieId) => {
        setSelectedMovies((prev) => ({
            ...prev,
            [movieId]: !prev[movieId],
        }));
    };

    const handleSubmit = () => {
        if (!user?.token) {
            alert('User is not authenticated!');
            return;
          }
      
        const selectedMovieData = movies
            .filter((movie) => selectedMovies[movie.id])
            .map((movie) => ({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                }));

        const headers = {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${user.token}`}};
        console.log('Group ID:', groupId);
        console.log('User context:', user);
        console.log('Movies:', selectedMovieData);
        console.log('POST URL:',`/content/${groupId}/content`);
        axios.post(`/content/${groupId}/content`, {
                userId: user.id,
                movies: selectedMovieData,
                showTimes: [], 
            }, headers)
            
            .then((response) => {
                console.log('Movies added:', response.data);
                alert('Movies added successfully!');
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || 'An error occurred!';
                alert(errorMessage);
                console.error(error);
            });
    };

    return (
        <div>
            <h4>Movie Search</h4>
            <div>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies..."
                />
                <button onClick={fetchMovies} type="button">
                    Search
                </button>
            </div>

            <div className="movie-list-container">
                {movies &&
                    movies.map((movie) => (
                        <div className="movie-item" key={movie.id}>
                            <img
                                className="movie-poster"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <div className="movie-title">{movie.title}</div>
                            <input
                                type="checkbox"
                                checked={!!selectedMovies[movie.id]}
                                onChange={() => handleCheckboxChange(movie.id)}
                                className="movie-checkbox"
                            />
                        </div>
                    ))}
            </div>

            <ReactPaginate
                breakLabel={'...'}
                nextLabel={'>'}
                onPageChange={(e) => setPage(e.selected + 1)}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel={'<'}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            <button onClick={handleSubmit} type="button">
                Submit Selected Movies to Group
            </button>
        </div>
    );
};

const ShowTime = ({ groupId }) => {
    const { user } = useUser(); // Sử dụng context để lấy thông tin người dùng
    const [showTime, setShowTime] = useState([]);
    const [selectedShowTimes, setSelectedShowTimes] = useState({}); // Lưu trạng thái checkbox

    // URL API cho Showtime
    const url = `https://www.finnkino.fi/xml/Schedule/`;

    // Lấy dữ liệu showtime từ API
    useEffect(() => {
        fetch(url)
            .then((res) => res.text())
            .then((data) => {
                const parser = new DOMParser();
                const dataDocument = parser.parseFromString(data, 'application/xml');

                const showstime = Array.from(
                    dataDocument.getElementsByTagName('Show')
                ).map((show) => ({
                    id: show.getElementsByTagName('ID')[0]?.textContent, // ID duy nhất
                    title: show.getElementsByTagName('Title')[0]?.textContent,
                    showStart: show.getElementsByTagName('dttmShowStart')[0]?.textContent,
                    showEnd: show.getElementsByTagName('dttmShowEnd')[0]?.textContent,
                    image: show.getElementsByTagName('EventMediumImagePortrait')[0]?.textContent,
                }));

                setShowTime(showstime);
            })
            .catch((err) => {
                console.error('Error fetching showtime:', err);
            });
    }, [url]);

    // Thay đổi trạng thái checkbox khi người dùng chọn showtime
    const handleCheckboxChangeShowTimes = (showId) => {
        setSelectedShowTimes((prev) => ({
            ...prev,
            [showId]: !prev[showId], // Toggle trạng thái checkbox
        }));
    };

    // Xử lý khi submit các showtime được chọn
    const handleSubmitShowTimes = () => {
        
        //const selected = showTime.filter((item) => selectedShowTimes[item.id]);
        const selectedShowTimesData = showTime
        ?.filter((show) => selectedShowTimes[show.id]) // Chỉ lấy những showtime được chọn
        .map((show) => ({
            id: show.id,
            title: show.title,
            showStart: new Date(show.showStart).toISOString().replace('T', ' ').slice(0, 23),
            showEnd: new Date(show.showEnd).toISOString().replace('T', ' ').slice(0, 23),
            image: show.image,
        }));

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`, // Lấy token từ context
            },
        };
        
        console.log('ShowTimes:', selectedShowTimesData);

        axios
            .post(`/content/${groupId}/content`, {
                userId: user.id, // ID của người dùng từ context
                movies: [], // Không gửi phim vì chỉ có showtimes
                showTimes: selectedShowTimesData, // Danh sách các showtime được chọn
            }, headers)
        
            .then((response) => {
                console.log('ShowTimes added:', response.data);
                alert('ShowTimes added successfully!');
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || 'An error occurred!';
                alert(errorMessage);
                console.error(error);
            });
    };

    return (
        <div>
            <h4>Showtime</h4>
            <div className="movie-list-container">
                {showTime.map((item, index) => (
                    <div key={index} className="show-time-container">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="show-image"
                        />
                        <div className="movie-title">{item.title}</div>
                        <div className="show-time">
                            Show time: {item.showStart} to {item.showEnd}
                        </div>

                        <input
                            type="checkbox"
                            checked={!!selectedShowTimes[item.id]}
                            onChange={() => handleCheckboxChangeShowTimes(item.id)}
                            className="showtime-checkbox"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmitShowTimes}
                type="button"
                style={{ marginTop: '20px' }}
            >
                Submit Selected Showtimes to Group
            </button>
        </div>
    );
};

/*
const useUser = () => {
    return { loggedInUserId: 1 }; // Thay giá trị thực tế nếu cần
};
*/
const MoviePage = () => {
    const { id: groupId } = useParams(); // Lấy groupId từ URL
    const { user } = useUser(); // Lấy thông tin user từ context

    if (!user) {
        return <div>User is not logged in!</div>;
    }

    return (
        <div>
            <h2>Add Movies and Showtimes to group {groupId}</h2>
            <SearchMovies groupId={groupId} />
            <hr />
            <ShowTime groupId={groupId} />
            <hr />
        </div>
    );
};
export default MoviePage;