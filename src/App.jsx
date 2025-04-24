import React, { useState, useEffect, createContext } from 'react'
import {Route, Routes} from 'react-router-dom'
import Navbar from './pages/Navbar/Navbar'
import Home from './pages/Home/Home'
import Video from './pages/Video/Video'
import Search from './pages/Search/Search'
import WatchLater from './pages/WatchLater/WatchLater'
import LikedVideos from './pages/LikedVideos/LikedVideos'

// Create Theme Context
export const ThemeContext = createContext();

const App = () => {
  const [sidebar, setSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark');
  
  // Apply theme class to body
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkTheme]);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = !darkTheme;
    setDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };
  
  // Check if mobile view based on screen width
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on mobile
      if (mobile && sidebar) {
        setSidebar(false);
      }
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebar]);

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      <div className={darkTheme ? 'app dark-theme' : 'app'}>
        <Navbar setSidebar={setSidebar} />
        <Routes>
          <Route path='/' element={<Home sidebar={sidebar} />} />
          <Route path='/video/:categoryId/:videoId' element={<Video />} />
          <Route path='/search' element={<Home sidebar={sidebar}><Search /></Home>} />
          <Route path='/watch-later' element={<Home sidebar={sidebar}><WatchLater /></Home>} />
          <Route path='/liked-videos' element={<Home sidebar={sidebar}><LikedVideos /></Home>} />
        </Routes>
      </div>
    </ThemeContext.Provider>
  );
};

export default App

