import React, { useEffect, useState } from 'react'
import './WatchLater.css'
import { Link } from 'react-router-dom'
import { getWatchLater } from '../../services/videoService'
import moment from 'moment'
import { value_converter } from '../../data'

const WatchLater = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWatchLaterVideos = async () => {
            try {
                setLoading(true);
                const data = await getWatchLater();
                setVideos(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching watch later videos:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchWatchLaterVideos();
    }, []);

    if (loading) {
        return <div className="watch-later-loading">Loading watch later videos...</div>;
    }

    if (error) {
        return <div className="watch-later-error">Error: {error}</div>;
    }

    if (videos.length === 0) {
        return (
            <div className="watch-later-empty">
                <h2>Your Watch Later list is empty</h2>
                <p>Save videos to watch later by clicking "Watch Later" on a video.</p>
            </div>
        );
    }

    return (
        <div className="watch-later-container">
            <h2 className="watch-later-title">Watch Later</h2>
            <div className="watch-later-videos">
                {videos.map((video) => (
                    <Link 
                        to={`/video/${video.snippet.categoryId || '0'}/${video.id}`} 
                        className="watch-later-card" 
                        key={video.id}
                    >
                        <div className="watch-later-thumbnail">
                            <img 
                                src={video.snippet.thumbnails.medium.url} 
                                alt={video.snippet.title} 
                            />
                        </div>
                        <div className="watch-later-info">
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

export default WatchLater; 