import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VideoStreamAndUpload() {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false); // Mic should be off initially
  const [isVideoOn, setIsVideoOn] = useState(false); // Video should be off initially
  const [isFileUpload, setIsFileUpload] = useState(true);  // File upload is active initially
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the AI chat! Upload a video to get started.' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const streamRef = useRef(null); // Add stream reference for cleanup

  // Toggle buttons for mic and video
  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  // Function to send video to backend and update chat with predicted exercise
  const sendVideoToBackend = async (videoFile) => {
    try {
      const formData = new FormData();
      formData.append('file', videoFile);

      // Optionally, show a loading message in the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, sender: 'System', text: 'Uploading and processing your video...' },
      ]);

      // Perform the video upload
      const response = await fetch('http://localhost:8000/upload_video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.predicted_exercise) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length + 1, sender: 'AI', text: `Predicted Exercise: ${data.predicted_exercise}` },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length + 1, sender: 'AI', text: 'No exercise prediction could be made from the video.' },
          ]);
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, sender: 'AI', text: "There was an issue with the video upload. Please try again." },
        ]);
      }
    } catch (error) {
      console.error('Error during video upload:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, sender: 'AI', text: "There was an error while uploading the video. Please try again." },
      ]);
    }
  };

  // Handle file upload for videos
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, sender: 'You', text: `Uploading video: ${file.name}` },
      ]);
      await sendVideoToBackend(file); // Wait for the upload to complete
    }
  };

  // Handle video streaming and recording (this should only be active when using the webcam)
  useEffect(() => {
    if (!isSessionStarted) return; // Don't start the webcam if session has not started

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Store the stream reference for cleanup

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        if (stream && !mediaRecorderRef.current) {
          mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: 'video/webm',
          });

          mediaRecorderRef.current.ondataavailable = (event) => {
            videoChunksRef.current.push(event.data);
          };

          mediaRecorderRef.current.onstop = async () => {
            const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
            const videoFile = new File([videoBlob], 'video.webm', { type: 'video/webm' });
            await sendVideoToBackend(videoFile);
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
      // Stop the video and microphone tracks when video is off
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop()); // Stop the tracks
        setIsRecording(false);
      }

      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    }

    // Cleanup function to stop video when component is unmounted or when video is off
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, isRecording, isSessionStarted]);

  // Function to start the session after file upload
  const startSession = () => {
    setIsSessionStarted(true);  // Session starts
    setIsFileUpload(false);  // Hide file upload after session starts
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, sender: 'System', text: 'Session started! You can now toggle the mic and video.' },
    ]);
  };

  // Send a message to chat (not related to file upload)
  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, sender: 'You', text: inputMessage },
    ]);

    setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full md:w-3/4 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Back to Dashboard
            </button>
          </Link>
        </div>
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          {/* File Upload section */}
          {isFileUpload && (
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="p-2 border rounded-md text-sm w-full"
                />
                <button
                  onClick={startSession}
                  className="mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full"
                >
                  Start Session
                </button>
              </div>
            </div>
          )}

          {/* Video section (only shown after session is started) */}
          {isSessionStarted && !isFileUpload && (
            <div className="w-full md:w-1/2">
              <div className="relative">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover rounded-lg shadow-lg" />
                <div className="absolute top-2 left-2 flex space-x-2">
                  <button onClick={toggleMic} className="text-white bg-black p-2 rounded-full">
                    {isMicOn ? <Mic /> : <MicOff />}
                  </button>
                  <button onClick={toggleVideo} className="text-white bg-black p-2 rounded-full">
                    {isVideoOn ? <Video /> : <VideoOff />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat section */}
          <div className="w-full md:w-1/2">
            <div className="h-80 overflow-y-auto p-4 space-y-2">
              {messages.map((message) => (
                <div key={message.id} className={`text-sm ${message.sender === 'You' ? 'text-right text-gray-800 ml-auto' : 'text-left text-blue-500 mr-auto'}`}>
                  <strong>{message.sender}:</strong> {message.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <textarea
                className="w-full p-2 border rounded-md text-sm"
                rows={2}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message"
              />
              <button
                onClick={sendMessage}
                className="w-full py-2 mt-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}