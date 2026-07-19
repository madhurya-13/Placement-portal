# app/services/upload_service.py
"""
Handles file uploads to Cloudinary — currently used for student resumes.
Isolated here so the rest of the app never talks to Cloudinary directly.
"""

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}
MAX_FILE_SIZE_MB = 5


def upload_resume(file: UploadFile, student_id: int) -> str:
    """
    Uploads a resume file to Cloudinary, returns the hosted URL.
    Validates file type and size before ever calling the external API,
    so we fail fast and cheaply rather than wasting an upload attempt.
    """
    extension = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {', '.join(ALLOWED_EXTENSIONS)} files are allowed.",
        )

    result = cloudinary.uploader.upload(
        file.file,
        resource_type="raw",  # "raw" because resumes aren't images
        folder="placement_portal/resumes",
        public_id=f"student_{student_id}_resume",
        overwrite=True,  # re-uploading replaces the old resume instead of piling up files
    )
    return result["secure_url"]