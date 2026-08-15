import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';
import { fetchCsrfToken } from './api/csrf';
import axiosClient from './api/axiosClient';

// Keep MUI (used for notifications) visually aligned with the CSS theme tokens.
const muiTheme = createTheme({
  palette: {
    primary: { main: '#1f7a4d' },
    error: { main: '#c53d3d' },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  shape: { borderRadius: 10 },
});

export default function App() {
  useEffect(() => {
    fetchCsrfToken(axiosClient).catch(() => {});
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
