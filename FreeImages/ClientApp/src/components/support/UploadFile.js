import React, { useRef, useState } from 'react'
import { Backdrop, Button, Checkbox, CircularProgress, FormControlLabel, InputLabel, TextareaAutosize, TextField } from '@mui/material';
import { Upload } from '@mui/icons-material'
import './../../css/form.css';

export default function UploadFile() {

    const [form, setForm] = useState({
        name: "",
        imageName: "",
        keywords: "",
        text: ""
    })
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const [error, setError] = useState();

    const upload = useRef(null);

    const handleChange = e => {
        if (!e.target) return;
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const onFileChange = ev => {
        ev.preventDefault();
        if (loading) return;

        setLoading(true);

        if (ev.target.files && ev.target.files.length > 0) {

            const file = ev.target.files[0];

            const allowed_types = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
            const format = file.type;

            if (!allowed_types.includes(file.type)) {
                setLoading(false);
                setError(`The file type is ${format}, but the image must be in one of the listed formats, jpeg,png,gif,bmp`);
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const image = new Image();
                image.src = e.target.result;

                setImage(image.src);
                setFile(file);
            };
            setLoading(false);

            reader.readAsDataURL(file);

        }

    }

    const submitForm = e => {
        e.preventDefault();
    }

    const uploadClass = "upload-image upload-block" + ((loading) ? " file-loading" : "");

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

            <div className="upload-image-container">
                <InputLabel>Ladda upp en bild</InputLabel>
                <div className="upload-image-wrapper">
                    <div className={uploadClass} onClick={() => upload.current.click()}>
                        {(loading)
                            ? <CircularProgress className="upload-symbol image-load-symbol" />
                            : <upload className="upload-symbol" />
                        }
                    </div>

                    {/* File upload input */}
                    <input type="file" className="none" ref={upload}
                        onChange={e => onFileChange(e)} disabled={loading} accept="image/*" />{/*capture="environment"*/}

                </div>
            </div>
        </form>
    )
}
