// Components
import { useEffect, useState } from 'react';

// Installed 
import { Alert, CircularProgress, IconButton, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Close, DeleteForever, Edit, Refresh, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Heading from './Heading';
import Loading from './Loading';

// Functions
import HeaderConfig from '../functions/HeaderConfig';

// Css
import '../assets/css/form.css';

function List(props) {
  List.displayName = "List";

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [columns, setColumns] = useState([]);
  const [inProcess, setProcess] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [response, setResponse] = useState(null);
  const [confirm, setConfirm] = useState(false);

  const defaultColumn = [
    {
      field: 'actions', headerName: 'Actions', sortable: false,
      filterable: false, headerClassName: 'actions-field', width: props.columnWidth,
      disableColumnMenu: true, disableColumnSelector: true, disableColumnFilter: true, headerAlign: "center",
      renderCell: (params) => {
        const id = params.id;
        // e.stopPropagation();
        let buttons = [
          { icon: <Search color="secondary" />, function: () => navigate(`view/${id}`) },
          { icon: <Edit color="primary" />, function: () => navigate(`edit/${id}`) },
          { params }
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

  const deleteSelected = async () => {
    if (selectedRows.length === 0) return;

    await axios.delete(`${props.api}/${selectedRows.toString()}`, HeaderConfig).then(res => {
      setResponse(res.data);
      setProcess(false);
      if (res.data.alert === "success") {
        setRows(rows.filter(x => selectedRows.indexOf(x.id) === -1));
        setSelectedRows([]);
      }
    })
  }

  const reload = () => {
    setResponse();

    if (!!response && response.alert !== "success")
      return;

    setSelectedRows([]);
    getList();
  }

  return (
    <div className='wrapper'>
      <Heading
        title={props.title}
        response={response}
        isConfirmed={() => {
          deleteSelected();
          setConfirm(false);
        }}
        confirm={confirm}
        reload={reload}>

        {/* Sort by keyword */}
        <div className="sort-wrapper d-column">
          <TextField
            name="sort"
            className="sort-input"
            placeholder='Quick search ...'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword?.length === 0 ? <Search color="action" /> :
            <Close color="error"
              onClick={() => setKeyword("")} />}
        </div>

        {/*  Add new item */}
        <IconButton
          onClick={() => navigate(props.button.url)}
          title={props.button.title}
          color='info'>
          {props.button.icon}
        </IconButton>

        {/* Reload page */}
        <IconButton onClick={reload} color="secondary" title="Reload page">
          <Refresh />
        </IconButton>

        {/* Delete selected */}
        <IconButton onClick={() => {
          setConfirm(true);
          setProcess(true);
        }} color='error' title="Delete selected"
          disabled={selectedRows?.length === 0 || inProcess} className='delete-btn'>
          {inProcess ? <CircularProgress size={20} color='inherit' /> : <DeleteForever />}
        </IconButton>

      </Heading>

      {/* Loading */}
      {loading && <Loading />}

      {/* Content */}
      {(!loading && rows.length > 0) && <>

        {/* Items list} */}
        <DataGrid
          rows={keyword?.length > 0 ? rows.filter(x => x?.name?.toLowerCase().includes(keyword) || x?.keywords?.toLowerCase().includes(keyword)) : rows}
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
              color: "#FFFFFF",
              border: 0
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
        />

      </>
      }

      {/* Empty list */}
      {(!loading && rows.length === 0) && <Alert severity='info'>Nothing is found.</Alert>}
    </div >
  )
}

export default List;