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
import { ConfirmDialog } from "primereact/confirmdialog";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import { useNavigate, useLocation } from "react-router-dom";
import {
    DataGrid,
    GridColDef,
    GridToolbar,
} from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";


export default function RouteAdd() {
    const { i18n, t } = useTranslation();
    const [rows, setRows] = useState<any>([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const dataString = localStorage.getItem("userdata");
        getList();
    }, []);

    let navigate = useNavigate();

    const routeChangeEdit = (row: any) => {
        console.log("row " + row);

        let path = `/Route/RouteEdit`;
        navigate(path, {
            state: row,
        });
    };

    const routeChangeAdd = () => {
        let path = `/Route/RouteAdd`;
        navigate(path);
        // setAddPageShow(true);
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
                    console.log("result" + JSON.stringify(res.data.data));
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
                                            {/*  {permissionData?.isEdit ? ( */}
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
                                            {/*   "" */}
                                            {/* )} */}
                                            {/*  {permissionData?.isDel ? ( */}
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
                                            {/*  ) : ( */}
                                            {/*  "" */}
                                            {/* )} */}
                                        </Stack>,
                                    ];
                                },
                            },

                            {
                                field: "serialNo",
                                headerName: "Route Name",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "email",
                                headerName: "Member List",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "sms",
                                headerName: "Level",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            // {
                            //     field: "message",
                            //     headerName: "Message",
                            //     flex: 1,
                            //     headerClassName: "MuiDataGrid-colCell",
                            // },
                            // {
                            //     field: "arrivalDate",
                            //     headerName: "Date",
                            //     flex: 1,
                            //     headerClassName: "MuiDataGrid-colCell",
                            //     renderCell: (params) => {
                            //         return moment(params.row.arrivalDate).format("DD-MM-YYYY")
                            //     }
                            // },

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
                        backgroundColor: "#E9FDEE",
                        // border: ".5px solid #42AEEE ",
                        marginTop: "5px",
                    }}
                >
                    <Paper
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            "& .MuiDataGrid-colCell": {
                                backgroundColor: "#00009c",
                                color: "#fff",
                                fontSize: 18,
                                fontWeight: 800,
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
                            Create Route
                        </Typography>
                        <Divider />

                        <Box height={10} />

                        <Stack direction="row" spacing={2} classes="my-2 mb-2">
                            {/* {permissionData?.isAdd == true && ( */}
                            <Button
                                onClick={routeChangeAdd}
                                variant="contained"
                                endIcon={<AddCircleIcon />}
                                size="large"
                            >
                                {t("text.add")}
                            </Button>

                        </Stack>
<br/>
<br/>
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
                                <div>
                                    <DataGrid
                                        rows={rows}
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
            </Grid >
            <ToastApp />
        </>
    );
}
