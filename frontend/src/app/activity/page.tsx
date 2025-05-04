"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Heart, MessageCircle, Repeat, UserPlus, BellRing } from 'lucide-react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'repeat' | 'follow';
  username: string;
  postId?: string;
  timestamp: Date;
  read: boolean;
}

export default function Activity() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleTabChange = (tab: string) => {
    // TODO: Implement tab change functionality
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'repeat':
        return <Repeat className="h-5 w-5 text-green-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-red-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Hoạt động</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
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
              className={`px-4 py-2 ${activeTab === 'replies' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('replies')}
            >
              Trả lời
            </button>
          </div>

          <div className="space-y-4">
            {/* TODO: Implement activity list */}
          </div>
        </div>
      </div>
    </div>
  );
}