import { Heart, Repeat, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: {
    post_id: number | string;
    user_id: number | string;
    content: string;
    image_id?: string;
    video_id?: string;
    created_at: string;
    likes?: number;
    comments?: number;
    reposts?: number;
    saves?: number;
    image?: string; // fallback for page main
    video?: string; // fallback for page main
  };
  user: {
    username: string;
    avatar: string;
  };
  state: {
    liked?: boolean;
    reposted?: boolean;
    likeCount?: number;
    repostCount?: number;
  };
  onLike: (post: PostCardProps['post']) => void;
  onRepost: (post: PostCardProps['post']) => void;
  onComment: (post: PostCardProps['post']) => void;
  onClick: () => void;
}

export default function PostCard({ post, user, state, onLike, onRepost, onComment, onClick }: PostCardProps) {
  const router = useRouter();

  // Lấy media url đúng cho cả page main và search
  const imageUrl = post.image_id
    ? `http://127.0.0.1:8000/media/${post.image_id}`
    : post.image || "";
  const videoUrl = post.video_id
    ? `http://127.0.0.1:8000/media/${post.video_id}`
    : post.video || "";

  return (
    <div
      className="bg-white text-black p-4 shadow-md w-full rounded-lg border hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-3">
        <img 
          src={user.avatar || "https://placehold.co/40x40"} 
          alt="Avatar" 
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{user.username || "user"}</span>
            <span className="text-sm text-gray-500">{post.created_at}</span>
          </div>

          <p className="mt-2 break-words">{post.content}</p>

          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Post" 
              className="mt-2 rounded-lg max-w-full"
            />
          )}

          {videoUrl && (
            <video 
              src={videoUrl} 
              controls 
              className="mt-2 rounded-lg w-full"
            />
          )}

          <div className="flex gap-4 text-gray-500 mt-3">
            <button
              className="flex items-center space-x-1 hover:text-black"
              onClick={e => {
                e.stopPropagation();
                onLike(post);
              }}
            >
              <Heart 
                size={18} 
                className={state.liked ? "text-red-500" : "text-gray-500"} 
              />
              <span>{state.likeCount ?? post.likes ?? 0}</span>
            </button>

            <button
              className="flex items-center space-x-1 hover:text-black"
              onClick={e => {
                e.stopPropagation();
                onComment(post);
              }}
            >
              <MessageCircle size={18} />
              <span>{post.comments ?? 0}</span>
            </button>

            <button
              className="flex items-center space-x-1 hover:text-black"
              onClick={e => {
                e.stopPropagation();
                onRepost(post);
              }}
            >
              <Repeat 
                size={18} 
                className={state.reposted ? "text-green-500" : "text-gray-500"} 
              />
              <span>{state.repostCount ?? post.reposts ?? 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
