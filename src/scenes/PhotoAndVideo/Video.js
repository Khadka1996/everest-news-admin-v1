import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { ColorModeContext } from '../../theme';  // Import the ColorModeContext to get the current mode
import { tokens } from '../../theme';  // Import the tokens function
import API_URL from '../../config';

const VideoLinks = () => {
  const { toggleColorMode } = useContext(ColorModeContext);  // Get the toggle function for the theme
  const [videoType, setVideoType] = useState('local');
  const [videoInfo, setVideoInfo] = useState({
    title: '',
    localFile: null,
    youtubeLink: '',
  });

  // Assuming mode is stored somewhere in your app's context or state
  const mode = 'dark';  // For example, setting it as 'dark' or 'light'
  const colors = tokens(mode);  // Get the colors based on the mode

  const handleVideoTypeChange = (event) => {
    setVideoType(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setVideoInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === 'localFile' ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', videoInfo.title);
      formData.append('videoType', videoType);

      if (videoType === 'local') {
        formData.append('localFile', videoInfo.localFile);
      } else {
        formData.append('youtubeLink', videoInfo.youtubeLink);
      }

      const response = await axios.post(`${API_URL}/api/videos/create`, formData);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error creating video:', error);
      toast.error('Failed to create video');
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4 max-w-lg">
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: colors.primary[500] }}  // Using the tokens from theme
      >
        Create Video
      </h2>
      <FormControl fullWidth>
        <InputLabel id="video-type-label">Video Type</InputLabel>
        <Select
          labelId="video-type-label"
          id="videoType"
          value={videoType}
          onChange={handleVideoTypeChange}
        >
          <MenuItem value="local">Local</MenuItem>
          <MenuItem value="youtube">YouTube</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Title"
        name="title"
        value={videoInfo.title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />

      {videoType === 'local' && (
        <TextField
          type="file"
          name="localFile"
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      )}

      {videoType === 'youtube' && (
        <TextField
          label="YouTube Link"
          name="youtubeLink"
          value={videoInfo.youtubeLink}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        style={{ marginTop: '20px', backgroundColor: colors.blueAccent[500] }}  // Example of using another color from tokens
      >
        Submit
      </Button>
      <ToastContainer />
    </div>
  );
};

export default VideoLinks;
