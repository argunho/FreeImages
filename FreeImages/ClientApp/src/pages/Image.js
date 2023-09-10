import axios from 'axios';
import React, { useEffect, useState } from 'react'

// Installed
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import { Alert, AlertTitle, Button, FormGroup } from '@mui/material';
import { Download, ImageNotSupported } from '@mui/icons-material';

// Css
import "../assets/css/images-view.css";

function Image() {

    const { hash } = useParams();

    const [image, setImage] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!hash) return;
        async function getImage(id) {
            await axios.get(`image/getImage/${hash}`).then(res => {
                console.log(res)
                if (!!res.data)
                    setImage(res.data);
                setTimeout(() => {
                    setLoading(false)
                }, 2000)
            })
        }

        getImage();
    }, [hash])

    if (!image && !loading)
        return <Alert variant='outlined' severity='info'>
            <AlertTitle>Image not found</AlertTitle>
            <ImageNotSupported fontSize={100} color='inherit' />
        </Alert>;

    return (
        <div className='image-container d-row ai-start'>
            <div className='image-view-wrapper d-row'>
                {loading && <Loading><p>Image loads ...</p></Loading>}
                <img className={(loading ? 'image-hidden' : "fade-in") + " image"}
                    src={image?.path} alt={image?.viewName} />
            </div>
            <div className='image-actions d-column jc-start'>
                <p className='image-name' >{image?.viewName}</p>
                {/* style={{
                    background: `url(${image.path})`, 
                    backgroundSize: "cover",
                    filter: "blur(50px)",
                    transform: "scale(3)"
                }} */}
                <div className="image-actions-wrapper d-column jc-start ai-start">
                    {[1,1.5,2,3,4,5].map((s,ind) => {
                        return <Button variant="outlined" color="inherit" className='image-download-link d-row jc-between'>
                                    <span>Image size: {Math.round(image?.width / s)} x {Math.round(image?.height / s)}</span> 
                                    <Download  />
                                </Button>
                    })}
                    
                </div>
            </div>
        </div>
    )
}

export default Image;