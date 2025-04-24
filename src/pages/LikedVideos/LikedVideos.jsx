import React, { useEffect, useState } from 'react'
import './LikedVideos.css'
import { Link } from 'react-router-dom'
import { getLikedVideos } from '../../services/videoService'
import moment from 'moment'
import { value_converter } from '../../data'

const LikedVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                setLoading(true);
                const data = await getLikedVideos();
                setVideos(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching liked videos:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchLikedVideos();
    }, []);

    if (loading) {
        return <div className="liked-videos-loading">Loading liked videos...</div>;
    }

    if (error) {
        return <div className="liked-videos-error">Error: {error}</div>;
    }

    if (videos.length === 0) {
        return (
            <div className="liked-videos-empty">
                <h2>Your Liked Videos list is empty</h2>
                <p>Videos that you like will be shown here.</p>
            </div>
        );
    }

    return (
        <div className="liked-videos-container">
            <h2 className="liked-videos-title">Liked Videos</h2>
            <div className="liked-videos-list">
                {videos.map((video) => (
                    <Link 
                        to={`/video/${video.snippet.categoryId || '0'}/${video.id}`} 
                        className="liked-video-card" 
                        key={video.id}
                    >
                        <div className="liked-video-thumbnail">
                            <img 
                                src={video.snippet.thumbnails.medium.url} 
                                alt={video.snippet.title} 
                            />
                        </div>
                        <div className="liked-video-info">
                            <h3>{video.snippet.title}</h3>
                            <p>{video.snippet.channelTitle}</p>
                            <p>{value_converter(video.statistics.viewCount)} views • {moment(video.snippet.publishedAt).fromNow()}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LikedVideos; 