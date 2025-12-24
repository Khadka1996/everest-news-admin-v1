import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardContent, Typography, Box
} from '@mui/material';
import { CloudUpload, Add } from '@mui/icons-material';
import API_URL from '../../config';

const Advertisement = () => {
  const [websiteLink, setWebsiteLink] = useState('');
  const [photo, setPhoto] = useState(null);
  const [position, setPosition] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', photo);
    formData.append('websiteLink', websiteLink);
    formData.append('position', position);

    try {
      const response = await axios.post(`${API_URL}/api/advertisements/create`, formData);
      setResult(response.data.advertisement);
      toast.success('Advertisement created successfully');

      // Clear form fields after successful submission
      setWebsiteLink('');
      setPhoto(null);
      setPosition('');
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast.error('Failed to create advertisement');
    }
  };

  useEffect(() => {
    if (result) {
      // Hide result after 5 seconds
      const timer = setTimeout(() => setResult(null), 5000);
      return () => clearTimeout(timer); // Cleanup timer on unmount or when result changes
    }
  }, [result]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Advertisement
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Website Link Input */}
          <Grid item xs={12}>
            <TextField
              label="Website Link"
              variant="outlined"
              fullWidth
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
          </Grid>

          {/* Photo Upload */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUpload />}
            >
              Select Photo
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Grid>

          {/* Position Select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="position-select-label">Select Position</InputLabel>
              <Select
                labelId="position-select-label"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                label="Select Position"
              >
                <MenuItem value="nepali_top">Nepali Top</MenuItem>
                <MenuItem value="nepali_belowbreaking">Nepali Below Breaking</MenuItem>
                <MenuItem value="nepali_belowtourism">Nepali Below Tourism</MenuItem>
                <MenuItem value="nepali_sidebar1">Nepali Sidebar 1</MenuItem>
                <MenuItem value="nepali_sidebar2">Nepali Sidebar 2</MenuItem>
                <MenuItem value="nepali_beloweconomics">Nepali Below Economics</MenuItem>
                <MenuItem value="nepali_premium">Nepali Premium</MenuItem>
                <MenuItem value="nepali_belowaviation">Nepali Below Aviation</MenuItem>
                <MenuItem value="nepali_belowinternational">Nepali Below International</MenuItem>
                <MenuItem value="nepali_belowthoughts">Nepali Below Thoughts</MenuItem>
                <MenuItem value="nepali_belowentertainment">Nepali Below Entertainment</MenuItem>
                <MenuItem value="nepali_belowphotogallery">Nepali Below Photo Gallery</MenuItem>
                <MenuItem value="nepali_belowvideo">Nepali Below Video</MenuItem>
                <MenuItem value="nepali_popup">Nepali Popup</MenuItem>
                <MenuItem value="english_premium">English Premium</MenuItem>
                <MenuItem value="english_top">English Top</MenuItem>
                <MenuItem value="english_top2">English Top 2</MenuItem>
                <MenuItem value="english_politics">English Politics</MenuItem>
                <MenuItem value="english_economics">English Economics</MenuItem>
                <MenuItem value="english_lifestyle">English Lifestyle</MenuItem>
                <MenuItem value="english_sports">English Sports</MenuItem>
                <MenuItem value="english_tourism">English Tourism</MenuItem>
                <MenuItem value="english_sidebar1">English Sidebar1</MenuItem>
                <MenuItem value="english_sidebar2">English Sidebar2</MenuItem>
                <MenuItem value="english_popup">English Popup</MenuItem>
                <MenuItem value="english_international">English International</MenuItem>
                <MenuItem value="english_photogallery">English Photo Gallery</MenuItem>
                <MenuItem value="english_videogallery">English Video Gallery</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Add />}
              fullWidth
            >
              Create Advertisement
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Advertisement Created Info */}
      {result && (
        <Card className="mt-6 border border-gray-300 rounded-lg shadow-md">
          <CardContent className="p-4">
            <Typography variant="h6" className="text-lg font-semibold mb-2">
              Advertisement Created:
            </Typography>
            <Typography className="text-sm text-gray-700">
              Website Link: {result.websiteLink}
            </Typography>
            <Typography className="text-sm text-gray-700">
              Position: {result.position}
            </Typography>
            <img
              src={`${API_URL}/${result.imagePath}`}
              alt="Advertisement"
              className="w-full h-auto mt-4 rounded-md border"
            />
          </CardContent>
        </Card>
      )}

      <ToastContainer />
    </Box>
  );
};

export default Advertisement;
