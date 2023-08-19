// Installed
import { IconButton } from '@mui/material'
import { KeyboardReturnTwoTone} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

// Components
import Confirm from './Confirm';
import Response from './Response';

function Heading({ children, title, visible, confirm, response, isConfirmed, reload }) {
    Heading.displayName = "Heading";

    const navigate = useNavigate();

    return (
        <div className={"d-column jc-start heading" + (confirm ? " expanded" : "")} 
            style={{overflow: !!visible ? "visible" : "hidden"}}>
            <div className='d-row jc-between'>
                <h4 className='heading-title'>{title}</h4>

                <div className='d-row'>

                    {/* Children */}
                    {!!children && children}

                    {/* Go back */}
                    <IconButton
                        onClick={() => navigate(-1)}
                        title="Go back">
                        <KeyboardReturnTwoTone />
                    </IconButton>
                </div>

            </div>

            {/* Confirm alert */}
            {!!confirm && <Confirm confirm={isConfirmed} reset={reload} />}

            {!!response && <Response res={response} close={reload} />}
        </div >
    )
}

export default Heading;