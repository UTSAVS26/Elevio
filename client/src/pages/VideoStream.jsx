import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function VideoStream({ isVideoOn, onDetectedExercise }) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const videoChunksRef = useRef([]);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                // Initialize MediaRecorder to record the video stream
                if (stream && !mediaRecorderRef.current) {
                    mediaRecorderRef.current = new MediaRecorder(stream, {
                        mimeType: 'video/webm',
                    });

                    mediaRecorderRef.current.ondataavailable = (event) => {
                        videoChunksRef.current.push(event.data);
                    };

                    mediaRecorderRef.current.onstop = async () => {
                        // Save the video and send it to the backend
                        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
                        const videoFile = new File([videoBlob], 'video.webm', { type: 'video/webm' });
                        await sendVideoToBackend(videoFile);

                        // Reset the chunks
                        videoChunksRef.current = [];
                    };
                }
            } catch (error) {
                console.error('Error accessing webcam: ', error);
            }
        };

        // Stop the video when isVideoOn is false
        if (isVideoOn) {
            startVideo();
            if (mediaRecorderRef.current && !isRecording) {
                mediaRecorderRef.current.start();
                setIsRecording(true);
            }
        } else {
            stopVideo();
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
            }
        }

        // Cleanup function
        return () => {
            stopVideo();
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
        };
    }, [isVideoOn, isRecording]);

    // Stop video stream
    const stopVideo = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    // Send the recorded video to the backend
    const sendVideoToBackend = async (videoFile) => {
        try {
            const formData = new FormData();
            formData.append('file', videoFile);

            const response = await fetch('http://localhost:8000/upload_video', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.predicted_exercise) {
                    onDetectedExercise(data.predicted_exercise); // Show detected exercise
                }
            } else {
                console.error('Error sending video to backend:', response.status);
            }
        } catch (error) {
            console.error('Error during video upload:', error);
        }
    };

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: isVideoOn ? 'block' : 'none' }}
        />
    );
}