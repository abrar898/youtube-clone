import React, { useEffect, useState } from 'react'
import './Sidebar.css'
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
import youtube_logo from '../../assets/youtube.png'
import search from '../../assets/search.png'
import voice_search from '../../assets/voice-search.png'
import notification from '../../assets/notification.png'
import profile from '../../assets/jack.png'
import upload_icon from '../../assets/upload.png'
import logo from '../../assets/logo.png'
import playlist from '../../assets/playlist.png'
import downloads from '../../assets/download.png'
import watchlater from '../../assets/watchlater.png'
import yourvideo from '../../assets/yourvideo.png'
import shorts from '../../assets/shorts.png'
import bookmark from '../../assets/save.png'
import you from '../../assets/you.png'
import automobiles from'../../assets/automobiles.png'
import tech from '../../assets/tech.png'
import simon from '../../assets/simon.png'
import tom from '../../assets/tom.png'
import megan from '../../assets/megan.png'
import cameron from '../../assets/cameron.png'
import { Link, useNavigate } from 'react-router-dom'
import { downloadVideo, addToWatchLater, likeVideo } from '../../services/videoService'

const Sidebar = ({sidebar, category, setCategory}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [mobileSidebarActive, setMobileSidebarActive] = useState(false);
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

    // Handle sidebar click in mobile view (close sidebar when a category is clicked)
    const handleCategoryClick = (categoryId) => {
        setCategory(categoryId);
        if (isMobile) {
            setMobileSidebarActive(false);
        }
        navigate('/');
    };

    // Handle Watch Later
    const handleWatchLater = () => {
        navigate('/watch-later');
        if (isMobile) {
            setMobileSidebarActive(false);
        }
    };

    // Handle Liked Videos
    const handleLikedVideos = () => {
        navigate('/liked-videos');
        if (isMobile) {
            setMobileSidebarActive(false);
        }
    };

    // Handle Downloads
    const handleDownloads = () => {
        alert(
            "Due to YouTube's terms of service, direct video downloads are not available. To download videos, you would need to use a service or tool that complies with YouTube's terms of service."
        );
        if (isMobile) {
            setMobileSidebarActive(false);
        }
    };

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobile && mobileSidebarActive && !e.target.closest('.sidebar') && !e.target.closest('.menu-icon')) {
                setMobileSidebarActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobile, mobileSidebarActive]);

    // Toggle mobile sidebar when menu icon is clicked
    useEffect(() => {
        const menuIcon = document.querySelector('.menu-icon');
        if (menuIcon) {
            menuIcon.addEventListener('click', () => {
                if (isMobile) {
                    setMobileSidebarActive(prev => !prev);
                }
            });
        }
    }, [isMobile]);

    // Determine sidebar classes
    const sidebarClasses = `sidebar ${sidebar ? "" : "small-sidebar"} ${isMobile && mobileSidebarActive ? "mobile-sidebar-active" : ""}`;

    return (
        <div className={sidebarClasses}>
            <div className="shortcut-links">      

                <div className={`side-link ${category===0?"active":""}`} onClick={() => handleCategoryClick(0)}>
                    <img src={home} alt="" /><p>Home</p>
                </div>
                        
                <div className={`side-link ${category===22?"active":""}`} onClick={() => handleCategoryClick(22)}>
                    <img src={shorts} alt="" />
                    <p>Shorts</p>
                </div>

                <div className={`side-link ${category===14?"active":""}`} onClick={() => handleCategoryClick(14)}>
                    <img src={subscription} alt="" />
                    <p>Subscription</p>
                </div>
                <hr/>
                <div className={`side-link ${category===23?"active":""}`} onClick={() => handleCategoryClick(23)}>
                    <img src={you} alt="" />
                    <p>You</p>
                </div>

                <div className="side-link">
                    <img src={history} alt="" />
                    <p>History</p>
                </div>

                <div className="side-link">
                    <img src={playlist} alt="" />
                    <p>Playlists</p>
                    <button className="sidebar-btn">+</button>
                </div>

                <div className={`side-link ${category===2?"active":""}`} onClick={() => handleCategoryClick(2)}>
                    <img src={yourvideo} alt="" />
                    <p>Your videos</p>
                    <button className="sidebar-btn">+</button>
                </div>

                <div className="side-link" onClick={handleWatchLater}>
                    <img src={watchlater} alt="" />
                    <p>Watch later</p>
                    <button className="sidebar-btn">+</button>
                </div>

                <div className="side-link" onClick={handleLikedVideos}>
                    <img src={like} alt="" />
                    <p>Liked videos</p>
                </div>

                <div className="side-link" onClick={handleDownloads}>
                    <img src={downloads} alt="" />
                    <p>Downloads</p>
                </div>
                <hr/>

                <div className="side-link">
                    <h2>Subscription</h2>
                </div>

                <div className={`side-link ${category===11?"active":""}`} onClick={() => handleCategoryClick(11)}>
                    <img src={show_more} alt="" />
                    <p>Show more</p>
                </div>
                <hr/>
                <div className="side-link">
                    <h2>Explore</h2>
                </div>

                <div className={`side-link ${category===28?"active":""}`} onClick={() => handleCategoryClick(28)}>
                    <img src={trend} alt="" />
                    <p>Trending</p>
                </div>

                <div className={`side-link ${category===10?"active":""}`} onClick={() => handleCategoryClick(10)}> 
                    <img src={music} alt="" />
                    <p>Music</p>
                </div>

                <div className={`side-link ${category===20?"active":""}`} onClick={() => handleCategoryClick(20)}>
                    <img src={game} alt="" />
                    <p>Gaming</p>
                </div>

                <div className={`side-link ${category===25?"active":""}`} onClick={() => handleCategoryClick(25)}>
                    <img src={news} alt="" />
                    <p>News</p>
                </div>

                <div className={`side-link ${category===17?"active":""}`} onClick={() => handleCategoryClick(17)}>
                    <img src={sports} alt="" />
                    <p>Sports</p>
                </div>
                <hr/>
                <div className="side-link">
                    <h4>More from YouTube</h4>
                </div>

                <div className="side-link">
                    <img src={youtube_logo} alt="" />
                    <p>YouTube Premium</p>
                </div>

                <div className="side-link">
                    <img src={youtube_logo} alt="" />
                    <p>YouTube Studio</p>
                </div>

                <div className="side-link">
                    <img src={youtube_logo} alt="" />
                    <p>YouTube Music</p>
                </div>

                <div className="side-link">
                    <img src={youtube_logo} alt="" />
                    <p>YouTube Kids</p>
                </div>
                <hr/>  

                <div className="side-link">
                    <p>Settings</p>
                </div>

                <div className="side-link">
                    <p>Report history</p>
                </div>

                <div className="side-link">
                    <p>Help</p>
                </div>

                <div className="side-link">
                    <p>Send feedback</p>
                </div>
                <hr/>
            </div>
        </div>
    )
}

export default Sidebar