from datetime import datetime
from typing import Optional

class Post:
    def __init__(self, post_id: str, user_id: str, content: str, 
                 image_url: Optional[str] = None, video_url: Optional[str] = None,
                 likes: int = 0, reposts: int = 0, comments: int = 0,
                 created_at: datetime = None, updated_at: datetime = None):
        self.post_id = post_id
        self.user_id = user_id
        self.content = content
        self.image_url = image_url
        self.video_url = video_url
        self.likes = likes
        self.reposts = reposts 
        self.comments = comments
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()

    def to_dict(self):
        return {
            "post_id": self.post_id,
            "user_id": self.user_id,
            "content": self.content,
            "image_url": self.image_url,
            "video_url": self.video_url,
            "likes": self.likes,
            "reposts": self.reposts,
            "comments": self.comments,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @staticmethod
    def from_dict(data: dict):
        return Post(
            post_id=data["post_id"],
            user_id=data["user_id"],
            content=data["content"],
            image_url=data.get("image_url"),
            video_url=data.get("video_url"),
            likes=data.get("likes", 0),
            reposts=data.get("reposts", 0),
            comments=data.get("comments", 0),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at")
        )
