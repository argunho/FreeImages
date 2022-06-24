import { MeetingRoom } from '@mui/icons-material';
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';

export default function Logout(props) {

    const history = useHistory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {  logout(); }, [])

    const logout = async () => {
        const response = await fetch('account/logout');
        if (response.status === 200) {
            localStorage.removeItem("token");
            setTimeout(() => { history.push("/") }, 100);
        }
    }

    return <div className="logout-block">
        <p className="logout-symbol"><MeetingRoom /></p>
        You log out ...
    </div>
}