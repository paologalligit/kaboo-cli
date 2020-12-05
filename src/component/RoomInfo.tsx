import Peer from 'peerjs'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'

interface Props {
    userName: string;
    socketConnection: SocketIOClient.Socket;
    roomId: string;
    userId: string;
    myPeer: Peer;
}

interface UsersVideo {
    name: string;
    peerId: string;
}

const RoomInfo = ({ socketConnection, userName, roomId, userId, myPeer }: Props) => {
    const emptyUsers: Array<string> = []
    const [users, setUsers] = useState(emptyUsers)

    let videoGrid = document.getElementById('video-grid')

    const addVideoStream = (video: HTMLVideoElement, stream: MediaStream) => {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        console.log('adding video screen')
        while (!videoGrid)
            videoGrid = document.getElementById('video-grid')
        videoGrid!.append(video)
    }

    const connectToNewUser = (userId: string, stream: MediaStream, myPeer: Peer, peers: any) => {
        console.log('connecting ', userId)
        const call = myPeer.call(userId, stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })

        peers[userId] = call
    }


    useEffect(() => {
        const peers = {}

        // socketConnection.on('roomUsers', (users: Array<string>) => {
        //     console.log('users: ', users)
        //     setUsers(users.filter(name => name !== userName))
        // })

        const myVideo = document.createElement('video')
        myVideo.muted = true

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            addVideoStream(myVideo, stream)

            myPeer.on('call', call => {
                call.answer(stream)
                const video = document.createElement('video')
                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                })
            })

            socketConnection.on('roomUsers', (users: Array<UsersVideo>) => {
                console.log('the fucking users: ', users)
                setUsers(
                    users
                        .filter(u => u.name !== userName)
                        .map(u => u.name)
                )
                users.forEach(u => {
                    connectToNewUser(u.peerId, stream, myPeer, peers)
                })
            })

            // socketConnection.on('user-connected', (userId: string) => {
            //     connectToNewUser(userId, stream, myPeer, peers)
            // })
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

    console.log('the users: ', users)
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