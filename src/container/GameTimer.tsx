import React from 'react'

interface Props {
    startTime: number;
    onExpiredTime: () => void;
}

const GameTimer = ({ startTime, onExpiredTime }: Props) => {

    const getTimerColor = (time: number): string => {
        if (time > 20) return 'blue'
        if (time > 10) return 'orange'
        if (time === 0) return 'black'
        return 'red'
    }

    return (
        <div style={{}}>
            <h1>TIMER</h1><br></br>

            <h1 style={{ color: getTimerColor(startTime)}}>{startTime}</h1>
        </div>
    )
}

export default GameTimer