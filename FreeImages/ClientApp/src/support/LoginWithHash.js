
import { useEffect, useState } from "react";

// Installed
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Components
import Loading from "../components/Loading";
import Response from "../components/Response";

function LoginWithHash() {
    LoginWithHash.displayName = "LoginWidthHash";

    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState();
    const [authorized, setAuthorized] = useState(false);

    const { hash } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!!token)
            navigate("/sp/images");

        document.title = "Free Images | Login"

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        login();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash])

    const login = async () => {
        await axios.get("account/LoginWithoutPassword/" + hash)
            .then(res => {
                setLoading(false)
                setResponse(res.data);
                if (!!res.data.token) {
                    setAuthorized(true);
                    localStorage.setItem("token", res.data.token);
                    setTimeout(() => {
                        window.location.href = "/sp/images";
                    }, 2000)
                } else
                    console.error(res.message);
            })
    }

    if (loading)
        return (
            <Loading>
                <p className="login-in-progress">Please wait, your login is in progress</p>
            </Loading>
        )

    return (
        <div className={"d-column"}>
            {authorized && <h3 className="login-heading">
                <p>Welcome {response.user}</p>
            </h3>}

            {/* Response */}
            {!!response && <Response res={response} close={() => {
                setResponse();
                navigate("/");
            }}/>}
        </div>
    )
}

export default LoginWithHash;