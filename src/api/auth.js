import axiosClient from './axiosClient';
import { fetchCsrfToken } from './csrf';

/** Initialize CSRF protection. Must be called before any authenticated/state-changing call. */
export const fetchCsrfCookie = () => axiosClient.get('/users/csrf/');

/** Request an OTP be emailed to the given address. */
export const requestOtp = (email) => axiosClient.post('/users/otp_request/', { email });

/** Verify OTP and log the user in. */
export const verifyOtp = async (email, otp) => {
  const res = await axiosClient.post('/users/otp_verification/', { email, otp });
  await fetchCsrfToken(axiosClient); // refresh token post-login
  return res;
};

/** Get the currently authenticated user (if any). */
export const fetchCurrentUser = () => axiosClient.get('/users/me/');

/** Log out and clear the session. */
export const logout = async () => {
  await axiosClient.post('/users/logout/');
  await fetchCsrfToken(axiosClient); // refresh token post-logout
};