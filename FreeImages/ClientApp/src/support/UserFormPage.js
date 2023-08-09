
import { useEffect, useState } from "react";

// Installed
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import jwtDecode from 'jwt-decode';

// Components
import UserForm from "../components/UserForm";
import Confirm from "../components/Confirm";

// Functions
import HeaderConfig from "../functions/HeaderConfig";

function UserFormPage({ inputs, api, heading }) {

    const [response, setResponse] = useState();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [decoded, setDecoded] = useState();
    const [disabled, setDisabled] = useState(false);
    const [confirmPasswordChange, setConfirmPasswordChange] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const decodedToken = jwtDecode(localStorage.getItem("token"));
        setDecoded(decodedToken);
        if (!!id) {
            (async () => {
                await axios.get(`user/${id}`, HeaderConfig).then(res => {
                    const data = res?.data;
                    console.log(decoded)
                    if (!!data) {
                        setUserData(data);
                        setDisabled(decodedToken?.Email !== data?.email && data?.roles.indexOf("Admin") > -1 && permission("Support"));
                    }
                    else
                        setResponse({ alert: "error", message: "User not found!" });

                    setLoading(false);
                })
            })();
        } else
            setLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const sendNewPassword = async () => {
        reset();
        const res = await axios.put(`account/setNewPassword/${id}`, userData, HeaderConfig);
        setResponse(res?.data);
    }

    const deleteProfile = async () => {
        reset();
        const res = await axios.delete(`user/profile/${id}`, HeaderConfig);
        setResponse(res?.data);
        if(res.data.alert === "success"){
            setTimeout(() => {
                navigate("/sp/users");
            }, 2000)
        }
            
    }

    const permission = (role) => {
        return decoded?.Roles.indexOf(role) > -1;
    }

    const reset = () => {
        setConfirmDelete(false);
        setConfirmPasswordChange(false);
    }

    return (
        <UserForm
            inputs={!!inputs ? inputs : {
                name: userData?.name,
                email: userData?.email
            }}
            user={userData}
            loading={loading}
            heading={heading}
            confirmInputs={!!inputs ? ["password", "confirmPassword"] : null}
            permission={permission("Admin") && api !== "account/changePassword"}
            disabled={disabled || confirmDelete || confirmPasswordChange}
            api={api}
            res={response}
        >
            {/* Actions buttons */}
            {(!confirmDelete && !confirmPasswordChange && api === "user" && !disabled) && <div className="buttons-wrapper d-row js-end ai-end">

                {/* Set new password */}
                {(permission("Admin") || permission("Support")) &&
                    <Button variant="text" color="warning" onClick={() => setConfirmPasswordChange(true)}>
                        Send password
                    </Button>}

                {/* Change password for all users */}
                <Button variant="text" color="info" onClick={() => navigate(`/sp/users/edit/password/${id}`)}>
                    Change password
                </Button>

                {/* Delete user profile */}
                <Button variant="text" color="error" onClick={() => setConfirmDelete(true)}>
                    Delete profile
                </Button>
            </div>}

            {/* Confirm alert */}
            {((confirmDelete || confirmPasswordChange) && !!userData) && 
                <Confirm confirm={confirmDelete ? deleteProfile : sendNewPassword} reset={reset} />}
        </UserForm>
    );
}

export default UserFormPage;