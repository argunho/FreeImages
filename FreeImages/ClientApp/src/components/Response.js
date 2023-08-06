import { Alert, AlertTitle } from "@mui/material";

function Response({ res, close }) {

    const capitalize = (str) => {
        if (!str) return;
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return <div className={'slide-in-bottom alert-wrapper ' + res?.alert}>
        <Alert className='alert' severity={res?.alert} variant='filled' onClose={close}>
            <AlertTitle>{capitalize(res?.message)}</AlertTitle>
            {!!res?.text && <p dangerouslySetInnerHTML={{ __html: res?.text }}></p>}
        </Alert>
    </div>
}

export default Response;

{/* <Alert variant="outlined" severity={res?.alert} onClick={close}> 
        {res?.message ? res.message : "Successfully!"}
    </Alert> */}