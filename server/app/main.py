from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
import logging
import os
from io import BytesIO

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained model
model = tf.keras.models.load_model("D:/UTSAV/Hackathon/hackcbs/Flexion/server/app/exercise_model.h5")

# MediaPipe Pose estimator
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Exercise label mappings
exercise_labels = {0: "Jumping Jacks", 1: "Push-Ups", 2: "Squats"}

def extract_pose_landmarks(frame):
    """Extracts pose landmarks from the frame using MediaPipe."""
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)
    if results.pose_landmarks:
        return [
            {
                "x": lm.x,
                "y": lm.y,
                "z": lm.z,
                "visibility": lm.visibility
            }
            for lm in results.pose_landmarks.landmark
        ]
    return None

def prepare_sequence(frames):
    """Prepare the sequence of landmarks for prediction."""
    sequence = []
    for frame_data in frames:
        landmarks = []
        for joint in frame_data:
            landmarks.extend([joint["x"], joint["y"], joint["z"], joint["visibility"]])
        sequence.append(landmarks)
    return np.expand_dims(np.array(sequence), axis=0)

@app.post("/upload_video_frame")
async def upload_video_frame(file: UploadFile = File(...)):
    """Endpoint to upload a video and predict the exercise."""
    try:
        cv2.VideoCapture(0)
        # Save the uploaded video to a temporary file
        contents = await file.read()
        temp_filename = "D:/UTSAV/Hackathon/hackcbs/example_1.mp4"  # Temporarily store the video
        with open(temp_filename, "wb") as temp_file:
            temp_file.write(contents)
        
        # Open the video using OpenCV
        video = cv2.VideoCapture(temp_filename)
        if not video.isOpened():
            raise HTTPException(status_code=500, detail="Error opening video file.")
        
        frames = []
        while video.isOpened():
            ret, frame = video.read()
            if not ret:
                break
            landmarks = extract_pose_landmarks(frame)
            if landmarks:
                frames.append(landmarks)
        
        video.release()  # Don't forget to release the video capture

        # Remove the temporary video file
        os.remove(temp_filename)

        if len(frames) < 10:
            raise HTTPException(status_code=400, detail="Not enough frames for prediction.")

        # Use the first 30 frames for the prediction
        sequence = prepare_sequence(frames[:30])
        prediction = model.predict(sequence)
        predicted_label = np.argmax(prediction)

        predicted_exercise = exercise_labels.get(predicted_label)
        logging.info(f"Predicted Exercise: {predicted_exercise}")

        return {"predicted_exercise": predicted_exercise}

    except Exception as e:
        logging.error(f"Error during video processing: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred during video processing.")