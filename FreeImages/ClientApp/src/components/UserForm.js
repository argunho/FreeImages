import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

// Installed
import axios from 'axios';
import { Checkbox, FormControlLabel } from '@mui/material';

// Components
import Form from './Form';
import Heading from './Heading';
import HeaderConfig from '../functions/HeaderConfig';
import Response from './Response';


function UserForm({ children, api, inputs, heading, confirmInputs, permission, currentRoles, res }) {

    const [roles, setRoles] = useState(currentRoles || [])
    const [response, setResponse] = useState();
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    console.log(permission)

    useState(() => {
        if (!!res)
            setResponse(res);
    }, [res])

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

    const submitForm = async (data) => {
        let formData = data;
        formData.roles = roles;
        await axios.post(`${api}`, formData, HeaderConfig)
            .then(res => {
                if (!!res.data?.token) {
                    localStorage.setItem("token", res.data.token);
                    navigate("/sp/images");
                } else
                    setResponse(res.data)
            }, error => {
                setResponse(error);
            });
    }


    return (
        <div className='wrapper'>
            <Heading title="Form" />
            <Form
                heading={heading}
                inputs={inputs}
                confirmInputs={confirmInputs}
                response={response}
                onSubmit={submitForm}>
                {(!!token && !!permission) && <div className='d-column ai-start'>
                    {["Admin", "Support"].map((role, i) => {
                        return <FormControlLabel key={i} className='input-checkbox' control={
                            <Checkbox color="default" checked={roles.indexOf(role) > -1} onClick={handleRoles} name={role} />
                        } label={role} />
                    })}
                </div>}
            </Form>

            {!!children && children}

            {/* Response */}
            {response && <Response res={response} close={() => setResponse()} />}
        </div>
    )
}

export default UserForm;