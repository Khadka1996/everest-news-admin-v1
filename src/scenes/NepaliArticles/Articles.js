import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import { Box, TextField, Button, useTheme, CircularProgress } from "@mui/material";
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from 'react-toastify';
import { Switch, FormControlLabel } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Radio } from "@mui/material";
import CreateGallery from './CreateGallery';
import { tokens } from "../../theme";
import API_URL from '../../config';

const Article = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [status, setStatus] = useState("draft");
  const [publishDate, setPublishDate] = useState(null);
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    content: '',
    selectedTags: [],
    selectedAuthors: [],
    photos: [],
    youtubeLink: '',
    selectedCategory: '',
  });
  
  
  const [categories, setCategories] = useState([]);
  const [suggestedAuthors, setSuggestedAuthors] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoSource, setPhotoSource] = useState('local');

  // Fetch categories, authors, and tags
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle photo source selection
  const handlePhotoSourceChange = (e) => {
    setPhotoSource(e.target.value);
  };

  // Handle photo removal
  const handleRemovePhoto = (index) => {
    setFormData(prev => {
      const updatedPhotos = [...prev.photos];
      URL.revokeObjectURL(updatedPhotos[index].url); // Clean up URL
      updatedPhotos.splice(index, 1);
      return { ...prev, photos: updatedPhotos };
    });
  };

  // Handle file input changes
  const handleFileChange = async (e) => {
    const filesArray = Array.from(e.target.files);
    const updatedPhotos = filesArray.map(file => ({ file, url: URL.createObjectURL(file) }));
    
    // Log files to ensure they are being correctly added
    console.log("Files selected:", filesArray);

    setFormData(prev => ({
        ...prev,
        photos: updatedPhotos,
    }));
};


  // Handle author selection
  const handleAuthorSelection = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      selectedAuthors: selectedOptions,
    }));
  };

  // Handle tag selection
  const handleTagSelection = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: selectedOptions,
    }));
  };

  // Handle category selection
  const handleCategorySelection = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      selectedCategory: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Form submission started...");

    // Validate the content
    if (!formData.content) {
        toast.error("Content is required.");
        setIsSubmitting(false);
        console.log("Validation failed: Content is missing.");
        return;
    }

    // Validate that at least one photo is uploaded or selected
    if (formData.photos.length === 0) {
        toast.error("At least one photo is required.");
        setIsSubmitting(false);
        console.log("Validation failed: No photos uploaded or selected.");
        return;
    }
     // Validate publish date for scheduled status
     if (status === "scheduled" && !publishDate) {
      toast.error("Publish date is required for scheduled articles.");
      setIsSubmitting(false);
      return;
  }

    try {
        // Create a new FormData object to submit data
        const formDataToSend = new FormData();
        formDataToSend.append('headline', formData.headline);
        formDataToSend.append('subheadline', formData.subheadline);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('youtubeLink', formData.youtubeLink);
        formDataToSend.append('category', formData.selectedCategory);
        formDataToSend.append('publishDate', publishDate || null);
        formDataToSend.append('status', status);

        console.log("Basic form data added to FormData.");

        // Add tags and authors
        console.log("Adding selected tags:", formData.selectedTags);
        formData.selectedTags.forEach(tag => formDataToSend.append('selectedTags', tag.value));

        console.log("Adding selected authors:", formData.selectedAuthors);
        formData.selectedAuthors.forEach(author => formDataToSend.append('selectedAuthors', author.value));
// Log photos before submission
console.log("Form Data Photos:", formData.photos);
// Append photos to formData
formData.photos.forEach((photo, index) => {
  if (photo.file) {
      // If photo is a file (from local upload), append it as a file
      formDataToSend.append('photos', photo.file);
      console.log(`Local Photo #${index + 1} (${photo.file.name}) added to FormData.`);
  } else if (photo.url) {
      // If it's a gallery photo, append the URL as a string
      formDataToSend.append('photos', photo.url);
      console.log(`Gallery Photo #${index + 1} (${photo.url}) added to FormData.`);
  } else {
      console.log(`Photo #${index + 1} is invalid:`, photo);
  }
});

// Log the complete FormData before sending
console.log("Complete FormData Submission:", Array.from(formDataToSend.entries()));

        // Log submitted data for debugging
        console.log("Submitted Photos Array:", formData.photos);
        console.log("Complete FormData Submission:", Array.from(formDataToSend.entries()).reduce((acc, [key, value]) => {
            acc[key] = value instanceof File ? value.name : value;
            return acc;
        }, {}));

        // Make the API request to create the article
        const response = await axios.post(`${API_URL}/api/articles/create`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log("API response:", response.data);

        // On success, show a toast message and reset the form
        toast.success("Article created successfully!");
        console.log("Article created successfully! Resetting form...");

        // Reset form data
        setFormData({
            headline: '',
            subheadline: '',
            content: '',
            selectedTags: [],
            selectedAuthors: [],
            photos: [],
            youtubeLink: '',
            selectedCategory: '',
        });
        setStatus("draft");
        setPublishDate(null);
        
    } catch (error) {
        toast.error("Error creating article!");
        console.error('Error creating article:', error.response ? error.response.data : error.message);
        console.log("Form submission failed.");
    } finally {
        setIsSubmitting(false);
        console.log("Form submission process finished.");
    }
};



  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h2 className="text-3xl font-semibold text-center mb-6">Create Article</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-4">
        <div className='ml-auto'>
  {["draft", "scheduled", "published"].map((stat) => (
    <FormControlLabel
      key={stat}
      control={
        <Switch 
          checked={status === stat} 
          onChange={() => handleStatusChange(stat)} 
          color="secondary" // Set color here
        />
      }
      label={stat.charAt(0).toUpperCase() + stat.slice(1)}
    />
  ))}
</div>


          {status === "scheduled" && (
            <div className="flex flex-col">
  <label className="block text-xl font-medium mb-2">Publish Date</label>
  <LocalizationProvider 

  dateAdapter={AdapterDateFns}>
    <DateTimePicker
      label="Choose date and time"
      value={publishDate}
      onChange={setPublishDate}
      renderInput={(params) => (
        <TextField 
          {...params} 
          variant="outlined" 
          fullWidth 
          InputLabelProps={{ shrink: true }} 
          
        />
      )}
    />
  </LocalizationProvider>
</div>

          )}
        </div>

        <Box className="mb-4 mt-2">
        <label className="block text-xl font-medium mb-2">Headline</label>
          <TextField
            name="headline"
            label="Enter headline"
            variant="outlined"
            color="secondary"
            fullWidth
            value={formData.headline}
            onChange={handleInputChange}
            required
          />
        </Box>

        <Box className="mb-4 mt-2">
        <label className="block text-xl font-medium mb-2">Sub Headline</label>
          <TextField
            name="subheadline"
            label="Enter Sub headline"
            variant="outlined"
            color="secondary"
            fullWidth
            value={formData.subheadline}
            onChange={handleInputChange}
          />
        </Box>

        <div>
          <label className="block text-xl font-medium mb-2">Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
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
                ['undo', 'redo'],  
                ['table'],          
                ['horizontal'], 
              ],
            }}
          />

        </div>

        <div>
          <label className="block text-xl font-medium mb-2">Choose Authors</label>
          <Select
            isMulti
            options={suggestedAuthors.map(author => ({
              value: author._id,
              label: `${author.firstName} ${author.lastName}`,
            }))}
            onChange={handleAuthorSelection}
            value={formData.selectedAuthors}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xl font-medium mb-2">Choose Tags</label>
          <Select
            isMulti
            options={suggestedTags.map(tag => ({ value: tag._id, label: tag.name }))}
            onChange={handleTagSelection}
            value={formData.selectedTags}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xl font-medium mb-2">Photos</label>
          <div className="mb-4">
  <FormControlLabel
    control={
      <Radio
        checked={photoSource === 'local'}
        onChange={handlePhotoSourceChange}
        value="local"
        sx={{
          color: 'primary', // Use the secondary color from your theme
          '&.Mui-checked': {
            color: 'secondary.main', // Color when checked
          },
        }}
      />
    }
    label="Upload from Local Device"
    sx={{
      color: 'primary', // Label color
    }}
  />
  <FormControlLabel
    control={
      <Radio
        checked={photoSource === 'gallery'}
        onChange={handlePhotoSourceChange}
        value="gallery"
        sx={{
          color: 'primary', // Use the secondary color from your theme
          '&.Mui-checked': {
            color: 'secondary.main', // Color when checked
          },
        }}
      />
    }
    label="Add from Gallery"
    sx={{
      color: 'primary', // Label color
    }}
  />
</div>

          {photoSource === 'local' && (
            <input
              type="file"
              name="photos"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          )}

          {photoSource === 'gallery' && (
            <CreateGallery setSelectedPhotos={(photos) => {
              if (photos.length > 0) {
                setFormData(prev => ({
                  ...prev,
                  photos: [photos[0]], // Set to selected photo
                }));
              } else {
                setFormData(prev => ({
                  ...prev,
                  photos: [], // Clear if no photo is selected
                }));
              }
            }} />
          )}

          {formData.photos.length > 0 && (
            <div className="mt-2 grid grid-cols-1 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo.file instanceof File ? photo.url : photo.url} // Adjust as needed
                    alt={`Photo ${index + 1}`}
                    className="object-cover w-full rounded-lg"
                  />
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xl font-medium mb-2">YouTube Link</label>
          <input
            type="text"
            name="youtubeLink"
            onChange={handleInputChange}
            value={formData.youtubeLink}
            placeholder="Your YouTube link here..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xl font-medium mb-2">Select Category</label>
          <Select
            options={categories.map(category => ({ value: category._id, label: category.name }))}
            onChange={handleCategorySelection}
            value={formData.selectedCategory ? { value: formData.selectedCategory, label: categories.find(cat => cat._id === formData.selectedCategory)?.name || formData.selectedCategory } : null}
            className="w-full"
          />
        </div>

        <div className="text-center mt-6">
          {isSubmitting ? (
            <CircularProgress size={28} />
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className="w-full"
            >
              Create Article
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Article;
