import React, { useEffect, useState } from 'react'
import { useHistory, RouteComponentProps } from 'react-router-dom'
import qs from 'qs'
import Header from '../container/Header'
import Card from '../container/Card'
import GameTimer from '../container/GameTimer'
import BottomCardButtons from '../container/BottomCardButtons'
import './styles/PlayRoom.css'
import { RiUserVoiceLine } from "react-icons/ri"
import { BsQuestionCircleFill } from 'react-icons/bs'
import { GiPoliceOfficerHead } from 'react-icons/gi'
import TeamBoard from '../container/TeamBoard'

interface Props {
    socket: SocketIOClient.Socket;
    router: RouteComponentProps<Room>;
}

interface TeamMember {
    id: string;
    name: string;
    team: Number;
}

interface Room {
    id: string;
}

interface CountTime {
    time: number;
}

interface CardResponse {
    word: string;
    forbidden: Array<string>;
}

interface PointUpdate {
    team: number;
    point: number;
}

interface UserLeftResponse {
    user: string;
    users: Array<TeamMember>;
}

const PlayRoom = ({ socket, router: { location: { search, state: { users, } }, match } }: Props) => {
    const history = useHistory()
    const [countDown, setCountDown] = useState(false)
    const [count, setCount] = useState(0)
    const [teamOnePoints, setTeamOnePoints] = useState(0)
    const [teamTwoPoints, setTeamTwoPoints] = useState(0)
    const emptyCard: CardResponse = { word: '', forbidden: [] }
    const [card, setCard] = useState(emptyCard)
    const [wordCounter, setWordCounter] = useState(0)
    const [role, setRole] = useState('-')
    const [turnUsers, setTurnUsers] = useState(users)
    const [skipCounter, setSkipCounter] = useState(2)

    const { roomId, user } = qs.parse(search.substr(1, search.length - 1))

    const team = turnUsers.filter((u: TeamMember) => u.name === user)[0].team

    //TODO: signal when a user logs out during a game

    useEffect(() => {
        socket.emit('joinRoom', { name: user, roomId: roomId, totPlayers: users.length, team })

        socket.on('startCountdown', ({ time }: CountTime) => {
            setCountDown(true)
            setCount(time)
            startCountDown(time)
            socket.emit('setTurns', { roomId })
            socket.emit('getRoles', { requestingUser: user, team, roomId })
        })

        socket.on('roles', ({ role }: { role: string }) => {
            setRole(role)
            socket.emit('getWord', { requestingUser: user, roomId, team, seed: 0, role })
        })

        socket.on('word', ({ word, forbidden }: CardResponse) => {
            setCard({ word, forbidden })
        })

        socket.on('point', ({ team, point }: PointUpdate) => {
            if (team === 0) {
                setTeamOnePoints(prev => {
                    if (prev > 0 || point > 0)
                        return prev + point
                    return prev
                })
            } else {
                setTeamTwoPoints(prev => {
                    if (prev > 0 || point > 0)
                        return prev + point
                    return prev
                })
            }
        })

        socket.on('ask4word', () => {
            let role
            setRole(prev => {
                role = prev
                return prev
            })
            socket.emit('getWord', { requestingUser: user, roomId, team, seed: 0, role })
        })

        socket.on('userLeft', ({ user, users }: UserLeftResponse) => {
            alert(`${user} left the game :(`)
            setTurnUsers(users)
        })
    }, [])

    const startCountDown = (time: number) => {
        if (time >= 0) {
            setTimeout(() => {
                setCount(time)
                startCountDown(time - 1)
            }, 1000)
        } else {
            setCountDown(false)
            setSkipCounter(2)
            startWordCounter(70)
        }
    }

    const startWordCounter = (time: number) => {
        if (time > 0) {
            setTimeout(() => {
                time--
                setWordCounter(time)
                startWordCounter(time)
            }, 1000)
        }
    }

    const onLeaveGameClick = () => {
        const leave = window.confirm('Do you really want to leave the game?')

        if (leave) {
            socket.emit('leaveGame', { roomId, user })
            if (roomId) {
                const roomIdArray = roomId.toString().split('_')
                history.push(`/room/${roomIdArray[0]}`)
                window.location.reload()
            }
        }
    }

    const getPlayerHeader = (role: string) => {
        const color = getRoleColor(role)
        const icon = getRoleIcon(role, color)
        return (
            <div className="middle-card-header" >
                {icon}
                <h1 style={{ color: color }}>{role}</h1>
            </div>
        )
    }

    const getRoleIcon = (role: string, color: string) => {
        if (role === 'Guesser') return <BsQuestionCircleFill size={40} color={color} />
        if (role === 'Speaker') return <RiUserVoiceLine size={40} color={color} />

        return <GiPoliceOfficerHead size={40} color={color} />
    }

    // TODO: move this component outside in container?
    const getRoleColor = (role: string): string => {
        if (role === 'Guesser') return 'BLUE'
        if (role === 'Speaker') return 'ORANGE'

        return 'RED'
    }

    const onCorrectWord = () => {
        socket.emit('point', { team, roomId, point: 1 })
        // socket.emit('getWord', { roomId, seed: getSeed() })
        socket.emit('ask4word', { roomId })
    }
    const onErrorWord = () => {
        socket.emit('point', { team, roomId, point: -1 })
        socket.emit('ask4word', { roomId })
        // socket.emit('getWord', { roomId, seed: getSeed() })
    }
    const onSkipWord = () => {
        if (skipCounter > 0) {
            setSkipCounter(prev => prev - 1)
            socket.emit('ask4word', {roomId})
        }
    }
    const onNewTurn = () => {
        socket.emit('newTurn', { roomId })
    }

    return (
        <div className="play-room-component">
            <Header text="LEAVE GAME" logout={() => onLeaveGameClick()} />
            <div className="play-room-body" >
                <div >
                    <TeamBoard
                        users={turnUsers}
                        teamOnePoints={teamOnePoints}
                        teamTwoPoints={teamTwoPoints}
                    />
                    <div>
                        {countDown && <h1>{count}</h1>}
                    </div>
                </div>
                <div>
                    {card.word &&
                        <div className="play-room-middle">
                            {getPlayerHeader(role)}
                            {count === 0 &&
                                <Card word={card.word} forbidden={card.forbidden} hide={role === 'Guesser'} />
                            }
                            <BottomCardButtons
                                onCorrect={() => onCorrectWord()}
                                onError={() => onErrorWord()}
                                onSkip={() => onSkipWord()}
                                skipCounter={skipCounter}
                                onNewTurn={() => onNewTurn()}
                                newButtonDisabled={wordCounter === 0}
                                pointButtonsDisabled={role !== 'Speaker' || wordCounter === 0}
                            />
                        </div>
                    }
                </div>
                <div >
                    <GameTimer
                        startTime={wordCounter}
                        onExpiredTime={() => { }}
                    />
                </div>
            </div>
        </div>
    )
}

export default PlayRoom