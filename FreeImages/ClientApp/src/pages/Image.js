import axios from 'axios';
import React, { useEffect, useState } from 'react'

// Installed
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import { Alert, AlertTitle } from '@mui/material';
import { ImageNotSupported } from '@mui/icons-material';

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
                setLoading(false)
            })
        }

        getImage();
    }, [hash])

    if (loading)
        return <Loading><p>Image loads ...</p></Loading>;
    else if (!image)
        return <Alert variant='outlined' severity='info'>
            <AlertTitle>Image not found</AlertTitle>
            <ImageNotSupported fontSize={100} color='inherit' />
        </Alert>;

    return (
        <div className='image-container d-row'>
            <div className='image-wrapper'>
                <img className='image' src={image.path} alt={image.viewName} />
        </div>
            <div className='image-actions d-column'>
                <h3>{image.viewName}</h3>
            </div>
        </div>
    )
}

export default Image;