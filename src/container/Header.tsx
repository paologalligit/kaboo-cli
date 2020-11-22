import React from 'react'
import { Nav } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

import '../component/styles/Buttons.css'

interface Props {
    logout: () => void,
    text: string
}

const Header = ({ logout, text }: Props) => {
    return (
        <>
            <Nav className="justify-content-end" activeKey="/home" style={{ marginTop: '10px', marginRight: '10px' }}>
                <Nav.Item>
                    <Button
                        className="button-logout"
                        onClick={() => logout()}
                    >
                        {text}
                    </Button>
                </Nav.Item>
            </Nav>
        </>
    )
}

export default Header