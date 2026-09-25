import os
import boto3
from dotenv import load_dotenv

load_dotenv()

s3=boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def download_fromS3(key:str)->bytes:
    response=s3.get_object(
        Bucket=os.getenv("AWS_S3_BUCKET"),
        Key=key
    )
    
    return response["Body"].read()
    
    
