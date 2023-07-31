import React, { useEffect } from 'react'

// Components
import Form from '../components/Form';
import Heading from '../components/Heading';
import { Button, Checkbox, FormControlLabel, Modal, TextField } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Check } from '@mui/icons-material';


function Register() {

    const [roles, setRoles] = useState(["Support"])
    const [modal, setModal] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            (async () => {
                const usersCount = await axios.get("user/count");
                console.log(usersCount)
                if (usersCount === 0)
                    setModal(true);
                else
                    navigate(-1);
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleRoles = (e) => {
        const role = e.target.name;
        let rolesList = [...roles];
        if (roles.indexOf(role) > -1)
            rolesList.splice(rolesList.indexOf(role), -1);
        else
            rolesList.push(role);

        setRoles(rolesList)
    }

    const verifyPassword = () => {
        if (password === "BismiLLAHI!") {
            setModal(false);
            setError(false);
        } else
            setError(true);
    }

    if (modal)
        return (<Modal>
            <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                helperText={!!error ? "Incorrect password" : ""}
            />
            <Button onClick={verifyPassword} disabled={password.length === 0}>
                <Check />
            </Button>
        </Modal>)

    return (
        <div className='wrapper'>
            <Heading title="Form" />
            <Form
                heading="Register"
                api="account/register"
                inputs={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                }}
                confirmInputs={["password", "confirmPassword"]}
                roles={roles}>
                <div className='d-column ai-start'>
                    {["Admin", "Support"].map((r, i) => {
                        return <FormControlLabel key={i} className='input-checkbox' control={
                            <Checkbox color="default" onClick={handleRoles} name={r} />
                        } label={r} />
                    })}
                </div>
            </Form>
        </div>
    )
}

export default Register;