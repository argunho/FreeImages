import React, { useEffect, useState } from 'react'

const menu = [
    { name: "Users", link: "users" },
    { name: "Images", link: "images" },
    { name: "Upload image", link: "upload-image" },
    { name: "Logout", link: "logout" }
]

export default function Menu({authorized, visible}) {

    if (!authorized) return null;

    return (
        <div>Menu</div>
    )
}
