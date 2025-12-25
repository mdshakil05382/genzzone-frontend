'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, BestSelling, productApi, bestSellingApi } from '@/lib/api';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSelling, setBestSelling] = useState<BestSelling[]>([]);
  const [loading, setLoading] = useState(true);
  const [bestSellingLoading, setBestSellingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bestSellingError, setBestSellingError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await productApi.getAll();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchBestSelling() {
      try {
        setBestSellingLoading(true);
        const data = await bestSellingApi.getAll();
        setBestSelling(data);
      } catch (err) {
        setBestSellingError('Failed to load best selling products');
        console.error(err);
      } finally {
        setBestSellingLoading(false);
      }
    }
    fetchBestSelling();
  }, []);

  // Extract products from best selling items
  const bestSellingProducts = bestSelling.map(item => item.product);
  
  // Limit products for display
  const displayedBestSelling = bestSellingProducts.slice(0, 4);
  const displayedProducts = products.slice(0, 8);
  const hasMoreBestSelling = bestSellingProducts.length > 4;
  const hasMoreProducts = products.length > 8;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Best Selling Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">Best Selling</h2>
          <p className="text-lg text-gray-700">Discover Our Most Popular Premium T-Shirts</p>
        </div>
        {bestSellingLoading ? (
          <div className="text-center py-16">
            <div className="text-lg text-gray-600">Loading best selling products...</div>
          </div>
        ) : bestSellingError ? (
          <div className="text-center py-16">
            <div className="text-lg text-red-600">{bestSellingError}</div>
          </div>
        ) : bestSellingProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-lg text-gray-600">No best selling products available</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedBestSelling.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMoreBestSelling && (
              <div className="text-center mt-8">
                <Link
                  href="/products?best_selling=true"
                  className="inline-block px-8 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors rounded font-medium"
                >
                  View More Best Selling
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* All Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">All Products</h2>
          <p className="text-lg text-gray-700">Explore Our Complete Collection of Premium Apparel</p>
        </div>
        {loading ? (
          <div className="text-center py-16">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-lg text-gray-600">No products available</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMoreProducts && (
              <div className="text-center mt-8">
                <Link
                  href="/products"
                  className="inline-block px-8 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors rounded font-medium"
                >
                  View More Products
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
