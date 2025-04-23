from DAO.User.User_dao import User_dao
from DAO.Post.Post_dao import Post_dao
from DAO.User.User import User
from DAO.Post.Post import Post
# from DAO.Comment.Comment_dao import Comment_dao
# from DAO.Notification.Notification_dao import Notification_dao
from fastapi import UploadFile
class DAO_Manager:
    def __init__(self):
        self.user_dao = User_dao()
        self.post_dao = Post_dao()
        # self.comment_dao = Comment_dao() 
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
    def create_post(self, post: Post, image: UploadFile = None, video: UploadFile = None):
        return self.post_dao.create_post(post, image, video)

    def get_post(self, post_id: str):
        return self.post_dao.get_post(post_id)
