import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardActions, Typography, Modal, Box, IconButton, Tooltip
} from '@mui/material';
import { ColorModeContext } from '../../theme';
import API_URL from '../../config';
import { tokens } from '../../theme';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const VideoList = () => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 8;
  
  const mode = 'light';  // You can get this dynamically from your app state
  const colors = tokens(mode);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/videos`);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to fetch videos');
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
  };

  const handleUpdate = async (updatedVideo) => {
    try {
      const formData = new FormData();
      formData.append('title', updatedVideo.title);
      formData.append('videoType', updatedVideo.videoType);

      if (updatedVideo.videoType === 'local') {
        formData.append('localFile', updatedVideo.localFile);
      } else {
        formData.append('youtubeLink', updatedVideo.youtubeLink);
      }

      const response = await axios.put(
        `${API_URL}/api/videos/${updatedVideo._id}`,
        formData
      );

      setEditingVideo(null);
      fetchVideos();
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('Failed to update video');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/videos/${deletingVideo._id}`);
      fetchVideos();
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    } finally {
      setDeletingVideo(null);
      setShowDeleteModal(false);
    }
  };

  const showDeleteConfirmation = (video) => {
    setDeletingVideo(video);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => setShowDeleteModal(false);

  // Styles for modal
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: colors.grey[100],
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
  };

  // Pagination logic
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  const totalPages = Math.ceil(videos.length / videosPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container mt-5" style={{ color: colors.grey[100] }}>
      <Typography variant="h4" align="center" sx={{ marginBottom: '20px', color: colors.blueAccent[500] }}>
        Video List
      </Typography>
      
      {/* Improved Card Layout for Videos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {currentVideos.map((video) => (
          <Card key={video._id} sx={{ boxShadow: 3, borderRadius: '10px', backgroundColor: colors.grey[50] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {video.title}
              </Typography>
              <Typography variant="body2" color={colors.grey[700]}>
                Video Type: {video.videoType}
              </Typography>
              {video.videoType === 'youtube' ? (
                <Typography variant="body2" color={colors.blueAccent[500]}>
                  YouTube Link: <a href={video.youtubeLink} target="_blank" rel="noopener noreferrer">Watch</a>
                </Typography>
              ) : (
                <Typography variant="body2" color={colors.greenAccent[500]}>
                  <a href={`${API_URL}/${video.videoFile}`} target="_blank" rel="noopener noreferrer">
                    View Local File
                  </a>
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <Tooltip title="Edit Video">
                <IconButton
                  sx={{ backgroundColor: colors.greenAccent[500], color: '#fff' }}
                  onClick={() => handleEdit(video)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Video">
                <IconButton
                  sx={{ backgroundColor: colors.redAccent[500], color: '#fff' }}
                  onClick={() => showDeleteConfirmation(video)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          <ArrowBackIosIcon sx={{ color: colors.blueAccent[500] }} />
        </IconButton>
        <Typography>Page {currentPage} of {totalPages}</Typography>
        <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
          <ArrowForwardIosIcon sx={{ color: colors.blueAccent[500] }} />
        </IconButton>
      </Box>

      {/* Edit Video Section */}
      {editingVideo && (
        <Box mt={4}>
          <Typography variant="h5">Edit Video</Typography>
          <form onSubmit={() => handleUpdate(editingVideo)}>
            <TextField
              label="Title"
              value={editingVideo.title}
              onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Video Type</InputLabel>
              <Select
                value={editingVideo.videoType}
                onChange={(e) => setEditingVideo({ ...editingVideo, videoType: e.target.value })}
              >
                <MenuItem value="local">Local</MenuItem>
                <MenuItem value="youtube">YouTube</MenuItem>
              </Select>
            </FormControl>

            {editingVideo.videoType === 'local' && (
              <TextField
                type="file"
                onChange={(e) => setEditingVideo({ ...editingVideo, localFile: e.target.files[0] })}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            )}

            {editingVideo.videoType === 'youtube' && (
              <TextField
                label="YouTube Link"
                value={editingVideo.youtubeLink}
                onChange={(e) => setEditingVideo({ ...editingVideo, youtubeLink: e.target.value })}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: colors.blueAccent[500], color: '#fff' }}
            >
              Update Video
            </Button>
          </form>
        </Box>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={handleCloseModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="delete-modal-title" variant="h6" component="h2" color={colors.redAccent[500]}>
            Confirm Delete
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this video?
          </Typography>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              onClick={handleCloseModal}
              sx={{ backgroundColor: colors.grey[500], color: '#fff' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              sx={{ backgroundColor: colors.redAccent[500], color: '#fff' }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default VideoList;
