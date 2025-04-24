import React, { useEffect, useState, useContext, useRef } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import like_filled from '../../assets/like-filled.png'
import dislike from '../../assets/dislike.png'
import save from '../../assets/save.png'
import save_filled from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import share from '../../assets/share.png'
import download from '../../assets/download.png'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { API_KEY, value_converter } from '../../data'
import { downloadVideo, addToWatchLater, likeVideo } from '../../services/videoService'
import { ThemeContext } from '../../App'

const PlayVideo = () => {
    const { videoId } = useParams();
    
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [commentError, setCommentError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { darkTheme } = useContext(ThemeContext);
    
    const descriptionRef = useRef(null);

    const fetchVideosData = async () => {
        setLoading(true);
        //fetching the data
        try {
            const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
            const response = await fetch(videoDetails_url);
            
            if (!response.ok) {
                throw new Error(`Error fetching video: ${response.status}`);
            }
            
            const data = await response.json();
            setApiData(data.items[0]);
        } catch (error) {
            console.error("Error fetching video data:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchChannelData = async () => {
        if (!apiData) return;
        
        try {
            const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            const response = await fetch(channelDetails_url);
            
            if (!response.ok) {
                throw new Error(`Error fetching channel: ${response.status}`);
            }
            
            const data = await response.json();
            setChannelData(data.items[0]);
            
            // Check if user is subscribed to this channel
            const subscribedChannels = JSON.parse(localStorage.getItem('subscribedChannels') || '[]');
            setIsSubscribed(subscribedChannels.includes(apiData.snippet.channelId));
        } catch (error) {
            console.error("Error fetching channel data:", error);
        }
    }
    
    const fetchCommentData = async () => {
        setCommentError(null);
        try {
            const commentDetails_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
            const response = await fetch(commentDetails_url);
            
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("Comments are disabled or API quota exceeded.");
                } else {
                    throw new Error(`Error fetching comments: ${response.status} ${response.statusText}`);
                }
            }
            
            const data = await response.json();
            setCommentData(data.items || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setCommentError(error.message);
        }
    }

    // Check if the video is already liked or saved to watch later
    useEffect(() => {
        const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
        const watchLaterVideos = JSON.parse(localStorage.getItem('watchLater') || '[]');
        
        setIsLiked(likedVideos.includes(videoId));
        setIsSaved(watchLaterVideos.includes(videoId));
    }, [videoId]);

    useEffect(() => {
        fetchVideosData();
    }, [videoId]);

    useEffect(() => {
        if (apiData) {
            fetchChannelData();
            fetchCommentData();
        }
    }, [apiData]);

    // Handle like button click
    const handleLike = () => {
        const result = likeVideo(videoId);
        setIsLiked(result);
        
        // Update like count in UI
        if (result && apiData) {
            setApiData({
                ...apiData,
                statistics: {
                    ...apiData.statistics,
                    likeCount: parseInt(apiData.statistics.likeCount) + (isLiked ? -1 : 1),
                },
            });
        }
    };

    // Handle save to watch later
    const handleSave = () => {
        const result = addToWatchLater(videoId);
        setIsSaved(result);
    };

    // Handle download
    const handleDownload = () => {
        if (apiData) {
            downloadVideo(videoId, apiData.snippet.title);
        }
    };

    // Share video
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: apiData ? apiData.snippet.title : 'YouTube Video',
                url: `https://www.youtube.com/watch?v=${videoId}`
            }).catch(err => {
                console.error('Error sharing:', err);
            });
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`)
                .then(() => {
                    alert('Video link copied to clipboard!');
                })
                .catch(err => {
                    console.error('Error copying link:', err);
                });
        }
    };
    
    // Toggle description
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };
    
    // Handle subscribe
    const handleSubscribe = () => {
        if (!apiData) return;
        
        const channelId = apiData.snippet.channelId;
        const subscribedChannels = JSON.parse(localStorage.getItem('subscribedChannels') || '[]');
        
        if (isSubscribed) {
            // Unsubscribe
            const updatedChannels = subscribedChannels.filter(id => id !== channelId);
            localStorage.setItem('subscribedChannels', JSON.stringify(updatedChannels));
            setIsSubscribed(false);
        } else {
            // Subscribe
            subscribedChannels.push(channelId);
            localStorage.setItem('subscribedChannels', JSON.stringify(subscribedChannels));
            setIsSubscribed(true);
        }
    };

    return (
        <div className={`play-video ${darkTheme ? 'dark-theme' : ''}`}>
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <>
                    <div className="video-wrapper">
                        <iframe 
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="video-iframe"
                        ></iframe>
                    </div>
                    <h3>{apiData ? apiData.snippet.title : "Title here!"}</h3>
                    <div className="play-video-info">
                        <p>{apiData ? value_converter(apiData.statistics.viewCount) : "687K"} views • {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
                        <div className="play-video-actions">
                            <button className={`action-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                                <img src={isLiked ? like_filled : like} alt="Like" />
                                <span>{apiData ? value_converter(apiData.statistics.likeCount) : 155}</span>
                            </button>
                            <button className="action-btn">
                                <img src={dislike} alt="Dislike" />
                            </button>
                            <button className="action-btn" onClick={handleShare}>
                                <img src={share} alt="Share" />
                                <span>Share</span>
                            </button>
                            <button className={`action-btn ${isSaved ? 'active' : ''}`} onClick={handleSave}>
                                <img src={isSaved ? save_filled : save} alt="Save" />
                                <span>Save</span>
                            </button>
                            <button className="action-btn" onClick={handleDownload}>
                                <img src={download} alt="Download" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>
                    <hr/>
                    <div className="publisher">
                        <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="" />
                        <div>
                            <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                            <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : ""} subscribers</span>
                        </div>
                        <button 
                            className={isSubscribed ? 'subscribed' : ''}
                            onClick={handleSubscribe}
                        >
                            {isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </div>
                    <div className="vid-description" ref={descriptionRef}>
                        {apiData && (
                            <>
                                <p>
                                    {showFullDescription 
                                        ? apiData.snippet.description 
                                        : apiData.snippet.description.slice(0, 150) + (apiData.snippet.description.length > 150 ? '...' : '')}
                                </p>
                                {apiData.snippet.description.length > 150 && (
                                    <button 
                                        className="show-more-btn" 
                                        onClick={toggleDescription}
                                    >
                                        {showFullDescription ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                            </>
                        )}
                        
                        {commentError ? (
                            <div className="comment-error">
                                <p>{commentError}</p>
                            </div>
                        ) : (
                            <>
                                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 0} Comments </h4>
                                {commentData.length === 0 && !commentError ? (
                                    <div className="comment-error">
                                        <p>No comments available for this video.</p>
                                    </div>
                                ) : (
                                    commentData.map((item, index) => (
                                        <div key={index} className="comment">
                                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                                            <div className="comment-content">
                                                <h3>
                                                    {item.snippet.topLevelComment.snippet.authorDisplayName}
                                                    <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                                                </h3>
                                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                                <div className="comment-action">
                                                    <button>
                                                        <img src={like} alt="Like" />
                                                        <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                                    </button>
                                                    <button>
                                                        <img src={dislike} alt="Dislike" />
                                                    </button>
                                                    <button>Reply</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default PlayVideo