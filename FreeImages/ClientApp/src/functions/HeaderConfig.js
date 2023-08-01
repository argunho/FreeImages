const HeaderConfig = {
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Headers": '*'
    }
}

export default HeaderConfig;