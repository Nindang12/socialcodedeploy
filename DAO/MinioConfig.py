from minio import Minio
import os
from dotenv import load_dotenv

load_dotenv()

class MinioConfig:
    def __init__(self):
        self.client = Minio(
            os.getenv("MINIO_ENDPOINT", "localhost:9000"),
            access_key=os.getenv("MINIO_ACCESS_KEY", "minioadmin"),
            secret_key=os.getenv("MINIO_SECRET_KEY", "minioadmin"),
            secure=False
        )
        self.bucket_name = "social-network"
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        if not self.client.bucket_exists(self.bucket_name):
            self.client.make_bucket(self.bucket_name)

    def upload_file(self, file_data, file_name, content_type):
        try:
            self.client.put_object(
                self.bucket_name,
                file_name,
                file_data,
                len(file_data),
                content_type=content_type
            )
            return f"{self.client._endpoint_url}/{self.bucket_name}/{file_name}"
        except Exception as e:
            print(f"Error uploading file to MinIO: {e}")
            return None

minio_client = MinioConfig()