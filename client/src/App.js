import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import RegisterPage from './scenes/adminPage/registerPage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import AdminPage from './scenes/adminPage';
import RequireAdminAuth from './features/auth/RequireAuth';
import DashboardPage from './scenes/adminPage/dashboardPage';
import LocationsPage from './scenes/locationsPage';
import AdminLocationPage from './scenes/adminPage/locationPage';
import LocationPage from './scenes/locationPage';
import NewLocationPage from './scenes/adminPage/locationPage/newLocationPage';
import TasksPage from './scenes/tasksPage';
import RequireTaskAuth from './features/auth/RequireTaskAuth';
import { HelmetProvider } from 'react-helmet-async';




function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  const helmetContext = {};

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <HelmetProvider context={helmetContext}>
          <CssBaseline />
            <Routes>
              <Route 
                path="/" 
                element={isAuth ? <HomePage /> : <LoginPage />} 
              />
              <Route 
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/locations"
                element={isAuth ? <LocationsPage /> : <Navigate to="/" />}
              />
              <Route
                path="/locations/:id"
                element={isAuth ? <LocationPage /> : <Navigate to="/" />}
              />

              <Route 
                path="/tasks"
                element={isAuth ? <TasksPage /> : <Navigate to="/" />}
              />
              <Route
                path="/task/:id"
                element={isAuth ? <RequireTaskAuth /> : <Navigate to="/" />}
              />
              
              <Route element={isAuth ? <RequireAdminAuth allowedRoles={'admin'} /> : <Navigate to="/"/>}>
                <Route
                  path="/admin"
                  element={<AdminPage />}
                >
                  <Route 
                    path="dashboard" 
                    element={<DashboardPage />}
                  />
                  {/* USERS */}
                  <Route 
                    path="register" 
                    element={<RegisterPage />}
                  />
                  {/* LOCATIONS */}
                  <Route
                    path="locations"
                    element={<AdminLocationPage />}
                  />
                  <Route 
                    path="locations/new"
                    element={<NewLocationPage />}
                  />
                </Route>
              </Route>
              
            </Routes>
          </HelmetProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
