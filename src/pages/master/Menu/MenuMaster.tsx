import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";


export default function MenuMaster() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<any>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const { i18n, t } = useTranslation();
  const location = useLocation();



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
      } else {
        // console.log("Use Clicked Cancel");
      }
    });
  };

  let delete_id = "";
  useEffect(() => {
    const dataString = localStorage.getItem("userdata");
    if (dataString) {
      const data = JSON.parse(dataString);
      if (data && data.length > 0) {
        const userPermissionData = data[0]?.userPermission;
        if (userPermissionData && userPermissionData.length > 0) {
          const menudata = userPermissionData[0]?.parentMenu;
          for (let index = 0; index < menudata.length; index++) {
            const childMenudata = menudata[index]?.childMenu;
            const pathrow = childMenudata.find(
              (x: any) => x.path === location.pathname
            );
            console.log("data", pathrow);
            if (pathrow) {
              setPermissionData(pathrow);
              getList();
            }
          }
        }
      }
    }
    
    
  }, [isLoading,location.pathname]);


  const routeChangeEdit = (row: any) => {
    // console.log(row);
    let path = `/master/MenuMasterEdit`;
    navigate(path, {
      state: row,
    });
  };

  /// NEXT PAGE

  let navigate = useNavigate();
  const routeChangeAdd = () => {
    let path = `/master/MenuMasterAdd`;
    navigate(path);
  };

  
  const accept = () => {
    const collectData = {
      menuId: delete_id
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`Menu/DeleteMenuMaster`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          getList();
        } else {
          toast.error(response.data.mesg);
        }
      });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
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

  const getList = async () => {
    try {
      const collectData = {
        menuId: -1
      };
      const response = await api.post(
        `Menu/GetMenuMaster`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.menuId,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 150,

            renderCell: (params: any) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  {permissionData?.isEdit ? ( 
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  />
                  ) : (
                    ""
                  )}
                  {permissionData?.isDel ? ( 
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
                  ) : (
                    ""
                  )} 
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
            field: "parentName",
            headerName: t("text.ParentName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "menuName",
            headerName: t("text.MenuName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "pageUrl",
            headerName: t("text.PageURL"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "displayNo",
            headerName: "displayNo",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "icon",
            headerName: t("text.Icon"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

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


  return (
    <div>
      <Grid item lg={6} sm={6} xs={12}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593 ",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              "& .MuiDataGrid-colCell": {
                backgroundColor: "#00009C",
                color: "#fff",
                fontSize: 17,
                fontWeight: 900
              },
            }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog />
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ padding: "20px" }}
              align="left"
            >
              {t("text.MenuMaster")}
            </Typography>
            <Divider />

            {/* Search and ADD buttone Start */}
            <Box height={10} />
            <Stack direction="row" spacing={2} classes="my-2 mb-2">
              {permissionData?.isAdd == true ?(
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
              >
                {t("text.add")}
              </Button> ):""} 

            </Stack>

            {/* Search END */}

            {isLoading ? (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <CircularProgress />
              </div>
            ) : (
              <CustomDataGrid
                isLoading={isLoading}
                rows={zones}
                columns={adjustedColumns}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                initialPageSize={5}
              />)}
          </Paper>
        </Card>
      </Grid>
    </div>
  );
}