import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../config';

const PhotoUpload = () => {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleImageChange = (event) => {
    setImages([...event.target.files]); // Get the selected files
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1); // Remove the selected image
    setImages(updatedImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('description', description);

    // Append each selected image to FormData
    images.forEach((image) => {
      formData.append('images', image); // Append images with the same field name
    });

    try {
      const response = await axios.post(`${API_URL}/api/photos/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      toast.success('Photos uploaded successfully!');
      // Clear form fields after submission
      setDescription('');
      setImages([]);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Error uploading photos. Please try again.');
    }
  };

  return (
    <Box className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <Typography variant="h4" className="text-center mb-4 text-gray-800 font-semibold">
        Upload Photos
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mb-6 w-full"
        />
        <input
          type="file"
          multiple
          onChange={handleImageChange} // Allow multiple files
          accept="image/*" // Optional: restrict to images
          required
          className="hidden"
          id="file-upload"
        />
        
        <label htmlFor="file-upload">
          <Button variant="contained" component="span" className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
            Choose Images
          </Button>
        </label>
        
        {/* Preview selected images */}
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from(images).map((image, index) => (
            <Card key={index} className="relative m-2" sx={{ width: 120 }}>
              <CardMedia
                component="img"
                alt={`preview-${index}`}
                image={URL.createObjectURL(image)}
                sx={{ height: 120, objectFit: 'cover' }}
              />
              <CardContent>
                <IconButton
                  aria-label="remove"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white hover:bg-red-200"
                >
                  <CloseIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button type="submit" variant="contained" color="primary" className="w-full bg-green-600 hover:bg-green-700">
          Upload Photos
        </Button>
      </form>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </Box>
  );
};

export default PhotoUpload;
