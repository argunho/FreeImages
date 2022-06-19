import React from 'react'

import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material'
import { KeyboardReturnTwoTone } from '@mui/icons-material'



export default function Heading({ title }) {
    const history = useHistory();

    return (
        <div className='heading'>
            <h4 className='heading-title'>{title}</h4>

            {/* Go back */}
            <Button
                variant="text"
                onClick={() => history.goBack()}
                title="Go back">
                <KeyboardReturnTwoTone />
            </Button>
        </div>
    )
}
