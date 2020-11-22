import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Form } from 'react-bootstrap'

import { login, verifyToken } from '../service/auth'
import { BrowserHistory } from 'history'

interface Props {
    history: BrowserHistory
}

const Login = (props: Props) => {
    const [userName, setName] = useState('')
    const [password, setPassword] = useState('')

    const user = localStorage.getItem('user')
    if (user) {
        const { accessToken } = JSON.parse(user)
        if (verifyToken(accessToken)) {
            props.history.push('/home')
            window.location.reload()
        }
    }

    const onSubmit = () => {
        login({ userName, password })
            .then(res => {
                props.history.push('/home')
                window.location.reload()
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <Form>
                <Form.Group controlId="formBasicUserName">
                    <Form.Label>User name</Form.Label>
                    <Form.Control type="text" placeholder="Enter user name" onChange={e => setName(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" onClick={() => onSubmit()}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default Login