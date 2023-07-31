import React, { useEffect, useState } from 'react'
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Installed
import axios from 'axios';
import { Check, Close } from '@mui/icons-material';

// Components
import Form from '../components/Form';
import Heading from '../components/Heading';
import Loading from '../components/Loading';


function Register() {

    const [roles, setRoles] = useState([])
    const [modal, setModal] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        // localStorage.removeItem("token")

        if (!!token)
            setLoading(false);
        else {
            (async () => {
                await axios.get("user/count").then(res => {
                    if (res.data === 0) {
                        setModal(true);
                        setLoading(false);
                        setRoles(["Admin, Support"]);
                    } else
                        navigate(-1);
                });
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
        var date = new Date();
        var currentDate = (date.toISOString()).slice(0, 10);
        if (password === `${currentDate} BismiLLAHI!`) {
            setModal(false);
            setError(false);
        } else
            setError(true);
    }

    if (loading)
        return <Loading />;

    return (
        <div className='wrapper'>
            <Heading title="Form" />
            {!modal && <Form
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
                            <Checkbox color="default" onClick={handleRoles} name={r} checked={!token} disabled={!token}/>
                        } label={r} />
                    })}
                </div>
            </Form>}

            {!!modal && <div className='modal-container d-column'>
                <div className='modal d-column'>
                    <TextField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={error}
                        helperText={!!error ? "Incorrect password" : ""}
                    />
                    <div className='buttons-wrapper d-row jc-end'>
                        <Button onClick={() => navigate(-1)}>
                            <Close color="error" />
                        </Button>
                        <Button onClick={verifyPassword} disabled={password.length === 0}>
                            <Check />
                        </Button>
                    </div>
                </div>
            </div>}
        </div >
    )
}

export default Register;