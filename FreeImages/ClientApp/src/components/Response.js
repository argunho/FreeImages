// Installed
import { Alert, AlertTitle } from "@mui/material";

function Response({ res, close }) {
    Response.displayName = "Response";

    const capitalize = (str) => {
        if (!str) return;
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return <div className={'slide-in-bottom alert-wrapper ' + res?.alert}>
        <Alert className='alert' severity={res?.alert} variant='filled' onClose={close}>
            <AlertTitle>{capitalize(res?.alert)}</AlertTitle>
            {!!res?.message && <p dangerouslySetInnerHTML={{ __html: res?.message }}></p>}
        </Alert>
    </div>
}

export default Response;