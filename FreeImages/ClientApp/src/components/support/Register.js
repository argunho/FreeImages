import React from 'react'
import Login from '../public/Login'
import Heading from './blocks/Heading'

export default function Register() {
    return (
        <div className='wrapper'>
            <Heading title="Register" />

            <Login api="register" />
        </div>
    )
}
