import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios"; // Import axios for making HTTP requests
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import logo from "./MEC.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import PersonIcon from "@mui/icons-material/Person"; // Import PersonIcon

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const BoxContainer = styled.div`
  width: 400px; /* Increased width */
  min-height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 200px; /* Adjusted height */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em; /* Adjusted padding */
  padding-bottom: 90px; /* Increased padding-bottom to move the text upwards */
  position: relative; /* Added position relative for positioning the image */
`;

const BackDrop = styled.div`
  position: absolute;
  width: 160%;
  height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  top: -320px;
  left: -100px;
  transform: rotate(60deg);
  background: #32348c; /* Change background color here */
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.div`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 50;
`;

const SmallText = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  z-index: 10;
`;

const PersonIconWrapper = styled.div`
  position: absolute;
  top: 160px; /* Adjust top position */
  left: 180px; /* Adjust left position */
  opacity: 100; /* Adjust 0.3 opacity as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px; /* Adjust width */
  height: 60px; /* Adjust height */
`;

export default function SignIn({ setAuthenticated }) {
  const [active, setActive] = useState("signin");
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Set authentication status to false when component mounts
    setAuthenticated(false);
  }, [setAuthenticated]);

  const switchToSignup = () => {
    setActive("signup");
  };

  const switchToSignin = () => {
    setActive("signin");
  };

  const defaultTheme = createTheme();

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const initialState = {
    username: "", // Changed 'email' to 'username'
    password: "",
  };

  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({
    username: "", // Changed 'email' to 'username'
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((existingValues) => ({
      ...existingValues,
      [name]: value,
    }));

    setErrors((existingErrors) => ({
      ...existingErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Validate username
    if (!values.username.trim()) {
      newErrors.username = "*Username is required"; // Changed 'email' to 'username'
      valid = false;
    }

    // Validate password
    if (!values.password.trim()) {
      newErrors.password = "*Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formData = {
      username: values.username,
      password: values.password,
    };
    try {
      // Send form data to the backend endpoint for authentication
      const response = await axios.post("http://localhost:1234/users", formData);
      if (response.data.status === "success") {
        // Update authentication state upon successful login
        setAuthenticated(true);
        if (response.data.redirectToAdmin) {
          // Redirect to '/admin' path if redirectToAdmin is true
          navigate("/admin");
        } else {
          // Redirect to '/table' path if redirectToAdmin is false
          navigate("/table");
        }
      } else {
        showAlert(response.data.error);
      }
    } catch (error) {
      // Handle errors
    }
  };

  const showAlert = (message) => {
    alert(message);
  };

  const handleClick1 = (event) => {
    event.preventDefault();

    setValues(initialState);
    setErrors({
      username: "", // Changed 'email' to 'username'
      password: "",
    });
  };

  return (
    <PageContainer>
      <BoxContainer>
        <TopContainer>
          <BackDrop />
          <PersonIconWrapper>
            {" "}
            {/* Move PersonIconWrapper here */}
            <PersonIcon style={{ fontSize: 240, color: "#fff" }} />
          </PersonIconWrapper>
          <HeaderContainer>
            <div style={{ display: "flex", alignItems: "center" }}>
              <HeaderText>Welcome Back !!!</HeaderText>
            </div>
            <SmallText>Please sign-in to continue!</SmallText>
          </HeaderContainer>
          <img
            src={logo}
            alt="logo"
            style={{
              position: "absolute",
              top: 50,
              right: 30,
              maxHeight: "35%",
              maxWidth: "35%",
              zIndex: 100,
            }}
          />
        </TopContainer>
        <div style={{ paddingTop: "30px" }}>
          {" "}
          {/* Adjusted padding-top */}
          <ThemeProvider theme={defaultTheme}>
            <Container
              component="main"
              maxWidth="xs"
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <CssBaseline />
              <div className="mb-3 text-center"></div>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={values.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 20,
                    backgroundColor: "#32348c",
                    color: "#fff",
                  }} // Updated background color and text color
                >
                  Sign In
                </Button>
              </Box>
            </Container>
          </ThemeProvider>
        </div>
      </BoxContainer>
    </PageContainer>
  );
}