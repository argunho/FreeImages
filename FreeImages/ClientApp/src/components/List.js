// Components
import { useEffect, useState } from 'react';

// Installed 
import { Alert, AlertTitle, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Components
import Heading from './Heading';

// Functions
import HeaderConfig from '../functions/HeaderConfig';
import Loading from './Loading';
import { Check, Close, Delete, DeleteForever, Edit, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Css
import '../css/form.css';

function List(props) {

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const defaultColumn = [
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      headerClassName: 'actions-field',
      width: props.columnWidth,
      disableColumnMenu: true,
      disableColumnSelector: true,
      disableColumnFilter: true,
      headerAlign: "center",
      renderCell: (params) => {
        const id = params.id;

        const deleteItem = async (e) => {
          e.stopPropagation();
          console.log(id)
          setConfirmId(id);
        }

        let buttons = [
          { icon: <Search color="secondary" />, function: () => navigate(`view/${id}`) },
          { icon: <Edit color="primary" />, function: () => navigate(`edit/${id}`) },
          { icon: <Delete color="error" />, function: (e) => deleteItem(e) }
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
    setLoading(true);
    const arr = props.columns.concat(defaultColumn);
    console.log(arr)
    setColumns(arr);
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getList = async () => {
    console.log(props.api)
    const response = await fetch(props.api, HeaderConfig);
    const data = await response.json();
    setLoading(false);
    setRows(data);
  }

  const clickHandle = async (e) => {
    e.stopPropagation();
    setConfirmId(null);
    console.log(confirmId)
    await axios.delete(`${props.api}/${confirmId}`, HeaderConfig).then(res => {
      console.log(res);
    })
  }

  const deleteSelected = async () => {
    console.log(selectedRows.toString())
    await axios.delete(`${props.api}/${selectedRows.toString()}`, HeaderConfig).then(res => {
      console.log(res);
    })
  }

  return (
    <div className='wrapper'>
      <Heading title={props.title} button={props.button} />

      {/* Loading */}
      {!!loading && <Loading />}

      {/* Delete selected */}
      {!loading && <div className='buttons-wrapper d-row jc-end'>
        <Button onClick={deleteSelected} color='error' variant='contained' disabled={selectedRows.length === 0} size='medium'>
          <DeleteForever style={{ marginRight: "10px" }} /> Delete selected
        </Button>
      </div>}

      {/* Confirm aler */}
      {!!confirmId && <Alert severity='error' color='error' variant='standard' className="confirm-alert d-row jc-between">
        <AlertTitle>Are you sure to do it?</AlertTitle>
        <div className='confirm-buttons'>
          {[
            { icon: <Check color="error" />, function: (e) => clickHandle(e) },
            { icon: <Close color="inherit" />, function: () => setConfirmId(null) }
          ].map((b, i) => {
            return <IconButton key={i} onClick={b.function}>
              {b.icon}
            </IconButton>
          })}
        </div>
      </Alert>}

      {/* Items list} */}
      {(!loading && rows.length > 0) && <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[15]}
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
            backgroundColor: !!confirmId ? "#cccccc2c" : "#FFFFFF",
            pointerEvents: !!confirmId ? "none" : "auto"
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
      />}

      {/* Empty list */}
      {(!loading && rows.length === 0) && <Alert severity='info'>Nothing is found.</Alert>}
    </div>
  )
}

export default List;