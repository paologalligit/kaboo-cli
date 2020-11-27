import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'

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

    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return (
        <div style={{ width: '50%' }}>
            <Table striped hover variant="dark" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Player Name</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        const avatarUrl = `https://avatar.oxro.io/avatar.svg?name=${user.toUpperCase()}&background=${getRandomColor()}&caps=3`
                        return (
                            <tr key={user}>
                                <td>
                                    <img
                                        style={{ height: '10%', borderRadius: '50%' }}
                                        src={avatarUrl}
                                    />
                                </td>
                                <td>{user.toUpperCase()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div >
    )
}

export default RoomInfo