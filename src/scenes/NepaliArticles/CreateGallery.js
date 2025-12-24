import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress, Radio } from '@mui/material';
import API_URL from '../../config';

const CreateGallery = ({ setSelectedPhotos }) => {
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 8;
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGalleryPhotos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/gallery`);
        setGalleryPhotos(response.data.data);
        setFilteredPhotos(response.data.data);
      } catch (err) {
        console.error('Error fetching gallery photos:', err);
        setError('Failed to load photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryPhotos();
  }, []);

  useEffect(() => {
    const filtered = galleryPhotos.filter(photo =>
      photo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPhotos(filtered);
    setCurrentPage(1); // Reset to the first page on search
  }, [searchQuery, galleryPhotos]);

  const handlePhotoSelect = (photoId) => {
    const newSelectedId = selectedPhotoId === photoId ? null : photoId;
    setSelectedPhotoId(newSelectedId);

    const selectedPhotoData = newSelectedId
      ? galleryPhotos.find(photo => photo._id === newSelectedId)
      : null;

    // Ensure you are setting the correct structure for selected photos
    setSelectedPhotos(selectedPhotoData ? [{ ...selectedPhotoData, file: selectedPhotoData.file }] : []);
  };

  // Reset selected photo when loading new photos
  useEffect(() => {
    if (loading) {
      setSelectedPhotoId(null);
    }
  }, [loading]);

  const totalPhotos = filteredPhotos.length;
  const totalPages = Math.ceil(totalPhotos / photosPerPage);
  const startIndex = (currentPage - 1) * photosPerPage;
  const currentPhotos = filteredPhotos.slice(startIndex, startIndex + photosPerPage);

  return (
    <Box p={4} borderRadius={2} boxShadow={3} bgcolor="#f9f9f9">
      <Typography variant="h5" gutterBottom align="center">
        Select Photos for Gallery
      </Typography>
      <TextField
        label="Search by Photo Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        variant="outlined"
        className="mb-4"
        placeholder="Type to search..."
        InputProps={{
          style: { borderRadius: 8 }, // Rounded corners
        }}
      />

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {currentPhotos.length > 0 ? (
            currentPhotos.map(photo => (
              <div key={photo._id} className="relative cursor-pointer" onClick={() => handlePhotoSelect(photo._id)}>
                <Radio
                  checked={selectedPhotoId === photo._id}
                  onChange={() => handlePhotoSelect(photo._id)}
                  value={photo._id}
                  name="photoSelect"
                  color="tertiary"
                  className="absolute top-2 left-2 z-10" // Position the radio button
                />
                <img
                  src={`${API_URL}${photo.url}`}
                  alt={photo.name}
                  className={`object-cover rounded-lg transition-transform duration-300 ${
                    selectedPhotoId === photo._id ? 'scale-110 border-4 border-blue-500' : 'scale-100 border border-transparent'
                  }`}
                  style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                />
                <Typography className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-sm p-1 text-center rounded-b-lg">
                  {photo.name}
                </Typography>
              </div>
            ))
          ) : (
            <Typography>No photos found</Typography>
          )}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <Button
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          color="primary"
        >
          Prev
        </Button>
        <Button
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          color="primary"
        >
          Next
        </Button>
      </div>

      <Typography className="mt-2 text-center" variant="body2">
        Page {currentPage} of {totalPages}
      </Typography>
    </Box>
  );
};

export default CreateGallery;
