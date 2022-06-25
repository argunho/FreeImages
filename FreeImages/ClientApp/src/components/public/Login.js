import React, { useEffect, useState } from 'react'
import axios from "axios";
import { TextField, Button, Checkbox, FormControlLabel, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Redirect, useHistory } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import jwt_decode from "jwt-decode";

const WhiteCheckbox = withStyles({
    root: {
        color: "#FFF",
        '&$checked': {
            color: "#FFF",
        },
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

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
    const [hash, setHash] = useState(null);
    const [loginLink, setLoginLink] = useState(false);
    const [response, setResponse] = useState(null);
    const [visible, setVisible] = useState(false);
    const [reliable, setReliable] = useState(false);
    const [auth, setAuth] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const history = useHistory();

    useEffect(() => {
        if (token !== null && token !== undefined) {
            const decoded = jwt_decode(token);
            if ((decoded.exp * 1000) < Date.now()) {
                localStorage.removeItem("token");
                setToken(null);
            } else
                history.push("/");
        }

        document.title = "HK | Login"
        setTimeout(() => {
            setReliable(localStorage.getItem("reliable") === "true");
            if (param !== null)
                this.submitHandler(null);
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
                <form onSubmit={this.submitHandler}>
                    <TextField label="Email" name="email" type="text" variant="outlined" value={email} onChange={changeHandler} />
                    {(!loginLink) ?
                        <>
                            <TextField label="Password" name="password" type={(visible) ? "text" : "password"} variant="outlined" placeholder="At least 6 characters ..." onChange={this.changeHandler} value={password} />
                            <FormControlLabel control={
                                <WhiteCheckbox
                                    checked={remember} onChange={changeHandler} name="remember" />
                            } label="Remember me" />
                            <FormControlLabel control={
                                <WhiteCheckbox
                                    checked={visible} onChange={() => setVisible(!visible)} />
                            } label="Show password" />
                            <FormControlLabel control={
                                <WhiteCheckbox
                                    checked={reliable} onChange={() => setReliable(!reliable)} />
                            } label="Show login button" />
                        </>
                        : null
                    }
                    <div className="buttons-wrapper">
                        <Button variant="outlined" className="submit-btn" type="submit">Send</Button>
                    </div>
                </form>
                <p className="switch-link" onClick={() => setLoginLink(!loginLink)}>
                    {(loginLink) ? "Login" : "Forgot password?"}
                </p>
            </>
        )
    }

    // Submit form
    const submitHandler = e => {
        if (e) e.preventDefault();

        setLoading(true);

        const api = (param != null) ? axios.get("account/LoginWithoutPassword/" + param)
            : (loginLink) ? axios.get("account/LoginLink/" + email)
                : axios.post("account/login", obj);

        api.then(
            res => {
                let { token, errorMessage } = res.data;
                setLoading(false);
                setResponse(res.data);

                if (token){
                    localStorage.setItem("token", token);
                    setTimeout(() => {
                        history.push("/support/images")
                    }, 2000)
                } else if (error) 
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

    )
}





// Response message
response(res) {
    if (!res) return null;

    const { response, message } = this.state;
    return (
        <div className={"slide-in-bottom response-alert" + response}>
            {ReactHtmlParser(message)}
        </div>
    )
}

// Reset response
reset = (res) => {
    if (!res) return;
    this.setState({
        res: false,
        response: "",
        message: null,
        loginLink: false
    })
}

render() {
    const { auth, loggedIn, redirect, loading, res, response, user } = this.state;
    if (auth) {
        return <Redirect to={redirect} />
    } else {
        return (
            <div className={"login-form" + ((loggedIn) ? " authentication-block" : "") + response}
                onClick={() => this.reset(res)}>

                {(loggedIn) ? ("Välkommen " + user) : this.loginForm()}

                {/* Loading */}
                {(loading) ?
                    <div className="block-loading-login"><CircularProgress /></div>
                    : null}

                {this.response(res)}
            </div>
        )
    }
}
}