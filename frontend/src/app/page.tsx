'use client'
import { MessageCircle, Heart, Repeat, Smile, Image, MapPin, AlignLeft, X, MoreHorizontal, Ellipsis } from "lucide-react";
import { useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";

interface Post {
  post_id: string;
  user_id: string;
  content: string;
  image?: string;
  created_at: string;
  likes: number;
  reposts: number;
  comments: number;
  liked_by_me: boolean;
  reposted_by_me: boolean;
  commented_by_me: boolean;
}

interface PostResponse {
  liked_by: string[];
  reposted_by: string[];
  user_id: string;
  likes: number;
  reposts: number;
  comments: number;
}

interface ActionStatus {
  status: boolean;
}

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showUploadPost, setShowUploadPost] = useState(false);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await axios.get<Post[]>("http://127.0.0.1:8000/posts", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPosts(res.data);
        localStorage.setItem("posts", JSON.stringify(res.data));
      } catch (err) {
        console.error("Error fetching posts:", err);
        const error = err as { response?: { status: number } };
        if (error.response?.status === 401) {
          router.push('/login');
        }
      }
    };

    fetchPosts();
  }, [router]);

  const onClose = () => {
    setShowUploadPost(false);
    setContent("");
    setSelectedImage(null);
    setSelectedVideo(null);
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

      const response = await axios.post<Post>("http://127.0.0.1:8000/posts", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const newPost = response.data;
      setPosts([newPost, ...posts]);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
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
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                      <Image size={20} className="hover:text-black" />
                    </label>
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
            {posts.map((post) => (
              <div key={post.post_id} onClick={() => router.push(`/comment/${post.post_id}`)} className="cursor-pointer">
                <Post postId={post.post_id} {...post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Post({ postId, ...post }: { postId: string } & Post) {
  const router = useRouter();
  const [showComment, setShowComment] = useState(false);
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(post.reposted_by_me);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [showOptions, setShowOptions] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkActionStatuses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Check follow status
        const followResponse = await axios.get<ActionStatus>(`http://127.0.0.1:8000/users/${post.user_id}/follow/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsFollowing(followResponse.data.status);

      } catch (err) {
        console.error("Error checking action statuses:", err);
      }
    };

    checkActionStatuses();
  }, [postId, post.user_id]);

  const onClose = () => {
    setShowComment(false);
  };

  const handleLike = async () => {
    if (!postId) {
      console.error("Post ID not found");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post<PostResponse>(`http://127.0.0.1:8000/posts/${postId}/like`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.data) {
        throw new Error('Failed to like post');
      }

      setLiked(response.data.liked_by.includes(response.data.user_id));
      setLikeCount(response.data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleRepost = async () => {
    if (!postId) {
      console.error("Post ID not found");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post<PostResponse>(`http://127.0.0.1:8000/posts/${postId}/repost`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.data) {
        throw new Error('Failed to repost');
      }

      setReposted(response.data.reposted_by.includes(response.data.user_id));
      setRepostCount(response.data.reposts);
    } catch (err) {
      console.error("Error reposting:", err);
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleComment = async () => {
    if (!postId) {
      console.error("Post ID not found");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post<PostResponse>(`http://127.0.0.1:8000/posts/${postId}/comments`, {
        content: newComment
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.data) {
        throw new Error('Failed to add comment');
      }

      setComments(response.data.comments);
      setNewComment("");
      setShowComment(false);
    } catch (err) {
      console.error("Error adding comment:", err);
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleEditPost = async () => {
    if (!postId) {
      console.error("Post ID not found");
      return;
    }

    if (!editedContent.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const formData = new FormData();
      formData.append("content", editedContent);

      await axios.put(`http://127.0.0.1:8000/posts/${postId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setEditMode(false);
    } catch (err) {
      console.error("Error editing post:", err);
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };
  
  const handleDeletePost = async () => {
    if (!postId) {
      console.error("Post ID not found");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleFollowToggle = async (e: React.MouseEvent) => {
    if (!post.user_id) {
      console.error("User ID not found");
      return;
    }

    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`http://127.0.0.1:8000/users/${post.user_id}/${endpoint}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsFollowing(prev => !prev);
    } catch (err) {
      console.error("Error toggling follow:", err);
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const renderContent = () => {
    return editMode ? (
      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => setEditMode(false)} className="px-4 py-1 bg-gray-300 text-black rounded-lg">
            Hủy
          </button>
          <button onClick={handleEditPost} className="px-4 py-1 bg-blue-500 text-white rounded-lg">
            Lưu
          </button>
        </div>
      </div>
    ) : (
      <p className="mt-2">{post.content}</p>
    );
  };

  return (
    <div className="bg-white p-4 shadow-md w-full rounded-lg border">
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <img src="https://placehold.co/40" alt="Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <div>
                <p className="font-semibold">{post.user_id}</p>
                <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={handleFollowToggle}
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
            onClick={() => {
            setShowOptions((prev) => !prev)}
          }/>
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

      <p className="mt-2">{renderContent()}</p>
      {post.image && <img src={post.image} alt="Post" className="mt-2 rounded-lg" />}

      <div className="flex gap-4 text-gray-500 mt-3">
        <ActionButton 
          icon={<Heart size={18} className={liked ? "text-red-500" : "text-gray-500"} />} 
          count={likeCount} 
          onClick={handleLike}
        />
        <ActionButton 
          icon={<MessageCircle size={18} className={post.commented_by_me ? "text-blue-500" : "text-gray-500"} />} 
          count={comments} 
          onClick={() => setShowComment((prev) => !prev)}
        />
        <ActionButton 
          icon={<Repeat size={18} className={reposted ? "text-green-500" : "text-gray-500"} />} 
          count={repostCount} 
          onClick={handleRepost}
        />
      </div>

      {showComment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50" onClick={(e) => {e.stopPropagation()}}>
          <div className="bg-white w-[500px] rounded-xl shadow-lg translate-x-10">
            <div className="flex items-center justify-between p-3 border-b">
              <button className="text-gray-600 hover:text-black">
                <X size={20} onClick={onClose} className="cursor-pointer"/>
              </button>
              <p className="text-sm font-semibold">Thread trả lời</p>
              <button className="text-gray-600 hover:text-black">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex space-x-3">
                <img src="https://placehold.co/40x40" alt="Avatar" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{post.user_id} <span className="text-gray-500 text-xs">• {new Date(post.created_at).toLocaleString()}</span></p>
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
                    placeholder={`Trả lời ${post.user_id}`}
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

            <div className="p-4">
              <button 
                className={`w-full py-2 rounded-lg ${
                  newComment.trim() 
                    ? "bg-blue-500 text-white" 
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
