from DAO.connection import DatabaseConnection
from DAO.Comment.Comment import Comment
from fastapi import HTTPException
import uuid
from datetime import datetime
from typing import Optional, List

class Comment_dao:
    def __init__(self):
        self.db = DatabaseConnection.get_db()
        self.collection = self.db["comment"]

    def comment_post(self, post_id: str, comment: Comment):
        try:
            # Kiểm tra bài post có tồn tại không
            post_collection = self.db["post"]
            post = post_collection.find_one({"post_id": post_id})
            if not post:
                raise HTTPException(status_code=404, detail="Post not found")

            # Kiểm tra user có tồn tại không
            user_collection = self.db["user"]
            user = user_collection.find_one({"user_id": comment.user_id})
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            # Nếu là reply, kiểm tra parent comment có tồn tại không
            if comment.parent_comment_id:
                parent_comment = self.collection.find_one({"comment_id": comment.parent_comment_id})
                if not parent_comment:
                    raise HTTPException(status_code=404, detail="Parent comment not found")
                if parent_comment["post_id"] != post_id:
                    raise HTTPException(status_code=400, detail="Parent comment does not belong to this post")

            # Tạo comment mới
            comment_dict = {
                "comment_id": str(uuid.uuid4()),
                "post_id": post_id,
                "user_id": comment.user_id,
                "content": comment.content,
                "parent_comment_id": comment.parent_comment_id,
                "likes": 0,
                "liked_by": [],
                "replies": 0,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }

            # Thêm comment vào database
            self.collection.insert_one(comment_dict)

            # Nếu là comment gốc (không phải reply), tăng comments count của post
            if not comment.parent_comment_id:
                post_collection.update_one(
                    {"post_id": post_id},
                    {"$inc": {"comments": 1}}
                )
            else:
                # Nếu là reply, tăng replies count của parent comment
                self.collection.update_one(
                    {"comment_id": comment.parent_comment_id},
                    {"$inc": {"replies": 1}}
                )

            return comment_dict

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create comment: {str(e)}")


    def reply_comment(self, comment_id: str, comment: Comment):
        try:
            # Get parent comment
            parent_comment = self.collection.find_one({"comment_id": comment_id})
            if not parent_comment:
                raise HTTPException(status_code=404, detail="Parent comment not found")

            # Create reply dictionary
            reply_dict = {
                "comment_id": str(uuid.uuid4()),
                "post_id": parent_comment["post_id"],
                "user_id": comment.user_id,
                "content": comment.content,
                "parent_comment_id": comment_id,
                "likes": 0,
                "liked_by": [],
                "replies": 0,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }

            # Insert reply into database
            self.collection.insert_one(reply_dict)
            
            # Update parent comment's reply count
            self.collection.update_one(
                {"comment_id": comment_id},
                {"$inc": {"replies": 1}}
            )

            return reply_dict

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create reply: {str(e)}")

    def edit_comment(self, comment_id: str, content: str):
        try:
            # Check if comment exists
            comment = self.collection.find_one({"comment_id": comment_id})
            if not comment:
                raise HTTPException(status_code=404, detail="Comment not found")

            # Update comment content
            self.collection.update_one(
                {"comment_id": comment_id},
                {
                    "$set": {
                        "content": content,
                        "updated_at": datetime.now()
                    }
                }
            )

            # Get updated comment
            updated_comment = self.collection.find_one({"comment_id": comment_id})
            if "_id" in updated_comment:
                updated_comment["_id"] = str(updated_comment["_id"])
            return updated_comment

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to edit comment: {str(e)}")

    def delete_comment(self, comment_id: str):
        try:
            # Check if comment exists
            comment = self.collection.find_one({"comment_id": comment_id})
            if not comment:
                raise HTTPException(status_code=404, detail="Comment not found")

            # If this is a parent comment, update post's comment count
            if not comment.get("parent_comment_id"):
                post_collection = self.db["post"]
                post_collection.update_one(
                    {"post_id": comment["post_id"]},
                    {"$inc": {"comments": -1}}
                )
            else:
                # If this is a reply, update parent comment's reply count
                self.collection.update_one(
                    {"comment_id": comment["parent_comment_id"]},
                    {"$inc": {"replies": -1}}
                )

            # Delete the comment
            self.collection.delete_one({"comment_id": comment_id})
            return {"message": "Comment deleted successfully"}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete comment: {str(e)}")

    def like_comment(self, comment_id: str, user_id: str):
        try:
            # Get the comment first
            comment = self.collection.find_one({"comment_id": comment_id})
            if not comment:
                raise HTTPException(status_code=404, detail="Comment not found")

            # Check if user has already liked the comment
            if "liked_by" not in comment:
                # Initialize liked_by array if it doesn't exist
                self.collection.update_one(
                    {"comment_id": comment_id},
                    {"$set": {"liked_by": []}}
                )
                comment["liked_by"] = []

            if user_id in comment["liked_by"]:
                # User already liked the comment, so unlike it
                self.collection.update_one(
                    {"comment_id": comment_id},
                    {
                        "$inc": {"likes": -1},
                        "$pull": {"liked_by": user_id}
                    }
                )
            else:
                # User hasn't liked the comment, so like it
                self.collection.update_one(
                    {"comment_id": comment_id},
                    {
                        "$inc": {"likes": 1},
                        "$push": {"liked_by": user_id}
                    }
                )

            # Get updated comment
            updated_comment = self.collection.find_one({"comment_id": comment_id})
            if "_id" in updated_comment:
                updated_comment["_id"] = str(updated_comment["_id"])
            return updated_comment

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to toggle like comment: {str(e)}")

    def get_comments(self, post_id: str):
        try:
            # Get all comments for the post
            comments = self.collection.find({"post_id": post_id, "parent_comment_id": None})
            
            results = []
            for comment in comments:
                if "_id" in comment:
                    comment["_id"] = str(comment["_id"])
                results.append(comment)

            if not results:
                raise HTTPException(status_code=404, detail="No comments found")

            return results

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get comments: {str(e)}")

    def get_replies(self, comment_id: str):
        try:
            # Get all replies for the comment
            replies = self.collection.find({"parent_comment_id": comment_id})
            
            results = []
            for reply in replies:
                if "_id" in reply:
                    reply["_id"] = str(reply["_id"])
                results.append(reply)

            return results

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get replies: {str(e)}")

