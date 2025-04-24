import React, { useEffect, useState, useContext } from 'react'
import './Search.css'
import { useLocation, Link } from 'react-router-dom'
import { value_converter } from '../../data'
import moment from 'moment'
import { searchVideos } from '../../services/videoService'
import { ThemeContext } from '../../App'

const Search = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('q');
    const { darkTheme } = useContext(ThemeContext);

    // Format video duration from ISO 8601 format
    const formatDuration = (duration) => {
        if (!duration) return '';
        
        // Remove PT from the beginning
        const time = duration.replace('PT', '');
        
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        
        // Extract hours, minutes, seconds
        if (time.includes('H')) {
            hours = parseInt(time.split('H')[0]);
            minutes = parseInt(time.split('H')[1].split('M')[0] || 0);
            seconds = parseInt(time.split('M')[1]?.split('S')[0] || 0);
        } else if (time.includes('M')) {
            minutes = parseInt(time.split('M')[0]);
            seconds = parseInt(time.split('M')[1]?.split('S')[0] || 0);
        } else if (time.includes('S')) {
            seconds = parseInt(time.split('S')[0]);
        }
        
        // Format the time
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const data = await searchVideos(searchQuery);
                setResults(data.items || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError(error.message || 'An error occurred while searching');
                setLoading(false);
            }
        };
        
        fetchSearchResults();
    }, [searchQuery]);

    // Render loading skeleton
    if (loading) {
        return (
            <div className={`search-container ${darkTheme ? 'dark-theme' : ''}`}>
                <h2 className="search-title">Searching for: "{searchQuery}"</h2>
                <div className="search-results">
                    {[...Array(5)].map((_, index) => (
                        <div className="search-card" key={index}>
                            <div className="search-thumbnail">
                                <div className="search-skeleton" style={{width: '100%', height: '100%'}}></div>
                            </div>
                            <div className="search-info">
                                <div className="search-skeleton" style={{width: '80%', height: '20px', marginBottom: '10px'}}></div>
                                <div className="search-skeleton" style={{width: '60%', height: '16px', marginBottom: '8px'}}></div>
                                <div className="search-skeleton" style={{width: '40%', height: '16px', marginBottom: '15px'}}></div>
                                <div className="search-skeleton" style={{width: '90%', height: '14px'}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="search-error">Error: {error}</div>;
    }

    if (results.length === 0 && !loading) {
        return (
            <div className="no-results">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" style={{marginBottom: '10px'}}>
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm0-7C8.34 7 7.5 7.84 7.5 9s.84 2 1.88 2c1.04 0 1.88-.84 1.88-2S10.54 7 9.5 7z"/>
                    </svg>
                </div>
                <p>No results found for "{searchQuery}"</p>
                <p style={{fontSize: '14px', marginTop: '10px', color: 'var(--secondary-text-color)'}}>Try different keywords or check your spelling</p>
            </div>
        );
    }

    return (
        <div className={`search-container ${darkTheme ? 'dark-theme' : ''}`}>
            <h2 className="search-title">Search results for: "{searchQuery}"</h2>
            <div className="search-results">
                {results.map((item) => (
                    <Link 
                        to={`/video/${item.snippet?.categoryId || '0'}/${item.id?.videoId || item.id}`} 
                        className="search-card" 
                        key={item.id?.videoId || item.id}
                    >
                        <div className="search-thumbnail">
                            <img 
                                src={item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url} 
                                alt={item.snippet?.title} 
                            />
                            {item.contentDetails?.duration && (
                                <span className="search-duration">
                                    {formatDuration(item.contentDetails.duration)}
                                </span>
                            )}
                        </div>
                        <div className="search-info">
                            <h3>{item.snippet?.title}</h3>
                            <div className="search-meta">
                                <p>{value_converter(item.statistics?.viewCount || 0)} views • {moment(item.snippet?.publishedAt).fromNow()}</p>
                                <p className="search-channel">
                                    {item.snippet?.channelTitle}
                                    {/* Add verification badge for channels with >100K subscribers (simulated) */}
                                    {(Math.random() > 0.5 || parseInt(item.statistics?.viewCount || 0) > 100000) && (
                                        <svg className="verified-badge" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-4.2-4.2 1.4-1.4 2.8 2.8 6.4-6.4 1.4 1.4-7.8 7.8z"/>
                                        </svg>
                                    )}
                                </p>
                                <p className="search-desc">{item.snippet?.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Search 