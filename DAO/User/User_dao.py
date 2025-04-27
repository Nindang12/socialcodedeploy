from pymongo import MongoClient
import os
from DAO.connection import DatabaseConnection
import uuid
import bcrypt
from DAO.User.User import User

class User_dao:
    def __init__(self):
        self.db = DatabaseConnection.get_db()
        self.collection = self.db["user"]
        self.token_blacklist = self.db["token_blacklist"]
    def create_user(self, user: User):
       
        # Hash password before storing
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), salt)
        
        user = {
            "user_id": str(uuid.uuid4()),   
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "username": user.username,
            "email": user.email,
            "password": hashed_password
        }
        return self.collection.insert_one(user)

    def get_user(self, user_id: str):
        return self.collection.find_one({"user_id": user_id})
    def get_user_by_full_name(self, full_name: str):
        return self.collection.find_one({"full_name": full_name})
    def get_user_by_phone_number(self, phone_number: str):
        return self.collection.find_one({"phone_number": phone_number})
    def get_user_by_email(self, email: str):
        return self.collection.find_one({"email": email})
    def get_user_by_username(self, username: str):
        return self.collection.find_one({"username": username})
    def authenticate_user(self, phone_number: str, email: str, username: str, password: str):
        # Find user by phone/email/username first
        user = self.collection.find_one({"phone_number": phone_number})
        if user:
            if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
                return user
        user = self.collection.find_one({"email": email})
        if user:
            if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
                return user
        user = self.collection.find_one({"username": username})
        if user:
            if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
                return user
        return None
    def logout(self, token: str):
        return self.token_blacklist.insert_one({"token": token})
    def is_token_blacklisted(self, token: str):
        return self.token_blacklist.find_one({"token": token}) is not None


