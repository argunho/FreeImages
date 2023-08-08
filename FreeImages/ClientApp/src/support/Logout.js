import { useEffect } from 'react'

// Installed
import { MeetingRoom } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Functions
import HeaderConfig from '../functions/HeaderConfig';

function Logout() {

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const response = await fetch('account/logout', HeaderConfig);
            if (response.status === 200) {
                setTimeout(() => {
                    localStorage.removeItem("token");
                    navigate("/");
                }, 100);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="logout-block">
            <div>
                <p className="logout-symbol"><MeetingRoom /></p>
                Please wait, you are logging out ...
            </div>
        </div>
    )
}

export default Logout;