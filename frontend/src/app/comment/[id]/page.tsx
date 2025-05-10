"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MessageCircle, Heart, Repeat, Image, ArrowLeftIcon } from "lucide-react";
import { ReactNode } from "react";

export default function CommentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [reposted, setReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(0);
  const [comments, setComments] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [replyLikes, setReplyLikes] = useState<{ [key: string]: boolean }>({});
  const [replyLikeCounts, setReplyLikeCounts] = useState<{ [key: string]: number }>({});
  const [replyReplies, setReplyReplies] = useState<{ [key: string]: any[] }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [showInputReply, setShowInputReply] = useState<{ [key: string]: boolean }>({});
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [commentList, setCommentList] = useState<any[]>([]);
  const [commentLikes, setCommentLikes] = useState<{ [key: string]: boolean }>({});
  const [commentLikeCounts, setCommentLikeCounts] = useState<{ [key: string]: number }>({});

  const handleComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append("content", newComment);

      const response = await fetch(`http://127.0.0.1:8000/posts/${params.id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to comment');
      const data = await response.json();
      setCommentList(prev => [...prev, data]);
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleReply = (username: string) => {
    // TODO: Implement reply functionality
  };

  const toggleReplyInput = (commentId: string) => {
    setShowInputReply(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/posts/${params.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to like post');
      const data = await response.json();

      if (data && data.liked_by && currentUser) {
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
      const response = await fetch(`http://127.0.0.1:8000/posts/${params.id}/repost`, {
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

  const handleReplyLike = (replyId: string) => {
    setReplyLikes((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
    setReplyLikeCounts((prev) => ({
      ...prev,
      [replyId]: prev[replyId] ? prev[replyId] - 1 : (prev[replyId] || 0) + 1,
    }));
  };

  const handleReplyInputChange = (replyId: string, value: string) => {
    setReplyInputs((prev) => ({
      ...prev,
      [replyId]: value,
    }));
  };

  const handleReplySubmit = (postId: number, commentId: string) => {
    if (!replyInputs[commentId]?.trim()) return;
    
    const newReply = {
      id: Date.now(),
      username: "User",
      avatar: "https://placehold.co/40x40",
      time: "Vừa xong",
      content: replyInputs[commentId],
    };
  
    // TODO: Implement reply submission
  
    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: "",
    }));
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to like comment');
      const data = await response.json();

      // data.liked_by là mảng user_id đã like comment này
      const userHasLiked = data.liked_by
        .map((id: string) => String(id).trim())
        .includes(String(currentUser.user_id).trim());

      setCommentLikes(prev => ({ ...prev, [commentId]: userHasLiked }));
      setCommentLikeCounts(prev => ({ ...prev, [commentId]: data.likes ?? 0 }));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/posts/${params.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPost(response.data);

        // Kiểm tra liked_by và reposted_by nếu đã có currentUser
        if (response.data.liked_by && currentUser) {
          const userHasLiked = response.data.liked_by
            .map((id: string) => String(id).trim())
            .includes(String(currentUser.user_id).trim());
          setLiked(userHasLiked);
          setLikeCount(response.data.likes ?? 0);
        } else {
          setLiked(false);
          setLikeCount(response.data.likes ?? 0);
        }

        if (response.data.reposted_by && currentUser) {
          const userHasReposted = response.data.reposted_by
            .map((id: string) => String(id).trim())
            .includes(String(currentUser.user_id).trim());
          setReposted(userHasReposted);
          setRepostCount(response.data.reposts ?? 0);
        } else {
          setReposted(false);
          setRepostCount(response.data.reposts ?? 0);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [params.id, currentUser]);

  useEffect(() => {
    if (!post?.user_id) return;
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/users/${post.user_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(response.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [post]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://127.0.0.1:8000/users/me", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCurrentUser(response.data.user);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!post?._id && !post?.post_id && !params.id) return;
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://127.0.0.1:8000/posts/${post.post_id || post._id || params.id}/comments`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setCommentList(res.data);

        // Cập nhật trạng thái like cho từng comment
        if (currentUser) {
          const likesObj: { [key: string]: boolean } = {};
          const likeCountsObj: { [key: string]: number } = {};
          res.data.forEach((cmt: any) => {
            likesObj[cmt.comment_id] = cmt.liked_by?.includes(currentUser.user_id);
            likeCountsObj[cmt.comment_id] = cmt.likes ?? 0;
          });
          setCommentLikes(likesObj);
          setCommentLikeCounts(likeCountsObj);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [post, params.id, currentUser]);

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="min-w-xl flex items-center justify-between gap-4 mb-4">
        <ArrowLeftIcon size={24} className="cursor-pointer" onClick={() => window.history.back()} />
        <h1 className="text-xl font-bold mb-4">Bình luận</h1>
        <div></div>
      </div>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          {/* Post content */}
          <div className="border-b pb-4">
            <div className="flex items-center space-x-3">
              <img src={user?.avatar || "https://placehold.co/40x40"} alt="Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{user?.username || "username"}</p>
                <p className="text-sm text-gray-500">{post?.created_at ? formatTime(post.created_at) : "time"}</p>
              </div>
            </div>
            <p className="mt-2">{post?.content || "content"}</p>
            {post?.image && <img src={post.image} alt="Post" className="mt-2 rounded-lg" />}

            {/* Action Buttons */}
            <div className="flex gap-4 text-gray-500 mt-3">
              <ActionButton 
                icon={<Heart size={18} className={liked ? "text-red-500" : "text-gray-500"} />} 
                count={likeCount} 
                onClick={handleLike}
              />
              <ActionButton 
                icon={<MessageCircle size={18} />} 
                count={post?.comments ?? 0} 
                onClick={() => {}} // hoặc mở khung comment nếu muốn
              />
              <ActionButton 
                icon={<Repeat size={18} className={reposted ? "text-green-500" : "text-gray-500"} />} 
                count={repostCount} 
                onClick={handleRepost}
              />
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {commentList.length === 0 && (
              <div className="text-gray-400 text-sm">Chưa có bình luận nào.</div>
            )}
            {commentList.map((cmt: any) => (
              <div key={cmt.comment_id || cmt._id} className="flex flex-col items-start space-x-3 border-b pb-2">
                <div className="flex items-center gap-2">
                  <img src={cmt.avatar || "https://placehold.co/40x40"} alt="Avatar" className="w-8 h-8 rounded-full" />
                  <span className="font-semibold text-sm">{cmt.username || "user"}</span>
                  <span className="text-xs text-gray-400">{cmt.created_at ? formatTime(cmt.created_at) : ""}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm mt-1">{cmt.content}</div>
                  {cmt.image && <img src={cmt.image} alt="Comment" className="mt-2 rounded-lg" />}
                  {cmt.video && <video src={cmt.video} controls className="mt-2 rounded-lg w-full" />}
                </div>
                <div className="flex gap-4 text-gray-500 mt-3">
                  <ActionButton 
                    icon={<Heart size={18} className={commentLikes[cmt.comment_id] ? "text-red-500" : "text-gray-500"} />} 
                    count={commentLikeCounts[cmt.comment_id] ?? 0} 
                    onClick={() => handleLikeComment(cmt.comment_id)}
                  />
                  <ActionButton 
                    icon={<MessageCircle size={18} />} 
                    count={cmt.replies ?? 0} 
                    onClick={() => toggleReplyInput(cmt.comment_id)}
                  />
                </div>
                {showInputReply[cmt.comment_id] && (
                  <div className="flex items-start space-x-2 mt-2 w-full">
                    <img src={currentUser?.avatar || "https://placehold.co/32x32"} alt="Avatar" className="w-8 h-8 rounded-full" />
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded-lg text-sm"
                      placeholder="Trả lời bình luận..."
                      value={replyInputs[cmt.comment_id] || ""}
                      onChange={e => setReplyInputs(prev => ({ ...prev, [cmt.comment_id]: e.target.value }))}
                    />
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                      onClick={() => handleReplySubmit(post?.post_id, cmt.comment_id)}
                    >
                      Gửi
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comment input */}
          <div className="flex items-start space-x-3">
            <img src="https://placehold.co/40x40" alt="Avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Viết bình luận..."
                className="w-full p-2 border rounded-lg focus:outline-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
              onClick={async () => {
                await handleComment();
                setNewComment(''); // Reset input after comment is posted
              }}
            >
              Đăng
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, count, onClick }: { icon: ReactNode; count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center space-x-1 text-gray-500 hover:text-black">
      {icon}
      <span className="text-sm">{count}</span>
    </button>
  );
}
