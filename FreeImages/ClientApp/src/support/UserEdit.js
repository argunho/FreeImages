
import { useEffect, useState } from "react";

// Installed
import { useParams } from "react-router-dom";
import axios from "axios";

// Components
import Loading from "../components/Loading";
import UserForm from "../components/UserForm";

// Functions
import HeaderConfig from "../functions/HeaderConfig";

function UserEdit({inputs, confirmInputs, api}) {

    const [response, setResponse] = useState();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        setLoading(true);

        if (!!id) {
            (async () => {
                await axios.get(`user/${id}`, HeaderConfig).then(res => {
                    const data = res?.data;
                    console.log(data.user)
                    if (!!data) 
                        setUserData(data);
                    else 
                        setResponse({alert: "error", message: "User not found!"});
                    
                    setLoading(false);
                })
            })();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    if (loading) return <Loading />;

    return (
        <UserForm
            inputs={!!inputs ? inputs : {
                name: userData?.user.name,
                email: userData?.user.email
            }}
            heading={"Edit user: " + (!!userData ? userData?.user.name : "Unknown")}
            confirmInputs={confirmInputs}
            permission={userData?.permission}
            currentRoles={userData?.user.listRoles}
            res={response} 
        />
    );
}

export default UserEdit;