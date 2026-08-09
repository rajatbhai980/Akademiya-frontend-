import axiosClient from './axiosClient';
import { deleteCookie } from './axiosClient';

/** Initialize CSRF protection. Must be called before any authenticated/state-changing call. */
export const fetchCsrfCookie = () => axiosClient.get('/users/csrf/');

/** Request an OTP be emailed to the given address. */
export const requestOtp = (email) => axiosClient.post('/users/otp_request/', { email });

/** Verify OTP and log the user in. */
export const verifyOtp = (email, otp) =>
  axiosClient.post('/users/otp_verification/', { email, otp });

/** Get the currently authenticated user (if any). */
export const fetchCurrentUser = () => axiosClient.get('/users/me/');

/** Log out and clear the session. */
export const logout = () => {
  deleteCookie('csrftoken'); // clear CSRF cookie to prevent accidental reuse
  axiosClient.post('/users/logout/')
};
