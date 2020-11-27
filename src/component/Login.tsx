import React, { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { CgLogIn } from "react-icons/cg"

import { login, verifyToken } from '../service/auth'
import { BrowserHistory } from 'history'
import './styles/Login.css'

interface Props {
    history: BrowserHistory
}

const Login = (props: Props) => {
    const [userName, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // TODO: move this to LandingPage?
    const user = localStorage.getItem('user')
    if (user) {
        const { accessToken } = JSON.parse(user)
        if (verifyToken(accessToken)) {
            props.history.push('/home')
            window.location.reload()
        }
    }

    const onSubmit = (e: React.MouseEvent) => {
        e.preventDefault()
        if (userName === '') {
            setError('Error: insert user name')
        } else if (password === '') {
            setError('Error: insert password')
        } else {
            login({ userName, password })
                .then(res => {
                    console.log(res)
                    props.history.push('/home')
                    window.location.reload()
                })
                .catch(err => {
                    setError('Error: user does not exist')
                })
        }
    }

    return (
        <Card className="login-card">
            <Alert
                onClose={() => setError('')}
                dismissible={true}
                transition={true}
                style={{ top: 20, position: 'absolute', zIndex: 10 }}
                show={error !== ''} variant="danger"
            >
                {error}
            </Alert>
            <Form className="login-form">
                <h1>
                    <CgLogIn />
                </h1>
                <h1 style={{ marginBottom: '40px' }}>Login</h1>
                <Form.Group controlId="formBasicUserName">
                    <Form.Label>User name</Form.Label>
                    <Form.Control className="login-input" type="text" placeholder="Enter user name" onChange={e => setName(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control className="login-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={(event) => onSubmit(event)}>
                    Submit
                </Button>
            </Form>
        </Card>
    );
}

export default Login