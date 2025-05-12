(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_likepage_page_tsx_3486c924._.js", {

"[project]/src/app/likepage/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LikePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.js [app-client] (ecmascript) <export default as Repeat>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function LikePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [likedPosts, setLikedPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LikePage.useEffect": ()=>{
            const fetchLikedPosts = {
                "LikePage.useEffect.fetchLikedPosts": async ()=>{
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            router.push('/login');
                            return;
                        }
                        // Lấy user hiện tại
                        let currentUser;
                        try {
                            const userRes = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('http://127.0.0.1:8000/users/me', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            currentUser = userRes.data.user;
                            localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        } catch (error) {
                            console.error("Error fetching current user:", error);
                            router.push('/login');
                            return;
                        }
                        // Lấy tất cả bài viết
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('http://127.0.0.1:8000/posts', {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        // Lọc các bài viết đã like và build lại object post giống trang chủ
                        const posts = Array.isArray(response.data) ? response.data : response.data.results || response.data.posts || [];
                        const liked = posts.filter({
                            "LikePage.useEffect.fetchLikedPosts.liked": (post)=>{
                                if (!post.liked_by) return false;
                                const likedByIds = post.liked_by.map({
                                    "LikePage.useEffect.fetchLikedPosts.liked.likedByIds": (id)=>String(id).trim()
                                }["LikePage.useEffect.fetchLikedPosts.liked.likedByIds"]);
                                const currentUserId = String(currentUser.user_id).trim();
                                return likedByIds.includes(currentUserId);
                            }
                        }["LikePage.useEffect.fetchLikedPosts.liked"]);
                        // Build lại object post cho đúng giao diện trang chủ
                        const likedPostsWithUser = await Promise.all(liked.map({
                            "LikePage.useEffect.fetchLikedPosts": async (post)=>{
                                let userInfo = post.user;
                                if (!userInfo) {
                                    try {
                                        const userRes = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`http://127.0.0.1:8000/users/${post.user_id}`, {
                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            }
                                        });
                                        userInfo = userRes.data.user;
                                    } catch  {
                                        userInfo = {
                                            username: post.user_id,
                                            avatar: "https://placehold.co/40x40?text=U"
                                        };
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
                                    created_at: post.created_at
                                };
                            }
                        }["LikePage.useEffect.fetchLikedPosts"]));
                        setLikedPosts(likedPostsWithUser);
                    } catch (error) {
                        console.error("Error fetching liked posts:", error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["LikePage.useEffect.fetchLikedPosts"];
            fetchLikedPosts();
        }
    }["LikePage.useEffect"], [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-screen bg-gray-100 flex flex-col items-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl text-black font-bold mb-4",
                children: "Bài viết đã thích"
            }, void 0, false, {
                fileName: "[project]/src/app/likepage/page.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-xl w-full h-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-md p-4 space-y-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 max-h-[85vh] overflow-y-auto",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-4",
                            children: "Đang tải..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/likepage/page.tsx",
                            lineNumber: 113,
                            columnNumber: 15
                        }, this) : likedPosts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: "Bạn chưa thích bài viết nào"
                        }, void 0, false, {
                            fileName: "[project]/src/app/likepage/page.tsx",
                            lineNumber: 115,
                            columnNumber: 15
                        }, this) : likedPosts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Post, {
                                ...post,
                                setLocalPosts: setLikedPosts,
                                currentUser: JSON.parse(localStorage.getItem('currentUser') || '{}')
                            }, post._id || post.post_id, false, {
                                fileName: "[project]/src/app/likepage/page.tsx",
                                lineNumber: 120,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/likepage/page.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/likepage/page.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/likepage/page.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/likepage/page.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_s(LikePage, "mPI0x9s4MFsOkPtOckwSFWDmmyg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LikePage;
function Post({ post_id, user_id, avatar, username, time, content, image, video, likes, comments, reposts, saves, liked_by = [], reposted_by = [], created_at, setLocalPosts, currentUser }) {
    _s1();
    const [showComment, setShowComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [liked, setLiked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [likeCount, setLikeCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(likes);
    const [reposted, setReposted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [repostCount, setRepostCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(reposts);
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentCount, setCommentCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(comments);
    const [showOptions, setShowOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editMode, setEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editedContent, setEditedContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(content);
    const [isFollowing, setIsFollowing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('token') : ("TURBOPACK unreachable", undefined);
    const [errorMsg, setErrorMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const optionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isFollowLoading, setIsFollowLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [commentImage, setCommentImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [commentVideo, setCommentVideo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Post.useEffect": ()=>{
            if (!post_id || !token || !currentUser) return;
            const fetchPostAndUser = {
                "Post.useEffect.fetchPostAndUser": async ()=>{
                    try {
                        // Fetch post để lấy trạng thái like chính xác
                        const postRes = await fetch(`http://127.0.0.1:8000/posts/${post_id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include'
                        });
                        if (!postRes.ok) return;
                        const postData = await postRes.json();
                        // Kiểm tra liked
                        if (postData && Array.isArray(postData.liked_by)) {
                            const userHasLiked = postData.liked_by.map({
                                "Post.useEffect.fetchPostAndUser.userHasLiked": (id)=>String(id).trim()
                            }["Post.useEffect.fetchPostAndUser.userHasLiked"]).includes(String(currentUser.user_id).trim());
                            setLiked(userHasLiked);
                            setLikeCount(postData.likes);
                        }
                        // Kiểm tra reposted
                        if (postData && Array.isArray(postData.reposted_by)) {
                            const userHasReposted = postData.reposted_by.map({
                                "Post.useEffect.fetchPostAndUser.userHasReposted": (id)=>String(id).trim()
                            }["Post.useEffect.fetchPostAndUser.userHasReposted"]).includes(String(currentUser.user_id).trim());
                            setReposted(userHasReposted);
                            setRepostCount(postData.reposts);
                        }
                    } catch (error) {
                        console.error("Failed to fetch post:", error);
                    }
                }
            }["Post.useEffect.fetchPostAndUser"];
            fetchPostAndUser();
        }
    }["Post.useEffect"], [
        post_id,
        token,
        currentUser
    ]);
    const handleLike = async ()=>{
        try {
            if (!token || !currentUser) return;
            const response = await fetch(`http://127.0.0.1:8000/posts/${post_id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to like post');
            const data = await response.json();
            if (data && data.liked_by) {
                const userHasLiked = data.liked_by.map((id)=>String(id).trim()).includes(String(currentUser.user_id).trim());
                setLiked(userHasLiked);
                setLikeCount(data.likes ?? 0);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    const handleRepost = async ()=>{
        try {
            if (!token || !currentUser) return;
            const response = await fetch(`http://127.0.0.1:8000/posts/${post_id}/repost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to repost');
            const data = await response.json();
            if (data && data.reposted_by) {
                const userHasReposted = data.reposted_by.map((id)=>String(id).trim()).includes(String(currentUser.user_id).trim());
                setReposted(userHasReposted);
                setRepostCount(data.reposts ?? 0);
            }
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white text-black p-4 shadow-md w-full rounded-lg border",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: avatar ? `http://127.0.0.1:8000/media/${avatar}` : "https://placehold.co/40x40",
                            alt: "Avatar",
                            className: "w-10 h-10 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/src/app/likepage/page.tsx",
                            lineNumber: 269,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold",
                                    children: username || user_id
                                }, void 0, false, {
                                    fileName: "[project]/src/app/likepage/page.tsx",
                                    lineNumber: 271,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500",
                                    children: time || (created_at ? formatTime(created_at) : "")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/likepage/page.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/likepage/page.tsx",
                            lineNumber: 270,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/likepage/page.tsx",
                    lineNumber: 268,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/likepage/page.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>router.push(`/comment/${post_id}`),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2",
                        children: content
                    }, void 0, false, {
                        fileName: "[project]/src/app/likepage/page.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: image,
                        alt: "Post",
                        className: "mt-2 rounded-lg"
                    }, void 0, false, {
                        fileName: "[project]/src/app/likepage/page.tsx",
                        lineNumber: 279,
                        columnNumber: 19
                    }, this),
                    video && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                        src: video,
                        controls: true,
                        className: "mt-2 rounded-lg w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/app/likepage/page.tsx",
                        lineNumber: 280,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/likepage/page.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 text-gray-500 mt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                            size: 18,
                            className: liked ? "text-red-500" : "text-gray-500"
                        }, void 0, false, {
                            fileName: "[project]/src/app/likepage/page.tsx",
                            lineNumber: 285,
                            columnNumber: 17
                        }, void 0),
                        count: likeCount,
                        onClick: handleLike
                    }, void 0, false, {
                        fileName: "[project]/src/app/likepage/page.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/app/likepage/page.tsx",
                            lineNumber: 290,
                            columnNumber: 17
                        }, void 0),
                        count: commentCount,
                        onClick: ()=>setShowComment((prev)=>!prev)
                    }, void 0, false, {
                        fileName: "[project]/src/app/likepage/page.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                            size: 18,
                            className: reposted ? "text-green-500" : "text-gray-500"
                        }, void 0, false, {
                            fileName: "[project]/src/app/likepage/page.tsx",
                            lineNumber: 295,
                            columnNumber: 17
                        }, void 0),
                        count: repostCount,
                        onClick: handleRepost
                    }, void 0, false, {
                        fileName: "[project]/src/app/likepage/page.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/likepage/page.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/likepage/page.tsx",
        lineNumber: 266,
        columnNumber: 5
    }, this);
}
_s1(Post, "77asfGIrBONVHzs+sAogrmdIPkU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = Post;
function ActionButton({ icon, count, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: "flex items-center space-x-1 hover:text-black",
        onClick: (e)=>{
            e.stopPropagation();
            onClick?.(e);
        },
        children: [
            icon,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: count
            }, void 0, false, {
                fileName: "[project]/src/app/likepage/page.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/likepage/page.tsx",
        lineNumber: 314,
        columnNumber: 5
    }, this);
}
_c2 = ActionButton;
function formatTime(createdAt) {
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
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "LikePage");
__turbopack_context__.k.register(_c1, "Post");
__turbopack_context__.k.register(_c2, "ActionButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_likepage_page_tsx_3486c924._.js.map