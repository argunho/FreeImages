import React, { useState } from 'react'
import { TextField, Button } from '@mui/material';
import axios from 'axios';

import FileUpload from './FileUpload';
import './../../css/form.css';

export default function UploadFile() {

    const [form, setForm] = useState({
        name: "",
        keywords: ""
    })

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleChange = e => {
        if (!e.target) return;
        setForm({ ...form, [e.target.name]: e.target.value })
    }


    const submitForm = async (e) => {
        e.preventDefault();
        if (!file) return;
        console.log(file)
        setLoading(true);

        let data = new FormData();
        data.append("uploadedFile", file);

        await axios.post(`upload/${form.name}/${form.keywords}/${form.text}`, data).then(res => {
            console.log(res)
        }, error => {
            console.warn(error)
        })
    }

    return (
        <form onSubmit={submitForm}>
            <h4 className='form-title'>Upload image</h4>

            {Object.keys(form).map((x, ind) => (
                <TextField key={ind}
                    size="small"
                    label={x.charAt(0).toUpperCase() + x.slice(1)}
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
                <Button type="submit" variant="outlined" color="success">
                    Save
                </Button>
            </div>
        </form>
    )
}
