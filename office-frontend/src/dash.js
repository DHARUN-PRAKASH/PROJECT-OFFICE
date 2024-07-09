import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
import logo1 from "./main-logo.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export default function Dash() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming the user is logged in initially
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(true); // Assuming the user is logged in initially


  const handleLogout = () => {
    // Clear authentication status and redirect to login
    setAuthenticated(false);
    localStorage.removeItem("authenticated");
    navigate("/login");
  };

  const handleLogoClick = () => {
    // Navigate to the /table route when clicking on the logo
    navigate("/table");
  };

  const handleAccountIconClick = (event) => {
    // Open account menu
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar position="fixed" sx={{ background: "#ffffff", height: 95 }}>
        <Toolbar>
          <Box
            flexGrow={1}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={2}
            paddingBottom={2}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
              <Button onClick={handleLogoClick}>
                <img
                  src={logo1}
                  alt="Logo"
                  width="450"
                  height="75"
                  style={{ marginRight: "10px" }}
                />
              </Button>
            </Toolbar>
          </Box>
          {isLoggedIn ? (
            <div>
              {/* Render AccountMenu component instead of IconButton */}
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleAccountIconClick}
                  size="small"
                  sx={{ ml: 2, color: "#32348c" }}
                  aria-controls={anchorEl ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? "true" : undefined}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleClose}>
                  <Avatar />
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            // If user is not logged in, display a login button or any other appropriate UI
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}