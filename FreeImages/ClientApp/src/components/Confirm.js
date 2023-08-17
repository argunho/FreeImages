
// Installed
import { Check, Close } from "@mui/icons-material";
import { Alert, AlertTitle, IconButton } from "@mui/material";

function Confirm({ confirm, reset }) {
    Confirm.displayName = "Confirm";

    return (
        <Alert severity='error' color='error' variant='standard' 
        className="confirm-alert d-row jc-between">
            <AlertTitle>Are you sure to do it?</AlertTitle>
            <div className='confirm-buttons'>
                <IconButton onClick={confirm}>
                    <Check color="error" />
                </IconButton>
                <IconButton onClick={reset}>
                    <Close color="inherit" />
                </IconButton>
            </div>
        </Alert>
    )
}

export default Confirm;