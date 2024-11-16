import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn as nn
from transformers import pipeline

# Exercise labels corresponding to the indices of the model
exercise_labels = {
    0: "Barbell Biceps Curl",
    1: "Bench Press",
    2: "Chest Fly Machine",
    3: "Deadlift",
    4: "Decline Bench Press",
    5: "Hammer Curl",
    6: "Hip Thrust",
    7: "Incline Bench Press",
    8: "Lat Pulldown",
    9: "Lateral Raise",
    10: "Leg Extension",
    11: "Leg Raises",
    12: "Plank",
    13: "Pull Up",
    14: "Push-Up",
    15: "Romanian Deadlift",
    16: "Russian Twist",
    17: "Shoulder Press",
    18: "Squat",
    19: "T Bar Row",
    20: "Tricep Pushdown",
    21: "Tricep Dips"
}

# MediaPipe Pose Detection Setup
mp_pose = mp.solutions.pose
pose_detector = mp_pose.Pose()

# GPT-2 model for generating posture corrections
pipe = pipeline("text-generation", model="openai-community/gpt2")

# Cross-Entropy Model for Posture Evaluation
class PoseAlignmentModel(nn.Module):
    def __init__(self, num_landmarks):
        super(PoseAlignmentModel, self).__init__()
        self.fc1 = nn.Linear(num_landmarks * 6, 128)  # 6 = 3 coordinates per landmark * 2 poses (pose1 + pose2)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, num_landmarks)  # Output for each landmark: 1 for correct, 0 for incorrect

    def forward(self, pose1, pose2):
        x = torch.cat((pose1.flatten(), pose2.flatten()), dim=-1)  # Concatenate pose1 and pose2
        x = torch.relu(self.fc1(x))  # Pass through the first layer
        x = torch.relu(self.fc2(x))  # Pass through the second layer
        output = torch.sigmoid(self.fc3(x))  # Sigmoid to get probabilities [0, 1] for each landmark
        return output

# Function to extract pose from image frame using MediaPipe
def extract_pose(image):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose_detector.process(image_rgb)
    
    if results.pose_landmarks:
        pose = []
        for landmark in results.pose_landmarks.landmark:
            pose.append([landmark.x, landmark.y, landmark.z])
        return np.array(pose)
    else:
        return None

# Placeholder function for exercise prediction
# Replace this with your actual model for exercise prediction
def predict_exercise_from_pose(video_path):
    cap = cv2.VideoCapture(video_path)
    frames = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()

    # For now, let's randomly select a predicted exercise index as a placeholder
    predicted_index = np.random.randint(0, 22)
    
    # Map the predicted index to the exercise label
    predicted_exercise = exercise_labels[predicted_index]
    
    return predicted_exercise, frames

# Function to calculate Euclidean distances between corresponding landmarks
def calculate_distances(pose1, pose2):
    distances = np.linalg.norm(pose1 - pose2, axis=1)
    return distances

# Function to detect misaligned landmarks based on a threshold
def detect_misalignment(pose1, pose2, threshold=0.1):
    distances = calculate_distances(pose1, pose2)
    misaligned_landmarks = [i for i, dist in enumerate(distances) if dist > threshold]
    return misaligned_landmarks

# Function to generate a posture correction instruction using GPT-2
def generate_posture_correction_instruction(misaligned_landmarks, pose_name="push-up"):
    landmarks_str = ", ".join([f"landmark {lm}" for lm in misaligned_landmarks])
    prompt = f"In the {pose_name} pose, the following landmarks are misaligned: {landmarks_str}. How can the person correct their posture?"
    
    correction = pipe(prompt, max_length=200, num_return_sequences=1)
    return correction[0]['generated_text']