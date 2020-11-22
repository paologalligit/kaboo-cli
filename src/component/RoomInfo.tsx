import React, { useEffect, useState } from 'react'

interface Props {
    userName: string,
    socketConnection: SocketIOClient.Socket
}

const RoomInfo = ({ socketConnection, userName }: Props) => {
    const emptyUsers: Array<string> = []
    const [users, setUsers] = useState(emptyUsers)

    useEffect(() => {
        socketConnection.on('roomUsers', (users: Array<string>) => {
            console.log('users: ', users)
            setUsers(users.filter(name => name !== userName))
        })
    }, [])

    return (
        <div>
            OTHER PLAYERS:
            {users.map(user => {
                return <ul key={user}>{user}</ul>
            })}
        </div>
    )
}

export default RoomInfo