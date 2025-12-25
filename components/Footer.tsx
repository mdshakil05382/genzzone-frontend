'use client';

import { Mail, Phone, Building2 } from 'lucide-react';
import { Facebook, ArrowRight } from 'lucide-react';
import Link from 'next/link';



export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Gen Z Zone INFO Section */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4 text-black">GEN Z ZONE INFO</h3>
            <div className="space-y-3 text-sm text-black">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>E-mail: genzzone11@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span>Contact: 01604-112279</span>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span>Address: Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* POLICIES Section */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4 text-black">POLICIES</h3>
            <div className="space-y-2 text-sm">
              <Link href="/refund-policy" className="block text-black hover:underline">
                Refund Policy
              </Link>
              <Link href="/privacy-policy" className="block text-black hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="block text-black hover:underline">
                Terms of Service
              </Link>
              <Link href="/contact" className="block text-black hover:underline">
                Contact Us
              </Link>
            </div>
          </div>

          {/* FOLLOW US Section */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4 text-black">FOLLOW US</h3>
            <div className="flex items-center gap-4 mb-6">
              <Link href="https://facebook.com/genzzone1" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70 transition-opacity">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://tiktok.com/@genzzone11" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </Link>
              <Link href="https://wa.me/8801604112279" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </Link>
            </div>

            {/* Subscribe Section */}
            <div>
              <h3 className="text-lg font-bold mb-3 text-black">Subscribe to our newsletter</h3>
              <form className="flex items-center border border-gray-300 rounded overflow-hidden">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-2 text-sm text-black placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gray-100 px-4 py-2 hover:bg-gray-200 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 text-black" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

