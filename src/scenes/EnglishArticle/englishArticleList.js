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
  Paper,
  Box,
  Card,
  CardMedia,
  useTheme,
  useMediaQuery,
  Grid,
  Alert,
  Snackbar,
  Chip,
  Divider,
  InputAdornment
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API_URL from '../../config';

const EnglishArticleList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, articleId: null });
  const [updateModal, setUpdateModal] = useState({ open: false, article: null });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Feedback
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const articlesPerPage = 12;

  // Categories
  const categories = [
    { value: 'politics', label: 'Politics' },
    { value: 'sports', label: 'Sports' },
    { value: 'economics', label: 'Economics' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'tourism', label: 'Tourism' },
    { value: 'international', label: 'International' },
    { value: 'photogallery', label: 'Photo Gallery' },
    { value: 'videogallery', label: 'Video Gallery' },
    { value: 'society', label: 'Society' },
    { value: 'science', label: 'Science' }
  ];

  // Rich text editor modules
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean'],
    ],
  };

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  useEffect(() => {
    // Filter articles based on search term
    const filtered = articles.filter(article =>
      article.headline?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/english/all?page=${currentPage}&limit=${articlesPerPage}`
      );
      const { data, pagination } = response.data;
      setArticles(data);
      setFilteredArticles(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      showSnackbar('Error fetching articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDeleteClick = (articleId) => {
    setDeleteModal({ open: true, articleId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/english/${deleteModal.articleId}`);
      setArticles(articles.filter((article) => article._id !== deleteModal.articleId));
      showSnackbar('Article deleted successfully');
      handleCloseDeleteModal();
    } catch (error) {
      showSnackbar('Error deleting article', 'error');
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ open: false, articleId: null });
  };

  const handleEditClick = async (articleId) => {
    try {
      const response = await axios.get(`${API_URL}/api/english/byId/${articleId}`);
      const article = response.data.data;
      setUpdateModal({ open: true, article });
    } catch (error) {
      showSnackbar('Error loading article details', 'error');
    }
  };

  const handleUpdate = async () => {
    if (!updateModal.article) return;

    try {
      const formData = new FormData();
      const article = updateModal.article;
      
      // Add text fields
      formData.append('headline', article.headline);
      formData.append('content', article.content);
      formData.append('category', article.category);
      formData.append('youtubeLink', article.youtubeLink || '');
      
      // Add photo only if new one is selected
      if (article.newPhoto) {
        formData.append('photos', article.newPhoto);
      }

      const response = await axios.put(
        `${API_URL}/api/english/update/${article._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      setArticles(articles.map((a) =>
        a._id === article._id ? response.data.data : a
      ));
      showSnackbar('Article updated successfully!');
      handleCloseUpdateModal();
    } catch (error) {
      showSnackbar('Error updating article: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const handleCloseUpdateModal = () => {
    setUpdateModal({ open: false, article: null });
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const renderMobileView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {filteredArticles.map((article) => (
        <Card key={article._id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {article.photos?.[0] && (
            <CardMedia
              component="img"
              height="180"
              image={`${API_URL}/uploads/english/${article.photos[0]}`}
              alt={article.headline}
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x180?text=No+Image'}
              sx={{ objectFit: 'cover' }}
            />
          )}
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {article.headline}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={article.category} 
                size="small" 
                color="primary" 
                variant="outlined"
                icon={<CategoryIcon fontSize="small" />}
              />
              {article.youtubeLink && <YouTubeIcon color="action" fontSize="small" />}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <IconButton size="small" onClick={() => handleEditClick(article._id)} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDeleteClick(article._id)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>
              <TableSortLabel active>Headline</TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredArticles.map((article) => (
            <TableRow key={article._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ width: 120 }}>
                {article.photos?.[0] ? (
                  <Box
                    component="img"
                    src={`${API_URL}/uploads/english/${article.photos[0]}`}
                    alt={article.headline}
                    sx={{ 
                      width: 80, 
                      height: 60, 
                      objectFit: 'cover', 
                      borderRadius: 1,
                      border: '1px solid #eee'
                    }}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/80x60?text=No+Image'}
                  />
                ) : (
                  <Box sx={{ 
                    width: 80, 
                    height: 60, 
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                  }}>
                    <ImageIcon color="disabled" />
                  </Box>
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ 
                  maxWidth: 350, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  fontWeight: 500
                }}>
                  {article.headline}
                </Typography>
                {article.youtubeLink && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <YouTubeIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="caption" color="textSecondary">Video attached</Typography>
                  </Box>
                )}
              </TableCell>
              <TableCell>
                <Chip 
                  label={article.category} 
                  size="small" 
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton size="small" onClick={() => handleEditClick(article._id)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteClick(article._id)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#2c3e50' }}>
        English Articles
      </Typography>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <TextField
          placeholder="Search articles by headline..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ bgcolor: '#fff' }}
        />
      </Paper>

      {/* Articles Display */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading articles...</Typography>
        </Box>
      ) : filteredArticles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography color="textSecondary">No articles found</Typography>
        </Paper>
      ) : (
        <>
          {isMobile || isTablet ? renderMobileView() : renderDesktopView()}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteModal.open} 
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this article? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteModal} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Article Dialog */}
      <Dialog 
        open={updateModal.open} 
        onClose={handleCloseUpdateModal} 
        fullWidth 
        maxWidth="lg"
        scroll="paper"
      >
        <DialogTitle sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          Update English Article
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {updateModal.article && (
            <Grid container spacing={3}>
              {/* Image Section */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon fontSize="small" /> Article Image
                  </Typography>
                  
                  {/* Current Image */}
                  {updateModal.article.photos?.[0] && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                        Current Image:
                      </Typography>
                      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={`${API_URL}/uploads/english/${updateModal.article.photos[0]}`}
                          alt={updateModal.article.headline}
                          sx={{ objectFit: 'cover' }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/400x180?text=No+Image'}
                        />
                      </Card>
                    </Box>
                  )}

                  {/* Image Upload */}
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                      {updateModal.article.photos?.[0] ? 'Change Image (Optional):' : 'Upload Image:'}
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setUpdateModal({
                          ...updateModal,
                          article: { ...updateModal.article, newPhoto: e.target.files[0] }
                        })}
                      />
                    </Button>
                    {updateModal.article.newPhoto && (
                      <Chip 
                        label={updateModal.article.newPhoto.name}
                        size="small"
                        color="success"
                        sx={{ mt: 1, width: '100%' }}
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Content Section */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 3 }}>
                    Article Details
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Headline */}
                    <Grid item xs={12}>
                      <TextField
                        label="Headline"
                        fullWidth
                        value={updateModal.article.headline || ''}
                        onChange={(e) => setUpdateModal({
                          ...updateModal,
                          article: { ...updateModal.article, headline: e.target.value }
                        })}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    {/* Category and YouTube Link */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Category"
                        fullWidth
                        select
                        value={updateModal.article.category || ''}
                        onChange={(e) => setUpdateModal({
                          ...updateModal,
                          article: { ...updateModal.article, category: e.target.value }
                        })}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CategoryIcon fontSize="small" color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Select Category</MenuItem>
                        {categories.map(cat => (
                          <MenuItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="YouTube Link (Optional)"
                        fullWidth
                        value={updateModal.article.youtubeLink || ''}
                        onChange={(e) => setUpdateModal({
                          ...updateModal,
                          article: { ...updateModal.article, youtubeLink: e.target.value }
                        })}
                        variant="outlined"
                        size="small"
                        placeholder="https://youtube.com/watch?v=..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <YouTubeIcon fontSize="small" color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Content */}
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                        Content
                      </Typography>
                      <Paper sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
                        <ReactQuill
                          theme="snow"
                          value={updateModal.article.content || ''}
                          onChange={(value) => setUpdateModal({
                            ...updateModal,
                            article: { ...updateModal.article, content: value }
                          })}
                          modules={quillModules}
                          style={{ height: 250, marginBottom: 40 }}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <Divider />
        
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseUpdateModal} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained" 
            color="primary"
            sx={{ px: 4 }}
          >
            Update Article
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnglishArticleList;