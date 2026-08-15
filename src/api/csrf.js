let csrfToken = null;

export const setCsrfToken = (token) => {
  csrfToken = token;
};

export const getCsrfToken = () => csrfToken;

export const fetchCsrfToken = async (axiosInstance) => {
  const res = await axiosInstance.get('/users/csrf/');
  csrfToken = res.data.csrfToken;
  return csrfToken;
};