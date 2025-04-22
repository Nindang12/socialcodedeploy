from fastapi import FastAPI, HTTPException, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
from uuid import uuid4
from DAO.DAO_manager import DAO_Manager
from auth.jwt_handler import create_access_token


# ------------------------
# Mock Models and Schemas
# ------------------------
Manager = DAO_Manager()
class User(BaseModel):
    full_name: str
    phone_number: str
    username: str
    email: str
    password: str

class Post(BaseModel):
    id: str
    user_id: str
    content: str

class Comment(BaseModel):
    id: str
    post_id: str
    user_id: str
    content: str
    parent_comment_id: Optional[str] = None

class Notification(BaseModel):
    id: str
    user_id: str
    message: str

# ------------------------
# Auth Endpoints
# ------------------------
app = FastAPI()

@app.post("/signup")
def signup(user: User):
    print(user)
    if (Manager.get_user_by_phone_number(user.phone_number) or
        Manager.get_user_by_email(user.email) or
        Manager.get_user_by_username(user.username)):
        raise HTTPException(status_code=400, detail="User already exists")
    Manager.create_user(user.full_name, user.phone_number, user.username, user.email, user.password)
    return {"message": "User signed up", "user": user}



@app.post("/login")
def login(user: User):
    user = Manager.authenticate_user(user.phone_number, user.email, user.username, user.password)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    return {"message": "User logged in", "token": create_access_token({"user_id": user["user_id"]})}

@app.post("/logout")
def logout(token: str = Query(...)):
    Manager.logout(token)
    return {"message": "User logged out"}

# ------------------------
# Post Endpoints
# ------------------------

@app.post("/posts")
def create_post(post: Post):
    return {"message": "Post created", "post": post}

@app.get("/posts")
def get_posts():
    return {"posts": []}

@app.put("/posts/{post_id}")
def edit_post(post_id: str, content: str):
    return {"message": "Post edited", "post_id": post_id, "content": content}

@app.delete("/posts/{post_id}")
def delete_post(post_id: str):
    return {"message": "Post deleted", "post_id": post_id}

@app.post("/posts/{post_id}/like")
def like_post(post_id: str):
    return {"message": "Post liked", "post_id": post_id}

@app.post("/posts/{post_id}/repost")
def repost(post_id: str):
    return {"message": "Post reposted", "original_post_id": post_id}

@app.get("/search/posts")
def search_posts(query: str):
    return {"query": query, "results": []}

# ------------------------
# Comment Endpoints
# ------------------------

@app.post("/posts/{post_id}/comments")
def comment_post(post_id: str, comment: Comment):
    return {"message": "Comment added", "post_id": post_id, "comment": comment}

@app.post("/comments/{comment_id}/reply")
def reply_comment(comment_id: str, comment: Comment):
    return {"message": "Reply added", "parent_comment_id": comment_id, "comment": comment}

@app.put("/comments/{comment_id}")
def edit_comment(comment_id: str, content: str):
    return {"message": "Comment edited", "comment_id": comment_id, "content": content}

@app.delete("/comments/{comment_id}")
def delete_comment(comment_id: str):
    return {"message": "Comment deleted", "comment_id": comment_id}

@app.post("/comments/{comment_id}/like")
def like_comment(comment_id: str):
    return {"message": "Comment liked", "comment_id": comment_id}

@app.get("/posts/{post_id}/comments")
def get_comments(post_id: str):
    return {"post_id": post_id, "comments": []}

# ------------------------
# User Endpoints
# ------------------------

@app.get("/users")
def get_users():
    return {"users": []}

@app.get("/search/users")
def search_users(query: str):
    return {"query": query, "results": []}

@app.post("/users/{user_id}/follow")
def follow_user(user_id: str):
    return {"message": "User followed", "user_id": user_id}

@app.post("/users/{user_id}/unfollow")
def unfollow_user(user_id: str):
    return {"message": "User unfollowed", "user_id": user_id}

# ------------------------
# Notification
# ------------------------

@app.get("/notifications")
def get_notifications(user_id: str):
    return {"user_id": user_id, "notifications": []}
