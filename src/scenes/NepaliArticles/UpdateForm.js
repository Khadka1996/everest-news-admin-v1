import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Switch,
  FormControlLabel,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import CreateGallery from './CreateGallery';
import API_URL from '../../config';

const UpdateForm = ({
  open,
  onClose,
  article,
  onUpdate,
  categories: initialCategories = [],
  tags: initialTags = [],
  authors: initialAuthors = [],
  photos: initialPhotos = []
}) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [suggestedAuthors, setSuggestedAuthors] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [selectedAuthors, setSelectedAuthors] = useState(initialAuthors);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Store the selected photo
  const [photoPreview, setPhotoPreview] = useState(null); // To show photo preview

  const resetForm = () => {
    setSelectedArticle(null);
    setIsPublished(false);
    setSelectedTags(initialTags);
    setSelectedAuthors(initialAuthors);
    setSelectedCategory(null);
    setSelectedPhoto(null); // Reset selected photo
    setPhotoPreview(null); // Reset photo preview
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, authorsResponse, tagsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/authors`),
          axios.get(`${API_URL}/api/tags`),
        ]);

        setCategories(categoriesResponse.data?.data || []);
        setSuggestedAuthors(authorsResponse.data?.authors || []);
        setSuggestedTags(tagsResponse.data?.data || []);
      } catch (error) {
        toast.error("Error fetching data!");
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (article) {
      setSelectedArticle({
        ...article,
        tags: article.tags ? article.tags.join(', ') : '',
      });
      setIsPublished(article.status === 'published');
      setSelectedTags(article.tags ? article.tags.map(tag => ({ value: tag._id, label: tag.name })) : []);
      setSelectedCategory(article.category ? { value: article.category._id, label: article.category.name } : null);
      setSelectedAuthors(article.authors ? article.authors.map(author => ({ value: author._id, label: `${author.firstName} ${author.lastName}` })) : []);
      setSelectedPhoto(null); // Reset selected photo on article load
      setPhotoPreview(null); // Reset photo preview
    }
  }, [article]);
  const handleUpdate = async () => {
    if (!selectedArticle?.headline || !selectedArticle?.content || !selectedCategory) {
      toast.error('Please fill in all the required fields.');
      return;
    }
  
    setIsUpdating(true);
    const updatedArticle = new FormData();
    updatedArticle.append('headline', selectedArticle.headline);
    updatedArticle.append('subheadline', selectedArticle.subheadline);
    updatedArticle.append('content', selectedArticle.content);
    updatedArticle.append('status', isPublished ? 'published' : 'draft');
    updatedArticle.append('youtubeLink', selectedArticle.youtubeLink);
  
    // Handle selectedTags
    const tagsArray = selectedTags.length > 0 ? selectedTags.map(tag => tag.value) : article.selectedTags.map(tag => tag._id);
    updatedArticle.append('selectedTags', JSON.stringify(tagsArray));
  
    // Handle selectedAuthors
    const authorsArray = selectedAuthors.length > 0 ? selectedAuthors.map(author => author.value) : article.selectedAuthors.map(author => author._id);
    updatedArticle.append('selectedAuthors', JSON.stringify(authorsArray));
  
    // Handle category
    updatedArticle.append('category', selectedCategory ? selectedCategory.value : article.category._id);
  
    // Only add photo if selectedPhoto is provided
    if (selectedPhoto) {
      console.log("New photo selected:", selectedPhoto);
      updatedArticle.append('photos', selectedPhoto);
    } else {
      // Don't add a photo if no new photo is selected (use existing photo)
      if (initialPhotos.length > 0) {
        console.log("Using initial photo:", initialPhotos[0]);
        updatedArticle.append('photos', initialPhotos[0]); // Append the initial photo
      }
    }
  
    try {
      const response = await onUpdate(article._id, updatedArticle);
      if (response) {
        toast.success('Article updated successfully!');
        onClose();
        resetForm();
      } else {
        throw new Error("Response was undefined");
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Error updating article. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  

  const handleTagSelection = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  const handleAuthorSelection = (selectedOptions) => {
    setSelectedAuthors(selectedOptions);
  };

  const handleCategorySelection = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setSelectedPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result); // Set the preview of the photo
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <Dialog open={open} onClose={() => { resetForm(); onClose(); }} fullWidth maxWidth="md">
      <DialogTitle>
        Update Article
        <FormControlLabel
          control={
            <Switch
              checked={isPublished}
              onChange={() => setIsPublished(!isPublished)}
              color="primary"
            />
          }
          label={isPublished ? 'Published' : 'Draft'}
          labelPlacement="start"
          style={{ float: 'right' }}
        />
      </DialogTitle>

      <DialogContent>
        {selectedArticle && (
          <div className="space-y-4 mt-10">
            <TextField
              label="Headline"
              fullWidth
              value={selectedArticle.headline}
              onChange={(e) => setSelectedArticle({ ...selectedArticle, headline: e.target.value })}
            />
            <TextField
              label="Sub Headline"
              fullWidth
              value={selectedArticle.subheadline}
              onChange={(e) => setSelectedArticle({ ...selectedArticle, subheadline: e.target.value })}
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

            <div>
              <label className="block text-xl font-medium mb-2">Choose Tags</label>
              <Select
                isMulti
                options={suggestedTags.map(tag => ({ value: tag._id, label: tag.name }))}
                onChange={handleTagSelection}
                value={selectedTags}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xl font-medium mb-2">Selected Tags</label>
              <div className="flex flex-wrap">
                {selectedTags.map(tag => (
                  <span key={tag.value} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2 mb-2">
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xl font-medium mb-2">Choose Authors</label>
              <Select
                isMulti
                options={suggestedAuthors.map(author => ({ value: author._id, label: `${author.firstName} ${author.lastName}` }))}
                onChange={handleAuthorSelection}
                value={selectedAuthors}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xl font-medium mb-2">Choose Category</label>
              <Select
                options={categories.map(category => ({ value: category._id, label: category.name }))}
                onChange={handleCategorySelection}
                value={selectedCategory}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xl font-medium mb-2">Upload a New Photo</label>
              <input
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
                className="mb-4"
              />
              {photoPreview && <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover mt-2" />}
            </div>

          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => { resetForm(); onClose(); }} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          color="primary"
          disabled={isUpdating}
        >
          {isUpdating ? <CircularProgress size={24} /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateForm;
