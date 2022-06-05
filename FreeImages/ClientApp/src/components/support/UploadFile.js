import React, { useState } from 'react'
import { TextField, Button } from '@mui/material';
import axios from 'axios';

import FileUpload from './FileUpload';
import './../../css/form.css';

export default function UploadFile() {

    const [form, setForm] = useState({
        name: "",
        img: "",
        keywords: "",
        text: ""
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

            {['Name', 'Keywords'].map((x, ind) => (
                <TextField key={ind}
                    size="small"
                    label={x}
                    className='fields'
                    required
                    name={x.toLowerCase()}
                    value={form[x]}
                    variant="outlined"
                    onChange={handleChange} />
            ))}

            <textarea
                aria-label="Text"
                placeholder="Description of image"
                name="text"
                onChange={handleChange}
            ></textarea>

            {/* File upload */}
            <FileUpload onUploadChange={(file) => setFile(file)} />

            <div className="buttons-wrapper">
                <Button type="submit" variant="outlined" color="success">
                    Save
                </Button>
            </div>
        </form>
    )
}
