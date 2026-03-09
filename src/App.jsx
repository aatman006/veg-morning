import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, Filter, X, Plus, Minus, 
  Leaf, Clock, MapPin, Phone, User
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';

// Admin Login Component
const AdminLogin = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Incorrect password');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Admin Access</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            autoFocus
          />
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  // Product Database
  const [products, setProducts] = useState([
    { id: 1, name: 'Tomatoes', category: 'vegetables', price: 40, unit: 'kg', emoji: '🍅', inStock: true, popular: true },
    { id: 2, name: 'Potatoes', category: 'vegetables', price: 30, unit: 'kg', emoji: '🥔', inStock: true, popular: true },
    { id: 3, name: 'Onions', category: 'vegetables', price: 25, unit: 'kg', emoji: '🧅', inStock: true, popular: true },
    { id: 4, name: 'Spinach', category: 'vegetables', price: 15, unit: 'bunch', emoji: '🥬', inStock: true },
    { id: 5, name: 'Carrots', category: 'vegetables', price: 40, unit: 'kg', emoji: '🥕', inStock: true },
    { id: 6, name: 'Cucumber', category: 'vegetables', price: 20, unit: 'kg', emoji: '🥒', inStock: true },
    { id: 7, name: 'Capsicum', category: 'vegetables', price: 50, unit: 'kg', emoji: '🫑', inStock: true },
    { id: 8, name: 'Cauliflower', category: 'vegetables', price: 35, unit: 'piece', emoji: '🥦', inStock: true },
    { id: 9, name: 'Cabbage', category: 'vegetables', price: 30, unit: 'piece', emoji: '🥬', inStock: true },
    { id: 10, name: 'Green Peas', category: 'vegetables', price: 60, unit: 'kg', emoji: '🫛', inStock: true },
    { id: 11, name: 'Banana', category: 'fruits', price: 50, unit: 'dozen', emoji: '🍌', inStock: true, popular: true },
    { id: 12, name: 'Apple', category: 'fruits', price: 120, unit: 'kg', emoji: '🍎', inStock: true, popular: true },
    { id: 13, name: 'Milk', category: 'groceries', price: 50, unit: 'litre', emoji: '🥛', inStock: true, popular: true },
    { id: 14, name: 'Eggs', category: 'groceries', price: 6, unit: 'piece', emoji: '🥚', inStock: true, popular: true },
  ]);

  // Admin access state
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // URL Parameter Access
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('admin');
    if (adminKey === 'secret2024') {
      setShowAdmin(true);
    }
  }, []);

  // Hidden click pattern
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(null);
  
  const handleSecretClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (timer) clearTimeout(timer);
      const newTimer = setTimeout(() => setClickCount(0), 3000);
      setTimer(newTimer);
      if (newCount === 7) {
        setShowLogin(true);
        setClickCount(0);
        clearTimeout(newTimer);
      }
      return newCount;
    });
  };

  // Customer view state
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    phone: '',
    time: ''
  });

  const availableProducts = products.filter(p => p.inStock);

  const cartItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = products.find(p => p.id === Number(id));
      return { ...product, quantity: qty };
    });

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleUpdateProducts = (updatedProducts) => {
    setProducts(updatedProducts);
  };

  const updateQuantity = (productId, delta) => {
    setQuantities(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      return { ...prev, [productId]: newQty };
    });
  };

  const filteredProducts = availableProducts.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const categories = [
    { id: 'all', name: 'All Products', icon: '📦' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'groceries', name: 'Groceries', icon: '🏪' },
  ];

  const sendWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!deliveryDetails.name || !deliveryDetails.address || !deliveryDetails.phone || !deliveryDetails.time) {
      alert('Please fill all delivery details');
      return;
    }

    let message = "🛒 *NEW ORDER* 🛒\n\n";
    message += "*Order Details:*\n";
    
    cartItems.forEach(item => {
      message += `${item.emoji} ${item.name}: ${item.quantity} ${item.unit} - ₹${item.price * item.quantity}\n`;
    });
    
    message += `\n*💰 TOTAL: ₹${cartTotal}*`;
    message += "\n\n📝 *DELIVERY DETAILS*";
    message += `\n👤 Name: ${deliveryDetails.name}`;
    message += `\n📍 Address: ${deliveryDetails.address}`;
    message += `\n📞 Phone: ${deliveryDetails.phone}`;
    message += `\n⏰ Time: ${deliveryDetails.time}`;
    
    const phoneNumber = "919310321029";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const clearCart = () => {
    if (window.confirm('Clear all items from cart?')) {
      setQuantities({});
      setDeliveryDetails({ name: '', address: '', phone: '', time: '' });
    }
  };

  const toggleOrderSummary = () => {
    setShowOrderSummary(!showOrderSummary);
    if (!showOrderSummary) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      {/* Secret admin click area */}
      <div 
        onClick={handleSecretClick}
        className="fixed bottom-0 left-0 w-20 h-20 opacity-0 cursor-default z-30"
      />
      
      {/* Admin Login Modal */}
      {showLogin && !showAdmin && (
        <AdminLogin 
          onLogin={() => {
            setShowLogin(false);
            setShowAdmin(true);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
      
      {/* Admin Dashboard */}
      {showAdmin && (
        <AdminDashboard 
          products={products}
          onUpdateProducts={handleUpdateProducts}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* Header - Green Gradient */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Veg Morning</h1>
              <p className="text-sm text-green-100">{availableProducts.length} Products Available</p>
            </div>
          </div>
          
          {/* Cart Button */}
          <button 
            onClick={toggleOrderSummary}
            className="relative p-2 hover:bg-green-700 rounded-full transition bg-green-700 bg-opacity-20"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Search Bar - Morning Theme */}
      <div className="sticky top-16 bg-white bg-opacity-90 backdrop-blur-sm shadow-md p-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide' : 'Filter'}
            </button>
          </div>

          {/* Categories */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full transition flex items-center gap-1 ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      {showOrderSummary && (
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-xl border-2 border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </h2>
                <button 
                  onClick={toggleOrderSummary}
                  className="hover:bg-green-700 rounded-full p-1 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={toggleOrderSummary}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Cart Items */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                      <span>🛒</span> Your Items ({cartCount})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{item.emoji}</span>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">₹{item.price} / {item.unit}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">x{item.quantity}</p>
                            <p className="text-green-600 font-bold">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total */}
                    <div className="mt-4 p-4 bg-orange-100 rounded-lg">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-green-600">₹{cartTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Delivery Details */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                      <span>📝</span> Delivery Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Your Name *"
                          value={deliveryDetails.name}
                          onChange={(e) => setDeliveryDetails({...deliveryDetails, name: e.target.value})}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Delivery Address *"
                          value={deliveryDetails.address}
                          onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Phone Number *"
                          value={deliveryDetails.phone}
                          onChange={(e) => setDeliveryDetails({...deliveryDetails, phone: e.target.value})}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <select
                          value={deliveryDetails.time}
                          onChange={(e) => setDeliveryDetails({...deliveryDetails, time: e.target.value})}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Delivery Time *</option>
                          <option value="8-9 AM">8-9 AM</option>
                          <option value="9-10 AM">9-10 AM</option>
                          <option value="10-11 AM">10-11 AM</option>
                          <option value="11-12 PM">11-12 PM</option>

                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={sendWhatsAppOrder}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
                      >
                        <span>📱</span>
                        Order via WhatsApp
                      </button>
                      <button
                        onClick={clearCart}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
                      >
                        Clear Cart
                      </button>
                      <button
                        onClick={toggleOrderSummary}
                        className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
                      >
                        Hide Order Summary
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4 text-green-700">
          Showing {filteredProducts.length} products
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden border-2 border-green-100">
              <div className="h-24 bg-gradient-to-br from-green-100 to-orange-50 flex items-center justify-center">
                <span className="text-4xl">{product.emoji}</span>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-sm">{product.name}</h3>
                  {product.popular && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-1 rounded">⭐</span>
                  )}
                </div>
                <p className="text-green-600 font-bold text-sm mb-2">
                  ₹{product.price} <span className="text-xs text-gray-500">/{product.unit}</span>
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {quantities[product.id] || 0}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;