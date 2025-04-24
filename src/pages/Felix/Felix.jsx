import React, { useState, useEffect, useContext } from 'react'
import './Felix.css'
import thumbnail1 from '../../assets/thumbnail1.png'
import thumbnail2 from '../../assets/thumbnail2.png'
import thumbnail3 from '../../assets/thumbnail3.png'
import thumbnail4 from '../../assets/thumbnail4.png'
import thumbnail5 from '../../assets/thumbnail5.png'
import thumbnail6 from '../../assets/thumbnail6.png'
import thumbnail7 from '../../assets/thumbnail7.png'
import thumbnail8 from '../../assets/thumbnail8.png'
import {API_KEY} from '../../data'
import {value_converter} from '../../data'
import {Link} from 'react-router-dom'
import { ThemeContext } from '../../App'

const Felix = ({categoryId}) => {
    const [apiData, setApiData] = useState([]);
    const { darkTheme } = useContext(ThemeContext);
    
    const fetchData = async() => {
    const relvideo_url=`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
    await fetch(relvideo_url).then(res=>res.json()).then(data=>setApiData(data.items));
    }
    
    useEffect(() => {
        fetchData();
    }, [categoryId]);

    return (
    <div className={`recom ${darkTheme ? 'dark-theme' : ''}`}>
        {apiData.map((item,index) => {
            return(
                <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
                     <img src={item.snippet.thumbnails.medium.url} alt="" />
                <div className="vid-info">
                    <h4>{item.snippet.title}</h4>
                    <p>{item.snippet.channelTitle}</p>
                    <p className="views">{value_converter(item.statistics.viewCount)} Views</p>
                </div>
                </Link>
            )
        })}
    </div>
  )
}

export default Felix
