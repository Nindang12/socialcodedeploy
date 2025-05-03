from DAO.User.User_dao import User_dao
from DAO.Post.Post_dao import Post_dao
from DAO.User.User import User
from DAO.Post.Post import Post
from DAO.Comment.Comment import Comment
from DAO.Comment.Comment_dao import Comment_dao
from fastapi import  HTTPException 
# from DAO.Notification.Notification_dao import Notification_dao
from fastapi import UploadFile
class DAO_Manager:
    def __init__(self):
        self.user_dao = User_dao()
        self.post_dao = Post_dao()
        self.comment_dao = Comment_dao() 
        # self.notification_dao = Notification_dao()

    def create_user(self, user: User):
        return self.user_dao.create_user(user)

    def get_user(self, user_id: str):
        return self.user_dao.get_user(user_id)
    
    def get_user_by_phone_number(self, phone_number: str):
        return self.user_dao.get_user_by_phone_number(phone_number)
    
    def get_user_by_email(self, email: str):
        return self.user_dao.get_user_by_email(email)
    
    def get_user_by_username(self, username: str):
        return self.user_dao.get_user_by_username(username)
    
    def get_user_by_full_name(self, full_name: str):
        return self.user_dao.get_user_by_full_name(full_name)
    
    def authenticate_user(self, phone_number: str, email: str, username: str, password: str):
        return self.user_dao.authenticate_user(phone_number, email, username, password)
    # Post DAO
    def create_post(self, user_id: str, content: str, image: UploadFile = None, video: UploadFile = None):
        return self.post_dao.create_post(user_id, content, image, video)

    def get_post(self, post_id: str):
        return self.post_dao.get_post(post_id)

    def edit_post(self, post_id: str, content: str, user_id: str):
        return self.post_dao.edit_post(post_id, content, user_id)

    def delete_post(self, post_id: str, user_id: str):
        return self.post_dao.delete_post(post_id, user_id)
    
    def like_post(self, post_id: str, user_id: str):
        return self.post_dao.like_post(post_id, user_id)
    
    def repost(self, post_id: str, user_id: str):
        return self.post_dao.repost(post_id, user_id)
    
    def search_posts(self, query: str):
        return self.post_dao.search_posts(query)
    
    def comment_post(self, post_id: str, user_id: str, comment: str, image: UploadFile = None, video: UploadFile = None):
        return self.comment_dao.comment_post(post_id, user_id, comment, image, video)
    
    def reply_comment(self, comment_id: str, user_id: str, content: str, image: UploadFile = None, video: UploadFile = None):
        return self.comment_dao.reply_comment(comment_id, user_id, content, image, video)
    
    def edit_comment(self, comment_id: str, content: str, user_id: str):
        return self.comment_dao.edit_comment(comment_id, content, user_id)
    
    def delete_comment(self, comment_id: str, user_id: str):
        return self.comment_dao.delete_comment(comment_id, user_id)
    
    def like_comment(self, comment_id: str, user_id: str):
        return self.comment_dao.like_comment(comment_id, user_id)
    
    def get_comments(self, post_id: str):
        return self.comment_dao.get_comments(post_id)
    
    def get_replies(self, comment_id: str):
        return self.comment_dao.get_replies(comment_id)
    
    def get_users(self):
        return self.user_dao.get_users()
    def search_user(self, user_id: str = None, email: str = None, username: str = None, phone_number: str = None):
        query = {}
        if user_id:
            query["user_id"] = user_id
        if email:
            query["email"] = email
        if username:
            query["username"] = username
        if phone_number:
            query["phone_number"] = phone_number
        if not query:
            raise HTTPException(status_code=400, detail="No valid search parameter provided")
        result = list(self.user_dao.collection.find(query, {"password": 0}))
        for user in result:
            user["_id"] = str(user["_id"])
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        return result

    def follow_user(self, current_user_id: str, target_user_id: str):
        return self.user_dao.follow_user(current_user_id, target_user_id)

    def unfollow_user(self, current_user_id: str, target_user_id: str):
        return self.user_dao.unfollow_user(current_user_id, target_user_id)

