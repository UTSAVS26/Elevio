import React from 'react';
import { motion } from 'framer-motion';

const FoodCard = ({ image, title, days, description }) => (
  <motion.div
    className="flex items-center gap-4 p-4 bg-white rounded-xl"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.img
      src={image}
      alt={title}
      className="w-16 h-16 rounded-lg object-cover"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    />
    <div>
      <motion.h3
        className="font-semibold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-sm text-gray-500"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {days} Days
      </motion.p>
      <motion.p
        className="text-xs text-gray-400"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>
    </div>
  </motion.div>
);

export default function FoodRecommendations() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <motion.h2
          className="text-lg font-semibold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Recommended Food
        </motion.h2>
        <motion.button
          className="text-sm text-purple-600"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Monthly
        </motion.button>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        }}
      >
        <FoodCard
          image="/placeholder.svg?height=64&width=64"
          title="Fresh Veggies"
          days="7"
          description="Daily balanced diet"
        />
        <FoodCard
          image="/placeholder.svg?height=64&width=64"
          title="Fresh Orange Fruits"
          days="12"
          description="Daily fresh fruits"
        />
        <FoodCard
          image="/placeholder.svg?height=64&width=64"
          title="Fresh Fruits Juice"
          days="7"
          description="Daily balanced juice"
        />
      </motion.div>
    </motion.div>
  );
}