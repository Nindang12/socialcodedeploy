"use client"
import Image from 'next/image'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { Tab } from '@headlessui/react'
import { MessageCircle, Heart, Repeat, Video, MoreHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  const router = useRouter()
  const params = useParams();
  const userId = params.userId as string;
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userRes = await axios.get(`http://127.0.0.1:8000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User data from API:', userRes.data);
      setUser(userRes.data.user);

      const postsRes = await axios.get(`http://127.0.0.1:8000/users/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(postsRes.data.posts);
    } catch (err) {
      setUser(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      setCurrentUser(user);
    }
  }, []);

  const PostCard = ({ post, onActionDone }: { post: any, onActionDone: () => void }) => {
    const isLiked = Array.isArray(post.liked_by) && currentUser
      ? post.liked_by.map((id: string) => String(id).trim()).includes(String(currentUser.user_id).trim())
      : false;
    const [liked, setLiked] = useState(isLiked);
    const [likeCount, setLikeCount] = useState(post.likes ?? 0);
    const isReposted = Array.isArray(post.reposted_by) && currentUser
      ? post.reposted_by.map((id: string) => String(id).trim()).includes(String(currentUser.user_id).trim())
      : false;
    const [reposted, setReposted] = useState(isReposted);
    const [repostCount, setRepostCount] = useState(post.reposts ?? 0);
    const [showComment, setShowComment] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const [commentVideo, setCommentVideo] = useState<File | null>(null);

    const date = new Date(post.created_at);
    const formatTime = (createdAt: string) => {
      const now = new Date();
      const postDate = new Date(createdAt);
      const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes} phút`;
      } else if (diffInMinutes < 1440) { // Less than 24 hours
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} giờ`;
      } else {
        const diffInDays = Math.floor(diffInMinutes / 1440);
        return `${diffInDays} ngày`;
      }
    };
    useEffect(() => {
      const newLiked = Array.isArray(post.liked_by) && currentUser
        ? post.liked_by.map((id: string) => String(id).trim()).includes(String(currentUser.user_id).trim())
        : false;
      setLiked(newLiked);
      const newReposted = Array.isArray(post.reposted_by) && currentUser
        ? post.reposted_by.map((id: string) => String(id).trim()).includes(String(currentUser.user_id).trim())
        : false;
      setReposted(newReposted);
    }, [post.liked_by, post.reposted_by, currentUser]);

    const handleLike = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/posts/${post.post_id}/like`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setLiked(!liked);
          setLikeCount((prev: number) => liked ? prev - 1 : prev + 1);
          await onActionDone();
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    };

    const handleRepost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/posts/${post.post_id}/repost`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setReposted(!reposted);
          setRepostCount((prev: number) => reposted ? prev - 1 : prev + 1);
          await onActionDone();
        }
      } catch (error) {
        console.error('Error reposting:', error);
      }
    };

    const handleComment = async () => {
      if (!newComment.trim()) return;

      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('content', newComment);
        if (commentImage) formData.append('image', commentImage);
        if (commentVideo) formData.append('video', commentVideo);

        const response = await fetch(`http://127.0.0.1:8000/posts/${post.post_id}/comments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });

        if (response.ok) {
          setNewComment('');
          setCommentImage(null);
          setCommentVideo(null);
          setShowComment(false);
          await onActionDone();
        }
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    };

    return (
      <div key={post.post_id} className="bg-white text-black p-4 shadow-md w-full rounded-lg border">
        <div className="flex items-center space-x-3">
          <img src={user?.avatar || "https://placehold.co/40x40"} alt="Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{user?.full_name || "Người dùng"}</p>
              <Link href={`/profile/${user?.user_id}`}>
                <span className="text-sm text-blue-500 hover:underline cursor-pointer">@{user?.username || ""}</span>
              </Link>
              <p className="text-sm text-gray-500">{formatTime(post.created_at)}</p>
            </div>
          </div>
        </div>

        <p className="mt-2">{post.content}</p>
        {/* Hiển thị ảnh nếu có trường image_id hoặc images */}
        {post.image_id && (
          <img src={`http://127.0.0.1:8000/media/${post.image_id}`} alt="Post" className="mt-2 rounded-lg" />
        )}
        {post.images && post.images.length > 0 && (
          <img src={post.images[0]} alt="Post" className="mt-2 rounded-lg" />
        )}

        <div className="flex gap-4 text-gray-500 mt-3">
          <ActionButton 
            icon={<Heart size={18} className={liked ? "text-red-500" : "text-gray-500"} />} 
            count={likeCount} 
            onClick={handleLike}
          />
          <ActionButton 
            icon={<MessageCircle size={18} />} 
            count={post.replies ?? 0} 
            onClick={() => setShowComment(prev => !prev)}
          />
          <ActionButton 
            icon={<Repeat size={18} className={reposted ? "text-green-500" : "text-gray-500"} />} 
            count={repostCount} 
            onClick={handleRepost}
          />
        </div>

        {showComment && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white w-[500px] rounded-xl shadow-lg translate-x-10">
              <div className="flex items-center justify-between p-3 border-b">
                <button className="text-gray-600 hover:text-black">
                  <X size={20} onClick={() => setShowComment(false)} className="cursor-pointer"/>
                </button>
                <p className="text-sm font-semibold">Thread trả lời</p>
                <div></div>
              </div>

              <div className="p-4">
                <div className="flex space-x-3">
                  <img src={user?.avatar || "https://placehold.co/40x40"} alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{user?.full_name || "Người dùng"} <span className="text-gray-500 text-xs">• {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : ''}</span></p>
                    <p className="text-sm text-gray-800">{post.content}</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex space-x-3">
                  <img src="https://placehold.co/40x40" alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`Trả lời ${user?.full_name || "người dùng"}`}
                      className="w-full border-none outline-none bg-transparent text-sm text-gray-800"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex space-x-3 text-gray-500 mt-2 items-center">
                      <label>
                        <MoreHorizontal size={18} className="cursor-pointer hover:text-black" />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setCommentImage(file);
                          }}
                        />
                      </label>
                      <label>
                        <Video size={18} className="cursor-pointer hover:text-black" />
                        <input
                          type="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setCommentVideo(file);
                          }}
                        />
                      </label>
                      {commentImage && (
                        <div className="relative w-10 h-10">
                          <img
                            src={URL.createObjectURL(commentImage)}
                            alt="preview"
                            className="w-10 h-10 object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-white rounded-full p-0.5 text-xs text-red-500 border border-gray-300 hover:bg-gray-200"
                            onClick={() => setCommentImage(null)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {commentVideo && (
                        <div className="relative w-16 h-10">
                          <video
                            src={URL.createObjectURL(commentVideo)}
                            className="w-16 h-10 object-cover rounded"
                            controls
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-white rounded-full p-0.5 text-xs text-red-500 border border-gray-300 hover:bg-gray-200"
                            onClick={() => setCommentVideo(null)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <button
                  className={`w-full py-2 rounded-lg ${
                    newComment.trim()
                      ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!newComment.trim()}
                  onClick={handleComment}
                >
                  Đăng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  const ActionButton = ({ icon, count, onClick }: { icon: React.ReactNode, count: number, onClick: () => void }) => (
    <button className="flex items-center space-x-2 hover:text-blue-500" onClick={onClick}>
      {icon}
      <span>{count}</span>
    </button>
  )
  const EmptyState = ({ message }: { message: string }) => (
    <div className="py-8 text-center text-gray-500">
      <p>{message}</p>
    </div>
  )

  const handleTabChange = (tab: string) => {
    // TODO: Implement tab change functionality
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setIsFollowing(true);
        await fetchProfile();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (!loading && !user) {
    notFound()
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Hồ sơ</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          {/* Profile header */}
          <div className="flex items-center space-x-4">
            <img src={user?.avatar || "https://placehold.co/100x100"} alt="Avatar" className="w-20 h-20 rounded-full" />
            <div>
              <h2 className="text-xl font-bold">{user?.full_name || "username"}</h2>
              <p className="text-gray-500">@{user?.username || "username"}</p>
              <div className="flex space-x-4 mt-2">
                <div>
                  <span className="font-bold">{Array.isArray(posts) ? posts.length : 0}</span> bài viết
                </div>
                <div>
                  <span className="font-bold">{user?.followers?.length || 0}</span> người theo dõi
                </div>
                <div>
                  <span className="font-bold">{user?.following?.length || 0}</span> đang theo dõi
                </div>
              </div>
            </div>
            {currentUser?.user_id !== userId && (
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
            )}
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
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.post_id} post={post} onActionDone={fetchProfile} />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">Không có bài viết nào.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
