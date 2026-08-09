import axiosClient from './axiosClient';

/** Top 10 scholars ordered by performance level. */
export const fetchLeaderboard = () => axiosClient.get('/leaderboard/');
