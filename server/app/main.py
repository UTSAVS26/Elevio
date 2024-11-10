from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import os

app = FastAPI()

# Allow requests from your frontend URL
origins = [
    "http://localhost:5173",  # The address where your frontend is running
    "http://localhost:3000",  # You can add other domains if necessary
]

# Add CORS middleware to allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow all origins in the list
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Path where you want to store the uploaded video temporarily
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Placeholder function for exercise prediction
def predict_exercise(video_path: str) -> str:
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return "Unable to read video"
    
    frame_count = 0
    while frame_count < 30 and cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
    
    cap.release()
    
    return "Detected Exercise: Push-ups"

@app.post("/upload_video")
async def upload_video(file: UploadFile = File(...)):
    try:
        # Save the uploaded file to a temporary location
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        # Predict exercise from the uploaded video
        prediction = predict_exercise(file_location)
        
        return JSONResponse(content={"predicted_exercise": prediction})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Video Upload API!"}