import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Navbar = ({ onCategoryAdded }) => {
  // State for modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // State for new product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    isAvailable: false
  });

  // State for new category form
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    description: ''
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle product form changes
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle category form changes
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const currentDate = new Date().toISOString();
      
      // Prepare product payload according to API requirements
      const productPayload = {
        name: newProduct.name,
        category: {
          categoryId: parseInt(newProduct.categoryId)
        },
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        isAvailable: newProduct.isAvailable,
        createdAt: currentDate,
        updatedAt: currentDate
      };
  
      // Call API to add product
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productPayload)
      });
  
      // First check if the response is OK (status 200-299)
      if (!response.ok) {
        // Try to get error message from response, fallback to status text
        const errorText = await response.text();
        throw new Error(errorText || response.statusText || 'Failed to create product');
      }
  
      // Only try to parse JSON if there's content
      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If no JSON response, just use the productPayload as success data
        data = productPayload;
      }
  
      toast.success('Product added successfully!');
      
      // Reset form and close modal
      setNewProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        isAvailable: false
      });
      setShowProductModal(false);
  
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error(err.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category submission
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const currentDate = new Date().toISOString();
      const payload = {
        categoryName: newCategory.categoryName,
        categoryDescription: newCategory.description,
        createdAt: currentDate,
        updatedAt: currentDate
      };

      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText || 'Failed to create category');
      }

      const data = await response.json();
      toast.success('Category added successfully!');
      
      // Update local categories state
      setCategories(prev => [...prev, data]);
      
      // Reset form and close modal
      setNewCategory({
        categoryName: '',
        description: ''
      });
      setShowCategoryModal(false);
      
      // Notify parent component
      if (onCategoryAdded) {
        onCategoryAdded(data);
      }

    } catch (err) {
      console.error("Error creating category:", err);
      setError(err.message || 'Failed to create category');
      toast.error(err.message || 'Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar */}
      <div className="navbar-container w-full h-20 flex items-center justify-between px-4 bg-white border-b border-gray-200">
        {/* Logo Section */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            <span className="text-green-500">Rest</span>
            <span className="text-black">aurant</span>
          </h1>
        </div>

        {/* Search Section */}
        <div className="flex-1 max-w-xl mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Categories or Menu..."
              className="w-full py-2 px-3 bg-gray-100 rounded-md focus:outline-none"
            />
            <button className="absolute right-0 top-0 h-full px-3 bg-gray-400 text-white rounded-r-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-gray-400 text-white rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button className="p-2 bg-gray-400 text-white rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => setShowCategoryModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Category</span>
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={() => setShowProductModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Product</span>
          </button>
        </div>

        {/* Order Info */}
        <div className="ml-4 text-right">
          <div className="font-bold">Order #123</div>
          <div className="text-sm text-gray-500">Opened 8:00am</div>
        </div>
      </div>

      {/* Add New Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleProductChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              {/* Category Dropdown */}
              <div className="mb-4">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={newProduct.categoryId}
                  onChange={handleProductChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {categoriesLoading && (
                  <p className="text-xs text-gray-500 mt-1">Loading categories...</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleProductChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleProductChange}
                    step="0.01"
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleProductChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={newProduct.isAvailable}
                    onChange={handleProductChange}
                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available in Stock</span>
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Category</h2>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={newCategory.categoryName}
                  onChange={handleCategoryChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="categoryDescription"
                  name="description"
                  value={newCategory.description}
                  onChange={handleCategoryChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              {error && (
                <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};