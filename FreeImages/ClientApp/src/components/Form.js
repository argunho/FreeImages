import { Close } from '@mui/icons-material'
import { Button, CircularProgress, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

// Components
import FileUpload from './FileUpload';

function Form({children, ...props}) {

    const [form, setForm] = useState(props.form);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [result, setResult] = useState(false);
    const confirm = props?.confirmInputs || [];

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
        setResponse(null);
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitForm = async (e) => {
        e.preventDefault();
        let invalidForm = false;
        props.formInputs.forEach(input => {
            if (form[input].length === 0)
                invalidForm = true;
        })
        
        if (invalidForm) return;
console.log(form)
        setLoading(true);

        let request = axios.post(props.api, form);
        if (props.upload) {
            if (!file) return;

            let data = new FormData();
            data.append("uploadedFile", file);
            let api = props.api;
            props.formInputs.forEach(k => {
                api += "/" + form[k]
            });

            request = axios.post(api, data);
        }

        //  axios.post(`upload/${form.name}/${form.keywords}/${form.text}`, data)
        await request.then(res => {
            setResponse(res.data);
            setLoading(false);
            setResult(true);
            if (res.data.result === "success")
                resetForm();
        }, error => {
            console.error(error)
        })
    }

    const resetForm = () => {
        setFile(null);
        setForm(props.form)
    }

    const capitalize = (str) => {
        if (!str) return;
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const ongoingForm = () => {
        return (props.upload ? !file : false) || form !== props.form;
    }

    return (
        <form onSubmit={submitForm}>
            <h4 className='form-title'>{props.heading}</h4>
            {props.formInputs.map((x, ind) => (
                <TextField key={ind}
                    label={capitalize(x)}
                    className='fields'
                    size="medium"
                    required                    
                    disabled={loading}
                    name={x}
                    value={form[x]}
                    variant="outlined"
                    error={confirm.length > 0 && form[confirm[0]].length > 6 && form[confirm[0]] !== form[confirm[1]]}
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