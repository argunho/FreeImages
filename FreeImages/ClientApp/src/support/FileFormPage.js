import { useEffect, useState } from 'react';

// Installed
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Components
import Heading from '../components/Heading';
import Loading from '../components/Loading';
import Form from '../components/Form';

// Functions
import HeaderConfig from '../functions/HeaderConfig';

// Css
import './../css/form.css';
import { Button } from '@mui/material';
import Confirm from '../components/Confirm';

function FileFormPage() {
    FileFormPage.displayName = "FileFormPage";

    const [image, setImage] = useState({});
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(false);
    const [response, setResponse] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!!id) {
            (async () => {
                const res = await axios.get(`image/${id}`, HeaderConfig);
                if (!!res?.data)
                    setImage(res?.data);
                else
                    setResponse({ alert: "error", message: "Image data not found!" });

                setLoading(false);
            })();
        } else
            setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])


    const submitForm = async (formData) => {
        setResponse();
        await axios.put(`image/${id}`, formData, HeaderConfig).then(res => {
            setResponse(res.data)
        }, error => {
            setResponse({ alert: "error", message: error?.message });
        });
    }

    const deleteImage = async () => {
        setConfirm(false);
        const res = await axios.delete(`image/${id}`, HeaderConfig);
        setResponse(res?.data);
        if (res.data.alert === "success") {
            setTimeout(() => {
                navigate("/sp/images");
            }, 2000)
        }
    }

    return (
        <div className='wrapper form-wrapper'>
            <Heading title="Form" />
            {(!!image && !loading) && <div className='image-wrapper d-column'>
                <img src={image?.path} alt={image?.viewName} />
            </div>}
            {loading ? <Loading /> : <Form
                heading="Edit image"
                inputs={{
                    name: image?.name,
                    keywords: image?.keywords
                }}
                response={response}
                onSubmit={submitForm} />}

            {/* Actions buttons */}
            {<div className="buttons-wrapper d-row js-end ai-end">

                {/* Delete user profile */}
                <Button variant="text" color="error" onClick={() => setConfirm(true)}>
                    Delete image
                </Button>
            </div>}

            {/* Confirm alert */}
            {confirm && <Confirm confirm={deleteImage} reset={() => setConfirm(false)} />}
        </div>
    )
}

export default FileFormPage;