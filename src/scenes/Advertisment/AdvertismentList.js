import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Grid, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import API_URL from '../../config';

const AdvertisementList = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [editingAdvertisement, setEditingAdvertisement] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteAdvertisementId, setDeleteAdvertisementId] = useState(null);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/advertisements`);
      setAdvertisements(response.data.advertisements);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      toast.error('Failed to fetch advertisements');
    }
  };

  const handleEdit = (advertisement) => {
    setEditingAdvertisement(advertisement);
  };

  const handleUpdate = async (updatedAdvertisement) => {
    try {
      await axios.put(
        `${API_URL}/api/advertisements/${updatedAdvertisement._id}`,
        {
          websiteLink: updatedAdvertisement.websiteLink,
          position: updatedAdvertisement.position,
        }
      );
      setEditingAdvertisement(null);
      fetchAdvertisements();
      toast.success('Advertisement updated successfully');
    } catch (error) {
      console.error('Error updating advertisement:', error);
      toast.error('Failed to update advertisement');
    }
  };

  const handleDelete = (id) => {
    setDeleteAdvertisementId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/advertisements/${deleteAdvertisementId}`);
      fetchAdvertisements();
      toast.success('Advertisement deleted successfully');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast.error('Failed to delete advertisement');
    }
  };

  return (
    <div>
      <h2>Advertisement List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Website Link</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {advertisements.map((advertisement) => (
              <TableRow key={advertisement._id}>
                <TableCell>{advertisement.websiteLink}</TableCell>
                <TableCell>
                <img
                    src={`${API_URL}/${advertisement.imagePath}`}
                    alt="advertisement"
                    style={{ maxWidth: '200px' }}
                  />


                </TableCell>
                <TableCell>{advertisement.position}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(advertisement)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(advertisement._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Advertisement Form */}
      {editingAdvertisement && (
        <div style={{ marginTop: '20px' }}>
          <h3>Edit Advertisement</h3>
          <form onSubmit={() => handleUpdate(editingAdvertisement)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Website Link"
                  fullWidth
                  value={editingAdvertisement.websiteLink}
                  onChange={(e) =>
                    setEditingAdvertisement({
                      ...editingAdvertisement,
                      websiteLink: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Position"
                  fullWidth
                  value={editingAdvertisement.position}
                  onChange={(e) =>
                    setEditingAdvertisement({
                      ...editingAdvertisement,
                      position: e.target.value,
                    })
                  }
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

                 
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Update Advertisement
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this advertisement?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="primary" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default AdvertisementList;
