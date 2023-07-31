import { Close } from '@mui/icons-material'
import { Button, CircularProgress, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

// Components
// import FileUpload from './FileUpload';

function Form({ children, ...props }) {

    const inputs = Object.keys(props.inputs);
    const [form, setForm] = useState(props.inputs);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [result, setResult] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (result && !response) {
            setResponse(null);
            setResult(false);
        } else if (result && response) {
            setTimeout(() => {
                if (result) {
                    setResponse(null);
                    setResult(false);
                }
            }, 5000)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])

    const handleChange = e => {
        if (!e.target) return;
        setErrors([]);
        setResponse(null);
        setForm({ ...form, [e.target.name]: e.target.value });
        console.log(Object.values(form))
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const confirm = props?.confirmInputs;
        // If exists inputs to validate
        if (!!props?.confirmInputs && form[confirm[0]] !== form[confirm[1]]) {
            setErrors(confirm);
            return;
        }

        let invalidForm = false;
        inputs.forEach(input => {
            if (form[input].length < 2) {
                invalidForm = true;
                setErrors(errors => [...errors, input])
            }
        })

        if (invalidForm) return;
        console.log(form)
        setLoading(true);

        let formData = form;
        if (!!props.roles)
            formData.roles = props.roles;

        let request = axios.post(props.api, formData);

        // If it is upload image form
        if (props.upload) {
            if (!file) return;

            let data = new FormData();
            data.append("uploadedFile", file);
            let api = props.api;
            inputs.forEach(k => {
                api += "/" + form[k]
            });

            request = axios.post(api, data);
        }
console.log(formData)

        //  axios.post(`upload/${form.name}/${form.keywords}/${form.text}`, data)
        await request.then(res => {
            setResponse(res.data);
            setLoading(false);
            setResult(true);
            if (res.data.result === "success")
                resetForm();
        }, error => {
            console.error(error);
            setLoading(false);
        })
    }

    const resetForm = () => {
        setFile(null);
        setForm(props.inputs)
    }

    const capitalize = (str) => {
        if (!str) return;
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const ongoingForm = () => {
        return (props.upload ? !file : false) || form !== props.inputs;
    }

    return (
        <form onSubmit={submitForm}>
            <h4 className='form-title'>{props.heading}</h4>
            {inputs.map((x, ind) => (
                <TextField key={ind}
                    label={capitalize(x)}
                    className='fields'
                    size="medium"
                    required
                    autoComplete={false}
                    disabled={loading}
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
            {/* {props.uploadFile && <FileUpload onUploadChange={(file) => setFile(file)} loading={loading} reset={file === null} />} */}

            <div className="buttons-wrapper d-row jc-end">
                {ongoingForm ? <Button color="error" variant='outlined' onClick={resetForm}>
                    <Close />
                </Button> : null}
                <Button type="submit" variant='outlined' color="inherit">
                    {loading ? <CircularProgress className='loading-circular' /> : "Save"}
                </Button>
            </div>
        </form>
    )
}
export default Form;