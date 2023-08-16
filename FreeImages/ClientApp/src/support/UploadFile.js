import React, { useEffect, useRef, useState } from 'react';

// Installed
import { Alert, Button, Checkbox, CircularProgress, FormControlLabel } from '@mui/material';
import { Close, Crop169, CropDin, CropPortrait, Refresh } from '@mui/icons-material';
import ReactCrop from 'react-image-crop';
import axios from 'axios';

// Components
import Heading from '../components/Heading';
import Form from '../components/Form';

// Functions
import HeaderConfig from '../functions/HeaderConfig';

// Css
import './../css/fileUpload.css';
import 'react-image-crop/dist/ReactCrop.css';

// Images
import upload from './../assets/images/upload.png';


function UploadFile(props) {
    UploadFile.displayName = "UploadFile";

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState();
    const [error, setError] = useState();
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState();
    const [cropImageTools, setCropImageTools] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [croppedImageSrc, setCroppedImageSrc] = useState(null);
    const [isBackground, setIsBackground] = useState(false);
    const [ratio, setRatio] = useState(16 / 9);

    // For crop image --->
    const [imgSrc, setImgSrc] = useState();
    const [crop, setCrop] = useState({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    // End

    const uploadFile = useRef(null);
    const cropImageButtons = useRef(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    useEffect(() => {
        if (image && props.reset)
            setImage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.reset])

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        console.log(65, completedCrop)
        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const _crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = _crop.width * pixelRatio * scaleX;
        canvas.height = _crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        // Save image base 64 string
        setCroppedImage(canvas.toDataURL("image/jpeg"));
        console.log("canvas", canvas.toDataURL("image/jpeg"))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completedCrop]);

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

            setCropImageTools(true);
            reader.addEventListener('load', () => setImgSrc(reader.result));
            setTimeout(() => { cropImageButtons.current.scrollIntoView(); }, 1000)

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

        let api = `upload/${formData?.name}/${formData?.keywords}/${isBackground}`;

        if (!!croppedImage) {
            data = {
                name: formData.name,
                keywords: formData.keywords,
                croppedFile: croppedImage,
                background: isBackground
            }

            api = "upload/cropped";
        }

        await axios.post(api, data, HeaderConfig)
            .then(res => {
                setResponse(res.data);
                setLoading(false);
                if (res.status === 200) {
                    setFile();
                    setImage(null);
                }
            }, error => {
                setResponse(error)
            })
    }

    // For crop image --->
    const onLoad = (img) => {
        console.log(168, img)
        imgRef.current = img;
    };

    // Change crop size
    const cropHandle = (params) => {
        setCrop({ ...crop, aspect: 0 })
        setTimeout(() => {
            setCrop({ ...crop, aspect: params });
        }, 300)
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
                        {!croppedImage && <img src={image} alt="" className="uploaded-image" />}
                        {/* To save cropped image */}
                        <canvas
                            ref={previewCanvasRef}
                            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                            style={{
                                // width: Math.round(completedCrop?.width ?? 0),
                                height: "100%",
                                // height: Math.round(completedCrop?.height ?? 0),
                                alignSelf: "center",
                                margin: "auto"
                            }}
                        />
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

                {/* Crop image */}
                {cropImageTools && <div className="crop-image-block slide-in-bottom">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => {
                            setCrop(c);
                            console.log("crop", c)
                        }}
                        onComplete={(c) => {
                            setCompletedCrop(c);
                            console.log(228, c);
                        }}
                        minWidth={200}
                        minHeight={200}
                        keepSelection={true}
                        aspect={ratio}
                    >
                        <img src={imgSrc} ref={imgRef} alt="" />
                    </ReactCrop>

                    <div className="btn-wrapper" ref={cropImageButtons}>
                        {/* Buttons to change image crop params */}
                        {[{ name: <Crop169 />, aspect: 16 / 9 }, { name: <CropPortrait />, aspect: 12 / 16 }, { name: <CropDin />, aspect: 1 / 1 }].map((s, i) => (
                            <Button variant="contained"
                                onClick={() => setRatio(s.crop)} key={i}>
                                {s.name}
                            </Button>
                        ))}

                        <Button variant="contained" onClick={() => {
                            setCropImageTools(false);
                            setCroppedImageSrc(croppedImage);
                        }}>
                            <Close />
                        </Button>

                        {/* <Button variant="contained" color="primary"
                            disabled={!completedCrop?.width || !completedCrop?.height || loading}
                            onClick={() => submitCroppedImage()} >
                            <AdsClickSharp />
                        </Button> */}
                    </div>
                </div>}

                {/* Checkbox */}
                <FormControlLabel className='input-checkbox' control={
                    <Checkbox color="default" onClick={() => setIsBackground(!isBackground)} />
                } label="Can use as a header background" />
            </Form>
        </div>
    )
}
export default UploadFile;