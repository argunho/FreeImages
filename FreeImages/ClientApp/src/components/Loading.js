import React from 'react'
import { CircularProgress } from '@mui/material'

function Loading({children}) {
    Loading.displayName = "Loading";

    return (
        <div className='loading-container d-column'>
            <CircularProgress size={50} color='inherit'/>
            {!!children && children}
        </div>
    )
}
export default Loading;