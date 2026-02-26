import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  PhotoCamera as PhotoCameraIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import API_URL from '../../config';

const Author = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    authorPhoto: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, authorPhoto: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error for photo
      setErrors({ ...errors, authorPhoto: null });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.authorPhoto) newErrors.authorPhoto = 'Author photo is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAuthor = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields', { 
        position: 'top-center',
        className: 'rounded-xl',
      });
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('middleName', formData.middleName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('authorPhoto', formData.authorPhoto);

      const response = await axios.post(`${API_URL}/api/authors/create`, formDataToSend);

      // Clear form
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        authorPhoto: null,
      });
      setPreviewImage(null);

      // Show success notification
      toast.success(response.data.message, { 
        position: 'top-center',
        className: 'rounded-xl bg-green-50 text-green-800',
        icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      });
    } catch (error) {
      console.error('Error creating author:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'An error occurred while creating the author', { 
        position: 'top-center',
        className: 'rounded-xl bg-red-50 text-red-800',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      authorPhoto: null,
    });
    setPreviewImage(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowBackIcon className="w-5 h-5 mr-2" />
          Back to Authors
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Author</h1>
          <p className="text-gray-600">Fill in the details below to create a new author profile</p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <PersonIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Author Information</h2>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6">
            {/* Photo Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Author Photo <span className="text-red-500">*</span>
              </label>
              
              <div className="flex flex-col items-center">
                {/* Photo Preview */}
                <div className="mb-4">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-32 h-32 rounded-xl object-cover border-4 border-indigo-100 shadow-lg"
                      />
                      <button
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData({ ...formData, authorPhoto: null });
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className={`w-32 h-32 rounded-xl border-2 border-dashed ${errors.authorPhoto ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} flex flex-col items-center justify-center`}>
                      <PhotoCameraIcon className={`w-8 h-8 ${errors.authorPhoto ? 'text-red-400' : 'text-gray-400'}`} />
                      <span className="text-xs text-gray-500 mt-1">No photo</span>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="authorPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="authorPhoto"
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors duration-200"
                  >
                    <CloudUploadIcon className="w-5 h-5 mr-2" />
                    {previewImage ? 'Change Photo' : 'Upload Photo'}
                  </label>
                </div>
                {errors.authorPhoto && (
                  <p className="mt-2 text-sm text-red-600">{errors.authorPhoto}</p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BadgeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BadgeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter middle name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BadgeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                    placeholder="Enter last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Summary Preview */}
              {(formData.firstName || formData.middleName || formData.lastName) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <p className="text-sm text-indigo-600 font-medium mb-2">Preview:</p>
                  <p className="text-gray-800 font-medium">
                    {[
                      formData.firstName,
                      formData.middleName,
                      formData.lastName
                    ].filter(Boolean).join(' ') || 'Author name will appear here'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAuthor}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Author'
                )}
              </button>
            </div>

            {/* Required Fields Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              <span className="text-red-500">*</span> Required fields
            </p>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <h3 className="text-sm font-medium text-indigo-800 mb-2">✨ Tips for better author profiles:</h3>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• Use a clear, professional photo</li>
            <li>• Include middle name if applicable</li>
            <li>• Ensure all required fields are filled</li>
          </ul>
        </div>
      </div>

      {/* Toast Container with custom styling */}
      <ToastContainer 
        position="top-center"
        toastClassName="rounded-xl shadow-lg"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Author;