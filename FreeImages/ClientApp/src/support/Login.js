import React, { useEffect, useState } from 'react'
import axios from "axios";
import { TextField, Button, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import jwt_decode from "jwt-decode";

// Css
import './../css/login.css';

const defaultHeight = window.innerHeight;

function Login() {

    const defaultForm = {
        email: "",
        password: "",
        remember: false
    }

    const { param } = useParams();

    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [loginLink, setLoginLink] = useState(false);
    const [response, setResponse] = useState(null);
    const [isVisiblePassword, setVisiblePassword] = useState(false);
    const [isReliable, setReliable] = useState(!!(localStorage.getItem("reliable")));

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!!token) {
            const decoded = jwt_decode(token);
            if ((decoded.exp * 1000) < Date.now()) {
                localStorage.removeItem("token");
            } else
                navigate("/sp/images");
        }

        document.title = "Free Images | Login"

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    window.addEventListener('resize', function () {
        let height = window.innerHeight;
        const header = document.getElementById("header");
        if (defaultHeight !== height) {
            document.body.style.height = (defaultHeight - height) + "px";
            if (header) header.style.position = "relative";
        } else if (defaultHeight >= height && header)
            header.removeAttribute("style");
    })

    // Form field change handler
    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: (e.target.type === "checkbox") ? e.target.checked : e.target.value })
    }

    const handleReliable = () => {
        if (!isReliable)
            localStorage.setItem("reliable", "true");
        else
            localStorage.removeItem("reliable");
        setReliable(!isReliable);
    }

    // Submit form
    const submitHandler = async e => {
        e.preventDefault();

        setLoading(true);
        const api = (param != null) ? axios.get("account/LoginWithoutPassword/" + param)
            : (loginLink) ? axios.get("account/LoginLink/" + form.email)
                : axios.post("account/login", form);

        await api.then(
            res => {
                let { token, errorMessage } = res.data;
                setLoading(false);
                setResponse(res.data);

                if (token) {
                    localStorage.setItem("token", token);
                    setAuthorized(true);
                    setTimeout(() => {
                        window.location.href = "/sp/images";
                    }, 2000)
                } else
                    console.error(errorMessage);
            }).catch(error => {
                setLoading(false);
                setResponse({
                    alert: "error",
                    message: "Something went wrong, please try later again ..."
                })
                console.error("Error => " + error)
            })
    }

    return (
        <div className={"login-container d-column"}>

            <h3 className="login-heading">
                {!authorized && (loginLink ? "Send login link" : "Login")}
                {authorized && <p>Welcome {response?.user}</p>}
            </h3>

            {!authorized && <form onSubmit={submitHandler}>
                <TextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />

                {!loginLink && <div>
                    <TextField
                        label="Password"
                        name="password"
                        type={(isVisiblePassword) ? "text" : "password"}
                        variant="outlined"
                        placeholder="Your password here ..."
                        value={form.password}
                        onChange={changeHandler} />

                    <div className='d-column ai-start'>
                        <FormControlLabel className='input-checkbox' control={
                            <Checkbox color="default"
                                checked={form.remember} onChange={changeHandler} name="remember" />
                        } label="Remember me" />

                        <FormControlLabel className='input-checkbox' control={
                            <Checkbox color="default"
                                checked={isVisiblePassword} onClick={() => setVisiblePassword(!isVisiblePassword)} />
                        } label="Show password" />

                        <FormControlLabel className='input-checkbox' control={
                            <Checkbox color="default"
                                checked={isReliable} onClick={handleReliable} />
                        } label="Show login button" />
                    </div>
                </div>}

                <div className="buttons-wrapper d-row jc-end">
                    <Button variant="outlined" color="inherit" className="submit-btn" disabled={loading} type="submit">Send</Button>
                </div>
            </form>}

            {!authorized && <p className="switch-link" onClick={() => setLoginLink(!loginLink)}>
                {loginLink ? "Login" : "Forgot password?"}
            </p>}

            {/* Loading */}
            {loading && <div className="curtain-center"><CircularProgress /></div>}
        </div>
    )
}

export default Login;