import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Box,
    Divider,
    Stack,
    Button,
    Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import { useNavigate } from "react-router-dom";
import {
    DataGrid,
    GridColDef,
    GridToolbar,
} from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import SwipeableDrawerRoute from "./SwipeableDrawerRoute";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import { useLocation } from "react-router-dom";


export default function RouteAdd() {
    const { i18n, t } = useTranslation();
    const location = useLocation();
    const [rows, setRows] = useState<any>([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [drawerOpenUser, setDrawerOpenUser] = useState(false);
    const [drawerData, setDrawerData] = useState<any>([]);
    const [hover, setHover] = useState(null);
    const [permissionData, setPermissionData] = useState<any>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
      });
       
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
    }, [isLoading,drawerOpenUser, drawerData]);


    let navigate = useNavigate();

    const routeChangeEdit = (row: any) => {
        console.log("row " + row);

        let path = `/E-Office/RouteEdit`;
        navigate(path, {
            state: row,
        });
    };

    const routeChangeAdd = () => {
        let path = `/E-Office/RouteAdd`;
        navigate(path);
    };


    let delete_id = "";

    const accept = () => {
        const collectData = {
            id: delete_id
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`RouteMemberCycle/DeleteRouteMemberCycle`, { data: collectData })
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


    const getList = () => {
        const collectData = {
            "id": -1,
            "authorityId": -1,
            "routeId": -1,
            "officeId": -1,
            "committeeOrGroupId": -1,
            "auth_DeptId": -1,
            "auth_SectionId": -1
        };
        try {
            api
                .post(`RouteMemberCycle/GetRouteMemberCycle`, collectData)
                .then((res) => {
                    // console.log("result" + JSON.stringify(res.data.data));
                    const data = res.data.data;
                    const arr = data.map((item: any, index: any) => ({
                        ...item,
                        serialNo: index + 1,
                        id: item.id,
                    }));
                    setRows(arr);
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
                                            <SwipeableDrawerRoute
                                                open={drawerOpenUser}
                                                onClose={() =>
                                                    setDrawerOpenUser(!drawerOpenUser)}
                                                userData={drawerData}
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
                                field: "routeName",
                                headerName: "Route Name",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "totalLevel",
                                headerName: "Level",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "memberList",
                                headerName: "Member List",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                                renderCell: (params) => {
                                    const isHovered = hover === params.row.id;
                                    return (
                                        <a
                                        href="#"
                                        onClick={(event) => getDrawerData(params.row)}
                                        >
                                            Member List
                                        </a>
                                    );
                                }
                            },
                            

                        ];
                        setColumns(columns as any);
                    }
                });
            // setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            // setIsLoading(false);
        }
    };

    const getDrawerData = (row: any) => {

        console.log(row);
        setDrawerData([row]);
        console.log(drawerData);
        console.log("drawerOpen",drawerOpenUser)

        if (drawerOpenUser) {
            setDrawerOpenUser(false);
        } else {
            setDrawerOpenUser(true);
        }
    };


    const adjustedColumns = columns.map((column: any) => ({
        ...column,
    }));
    return (
        <>
            <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
                <Card
                    style={{
                        width: "100%",
                        height: "50%",
                        border: ".5px solid #00009c ",
                        backgroundColor: "#E9FDEE",
                        marginTop: "5px",
                    }}
                >
                    <Paper
                        // sx={{
                        //     width: "100%",
                        //     overflow: "hidden",
                        //     "& .MuiDataGrid-colCell": {
                        //         backgroundColor: "#00009c",
                        //         color: "#fff",
                        //         fontSize: 18,
                        //         fontWeight: 800,
                        //     },
                        // }}
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
                            {t("text.Route")}
                        </Typography>
                        <Divider />

                        <Box height={10} />

                        <Stack direction="row" spacing={2} classes="my-2 mb-2">
                            {/* {permissionData?.isAdd == true && ( */}
                            <Button
                                onClick={routeChangeAdd}
                                variant="contained"
                                endIcon={<AddCircleIcon />}
                                style={{backgroundColor:`var(--grid-headerBackground)`,color: `var(--grid-headerColor)`}}
                                size="large"
                            >
                                {t("text.add")}
                            </Button>

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
                            <CustomDataGrid
                            isLoading={isLoading}
                            rows={rows}
                            columns={adjustedColumns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            initialPageSize={5}
                        />)}
                    </Paper>
                </Card>
            </Grid >
            <ToastApp />
        </>
    );
}
