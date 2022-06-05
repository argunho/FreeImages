import React, { useState } from 'react'
import { TextField, Button, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';

import FileUpload from './FileUpload';
import './../../css/form.css';
import { Cancel, Close } from '@mui/icons-material';

export default function UploadFile() {

    const [form, setForm] = useState({
        name: "",
        keywords: ""
    })

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const { response, setResponse } = useState({
        res: "",
        msg: ""
    });

    const handleChange = e => {
        if (!e.target) return;
        setResponse(null);
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (!invalidForm) return;

        setLoading(true);

        let data = new FormData();
        data.append("uploadedFile", file);

        await axios.post(`upload/${form.name}/${form.keywords}/${form.text}`, data).then(res => {
            setResponse(res.data)
            if (res.data.res === "success")
                resetForm();
        }, error => {
            console.warn(error)
        })
    }

    const resetForm = () => {
        setFile(null);
        setForm({ ...form, name: "", keywords: "" })
    }

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const invalidForm = () => {
       return (!file || (form.name || form.keyword).length === 0)
    }

    return (
        <form onSubmit={submitForm}>
            <h4 className='form-title'>Upload image</h4>

            {/* Response */}
            {response ? <Alert severity={response?.res} variant='filled' onClose={() => { }}>
                    <AlertTitle>{capitalize(response?.res)}</AlertTitle>
                    {response?.msg}
                </Alert> : null}

            {Object.keys(form).map((x, ind) => (
                <TextField key={ind}
                    size="small"
                    label={capitalize(x)}
                    className='fields'
                    required
                    disabled={loading}
                    name={x.toLowerCase()}
                    value={form[x]}
                    variant="outlined"
                    onChange={handleChange} />
            ))}

            {/* File upload */}
            <FileUpload onUploadChange={(file) => setFile(file)} loading={loading} />

            <div className="buttons-wrapper">
               (invalidForm ? <Button color="error" onClick={resetForm}>
                    <Close />
                </Button> ;
                <Button type="submit" color="inherit">
                    Save
                </Button>
            </div>
        </form>
    )
}
