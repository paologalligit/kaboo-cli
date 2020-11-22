import React, { useState } from 'react'
import { Button, Modal, Row, Col, Container, Spinner } from 'react-bootstrap'
import axios from 'axios'

import config from '../env'
import { useHistory } from 'react-router-dom'
import { User } from '../Entity/User'

import './styles/Buttons.css'

const CreateNewRoom = () => {
    const history = useHistory()

    const [show, setShow] = useState(false)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const user: User = JSON.parse(localStorage.getItem('user') || '')

    const onCreateRoom = () => {
        setLoading(true)
        axios.post(`${process.env.REACT_APP_API_URL}/room` || `${config.API_URL}/room`, { name, owner: user.userName })
            .then(res => {
                const { id } = res.data.room
                history.push(`/room/${id}`)
                window.location.reload()
            })
            .catch(err => console.error(err))
    }

    const handleClose = () => {
        setShow(prev => !prev)
    }

    return (
        <>
            <Button
                className="button-room"
                onClick={() => setShow(prevShow => !prevShow)}
            >
                CREATE NEW ROOM
            </Button>
            {loading && <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>}
            {/* {show &&
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Create new Room
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid">
                        <Container>
                            <Row>
                                <Col xs={12} md={8}>
                                    <label>Name:</label>
                                    <input placeholder="Room name" onChange={e => setName(e.target.value)}></input>
                                </Col>
                                <Col xs={6} md={4}>
                                    Other stuff...
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShow(prevShow => !prevShow)} >Close</Button>
                        <Button variant="success" onClick={() => onCreateRoom()} disabled={name === ''} >Create</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            } */}
            {show &&
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Create new Room
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="show-grid">
                        <Container>
                            <Row>
                                <Col xs={12} md={8}>
                                    <label>Name:</label>
                                    <input placeholder="Room name" onChange={e => setName(e.target.value)}></input>
                                </Col>
                                <Col xs={6} md={4}>
                                    Other stuff...
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShow(prevShow => !prevShow)} >Close</Button>
                        <Button variant="success" onClick={() => onCreateRoom()} disabled={name === ''} >Create</Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    )
}

export default CreateNewRoom