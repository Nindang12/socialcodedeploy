'use client'
import { MessageCircle, Heart, Repeat, Smile, Image, MapPin, AlignLeft, X, MoreHorizontal, Ellipsis, Video } from "lucide-react";
import { useState,ReactNode, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const posts = [
  {
    post_id: 1,
    user_id: 1,
    avatar: "https://placehold.co/40x40", 
    username: "username",
    time: "19 giờ",
    content: "content",
    image: "https://placehold.co/500x200",
    likes: 474,
    comments: 3,
    reposts: 27,
    saves: 8,
  },
  {
    post_id: 2,
    user_id: 2,
    avatar: "https://placehold.co/40x40",
    username: "username", 
    time: "1 ngày",
    content: "content",
    image: "https://placehold.co/500x200",
    likes: 320,
    comments: 5,
    reposts: 15,
    saves: 6,
  },
  {
    post_id: 3,
    user_id: 3,
    avatar: "https://placehold.co/40x40",
    username: "randomuser",
    time: "2 ngày", 
    content: "Just finished my first marathon! 🏃‍♂️",
    image: "https://placehold.co/500x200",
    likes: 289,
    comments: 12,
    reposts: 9,
    saves: 4,
  },
];

interface PostResponse {
  post_id: number;
  user_id: number;
  content: string;
  image_id?: string;
  video_id?: string;
  created_at: string;
  likes: number;
  comments: number;
  reposts: number;
  saves: number;
  liked_by?: string[];
  reposted_by?: string[];
}

interface UserResponse {
  user: {
    username: string;
    user_id: string;
    avatar?: string;
    followers?: string[];
    following?: string[];
  };
}

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
}

export default function Home() {
  const router = useRouter();
  const [showUploadPost, setShowUploadPost] = useState(false);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [localPosts, setLocalPosts] = useState<PostType[]>(posts);

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

  const [currentUser, setCurrentUser] = useState<{ username: string; user_id: string; avatar?: string } | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get<UserResponse>("http://127.0.0.1:8000/users/me", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setCurrentUser(response.data.user);
      } catch (err: any) {
        console.error("Error fetching current user:", err);
        if (err.response?.status === 401) {
          router.push('/login');
        }
      }
    };

    fetchCurrentUser();
  }, [router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
    
        const res = await axios.get<PostResponse[]>("http://127.0.0.1:8000/posts", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        // Fetch thêm username từ API người dùng nếu chưa có trong bài viết
        const postsWithUsernames = await Promise.all(res.data.map(async (post) => {
          try {
            const userRes = await axios.get<UserResponse>(`http://127.0.0.1:8000/users/${post.user_id}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            const username = userRes.data.user?.username || `user_${post.user_id}`;
            const avatarId = userRes.data.user?.avatar;
            const imageUrl = post.image_id ? `http://127.0.0.1:8000/media/${post.image_id}` : "";
            const videoUrl = post.video_id ? `http://127.0.0.1:8000/media/${post.video_id}` : "";

            return {
              ...post,
              time: formatTime(post.created_at),
              avatar: avatarId ? avatarId : `https://placehold.co/40x40?text=${post.user_id}`,
              username: username,
              image: imageUrl,
              video: videoUrl,
              liked_by: post.liked_by || [],
              reposted_by: post.reposted_by || [],
            };
          } catch (error) {
            console.error('Error fetching user:', error);
            return {
              ...post,
              time: formatTime(post.created_at), 
              avatar: `https://placehold.co/40x40?text=${post.user_id}`,
              username: `user_${post.user_id}`,
              image: "",
              video: "",
              liked_by: [],
              reposted_by: [],
            };
          }
        }));
    
        setLocalPosts(postsWithUsernames as PostType[]);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        if (err.response?.status === 401) {
          router.push('/login');
        }
      }
    };
    
    fetchPosts();
  }, [router]);

  const onClose = () => {
    setShowUploadPost(false);
  };

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const formData = new FormData();
      formData.append("content", content);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      if (selectedVideo) {
        formData.append("video", selectedVideo);
      }

      // Gửi post lên server
      const response = await axios.post<PostResponse>("http://127.0.0.1:8000/posts", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Lấy thông tin user hiện tại
      const userRes = await axios.get<UserResponse>(`http://127.0.0.1:8000/users/${response.data.user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const userData = userRes.data.user;
      const avatarUrl = userData.avatar ? userData.avatar : `https://placehold.co/40x40?text=${userData.username}`;

      // Tạo post mới với dữ liệu chuẩn
      const newPost = {
        ...response.data,
        time: formatTime(response.data.created_at),
        avatar: avatarUrl,
        username: userData.username,
        image: response.data.image_id ? `http://127.0.0.1:8000/media/${response.data.image_id}` : "",
        video: response.data.video_id ? `http://127.0.0.1:8000/media/${response.data.video_id}` : "",
        likes: typeof response.data.likes === "number" ? response.data.likes : 0,
        comments: typeof response.data.comments === "number" ? response.data.comments : 0,
        reposts: typeof response.data.reposts === "number" ? response.data.reposts : 0,
        saves: typeof response.data.saves === "number" ? response.data.saves : 0,
        liked_by: [],
        reposted_by: [],
      };

      setLocalPosts((prevPosts) => [newPost, ...prevPosts]);
      setContent("");
      setSelectedImage(null);
      setSelectedVideo(null);
      setShowUploadPost(false);
    } catch (err) {
      console.error("Error creating post:", err);
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl text-black font-bold mb-4">Trang chủ</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          <div
            className="flex items-center space-x-3 border-b pb-3"
            onClick={() => setShowUploadPost((prev) => !prev)}
          >
              <img
                src={currentUser?.avatar ? `http://127.0.0.1:8000/media/${currentUser.avatar}` : "https://placehold.co/40x40"}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Có gì mới?"
                className="flex-1 p-2 border rounded-lg text-black focus:outline-none"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">Đăng</button>
            </div>
          </div>

          {showUploadPost && (
            <div className="fixed  inset-0 h-full flex text-black items-center justify-center bg-black/50 z-50">
              <div className="bg-white w-[600px]  rounded-2xl shadow-lg p-4 translate-x-10">
                <div className="flex justify-between items-center border-b pb-2">
                  <button className="text-gray-600 hover:text-black">
                    <X size={22} onClick={onClose} className="cursor-pointer" />
                  </button>
                  <h2 className="text-lg font-semibold">Thread mới</h2>
                  <div></div>
                </div>

                <div className="p-3 space-y-3">
                  <div className="flex items-start space-x-3">
                    <img
                      src={currentUser?.avatar ? `http://127.0.0.1:8000/media/${currentUser.avatar}` : "https://placehold.co/40x40"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="w-full">
                      <p className="text-sm font-semibold">
                        {currentUser?.username || 'Loading...'} <span className="text-gray-500">› Thêm chủ đề</span>
                      </p>
                      <textarea
                        className="w-full mt-1 p-2 text-sm border-none outline-none resize-none"
                        rows={2}
                        placeholder="Có gì mới?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && content.trim()) {
                            e.preventDefault();
                            handlePost();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 space-x-4">
                    <label>
                      <Image size={20} className="cursor-pointer hover:text-black" />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedImage(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <label>
                      <Video size={20} className="cursor-pointer hover:text-black" />
                      <input
                        type="file"
                        accept="video/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedVideo(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    {(selectedImage || selectedVideo) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setSelectedVideo(null);
                        }}
                        className="ml-2 text-red-500"
                      >
                        Xóa file
                      </button>
                    )}
                  </div>

                  {selectedImage && (
                    <div className="relative w-32 h-20 mt-2">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="preview"
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white rounded-full p-0.5 text-xs text-red-500 border border-gray-300 hover:bg-gray-200"
                        onClick={() => setSelectedImage(null)}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedVideo && (
                    <div className="relative w-40 h-24 mt-2">
                      <video
                        src={URL.createObjectURL(selectedVideo)}
                        className="w-full h-full object-cover rounded"
                        controls
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white rounded-full p-0.5 text-xs text-red-500 border border-gray-300 hover:bg-gray-200"
                        onClick={() => setSelectedVideo(null)}
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t pt-3">
                    <button className="text-gray-500 text-sm">
                      Bất kỳ ai cũng có thể trả lời và trích dẫn
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        content.trim() ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!content.trim()}
                      onClick={handlePost}
                    >
                      Đăng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 max-h-[75vh] overflow-y-auto">
          {localPosts.map((post) => (
            <Post
              key={post.post_id}
              {...post}
              setLocalPosts={setLocalPosts}
              currentUser={currentUser}
            />
          ))}
        
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
  setLocalPosts,
  currentUser
}: PostType & {
  setLocalPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  currentUser: { username: string; user_id: string; avatar?: string } | null;
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

  // Check if current user is following the post author
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!token || !user_id || !currentUser?.user_id) return;
      if (String(user_id) === String(currentUser.user_id)) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/users/${user_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const followers = data.user?.followers || [];
          const isUserFollowing = followers
            .map((id: string) => String(id).trim())
            .includes(String(currentUser.user_id).trim());
          setIsFollowing(isUserFollowing);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, [token, user_id, currentUser]);

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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/posts/${post_id}/repost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to repost');
      const data = await response.json();

      if (data && data.reposted_by && currentUser) {
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

  const handleComment = async () => {
    try {
      const formData = new FormData();
      formData.append("content", newComment);
      if (commentImage) {
        formData.append("image", commentImage);
      }
      if (commentVideo) {
        formData.append("video", commentVideo);
      }
      const response = await fetch(`http://127.0.0.1:8000/posts/${post_id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setCommentCount(prev => (data.comments ? data.comments : prev + 1));
        setNewComment("");
        setCommentImage(null);
        setCommentVideo(null);
        setShowComment(false);
      } else {
        console.error('Failed to comment on post:', response.status);
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleEditPost = async () => {
    try {
      const formData = new FormData();
      formData.append('content', editedContent);

      const response = await fetch(`http://127.0.0.1:8000/posts/${post_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        setEditMode(false);
        setErrorMsg("");
        setLocalPosts(prevPosts => prevPosts.map(post => 
          post.post_id === post_id ? { ...post, content: editedContent } : post
        ));
      } else {
        const data = await response.json();
        if (data.detail) {
          setErrorMsg(data.detail);
        } else {
          setErrorMsg("Có lỗi xảy ra khi chỉnh sửa bài viết.");
        }
        console.error('Failed to edit post:', response.status);
      }
    } catch (error) {
      setErrorMsg("Có lỗi xảy ra khi chỉnh sửa bài viết.");
      console.error('Error editing post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/posts/${post_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setErrorMsg("");
        console.log('Post deleted successfully');
        setLocalPosts((prevPosts: PostType[]) => prevPosts.filter((post: PostType) => post.post_id !== post_id));
      } else {
        const data = await response.json();
        if (data.detail) {
          setErrorMsg(data.detail);
        } else {
          setErrorMsg("Có lỗi xảy ra khi xóa bài viết.");
        }
        console.error('Failed to delete post:', response.status);
      }
    } catch (error) {
      setErrorMsg("Có lỗi xảy ra khi xóa bài viết.");
      console.error('Error deleting post:', error);
    }
  };

  const handleFollow = async () => {
    if (!token || !user_id || !currentUser?.user_id) return;
    if (String(user_id) === String(currentUser.user_id)) return;
    setIsFollowLoading(true);
    try {
      // First check if already following
      const checkResponse = await fetch(`http://127.0.0.1:8000/users/${user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (checkResponse.ok) {
        const userData = await checkResponse.json();
        const followers = userData.user?.followers || [];
        const alreadyFollowing = followers
          .map((id: string) => String(id).trim())
          .includes(String(currentUser.user_id).trim());
          
        if (alreadyFollowing) {
          console.log('Already following this user');
          setIsFollowing(true);
          setIsFollowLoading(false);
          return;
        }
      }

      // If not following, proceed with follow request
      const response = await fetch(`http://127.0.0.1:8000/users/${user_id}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const followers = data.user?.followers || [];
        const isUserFollowing = followers
          .map((id: string) => String(id).trim())
          .includes(String(currentUser.user_id).trim());
        setIsFollowing(isUserFollowing);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!token || !user_id || !currentUser?.user_id) return;
    if (String(user_id) === String(currentUser.user_id)) return;
    setIsFollowLoading(true);
    try {
      // First check if actually following
      const checkResponse = await fetch(`http://127.0.0.1:8000/users/${user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (checkResponse.ok) {
        const userData = await checkResponse.json();
        const followers = userData.user?.followers || [];
        const isFollowing = followers
          .map((id: string) => String(id).trim())
          .includes(String(currentUser.user_id).trim());
          
        if (!isFollowing) {
          console.log('Not following this user');
          setIsFollowing(false);
          setIsFollowLoading(false);
          return;
        }
      }

      // If following, proceed with unfollow request
      const response = await fetch(`http://127.0.0.1:8000/users/${user_id}/unfollow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const followers = data.user?.followers || [];
        const isUserFollowing = followers
          .map((id: string) => String(id).trim())
          .includes(String(currentUser.user_id).trim());
        setIsFollowing(isUserFollowing);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  useEffect(() => {
    if (!showOptions) return;
    function handleClickOutside(event: MouseEvent) {
      if (optionRef.current && !optionRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  console.log("Render Heart, liked:", liked);

  return (
    <div className="bg-white text-black p-4 shadow-md w-full rounded-lg border">
      {/* Header */}
      <div className="flex justify-between relative">
        <div className="flex items-center space-x-3">
          <img
            src={avatar && !avatar.startsWith('http') ? `http://127.0.0.1:8000/media/${avatar}?${Date.now()}` : (avatar || `https://placehold.co/40x40?text=${username}`)}
            alt="Avatar" 
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <div>
                <Link href={`/profile/${user_id}`}>
                  <span className="text-sm font-semibold text-black hover:underline cursor-pointer">
                    {username}
                  </span>
                </Link>
                <p className="text-sm text-gray-500">{time}</p>
              </div>
              {String(user_id) !== String(currentUser?.user_id) && (
                <button
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium transition-colors duration-150 ${
                    isFollowing
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } ${isFollowLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? (
                    <span className="loader w-3 h-3 border-2 border-t-2 border-gray-400 rounded-full animate-spin"></span>
                  ) : isFollowing ? (
                    <>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="#16a34a" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      Đang theo dõi
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                      Theo dõi
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="hover:bg-gray-100 p-2 rounded-full flex justify-center items-center w-8 h-8" onClick={(e) => {e.stopPropagation()}}>
          <Ellipsis 
            size={20} 
            className="cursor-pointer hover:text-black" 
            onClick={() => setShowOptions((prev) => !prev)}
          />
        </div>
        {showOptions && (
          <div
            ref={optionRef}
            className="absolute right-2 top-10 z-50 bg-white border border-gray-200 shadow-md p-2 rounded-lg"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <button className="w-full text-left hover:bg-gray-100 p-2" onClick={() => {setEditMode(true);setShowOptions(false);}}>Chỉnh sửa</button>
            <button className="w-full text-left hover:bg-gray-100 p-2" onClick={handleDeletePost}>Xóa</button>
          </div>
        )}
      </div>

      {/* Content */}
      {editMode ? (
        <div className="mt-2" >
          <div className="flex flex-col gap-2" onClick={(e) => {e.stopPropagation()}}>
            <textarea 
              className="w-full p-2 border rounded-lg"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button 
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleEditPost}
              >
                Lưu 
              </button>
              <button
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setEditMode(false)}
              >
                Hủy
              </button>
            </div>
          </div>
          {errorMsg && (
            <div className="text-red-500 text-sm mt-2">{errorMsg}</div>
          )}
        </div>
      ) : (
        <>
          <div 
            className="cursor-pointer" 
            onClick={() => router.push(`/comment/${post_id}`)}
          >
            <p className="mt-2">{content}</p>
            {errorMsg && (
              <div className="text-red-500 text-sm mt-2">{errorMsg}</div>
            )}
            {image && <img src={`${image}`} alt="Post" className="mt-2 rounded-lg" />}
            {video && <video src={`${video}`} controls className="mt-2 rounded-lg w-full" />}
          </div>
        </>
      )}

      {/* Action Buttons */}
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

      {showComment && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" 
          onClick={(e) => {
            e.stopPropagation(); 
          }}
        >
          <div className="bg-white w-[500px] rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <button className="text-gray-600 hover:text-black">
                <X size={20} onClick={() => setShowComment(false)} className="cursor-pointer"/>
              </button>
              <p className="text-sm font-semibold">Thread trả lời</p>
              <button className="text-gray-600 hover:text-black">
                <MoreHorizontal size={20} />
              </button>
            </div>
    
            {/* Nội dung thread */}
            <div className="p-4">
              <div className="flex space-x-3">
                <img  
                  src={avatar && !avatar.startsWith('http') ? `http://127.0.0.1:8000/media/${avatar}` : (avatar || `https://placehold.co/40x40?text=${username}`)}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{username} <span className="text-gray-500 text-xs">• {time}</span></p>
                  <p className="text-sm text-gray-800">{content}</p>
                </div>
              </div>
            </div>
    
            {/* Ô nhập phản hồi */}
            <div className="p-4">
              <div className="flex space-x-3">
                <img
                  src={avatar && !avatar.startsWith('http') ? `http://127.0.0.1:8000/media/${avatar}` : (avatar || `https://placehold.co/40x40?text=${username}`)}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Trả lời ${username}`}
                    className="w-full border-none outline-none bg-transparent text-sm text-gray-800"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex space-x-3 text-gray-500 mt-2 items-center">
                    <label>
                      <Image size={18} className="cursor-pointer hover:text-black" />
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
    
            {/* Nút Đăng */}
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

function ActionButton({ 
  icon, 
  count, 
  onClick 
}: { 
  icon: ReactNode; 
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