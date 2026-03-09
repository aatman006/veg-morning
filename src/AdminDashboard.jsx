import React, { useState, useEffect } from 'react';
import { 
  X, Save, Edit, Trash2, Plus, Package, 
  AlertCircle, CheckCircle, Eye, EyeOff,
  DollarSign, Tag, Search, Filter
} from 'lucide-react';

function AdminDashboard({ products, onUpdateProducts, onClose }) {
  const [localProducts, setLocalProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameHindi: '',
    category: 'vegetables',
    price: '',
    unit: 'kg',
    emoji: '🥬',
    inStock: true,
    popular: false
  });

  // Load products when component mounts
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Categories for filter
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'groceries', name: 'Groceries' },
  ];

  // Filter products
  const filteredProducts = localProducts.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return product.name.toLowerCase().includes(searchLower) ||
             (product.nameHindi && product.nameHindi.includes(searchTerm));
    }
    return true;
  });

  // Update price
  const handlePriceUpdate = (productId, newPrice) => {
    setLocalProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, price: Number(newPrice) } : p
      )
    );
  };

  // Toggle stock status
  const toggleStock = (productId) => {
    setLocalProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      )
    );
  };

  // Toggle popular status
  const togglePopular = (productId) => {
    setLocalProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, popular: !p.popular } : p
      )
    );
  };

  // Delete product
  const deleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLocalProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Add new product
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill product name and price');
      return;
    }

    const maxId = Math.max(...localProducts.map(p => p.id), 0);
    const productToAdd = {
      ...newProduct,
      id: maxId + 1,
      price: Number(newProduct.price),
      inStock: true
    };

    setLocalProducts(prev => [...prev, productToAdd]);
    setNewProduct({
      name: '',
      nameHindi: '',
      category: 'vegetables',
      price: '',
      unit: 'kg',
      emoji: '🥬',
      inStock: true,
      popular: false
    });
    setShowAddForm(false);
  };

  // Save all changes
  const saveChanges = () => {
    onUpdateProducts(localProducts);
    alert('Products updated successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Admin Dashboard - Product Management
              </h2>
              <p className="text-gray-600 mt-1">Update prices, stock status, and manage products</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveChanges}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by English or Hindi name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            </div>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <div className="p-6 border-b bg-green-50">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Product
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Product Name (English)"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Product Name (Hindi)"
                  value={newProduct.nameHindi}
                  onChange={(e) => setNewProduct({...newProduct, nameHindi: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="groceries">Groceries</option>
                </select>
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                />
                <select
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="kg">kg</option>
                  <option value="piece">piece</option>
                  <option value="bunch">bunch</option>
                  <option value="dozen">dozen</option>
                  <option value="litre">litre</option>
                  <option value="pack">pack</option>
                </select>
                <input
                  type="text"
                  placeholder="Emoji (e.g., 🥬)"
                  value={newProduct.emoji}
                  onChange={(e) => setNewProduct({...newProduct, emoji: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={addProduct}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Add Product
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Hindi Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price (₹)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Unit</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Popular</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className={!product.inStock ? 'bg-red-50' : ''}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{product.emoji}</span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{product.nameHindi || '-'}</td>
                      <td className="px-4 py-3 capitalize">{product.category}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handlePriceUpdate(product.id, e.target.value)}
                          className="w-20 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="0"
                          step="1"
                        />
                      </td>
                      <td className="px-4 py-3">{product.unit}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStock(product.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            product.inStock 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.inStock ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              Out of Stock
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePopular(product.id)}
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.popular 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {product.popular ? '⭐ Popular' : 'Regular'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Total Products</span>
                  <p className="text-2xl font-bold">{localProducts.length}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">In Stock</span>
                  <p className="text-2xl font-bold text-green-600">
                    {localProducts.filter(p => p.inStock).length}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Out of Stock</span>
                  <p className="text-2xl font-bold text-red-600">
                    {localProducts.filter(p => !p.inStock).length}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Popular Items</span>
                  <p className="text-2xl font-bold text-yellow-600">
                    {localProducts.filter(p => p.popular).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;