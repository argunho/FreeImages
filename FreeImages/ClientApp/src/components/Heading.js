import { useEffect, useState } from 'react';

// Installed
import { CircularProgress, IconButton, TextField } from '@mui/material'
import { Close, DeleteForever, KeyboardReturnTwoTone, Refresh, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

// Components
import Confirm from './Confirm';
import Response from './Response';

function Heading({ title, button, selected, response, sortByKeyword, deleteSelected, reload }) {
    Heading.displayName = "Heading";

    const [confirm, setConfirm] = useState(false);
    const [inProcess, setProcess] = useState(false);
    const [keyword, setKeyword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!!response)
            setProcess(false);
    }, [response])

    const clickHandle = () => {
        setConfirm(!confirm);
        setProcess(!inProcess);
    }

    const deleteItems = () => {
        setConfirm(false);
        deleteSelected();
    }

    const cancelActon = () => {
        clickHandle();
        reload();
    }

    return (
        <div className={"d-column jc-start heading" + (confirm ? " expanded" : "")} >
            <div className='d-row jc-between'>
                <h4 className='heading-title'>{title}</h4>

                <div className='d-row'>
                    {/* Sort by keyword */}
                    <div className="sort-wrapper d-column">
                        <TextField
                            name="sort"
                            className="sort-input"
                            placeholder='Quick search ...'
                            value={keyword}
                            onChange={(e) => {
                                sortByKeyword(e.target.value?.toLowerCase());
                                setKeyword(e.target.value);
                            }}
                        />
                        {keyword?.length === 0 ? <Search color="action" /> :
                            <Close color="error"
                                onClick={() => {
                                    sortByKeyword("");
                                    setKeyword("");
                                }} />}

                    </div>

                    {/*  Add new item */}
                    {!!button && <>
                        <IconButton
                            onClick={() => navigate(button.url)}
                            title={button.title}
                            color='info'>
                            {button.icon}
                        </IconButton>

                        {/* Reload page */}
                        <IconButton onClick={reload} color="secondary" title="Reload page">
                            <Refresh />
                        </IconButton>

                        {/* Delete selected */}
                        <IconButton onClick={clickHandle}
                            color='error' title="Delete selected"
                            disabled={selected?.length === 0 || inProcess} className='delete-btn'>
                            {inProcess ? <CircularProgress size={20} color='inherit' />
                                : <DeleteForever />}
                        </IconButton>
                    </>}

                    {/* Go back */}
                    <IconButton
                        onClick={() => navigate(-1)}
                        title="Go back">
                        <KeyboardReturnTwoTone />
                    </IconButton>
                </div>

            </div>

            {/* Confirm alert */}
            {confirm && <Confirm confirm={deleteItems} reset={cancelActon} />}

            {!!response && <Response res={response} close={reload} />}
        </div >
    )
}

export default Heading;