"use client";

import { useState } from "react";
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
  const [replyLikes, setReplyLikes] = useState<{ [key: number]: boolean }>({});
  const [replyLikeCounts, setReplyLikeCounts] = useState<{ [key: number]: number }>({});
  const [replyReplies, setReplyReplies] = useState<{ [key: number]: any[] }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [showInputReply, setShowInputReply] = useState<{ [key: number]: boolean }>({});

  const handleComment = () => {
    // TODO: Implement comment functionality
  };

  const handleReply = (username: string) => {
    // TODO: Implement reply functionality
  };

  const toggleReplyInput = (replyId: number) => {
    setShowInputReply((prev) => ({
      ...prev,
      [replyId]: !prev[replyId], // Chỉ bật/tắt input của comment đang bấm
    }));
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setRepostCount((prev) => (reposted ? prev - 1 : prev + 1));
  };

  const handleReplyLike = (replyId: number) => {
    setReplyLikes((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
    setReplyLikeCounts((prev) => ({
      ...prev,
      [replyId]: prev[replyId] ? prev[replyId] - 1 : (prev[replyId] || 0) + 1,
    }));
  };

  const handleReplyInputChange = (replyId: number, value: string) => {
    setReplyInputs((prev) => ({
      ...prev,
      [replyId]: value,
    }));
  };

  const handleReplySubmit = (postId: number, commentId: number) => {
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
              <img src="https://placehold.co/40x40" alt="Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">username</p>
                <p className="text-sm text-gray-500">time</p>
              </div>
            </div>
            <p className="mt-2">content</p>
            <img src="https://placehold.co/500x200" alt="Post" className="mt-2 rounded-lg" />
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
              onClick={handleComment}
            >
              Đăng
            </button>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {/* TODO: Implement comments list */}
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
