import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Autocomplete,
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
import {getId} from '../../../utils/Constant'
import CustomDataGrid from "../../../utils/CustomDatagrid";

export default function LetterType() {
    const { i18n, t } = useTranslation();
    const ID = getId();
    const [columns, setColumns] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [editId, setEditId] = useState(-1);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const dataString = localStorage.getItem("userdata");

        getList();

    }, []);


    let delete_id = "";
    const accept = () => {
        const collectData = {
            lId: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete( `LetterType/DeleteLetterType`, {data:collectData})
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
            "lId": -1,
            "inst_id": -1,
            "user_id": -1,
            "divisionid": -1
        };
        try {
            api
                .post(`LetterType/GetLetterType`, collectData)
                .then((res:any) => {
                    console.log("result" + JSON.stringify(res.data.data));
                    const data = res.data.data;
                    const arr = data.map((item: any, index: any) => ({
                        ...item,
                        serialNo: index + 1,
                        id: item.lId,
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
                                            {/*  "" */}
                                            {/* )} */}
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
                                field: "lName",
                                headerName:"Letter Name",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "lNameShortNM",
                                headerName:"Short Name",
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
        lName: Yup.string().test(
            "required",

            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });
    const [toaster, setToaster] = useState(false);
    const formik = useFormik({
        initialValues: {
            "lId": -1,
  "lName": "",
  "lNameShortNM": "",
  "inst_id": 0,
  "user_id": ID,
  "createdDate": "2024-05-22T09:32:11.847Z",
  "divisionid": 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.lId = editId;
            console.log("check", values)
            const response = await api.post(`LetterType/AddUpdateLetterType`,values);
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                formik.resetForm();
                getList();
                setEditId(-1);
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }

        },
    });

    const requiredFields = ["lName"];


    const routeChangeEdit = (row: any) => {
        formik.setFieldValue("lName", row.lName);
        formik.setFieldValue("lNameShortNM", row.lNameShortNM);

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
                        border: ".5px solid #42AEEE ",
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
                            {t("text.LetterType")}
                        </Typography>
                        <Divider />

                        <Box height={10} />
                        <Stack direction="row" spacing={2} classes="my-2 mb-2">
                            <Grid
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                }}
                            >
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid item xs={12} container spacing={3}>

                                        <Grid xs={5} sm={5} item>
                                        <TextField
                                                id="lName"
                                                type="text"
                                                label={
                                                    <span>
                                                        {t("text.letterName")} {""}
                                                    </span>
                                                }
                                                placeholder={t("text.letterName")}
                                                value={formik.values.lName}
                                                size="small"
                                                name="lName"
                                                fullWidth
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                           
                                        </Grid>

                                        <Grid item xs={5} sm={5}>
                                            <TextField
                                                id="lNameShortNM"
                                                type="text"
                                                label={
                                                    <span>
                                                        {t("text.letterShortName")} {""}
                                                    </span>
                                                }
                                                placeholder={t("text.letterShortName")}
                                                value={formik.values.lNameShortNM}
                                                size="small"
                                                name="lNameShortNM"
                                                fullWidth
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            
                                        </Grid>

                                        <Grid item xs={2}>
                                            {/*  {permissionData?.isAdd == true ? ( */}
                                            <Button type="submit" variant="contained" size="large">
                                                {editId == -1 ? t("text.save") : t("text.update")}
                                            </Button>
                                            {/* ) : ( */}
                                            {/*   "" */}
                                            {/* )} */}
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1 }}
                            ></Typography>
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
