import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import RegisterPage from './scenes/adminPage/registerPage';
import AdminPage from './scenes/adminPage';
import RequireAdminAuth from './features/auth/RequireAuth';
import DashboardPage from './scenes/adminPage/dashboardPage';
import LocationsPage from './scenes/locationsPage';
import AdminLocationPage from './scenes/adminPage/locationPage';
import LocationPage from './scenes/locationPage';
import NewLocationPage from './scenes/adminPage/locationPage/newLocationPage';
import TasksPage from './scenes/tasksPage';
import RequireTaskAuth from './features/auth/RequireTaskAuth';
import NotificationPage from './scenes/notificationPage';
import NewTaskPage from './scenes/taskPage/newTaskPage';
import MessagesPage from './scenes/messagesPage';
import { io } from 'socket.io-client';
import MessageWidget from './widgets/MessageWidget';
import Navbar from './scenes/navbar';

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const socket = io(process.env.REACT_APP_DEVELOPMENT_DATABASE_URL);
  const helmetContext = {};

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <HelmetProvider context={helmetContext}>
          <CssBaseline />
            <Navbar socket={socket}/>
            <Routes>
              <Route 
                path="/" 
                element={isAuth ? <Navigate to="/home" /> : <LoginPage />} 
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
                element={isAuth ? <LocationPage socket={socket}/> : <Navigate to="/" />}
              />
              <Route 
                path="/tasks"
                element={isAuth ? <TasksPage socket={socket}/> : <Navigate to="/" />}
              />
              <Route
                path="/task/:id"
                element={isAuth ? <RequireTaskAuth socket={socket}/> : <Navigate to="/" />}
              />
              <Route 
                path="/task/new"
                element={isAuth ? <NewTaskPage /> : <Navigate to="/" />}
              />
              <Route 
                path="/messages"
                element={isAuth ? <MessagesPage socket={socket}/> : <Navigate to="/" />}
              >
                <Route 
                  path=":id"
                  element={isAuth ? <MessageWidget socket={socket}/> : <Navigate to="/" />}
                />
              </Route>
              <Route 
                path="/notifications"
                element={isAuth ? <NotificationPage /> : <Navigate to="/" />}
              />
              
              <Route element={isAuth ? <RequireAdminAuth allowedRoles={'admin'} /> : <Navigate to="/"/>}>
                <Route
                  path="/admin"
                  element={<AdminPage socket={socket}/>}
                >
                  <Route 
                    path="dashboard" 
                    element={<DashboardPage socket={socket}/>}
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
