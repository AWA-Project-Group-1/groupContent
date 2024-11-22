import axios from 'axios';

const serverUrl = 'http://localhost:3001/api/favorites';

export async function addToFavorites(movieId, type) {
  return axios.post(`${serverUrl}/add`, { movieId, type });
}

export async function removeFromFavorites(movieId) {
    return axios.delete(`${serverUrl}/remove`, { data: { movieId } });
    }

export async function fetchFavorites() {
  return axios.get(`${serverUrl}/user/945`);
}