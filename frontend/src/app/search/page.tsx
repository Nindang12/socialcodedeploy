"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('posts');

  const handleSearch = () => {
    // TODO: Implement search functionality
  };

  const handleTabChange = (tab: string) => {
    // TODO: Implement tab change functionality
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Tìm kiếm</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('posts')}
            >
              Bài viết
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('users')}
            >
              Người dùng
            </button>
          </div>

          {/* Search results */}
          <div className="space-y-4">
            {/* TODO: Implement search results based on active tab */}
          </div>
        </div>
      </div>
    </div>
  );
}
