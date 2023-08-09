
import React, { useState } from 'react'

// Installed
import { Close } from '@mui/icons-material'
import { Button, CircularProgress, TextField } from '@mui/material'

// Components
import Response from './Response';

// Functions
import { useEffect } from 'react';

function Form({ children, ...props }) {

    const inputs = Object.keys(props.inputs);
    const [form, setForm] = useState(props.inputs);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        let res = props.response;
        if (!!res) {
            setLoading(false);
            if (!!res?.alert) {
                setResponse(res);
                if (res.alert === "success")
                    resetForm();
            } else
                console.warn(res);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.response])

    const handleChange = e => {
        if (!e.target) return;
        setErrors([]);
        setResponse(null);
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const confirm = props?.confirmInputs;

        // If exists inputs to validate
        if (!!props?.confirmInputs && form[confirm[0]] !== form[confirm[1]]) {
            setErrors(confirm);
            return;
        }

        // Form validation
        let invalidForm = false;
        inputs.forEach(input => {
            if (form[input].length < 2) {
                invalidForm = true;
                setErrors(errors => [...errors, input])
            }
        })

        if (invalidForm) return;

        setLoading(true);
        props.onSubmit(form);
    }

    const resetForm = () => {
        if (!!props.fileReset)
            props.fileReset();
        setForm(props.inputs);
        setLoading(false);
    }

    const capitalize = (str) => {
        if (!str) return;
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const ongoingForm = () => {
        return (props.upload ? !file : false) || form !== props.inputs;
    }

    // Response alert
    if (!!response)
        return

    return (
        <>
            <form onSubmit={submitForm}>
                <h4 className='form-title'>{props.heading}</h4>
                {inputs.map((x, ind) => (
                    <TextField key={ind}
                        label={capitalize(x)}
                        className='fields'
                        size="medium"
                        required
                        disabled={loading || props.disabled}
                        name={x}
                        type={x.toLowerCase().indexOf("password") > -1 ? "password" : (x === "email" ? x : "text")}
                        value={form[x]}
                        variant="outlined"
                        inputProps={{
                            minLength: x.toLowerCase().indexOf("password") > -1 ? 6 : 2
                        }}
                        error={errors.indexOf(x) > -1}
                        onChange={handleChange} />
                ))}

                {/* File upload */}
                {children && children}

                {!props.disabled && <div className="buttons-wrapper d-row jc-end">
                    {ongoingForm ? <Button color="error" variant='outlined' onClick={resetForm}>
                        <Close />
                    </Button> : null}
                    <Button type="submit" variant='outlined' color="inherit">
                        {loading ? <CircularProgress className='loading-circular' /> : "Save"}
                    </Button>
                </div>}
            </form>

            {!!response && <Response res={response} close={() => setResponse()} />}
        </>
    )
}
export default Form;