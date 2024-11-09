import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth0 } from "@auth0/auth0-react";


const MenuItem = ({ icon, label, link, isActive, onClick }) => (
  <motion.li
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <Link
      to={link}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
        isActive ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  </motion.li>
);

export default function Sidebar() {
  const [activeLink, setActiveLink] = useState('/dashboard'); 
  const { logout } = useAuth0();

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
          className="w-8 h-8 text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 6v12m-8-6h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link to="/">
          <span className="font-bold text-xl">Flexion</span>
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
            link="/dashboard"
            isActive={activeLink === '/dashboard'}
            onClick={() => setActiveLink('/dashboard')}
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                <path d="M12 6v12" />
                <path d="M6 12h12" />
              </svg>
            }
            label="Flexion"
            link="/"
            isActive={activeLink === '/'}
            onClick={() => setActiveLink('/')}
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
            link="/videochatpage"
            isActive={activeLink === '/videochatpage'}
            onClick={() => setActiveLink('/videochatpage')}
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.94 1.94 0 0 0 .38 2.1l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.94 1.94 0 0 0-2.1-.38 1.94 1.94 0 0 0-1.11 1.7V21a2 2 0 0 1-4 0v-.16a1.94 1.94 0 0 0-1.71-1.11 1.94 1.94 0 0 0-2.1.38l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.94 1.94 0 0 0 .38-2.1 1.94 1.94 0 0 0-1.11-1.71H3a2 2 0 0 1 0-4h.16a1.94 1.94 0 0 0 1.11-1.7 1.94 1.94 0 0 0-.38-2.1l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.94 1.94 0 0 0 2.1.38h.01a1.94 1.94 0 0 0 1.7-1.11V3a2 2 0 0 1 4 0v.16a1.94 1.94 0 0 0 1.71 1.11 1.94 1.94 0 0 0 2.1-.38l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.94 1.94 0 0 0-.38 2.1 1.94 1.94 0 0 0 1.11 1.7H21a2 2 0 0 1 0 4h-.16a1.94 1.94 0 0 0-1.11 1.71z" />
              </svg>
            }
            label="Settings"
            link="/settings"
            isActive={activeLink === '/settings'}
            onClick={() => setActiveLink('/settings')}
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
            link="#"
            isActive={false}
            onClick={() => logout({ returnTo: window.location.origin })}
          />
        </motion.ul>
      </nav>
    </motion.aside>
  );
}
