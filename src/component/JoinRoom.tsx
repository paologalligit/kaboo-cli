import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios'

import config from '../env'
import { useHistory } from 'react-router-dom'

import './styles/Buttons.css'

const JoinRoom = () => {
    const history = useHistory()

    const [show, setShow] = useState(false)
    const [code, setCode] = useState('')

    const onJoinClick = () => {
        axios.get( `${config.API_URL}/room/${code}`)
            .then(res => {
                history.push(`/room/${code}`)
                window.location.reload()
            })
            .catch(err => {
                console.error(err)
                alert(`Room ${code} does not exist`)
            })
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
                JOIN ROOM
            </Button>
            {show &&
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Join an existing room</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <label>Insert code: </label>
                            <input onChange={e => setCode(e.target.value)} />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShow(false)}>Close</Button>
                        <Button variant="primary" onClick={() => onJoinClick()} disabled={code === ''}>Join Room</Button>
                    </Modal.Footer>
                </Modal>
            }

        </>
    )
}

export default JoinRoom