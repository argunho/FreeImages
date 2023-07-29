import React from 'react'
import { Button } from '@mui/material'
import { KeyboardReturnTwoTone } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

function Heading({ title }) {
    const navigate = useNavigate();
    return (
        <div className='d-row jc-between heading'>
            <h4 className='heading-title'>{title}</h4>

            {/* Go back */}
            <Button
                variant="text"
                onClick={() => navigate(-1)}
                title="Go back">
                <KeyboardReturnTwoTone />
            </Button>
        </div>
    )
}

export default Heading;