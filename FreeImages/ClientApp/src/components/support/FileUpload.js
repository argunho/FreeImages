import { CircularProgress } from '@mui/material';
import React, { useRef, useState } from 'react'

import './../../css/fileUpload.css';

import upload from './../../images/upload.png';

export default function FileUpload() {

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const [error, setError] = useState();

    const uploadFile = useRef(null)
    const uploadClass = "upload-block upload-file " + ((loading) ? " file-loading" : "");

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

    return (
        <div className="upload-file-container">
            <div className="upload-file-wrapper" onClick={() => uploadFile.current.click()}>
                    {(loading) ? <CircularProgress className="upload-symbol image-load-symbol" />
                        : <img className='upload-file-symbol' height="90" src={upload} alt="Upload File" />}
                        <br/>
            <p className='upload-file-label'>Ladda upp en bild</p>
            </div>
                    

                {/* File upload input */}
                <input type="file" className="none" ref={uploadFile}
                    onChange={e => onFileChange(e)} disabled={loading} accept="image/*" />{/*capture="environment"*/}
        </div>
    )
}
