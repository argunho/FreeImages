import React from 'react'
import { CircularProgress } from '@mui/material'

function Loading() {
    Loading.displayName = "Loading";

    return (
        <CircularProgress size={50} color='inherit'/>
    )
}
export default Loading;