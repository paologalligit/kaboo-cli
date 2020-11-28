import React, { useState, useEffect } from 'react'
import Header from '../container/Header'
import { FaCopy, FaRegUser } from "react-icons/fa"
import { IoPlay } from "react-icons/io5"

import config from '../env'
import { User } from '../Entity/User'
import RoomInfo from './RoomInfo'
import { Spinner, Button } from 'react-bootstrap'
import axios from 'axios'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import './styles/Room.css'

interface Props {
    socket: SocketIOClient.Socket,
    router: RouteComponentProps<Room>
}

interface Room {
    id: string
}

const Room = ({ socket, router: { match } }: Props) => {
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [isOwner, setIsOwner] = useState(false)

    const { id } = match.params
    const user: User = JSON.parse(localStorage.getItem('user') || '')

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL || config.API_URL}/room/owner/${id}`)
            .then(res => {
                if (res) {
                    setIsOwner(res.data.owner === user.userName)
                }
            })
            .catch(err => console.error(err))

        socket.emit('joinWaitingRoom', { name: user.userName, room: id })

        socket.on('startGame', (users: string) => {
            history.push(
                `/play?roomId=${id}&user=${user.userName}`,
                { users }
            )
            window.location.reload()
        })
    }, [])

    const logout = () => {
        socket.emit('leaveRoom', { user, roomId: id })
        history.push('/home')
        window.location.reload()
    }

    const onStartClick = () => {
        setLoading(true)
        axios.post(`${process.env.REACT_APP_API_URL || config.API_URL}/room/start`, {
            roomId: id
        })
            .then(res => {
                const { teamOne, teamTwo } = res.data
                setLoading(false)
                socket.emit('setTeams', { teamOne, teamTwo, roomId: id })
            })
            .catch(err => console.error(err))
    }

    return (
        <div>
            <Header logout={logout} text="EXIT ROOM" />
            <div className="waiting-room-body">
                <div className="waiting-room-header">
                    <p>THIS IS ROOM {id.toUpperCase()}</p>
                    <FaCopy style={{ height: '15px', marginLeft: '5px', cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(id)} />
                </div>

                <div>
                    <FaRegUser style={{ height: '50%', width: '100%' }} />
                    <p>PLAYER: {user.userName}</p>
                </div>

                <RoomInfo socketConnection={socket} userName={user.userName} />
                {loading && <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>}

                {isOwner && <Button variant="success" onClick={() => onStartClick()}> <IoPlay /> START</Button>}
            </div>
        </div>
    )
}

export default Room