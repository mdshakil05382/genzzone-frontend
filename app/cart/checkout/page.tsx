'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { orderApi, CartCheckoutData } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

export default function CartCheckoutPage() {
  const router = useRouter();
  const { cart, loading, refreshCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Bangladesh districts
  const districts = [
    'Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Jamalpur', 'Kishoreganj',
    'Madaripur', 'Manikganj', 'Munshiganj', 'Mymensingh', 'Narayanganj', 'Narsingdi',
    'Netrokona', 'Rajbari', 'Shariatpur', 'Sherpur', 'Tangail',
    'Bogra', 'Joypurhat', 'Naogaon', 'Natore', 'Nawabganj', 'Pabna',
    'Rajshahi', 'Sirajgonj',
    'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari',
    'Panchagarh', 'Rangpur', 'Thakurgaon',
    'Barguna', 'Barisal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur',
    'Bandarban', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Comilla',
    'Cox\'s Bazar', 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati',
    'Habiganj', 'Maulvibazar', 'Sunamganj', 'Sylhet',
    'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Khulna',
    'Kushtia', 'Magura', 'Meherpur', 'Narail'
  ];

  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    district: '',
    address: '',
    phone_number: '',
    product_size: '',
  });

  // Calculate delivery charge based on district
  const getDeliveryCharge = () => {
    if (!formData.district) return 0;
    return formData.district.toLowerCase() === 'dhaka' ? 80 : 150;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    // Validate form
    if (!formData.customer_name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.district) {
      setError('Please select a district');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please enter your address');
      return;
    }
    if (!formData.phone_number.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const orderData: CartCheckoutData = {
        customer_name: formData.customer_name.trim(),
        district: formData.district,
        address: formData.address.trim(),
        phone_number: formData.phone_number.trim(),
        product_size: formData.product_size.trim() || undefined,
      };

      await orderApi.createFromCart(orderData);
      setSuccess(true);
      await refreshCart();
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Failed to create order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-lg text-red-600 mb-4">Your cart is empty</div>
        <button
          onClick={() => router.push('/cart')}
          className="mx-auto block px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors rounded"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-700 mb-2">Thank you for your order, {formData.customer_name}!</p>
            <p className="text-gray-600 text-sm">You will be redirected to the home page shortly...</p>
          </div>
        </div>
      </div>
    );
  }

  const cartTotal = parseFloat(cart.total);
  const deliveryCharge = getDeliveryCharge();
  const grandTotal = cartTotal + deliveryCharge;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/cart')}
          className="flex items-center gap-2 text-black hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    {getImageUrl(item.product.image) ? (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={getImageUrl(item.product.image)!}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-black mb-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Quantity: {item.quantity}
                      </p>
                      <div className="text-sm font-bold text-black">
                        Tk {parseFloat(item.subtotal).toFixed(0)}.00
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Charge Information */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-sm font-semibold text-blue-800 mb-1">Delivery Charge:</p>
                <p className="text-xs text-blue-700">80 BDT inside Dhaka</p>
                <p className="text-xs text-blue-700">150 BDT outside Dhaka</p>
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.item_count} items):</span>
                    <span>Tk {cartTotal.toFixed(0)}.00</span>
                  </div>
                  {formData.district && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charge:</span>
                      <span>Tk {deliveryCharge}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-black text-lg pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>
                      Tk {formData.district ? grandTotal.toFixed(0) : cartTotal.toFixed(0)}.00 BDT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-6">Customer Information</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-black mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-black"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-black mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-black bg-white"
                  >
                    <option value="">Select a district</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-black mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-black resize-none"
                    placeholder="Enter your full address"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-black mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-black"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="product_size" className="block text-sm font-medium text-black mb-2">
                    Product Size (Optional)
                  </label>
                  <input
                    type="text"
                    id="product_size"
                    name="product_size"
                    value={formData.product_size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-black"
                    placeholder="e.g., S, M, L, XL (applies to all items)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 px-6 rounded border-2 border-black text-base font-medium transition-colors ${
                    submitting
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

