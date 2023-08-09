// Components
import { useEffect, useState } from 'react';

// Installed 
import { Alert, AlertTitle, Button, CircularProgress, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Components
import Heading from './Heading';

// Functions
import HeaderConfig from '../functions/HeaderConfig';
import Loading from './Loading';
import { Check, Close, DeleteForever, Edit, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Css
import '../css/form.css';
import Confirm from './Confirm';

function List(props) {

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [inProcess, setProcess] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const defaultColumn = [
    {
      field: 'actions', headerName: 'Actions', sortable: false,
      filterable: false, headerClassName: 'actions-field', width: props.columnWidth,
      disableColumnMenu: true, disableColumnSelector: true, disableColumnFilter: true,  headerAlign: "center",
      renderCell: (params) => {
        const id = params.id;
        let buttons = [
          { icon: <Search color="secondary" />, function: () => navigate(`view/${id}`) },
          { icon: <Edit color="primary" />, function: () => navigate(`edit/${id}`) }
        ];

        if (!props?.view)
          buttons = buttons.slice(1);

        return <div className='row-buttons d-row'>
          {buttons.map((b, i) => {
            return <IconButton key={i} onClick={b.function}>
              {b.icon}
            </IconButton>
          })}
        </div>
      }
    }
  ]

  useEffect(() => { 
    setColumns(props.columns.concat(defaultColumn));
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getList = async () => {
    const response = await fetch(props.api, HeaderConfig);
    const data = await response.json();
    setLoading(false);
    setRows(data);
  }

  // const clickHandle = async (e) => {
  //   e.stopPropagation();
  // }

  const clickHandle = () => {
    setConfirm(!confirm);
    setProcess(!inProcess);
  }

  const reset = () => {
    clickHandle();
    setSelectedRows([]);
  }

  const deleteSelected = async () => {
    if (selectedRows.length === 0) return;
    setConfirm(false);

    await axios.delete(`${props.api}/${selectedRows.toString()}`, HeaderConfig).then(res => {
      setProcess(false);
      getList();
    })
  }

  return (
    <div className='wrapper'>
      <Heading title={props.title} button={props.button} />

      {/* Loading */}
      {!!loading && <Loading />}

      {/* Delete selected */}
      {!loading && <div className='buttons-wrapper d-row jc-end'>
        {!confirm && <Button onClick={clickHandle} color='error' variant='contained' disabled={selectedRows.length === 0 || inProcess} className='delete-btn'>
          {inProcess ? <CircularProgress style={{ marginRight: "14px" }} size={20} color='inherit' />
            : <DeleteForever style={{ marginRight: "10px" }} />} Delete selected
        </Button>}

        {/* Confirm alert */}
        {confirm && <Confirm confirm={deleteSelected} reset={reset} />}
      </div>}


      {/* Items list} */}
      {(!loading && rows.length > 0) && <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        density='comfortable'
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "stretch",
          '& .MuiDataGrid-columnHeaders, .MuiDataGrid-columnHeadersInner:hover .MuiSvgIcon-root, .MuiDataGrid-columnHeadersInner .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root': {
            color: "#FFFFFF"
          },
          '& .MuiDataGrid-columnHeadersInner': {
            width: "100%",
            backgroundColor: "#010A4F",
            textAlign: "center"
          },
          '& .MuiDataGrid-row': {
            backgroundColor: inProcess ? "#cccccc2c" : "#FFFFFF",
            pointerEvents: inProcess ? "none" : "auto"
          }
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10
            }
          }
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        onRowSelectionModelChange={(ids) => {
          setSelectedRows(ids);
        }}
        // checkboxSelection={true}
        rowSelectionModel={selectedRows}
        rowCount={rows.length}
        experimentalFeatures={{
          lazyLoading: true,
        }}
      />}

      {/* Empty list */}
      {(!loading && rows.length === 0) && <Alert severity='info'>Nothing is found.</Alert>}
    </div>
  )
}

export default List;