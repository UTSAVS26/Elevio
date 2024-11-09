from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.db.models.user import User
from app.db.base import SessionLocal
from app.config import config
from app.schemas.user import UserCreate
from fastapi.middleware.cors import CORSMiddleware
import logging
import cv2
import numpy as np
from io import BytesIO
from datetime import datetime
import tensorflow as tf

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# CORS Middleware settings
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

# Initialize MediaPipe Pose Estimator
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Assuming the model is already trained and loaded
model = tf.keras.models.load_model("your_model_path.h5")

# Function to extract pose landmarks from frames
def extract_pose_landmarks_from_frame(frame):
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)
    
    if results.pose_landmarks:
        landmarks = []
        for landmark in results.pose_landmarks.landmark:
            landmarks.append({
                'x': landmark.x,
                'y': landmark.y,
                'z': landmark.z,
                'visibility': landmark.visibility
            })
        return landmarks
    return None

# Function to prepare sequence data for prediction
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
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Extract pose landmarks from the frame
    landmarks = extract_pose_landmarks_from_frame(frame)
    if landmarks is None:
        return {"error": "Pose landmarks not found in frame."}
    
    # Process the frame and prepare the sequence
    frames = [landmarks]  # For now, it's just one frame, but you can accumulate frames
    sequence_length = 30  # Define your sequence length
    X_video = prepare_sequence_data(frames, sequence_length)

    # Predict the exercise
    predictions = model.predict(X_video)
    predicted_labels = np.argmax(predictions, axis=1)
    
    # Assuming 'exercise_labels' is defined as a dictionary to map label indices to exercise names
    exercise_names = {idx: exercise for exercise, idx in exercise_labels.items()}
    predicted_exercise_name = exercise_names.get(predicted_labels[0], "Unknown Exercise")

    return {"predicted_exercise": predicted_exercise_name}