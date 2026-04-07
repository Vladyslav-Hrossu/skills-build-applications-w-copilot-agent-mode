import axios from 'axios';

// Detect if we're in a GitHub Codespace environment
const isCodespace = window.location.hostname.includes('.app.github.dev');
const BASE_URL = isCodespace
  ? `https://${window.location.hostname.split('-')[0]}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getUsers = () => api.get('/users/');
export const getTeams = () => api.get('/teams/');
export const getActivities = () => api.get('/activities/');
export const getLeaderboard = () => api.get('/leaderboard/');
export const getWorkouts = () => api.get('/workouts/');

export default api;

