import React from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'

interface Props {
    word: string;
    forbidden: Array<string>;
    hide: Boolean;
}

const TabooCard = ({ word, forbidden, hide }: Props) => {
    return (
        <Card style={{ width: '18rem', filter: false ? 'blur(5px)' : "none" }}>
            <Card.Img variant="top" style={{height: '25%', width: '25%'}} src="https://steamuserimages-a.akamaihd.net/ugc/82592462917695801/ACB6FEF56F26738B4975166F5A1473310B185BD8/" />
            <Card.Body>
                <Card.Title>{word}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                {forbidden.map(f => {
                    return (
                        <ListGroupItem key={f}>{f}</ListGroupItem>
                    )
                })}
            </ListGroup>
        </Card>
    )
}

export default TabooCard