import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Form from "./form";
import Ftable from "./table";
import Cs from "./consolidate_summary";
import SignIn from "./login";
import { Admin } from "./admin";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const Routing = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");   
    if (auth !== null) {
      setAuthenticated(JSON.parse(auth));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("authenticated", JSON.stringify(authenticated));
  }, [authenticated]);

  const PrivateRoute = ({ children }) => {
    return authenticated ? children : <Navigate to="/login" replace />;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%',marginTop:'0px',paddingTop:'0px' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<SignIn setAuthenticated={setAuthenticated} />}
        />
        <Route
          path="/login"
          element={<SignIn setAuthenticated={setAuthenticated} />}
        />
        <Route
          path="/form"
          element={
            <PrivateRoute>
              <Form />
            </PrivateRoute>
          }
        />
        <Route
          path="/table"
          element={
            <PrivateRoute>
              <Ftable />
            </PrivateRoute>
          }
        />
        <Route
          path="/consolidate_summary"
          element={
            <PrivateRoute>
              <Cs />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
