import React from 'react'
import { Button } from '@mui/material'
import { KeyboardReturnTwoTone } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

function Heading({ title, button }) {
    const navigate = useNavigate();
    return (
        <div className='d-row jc-between heading'>
            <h4 className='heading-title'>{title}</h4>

            <div className='d-row'>
                {/*  Add new item */}
                {!!button && <Button
                    variant="text"
                    onClick={() => navigate(button.url)}
                    title={button.title}>
                    {button.icon}
                </Button>}

                {/* Go back */}
                <Button
                    variant="text"
                    onClick={() => navigate(-1)}
                    title="Go back">
                    <KeyboardReturnTwoTone />
                </Button>
            </div>

        </div>
    )
}

export default Heading;