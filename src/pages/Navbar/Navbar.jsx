import React, { useState, useEffect, useContext } from 'react'
import './Navbar.css'
import home from '../../assets/home.png'
import history from '../../assets/history.png'
import library from '../../assets/library.png'
import menu from '../../assets/menu.png'
import subscription from '../../assets/subscriprion.png'
import like from '../../assets/like.png'
import trend from '../../assets/explore.png'
import more from '../../assets/more.png'
import music from '../../assets/music.png'
import news from '../../assets/news.png'
import sports from '../../assets/sports.png'
import show_more from '../../assets/show-more.png'
import entertain from '../../assets/entertainment.png'
import game from '../../assets/game_icon.png'
import youtube from '../../assets/youtube.png'
import search from '../../assets/search.png'
import voice_search from '../../assets/voice-search.png'
import notification from '../../assets/notification.png'
import profile from '../../assets/jack.png'
import upload_icon from '../../assets/upload.png'
// import download_icon from '../../assets/download.png'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../App'

const Navbar = ({setSidebar}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { darkTheme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // Check if mobile view based on screen width
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 900);
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Handle sidebar toggle differently on mobile vs desktop
    const handleSidebarToggle = () => {
        if (isMobile) {
            // Mobile toggle would be handled by the Sidebar component
        } else {
            // Desktop toggle - expand/collapse sidebar
            setSidebar(prev => !prev);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Handle voice search
    const handleVoiceSearch = () => {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.start();

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                navigate(`/search?q=${encodeURIComponent(transcript)}`);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };
        } else {
            alert('Voice search is not supported in this browser');
        }
    };

    // Handle upload click
    const handleUpload = () => {
        alert("Upload functionality would typically open a file selector dialog.");
    };

    // Handle notification click
    const handleNotification = () => {
        setShowNotifications(!showNotifications);
        // Close other menus
        if (showUserMenu) setShowUserMenu(false);
    };

    // Handle download click
    // const handleDownload = () => {
    //     alert("Due to YouTube's terms of service, direct video downloads are not available. To download videos, you would need to use a service or tool that complies with YouTube's terms of service.");
    // };

    // Handle profile click
    const handleProfile = () => {
        setShowUserMenu(!showUserMenu);
        // Close other menus
        if (showNotifications) setShowNotifications(false);
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showNotifications && !e.target.closest('.notification-container')) {
                setShowNotifications(false);
            }
            if (showUserMenu && !e.target.closest('.user-menu-container')) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications, showUserMenu]);

    return (
        <nav className="flex-div">
            <div className="nav-left flex-div">
                <img 
                    className="menu-icon" 
                    onClick={handleSidebarToggle} 
                    src={menu} 
                    alt="Menu" 
                />
                <Link to='/' className="logo-container">
                    <img className="logo" src={youtube} alt="YouTube" />
                    <span className="youtube-text">YOUTUBE</span>
                    <span className="logo-text">PK</span>
                </Link>
            </div>

            <div className="nav-middle flex-div">
                <form onSubmit={handleSearch} className="search-box flex-div">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <img src={search} alt="Search" />
                    </button>
                </form>
                <button 
                    className="icon-btn voice-search-btn" 
                    onClick={handleVoiceSearch}
                    title="Search with your voice"
                >
                    <img 
                        className="voice-search-icon" 
                        src={voice_search} 
                        alt="Voice Search" 
                    />
                </button>
            </div>

            <div className="nav-right flex-div">
                <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                    {darkTheme ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
                        </svg>
                    )}
                </button>
                
                <button 
                    className="icon-btn" 
                    onClick={handleUpload}
                    title="Create"
                >
                    <img src={upload_icon} alt="Upload" />
                </button>
                
               
                
                <div className="notification-container">
                    <button 
                        className={`icon-btn ${showNotifications ? 'active' : ''}`} 
                        onClick={handleNotification}
                        title="Notifications"
                    >
                        <img src={notification} alt="Notifications" />
                        <span className="notification-badge">9+</span>
                    </button>
                    
                    {showNotifications && (
                        <div className="dropdown-menu notification-menu">
                            <div className="dropdown-header">
                                <h3>Notifications</h3>
                            </div>
                            <div className="dropdown-item">
                                <p>You have no new notifications</p>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="user-menu-container">
                    <button 
                        className={`user-btn ${showUserMenu ? 'active' : ''}`} 
                        onClick={handleProfile}
                        title="Account"
                    >
                        <img src={profile} className="user-icon" alt="Profile" />
                    </button>
                    
                    {showUserMenu && (
                        <div className="dropdown-menu user-menu">
                            <div className="dropdown-header user-header">
                                <img src={profile} className="user-menu-img" alt="User" />
                                <div>
                                    <h3>Your Name</h3>
                                    <p>Manage your Google Account</p>
                                </div>
                            </div>
                            <div className="dropdown-item">Your channel</div>
                            <div className="dropdown-item">YouTube Studio</div>
                            <div className="dropdown-item">Switch account</div>
                            <div className="dropdown-item">Sign out</div>
                            <hr />
                            <div className="dropdown-item">Appearance: {darkTheme ? 'Dark' : 'Light'}</div>
                            <div className="dropdown-item">Language: English</div>
                            <div className="dropdown-item">Location: United States</div>
                            <div className="dropdown-item">Settings</div>
                            <hr />
                            <div className="dropdown-item">Help</div>
                            <div className="dropdown-item">Send feedback</div>
                            <div className="dropdown-item">Keyboard shortcuts</div>
                        </div>
                    )}
                </div>
            </div>
        </nav> 
    )
}
  
export default Navbar
  