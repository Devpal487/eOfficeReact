import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridToolbar,
} from "@mui/x-data-grid";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
    Box,
    Button,
    Divider,
    Stack,

    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import api from "../../../utils/Url";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PageCreateSwipeableDrawer from "./PageCreateSwipeableDrawer";
import { getISTDate } from "../../../utils/Constant";


interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function PageCreate() {
    const [Docs, setDocs] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });

    const [DocDetailData, setDocDetailData] = useState<any>(null);
    const [DocDetailRecords, setDocDetailRecords] = useState<any>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { defaultValuestime } = getISTDate();

    let navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const dataString = localStorage.getItem("userdata");
        // if (dataString) {
        //     const data = JSON.parse(dataString);
        //     if (data && data.length > 0) {
        //         const userPermissionData = data[0]?.userPermission;
        //         if (userPermissionData && userPermissionData.length > 0) {
        //             const menudata = userPermissionData[0]?.parentMenu;
        //             for (let index = 0; index < menudata.length; index++) {
        //                 const childMenudata = menudata[index]?.childMenu;
        //                 const pathrow = childMenudata.find(
        //                     (x: any) => x.path === location.pathname
        //                 );
        //                 console.log("data", pathrow);
        //                 if (pathrow) {
        //                     setPermissionData(pathrow);
        //                 }
        //             }
        //         }
        //     }
        // }
        fetchDocData();
    }, []);
    // }, [isLoading]);
    const routeChangeAdd = () => {
        let path = `/master/PageCreateAdd`;
        navigate(path);
    };

    // const handleSwitchChange = (
    //     event: React.ChangeEvent<HTMLInputElement>,
    //     value: any
    // ) => {
    //     console.log(value)
    //     const collectData = {
    //         fileClassid: value.id,
    //         classDescription: value.classDescription,
    //         shortName: value.shortName,
    //         weedingOutAuthority: value.weedingOutAuthority,
    //         isActive: event.target.checked,
    //         userID: -1,
    //         sortOrder: 0,
    //     };
    //     axios
    //         .post(HOST_URL.HOST_URL2 + `FileClass/AddUpdateFileClass`, collectData)
    //         .then((response) => {
    //             if (response.data.isSuccess) {
    //                 toast.success(response.data.mesg);
    //                 fetchZonesData();
    //             } else {
    //                 toast.error(response.data.mesg);
    //             }
    //         });
    // };
    const routeChangeEdit = (row: any) => {
        let path = `/master/PageCreateEdit`;
        navigate(path, {
            state: row,
        });
    };




    let delete_id = "";

    const accept = () => {
        const collectData = {
            rid: delete_id,

        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`ReferenceDiary/DeleteReferenceDiary`, { data: collectData })
            .then((response) => {
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                } else {
                    toast.error(response.data.mesg);
                }
               // fetchDocData();
            });
    };

    const reject = () => {
        // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        toast.warn("Rejected: You have rejected", { autoClose: 3000 });
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

    const getPageCreateRecords = async (id: any) => {
        // setIsReportLoading(true);
        const collectData = {
            "rid": id,
            "rlId": -1,
            "rFileType": -1,
            "inst_id": -1,
            "user_id": "",
            "fromdate": "2020-06-01T08:43:55.854Z",
            "todate": defaultValuestime,
            "refNo": -1,
            "divisionid": -1,
            "type": 1
        }
        console.log("collectData", collectData);

        const response = await api.post(
            `ReferenceDiary/GetReferenceDiary`,
            collectData
        );

        console.log("getData", response.data.data);
        setDocDetailData(response.data.data[0]["rFileNumber"] + " - " + response.data.data[0]["rFileType"])
        setDocDetailRecords(response.data.data);
        setDrawerOpen(true);
    }

    const fetchDocData = async () => {
        try {
            const collectData = {
                "rid": -1,
                "rlId": -1,
                "rFileType": -1,
                "inst_id": -1,
                "user_id": "",
                "fromdate": "2020-06-01T08:43:55.854Z",
                "todate": defaultValuestime,
                "refNo": -1,
                "divisionid": -1,
                "type": 1
            };
            console.log("collectData", collectData)
            const response = await api.post(
                `ReferenceDiary/GetReferenceDiary`,
                collectData
            );
            console.log("result", response.data.data)
            const data = response.data.data;
            const DocsWithIds = data.map((doc: any, index: any) => ({
                ...doc,
                serialNo: index + 1,
                id: doc.rid,
            }));


            setDocs(DocsWithIds);
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
                                    {/* ) : ( */}
                                    {/*  "" */}
                                    {/* )} */}

                                    <VisibilityIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "blue",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            getPageCreateRecords(params.row.id);
                                        }}
                                    />
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

                    // {
                    //   field: "empid",
                    //   headerName: "Emp Id",
                    //   flex: 1,
                    //   headerClassName: "MuiDataGrid-colCell",
                    // },

                    {
                        field: "serialNo",
                        headerName: t("text.SrNo"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    {
                        field: "rLetterNumber",
                        headerName: t("text.LetterNo"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "rPriority",
                        headerName: t("text.Priority"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    {
                        field: "rLanguage",
                        headerName: t("text.Language"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    {
                        field: "rSubject",
                        headerName: t("text.Subject"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },




                    // {
                    //     field: "entryDate",
                    //     headerName: t("text.EntryDate"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    //     renderCell: (params:any)=>{
                    //         return moment(params.row.entryDate).format("DD-MM-YYYY")
                    //       }
                    // },

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
                    border: ".5px solid #42AEEE ",
                    marginTop: "3vh"
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
                        {t("text.PageCreate")}
                    </Typography>
                    <Divider />

                    <Box height={10} />

                    <Stack direction="row" spacing={2} classes="my-2 mb-2">
                        {/*permissionData?.isAdd == true && ( */}
                        <Button
                            onClick={routeChangeAdd}
                            variant="contained"
                            endIcon={<AddCircleIcon />}
                            size="large"
                        >
                            {t("text.add")}
                        </Button>
                        {/*)} */}

                        {/*{permissionData?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />} size="large">
                {t("text.print")}
              </Button>
            ) : (
              ""
            )} */}
                    </Stack>

                    <PageCreateSwipeableDrawer
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        title={`# ${DocDetailData}  `}
                        userData={DocDetailRecords}
                    />

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
                                    rows={Docs}
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
            <ToastApp />

        </>
    );
}
