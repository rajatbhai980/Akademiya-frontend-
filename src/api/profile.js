import axiosClient from './axiosClient';

/** Get a scholar profile by id. Auth optional. */
export const fetchProfile = (pk) => axiosClient.get(`/profiles/${pk}/`);

/**
 * Update the authenticated scholar's profile.
 * payload may include: username, photo (File), semester, bio
 * Send as FormData automatically when a photo file is present.
 */
export const updateProfile = (payload) => {
  const hasFile = payload?.photo instanceof File;
  if (hasFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    return axiosClient.put('/profiles/update/', formData);
  }
  return axiosClient.put('/profiles/update/', payload);
};

/**
 * Search scholars by username or bio. Auth optional.
 * Paginated (page size 2 server-side).
 */
export const searchScholars = (q, page = 1) =>
  axiosClient.get('/profiles/search/', { params: { q, page } });