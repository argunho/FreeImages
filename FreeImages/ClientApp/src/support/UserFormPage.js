
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
    const [confirm, setConfirm] = useState(false);
    const [decoded, setDecoded] = useState();
    const [disabled, setDisabled] = useState(false);

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
                    if (!!data){
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

    const deleteProfile = async () => {
        const res = await axios.delete(`user/profile/${id}`, HeaderConfig);
        setResponse(res.data);
    }

    const permission = (role) => {
        return decoded?.Roles.indexOf(role) > -1;
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
            disabled={disabled}
            api={api}
            res={response}
        >
            {/* Actions buttons */}
            {(!confirm && api === "user" && !disabled) && <div className="buttons-wrapper d-row js-end ai-end">
                <Button variant="text" color="info" onClick={() => navigate(`/sp/users/edit/password/${id}`)}>
                    Change password
                </Button>
                <Button variant="text" color="error" onClick={(e) => {
                    e.stopPropagation();
                    setConfirm(true);
                }}>
                    Delete profile
                </Button>
            </div>}

            {/* Confirm alert */}
            {(confirm && !!userData) && <Confirm confirm={deleteProfile} reset={() => setConfirm(false)} />}
        </UserForm>
    );
}

export default UserFormPage;