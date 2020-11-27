import { BrowserHistory } from 'history'
import React from 'react'
import Login from '../component/Login'
import Signup from '../component/Singup'

import './css/LandingPage.css'

interface Props {
    history: BrowserHistory
}

const LandingPage = ({ history }: Props) => {
    return (
        <div className="login-signup-page">
            <Login history={history} />
            <Signup history={history} />
        </div>
    )
}

export default LandingPage