import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, CardActions, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, TextField, Typography, Box, IconButton, Avatar
} from '@mui/material';
import { CloudUpload, Edit, Delete } from '@mui/icons-material';
import API_URL from '../../config';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    authorPhoto: null,
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/authors`);
      setAuthors(response.data.authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleUpdate = (author) => {
    setSelectedAuthor(author);
    setUpdateFormData({
      firstName: author.firstName,
      middleName: author.middleName || '',
      lastName: author.lastName,
      authorPhoto: null,
    });
    setShowUpdateModal(true);
  };

  const handleDelete = (author) => {
    setSelectedAuthor(author);
    setShowDeleteModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', updateFormData.firstName);
      formData.append('middleName', updateFormData.middleName);
      formData.append('lastName', updateFormData.lastName);
      formData.append('authorPhoto', updateFormData.authorPhoto);

      await axios.put(`${API_URL}/api/authors/${selectedAuthor._id}`, formData);

      setUpdateFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        authorPhoto: null,
      });

      fetchAuthors();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/authors/${selectedAuthor._id}`);
      fetchAuthors();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const handleFileChange = (e) => {
    setUpdateFormData({ ...updateFormData, authorPhoto: e.target.files[0] });
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Author List</Typography>
      </Box>

      <Grid container spacing={3}>
        {authors.map((author) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={author._id}>
            <Card sx={{ maxWidth: 345 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Avatar
                  src={`${API_URL}/uploads/authors/${author.photo}`}
                  alt={author.firstName}
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
              <CardContent>
                <Typography variant="h6" component="div">
                  {author.firstName} {author.middleName ? author.middleName : ''} {author.lastName}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<Edit />}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleUpdate(author)}
                >
                  Update
                </Button>
                {/* Uncomment if delete functionality is needed */}
                {/* <Button
                  startIcon={<Delete />}
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(author)}
                >
                  Delete
                </Button> */}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Update Author Dialog */}
      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <DialogTitle>Update Author</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            value={updateFormData.firstName}
            onChange={(e) => setUpdateFormData({ ...updateFormData, firstName: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Middle Name"
            value={updateFormData.middleName}
            onChange={(e) => setUpdateFormData({ ...updateFormData, middleName: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={updateFormData.lastName}
            onChange={(e) => setUpdateFormData({ ...updateFormData, lastName: e.target.value })}
            margin="dense"
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<CloudUpload />}
            sx={{ mt: 2 }}
          >
            Upload Photo
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this author?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthorList;
