'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, productApi, getImageUrl, orderApi, CreateOrderData } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

function OrderPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId') ? parseInt(searchParams.get('productId')!) : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
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
    quantity: 1,
  });
  
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  
  // Calculate delivery charge based on district
  const getDeliveryCharge = () => {
    if (!formData.district) return 0;
    return formData.district.toLowerCase() === 'dhaka' ? 80 : 150;
  };

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setError('No product selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await productApi.getById(productId);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }));
  };
  
  // Generate JSON payload preview (for Steadfast API)
  const getJsonPayload = () => {
    if (!productId || !product) return null;
    
    const unitPrice = parseFloat(product.current_price);
    const quantity = formData.quantity || 1;
    const productTotal = unitPrice * quantity;
    const deliveryCharge = getDeliveryCharge();
    const totalPrice = productTotal + deliveryCharge;
    
    return {
      customer_name: formData.customer_name.trim() || '',
      district: formData.district || '',
      address: formData.address.trim() || '',
      phone_number: formData.phone_number.trim() || '',
      product_id: productId,
      product_size: formData.product_size.trim() || '',
      quantity: quantity,
      unit_price: parseFloat(unitPrice.toFixed(2)),
      product_total: parseFloat(productTotal.toFixed(2)),
      delivery_charge: deliveryCharge,
      total_price: parseFloat(totalPrice.toFixed(2)),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !product) {
      setError('Product not selected');
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
    if (formData.quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    if (product && formData.quantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const orderData: CreateOrderData = {
        customer_name: formData.customer_name.trim(),
        district: formData.district,
        address: formData.address.trim(),
        phone_number: formData.phone_number.trim(),
        product_id: productId,
        product_size: formData.product_size.trim(),
        quantity: formData.quantity,
      };

      await orderApi.create(orderData);
      setSuccess(true);
      
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

  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-lg text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.push('/')}
          className="mx-auto block px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors rounded"
        >
          Back to Home
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

  if (!product) {
    return null;
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">Place Your Order</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Summary */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-4">Order Summary</h2>
              
              <div className="flex gap-4 mb-4">
                {getImageUrl(product.image) ? (
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={getImageUrl(product.image)!}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <a
                    href={`/products/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-black mb-1 hover:underline cursor-pointer block"
                  >
                    {product.name}
                  </a>
                  <p className="text-sm text-gray-600 capitalize mb-2">{product.category}</p>
                  <div className="text-lg font-bold text-black">
                    Tk {parseFloat(product.current_price).toFixed(0)}.00 BDT
                  </div>
                </div>
              </div>
              
              {/* Quantity Selector - Full Width */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-black mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min={1}
                  max={product.stock}
                  required
                  disabled={isOutOfStock}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available in stock: {product.stock}
                </p>
              </div>

              {/* Delivery Charge Information */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-sm font-semibold text-blue-800 mb-1">Delivery Charge:</p>
                <p className="text-xs text-blue-700">80 BDT inside Dhaka</p>
                <p className="text-xs text-blue-700">150 BDT outside Dhaka</p>
              </div>

              {/* Price Summary */}
              {formData.district && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Product Total:</span>
                      <span>Tk {(parseFloat(product.current_price) * formData.quantity).toFixed(0)}.00</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charge:</span>
                      <span>Tk {getDeliveryCharge()}.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-black text-lg pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>Tk {((parseFloat(product.current_price) * formData.quantity) + getDeliveryCharge()).toFixed(0)}.00 BDT</span>
                    </div>
                  </div>
                </div>
              )}

              {isOutOfStock && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm mt-4">
                  This product is currently out of stock.
                </div>
              )}
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
                    Product Size
                  </label>
                  <input
                    type="text"
                    id="product_size"
                    name="product_size"
                    value={formData.product_size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-black"
                    placeholder="e.g., S, M, L, XL"
                  />
                </div>

                {/* JSON Preview Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJsonPreview(!showJsonPreview)}
                    className="text-sm text-gray-600 hover:text-black underline"
                  >
                    {showJsonPreview ? 'Hide' : 'Show'} JSON Payload Preview
                  </button>
                  
                  {showJsonPreview && (
                    <div className="mt-3 p-4 bg-gray-50 border-2 border-gray-200 rounded">
                      <p className="text-xs font-semibold text-gray-700 mb-2">JSON that will be sent to API:</p>
                      <pre className="text-xs bg-white p-3 rounded border border-gray-300 overflow-x-auto">
                        {JSON.stringify(getJsonPayload(), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || isOutOfStock}
                  className={`w-full py-3 px-6 rounded border-2 border-black text-base font-medium transition-colors ${
                    submitting || isOutOfStock
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                >
                  {submitting ? 'Placing Order...' : isOutOfStock ? 'Product Out of Stock' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-lg text-gray-600">Loading...</div>
      </div>
    }>
      <OrderPageContent />
    </Suspense>
  );
}

