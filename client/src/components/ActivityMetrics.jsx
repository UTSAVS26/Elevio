import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ icon, value, label, color }) => (
  <motion.div
    className="bg-white rounded-xl p-4 flex items-center gap-4"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {icon}
    </motion.div>
    <div>
      <motion.div
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.div>
      <motion.div
        className="text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {label}
      </motion.div>
    </div>
  </motion.div>
);

export default function ActivityMetrics() {
  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <MetricCard
        icon={
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        }
        value="110"
        label="Heart Rate"
        color="bg-red-50"
      />
      <MetricCard
        icon={
          <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        }
        value="65"
        label="Calories Burn"
        color="bg-blue-50"
      />
      <MetricCard
        icon={
          <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 6l-9.5 9.5-5-5L1 18" />
          </svg>
        }
        value="2.5 km"
        label="Running"
        color="bg-green-50"
      />
      <MetricCard
        icon={
          <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
            <path d="M12 12L7 7l5-5 5 5-5 5z" />
          </svg>
        }
        value="4 Hours"
        label="Shopping"
        color="bg-purple-50"
      />
    </motion.div>
  );
}