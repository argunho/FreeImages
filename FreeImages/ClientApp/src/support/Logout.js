import { MeetingRoom } from '@mui/icons-material';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Logout(props) {

    const navigate = useNavigate();

    useEffect(() => { logout(); }, [])

    const logout = async () => {
        const response = await fetch('account/logout');
        if (response.status === 200) {
            localStorage.removeItem("token");
            setTimeout(() => { navigate("/") }, 100);
        }
    }

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