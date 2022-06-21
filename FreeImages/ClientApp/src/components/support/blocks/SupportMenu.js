import { FormLabel, List, ListItemButton, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import './../../../css/support.css'

const menu = [
    { name: "Users", link: "users" },
    { name: "Images", link: "images" },
    { name: "Upload image", link: "upload-image" },
    { name: "Logout", link: "logout" }
]

export default function SupportMenu(props) {

    const [visible, setVisible] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            setVisible(props.visible);
        }, 500);
    }, [props.visible])

    // if (!props.authorized) return null;

    return (
        <div className={`menu${visible ? ' menu-visible' : ''}`}>
            <FormLabel>Menu</FormLabel>

            <List>
                {menu.map((m,i) =>(
                    <ListItemButton key={i} onClick={() => history.push("/support/" + m.link)}>             
                        <ListItemText primary={m.name} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    )
}
