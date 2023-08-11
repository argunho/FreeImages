import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, CircularProgress } from '@mui/material';
import { Refresh } from '@mui/icons-material';

// Images
import upload from './../assets/images/upload.png';

// Css
import './../css/fileUpload.css';
import Heading from '../components/Heading';
import Form from '../components/Form';
import axios from 'axios';
import HeaderConfig from '../functions/HeaderConfig';

function UploadFile(props) {

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState();
    const [error, setError] = useState();
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState();

    const uploadFile = useRef(null);

    useEffect(() => {
        if (image && props.reset)
            setImage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.reset])


    const onFileChange = ev => {
        ev.preventDefault();
        if (loading) return;

        setError();
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
                // if (file) props.onUploadChange(file);
                if (file) setFile(file);
            };

            setLoading(false);

            reader.readAsDataURL(file);
        }
    }

    const submitForm = async (formData) => {
        let data = new FormData();
        data.append("uploadedFile", file);

        await axios.post(`upload/${formData.name}/${formData.keywords}`, data, HeaderConfig)
            .then(res => {
                setResponse(res.data);
                setLoading(false);
                if (res.status === 200) {
                    setFile();
                    setImage(null);
                }
                console.log(res)
            }, error => {
                setResponse(error)
            })
    }

    return (
        <div className='wrapper'>
            <Heading title="Form" />
            <Form
                heading="Upload an image"
                inputs={{
                    name: "",
                    keywords: ""
                }}
                response={response}
                onSubmit={submitForm}
                reset={() => setFile()}>
                <div className='upload-file-container'>
                    {/* File error message */}
                    {error && <Alert severity='error' color="error">{error}</Alert>}
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
            </Form>
        </div>
    )
}
export default UploadFile;