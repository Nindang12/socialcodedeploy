'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const handleTabChange = (tab: string) => {
    // TODO: Implement tab change functionality
  };

  const handleMarkAsRead = () => {
    // TODO: Implement mark as read functionality
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Thông báo</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('all')}
            >
              Tất cả
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'mentions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('mentions')}
            >
              Đề cập
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'follows' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('follows')}
            >
              Theo dõi
            </button>
          </div>

          {/* Mark all as read button */}
          <div className="flex justify-end">
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={handleMarkAsRead}
            >
              Đánh dấu đã đọc tất cả
            </button>
          </div>

          {/* Notifications list */}
          <div className="space-y-4">
            {/* TODO: Implement notifications list */}
          </div>
        </div>
      </div>
    </div>
  );
} 