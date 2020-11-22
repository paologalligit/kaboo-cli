import React, { useEffect, useState } from 'react'
import { useHistory, RouteComponentProps } from 'react-router-dom'
import qs from 'qs'
import Header from '../container/Header'
import Card from '../container/Card'
import { emit } from 'process'
import GameTimer from '../container/GameTimer'
import BottomCardButtons from '../container/BottomCardButtons'

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

const PlayRoom = ({ socket, router: { location: { search, state: { users, } }, match } }: Props) => {
    const history = useHistory()
    const [countDown, setCountDown] = useState(false)
    const [count, setCount] = useState(0)
    const [teamOnePoints, setTeamOnePoints] = useState(0)
    const [teamTwoPoints, setTeamTwoPoints] = useState(0)
    const emptyCard: CardResponse = { word: '', forbidden: [] }
    const [card, setCard] = useState(emptyCard)
    const [wordCounter, setWordCounter] = useState(2)
    const [role, setRole] = useState('-')

    const { roomId, user } = qs.parse(search.substr(1, search.length - 1))

    const team = users.filter((u: TeamMember) => u.name === user)[0].team

    //TODO: signal when a user logs out during a game

    useEffect(() => {
        socket.emit('joinRoom', { name: user, roomId: roomId, totPlayers: users.length, team })

        socket.on('startCountdown', ({ time }: CountTime) => {
            setWordCounter(2)
            setCountDown(true)
            setCount(time)
            startCountDown(time)
            socket.emit('setTurns', { roomId })
        })

        socket.on('roles', ({ role }: { role: string }) => {
            console.log('got new role: ', role)
            setRole(role)
            socket.emit('getWord', { requestingUser: user, roomId, team, seed: getSeed() })
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
            socket.emit('getWord', { requestingUser: user, roomId, seed: getSeed() })
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
            socket.emit('getRoles', { requestingUser: user, team, roomId })
            startWordCounter(wordCounter)
        }
    }

    const getUserLength = () => {
        return users.reduce((acc: number, curr: TeamMember) => acc + curr.name.length, 0)
    }

    const getWordsLength = (card: CardResponse) => {
        const wordSeed = card.word.length
        const forbiddenSeed = card.forbidden.reduce((acc: number, curr: string) => acc + curr.length, 0)

        const date = new Date()
        const hour = date.getHours()
        const day = date.getDay()

        return wordSeed + forbiddenSeed + hour + day
    }

    // TODO: change the seed generation function to something more complex
    const getSeed = () => {
        let seed
        setCard(prev => {
            if (prev.word) {
                seed = getWordsLength(prev)
            } else {
                seed = getUserLength()
            }

            return prev
        })
        return seed
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

    const getTeamOne = () => {
        return (
            users
                .filter((u: TeamMember) => u.team === 0)
                .map((u: TeamMember) => {
                    return <ul key={u.id} style={{ color: 'blue' }}>{u.name}</ul>
                })
        )
    }

    const getTeamTwo = () => {
        return (
            users
                .filter((u: TeamMember) => u.team === 1)
                .map((u: TeamMember) => {
                    return <ul key={u.id} style={{ color: 'red' }}>{u.name}</ul>
                })
        )
    }

    const onLeaveGameClick = () => {
        const leave = window.confirm('Do you really want to leave the game?')

        if (leave) {
            socket.disconnect()
            history.push('/home')
            window.location.reload()
        }
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

    }
    const onNewTurn = () => {
        socket.emit('newTurn', { roomId })
    }

    return (
        <div style={{backgroundColor: 'ivory'}}>
            <Header text="LEAVE GAME" logout={() => onLeaveGameClick()} />
            <div style={{ display: "flex", alignItems: 'center', justifyContent: 'space-around' }}>
                <div style={{ marginLeft: '5px' }}>
                    <p>PLAYER: {user}</p>
                    <div>TEAM 1: {teamOnePoints} pts.
                    {getTeamOne()}
                    </div>
                    <div>TEAM 2: {teamTwoPoints} pts.
                    {getTeamTwo()}
                    </div>
                    <div>
                        {countDown && <h1>{count}</h1>}
                    </div>
                </div>
                <div style={{  }}>
                    {card.word &&
                        <div>
                            <h1 style={{ color: getRoleColor(role) }}>{role}</h1>
                            <Card word={card.word} forbidden={card.forbidden} hide={role === 'Guesser'} />
                            <BottomCardButtons
                                onCorrect={() => onCorrectWord()}
                                onError={() => onErrorWord()}
                                onSkip={() => onSkipWord()}
                                onNewTurn={() => onNewTurn()}
                                disabled={wordCounter === 0}
                            />
                        </div>
                    }
                </div>
                <div style={{}}>
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