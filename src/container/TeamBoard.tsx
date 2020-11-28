import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'

import { getRandomColor } from '../utils/user'
import './css/TeamBoard.css'

interface Props {
    users: Array<TeamMember>;
    teamOnePoints: Number;
    teamTwoPoints: Number;
}


interface TeamMember {
    id: string;
    name: string;
    team: Number;
}

const TeamBoard = ({ users, teamOnePoints, teamTwoPoints }: Props) => {
    const getTeam = (teamId: Number) => {
        return (
            users
                .filter((u: TeamMember) => u.team === teamId)
                .map((u: TeamMember) => {
                    const avatarUrl = `https://avatar.oxro.io/avatar.svg?name=${u.name.toUpperCase()}&background=${getRandomColor()}&caps=3`
                    return (
                        <ListGroup.Item className="team-player-board">
                            <img
                                style={{ maxWidth: '20%', borderRadius: '50%', float: 'left' }}
                                src={avatarUrl}
                            />
                            <p style={{ float: 'right' }}>{u.name}</p>
                        </ListGroup.Item>
                    )
                })
        )
    }

    return (
        <div className="team-board-component">
            <Card style={{ maxWidth: '35vh' }}>
                <Card.Header>Team ONE -- {teamOnePoints} points</Card.Header>
                <ListGroup variant="flush">
                    {getTeam(0)}
                </ListGroup>
            </Card>

            <Card style={{ width: '35vh' }}>
                <Card.Header>Team TWO -- {teamTwoPoints} points</Card.Header>
                <ListGroup variant="flush">
                    {getTeam(1)}
                </ListGroup>
            </Card>
        </div>
    )
}

export default TeamBoard