import React from 'react'
import './Video.css'
import PlayVideo from '../PlayVideo/PlayVideo'
import Felix from '../Felix/Felix'
import { useParams } from 'react-router-dom'
const Video =()=>{
    const {videoId,categoryId}=useParams(); 
       return (
        <div className="play-container">
            <PlayVideo videoId={videoId}/>
             <Felix categoryId={categoryId}/>
        </div>
    )
}
export default Video