import React, { useEffect, useState } from 'react'
import axios from "axios";
import { TextField, Button, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { useHistory } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const defaultHeight = window.innerHeight;

export default function Login(props) {

    const defaultForm = {
        email: "",
        password: "",
        remember: false
    }
    const param = props?.match?.params?.id || null
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginLink, setLoginLink] = useState(false);
    const [response, setResponse] = useState(null);
    const [visible, setVisible] = useState(false);
    const [reliable, setReliable] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const history = useHistory();

    useEffect(() => {
        if (token !== null && token !== undefined) {
            const decoded = jwt_decode(token);
            if ((decoded.exp * 1000) < Date.now()) {
                localStorage.removeItem("token");
                setToken(null);
            } else
                history.push("/support/images");
        }

        document.title = "HK | Login"
        setTimeout(() => {
            setReliable(localStorage.getItem("reliable") === "true");
            if (param !== null)
                submitHandler(null);
        }, 100)
    }, [])

    useEffect(() => {
        if (reliable)
            localStorage.setItem("reliable", "true");
        else
            localStorage.removeItem("reliable");
    }, [reliable])

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

    // Login form
    const loginForm = () => {
        return (
            <>
                <h3 className="login-heading">
                    {(loginLink) ? "Send login link" : "Login"}
                </h3>
                <br />
                <form onSubmit={submitHandler}>
                    <TextField label="Email" name="email" type="text" variant="outlined" value={form.email} onChange={changeHandler} />
                    {(!loginLink) ?
                        <>
                            <TextField
                                label="Password"
                                name="password"
                                type={(visible) ? "text" : "password"}
                                variant="outlined"
                                placeholder="At least 6 characters ..."
                                value={form.password}
                                onChange={changeHandler} />

                            <FormControlLabel className='login-checkbox' control={
                                <Checkbox color="default"
                                    checked={form.remember} onChange={changeHandler} name="remember" />
                            } label="Remember me" />
                            <FormControlLabel className='login-checkbox' control={
                                <Checkbox color="default"
                                    checked={visible} onChange={() => setVisible(!visible)} />
                            } label="Show password" />
                            <FormControlLabel className='login-checkbox' control={
                                <Checkbox color="default" 
                                    checked={reliable} onChange={() => setReliable(!reliable)} />
                            } label="Show login button" />
                        </>
                        : null
                    }
                    <div className="buttons-wrapper">
                        <Button variant="outlined" color="inherit" className="submit-btn" disabled={loading} type="submit">Send</Button>
                    </div>
                </form>
                <p className="switch-link" onClick={() => setLoginLink(!loginLink)}>
                    {(loginLink) ? "Login" : "Forgot password?"}
                </p>
            </>
        )
    }

    const submitForm = (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        if(props.register)
    }

    // Submit form
    const submitLogin = () => {
        const api = (param != null) ? axios.get("account/LoginWithoutPassword/" + param)
            : (loginLink) ? axios.get("account/LoginLink/" + form.email)
                : axios.post("account/login", form);

        api.then(
            res => {
                let { token, errorMessage } = res.data;
                setLoading(false);
                setResponse(res.data);

                if (token) {
                    localStorage.setItem("token", token);
                    setLoggedIn(true);
                    setTimeout(() => {
                        history.push("/support/images")
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

    // Submit register
    const submitRegister = () => {

    }


    // Reset response
    const reset = (res) => {
        setResponse(null);
        setForm(defaultForm);
    }

    return (
        <div className={"login-form" + ((loggedIn) ? " " + response?.alert : "")}
            onClick={() => reset()}>

            {(loggedIn) ? ("Welcome " + response.user) : loginForm()}

            {/* Loading */}
            {(loading) ?
                <div className="curtain-center"><CircularProgress /></div>
                : null}
        </div>
    )
}
