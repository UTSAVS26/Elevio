import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/sidebar';
import ActivityMetrics from '../components/ActivityMetrics';
import ActivityGraph from '../components/ActivityGraph';
import ProgressChart from '../components/ProgressChart';
import FoodRecommendations from '../components/FoodRec';
import TrainerSection from '../components/Trainer';

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <motion.main
        className="flex-1 p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.header className="flex justify-between items-center mb-8" variants={itemVariants}>
            <div>
              <h1 className="text-2xl font-bold">Welcome Mike, Good Morning</h1>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 text-gray-500 hover:text-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </motion.button>
              <motion.img
                src="/placeholder.svg?height=40&width=40"
                alt="Profile"
                className="w-10 h-10 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            </div>
          </motion.header>

          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <ActivityMetrics />
            </motion.div>
            
            <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={itemVariants}>
              <div className="lg:col-span-2">
                <ActivityGraph />
              </div>
              <div>
                <ProgressChart />
              </div>
            </motion.div>

            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={itemVariants}>
              <FoodRecommendations />
              <TrainerSection />
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}