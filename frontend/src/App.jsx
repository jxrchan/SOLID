import React, { Suspense, useState } from "react";
import UserContext from "./context/user";
import { Routes, Route, Navigate } from "react-router-dom";
import NavDrawer from "./components/NavDrawer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const Home = React.lazy(() => import("./pages/Home"));
// const Profile = React.lazy(() => import("./pages/Profile"));
// const Athletes = React.lazy(() => import("./pages/Athletes"));
// const Coaches = React.lazy(() => import("./pages/Coaches"));
// const NotFound = React.lazy(() => import("./pages/NotFound"));
// const Login = React.lazy(() => import("./pages/Login"));
// const Register = React.lazy(() => import("./pages/Register"));

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Athletes from "./pages/Athletes";
import Coaches from "./pages/Coaches";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const queryClient = new QueryClient();

  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoggedIn = () => {};

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          email,
          setEmail,
          role,
          setRole,
          isLoggedIn,
          setIsLoggedIn,
        }}
      >
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        {/* {isLoggedIn && <NavDrawer />} */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={<Navigate replace to={isLoggedIn ? "/home" : "/login"} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? <Profile /> : <Navigate replace to="/login" />
            }
          />
          <Route
            path="/coaches"
            element={
              isLoggedIn && role === "COACH" ? (
                <Coaches />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/athletes"
            element={
              isLoggedIn && role === "ATHLETE" ? (
                <Athletes />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* </Suspense> */}
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
