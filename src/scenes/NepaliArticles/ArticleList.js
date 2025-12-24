import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateForm from './UpdateForm'; // Adjust the path as necessary
import API_URL from '../../config';

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [articleToUpdate, setArticleToUpdate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 20,
  });

  const { page, totalPages, limit } = pagination;

  useEffect(() => {
    fetchArticles();
  }, [page, searchTerm, sortBy, sortOrder]);

  // Fetching articles with search, sort, and pagination
  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/articles/all`, {
          params: {
            page,
            limit,
            search: searchTerm,
            sortBy,
            sortOrder,
          },
        }
      );
      setArticles(response.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data?.pagination?.totalPages || 1,
      }));
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  // Debounce search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle article deletion
  const handleDeleteArticle = async () => {
    try {
      await axios.delete(`${API_URL}/api/articles/${articleToDelete._id}`);
      setArticleToDelete(null);
      setShowDeleteModal(false);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleShowDeleteModal = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleHideDeleteModal = () => {
    setArticleToDelete(null);
    setShowDeleteModal(false);
  };

  // Handle article update
  const handleShowUpdateModal = (article) => {
    setArticleToUpdate(article);
    setShowUpdateModal(true);
  };

  const handleUpdateArticle = async (articleId, formData) => {
    try {
      await axios.put(`${API_URL}/api/articles/update/${articleId}`, formData);
      fetchArticles(); // Refresh articles after update
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const resetUpdateForm = () => {
    setArticleToUpdate(null);
    setShowUpdateModal(false);
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-center mb-4 text-2xl font-bold">News List</h2>

      {/* Search Section */}
      <div className="mb-3 flex items-center">
        <TextField
          variant="outlined"
          label="Search by headline..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mr-2"
        />
        <FormControl variant="outlined" className="mr-2">
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort by">
            <MenuItem value="createdAt">Date</MenuItem>
            <MenuItem value="headline">Headline</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="mr-2">
          <InputLabel>Order</InputLabel>
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Order">
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Articles Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Headline</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="border border-gray-300 px-4 py-2">{article.headline}</td>
                <td className="border border-gray-300 px-4 py-2">{article.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        onClick={() => handleShowUpdateModal(article)}
                        color="primary"
                        aria-label="Edit article"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        onClick={() => handleShowDeleteModal(article)}
                        color="error"
                        aria-label="Delete article"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button
          variant="contained"
          onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <Button
          variant="contained"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(prev.page + 1, totalPages),
            }))
          }
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>

      {/* Delete Modal */}
      <Modal open={showDeleteModal} onClose={handleHideDeleteModal}>
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this article?</p>
            <div className="mt-4 flex justify-between">
              <Button variant="contained" color="secondary" onClick={handleDeleteArticle}>
                Confirm
              </Button>
              <Button variant="outlined" color="primary" onClick={handleHideDeleteModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Update Form Modal */}
      <UpdateForm
        open={showUpdateModal}
        onClose={resetUpdateForm}
        article={articleToUpdate}
        onUpdate={handleUpdateArticle}
      />
    </div>
  );
};

export default NewsList;
