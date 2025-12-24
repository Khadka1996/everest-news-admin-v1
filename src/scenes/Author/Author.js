import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, TextField, Typography, Box, Grid, InputLabel, FormControl, Input, IconButton
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import API_URL from '../../config';

const Author = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [authorPhoto, setAuthorPhoto] = useState(null);

  const handleFileChange = (e) => {
    setAuthorPhoto(e.target.files[0]);
  };

  const handleCreateAuthor = async () => {
    try {
      // Validate required fields
      if (!firstName || !lastName || !authorPhoto) {
        toast.error('First name, last name, and photo are required', { position: 'top-center' });
        return;
      }

      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('middleName', middleName);
      formData.append('lastName', lastName);
      formData.append('authorPhoto', authorPhoto);

      // Make API call
      const response = await axios.post(`${API_URL}/api/authors/create`, formData);

      // Clear input fields
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setAuthorPhoto(null);

      // Show success notification
      toast.success(response.data.message, { position: 'top-center' });
    } catch (error) {
      console.error('Error creating author:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'An error occurred while creating the author', { position: 'top-center' });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 2, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Author Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Middle Name"
            variant="outlined"
            fullWidth
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="authorPhoto">Author Photo</InputLabel>
            <Input
              id="authorPhoto"
              type="file"
              onChange={handleFileChange}
              inputProps={{ accept: 'image/*' }}
              fullWidth
              sx={{ display: 'none' }}
            />
            <IconButton
              component="label"
              htmlFor="authorPhoto"
              sx={{ mt: 2, border: '1px solid', borderRadius: 1, padding: '10px 15px', color: 'gray' }}
            >
              <CloudUpload />
              Upload Photo
            </IconButton>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateAuthor}
            sx={{ backgroundColor: 'primary.main', color: '#fff' }}
          >
            Create Author
          </Button>
        </Grid>
      </Grid>

      {/* Toast notifications */}
      <ToastContainer />
    </Box>
  );
};

export default Author;
