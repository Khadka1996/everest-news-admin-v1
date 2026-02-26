import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  PhotoCamera as PhotoCameraIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import API_URL from '../../config';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthorCard = ({ author, onUpdate, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const fullName = [
    author.firstName,
    author.middleName,
    author.lastName
  ].filter(Boolean).join(' ');

  const initials = [
    author.firstName?.[0],
    author.lastName?.[0]
  ].filter(Boolean).join('').toUpperCase();

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {author.photo && !imageError ? (
              <img
                src={`${API_URL}/uploads/authors/${author.photo}`}
                alt={fullName}
                className="w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-24 h-24 rounded-xl border-4 border-white shadow-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <span className="text-2xl font-semibold text-indigo-600">{initials}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-14 p-6">
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">{fullName}</h3>
        
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onUpdate(author)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
          >
            <EditIcon className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(author)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
          >
            <DeleteIcon className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    authorPhoto: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/authors`);
      setAuthors(response.data.authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (author) => {
    setSelectedAuthor(author);
    setUpdateFormData({
      firstName: author.firstName,
      middleName: author.middleName || '',
      lastName: author.lastName,
      authorPhoto: null,
    });
    setPreviewImage(null);
    setShowUpdateModal(true);
  };

  const handleDelete = (author) => {
    setSelectedAuthor(author);
    setShowDeleteModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', updateFormData.firstName);
      formData.append('middleName', updateFormData.middleName);
      formData.append('lastName', updateFormData.lastName);
      if (updateFormData.authorPhoto) {
        formData.append('authorPhoto', updateFormData.authorPhoto);
      }

      await axios.put(`${API_URL}/api/authors/${selectedAuthor._id}`, formData);

      setUpdateFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        authorPhoto: null,
      });
      setPreviewImage(null);

      fetchAuthors();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/authors/${selectedAuthor._id}`);
      fetchAuthors();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateFormData({ ...updateFormData, authorPhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dashboard stats
  const totalAuthors = authors.length;
  const withPhotos = authors.filter(a => a.photo).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <PeopleIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Authors Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your author collection and profiles
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                {totalAuthors} Total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <PeopleIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Authors</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAuthors}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <PersonIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">With Photos</p>
                <p className="text-2xl font-semibold text-gray-900">{withPhotos}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-xl">
                <PhotoCameraIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalAuthors ? Math.round((withPhotos / totalAuthors) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Author Collection</h2>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : authors.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <PeopleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No authors yet</h3>
                <p className="mt-2 text-gray-500">Start building your author collection</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {authors.map((author) => (
                  <AuthorCard
                    key={author._id}
                    author={author}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <Modal 
        isOpen={showUpdateModal} 
        onClose={() => {
          setShowUpdateModal(false);
          setPreviewImage(null);
        }}
        title="Update Author"
      >
        <div className="space-y-4">
          {/* Photo Preview */}
          {(previewImage || selectedAuthor?.photo) && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={previewImage || `${API_URL}/uploads/authors/${selectedAuthor?.photo}`}
                  alt="Preview"
                  className="w-24 h-24 rounded-xl object-cover border-2 border-indigo-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={updateFormData.firstName}
              onChange={(e) => setUpdateFormData({ ...updateFormData, firstName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name (Optional)
            </label>
            <input
              type="text"
              value={updateFormData.middleName}
              onChange={(e) => setUpdateFormData({ ...updateFormData, middleName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter middle name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={updateFormData.lastName}
              onChange={(e) => setUpdateFormData({ ...updateFormData, lastName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Photo
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-500 transition-colors">
                <CloudUploadIcon className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Click to upload photo</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => {
                setShowUpdateModal(false);
                setPreviewImage(null);
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-500/30"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Delete Author"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center p-3 bg-red-50 rounded-xl">
            <WarningIcon className="w-8 h-8 text-red-500" />
          </div>
          
          <p className="text-center text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {selectedAuthor?.firstName} {selectedAuthor?.lastName}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-medium shadow-lg shadow-red-500/30"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AuthorList;