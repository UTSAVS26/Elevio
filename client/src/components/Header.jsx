import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const navItems = [
    { name: 'About', href: '#About' },
    { name: 'Workouts', href: '#Workouts' },
    { name: 'Benefits', href: '#Benefits' },
    { name: 'Start', href: '#Start' },
    { name: 'Dashboard', href: '/dashboard' }
  ];

  const handleScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header 
      className="px-4 lg:px-6 h-14 flex items-center justify-between fixed w-full bg-white z-10"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.a 
        className="flex items-center justify-center" 
        href="/"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" x2="6" y1="1" y2="4" />
          <line x1="10" x2="10" y1="1" y2="4" />
          <line x1="14" x2="14" y1="1" y2="4" />
        </svg>
        <span className="sr-only">FitLife App</span>
      </motion.a>

      <nav className="flex-1 flex px-6">
        <ul className="flex gap-4 sm:gap-6">
          {navItems.map((item, index) => (
            <motion.li key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.href.startsWith('/') ? (
                <Link className="text-sm font-medium hover:underline underline-offset-4" to={item.href}>
                  {item.name}
                </Link>
              ) : (
                <a 
                  className="text-sm font-medium hover:underline underline-offset-4" 
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                >
                  {item.name}
                </a>
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2">
        <Link to="/login">
          <motion.button
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </Link>
        <Link to="/register">
          <motion.button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </Link>
      </div>
    </motion.header>
  );
};

export default Header;
