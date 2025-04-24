import React, { useState } from 'react'
import './Home.css'
import Sidebar from '../Sidebar/Sidebar'
import Show from '../Show/Show'

const Home = ({ sidebar, children }) => {
  const [category, setCategory] = useState(0);

  return (
    <>
      <Sidebar sidebar={sidebar} category={category} setCategory={setCategory} />
      <div className={`container ${sidebar ? "" : "large-container"}`}>
        {children || <Show category={category} />}
      </div>
    </>
  )
}

export default Home
