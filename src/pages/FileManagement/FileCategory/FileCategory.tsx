import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import {useTranslation} from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";


export default function FileCategory() {
  const [isLoading, setIsLoading] = useState(true);
  const [menupermisiondata, setMenupermisiondata] = useState<any>();
  const [fileCategory, setFileCategory] = useState([]);
  const [columns, setColumns] = useState<any>([]);


  const location = useLocation();
 const{i18n,t}=useTranslation();


  const deleteUser = () => {
    Swal.fire({
      title: "Are you sure ?",
      text: "You won't be able to revert this !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then((result: any) => {
      if (result.isConfirmed) {
        // console.log("Use clicked ok");
        // deleteApi(id);
      } else {
        // console.log("Use Clicked Cancel");
      }
    });
  };

  let delete_id = "";

  useEffect(() => {
    getList();
    var data = JSON.parse(localStorage.getItem("userdata")!);
    var menudata = data[0]["userPermission"][0]["parentMenu"];
    for (let index = 0; index < menudata.length; index++) {
      var childMenudata = menudata[index]["childMenu"];
      var sas = childMenudata.find((x: any) => x.path == location.pathname);
      if (sas != "undefined") {
        setMenupermisiondata(sas);
        break;
      }
    }
  }, []);

  const getList =async () => {
    try {
    const collectData = {
      "fileCatid": -1 
    }

    const response = await api.post(`FileCategory/GetFileCategory`, collectData)
      console.log("result", response.data.data)
            const data = response.data.data;
            const zonesWithIds = data.map((fileCat: any, index: any) => ({
                ...fileCat,
                serialNo: index + 1,
                id: fileCat.fileCatid,
            }));


            setFileCategory(zonesWithIds);
            setIsLoading(false);

            if (data.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        width: 150,

                        renderCell: (params) => {
                            return [
                                <Stack
                                    spacing={1}
                                    direction="row"
                                    sx={{ alignItems: "center", marginTop: "5px" }}
                                >
                                    {/* {permissionData?.isEdit ? ( */}
                                    <EditIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "blue",
                                            cursor: "pointer",
                                        }}
                                        className="cursor-pointer"
                                        onClick={() => routeChangeEdit(params.row)}
                                    />
                                    {/* ) : ( */}
                                    {/*  "" */}
                                    {/*)} */}
                                    {/*{permissionData?.isDel ? ( */}
                                    <DeleteIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "red",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            handledeleteClick(params.row.id);
                                        }}
                                    />
                                  
                                </Stack>,
                            ];
                        },
                    },

                    {
                        field: "serialNo",
                        headerName: t("text.SrNo"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "fileCatDesc",
                        headerName: t("text.FileCatDescription"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    }                   
                ];
                setColumns(columns as any);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            // setLoading(false);
        }
    };
      
    const adjustedColumns = columns.map((column: any) => ({
      ...column,
  }));


  const accept = () => {
    const collectData = {
      fileCatid : delete_id   
    };
    api
      .delete(`FileCategory/DeleteFileCategory`, {data : collectData})
      .then((response) => {
        // console.log(res.data);
        // console.log("data2222" + res.data.isSuccess);
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          getList();
        } else {
          toast.error(response.data.mesg);
        }
        getList();
      });
  };

  const reject = () => {
    //toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };
  const handledeleteClick = (del_id: any) => {
    // console.log(del_id + " del_id ");
    delete_id = del_id;
    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };

  const routeChangeEdit = (row: any) => {
    let path = `/FileManagement/FileCategoryEdit`;
    navigate(path, {
      state: row,
    });
  };

  // NEXT PAGE
  let navigate = useNavigate();
  const routeChangeAdd = () => {
    let path = `/FileManagement/FileCategoryAdd`;
    navigate(path);
  };

  return (
    <>
      <Grid item lg={6} sm={6} xs={12}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            // border: ".5px solid #FF7722 ",
            marginTop:'3vh'
          }}
        >
          <Paper
            sx={{ width: "100%",
            overflow: "hidden",
            "& .MuiDataGrid-colCell": {
                backgroundColor: "#2B4593",
                color: "#fff",
                fontSize: 17,
                fontWeight: 900
            }, }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog/>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ padding: "20px" }}
              align="left"
            >
           {t("text.FileCategory")}
            </Typography>
            <Divider />

            {/* Search and ADD buttone Start */}
            <Box height={10} />
            <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {menupermisiondata?.isAdd == true ? */}
              {/* ( */}
                <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
              >
               {t("text.add")}
              </Button>
              {/* ):""} */}
              {/* {menupermisiondata?.isPrint == true ? */}
              
              {/* <Button variant="contained" endIcon={<PrintIcon />}>
                  {t("text.print")}
              </Button> */}
              {/* // :""} */}
              
            </Stack>

            {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        <Box>
                            <br />
                            <div style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
                                <DataGrid
                                    rows={fileCategory}
                                    columns={adjustedColumns}
                                    autoHeight
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                    rowSpacingType="border"
                                    pagination={true}
                                    pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                        value: size,
                                        label: `${size}`,
                                    }))}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: 5 } },
                                    }}
                                    slotProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                        },
                                    }}
                                />
                            </div>

                        </Box>)}
            
          </Paper>
        </Card>
        <ToastApp/>
      </Grid>
    </>
  );
}