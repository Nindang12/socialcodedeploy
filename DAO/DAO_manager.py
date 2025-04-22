from DAO.User.User_dao import User_dao
# from DAO.Post.Post_dao import Post_dao
# from DAO.Comment.Comment_dao import Comment_dao
# from DAO.Notification.Notification_dao import Notification_dao

class DAO_Manager:
    def __init__(self):
        self.user_dao = User_dao()
        # self.post_dao = Post_dao()
        # self.comment_dao = Comment_dao() 
        # self.notification_dao = Notification_dao()

    def create_user(self, full_name: str, phone_number: str, username: str, email: str, password: str):
        return self.user_dao.create_user(full_name, phone_number, username, email, password)

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
