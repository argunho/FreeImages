

import { useEffect, useState } from "react";

// Installed
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Components
import Loading from "../components/Loading";
import UserForm from "../components/UserForm";
import { Button, TextField } from "@mui/material";
import { Check, Close } from "@mui/icons-material";

function Register(){

    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
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

    
    const verifyPassword = () => {
        var date = new Date();
        var currentDate = (date.toISOString()).slice(0, 10);
        if (password === `BismiLLAHI! ${currentDate}`) {
            setModal(false);
            setError(false);
        } else
            setError(true);
    }

    if (loading)
        return <Loading />;
    else if(modal)
        return <div className='modal-container d-column'>
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
        </div>;

    return <UserForm inputs={{
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      }} api="account/register" heading="Register" confirmInputs={["password", "confirmPassword"]} />;
}

export default Register;