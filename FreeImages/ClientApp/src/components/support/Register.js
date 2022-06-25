import React from 'react'
import Form from './blocks/Form';
import Heading from './blocks/Heading'

export default function Register() {

    return (
        <div className='wrapper'>
            <Heading title="Form" />

            <Form formInputs={["name", "email", "password", "confirmPassword"]}
                form={{ name: "", email: "", password: "", confirmPassword: "" }}
                api="account/register"
                heading="Register"
                confirmInputs={["password", "confirmPassword"]} />
        </div>
    )
}
