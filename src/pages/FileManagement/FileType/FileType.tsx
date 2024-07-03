import * as React from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { usePermissionData } from "../../../usePermissionData";
import DeleteIcon from "@mui/icons-material/Delete";
import { getISTDate } from "../../../utils/Constant";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";

interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function FileType() {
    const { i18n, t } = useTranslation();
    const { defaultValues, defaultValuestime } = getISTDate();

    const [columns, setColumns] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [editId, setEditId] = useState<any>(-1);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [permissionData, setPermissionData] = useState<MenuPermission>({
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
                            // getList();
                        }
                    }
                }
            }
        }
        getList();
    }, [isLoading]);

    let delete_id = "";
    const accept = () => {
        const collectData = {
            fId: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`FileType/DeleteFileType`, { data: collectData })
            .then((response) => {
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                } else {
                    toast.error(response.data.mesg);
                }
                getList();
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

    const getList = () => {
        const collectData = {
            "fId": -1,
            "inst_id": -1,
            "user_id": -1,
            "divisionid": -1
        };
        try {
            api
                .post(`FileType/GetFileType`, collectData)
                .then((res) => {
                    console.log("result" + JSON.stringify(res.data.data));
                    const data = res.data.data;
                    const arr = data.map((item: any, index: any) => ({
                        ...item,
                        serialNo: index + 1,
                        id: item.fId,
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
                                    console.log("Is Edit Allowed:", permissionData?.isEdit);
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
                                            {/*  ) : ( */}
                                            {/*   "" */}
                                            {/* )} */}
                                            {/*  {permissionData?.isDel ? ( */}
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
                                            {/*  ) : ( */}
                                            {/*    "" */}
                                            {/*  )} */}
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
                                field: "fName",
                                headerName: t("text.FileTypeName"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "fShortNM",
                                headerName: "Short Name",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
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
    const validationSchema = Yup.object({
        fName: Yup.string().test(
            "required",
            t("text.reqFileTypeName"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });
    const [toaster, setToaster] = useState(false);
    const formik = useFormik({
        initialValues: {
            "fId": -1,
            "fName": "",
            "fShortNM": "",
            "inst_id": 0,
            "user_id": 0,
            "createdDate": defaultValuestime,
            "divisionid": 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.fId = editId;

            const response = await api.post(
                `FileType/AddUpdateFileType`,
                values
            );
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                formik.resetForm();
                getList();
                setEditId("-1");
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }

        },
    });

    const requiredFields = ["fName"];


    const routeChangeEdit = (row: any) => {
        formik.setFieldValue("fName", row.fName);
        formik.setFieldValue("fShortNM", row.fShortNM);
        setEditId(row.id);
    };

    return (
        <>
            <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
                <Card
                    style={{
                        width: "100%",
                        height: "50%",
                        backgroundColor: "#E9FDEE",
                        border: ".5px solid #2B4593 ",
                        marginTop: "5px",
                    }}
                >
                    <Paper
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            "& .MuiDataGrid-colCell": {
                                backgroundColor: "#2B4593",
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
                            {t("text.FileType")}
                        </Typography>
                        <Divider />

                        <Box height={10} />
                        {/* <Stack direction="row" spacing={2} classes="my-2 mb-2"> */}
                        {/* <Grid
                                // style={{
                                //     display: "flex",
                                //     flexDirection: "row",
                                //     justifyContent: "space-around",
                                //     alignItems: "flex-start",
                                // }}
                            > */}
                        <form onSubmit={formik.handleSubmit}>
                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="fName"
                                        type="text"
                                        label={<CustomLabel text={t("text.EnterFileTypeName")} required={requiredFields.includes('fName')} />}
                                        placeholder={t("text.EnterFileTypeName")}
                                        value={formik.values.fName}
                                        size="small"
                                        name="fName"
                                        fullWidth
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.fName &&
                                        formik.errors.fName ? (
                                        <div style={{ color: "red", margin: "5px" }}>
                                            {formik.errors.fName}
                                        </div>
                                    ) : null}
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="fShortNM"
                                        type="text"
                                        label={<CustomLabel text={t("text.EnterShortName")}  />}
                                        placeholder={t("text.EnterShortName")}
                                        value={formik.values.fShortNM}
                                        size="small"
                                        name="fShortNM"
                                        fullWidth
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    {/* {permissionData?.isAdd == true ? ( */}
                                    <Button type="submit" variant="contained" size="large">
                                        {editId == -1 ? t("text.save") : t("text.update")}
                                    </Button>
                                    {/* ) : ( */}
                                    {/*    "" */}
                                    {/* )} */}
                                </Grid>
                            </Grid>
                        </form>
                        {/* </Grid> */}
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        ></Typography>
                        {/* </Stack> */}
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
                                columns={columns}
                                pageSizeOptions={[5, 10, 25, 50, 100]}
                                initialPageSize={5}
                            />
                        )}
                    </Paper>
                </Card>
            </Grid>
            <ToastApp />
        </>
    );
}
