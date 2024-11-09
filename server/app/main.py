from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging
import json
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
from io import BytesIO
from app.db.models.user import User
from app.db.base import SessionLocal
from app.config import config
from app.schemas.user import UserCreate

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI application
app = FastAPI()

# Set up CORS Middleware
origins = [
    "http://localhost:5173",
    "https://yourfrontenddomain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load JSON data for exercise labels
with open('D:/UTSAV/Hackathon/hackcbs/flexion/server/app/pose_data.json', 'r') as f:
    data = json.load(f)

# Mapping exercise labels to numerical values
exercise_labels = {exercise: idx for idx, exercise in enumerate(data.keys())}

# Initialize MediaPipe Pose Estimator
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Load pre-trained model for exercise prediction
model = tf.keras.models.load_model("D:/UTSAV/Hackathon/hackcbs/flexion/server/app/exercise_model.h5")

# Function to extract pose landmarks from frames
def extract_pose_landmarks_from_frame(frame):
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)
    
    if results.pose_landmarks:
        landmarks = [
            {
                'x': landmark.x,
                'y': landmark.y,
                'z': landmark.z,
                'visibility': landmark.visibility
            } for landmark in results.pose_landmarks.landmark
        ]
        return landmarks
    return None

def prepare_sequence_data(frames, sequence_length):
    X = []
    for i in range(0, len(frames) - sequence_length + 1, sequence_length):
        sequence = []
        for frame_data in frames[i:i+sequence_length]:
            landmarks = []
            for joint in frame_data:
                landmarks.extend([joint["x"], joint["y"], joint["z"], joint["visibility"]])
            sequence.append(landmarks)
        X.append(sequence)
    return np.array(X)

# Video processing endpoint
@app.post("/upload_video_frame")
async def upload_video_frame(file: UploadFile = File(...)):
    # Read and decode the video frame
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Extract pose landmarks from the frame
    landmarks = extract_pose_landmarks_from_frame(frame)
    if landmarks is None:
        return {"error": "Pose landmarks not found in frame."}
    
    # Process the frame and prepare the sequence for prediction
    frames = [landmarks]  # Placeholder for single frame; accumulate frames in production
    sequence_length = 30
    X_video = prepare_sequence_data(frames, sequence_length)

    # Predict the exercise
    predictions = model.predict(X_video)
    predicted_labels = np.argmax(predictions, axis=1)

    # Map label index to exercise name
    exercise_names = {idx: exercise for exercise, idx in exercise_labels.items()}
    predicted_exercise_name = exercise_names.get(predicted_labels[0], "Unknown Exercise")
    primt(predicted_exercise_name)
    return {"predicted_exercise": predicted_exercise_name}