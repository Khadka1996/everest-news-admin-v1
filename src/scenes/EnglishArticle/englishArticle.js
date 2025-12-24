import React, { useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Box, Typography, TextField, Button, useTheme, Card, CardContent, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from "@mui/material";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Cancel as CancelIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { tokens } from "../../theme";
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../config';

const ArticleEnglish = () => {
  const [articleData, setArticleData] = useState({
    headline: '',
    content: '',
    tags: [],
    youtubeLink: '',
    category: '',
    photos: null,
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  
  const [photoPreview, setPhotoPreview] = useState(null); // State for image preview
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData({
      ...articleData,
      [name]: value,
    });
  };

  const handleTagChange = (selectedOptions) => {
    const tags = selectedOptions.map((option) => option.value);
    setArticleData({
      ...articleData,
      tags,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file)); // Set preview URL
      setArticleData({
        ...articleData,
        photos: file,
      });
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null); // Remove preview image
    setArticleData((prevData) => ({
      ...prevData,
      photos: null, // Clear the file from the state
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!articleData.photos) {
      setError('Photo is required.');
      return;
    }

    const formData = new FormData();
    formData.append('headline', articleData.headline);
    formData.append('content', articleData.content);
    formData.append('tags', articleData.tags.join(','));
    formData.append('youtubeLink', articleData.youtubeLink);
    formData.append('category', articleData.category);
    formData.append('photos', articleData.photos || '');

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/english/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success toast notification
      toast.success('Article submitted successfully!');

      // Reset form fields after submission
      setArticleData({
        headline: '',
        content: '',
        tags: [],
        youtubeLink: '',
        category: '',
        photos: null,
      });
      setPhotoPreview(null); // Clear photo preview
    } catch (error) {
      setError('Error creating article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
       <Typography variant="h4" className="mb-4 text-center">
                Create English Article 
            </Typography>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
        <Typography variant="h4" className="mb-2 ">
         Headline
            </Typography>
          
        </div>

        <Box className="mb-4 mt-2">
                <TextField
                name="headline" 
                    label="Enter headline"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    value={articleData.headline}
                    onChange={handleInputChange}
                    required
                />
            </Box>

        <div className="form-group">
        <Typography variant="h4" className="mb-2 ">
         Content
            </Typography>             
            <ReactQuill 
            theme="snow"
            value={articleData.content}
            onChange={(value) => setArticleData({ ...articleData, content: value })}
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
                ['clean'],
              ],
            }}
            required
          />
        </div>

        <div className="form-group">
        <Typography variant="h4" className="mb-2 ">
         Tags
            </Typography>          
            <CreatableSelect className='mt-3'
            isMulti
            onChange={handleTagChange}
            options={articleData.tags.map((tag) => ({ value: tag, label: tag }))}
          />
        </div>

        <div className="form-group">
        <Typography variant="h4" className="mb-2 ">
         Youtube Link
            </Typography>            
             <input
            type="text"
            placeholder="Enter YouTube link"
            name="youtubeLink"
            value={articleData.youtubeLink}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        

        <div className="form-group">
        <Typography variant="h4" className="mb-4 ">
         Category
            </Typography>             
            <Select className='mt-2'
            options={['politics', 'sports', 'economics', 'lifestyle', 'tourism', 'international', 'science', 'society','mountaineering','photogallery'].map((category) => ({
              value: category,
              label: category.charAt(0).toUpperCase() + category.slice(1),
            }))}
            onChange={(selectedOption) => setArticleData({ ...articleData, category: selectedOption.value })}
          />
        </div>

        <div className="form-group">
        <Typography variant="h4" className="mb-2 ">
         Photo
            </Typography>             
            <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded focus:outline-none"
          />
          {photoPreview && (
            <div className="relative mt-4">
              <img src={photoPreview} alt="Uploaded Preview" className="w-40 h-auto rounded border border-gray-300" />
              <IconButton
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full"
                aria-label="remove photo"
              >
                <CancelIcon />
              </IconButton>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>

        {error && (
          <div className="mt-3 text-red-600">
            {error}
          </div>
        )}
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ArticleEnglish;
