import { useEffect, useState } from 'react';

// Installed
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

// Components
import Heading from '../components/Heading';
import Loading from '../components/Loading';
import Form from '../components/Form';
import Confirm from '../components/Confirm';

// Functions
import HeaderConfig from '../functions/HeaderConfig';

// Css
import './../assets/css/form.css';

function FileFormPage() {
    FileFormPage.displayName = "FileFormPage";

    const [image, setImage] = useState({});
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(false);
    const [response, setResponse] = useState();

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!!id) 
            getItem();
        else
            setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const getItem = async () => {
        const res = await axios.get(`image/${id}`, HeaderConfig);
        if (!!res?.data)
            setImage(res?.data);
        else
            setResponse({ alert: "error", message: "Image data not found!" });

        setLoading(false);
    }


    const submitForm = async (formData) => {
        setResponse();
        await axios.put(`image/update/${id}`, formData, HeaderConfig).then(res => {
            setResponse(res.data);
            if(res.data.alert === "success")
                getItem();
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
            <Heading title="Form" reload={getItem}/>
            {(!!image && !loading) && <div className='image-wrapper d-column'>
                <img src={image?.path} alt={image?.viewName} />
            </div>}
            {loading ? <Loading /> : <Form
                heading="Edit image data"
                inputs={{
                    name: image?.viewName,
                    keywords: image?.keywords
                }}
                response={response}
                onSubmit={submitForm} />}

            {/* Actions buttons */}
            {!loading && <div className="buttons-wrapper d-row js-end ai-end">
                {/* Delete user profile */}
                {!confirm && <Button variant="text" color="error" onClick={() => setConfirm(true)}>
                    Delete image
                </Button>}

                {/* Confirm alert */}
                {confirm && <Confirm confirm={deleteImage} reset={() => setConfirm(false)} />}
            </div>}
        </div>
    )
}

export default FileFormPage;