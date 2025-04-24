import { API_KEY } from '../data';

// Fetch trending videos
export const fetchTrendingVideos = async (categoryId = '0', maxResults = 50) => {
  try {
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=${maxResults}&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch trending videos: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    throw error;
  }
};

// Fetch video details by ID
export const fetchVideoById = async (videoId) => {
  try {
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch video details: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items[0];
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

// Fetch related videos - uses search endpoint which is more stable
export const fetchRelatedVideos = async (videoId, maxResults = 20) => {
  try {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      // If we hit a quota or permission issue, return empty array instead of failing
      if (response.status === 403) {
        console.warn("API quota exceeded or permission issue for related videos");
        return { items: [] };
      }
      throw new Error(`Failed to fetch related videos: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return { items: [] }; // Return empty array instead of failing
  }
};

// Fetch channel details
export const fetchChannelDetails = async (channelId) => {
  try {
    const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel details: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items[0];
  } catch (error) {
    console.error('Error fetching channel details:', error);
    throw error;
  }
};

// Search videos
export const searchVideos = async (query, maxResults = 50) => {
  try {
    // First search for videos
    const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&type=video&key=${API_KEY}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      if (response.status === 403) {
        return { items: [] };
      }
      throw new Error(`Search failed: ${response.status}`);
    }
    
    const searchData = await response.json();
    
    // If there are no items, return empty array
    if (!searchData.items || searchData.items.length === 0) {
      return { items: [] };
    }
    
    // Get video IDs for fetching additional details
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
    // Fetch additional video details, including contentDetails for duration
    const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
    const detailsResponse = await fetch(videoDetailsUrl);
    
    if (!detailsResponse.ok) {
      // Just return search results without details if this call fails
      return searchData;
    }
    
    const detailsData = await detailsResponse.json();
    return detailsData;
  } catch (error) {
    console.error('Error in search:', error);
    return { items: [] }; // Return empty array instead of failing
  }
};

// Download video (this will only generate a dummy alert since actual downloading requires server-side processing)
export const downloadVideo = (videoId, title) => {
  alert(
    `Due to YouTube's terms of service, direct video downloads are not possible through the YouTube API. For downloading videos, users would need to use a proper YouTube downloading service or tool that complies with YouTube's terms of service.`
  );
  
  // If this were a real app with server-side processing, we would redirect to a download endpoint
  // window.location.href = `/api/download?videoId=${videoId}`;
  
  return true;
};

// Add video to watch later (simulated)
export const addToWatchLater = (videoId) => {
  try {
    const watchLaterList = JSON.parse(localStorage.getItem('watchLater') || '[]');
    
    if (!watchLaterList.includes(videoId)) {
      watchLaterList.push(videoId);
      localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
      return true;
    }
    
    return true; // Return true even if already in list
  } catch (error) {
    console.error('Error adding to watch later:', error);
    return false;
  }
};

// Get watch later list
export const getWatchLater = async () => {
  try {
    const watchLaterList = JSON.parse(localStorage.getItem('watchLater') || '[]');
    
    if (watchLaterList.length === 0) {
      return [];
    }
    
    try {
      const videoIds = watchLaterList.join(',');
      const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIds}&key=${API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch watch later videos: ${response.status}`);
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching watch later videos:', error);
      return []; // Return empty array on error
    }
  } catch (error) {
    console.error('Error reading watch later from localStorage:', error);
    return [];
  }
};

// Like video (simulated)
export const likeVideo = (videoId) => {
  try {
    const likedList = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    
    if (!likedList.includes(videoId)) {
      likedList.push(videoId);
      localStorage.setItem('likedVideos', JSON.stringify(likedList));
      return true;
    }
    
    return true; // Return true even if already liked
  } catch (error) {
    console.error('Error liking video:', error);
    return false;
  }
};

// Get liked videos
export const getLikedVideos = async () => {
  try {
    const likedList = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    
    if (likedList.length === 0) {
      return [];
    }
    
    try {
      const videoIds = likedList.join(',');
      const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIds}&key=${API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch liked videos: ${response.status}`);
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching liked videos:', error);
      return []; // Return empty array on error
    }
  } catch (error) {
    console.error('Error reading liked videos from localStorage:', error);
    return [];
  }
}; 