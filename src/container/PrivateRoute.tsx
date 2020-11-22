import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { verifyFromLocalStorage } from '../service/auth';

interface Props {
    children: React.ReactChild
}

const PrivateRoute = ({ children, ...rest }: Props) => {

    const isAuth = () => {
        return verifyFromLocalStorage('user')
    }

    return (
        <Route
            {...rest}
            render={() => (
                isAuth() ? children : <Redirect to="/"/>
            )}
        />
    );
}

export default PrivateRoute