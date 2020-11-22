import React from 'react'

import { logout } from '../service/auth'
import Header from '../container/Header'
import JoinRoom from './JoinRoom'
import CreateNewRoom from './CreateNewRoom'

import './styles/Home.css'

import Background from '../images/background.png'

const Home = () => {
    return (
        <div className="home-screen" style={{ backgroundImage: `url(${Background})` }}>
            <Header logout={logout} text="LOGOUT" />
            <p style={{ color: 'white', alignSelf: 'center', fontSize: 50 }}>THIS IS HOME OF KABOO</p>
            <div className="home-buttons">
                <CreateNewRoom />
                <JoinRoom />
            </div>
        </div>
    )
}

export default Home