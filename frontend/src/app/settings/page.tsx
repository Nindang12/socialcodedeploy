'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');

  const handleTabChange = (tab: string) => {
    // TODO: Implement tab change functionality
  };

  const handleSave = () => {
    // TODO: Implement save functionality
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Cài đặt</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${activeTab === 'account' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('account')}
            >
              Tài khoản
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'privacy' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('privacy')}
            >
              Quyền riêng tư
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('notifications')}
            >
              Thông báo
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* TODO: Implement content based on active tab */}
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
              onClick={handleSave}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 