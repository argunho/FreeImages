// Components
import { useEffect, useState } from 'react';

// Installed 
import { Alert, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Heading from './Heading';
import Loading from './Loading';

// Functions
import HeaderConfig from '../functions/HeaderConfig';

// Css
import '../css/form.css';

function List(props) {
  List.displayName = "List";

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [inProcess, setProcess] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [response, setResponse] = useState(null);

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
        setRows(rows.filter(x => selectedRows.some(y => y !== x.id)));
    })
  }

  return (
    <div className='wrapper'>
      <Heading 
      title={props.title} 
      button={props.button} 
      selected={selectedRows}
      response={response}
      deleteSelected={() => {
        deleteSelected();
        setProcess(true);
       }}
      reset={() => setSelectedRows([])} />

      {/* Loading */}
      {!!loading && <Loading />}

      {/* Content */}
      {(!loading && rows.length > 0) && <>

        {/* Items list} */}
        <DataGrid
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

      </>}

      {/* Empty list */}
      {(!loading && rows.length === 0) && <Alert severity='info'>Nothing is found.</Alert>}
    </div>
  )
}

export default List;