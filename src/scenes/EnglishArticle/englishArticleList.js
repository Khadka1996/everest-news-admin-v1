import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Pagination,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API_URL from '../../config';

const EnglishArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 12; // Matches the backend default

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/english/all?page=${currentPage}&limit=${articlesPerPage}`
        );
        const { data, pagination } = response.data;
        setArticles(data);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, [currentPage]);

  const handleDeleteClick = (articleId) => {
    setArticleToDelete(articleId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      await axios.delete(`${API_URL}/api/english/${articleToDelete}`);
      setArticles(articles.filter((article) => article._id !== articleToDelete));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  const handleEditClick = (articleId) => {
    const article = articles.find((article) => article._id === articleId);
    setSelectedArticle(article);
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedArticle) return;

    const formData = new FormData();
    if (selectedArticle.newPhoto) {
      formData.append('photos', selectedArticle.newPhoto);
    }
    Object.entries(selectedArticle).forEach(([key, value]) => {
      if (key !== 'newPhoto') {
        formData.append(key, Array.isArray(value) ? value.join(',') : value);
      }
    });

    try {
      const response = await axios.put(
        `${API_URL}/api/english/update/${selectedArticle._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setArticles(articles.map((article) =>
        article._id === selectedArticle._id ? response.data.data : article
      ));
      handleCloseUpdateModal();
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedArticle(null);
  };

  const renderArticles = () => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active>Headline</TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article._id}>
                <TableCell>
                  <Typography variant="body1">{article.headline}</Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEditClick(article._id)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(article._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6">
      <Typography variant="h4" className="mb-10">
        English Article List
      </Typography>
      <TextField
        label="Search by Headline"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {renderArticles()}

      <div className="flex justify-center mt-6">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this article?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Article Dialog */}
      <Dialog open={showUpdateModal} onClose={handleCloseUpdateModal} fullWidth maxWidth="md">
        <DialogTitle>Update Article</DialogTitle>
        <DialogContent>
          {selectedArticle && (
            <div className="space-y-4 mt-10">
              <TextField
                label="Headline"
                fullWidth
                value={selectedArticle.headline}
                onChange={(e) => setSelectedArticle({ ...selectedArticle, headline: e.target.value })}
              />
               <ReactQuill
             theme="snow"
             value={selectedArticle.content}
             onChange={(value) => setSelectedArticle({ ...selectedArticle, content: value })}
             className="mb-4"
             modules={{
               toolbar: [
                 [{ 'font': ['sans-serif', 'serif', 'monospace'] }],
                 [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                 [{ 'size': ['small', false, 'large', 'huge'] }],
                 [{ 'align': [] }],
                 ['bold', 'italic', 'underline', 'strike'],
                 [{ 'color': [] }, { 'background': [] }],
                 [{ 'script': 'sub' }, { 'script': 'super' }],
                 [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                 [{ 'indent': '-1' }, { 'indent': '+1' }],
                 [{ 'direction': 'rtl' }],
                 ['blockquote', 'code-block'],
                 ['link', 'image', 'video'],
                         
               ],
             }}
           />
              <TextField
                label="Tags"
                fullWidth
                value={selectedArticle.tags.join(', ')}
                onChange={(e) =>
                  setSelectedArticle({
                    ...selectedArticle,
                    tags: e.target.value.split(',').map((tag) => tag.trim()),
                  })
                }
              />
              <TextField
                label="YouTube Link"
                fullWidth
                value={selectedArticle.youtubeLink}
                onChange={(e) => setSelectedArticle({ ...selectedArticle, youtubeLink: e.target.value })}
              />
              <TextField
                label="Category"
                fullWidth
                select
                value={selectedArticle.category}
                onChange={(e) => setSelectedArticle({ ...selectedArticle, category: e.target.value })}
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="politics">Politics</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="economics">Economics</MenuItem>
                <MenuItem value="lifestyle">Lifestyle</MenuItem>
                <MenuItem value="tourism">Tourism</MenuItem>
                <MenuItem value="mountaineering">Mountaineering</MenuItem>
                <MenuItem value="international">International</MenuItem>
                <MenuItem value="photogallery">PhotoGallery</MenuItem>
              </TextField>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedArticle({ ...selectedArticle, newPhoto: e.target.files[0] })}
              />
            </div>
          
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EnglishArticleList;
