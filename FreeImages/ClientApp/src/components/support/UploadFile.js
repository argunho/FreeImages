import React, { useRef, useState } from 'react'
import { Backdrop, Button, Checkbox, CircularProgress, FormControlLabel, InputLabel, TextareaAutosize, TextField } from '@mui/material';
import { Upload } from '@mui/icons-material'
import './../../css/form.css';
import FileUpload from './FileUpload';

export default function UploadFile() {

    const [form, setForm] = useState({
        name: "",
        imageName: "",
        keywords: "",
        text: ""
    })
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        if (!e.target) return;
        setForm({ ...form, [e.target.name]: e.target.value })
    }


    const submitForm = e => {
        e.preventDefault();
    }

    return (
        <form onSubmit={submitForm}>
            <h4 className='form-title'>Upload image</h4>

            {['Name', 'Keywords'].map((x, ind) => (
                <TextField key={ind}
                    size="small"
                    label={x}
                    className='fields'
                    name={x.toUpperCase()}
                    value={form[x]}
                    variant="outlined"
                    onChange={handleChange} />
            ))}

            <TextareaAutosize
                aria-label="Text"
                placeholder="Description of image"
                name="text"
                style={{ width: "100%", height: 200 }}
                onChange={handleChange}
            />


            <FileUpload />
        </form>
    )
}
