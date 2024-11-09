'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

function VideoStream({ isVideoOn, onDetectedExercise }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let frameCaptureInterval;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: isVideoOn });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const sendFrameToBackend = async (frame) => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = frame.videoWidth;
            canvas.height = frame.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
            const formData = new FormData();
            formData.append('file', blob, 'frame.jpg');

            const response = await fetch('http://localhost:8000/upload_video_frame', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              if (data.predicted_exercise) {
                onDetectedExercise(data.predicted_exercise); // Trigger only when exercise is detected
              }
            }
          } catch (error) {
            // Log only the first error to prevent repeated spamming
            console.error("Error sending frame to backend:", error);
          }
        };

        frameCaptureInterval = setInterval(() => {
          if (videoRef.current) {
            sendFrameToBackend(videoRef.current);
          }
        }, 1000 / 10); // 10 frames per second
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    if (isVideoOn) {
      startVideo();
    } else if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    return () => {
      clearInterval(frameCaptureInterval);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, onDetectedExercise]);

  return <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />;
}

// Main VideoChatPage Component
export default function VideoChatPage() {
  const [isChatActive, setIsChatActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the chat!' },
    { id: 2, sender: 'You', text: 'Hello, is anyone there?' },
    { id: 3, sender: 'AI', text: 'Hi there! How can I assist you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const aiVideoRef = useRef(null);
  const chatContainerRef = useRef(null);

  const toggleChat = () => setIsChatActive(!isChatActive);
  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'You', text: inputMessage }]);
      setInputMessage('');
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: prevMessages.length + 1, sender: 'AI', text: 'I received your message. How can I help further?' }
        ]);
      }, 1000);
    }
  };

  const handleExerciseDetected = (exercise) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, sender: 'System', text: `Detected Exercise: ${exercise}` },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <button className="px-4 py-2 text-sm font-medium text-green-800 bg-green-200 hover:bg-green-300 rounded-md transition-colors">
              Back
            </button>
          </Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">AI Video Chat</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={aiVideoRef}
                autoPlay
                playsInline
                loop
                className="absolute inset-0 w-full h-full object-cover"
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              />
              {!isChatActive && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  AI video will appear here
                </div>
              )}
            </div>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <VideoStream isVideoOn={isVideoOn} onDetectedExercise={handleExerciseDetected} />
              {!isChatActive && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Your video will appear here
                </div>
              )}
            </div>
            <div className="flex justify-center space-x-4">
              <button onClick={toggleMic} className={isMicOn ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}>
                {isMicOn ? <Mic /> : <MicOff />}
              </button>
              <button onClick={toggleVideo} className={isVideoOn ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}>
                {isVideoOn ? <Video /> : <VideoOff />}
              </button>
              <button onClick={() => { toggleChat(); }} className={isChatActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}>
                {isChatActive ? <PhoneOff /> : <Phone />}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-13rem)] md:h-[calc(2*33vw)]">
            <div className="p-4 text-green-800 bg-green-200 font-semibold">Chat</div>
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
                  <span className="font-semibold">{message.sender}: </span>
                  <span>{message.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}