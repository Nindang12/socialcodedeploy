'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Heart, MessageCircle, Repeat, Ellipsis, X, MoreHorizontal, Image, Video } from 'lucide-react';

interface PostType {
  post_id: number;
  user_id: number;
  avatar: string;
  username: string;
  time: string;
  content: string;
  image: string;
  video?: string;
  likes: number;
  comments: number;
  reposts: number;
  saves: number;
  liked_by?: string[];
  reposted_by?: string[];
  created_at?: string;
}

export default function LikePage() {
  const router = useRouter();
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Lấy user hiện tại
        let currentUser;
        try {
          const userRes = await axios.get('http://127.0.0.1:8000/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          currentUser = userRes.data.user;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } catch (error) {
          console.error("Error fetching current user:", error);
          router.push('/login');
          return;
        }

        // Lấy tất cả bài viết
        const response = await axios.get('http://127.0.0.1:8000/posts', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Lọc các bài viết đã like và build lại object post giống trang chủ
        const posts = Array.isArray(response.data) ? response.data : (response.data.results || response.data.posts || []);
        const liked = posts.filter((post: any) => {
          if (!post.liked_by) return false;
          const likedByIds = post.liked_by.map((id: any) => String(id).trim());
          const currentUserId = String(currentUser.user_id).trim();
          return likedByIds.includes(currentUserId);
        });

        // Build lại object post cho đúng giao diện trang chủ
        const likedPostsWithUser = await Promise.all(liked.map(async (post: any) => {
          let userInfo = post.user;
          if (!userInfo) {
            try {
              const userRes = await axios.get(`http://127.0.0.1:8000/users/${post.user_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              userInfo = userRes.data.user;
            } catch {
              userInfo = { username: post.user_id, avatar: "https://placehold.co/40x40?text=U" };
            }
          }
          return {
            ...post,
            avatar: userInfo.avatar || `https://placehold.co/40x40?text=${userInfo.username || post.user_id}`,
            username: userInfo.username || post.user_id,
            time: post.created_at ? formatTime(post.created_at) : '',
            image: post.image_id ? `http://127.0.0.1:8000/media/${post.image_id}` : post.image || '',
            video: post.video_id ? `http://127.0.0.1:8000/media/${post.video_id}` : post.video || '',
            likes: typeof post.likes === 'number' ? post.likes : 0,
            comments: typeof post.comments === 'number' ? post.comments : 0,
            reposts: typeof post.reposts === 'number' ? post.reposts : 0,
            saves: typeof post.saves === 'number' ? post.saves : 0,
            created_at: post.created_at,
          };
        }));

        setLikedPosts(likedPostsWithUser);
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [router]);

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl text-black font-bold mb-4">Bài viết đã thích</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : likedPosts.length === 0 ? (
              <div className="text-center">
                Bạn chưa thích bài viết nào
              </div>
            ) : (
              likedPosts.map((post: any) => (
                <Post
                  key={post._id || post.post_id}
                  {...post}
                  setLocalPosts={setLikedPosts}
                  currentUser={JSON.parse(localStorage.getItem('currentUser') || '{}')}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Post({
  post_id,
  user_id,
  avatar,
  username,
  time,
  content,
  image,
  video,
  likes,
  comments,
  reposts,
  saves,
  liked_by = [],
  reposted_by = [],
  created_at,
  setLocalPosts,
  currentUser
}: PostType & {
  setLocalPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  currentUser: { username: string; user_id: string } | null;
}) {
  const [showComment, setShowComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [reposted, setReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(reposts);
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState(comments);
  const [showOptions, setShowOptions] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [errorMsg, setErrorMsg] = useState("");
  const optionRef = useRef<HTMLDivElement>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [commentVideo, setCommentVideo] = useState<File | null>(null);

  useEffect(() => {
    if (!post_id || !token || !currentUser) return;

    const fetchPostAndUser = async () => {
      try {
        // Fetch post để lấy trạng thái like chính xác
        const postRes = await fetch(`http://127.0.0.1:8000/posts/${post_id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
        });
        if (!postRes.ok) return;
        const postData = await postRes.json();

        // Kiểm tra liked
        if (postData && Array.isArray(postData.liked_by)) {
          const userHasLiked = postData.liked_by
            .map((id: string) => String(id).trim())
            .includes(String(currentUser.user_id).trim());
          setLiked(userHasLiked);
          setLikeCount(postData.likes);
        }

        // Kiểm tra reposted
        if (postData && Array.isArray(postData.reposted_by)) {
          const userHasReposted = postData.reposted_by
            .map((id: string) => String(id).trim())
            .includes(String(currentUser.user_id).trim());
          setReposted(userHasReposted);
          setRepostCount(postData.reposts);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };

    fetchPostAndUser();
  }, [post_id, token, currentUser]);

  const handleLike = async () => {
    try {
      if (!token || !currentUser) return;

      const response = await fetch(`http://127.0.0.1:8000/posts/${post_id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to like post');
      const data = await response.json();

      if (data && data.liked_by) {
        const userHasLiked = data.liked_by
          .map((id: string) => String(id).trim())
          .includes(String(currentUser.user_id).trim());
        setLiked(userHasLiked);
        setLikeCount(data.likes ?? 0);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleRepost = async () => {
    try {
      if (!token || !currentUser) return;
      const response = await fetch(`http://127.0.0.1:8000/posts/${post_id}/repost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to repost');
      const data = await response.json();
      if (data && data.reposted_by) {
        const userHasReposted = data.reposted_by
          .map((id: string) => String(id).trim())
          .includes(String(currentUser.user_id).trim());
        setReposted(userHasReposted);
        setRepostCount(data.reposts ?? 0);
      }
    } catch (error) {
      console.error('Error reposting:', error);
    }
  };

  return (
    <div className="bg-white text-black p-4 shadow-md w-full rounded-lg border">
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <img src={avatar ? `http://127.0.0.1:8000/media/${avatar}` : "https://placehold.co/40x40"} alt="Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">{username || user_id}</p>
            <p className="text-sm text-gray-500">{time || (created_at ? formatTime(created_at) : "")}</p>
          </div>
        </div>
      </div>

      <div onClick={() => router.push(`/comment/${post_id}`)}>
        <p className="mt-2">{content}</p>
        {image && <img src={image} alt="Post" className="mt-2 rounded-lg" />}
        {video && <video src={video} controls className="mt-2 rounded-lg w-full" />}
      </div>

      <div className="flex gap-4 text-gray-500 mt-3">
        <ActionButton 
          icon={<Heart size={18} className={liked ? "text-red-500" : "text-gray-500"} />} 
          count={likeCount} 
          onClick={handleLike}
        />
        <ActionButton 
          icon={<MessageCircle size={18} />} 
          count={commentCount} 
          onClick={() => setShowComment((prev) => !prev)}
        />
        <ActionButton 
          icon={<Repeat size={18} className={reposted ? "text-green-500" : "text-gray-500"} />} 
          count={repostCount} 
          onClick={handleRepost}
        />
      </div>
    </div>
  );
}

function ActionButton({ 
  icon, 
  count, 
  onClick 
}: { 
  icon: React.ReactNode; 
  count: number; 
  onClick?: (e: React.MouseEvent) => void; 
}) {
  return (
    <button 
      className="flex items-center space-x-1 hover:text-black"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {icon}
      <span>{count}</span>
    </button>
  );
}

function formatTime(createdAt: string) {
  const now = new Date();
  const postDate = new Date(createdAt);
  const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  } else if (diffInMinutes < 1440) {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} giờ`;
  } else {
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return `${diffInDays} ngày`;
  }
}