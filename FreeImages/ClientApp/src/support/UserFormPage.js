
import { useEffect, useState } from "react";

// Installed
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import jwtDecode from 'jwt-decode';

// Components
import Loading from "../components/Loading";
import UserForm from "../components/UserForm";
import Confirm from "../components/Confirm";

// Functions
import HeaderConfig from "../functions/HeaderConfig";

function UserFormPage({ inputs, api, heading, postRequest }) {

    const [response, setResponse] = useState();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [decoded, setDecoded] = useState();
    const [disabled, setDisabled] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setDecoded(jwtDecode(localStorage.getItem("token")));
        if (!!id) {
            (async () => {
                await axios.get(`user/${id}`, HeaderConfig).then(res => {
                    const data = res?.data;
                    console.log(decoded)
                    if (!!data){
                        setUserData(data);
                        setDisabled(decoded?.Email !== userData?.email || decoded?.Roles.indexOf("Admin") === -1)
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

    const deleteProfile = async () => {
        const res = await axios.delete(`user/profile/${id}`, HeaderConfig);
        setResponse(res.data);
    }

    if (loading) return <Loading />;

    return (
        <UserForm
            inputs={!!inputs ? inputs : {
                name: userData?.name,
                email: userData?.email
            }}
            heading={heading}
            confirmInputs={!!inputs ? ["password", "confirmPassword"] : null}
            permission={decoded?.Roles.indexOf("Admin") > -1}
            disabled={disabled}
            currentRoles={userData?.listRoles}
            api={api}
            postRequest={postRequest}
            res={response}
        >
            {/* Actions buttons */}
            {(!confirm && !postRequest) && <div className="buttons-wrapper d-row js-end ai-end">
                <Button variant="text" color="info" onClick={() => navigate(`/sp/users/edit/password/${id}`)}>
                    Change password
                </Button>
                <Button variant="text" color="error" onClick={() => setConfirm(true)}>
                    Delete profile
                </Button>
            </div>}

            {/* Confirm alert */}
            {(confirm && !postRequest && !disabled) && <Confirm confirm={deleteProfile} reset={() => setConfirm(false)} />}
        </UserForm>
    );
}

export default UserFormPage;