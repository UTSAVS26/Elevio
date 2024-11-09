import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hiit from '../assets/hiit.jpg';
import muscle from '../assets/muscle.jpg';
import yoga from '../assets/yoga.jpg';
import { Link } from 'react-router-dom';


const WorkoutCard = ({ title, duration, intensity, description, imageSrc, altText }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 h-full flex flex-col items-center">
        <motion.div 
          className="w-12 h-12 mb-4 relative"
          initial={{ rotate: 0 }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-contain"
          />
        </motion.div>
        <motion.h3 
          className="text-2xl font-bold mb-2"
          animate={{ fontSize: isHovered ? "1.5rem" : "2rem" }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <p className="text-gray-600 mb-4">{duration} | {intensity}</p>
              <p className="mb-4">{description}</p>
              <Link to="/login">
              <motion.button 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mt-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Start Workout
              </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const FeaturedWorkouts = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.h2 
          className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Workouts
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WorkoutCard
            title="HIIT Cardio Blast"
            duration="30 minutes"
            intensity="High Intensity"
            description="Torch calories and improve cardiovascular health with this intense HIIT session."
            imageSrc={hiit}
            altText="HIIT workout icon"
          />
          <WorkoutCard
            title="Full Body Strength"
            duration="45 minutes"
            intensity="Intermediate"
            description="Build muscle and increase overall strength with this comprehensive routine."
            imageSrc={muscle}
            altText="Strength training icon"
          />
          <WorkoutCard
            title="Yoga Flow"
            duration="60 minutes"
            intensity="All Levels"
            description="Improve flexibility, balance, and mental clarity with this rejuvenating yoga session."
            imageSrc={yoga}
            altText="Yoga pose icon"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedWorkouts;