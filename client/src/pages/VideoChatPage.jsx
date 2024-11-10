import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoStream from './VideoStream';

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
  const chatContainerRef = useRef(null);
  const aiVideoRef = useRef(null);

  const toggleChat = () => setIsChatActive(!isChatActive);
  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  const handleExerciseDetected = (exercise) => {
    setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, sender: 'System', text: `Detected Exercise: ${exercise}` },
    ]);
    setExerciseVideo(`archive/${exercise}/${exercise}_1.mp4`);  // Update video based on detected exercise
  };

  // Function to send frames to FastAPI for pose evaluation
  const sendFramesForPoseCorrection = async (frame1, frame2) => {
    try {
      const formData = new FormData();
      formData.append('frame1', frame1);
      formData.append('frame2', frame2);

      const response = await axios.post('/process_frames', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const correctionText = response.data.correction_text || response.data.message;
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, sender: 'AI', text: correctionText },
      ]);
    } catch (error) {
      console.error('Error fetching pose correction:', error);
    }
  };

  // Simulate capturing frames from VideoStream and sending to API every few seconds
  useEffect(() => {
    const captureFrames = async () => {
      // Here, frame1 and frame2 would be captured from the VideoStream component
      // For example purposes, we use placeholders
      const frame1 = new Blob(); // Replace with actual frame data
      const frame2 = new Blob(); // Replace with actual frame data
      await sendFramesForPoseCorrection(frame1, frame2);
    };

    // Capture frames every 5 seconds
    const intervalId = setInterval(() => {
      if (isVideoOn) captureFrames();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isVideoOn]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'You', text: inputMessage }]);
      setInputMessage('');

      try {
        const response = await axios.post('/api/get-model-response', { message: inputMessage });
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, sender: 'AI', text: response.data.reply },
        ]);
      } catch (error) {
        console.error('Error fetching model response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, sender: 'AI', text: "I'm having trouble processing your request right now." },
        ]);
      }
    }
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
              <video ref={aiVideoRef} autoPlay playsInline loop className="absolute inset-0 w-full h-full object-cover" src={exerciseVideo} />
              {!isChatActive && <div className="absolute inset-0 flex items-center justify-center text-white">AI video will appear here</div>}
            </div>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <VideoStream isVideoOn={isVideoOn} onDetectedExercise={handleExerciseDetected} />
              {!isChatActive && <div className="absolute inset-0 flex items-center justify-center text-white">Your video will appear here</div>}
            </div>
            <div className="flex justify-center space-x-4">
              <button onClick={toggleMic} className={isMicOn ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}>
                {isMicOn ? <Mic /> : <MicOff />}
              </button>
              <button onClick={toggleVideo} className={isVideoOn ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}>
                {isVideoOn ? <Video /> : <VideoOff />}
              </button>
              <button onClick={() => toggleChat()} className={isChatActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}>
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
