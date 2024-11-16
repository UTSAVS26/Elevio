from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import logging
import aiofiles
import torch
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from chat import PoseAlignmentModel, extract_pose, predict_exercise_from_pose, detect_misalignment, generate_posture_correction_instruction

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

@app.post("/upload_video")
async def upload_video(file: UploadFile = File(...)):
    try:
        # Save the uploaded file to a temporary location
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        # Use the prediction function from chat.py
        predicted_exercise, frames = predict_exercise_from_pose(file_location)
        
        # Pose extraction and alignment checking from chat.py
        pose_model = PoseAlignmentModel(num_landmarks=33)  # Update num_landmarks based on the pose model
        correction_texts = []
        
        for i in range(1, len(frames)):
            pose1 = extract_pose(frames[i-1])
            pose2 = extract_pose(frames[i])
            
            if pose1 is None or pose2 is None:
                continue

            pose1_tensor = torch.tensor(pose1).float()
            pose2_tensor = torch.tensor(pose2).float()
            
            # Initialize model and pass the poses
            output = pose_model(pose1_tensor, pose2_tensor)
            
            # Detect misalignment
            misaligned_landmarks = detect_misalignment(pose1, pose2, threshold=0.5)
            
            if misaligned_landmarks:
                correction_text = generate_posture_correction_instruction(misaligned_landmarks, pose_name=predicted_exercise)
                correction_texts.append(correction_text)

        # Return posture correction instructions
        if correction_texts:
            return JSONResponse(content={"predicted_exercise": predicted_exercise, "corrections": correction_texts})
        else:
            return JSONResponse(content={"predicted_exercise": predicted_exercise, "message": "Posture is correct!"})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Video Upload API!"}