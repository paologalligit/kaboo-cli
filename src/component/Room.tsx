import React, { useState, useEffect } from 'react'
import Header from '../container/Header'
import { FaCopy } from "react-icons/fa";

import config from '../env'
import { User } from '../Entity/User'
import RoomInfo from './RoomInfo'
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import { RouteComponentProps, useHistory } from 'react-router-dom'

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
        axios.get(`${config.API_URL}/room/owner/${id}`)
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
        history.push('/home')
        window.location.reload()
    }

    const onStartClick = () => {
        setLoading(true)
        axios.post(`${config.API_URL}/room/start`, {
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
            {loading && <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>}

            <p>THIS IS ROOM {id.toUpperCase()}</p>
            <FaCopy style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(id)} />

            <p>PLAYER: {user.userName}</p>

            <RoomInfo socketConnection={socket} userName={user.userName} />

            {isOwner && <button onClick={() => onStartClick()}>START</button>}
        </div>
    )
}

export default Room