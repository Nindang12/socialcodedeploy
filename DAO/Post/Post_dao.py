from DAO.connection import DatabaseConnection
import uuid
from datetime import datetime
from fastapi import UploadFile, Form, File, HTTPException
from DAO.GridFSConfig import gridfs_client
from DAO.Post.Post import Post
from typing import Optional
import os

class Post_dao:
    def __init__(self):
        self.db = DatabaseConnection.get_db()
        self.collection = self.db["post"]
        self.MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
        self.ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif'}
        self.ALLOWED_VIDEO_EXTENSIONS = {'.mp4', '.mov', '.avi'}

    def _validate_file(self, file: UploadFile, is_image: bool = True):
        # Check file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        allowed_extensions = self.ALLOWED_IMAGE_EXTENSIONS if is_image else self.ALLOWED_VIDEO_EXTENSIONS
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
            )

        # Check file size
        file_size = 0
        for chunk in file.file:
            file_size += len(chunk)
            if file_size > self.MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"File size exceeds maximum allowed size of {self.MAX_FILE_SIZE/1024/1024}MB"
                )
        file.file.seek(0)  # Reset file pointer
        return file_size

    def create_post(self, post: Post, image: Optional[UploadFile] = None, video: Optional[UploadFile] = None):
        # Create post dictionary from Post object
        post_dict = {
            "post_id": str(uuid.uuid4()),
            "user_id": post.user_id,
            "content": post.content,
            "image_id": None,
            "video_id": None,
            "likes": 0,
            "reposts": 0,
            "comments": 0,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        try:
            # Handle image upload
            if image:
                try:
                    self._validate_file(image, is_image=True)
                    image_filename = f"images/{post_dict['post_id']}_{image.filename}"
                    image_content = image.file.read()
                    image_id = gridfs_client.upload_file(
                        file_data=image_content,
                        file_name=image_filename,
                        content_type=image.content_type,
                        is_image=True
                    )
                    post_dict["image_id"] = image_id
                except Exception as e:
                    raise HTTPException(status_code=400, detail=f"Image upload failed: {str(e)}")

            # Handle video upload
            if video:
                try:
                    self._validate_file(video, is_image=False)
                    video_filename = f"videos/{post_dict['post_id']}_{video.filename}"
                    video_content = video.file.read()
                    video_id = gridfs_client.upload_file(
                        file_data=video_content,
                        file_name=video_filename,
                        content_type=video.content_type,
                        is_image=False
                    )
                    post_dict["video_id"] = video_id
                except Exception as e:
                    # If video upload fails and we have an image, we should clean up the image
                    if post_dict["image_id"]:
                        try:
                            gridfs_client.delete_file(post_dict["image_id"], is_image=True)
                        except:
                            pass
                    raise HTTPException(status_code=400, detail=f"Video upload failed: {str(e)}")

            # Insert post into database
            self.collection.insert_one(post_dict)
            return post_dict

        except Exception as e:
            # Clean up uploaded files if database insertion fails
            if post_dict["image_id"]:
                try:
                    gridfs_client.delete_file(post_dict["image_id"], is_image=True)
                except:
                    pass
            if post_dict["video_id"]:
                try:
                    gridfs_client.delete_file(post_dict["video_id"], is_image=False)
                except:
                    pass
            raise HTTPException(status_code=500, detail=f"Failed to create post: {str(e)}")

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
