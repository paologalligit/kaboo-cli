import React from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'

import './css/Card.css'

interface Props {
    word: string;
    forbidden: Array<string>;
    hide: Boolean;
}

const TabooCard = ({ word, forbidden, hide }: Props) => {
    return (
        <Card className="card-container" style={{ filter: hide ? 'blur(5px)' : "none" }}>
            <Card.Img variant="top" style={{ height: '25%', width: '25%' }} src="https://steamuserimages-a.akamaihd.net/ugc/82592462917695801/ACB6FEF56F26738B4975166F5A1473310B185BD8/" />
            <Card.Body>
                <Card.Title style={{ fontWeight: 'bold', fontSize: 30 }}>{word}</Card.Title>
            </Card.Body>
            <ListGroup className="card-list">
                {forbidden.map((f, key) => {
                    return (
                        <ListGroupItem className="card-list-item" key={key}>{f}</ListGroupItem>
                    )
                })}
            </ListGroup>
        </Card>
    )
}

export default TabooCard