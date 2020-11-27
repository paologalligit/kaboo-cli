import { BrowserHistory } from 'history'
import React, { useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { login, register } from '../service/auth'

import './styles/Login.css'

interface Props {
    history: BrowserHistory
}

const Signup = ({ history }: Props) => {
    const [userName, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [error, setError] = useState('')

    const onSubmit = (e: React.MouseEvent) => {
        e.preventDefault()
        if (userName === '') {
            setError('Error: insert userName')
        }
        else if (password === '') {
            setError('Error: insert password')
        }
        else if (password !== confirmPass) {
            setError('Passwords must match')
        } else {
            register({ userName, password })
                .then(res => {
                    if (res.data.error) {
                        setError(res.data.errorMessage)
                    } else {
                        login({ userName, password })
                            .then(_ => {
                                history.push('/home')
                                window.location.reload()
                            })
                            .catch(err => console.log(err))
                    }
                })
        }
    }

    return (
        <Card className="login-card" style={{ borderColor: error === '' ? 'lightgrey' : 'red' }}>
            <Alert
                onClose={() => setError('')}
                dismissible={true}
                transition={true}
                style={{ top: 20, position: 'absolute', zIndex: 10 }}
                show={error !== ''} variant="danger"
            >
                {error}
            </Alert>
            <Form className="signup-form">
                <h1 className="logo-login-signup">
                    <AiOutlineUserAdd />
                </h1>
                <h1 style={{ marginBottom: '40px' }}>Signup</h1>
                <Form.Group controlId="formBasicUserName">
                    <Form.Label>User name</Form.Label>
                    <Form.Control className="signup-input" type="text" placeholder="Enter user name" onChange={e => setName(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control className="signup-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control className="signup-input" type="password" placeholder="Confirm password" onChange={e => setConfirmPass(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={(event) => onSubmit(event)}>
                    Submit
                </Button>
            </Form>
        </Card>
    )
}

export default Signup