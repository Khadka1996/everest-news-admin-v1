import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  Button,
  Modal,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API_URL from '../../config';

const CategoryItem = ({ category, onUpdate, onDelete }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{category.name}</Typography>
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => onUpdate(category)} sx={{ mr: 1 }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(category)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

const Category = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateFormData, setUpdateFormData] = useState('');
  const [addFormData, setAddFormData] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleUpdate = (category) => {
    setSelectedCategory(category._id);
    setUpdateFormData(category.name);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`${API_URL}/api/categories/${selectedCategory}`, {
        name: updateFormData,
      });
      fetchCategories();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleAddSubmit = async () => {
    try {
      await axios.post(`${API_URL}/api/categories`, { name: addFormData });
      fetchCategories();
      setShowAddModal(false);
      setAddFormData('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDelete = (category) => {
    setSelectedCategory(category._id);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`${API_URL}/api/categories/${selectedCategory}`);
      fetchCategories();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Button variant="contained" color="secondary" onClick={() => setShowAddModal(true)} sx={{ mt: 2 }}>
        Add Category
      </Button>
      <Typography variant="h2" gutterBottom>
        Categories
      </Typography>
      {categories.map((category) => (
        <CategoryItem
          key={category._id}
          category={category}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}

      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="updateCategory"
            label="New Category Name"
            type="text"
            fullWidth
            value={updateFormData}
            onChange={(e) => setUpdateFormData(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSubmit} color="secondary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="addCategory"
            label="New Category Name"
            color= "secondary"
            type="text"
            fullWidth
            value={addFormData}
            onChange={(e) => setAddFormData(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSubmit} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Category;
