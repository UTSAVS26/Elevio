import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MenuItem = ({ icon, label, isActive }) => (
  <motion.li
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
        isActive ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  </motion.li>
);

export default function Sidebar() {
  return (
    <motion.aside
      className="w-64 border-r border-gray-200 h-screen p-4"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center gap-2 mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <svg
          className="w-8 h-8 text-purple-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 6v12m-8-6h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link to="/">
          <span className="font-bold text-xl">FITNESS</span>
        </Link>
      </motion.div>
            
      <nav>
      <motion.ul
          className="space-y-2"
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
          <MenuItem
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
              </svg>
            }
            label="Dashboard"
            isActive={true}
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                <path d="M12 6v12" />
                <path d="M6 12h12" />
              </svg>
            }
            label="Fitness"
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            }
            label="Workout"
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            }
            label="Outdoor Activities"
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v18M3 12h18" />
              </svg>
            }
            label="Settings"
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            }
            label="Logout"
          />
        </motion.ul>
      </nav>
    </motion.aside>
  );
}