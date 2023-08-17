import { useEffect, useState } from 'react';

// Installed
import { CircularProgress, IconButton } from '@mui/material'
import { DeleteForever, KeyboardReturnTwoTone } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

// Components
import Confirm from './Confirm';

function Heading({ title, button, selected, progress, deleteSelected, reset }) {

    const [confirm, setConfirm] = useState(false);
    const [inProcess, setProcess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setProcess(progress);
    }, [progress])

    const clickHandle = () => {
        setConfirm(!confirm);
        setProcess(!inProcess);
    }

    const deleteItems = () => {
        setProcess(true);
        setConfirm(false);
        deleteSelected();
    }

    const cancelActon = () => {
        clickHandle();
        reset();
    }

    return (
        <div className={"d-column jc-start heading" + (confirm ? " expanded" : "")} >
            <div className='d-row jc-between'>
                <h4 className='heading-title'>{title}</h4>

                <div className='d-row'>
                    {/*  Add new item */}
                    {!!button && <IconButton
                        variant="text"
                        onClick={() => navigate(button.url)}
                        title={button.title}
                        color='info'>
                        {button.icon}
                    </IconButton>}

                    {/* Delete selected */}
                    {progress !== undefined && <IconButton onClick={clickHandle}
                        color='error' title="Delete selected"
                        disabled={selected?.length === 0 || inProcess} className='delete-btn'>
                        {inProcess ? <CircularProgress size={20} color='inherit' />
                            : <DeleteForever />}
                    </IconButton>}

                    {/* Go back */}
                    <IconButton
                        variant="text"
                        onClick={() => navigate(-1)}
                        title="Go back">
                        <KeyboardReturnTwoTone />
                    </IconButton>
                </div>

            </div>

            {/* Confirm alert */}
            {confirm && <Confirm confirm={deleteItems} reset={cancelActon} />}
        </div>
    )
}

export default Heading;