'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, ArrowUp, ShoppingBag, Heart, Grid2X2, User, MessageCircle, X, Home, ChevronRight, ChevronDown } from 'lucide-react';
import { categoryApi, Category } from '@/lib/api';

export function MobileNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ left: 0, arrowLeft: 32 });
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoryApi.getTree();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategoryMenu = () => {
    if (!isCategoryMenuOpen && categoryButtonRef.current) {
      const rect = categoryButtonRef.current.getBoundingClientRect();
      // Position popup above the button, centered on the button
      const buttonCenter = rect.left + rect.width / 2;
      // Popup width is 192px (w-48), so we want to center it on the button
      const popupLeft = Math.max(16, buttonCenter - 96);
      // Calculate arrow position relative to popup
      const arrowLeft = buttonCenter - popupLeft - 8; // 8px is half the arrow width
      setPopupPosition({ left: popupLeft, arrowLeft: Math.max(8, Math.min(arrowLeft, 176)) });
    }
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  const closeCategoryMenu = () => {
    setIsCategoryMenuOpen(false);
  };

  const toggleCategoryExpansion = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <>
      {/* Right side floating action buttons (mobile only) */}
      <div className="fixed right-4 bottom-32 flex flex-col gap-3 z-40 md:hidden">
        {/* Cart - Disabled */}
        <div
          className="w-11 h-11 rounded-full bg-black shadow-lg flex items-center justify-center text-white opacity-30 cursor-not-allowed pointer-events-none"
          aria-label="Go to cart (disabled)"
        >
          <ShoppingBag className="w-5 h-5" />
        </div>

        {/* Scroll to Top - only when visible */}
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-black shadow-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Menu Popup Overlay - Click outside to close */}
      {isCategoryMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={closeCategoryMenu}
        />
      )}

      {/* Category Menu Popup */}
      {isCategoryMenuOpen && (
        <div 
          className="fixed bottom-16 z-50 md:hidden pointer-events-none"
          style={{ left: `${popupPosition.left}px` }}
        >
          <div className="relative">
            <div 
              className="bg-black rounded-lg shadow-2xl w-48 pointer-events-auto"
            >
              <div className="p-2 space-y-1">
                {categories.map((category) => (
                  <div key={category.id}>
                    {category.children.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between px-3 py-2 text-white hover:bg-gray-800 rounded transition-colors">
                          <Link
                            href={`/products?category=${category.slug}`}
                            onClick={closeCategoryMenu}
                            className="flex-1 text-sm font-medium"
                          >
                            {category.name}
                          </Link>
                          <button
                            onClick={(e) => toggleCategoryExpansion(category.slug, e)}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            {expandedCategories[category.slug] ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {expandedCategories[category.slug] && (
                          <div className="pl-2 space-y-1">
                            {category.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/products?category=${child.slug}`}
                                onClick={closeCategoryMenu}
                                className="block px-3 py-2 pl-6 text-white hover:bg-gray-800 rounded transition-colors opacity-90"
                              >
                                <span className="text-sm font-normal">{child.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={`/products?category=${category.slug}`}
                        onClick={closeCategoryMenu}
                        className="block px-3 py-2 text-white hover:bg-gray-800 rounded transition-colors"
                      >
                        <span className="text-sm font-medium">{category.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Arrow pointing down to category icon */}
            <div 
              className="absolute bottom-0 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-black"
              style={{ 
                transform: 'translateY(100%)',
                left: `${popupPosition.arrowLeft}px`
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom mobile nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black text-white z-40 md:hidden">
        <div className="max-w-screen-sm mx-auto flex items-stretch">
          {/* 1. Category */}
          <button
            ref={categoryButtonRef}
            onClick={toggleCategoryMenu}
            className="flex-1 flex flex-col items-center justify-center py-2 text-[11px]"
          >
            <Grid2X2 className="w-5 h-5 mb-1" />
            <span>Category</span>
          </button>

          {/* 2. Wishlist */}
          <Link
            href="/wishlist"
            className="flex-1 flex flex-col items-center justify-center py-2 text-[11px]"
          >
            <Heart className="w-5 h-5 mb-1" />
            <span>Wishlist</span>
          </Link>

          {/* 3. Home icon in the middle */}
          <Link
            href="/"
            className="flex-1 flex flex-col items-center justify-center py-2 text-[11px]"
          >
            <Home className="w-5 h-5 mb-1" />
            <span>Home</span>
          </Link>

          {/* 4. Chat */}
          <a
            href="https://wa.me/8801604112279"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center py-2 text-[11px]"
          >
            <MessageCircle className="w-5 h-5 mb-1" />
            <span>Chat</span>
          </a>

          {/* 5. Call */}
          <a
            href="tel:+8801604112279"
            className="flex-1 flex flex-col items-center justify-center py-2 text-[11px]"
          >
            <Phone className="w-5 h-5 mb-1" />
            <span>Call</span>
          </a>
        </div>
      </nav>
    </>
  );
}

