
import React, { useEffect, useState } from 'react'

// Installed
import { useParams } from 'react-router-dom'
import { Alert, AlertTitle, Button, CircularProgress, FormGroup, IconButton, TextField } from '@mui/material';
import { Check, Close, Download, IceSkating, ImageNotSupported } from '@mui/icons-material';
import axios from 'axios';

// Components
import Loading from '../components/Loading';

// Functions

// Css
import "../assets/css/images-view.css";

function Image() {

    const { hash } = useParams();

    const [image, setImage] = useState();
    const [loading, setLoading] = useState(true);
    const [customized, setCustomized] = useState(null);
    const [download, setDownload] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        if (!hash) return;
        async function getImage() {
            await axios.get(`image/getImage/${hash}`).then(res => {
                console.log(res)
                const img = res?.data;
                if (!!img) {
                    setImage(img);
                    setCustomized({
                        width: img?.width,
                        height: img?.height
                    })
                }
                setTimeout(() => {
                    setLoading(false)
                }, 2000)
            })
        }

        getImage();
    }, [hash])

    const customizeImage = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const w = image?.width;
        const h = image?.height;
        let divide = (name === "width" ? w : h) / value;
        setCustomized({
            width: name === "width" ? value : (w / divide),
            height: name === "height" ? value : (h / divide),
        })
    }

    const downloadImage = async (value) => {
        setDownload(value)
        await axios.get(`image/download/${image?.id}/${value}`)
            .then(res => {
                setDownload(null);
                if (res.status === 200)
                    setResponse(res.data)
                console.log(res);
            })
    }

    if (!image && !loading)
        return <Alert variant='outlined' severity='info'>
            <AlertTitle>Image not found</AlertTitle>
            <ImageNotSupported fontSize={100} color='inherit' />
        </Alert>;

    return (
        <div className='image-container d-row ai-start'>
            <div className='image-view-wrapper d-row'>
                {loading && <Loading><p>Image loads ...</p></Loading>}
                {!loading && <div className='image-view-bg' style={{ backgroundImage: `url(${image?.path})` }}></div>}
                <img className={(loading ? 'image-hidden' : "fade-in") + " image"}
                    src={image?.path} alt={image?.viewName} />
            </div>
            <div className='image-actions d-column jc-start'>
                <p className='image-name' >{image?.viewName}</p>
                <div className="image-actions-wrapper d-column jc-start ai-start" >
                    <p className='image-actions-name'>Download</p>
                    <div className='default-sizes d-row jc-between'>
                        {[1, 1.5, 2, 3].map((s, ind) => {
                            return <Button key={ind} variant="outlined" color="info"
                                className='image-download-link d-row jc-between'
                                disabled={!!download}
                                onClick={() => downloadImage(s)}>
                                <span>{Math.round(image?.width / s)} x {Math.round(image?.height / s)}</span>
                                {download === s ? <CircularProgress size={20} color='warning' /> : <Download />}
                            </Button>
                        })}
                    </div>

                    <p className='image-actions-name'>Your desired image size</p>
                    <div className='customized-image d-row jc-between'>
                        {!!customized && ["width", "height"].map((name, ind) => {
                            return <FormGroup key={ind} className='d-row'>
                                <TextField size="small"
                                    label={name.toUpperCase()}
                                    name={name}
                                    value={Math.round(customized[name])}
                                    disabled={!!download}
                                    onChange={customizeImage} />
                            </FormGroup>
                        })}
                        <Button variant="outlined" color="info"
                            className='image-download-link d-row jc-between'
                            disabled={!!download}
                            onClick={() => downloadImage(customized.width)}>
                            {download === customized?.width ? <CircularProgress size={20} color='warning' /> : <Download />}
                        </Button>
                    </div>

                    {/* Response */}
                    <div className={`response-block d-column${response ? " visible scale-in-center" : ""}`} >
                        <Check />
                        <p>Image loaded successfully!</p>
                        <span>Please check your Download folder</span>

                        <IconButton className='close-modal' onClick={() => setResponse()}>
                            <Close />
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Image;