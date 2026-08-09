import axiosClient from './axiosClient';

/** Add a semester, subject, question page, questions, and answers. Admin only. */
export const enterPage = (payload) => axiosClient.post('/admintool/enter_page/', payload);

export const fetchAdminPage = (year, subjectId) =>
  axiosClient.get(`/admintool/view_page/${year}/${subjectId}/`);

export const updateAdminPage = (year, subjectId, payload) =>
  axiosClient.put(`/admintool/update_page/${year}/${subjectId}/`, payload);

export const deleteAdminPage = (year, subjectId) =>
  axiosClient.delete(`/admintool/delete_page/${year}/${subjectId}/`);

export const fetchAdminSemesters = () => axiosClient.get('/admintool/semesters/');

export const fetchAdminSubjects = (semesterId) =>
  axiosClient.get(`/admintool/subjects/${semesterId}/`);
