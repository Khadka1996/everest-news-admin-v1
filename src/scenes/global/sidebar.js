import React, { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import {
  AddBox as AddBoxIcon,
  HomeOutlined as HomeOutlinedIcon,
  Edit as EditIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  PhotoSizeSelectLarge as PhotoSizeSelectLargeIcon,
  YouTube as YouTubeIcon,
  VideoCall as VideoCallIcon,
  LocalOffer as LocalOfferIcon,
  Category as CategoryIcon,
  SportsSoccer as SportsSoccerIcon,
  SportsCricket as SportsCricketIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  Logout as LogoutIcon,
  PersonAddAlt as PersonAddAltIcon,
  AssignmentInd as AssignmentIndIcon,
  AdsClick as AdsClickIcon,
  Update as UpdateIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  PieChartOutlineOutlined as PieChartOutlineOutlinedIcon,
  TimelineOutlined as TimelineOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
  MapOutlined as MapOutlinedIcon,
} from "@mui/icons-material";
import { useUser } from '../../Context/UserContext';
import axios from 'axios';
import API_URL from '../../config';


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const { handleLogout } = useUser();
  const [user, setUser] = useState(null);

  const handleLogoutClick = () => {
    handleLogout();
    // Additional logic after logout if needed
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/user-info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
      <Menu iconShape="square">
  {/* LOGO AND MENU ICON */}
  <MenuItem
    onClick={() => setIsCollapsed(!isCollapsed)}
    icon={
      isCollapsed ? (
        <MenuOutlinedIcon sx={{ fontSize: 50 }} /> // Increase icon size
      ) : undefined
    }
    style={{
      margin: "10px 0 20px 0",
      color: colors.grey[100],
    }}
  >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h4" color={colors.grey[100]}>
                  The Everest News
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* User Profile Section */}
          {!isCollapsed && user && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`https://t4.ftcdn.net/jpg/04/98/72/43/360_F_498724323_FonAy8LYYfD1BUC0bcK56aoYwuLHJ2Ge.jpg`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color="textPrimary"
                  fontWeight="bold"
                  sx={{ m: "1px 0 0 0" }}
                >
                  Name: {user.username}
                </Typography>
                <Typography variant="h5" color="greenAccent.main">
                  Role: {user.role}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Nepali Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 20px" }}
            >
              <hr />
              Nepali
            </Typography>
            <Item
              title="Add Nepali News"
              to="/add/nepali"
              icon={<AddBoxIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Edit Nepali News"
              to="/update/nepali"
              icon={<EditIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* English Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 20px" }}
            >
              <hr />
              English
            </Typography>
            <Item
              title="Add English News"
              to="/add/english"
              icon={<AddBoxIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Edit English News"
              to="/update/english"
              icon={<EditIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Photo Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 20px" }}
            >
              <hr />
              Photo
            </Typography>
            <Item
              title="Add Photo"
              to="/add/photo"
              icon={<AddPhotoAlternateIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Edit Photo"
              to="/update/photo"
              icon={<PhotoSizeSelectLargeIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Videos Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 20px" }}
            >
              <hr />
              Videos
            </Typography>
            <Item
              title="Add Video"
              to="/add/video"
              icon={<YouTubeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Edit Video"
              to="/update/video"
              icon={<VideoCallIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Tags Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 20px" }}
            >
              Tags
            </Typography>
            <Item
              title="Add Tags"
              to="/tags"
              icon={<LocalOfferIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Category Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 15px" }}
            >
              Category
            </Typography>
            <Item
              title="Add Category"
              to="/category"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Author Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 20px" }}
            >
              Author
            </Typography>
            <Item
              title="Add Author"
              to="/add/author"
              icon={<PersonAddAltIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Edit Author"
              to="/update/author"
              icon={<AssignmentIndIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Advertisement Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 10px" }}
            >
              Advertisements
            </Typography>
            <Item
              title="Add Advertisement"
              to="/add/ads"
              icon={<AdsClickIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Edit Advertisement"
              to="/update/ads"
              icon={<UpdateIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Live Score Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 20px" }}
            >
              Live Score
            </Typography>
            <Item
              title="Football"
              to="/add/football"
              icon={<SportsSoccerIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Cricket"
              to="/add/cricket"
              icon={<SportsCricketIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Calendar Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 2px 10px" }}
            >
              Calendar
            </Typography>
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             {/* Calendar Section */}
             <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 2px 10px" }}
            >
              Admin List
            </Typography>
            <Item
              title="Admins"
              to="/admin"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Charts Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Logout Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "12px 0 5px 20px", cursor: 'pointer' }}
              onClick={handleLogoutClick}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </Typography>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
