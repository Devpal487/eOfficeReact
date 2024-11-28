import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridToolbar,
} from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
    Box,
    Button,
    Divider,
    Stack,

    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import dayjs, { Dayjs } from "dayjs";
import CustomDataGrid from "../../../utils/CustomDatagrid";


interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function CommitteeEmployeeMapping() {
    const [zones, setZones] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });


    let navigate = useNavigate();
    const { t } = useTranslation();

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
                            fetchZonesData();
                        }
                    }
                }
            }
        }
    }, [isLoading]);
    
    // console.log("🚀 ~ useEffect ~ isAdd:", permissionData.isAdd)

    
    const routeChangeAdd = () => {
        let path = `/E-Office/CommitteeEmployeeMappingAdd`;
        navigate(path);
    };

    const routeChangeEdit = (row: any) => {
        let path = `/E-Office/CommitteeEmployeeMappingEdit`;
        navigate(path, {
            state: row,
        });
    };

    let delete_id = "";

    const accept = () => {
        const collectData = {
            id: delete_id
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`CommitteeEmp_Mapping/DeleteCommitteeEmp_Mapping`, { data: collectData })
            .then((response) => {
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                } else {
                    toast.error(response.data.mesg);
                }
                fetchZonesData();
            });
    };

    const reject = () => {
        toast.warn("Rejected: You have rejected", { autoClose: 3000 });
    };

    const handledeleteClick = (del_id: any) => {
        delete_id = del_id;
        confirmDialog({
            message: t("text.DoYouWantToDeleteThisRecord"),
            header: t("text.DeleteConfirmation"),
            icon: "pi pi-info-circle",
            acceptClassName: "p=-button-danger",
            accept,
            reject,
        });
    };


    const fetchZonesData = async () => {
        try {
            const collectData = {
                "id": -1,
                "empId": -1,
                "committeeId": -1,
                "officeId": -1,
                "userId": "",
                "ipAddress": "",
                "divisionid": -1
            };
            console.log("collectData", collectData)
            const response = await api.post(
                `CommitteeEmp_Mapping/GetCommitteeEmp_Mapping`,
                collectData
            );
            const data = response.data.data;
            console.log("🚀 ~ fetchZonesData ~ data:", data)
            const zonesWithIds = data.map((emp: any, index: any) => ({
                ...emp,
                serialNo: index + 1,
                id: emp.id,
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

                        renderCell: (params) => {
                            return [
                                <Stack
                                    spacing={1}
                                    direction="row"
                                    sx={{ alignItems: "center", marginTop: "5px" }}
                                >
                                     {permissionData?.isEdit === true && ( 
                                    <EditIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "blue",
                                            cursor: "pointer",
                                        }}
                                        className="cursor-pointer"
                                        onClick={() => routeChangeEdit(params.row)}
                                    />
                                     )} 
                                    {permissionData?.isDel === true && ( 
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
                        field: "authName",
                        headerName: t("text.Authority"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "doj",
                        headerName: t("text.DateOfJoining"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                        renderCell: (params) => {
                            return dayjs(params.row.doj).format("DD-MM-YYYY");
                        }
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
        <>
            <Card
                style={{
                    width: "100%",
                    // height: "100%",
                    backgroundColor: "#E9FDEE",
                    border: ".5px solid #00009c ",
                    marginTop: "3vh"
                }}
            >
                <Paper
                    // sx={{
                    //     width: "100%",
                    //     overflow: "hidden",
                    //     "& .MuiDataGrid-colCell": {
                    //         backgroundColor: "#2B4593",
                    //         color: "#fff",
                    //         fontSize: 17,
                    //         fontWeight: 900
                    //     },
                    // }}
                    style={{ padding: "10px", }}
                >
                    <ConfirmDialog />

                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ padding: "20px" }}
                        align="left"
                    >
                        {t("text.CommitteeEmployeeMapping")}
                    </Typography>
                    <Divider />

                    <Box height={10} />

                    <Stack direction="row" spacing={2} classes="my-2 mb-2">
                        {permissionData?.isAdd === true && (
                        <Button
                            onClick={routeChangeAdd}
                            variant="contained"
                            endIcon={<AddCircleIcon />}
                            style={{backgroundColor:`var(--grid-headerBackground)`,color: `var(--grid-headerColor)`}}
                            size="large"
                        >
                            {t("text.Add")}
                        </Button>
                        )}

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
                            rows={zones}
                            columns={adjustedColumns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            initialPageSize={5}
                        />)}
                </Paper>
            </Card>
            <ToastApp />

        </>
    );
}
