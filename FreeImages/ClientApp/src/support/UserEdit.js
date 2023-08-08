
import { useEffect, useState } from "react";

// Installed
import { useParams } from "react-router-dom";
import axios from "axios";

// Components
import Loading from "../components/Loading";
import UserForm from "../components/UserForm";

// Functions
import HeaderConfig from "../functions/HeaderConfig";

function UserEdit({inputs, confirmInputs}) {

    const [response, setResponse] = useState();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        console.log(id)
        if (!!id) {
            (async () => {
                await axios.get(`user/${id}`, HeaderConfig).then(res => {
                    const data = res?.data;
                    if (!!data) {
                        setUserData(data);
                        console.log(33,inputs)
                        console.log(34,data)
                        if(inputs?.name && inputs?.email){
                            console.log(36,inputs)

                        }
                    } else {
                        setResponse({alert: "error", message: "User not found!"});
                    }
                    setLoading(false);
                })
            })();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    if (loading) return <Loading />;

    return (
        <UserForm
            inputs={inputs}
            heading={"Edit user: " + (!!userData ? userData?.name : "Unknown")}
            confirmInputs={confirmInputs}
            res={response} 
        >

        </UserForm>
    );
}

export default UserEdit;