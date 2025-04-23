from DAO.connection import DatabaseConnection
import uuid
from datetime import datetime
from fastapi import UploadFile, Form, File
from DAO.MinioConfig import minio_client
from DAO.Post.Post import Post
from typing import Optional

class Post_dao:
    def __init__(self):
        self.db = DatabaseConnection.get_db()
        self.collection = self.db["post"]

    def create_post(self, post: Post, image: Optional[UploadFile] = None, video: Optional[UploadFile] = None):
        # Create post dictionary from Post object
        post_dict = {
            "post_id": str(uuid.uuid4()),
            "user_id": post.user_id,
            "content": post.content,
            "image_url": None,
            "video_url": None,
            "likes": 0,
            "reposts": 0,
            "comments": 0,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        try:
            if image:
                image_url = minio_client.upload_file(...)
                post_dict["image_url"] = image_url
        except Exception as e:
            print(f"Image upload failed: {e}")

        try:
            if video:
                video_url = minio_client.upload_file(...)
                post_dict["video_url"] = video_url
        except Exception as e:
            print(f"Video upload failed: {e}")


    def get_post(self, post_id: str):
        try:
            post = self.collection.find_one({"post_id": post_id})
            if post:
                if "_id" in post:
                    post["_id"] = str(post["_id"])
                return Post.from_dict(post)
            return None
        except Exception as e:
            print(f"Error getting post: {str(e)}")
            return None
