import React from 'react';
import { motion } from 'framer-motion';

const activities = [
  { name: 'Stretching', percentage: 40, color: 'text-blue-500' },
  { name: 'CrossFit', percentage: 30, color: 'text-purple-500' },
  { name: 'Yoga', percentage: 30, color: 'text-green-500' },
];

export default function ProgressChart() {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let startAngle = 0;

  return (
    <motion.div
      className="bg-white p-6 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-lg font-semibold mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        Today Overview
      </motion.h2>
      <div className="flex items-center justify-between">
        <motion.svg
          className="w-48 h-48 transform -rotate-90"
          initial={{ rotate: -90, scale: 0.5 }}
          animate={{ rotate: -90, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
        >
          {activities.map((activity, index) => {
            const percentage = activity.percentage / 100;
            const strokeDasharray = `${circumference * percentage} ${circumference}`;
            const offset = startAngle * circumference;
            startAngle += percentage;

            return (
              <motion.circle
                key={activity.name}
                cx="96"
                cy="96"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className={activity.color}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={offset}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ delay: 0.5 + index * 0.2, duration: 1, ease: "easeInOut" }}
              />
            );
          })}
        </motion.svg>
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.8,
              },
            },
          }}
        >
          {activities.map((activity) => (
            <motion.div
              key={activity.name}
              className="flex items-center gap-2"
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <div className={`w-3 h-3 rounded-full ${activity.color.replace('text-', 'bg-')}`} />
              <span className="text-sm font-medium">{activity.name}</span>
              <span className="text-sm text-gray-500">{activity.percentage}%</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}