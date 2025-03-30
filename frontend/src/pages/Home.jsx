import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SideBar } from '../components/Sidebar';
import image from '../assets/pizza.png';
import image2 from '../assets/pizza2.png';
import image3 from '../assets/pizza3.png';

export const Home = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(1);
  // State for managing the edit modal
  const [editProduct, setEditProduct] = useState(null);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8080/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        // Transform API data to match our expected format
        const transformedCategories = categoriesData.map(category => ({
          id: category.categoryId,
          name: category.categoryName,
          icon: getCategoryIcon(category.categoryName)
        }));
        
        // Add "All Items" as the first category
        setCategories([
          { id: 1, name: 'All Items', icon: '🍴' },
          ...transformedCategories
        ]);
        
        // Fetch products
        const productsResponse = await fetch('http://localhost:8080/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        // Transform products data, including extra fields for editing/updating
        const transformedProducts = productsData.map(product => ({
          id: product.productId,
          name: product.name,
          // Store full category object and its name for display
          category: product.category, 
          categoryName: product.category.categoryName,
          price: product.price,
          image: getProductImage(product.name),
          added: false,
          available: product.available,
          quantity: product.quantity,
          description: product.description,
          isAvailable: product.isAvailable,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }));
        
        setProducts(transformedProducts);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get emoji icons based on category name
  const getCategoryIcon = (categoryName) => {
    switch(categoryName.toLowerCase()) {
      case 'pizza': return '🍕';
      case 'burger': return '🍔';
      case 'coffee': return '☕';
      case 'momo': return '🥟';
      default: return '🍴';
    }
  };

  // Helper function to get appropriate image based on product name
  const getProductImage = (productName) => {
    if (productName.toLowerCase().includes('pizza')) {
      return image;
    } else if (productName.toLowerCase().includes('coffee')) {
      return image2;
    } else if (productName.toLowerCase().includes('burger')) {
      return image3;
    }
    return image;
  };

  const handleAddToCart = (product) => {
    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // Update quantity if already in cart
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item to cart
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]);
    }
    
    // Mark product as added
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, added: true } : p
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    
    // Mark product as not added
    setProducts(products.map(p => 
      p.id === id ? { ...p, added: false } : p
    ));
  };
  
  const handleQuantityChange = (id, change) => {
    setCartItems(cartItems.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) } 
        : item
    ));
  };

  // New: Handler to delete a product
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product ${productId}`);
      }
      // Remove the product from the state
      setProducts(products.filter(p => p.id !== productId));
      // Also remove the product from the cart if it exists there
      setCartItems(cartItems.filter(item => item.id !== productId));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product. Please try again.");
    }
  };

  // This function handles the "Place Order" action.
  // It updates the quantity of each ordered product using the update endpoint.
  const handlePlaceOrder = async () => {
    try {
      // Loop over each item in the cart
      const updatePromises = cartItems.map(async (cartItem) => {
        // Find the corresponding product from state
        const product = products.find(p => p.id === cartItem.id);
        if (!product) return;

        // Calculate new quantity (subtracting the ordered quantity)
        const newQuantity = product.quantity - cartItem.quantity;
        
        // Prepare the update payload
        const payload = {
          name: product.name,
          category: { categoryId: product.category.categoryId },
          description: product.description,
          price: product.price,
          quantity: newQuantity,
          isAvailable: newQuantity > 0,
          createdAt: product.createdAt, // keep as is
          updatedAt: new Date().toISOString(),
        };

        // Call the update endpoint for the product
        const response = await fetch(`http://localhost:8080/api/products/${product.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to update product ${product.id}`);
        }
        return { productId: product.id, newQuantity };
      });
      
      // Wait for all update calls to complete
      const results = await Promise.all(updatePromises);
      
      // Update the products state with new quantities
      const updatedProducts = products.map(product => {
        const updated = results.find(r => r.productId === product.id);
        if (updated) {
          return { 
            ...product, 
            quantity: updated.newQuantity, 
            isAvailable: updated.newQuantity > 0, 
            available: updated.newQuantity > 0 
          };
        }
        return product;
      });
      setProducts(updatedProducts);
      
      // Optionally, clear the cart or show a success message
      setCartItems([]);
      alert("Order placed and product quantities updated successfully!");
      
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order. Please try again.");
    }
  };

  // Filter products by active category
  const filteredProducts = activeCategory === 1 
    ? products 
    : products.filter(product => {
        const category = categories.find(cat => cat.id === activeCategory);
        return category && product.categoryName === category.name;
      });

  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Handler for when the edit form is submitted (same as before)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: e.target.name.value,
      category: {
        categoryId: e.target.category.value
      },
      description: e.target.description.value,
      price: parseFloat(e.target.price.value),
      quantity: parseInt(e.target.quantity.value, 10),
      isAvailable: e.target.isAvailable.checked,
      createdAt: editProduct.createdAt,
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`http://localhost:8080/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      
      const updatedProduct = { 
        ...editProduct, 
        name: payload.name, 
        category: { categoryId: payload.category.categoryId, categoryName: e.target.category.options[e.target.category.selectedIndex].text },
        categoryName: e.target.category.options[e.target.category.selectedIndex].text,
        description: payload.description, 
        price: payload.price, 
        quantity: payload.quantity, 
        isAvailable: payload.isAvailable, 
        available: payload.isAvailable, 
        updatedAt: payload.updatedAt 
      };

      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setEditProduct(null);
      
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar />
        
        {/* Main Content Area */}
        <div className="flex-1 ml-20 md:ml-24 flex">
          {/* Menu Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Category Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">
                Choose Category <span className="text-green-500 text-sm">{categories.length}+ categories</span>
              </h2>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button 
                    key={category.id}
                    className={`flex items-center px-4 py-2 rounded-full border ${activeCategory === category.id ? 'bg-white shadow-md' : 'bg-white bg-opacity-50'}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Food Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className={`bg-white p-4 rounded-xl shadow-sm ${!product.available ? 'opacity-50' : ''}`}>
                  <div className="relative flex justify-center">
                    <div className="w-35 h-35 rounded-full overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="absolute bottom-1 text-center">
                      <div className="inline-block px-3 py-1 bg-gray-200 bg-opacity-80 rounded-full text-sm">
                        {product.categoryName.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-center my-2">{product.name}</h3>
                  <p className="text-center text-green-500 font-medium">Rs.{product.price.toFixed(2)}</p>
                  {/* Display current quantity from API */}
                  <p className="text-center text-gray-600">Quantity: {product.quantity}</p>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      className={`w-full py-1 rounded-md text-white text-sm ${product.added ? 'bg-green-500' : 'bg-yellow-400'} ${!product.available ? 'cursor-not-allowed' : ''}`}
                      onClick={() => product.available && handleAddToCart(product)}
                      disabled={!product.available}
                    >
                      {!product.available ? 'Out of Stock' : product.added ? 'Added' : 'Add'}
                    </button>
                    {/* Edit Button */}
                    <button 
                      className="w-full py-1 rounded-md text-white text-sm bg-blue-500"
                      onClick={() => setEditProduct(product)}
                      disabled={!product.available}
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button 
                      className="w-full py-1 rounded-md text-white text-sm bg-red-500"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Section */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Order Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold">New Order Bill</h2>
              <span className="text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Your cart is empty</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex items-center mb-4 pb-4 border-b border-gray-100">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md mr-3" />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm">Rs.{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >-</button>
                      <span className="mx-2">{item.quantity}</span>
                      <button 
                        className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >+</button>
                    </div>
                    <button 
                      className="ml-2 text-xs text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {/* Order Summary */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span>Sub Total</span>
                <span className="text-green-500">Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax 10% (VAT Included)</span>
                <span className="text-green-500">Rs.{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-gray-300 my-3"></div>
              <div className="flex justify-between mb-4 font-bold">
                <span>Total</span>
                <span className="text-green-500">Rs.{total.toFixed(2)}</span>
              </div>
              
              {/* Payment Methods */}
              <div className="mb-4">
                <h3 className="mb-2">Payment Method</h3>
                <div className="flex justify-between space-x-2">
                  <button className="border border-gray-300 rounded-md p-3 flex-1 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                  <button className="border border-gray-300 rounded-md p-3 flex-1 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </button>
                  <button className="border border-gray-300 rounded-md p-3 flex-1 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between text-center mt-1 text-xs">
                  <span className="flex-1">Cash</span>
                  <span className="flex-1">Debit Card</span>
                  <span className="flex-1">E-Wallet</span>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button 
                onClick={handlePlaceOrder}
                className={`w-full py-3 font-medium rounded-md ${cartItems.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={cartItems.length === 0}
              >
                {cartItems.length > 0 ? 'Place Order' : 'Add items to place order'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editProduct.name}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Category</label>
                <select 
                  name="category" 
                  defaultValue={editProduct.category.categoryId} 
                  className="w-full border rounded p-2"
                  required
                >
                  {categories.filter(cat => cat.id !== 1).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  defaultValue={editProduct.description}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={editProduct.price}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  defaultValue={editProduct.quantity}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  defaultChecked={editProduct.isAvailable}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Available</label>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setEditProduct(null)} 
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
