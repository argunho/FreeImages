import { useEffect, useState } from 'react';

// Installed
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Components
import Heading from '../components/Heading';
import Loading from '../components/Loading';
import Form from '../components/Form';

// Functions
import HeaderConfig from '../functions/HeaderConfig';

// Css
import './../css/form.css';

function FileFormPage() {
    FileFormPage.displayName = "FileFormPage";

    const [image, setImage] = useState({});
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState(null);
    

    const { id } = useParams();

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
        </div>
    )
}

export default FileFormPage;