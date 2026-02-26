import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import API_URL from '../../config';

const CategoryItem = ({ category, onUpdate, onDelete }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-indigo-100">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
            <CategoryIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
            <p className="text-sm text-gray-500">ID: {category._id.slice(-6)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onUpdate(category)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
            aria-label="Edit category"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            aria-label="Delete category"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal Content */}
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

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateFormData, setUpdateFormData] = useState('');
  const [addFormData, setAddFormData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (category) => {
    setSelectedCategory(category._id);
    setUpdateFormData(category.name);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`${API_URL}/api/categories/${selectedCategory}`, {
        name: updateFormData,
      });
      fetchCategories();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleAddSubmit = async () => {
    try {
      await axios.post(`${API_URL}/api/categories`, { name: addFormData });
      fetchCategories();
      setShowAddModal(false);
      setAddFormData('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDelete = (category) => {
    setSelectedCategory(category._id);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`${API_URL}/api/categories/${selectedCategory}`);
      fetchCategories();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Dashboard stats
  const totalCategories = categories.length;
  const activeCategories = categories.length; // You can modify this based on your data
  const recentCategories = categories.slice(0, 3).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <DashboardIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Category Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage and organize your product categories
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transform transition-all duration-200 hover:scale-105"
            >
              <AddIcon className="w-5 h-5 mr-2" />
              New Category
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <CategoryIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Total Categories</p>
                <p className="text-2xl font-semibold text-slate-900">{totalCategories}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <InventoryIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Active Categories</p>
                <p className="text-2xl font-semibold text-slate-900">{activeCategories}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUpIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Recent Added</p>
                <p className="text-2xl font-semibold text-slate-900">{recentCategories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">All Categories</h2>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                {totalCategories} total
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-3 bg-slate-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <CategoryIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">No categories yet</h3>
                <p className="mt-2 text-slate-500">Get started by creating your first category</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <AddIcon className="w-5 h-5 mr-2" />
                  Add Category
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <CategoryItem
                    key={category._id}
                    category={category}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Category"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={addFormData}
              onChange={(e) => setAddFormData(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter category name"
              autoFocus
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-500/30"
            >
              Add Category
            </button>
          </div>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal 
        isOpen={showUpdateModal} 
        onClose={() => setShowUpdateModal(false)}
        title="Update Category"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="updateCategory" className="block text-sm font-medium text-slate-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="updateCategory"
              value={updateFormData}
              onChange={(e) => setUpdateFormData(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter category name"
              autoFocus
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-500/30"
            >
              Update
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center p-3 bg-red-50 rounded-xl">
            <WarningIcon className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-center text-slate-600">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSubmit}
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

export default Category;