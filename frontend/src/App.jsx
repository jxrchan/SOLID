import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {jwtDecode} from "jwt-decode";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";



import UserContext from "./context/user";
import NavDrawer from "./components/NavDrawer";
import useFetch from "./hooks/useFetch";
import { fontFamily } from "@mui/system";

const Home = React.lazy(() => import("./pages/Home"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Athletes = React.lazy(() => import("./pages/Athletes"));
const Coaches = React.lazy(() => import("./pages/Coaches"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));

function App () {

  const [accessToken, setAccessToken] = useState('');
  const [decoded, setDecoded] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const queryClient = new QueryClient();
  const usingFetch = useFetch();

  const theme = createTheme({
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 16, // Default font
      h6: {
        fontFamily: 'Roboto Slab, Roboto, serif'}, // Font for h1
      body1: {
        fontFamily: 'Roboto Slab, Arial, sans-serif',
        fontSize: 16, // Font for body1
      },
      body2: {
        fontFamily: 'Roboto, Arial, sans-serif', // Font for body2
      },
    },
    });


  const refreshAccessToken = async (refresh) => {
    try {
      const res = await usingFetch("/auth/refresh", "POST", { refresh });
      if (res && res.access) {
        window.localStorage.setItem('access', res.access);
        return res.access;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const checkAccessExpired = () => {
    const access = window.localStorage.getItem('access');
    const decodedAccess = jwtDecode(access);
    return decodedAccess.exp < (Date.now() / 1000);
  };

  const checkRefreshExpired = () => {
    const refresh = window.localStorage.getItem('refresh');
    const decodedRefresh = jwtDecode(refresh);
    return decodedRefresh.exp < (Date.now() / 1000);
  };

  const checkTokenValidity = async () => {
    const access = window.localStorage.getItem('access');
    const refresh = window.localStorage.getItem('refresh');

    if (!access || !refresh) {
      window.localStorage.removeItem('access');
      window.localStorage.removeItem('refresh');
      setIsLoggedIn(false);
      return;
    }

    const isAccessExpired = checkAccessExpired();
    const isRefreshExpired = checkRefreshExpired();
    setIsLoggedIn(false);

    switch (true) {
      case !isAccessExpired && !isRefreshExpired:
        checkLoggedIn(access);
        break;
      case isAccessExpired && !isRefreshExpired:
        const newToken = await refreshAccessToken(refresh);
        if (newToken) {
          checkLoggedIn(newToken);
        } else console.error('there is an error')
        break;
      case (isAccessExpired && isRefreshExpired) || (!isAccessExpired && isRefreshExpired):
        window.localStorage.removeItem('access');
        window.localStorage.removeItem('refresh');
        break;
      default:
        break;
    }
  };


  const checkLoggedIn = (token) => {
    setAccessToken(token);
    const decodedToken = jwtDecode(token);
    setDecoded(decodedToken);
    setIsLoggedIn(true);
  };


  useEffect(() => {
    checkTokenValidity();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          decoded,
          setDecoded,
          setIsLoggedIn,
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          {isLoggedIn && <NavDrawer />}
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/login" 
                  element= { !isLoggedIn ? <Login/>  : <Navigate replace to="/home" />}/>
               
                  <Route path="/"
                  element={ !isLoggedIn ? <Login/> : <Navigate replace to="/home" />}
                />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/home"
                  element={isLoggedIn ? <Home /> : <Navigate replace to="/login" />}
                />
                <Route
                  path="/profile"
                  element={isLoggedIn ? <Profile /> : <Navigate replace to="/login" />}
                />
                <Route
                  path="/coaches"
                  element={
                    isLoggedIn && decoded.role === "ATHLETE" ? (
                      <Coaches />
                    ) : (
                      <Navigate replace to="/login" />
                    )
                  }
                />
                <Route
                  path="/athletes"
                  element={
                    isLoggedIn && decoded.role === "COACH" ? (
                      <Athletes />
                    ) : (
                      <Navigate replace to="/login" />
                    )
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </ThemeProvider>
      </UserContext.Provider>
    </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
