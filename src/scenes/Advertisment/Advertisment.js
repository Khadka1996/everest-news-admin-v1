import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Link as LinkIcon,
  Campaign as CampaignIcon,
  PhotoCamera as PhotoCameraIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import API_URL from '../../config';

const Advertisement = () => {
  const [formData, setFormData] = useState({
    websiteLink: '',
    position: '',
    photo: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdAds, setCreatedAds] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error for photo
      setErrors({ ...errors, photo: null });
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
    if (!formData.websiteLink.trim()) newErrors.websiteLink = 'Website link is required';
    if (!formData.position) newErrors.position = 'Please select a position';
    if (!formData.photo) newErrors.photo = 'Advertisement image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields', { 
        position: 'top-center',
        className: 'rounded-xl',
      });
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('image', formData.photo);
    formDataToSend.append('websiteLink', formData.websiteLink);
    formDataToSend.append('position', formData.position);

    try {
      const response = await axios.post(`${API_URL}/api/advertisements/create`, formDataToSend);
      
      // Add new ad to the list
      setCreatedAds(prev => [response.data.advertisement, ...prev]);
      
      toast.success('Advertisement created successfully', {
        position: 'top-center',
        className: 'rounded-xl bg-green-50 text-green-800',
        icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      });

      // Clear form fields
      setFormData({
        websiteLink: '',
        position: '',
        photo: null,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast.error('Failed to create advertisement', { 
        position: 'top-center',
        className: 'rounded-xl bg-red-50 text-red-800',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      websiteLink: '',
      position: '',
      photo: null,
    });
    setPreviewImage(null);
    setErrors({});
  };

  const handleRemoveAd = (index) => {
    setCreatedAds(prev => prev.filter((_, i) => i !== index));
  };

  // Position categories for organization
  const positionGroups = {
    'Nepali Positions': [
      'nepali_top', 'nepali_belowbreaking', 'nepali_belowtourism', 'nepali_sidebar1',
      'nepali_sidebar2', 'nepali_beloweconomics', 'nepali_premium', 'nepali_belowaviation',
      'nepali_belowinternational', 'nepali_belowthoughts', 'nepali_belowentertainment',
      'nepali_belowphotogallery', 'nepali_belowvideo', 'nepali_popup', 'nepali_middletag',
      'nepali_belowtag', 'nepali_incontent', 'nepali_incontent_2', 'nepali_incontent_3'
    ],
    'English Positions': [
      'english_premium', 'english_top', 'english_top2', 'english_politics', 'english_economics',
      'english_lifestyle', 'english_sports', 'english_tourism', 'english_sidebar1', 'english_sidebar2',
      'english_popup', 'english_international', 'english_photogallery', 'english_videogallery',
      'english_society', 'english_science', 'english_incontent', 'english_incontent_2', 'english_incontent_3'
    ],
    'General Positions': [
      'top', 'middle', 'bottom', 'below_category'
    ]
  };

  const formatPositionLabel = (position) => {
    return position.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
            <CampaignIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advertisement Manager</h1>
          <p className="text-gray-600">Create and manage your advertisement campaigns</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-4">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <AddIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Create New Ad</h2>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    {/* Website Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website Link <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="websiteLink"
                          value={formData.websiteLink}
                          onChange={handleInputChange}
                          className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.websiteLink ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                          placeholder="https://example.com"
                        />
                      </div>
                      {errors.websiteLink && (
                        <p className="mt-1 text-xs text-red-600">{errors.websiteLink}</p>
                      )}
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Image <span className="text-red-500">*</span>
                      </label>
                      
                      <div className="flex items-center space-x-3">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                          {previewImage ? (
                            <div className="relative">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="w-12 h-12 rounded-lg object-cover border-2 border-indigo-100"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage(null);
                                  setFormData({ ...formData, photo: null });
                                }}
                                className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <CloseIcon className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className={`w-12 h-12 rounded-lg border-2 border-dashed ${errors.photo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} flex items-center justify-center`}>
                              <PhotoCameraIcon className={`w-4 h-4 ${errors.photo ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                          )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1">
                          <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="photo"
                            className="inline-flex items-center px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors duration-200 text-sm w-full justify-center"
                          >
                            <CloudUploadIcon className="w-4 h-4 mr-1" />
                            {previewImage ? 'Change' : 'Upload'}
                          </label>
                        </div>
                      </div>
                      {errors.photo && (
                        <p className="mt-1 text-xs text-red-600">{errors.photo}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">Max 5MB</p>
                    </div>

                    {/* Position Select */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position <span className="text-red-500">*</span>
                      </label>
                      
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border ${errors.position ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                      >
                        <option value="">Select a position</option>
                        {Object.entries(positionGroups).map(([groupName, positions]) => (
                          <optgroup key={groupName} label={groupName}>
                            {positions.map((pos) => (
                              <option key={pos} value={pos}>
                                {formatPositionLabel(pos)}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {errors.position && (
                        <p className="mt-1 text-xs text-red-600">{errors.position}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        disabled={isLoading}
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          'Create Ad'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Live Preview Section - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <CampaignIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Live Ad Previews</h2>
                  </div>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">
                    {createdAds.length} Active
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {createdAds.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <CampaignIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">No advertisements yet</h3>
                    <p className="text-gray-500 text-sm">Create your first ad using the form</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {createdAds.map((ad, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow relative group"
                      >
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveAd(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Image container with aspect ratio handling */}
                          <div className="md:w-48 flex-shrink-0">
                            <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                              {/* 16:9 aspect ratio container */}
                              <div className="aspect-w-16 aspect-h-9">
                                <img
                                  src={`${API_URL}/${ad.imagePath}`}
                                  alt="Advertisement"
                                  className="w-full h-full object-contain bg-gray-50"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x225?text=Image+Not+Found';
                                  }}
                                />
                              </div>
                              {/* Image size badge */}
                              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
                                {new Image().src = `${API_URL}/${ad.imagePath}`}
                                <span>Original Size</span>
                              </div>
                            </div>
                          </div>

                          {/* Ad details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {formatPositionLabel(ad.position)}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Created: {new Date().toLocaleDateString()}
                                </p>
                              </div>
                              <a
                                href={ad.websiteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                              >
                                <OpenInNewIcon className="w-4 h-4 mr-1" />
                                Visit
                              </a>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Website Link</p>
                                <p className="text-sm text-gray-800 truncate" title={ad.websiteLink}>
                                  {ad.websiteLink}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Position</p>
                                <p className="text-sm text-gray-800">
                                  {formatPositionLabel(ad.position)}
                                </p>
                              </div>
                            </div>

                            {/* Image dimensions preview */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <PhotoCameraIcon className="w-3 h-3 mr-1" />
                                Original dimensions preserved
                              </span>
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                Aspect ratio: 16:9 container
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Position tag */}
                        <div className="absolute top-4 left-4 md:left-auto md:right-4 md:top-4">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                            {ad.position.split('_')[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-4 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">📋 Image Guidelines</h4>
              <ul className="text-xs text-indigo-700 space-y-1">
                <li>• Images are displayed in a 16:9 aspect ratio container</li>
                <li>• Original image dimensions are preserved with object-fit: contain</li>
                <li>• Images will never be cropped or stretched</li>
                <li>• Background shows if image doesn't fill the container</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
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

export default Advertisement;