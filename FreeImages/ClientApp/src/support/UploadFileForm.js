import React, { useEffect, useState } from 'react'
import { TextField, Button, AlertTitle, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

import { Close } from '@mui/icons-material';

// Components
import FileUpload from '../components/FileUpload';
import Heading from '../components/Heading';


// Css
import './../css/form.css';


function UploadFileForm(props) {

    const [form, setForm] = useState({
        name: "",
        keywords: ""
    })

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [result, setResult] = useState(false);

    useEffect(() => {
        if (result && !response) {
            setResponse(null);
            setResult(false);
        } else if (result && response) {
            setTimeout(() => {
                if (result) {
                    setResponse(null);
                    setResult(false);
                }
            }, 5000)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])

    const handleChange = e => {
        if (!e.target) return;
        setResponse(null);
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (!invalidForm) return;

        setLoading(true);

        let data = new FormData();
        data.append("uploadedFile", file);

        await axios.post(`upload/${form.name}/${form.keywords}/${form.text}`, data).then(res => {
            setResponse(res.data);
            setLoading(false);
            setResult(true);
            if (res.data.result === "success")
                resetForm();
        }, error => {
            console.error(error)
        })
    }

    const resetForm = () => {
        setFile(null);
        setForm({ ...form, name: "", keywords: "" })
    }

    const capitalize = (str) => {
        if (!str) return;
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const invalidForm = () => {
        return (!file || (form.name || form.keyword).length === 0)
    }

    return (
        <div className='wrapper'>

            <Heading title="Form" />

            <form onSubmit={submitForm}>
                <h4 className='form-title'>Upload image</h4>
                {["name", "keywords"].map((x, ind) => (
                    <TextField key={ind}
                        size="small"
                        label={capitalize(x)}
                        className='fields'
                        required
                        disabled={loading}
                        name={x}
                        value={form[x]}
                        variant="outlined"
                        onChange={handleChange} />
                ))}


                {/* File upload */}
                <FileUpload onUploadChange={(file) => setFile(file)} loading={loading} reset={file === null} />

                {/* <FormControlLabel className="checkbox" control={
                <Checkbox checked={form.visible} onChange={() => setForm({...form, visible: !form.visible })}
                    color="primary" />} label={"Visible"} /> */}

                <div className="buttons-wrapper">
                    {invalidForm ? <Button color="error" variant='outlined' onClick={resetForm}>
                        <Close />
                    </Button> : null}
                    <Button type="submit" variant='outlined' color="inherit" style={{ width: "70px" }}>
                        {loading ? <CircularProgress className='loading-circular' /> : "Save"}
                    </Button>
                </div>
            </form>

            {/* Response */}
            {response ?
                <div className={'slide-in-bottom alert-wrapper ' + response?.result}>
                    <Alert className='alert' severity={response?.result} variant='filled' onClose={() => setResponse(null)}>
                        <AlertTitle>{capitalize(response?.result)}</AlertTitle>
                        <p dangerouslySetInnerHTML={{ __html: response?.msg }}></p>
                    </Alert>
                </div> : null}
        </div>
    )
}

export default UploadFileForm;