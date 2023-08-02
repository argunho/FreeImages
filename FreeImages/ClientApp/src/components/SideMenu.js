import React, { useEffect, useState } from 'react'
import { Logout, FeaturedPlayList, Image, Close, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

const menu = [
    { name: "Users", link: "users", icon: <FeaturedPlayList /> },
    // { name: "Register user", link: "register", icon: <FeaturedPlayList />, submenu: true },
    { name: "Images", link: "images", icon: <Image /> },
    // { name: "Upload image", link: "upload-image", icon: <UploadFile />, submenu: true },
    { name: "Logout", link: "logout", icon: <Logout /> }
]

function SideMenu(props) {

    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.visible){
            document.body.classList.toggle('body-fixed');
             setTimeout(() => { setVisible(props.visible); }, 100);
        }        
    }, [props.visible])

    // if (!props.authorized) return null;

    const goTo = (link) => {
        setVisible(false);
        setTimeout(() => {
            props.hide(false);
            document.body.classList.toggle('body-fixed');
            navigate(link);
        }, 1000)
    }

    const close = () => {
        setVisible(false);
        document.body.classList.toggle('body-fixed');
        setTimeout(() => { props.hide(false); }, 1000);
    }

    return (
        <div className='menu-wrapper'>
            <div className={`menu${visible ? ' menu-visible' : ''}`}>
                <div className='menu-heading d-row jc-between'>
                    <Button onClick={() => goTo("/")} className='d-row'><Home /> <span>Home</span></Button>
                    <Button className="menu-close" onClick={() => close(false)}><Close /></Button>
                </div>
                <List className='menu-list'>
                    {menu.map((m, i) => (
                        <ListItem key={i}>
                            <ListItemAvatar>
                                <Avatar>
                                    {m.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemButton onClick={() => goTo("/sp/" + m.link)}>
                                <ListItemText primary={m.name} />
                            </ListItemButton>
                        </ListItem >
                    ))}
                </List>
            </div>
        </div>

    )
}
export default SideMenu;