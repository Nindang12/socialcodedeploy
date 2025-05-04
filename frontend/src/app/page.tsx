'use client'
import { MessageCircle, Heart, Repeat, Smile, Image, MapPin, AlignLeft, X, MoreHorizontal, Ellipsis } from "lucide-react";
import { useState,ReactNode, useEffect  } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const posts = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
  id: number;
  user_id: number;
  content: string;
  image_id?: string;
  video_id?: string;
  created_at: string;
  likes: number;
  comments: number;
  reposts: number;
  saves: number;
}

interface UserResponse {
  user: {
    username: string;
    // ... các trường khác nếu cần
  };
}

export default function Home() {
  const router = useRouter();
  const [showUploadPost, setShowUploadPost] = useState(false);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [localPosts, setLocalPosts] = useState(posts);

  const formatTime = (createdAt: string) => {
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} giờ`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày`;
    }
  };

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
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            const username = userRes.data.user?.username || `user_${post.user_id}`;
            const imageUrl = post.image_id ? `http://127.0.0.1:8000/media/${post.image_id}` : "";
            const videoUrl = post.video_id ? `http://127.0.0.1:8000/media/${post.video_id}` : "";

            return {
              ...post,
              time: formatTime(post.created_at),
              avatar: `https://placehold.co/40x40?text=${post.user_id}`,
              username: username,
              image: imageUrl,
              video: videoUrl,
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
            };
          }
        }));
    
        setLocalPosts(postsWithUsernames as typeof posts[0][]);
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

      // Lấy username của user hiện tại
      const userRes = await axios.get<UserResponse>(`http://127.0.0.1:8000/users/${response.data.user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Tạo post mới với dữ liệu chuẩn
      const newPost = {
        ...response.data,
        time: formatTime(response.data.created_at),
        avatar: `https://placehold.co/40x40?text=${response.data.user_id}`,
        username: userRes.data.user.username,
        image: response.data.image_id || "",
        video: response.data.video_id || "",
        likes: typeof response.data.likes === "number" ? response.data.likes : 0,
        comments: typeof response.data.comments === "number" ? response.data.comments : 0,
        reposts: typeof response.data.reposts === "number" ? response.data.reposts : 0,
        saves: typeof response.data.saves === "number" ? response.data.saves : 0,
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
      <h1 className="text-xl font-bold mb-4">Trang chủ</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          <div
            className="flex items-center space-x-3 border-b pb-3"
            onClick={() => setShowUploadPost((prev) => !prev)}
          >
            <img src="https://placehold.co/40" alt="Avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Có gì mới?"
                className="flex-1 p-2 border rounded-lg focus:outline-none"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">Đăng</button>
            </div>
          </div>

          {showUploadPost && (
            <div className="fixed inset-0 h-full flex items-center justify-center bg-black/50">
              <div className="bg-white w-[600px] rounded-2xl shadow-lg p-4 translate-x-10">
                <div className="flex justify-between items-center border-b pb-2">
                  <button className="text-gray-600 hover:text-black">
                    <X size={22} onClick={onClose} className="cursor-pointer" />
                  </button>
                  <h2 className="text-lg font-semibold">Thread mới</h2>
                  <div></div>
                </div>

                <div className="p-3 space-y-3">
                  <div className="flex items-start space-x-3">
                    <img src="https://placehold.co/40" alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div className="w-full">
                      <p className="text-sm font-semibold">
                        nindang035 <span className="text-gray-500">› Thêm chủ đề</span>
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
                      <svg width="20" height="20" fill="currentColor" className="cursor-pointer hover:text-black">
                        <rect width="20" height="20" rx="3" fill="#ccc"/>
                        <text x="10" y="15" textAnchor="middle" fontSize="10" fill="#333">Video</text>
                      </svg>
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

          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            {localPosts.map((post) => (
              <div key={post.id} onClick={() => router.push(`/comment/${post.id}`)} className="cursor-pointer">
                <Post {...post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Post({ id, avatar, username, time, content, image, video, likes, comments, reposts, saves }: typeof posts[0] & { video?: string }) {
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


  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setRepostCount(prev => reposted ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    // TODO: Implement comment functionality
  };

  const handleEditPost = () => {
    // TODO: Implement edit post functionality
  };

  const handleDeletePost = () => {
    // TODO: Implement delete post functionality
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    // TODO: Implement follow/unfollow functionality
  };

  return (
    <div className="bg-white p-4 shadow-md w-full rounded-lg border">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <div>
                <p className="font-semibold">{username}</p>
                <p className="text-sm text-gray-500">{time}</p>
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  isFollowing
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </button>
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
          <div className="absolute bg-white border border-gray-200 shadow-md p-2 rounded-lg translate-x-[230%] translate-y-7" onClick={(e) => {
            e.stopPropagation();
          }}>
            <button className="w-full text-left hover:bg-gray-100 p-2" onClick={() => {setEditMode(true);setShowOptions(false);}}>Chỉnh sửa</button>
            <button className="w-full text-left hover:bg-gray-100 p-2" onClick={handleDeletePost}>Xóa</button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="mt-2">{content}</p>
      {image && <img src={`${image}`} alt="Post" className="mt-2 rounded-lg" />}
      {video && <video src={`${video}`} controls className="mt-2 rounded-lg w-full" />}

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
          className="fixed inset-0 flex items-center justify-center bg-black/50" 
          onClick={(e) => {
            e.stopPropagation(); 
          }}
        >
          <div className="bg-white w-[500px] rounded-xl shadow-lg translate-x-10">
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
                  src="https://placehold.co/40x40"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">username <span className="text-gray-500 text-xs">• time</span></p>
                  <p className="text-sm text-gray-800">content</p>
                </div>
              </div>
            </div>
    
            {/* Ô nhập phản hồi */}
            <div className="p-4">
              <div className="flex space-x-3">
                <img
                  src="https://placehold.co/40x40"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Trả lời username"
                    className="w-full border-none outline-none bg-transparent text-sm text-gray-800"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex space-x-3 text-gray-500 mt-2">
                    <button><Image size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
    
            {/* Nút Đăng */}
            <div className="p-4">
              <button className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed" onClick={handleComment}>
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
