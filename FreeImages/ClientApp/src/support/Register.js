import React from 'react'

// Components
import Form from '../components/Form';
import Heading from '../components/Heading';


function Register() {

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

export default Register;