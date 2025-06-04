// src/app/page.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navrbar'; // Make sure the path is correct

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        <Image
          src="/landing.jpg"
          alt="Campus"
          fill
          priority
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6 z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-[#f5f5dc] mb-4 drop-shadow-md">
            Welcome to Smart Campus Assistant 🎓
          </h1>
          <p className="text-lg md:text-xl text-[#f5f5dc] max-w-2xl drop-shadow-sm">
            Navigate your university and find your lost items with ease.
          </p>
        </div>
      </section>

      {/* Main Action Section */}
<section className="py-20 px-6 bg-gray-50 grow">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
    
    {/* Chatbot Card */}
    <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300 ease-in-out hover:shadow-2xl">
      <Image
        src="/bot.png"
        alt="Campus Navigation Bot"
        width={500}
        height={300}
        className="w-full max-w-[400px] h-auto mb-6"
      />
      <div className="flex flex-col justify-between flex-grow h-full">
        <h3 className="text-3xl font-semibold text-blue-700 mb-3">Campus Navigation</h3>
        <p className="text-gray-600 mb-6">
          Chat with our assistant to find services, buildings, or get help navigating campus.
        </p>
        <Link
          href="/chatbot"
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-200 font-medium mt-auto"
        >
          Launch Chatbot
        </Link>
      </div>
    </div>

    {/* Lost & Found Card */}
    <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300 ease-in-out hover:shadow-2xl">
      <Image
        src="/lost.png"
        alt="Lost and Found"
        width={500}
        height={300}
        className="w-full max-w-[250px] h-auto mb-6"
      />
      <div className="flex flex-col justify-between flex-grow h-full">
        <h3 className="text-3xl font-semibold text-blue-700 mb-3">Lost & Found</h3>
        <p className="text-gray-600 mb-6">
          Report or search for lost items. Help your campus community by sharing what you've found.
        </p>
        <Link
          href="/lostfound"
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-200 font-medium mt-auto"
        >
          Go to Lost & Found
        </Link>
      </div>
    </div>
    
  </div>
</section>


      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        &copy; 2025 Smart Campus. All rights reserved.
      </footer>
    </div>
  );
}
