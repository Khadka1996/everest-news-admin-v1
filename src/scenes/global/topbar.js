import React, { useState } from 'react';
import { Box, IconButton, useTheme, Tooltip, Menu, MenuItem, Typography } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from "@mui/icons-material/Search";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // State for Account Dropdown
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <Tooltip title="Toggle Light/Dark Mode">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Go to The Everest News Facebook page">
          <IconButton
            component="a"
            href="https://www.facebook.com/people/The-Everest-News/61557594452068/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="No notifications right now">
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Settings">
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Account">
          <IconButton onClick={handleAccountClick}>
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>

        {/* Account Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleAccountClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleAccountClose}>
            <Typography onClick={() => alert("Contact Admin for updates")}>
              Contact Admin for Updates
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleAccountClose}>
            <Typography onClick={() => alert("Logging out...")}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
