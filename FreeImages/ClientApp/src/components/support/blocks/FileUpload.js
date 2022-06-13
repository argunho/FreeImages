import React, { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Refresh } from '@mui/icons-material';

import upload from './../../../images/upload.png';
import './../../../css/fileUpload.css';

export default function FileUpload(props) {

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState();
    const [error, setError] = useState();

    const uploadFile = useRef(null);

    useEffect(() => {
        if (image && props.reset)
            setImage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.reset])


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
                if (file) props.onUploadChange(file);
            };

            setLoading(false);

            reader.readAsDataURL(file);
        }
    }

    return (
        <div className='upload-file-container'>

            {/* Uploaded image */}
            {image ? <div className='uploaded-image-wrapper'>
                <img src={image} alt="" className="uploaded-image" />
                <Button
                    variant='outlined'
                    size="small"
                    onClick={() => uploadFile.current.click()}
                    disabled={props.disabled}>
                    <Refresh />
                </Button>
            </div> :
                <div className="upload-file-wrapper" onClick={() => uploadFile.current.click()}>
                    {(loading) ? <CircularProgress className="upload-symbol image-load-symbol" />
                        : <img className='upload-file-symbol' height="90" src={upload} alt="Upload File" />}
                    <br />
                    <p className='upload-file-label'>Ladda upp en bild</p>
                </div>}


            {/* File upload input */}
            <input type="file" className="none" ref={uploadFile}
                onChange={e => onFileChange(e)} disabled={loading || props.loading} accept="image/*" />
        </div>
    )
}
