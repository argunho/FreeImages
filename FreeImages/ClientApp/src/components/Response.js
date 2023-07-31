import { Alert } from "@mui/material";

function Response({res, close}){

    return <Alert variant="outlined" severity={res?.alert} onClick={close}> 
        {res?.message ? res.message : "Successfully!"}
    </Alert>
}

export default Response;