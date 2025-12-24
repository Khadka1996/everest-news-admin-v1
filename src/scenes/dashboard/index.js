import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/system";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../../theme";
import Header from "../../components/Header"; // Assuming Header is imported from a separate file
import axios from "axios";
import { saveAs } from "file-saver"; // Import file-saver
import {
  WbSunnyOutlined as MorningIcon,
  Brightness4Outlined as EveningIcon,
  WbSunnyOutlined as AfternoonIcon,
  NightlightOutlined as NightIcon
} from "@mui/icons-material";
import API_URL from '../../config';
import AdminList from "../DashboardManagement/AdminList"; // Adjust the path based on the file's location

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch all articles
    axios
      .get(`${API_URL}/api/articles/all`)
      .then((response) => setArticles(response.data.data))
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

  // Function to get current time and return a greeting and corresponding icon
  const getGreetingData = () => {
    const currentTime = new Date().getHours();

    if (currentTime >= 5 && currentTime < 12) {
      return { greeting: "Good Morning", icon: <MorningIcon /> };
    } else if (currentTime >= 12 && currentTime < 18) {
      return { greeting: "Good Afternoon", icon: <AfternoonIcon /> };
    } else if (currentTime >= 18 && currentTime < 22) {
      return { greeting: "Good Evening", icon: <EveningIcon /> };
    } else {
      return { greeting: "Good Night", icon: <NightIcon /> };
    }
  };

  const { greeting, icon } = getGreetingData();

  const handleDownloadBackup = () => {
    try {
      // Convert articles array to JSON string
      const json = JSON.stringify(articles, null, 2);

      // Create a Blob containing the JSON data
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });

      // Save the Blob as a file
      saveAs(blob, 'articles_backup.json');
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header wish={greeting} icon={icon} gender="Mr" name="Janak" />
        
        <Box>
          <Button
            onClick={handleDownloadBackup} // Attach the backup function here
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ marginRight: "10px" }} />
            Download Backup
          </Button>
        </Box>
      </Box>

      {/* AdminList Section */}
      <Box mt="20px">
        <AdminList /> {/* Render AdminList */}
      </Box>
    </Box>
  );
};

export default Dashboard;
