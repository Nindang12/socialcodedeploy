"use client"
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Tab } from '@headlessui/react'
import { MessageCircle, Heart, Repeat, MoreHorizontal } from "lucide-react";
import { useParams } from 'next/navigation'
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Post {
  id: string
  content: string
  author: {
    name: string
    username: string
    avatarUrl?: string
  }
  createdAt: string
  likes: number
  replies: number
  reposts: number
  images?: string[]
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)

  const userId = params.userId as string

  // Mock data - replace with API calls later
  const user = {
    id: userId,
    name: 'Đặng Nin',
    username: 'nindang84',
    followers: 3,
    bio: '2k4 nhà',
    avatarUrl: '/avatar.png' // Fixed: Added leading slash for public directory
  }

  const posts: Post[] = [
    {
      id: '1',
      content: 'Hôm nay trời đẹp quá! 🌞',
      author: {
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl
      },
      createdAt: '2024-03-20T10:00:00Z',
      likes: 12,
      replies: 3,
      reposts: 2,
      images: ['/avatar.png']
    },
    {
      id: '2',
      content: 'Hôm nay trời đẹp quá! 🌞',
      author: {
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl
      },
      createdAt: '2024-03-20T10:00:00Z',
      likes: 12,
      replies: 3,
      reposts: 2,
      images: ['/avatar.png']
    }
  ]

  const PostCard = ({ post }: { post: Post }) => (
    <div className="border-b border-gray-200 py-4">
      <div className="flex space-x-4">
        {post.author.avatarUrl && (
          <Image
            src={post.author.avatarUrl}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover w-8 h-8"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{post.author.name}</span>
            <span className="text-gray-500">@{post.author.username}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <p className="mt-2 text-gray-900">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className="mt-3 w-full h-[400px]">
              <Image
                src={post.images[0]}
                alt="Post image"
                width={500}
                height={400}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          )}
          <div className="mt-3 flex items-center space-x-8 text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <Heart className="h-5 w-5" />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <MessageCircle className="h-5 w-5" />
              <span>{post.replies}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-red-500">
              <Repeat className="h-5 w-5" />
              <span>{post.reposts}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const EmptyState = ({ message }: { message: string }) => (
    <div className="py-8 text-center text-gray-500">
      <p>{message}</p>
    </div>
  )

  const handleTabChange = (tab: string) => {
    // TODO: Implement tab change functionality
  };

  const handleFollow = () => {
    // TODO: Implement follow functionality
  };

  if (!user) {
    notFound()
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Hồ sơ</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          {/* Profile header */}
          <div className="flex items-center space-x-4">
            <img src="https://placehold.co/100x100" alt="Avatar" className="w-20 h-20 rounded-full" />
            <div>
              <h2 className="text-xl font-bold">username</h2>
              <p className="text-gray-500">@username</p>
              <div className="flex space-x-4 mt-2">
                <div>
                  <span className="font-bold">0</span> bài viết
                </div>
                <div>
                  <span className="font-bold">0</span> người theo dõi
                </div>
                <div>
                  <span className="font-bold">0</span> đang theo dõi
                </div>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                isFollowing
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </button>
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
              className={`px-4 py-2 ${activeTab === 'replies' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('replies')}
            >
              Trả lời
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'media' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('media')}
            >
              Media
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* TODO: Implement content based on active tab */}
          </div>
        </div>
      </div>
    </div>
  )
}
