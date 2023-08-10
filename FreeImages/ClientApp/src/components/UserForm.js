import React, { useEffect, useState } from 'react'

// Installed
import axios from 'axios';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import Form from './Form';
import Heading from './Heading';

// Functions
import HeaderConfig from '../functions/HeaderConfig';
import Loading from './Loading';

function UserForm({ children, api, inputs, heading, confirmInputs, permission, disabled, loading, user, res }) {

    const [roles, setRoles] = useState([])
    const [response, setResponse] = useState();
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        if (!!res)
            setResponse(res);
    }, [res])

    useEffect(() => {
        if (!!user)
            setRoles(user?.listRoles)
    }, [user])

    const handleRoles = (e) => {
        const role = e.target.name;
        const rolesList = [...roles];
        const index = rolesList.indexOf(role);
        if (index > -1)
            rolesList.splice(index, 1);
        else
            rolesList.push(role);

        setRoles(rolesList)
    }

    const submitForm = async (formData) => {
        let data = formData;
        setResponse();
        // Update form data
        data.roles = roles?.toString();
        if (api.indexOf("changePassword") > -1 && !!user) {
            data.name = user?.name;
            data.email = user?.email;
        }

        const apiRequest = !user ? axios.post(`${api}`, data, HeaderConfig)
            : axios.put(`${api}/${user?.id}`, data, HeaderConfig);

        await apiRequest.then(res => {
            if (!!res.data?.token) {
                localStorage.setItem("token", res.data.token);
                navigate("/sp/images");
            } else
                setResponse(res.data)
        }, error => {
            setResponse({ alert: "error", message: error?.message });
        });
    }

    return (
        <div className='wrapper form-wrapper'>
            <Heading title="Form" />
            {loading ? <Loading /> : <Form
                heading={heading}
                inputs={inputs}
                confirmInputs={confirmInputs}
                response={response}
                disabled={disabled}
                onSubmit={submitForm}>
                {(!!token && !!permission) && <div className='d-column ai-start'>
                    {["Admin", "Manager"].map((role, i) => {
                        return <FormControlLabel key={i} className='input-checkbox' control={
                            <Checkbox disabled={disabled} color="default" checked={roles.indexOf(role) > -1} onClick={handleRoles} name={role} />
                        } label={role} />
                    })}
                </div>}
            </Form>}

            {!!children && children}
        </div>
    )
}

export default UserForm;