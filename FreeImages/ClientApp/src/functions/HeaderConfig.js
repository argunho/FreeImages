const HeaderConfig = {
    header: {
        "Authorization": `Bearer: ${localStorage.getItem("token")}`,
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Headers": '*'
    }
}

export default HeaderConfig;