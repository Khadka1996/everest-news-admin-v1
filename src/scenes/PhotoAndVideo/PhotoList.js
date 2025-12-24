import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import API_URL from '../../config';


const PhotoListItem = ({ photo, onUpdate, onDelete }) => {
  return (
    <TableRow>
      <TableCell>
        <img
          src={`${API_URL}/uploads/photos/${photo.imagePath.split('/').pop()}`}
          alt={photo.description}
          className="w-24 h-24 object-cover"
          onError={() => console.error("Error loading image:", photo.imagePath)}
        />
      </TableCell>
      <TableCell>{photo.description}</TableCell>
      <TableCell>
        <Tooltip title="Edit">
          <IconButton onClick={() => onUpdate(photo)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(photo)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};


const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    description: "",
    imageFile: null,
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/photos`);
      setPhotos(response.data.photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleUpdate = (photo) => {
    setSelectedPhoto(photo);
    setUpdateFormData({
      description: photo.description,
      imageFile: null,
    });
    setShowUpdateModal(true);
  };

  const handleDelete = (photo) => {
    setSelectedPhoto(photo);
    setShowDeleteModal(true);
  };const handleUpdateSubmit = async () => {
    const formData = new FormData();
    formData.append("description", updateFormData.description);
    if (updateFormData.images) { // Assuming you have multiple images
      updateFormData.images.forEach((image) => {
        formData.append("images", image); // Must match the field name in Multer
      });
    }
  
    try {
      await axios.put(
        `${API_URL}/api/photos/${selectedPhoto._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      fetchPhotos();
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };
  
  

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/photos/${selectedPhoto._id}`);
      fetchPhotos();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Calculate current photos for pagination
  const indexOfLastPhoto = currentPage * itemsPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - itemsPerPage;
  const currentPhotos = photos
    .filter((photo) =>
      photo.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstPhoto, indexOfLastPhoto);

  return (
    <>
      <Box mb={3}>
        <Typography variant="h2" className="text-center">Photo List</Typography>
        <TextField
          placeholder="Search by description"
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </Box>

      <TableContainer className="mb-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPhotos.map((photo) => (
              <PhotoListItem
                key={photo._id}
                photo={photo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(photos.filter(photo => photo.description.toLowerCase().includes(searchTerm.toLowerCase())).length / itemsPerPage)}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        color="primary"
        className="flex justify-center mb-4"
      />

      {/* Update Photo Dialog */}
      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <DialogTitle>Update Photo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={updateFormData.description}
            onChange={(e) =>
              setUpdateFormData({
                ...updateFormData,
                description: e.target.value,
              })
            }
          />
          <input
            type="file"
            onChange={(e) =>
              setUpdateFormData({ ...updateFormData, imageFile: e.target.files[0] })
            }
            className="mt-2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this photo?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PhotoList;
