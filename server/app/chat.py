import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn as nn
import pyttsx3
from transformers import pipeline
import os

# MediaPipe Pose Detection Setup
mp_pose = mp.solutions.pose
pose_detector = mp_pose.Pose()

# Load GPT-2 model for text generation
pipe = pipeline("text-generation", model="openai-community/gpt2")

# Text-to-Speech Engine Setup
# def text_to_speech(text):
#     engine = pyttsx3.init()
#     engine.say(text)
#     #engine.runAndWait()

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

# Cross-Entropy Model for Posture Evaluation
class PoseAlignmentModel(nn.Module):
    def __init__(self, num_landmarks):  # Corrected the __init__ method
        super(PoseAlignmentModel, self).__init__()
        # Define the model layers
        self.fc1 = nn.Linear(num_landmarks * 6, 128)  # 6 = 3 coordinates per landmark * 2 poses (pose1 + pose2)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, num_landmarks)  # Output for each landmark: 1 for correct, 0 for incorrect

    def forward(self, pose1, pose2):
        # Flatten the poses and concatenate them
        x = torch.cat((pose1.flatten(), pose2.flatten()), dim=-1)  # Concatenate pose1 and pose2
        x = torch.relu(self.fc1(x))  # Pass through the first layer
        x = torch.relu(self.fc2(x))  # Pass through the second layer
        output = torch.sigmoid(self.fc3(x))  # Sigmoid to get probabilities [0, 1] for each landmark
        return output

# Function to calculate Euclidean distances between corresponding landmarks
def calculate_distances(pose1, pose2):
    distances = np.linalg.norm(pose1 - pose2, axis=1)  # Euclidean distance for each landmark
    return distances

# Function to detect misaligned landmarks based on a threshold
def detect_misalignment(pose1, pose2, threshold=0.1):
    distances = calculate_distances(pose1, pose2)
    misaligned_landmarks = [i for i, dist in enumerate(distances) if dist > threshold]
    return misaligned_landmarks

# Function to generate a posture correction instruction using GPT-3
def generate_posture_correction_instruction(misaligned_landmarks, pose_name="squat"):
    landmarks_str = ", ".join([f"landmark {lm}" for lm in misaligned_landmarks])
    prompt = f"In the {pose_name} pose, the following landmarks are misaligned: {landmarks_str}. How can the person correct their posture?"
    
    correction = pipe(prompt, max_length=200, num_return_sequences=1)
    return correction[0]['generated_text']

# Main function to process two consecutive frames
def resp(image_frame1, image_frame2):
    # Step 1: Extract poses from frames
    pose1 = extract_pose(image_frame1)
    pose2 = extract_pose(image_frame2)
    
    if pose1 is None or pose2 is None:
        print("Pose detection failed.")
        return

    # Step 2: Use BCE model to evaluate the posture alignment
    pose1_tensor = torch.tensor(pose1).float()
    pose2_tensor = torch.tensor(pose2).float()
    
    # Initialize the model and pass the poses
    model = PoseAlignmentModel(num_landmarks=pose1.shape[0])  # Adjust based on number of landmarks
    output = model(pose1_tensor, pose2_tensor)
    
    # Step 3: Detect misaligned landmarks
    misaligned_landmarks = detect_misalignment(pose1, pose2, threshold=0.5)
    
    if misaligned_landmarks:
        print(f"Misaligned landmarks detected: {misaligned_landmarks}")
        
        # Step 4: Generate corrective instruction
        correction_text = generate_posture_correction_instruction(misaligned_landmarks)
        
        # Step 5: Convert the corrective instruction to speech
        print("Correction Instructions: ", correction_text)
        text_to_speech(correction_text)
    else:
        print("Posture is correct!")
