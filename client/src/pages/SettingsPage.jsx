import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ActivityMetrics from '../components/ActivityMetrics';
import ActivityGraph from '../components/ActivityGraph';
// import ProgressChart from '../components/ProgressChart';
import FoodRecommendations from '../components/FoodRec';
// import TrainerSection from '../components/Trainer';

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
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Edit
                </motion.button>
            </div>
          </motion.header>

          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <ActivityMetrics />
            </motion.div>
            
            <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={itemVariants}>
              <div className="lg:col-span-3">
                <ActivityGraph />
              </div>
              {/* <div>
                <ProgressChart />
              </div> */}
            </motion.div>

            <motion.div className="grid grid-cols-1 lg:grid-cols-1 gap-8" variants={itemVariants}>
              <FoodRecommendations />
              {/* <TrainerSection /> */}
            </motion.div> 
          </div>
        </div>
      </motion.main>
    </div>
  );
}