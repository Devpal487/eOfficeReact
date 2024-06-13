import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
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
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import api from "../../../utils/Url";
import CircularProgress from "@mui/material/CircularProgress";
import {useTranslation} from "react-i18next";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";

function createData(
  srno: number,
  id: string,
  menuName: string,
  parentId:number,
  parentName:string,
  pageUrl: string,
  icon: string,
 displayNo: number,
  // isMenu: boolean,
  isAdd: boolean,
  isEdit: boolean,
  isDel: boolean,
  isView: boolean,
  isPrint: boolean,
  isExport: boolean,
  isRelease: boolean,
  isPost: boolean,
 
): any {
  return {
    srno,id,menuName,pageUrl,icon,
    displayNo,
    // isMenu,
    isAdd,isEdit,isDel,isView,isPrint,isExport,isRelease,isPost,parentId, parentName
  };
}

export default function MenuMaster() {
  const [page, setPage] = useState(0);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<any>([]);
  const [records, setRecords] = useState(rows);
  const [isLoading, setIsLoading] = useState(true);
  const [menupermisiondata, setMenupermisiondata] = useState<any>();

const{i18n,t}=useTranslation();
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
      const zonesWithIds = data.map((zone: any, index:any) => ({
        ...zone,
        serialNo:index+1,
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

            renderCell: (params:any) => {
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
                  {/* ) : (
                    ""
                  )}
                  {permissionData?.isDel ? ( */}
                    {/* <DeleteIcon
                      style={{
                        fontSize: "20px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handledeleteClick(params.row.id);
                      }}
                    /> */}
                  {/* ) : (
                    ""
                  )} */}
                  {/* <Switch
                    checked={Boolean(params.row.isActive)}
                    style={{
                      color: params.row.isActive ? "green" : "#FE0000",
                    }}
                    onChange={(value: any) =>
                      handleSwitchChange(value, params.row)
                    }
                    inputProps={{
                      "aria-label": "Toggle Switch",
                    }}
                  /> */}
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
            border: ".5px solid green ",
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
                fontWeight:900 
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
           {/* {menupermisiondata?.isAdd == true ?( */}
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
              >
                {t("text.add")}
              </Button> {/*):""} */ }
              {/* {menupermisiondata?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />}>
                 {t("text.print")}
              </Button>):""}
              */}
              
            </Stack>

            {/* Search END */}

            {isLoading ? (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <CircularProgress/>
              </div>
            ) : (
              <Box>
                <br></br>
                <div style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
            
            <DataGrid
              rows={zones}
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
      </Grid>
    </div>
  );
}