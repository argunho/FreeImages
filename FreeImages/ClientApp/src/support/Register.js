import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

// Installed
import axios from 'axios';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Check, Close } from '@mui/icons-material';

// Components
import Form from '../components/Form';
import Heading from '../components/Heading';
import Loading from '../components/Loading';
import HeaderConfig from '../functions/HeaderConfig';


function Register() {

    const [roles, setRoles] = useState([])
    const [modal, setModal] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState(null);
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        // localStorage.removeItem("token");
        if (!!token)
            setLoading(false);
        else {
            (async () => {
                await axios.get("user/count").then(res => {
                    if (res.data === 0) {
                        setModal(true);
                        setLoading(false);
                    } else
                        navigate(-1);
                });
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleRoles = (e) => {
        const role = e.target.name;
        const rolesList = [...roles];
        const index = rolesList.indexOf(role);
        if (index > -1)
            rolesList.splice(index, 1);
        else
            rolesList.push(role);

        setRoles(rolesList)
    }

    const verifyPassword = () => {
        var date = new Date();
        var currentDate = (date.toISOString()).slice(0, 10);
        if (password === `BismiLLAHI! ${currentDate}`) {
            setModal(false);
            setError(false);
        } else
            setError(true);
    }

    const submitForm = async (data) => {
        let formData = data;
        formData.roles = roles;
        await axios.post("account/register", formData, HeaderConfig)
            .then(res => {
                if (!!res.data?.token) {
                    localStorage.setItem("token", res.data.token);
                    navigate("/sp/images");
                } else
                setResponse(res.data)
            }, error => {
                setResponse(error);
            });
    }

    if (loading)
        return <Loading />;

    return (
        <div className='wrapper'>
            <Heading title="Form" />
            {!modal && <Form
                heading="Register"
                inputs={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                }}
                confirmInputs={["password", "confirmPassword"]}
                response={response}
                onSUbmit={submitForm}>
                {!!token && <div className='d-column ai-start'>
                    {["Admin", "Support"].map((role, i) => {
                        return <FormControlLabel key={i} className='input-checkbox' control={
                            <Checkbox color="default" onClick={handleRoles} name={role} />
                        } label={role} />
                    })}
                </div>}
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