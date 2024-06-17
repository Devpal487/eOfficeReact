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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
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
import { getISTDate } from "../../../utils/Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDataGrid from "../../../utils/CustomDatagrid";



export default function FileMaster() {
    const { i18n, t } = useTranslation();
    const { defaultValues, defaultValuestime } = getISTDate();

    const [columns, setColumns] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [editId, setEditId] = useState<any>(-1);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    const [fileTypeOption, setFileTypeOption] = useState([{ value: "-1", label: t("text.SelectFileType") }]);




    useEffect(() => {
        const dataString = localStorage.getItem("userdata");

        getList();
        getFileTypeData();

    }, []);

    const getFileTypeData =async ()=>{
        const res = await api.post(`FileType/GetFileType`, {fId:-1, inst_id:-1,user_id:-1,divisionid:-1})
        console.log("check file type", res?.data?.data)
        const arr = [];
        for(let index = 0; index < res.data.data.length; index++){
            arr.push({
            value : res.data.data[index]["fId"],
            label : res.data.data[index]["fName"],
        })
            setFileTypeOption(arr);
        }
    }

    let delete_id = "";
    const accept = () => {
        const collectData = {
            fnId: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`FileNumber/DeleteFileNumber`, {data:collectData})
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
            "fnId": -1,
  "fId": -1,
  "inst_id": -1,
  "user_id": -1,
  "divisionId": -1
        };
        try {
            api
                .post(`FileNumber/GetFileNumber`, collectData)
                .then((res) => {
                    console.log("result" + JSON.stringify(res.data.data));
                    const data = res.data.data;
                    const arr = data.map((item: any, index: any) => ({
                        ...item,
                        serialNo: index + 1,
                        id: item.fnId,
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
                                field: "fileNm",
                                headerName:"File Number",
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
        fId: Yup.string().test(
            "required",
            "Select File Type Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });
    const [toaster, setToaster] = useState(false);
    const formik = useFormik({
        initialValues: {
            "fnId": -1,
            "fId": "",
            "fileNm": "",
            "inst_id": 0,
            "user_id": 0,
            "createdDate": defaultValuestime,
            "divisionId": 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.fnId = editId;
            // console.log("check", values);

            const response = await api.post(
                `FileNumber/AddUpdateFileNumber`,
                values
            );
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

    const requiredFields = ["fId"];


    const routeChangeEdit = (row: any) => {
        formik.setFieldValue("fId", row.fId);
        formik.setFieldValue("fileNm", row.fileNm);

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
                                backgroundColor: "#00009C",
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
                            {t("text.FileMaster")}
                        </Typography>
                        <Divider />

                        <Box height={10} />
                       
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid item xs={12} container spacing={3}>

                                        <Grid xs={5} sm={5} item>

                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={fileTypeOption}
                                                value={
                                                    fileTypeOption.find(
                                                        (option) => option.value === formik.values.fId
                                                    ) || null
                                                }
                                                fullWidth
                                                size="small"
                                                onChange={(event, newValue) => {
                                                    console.log(newValue?.value);

                                                    formik.setFieldValue("fId", newValue?.value);
                                                    // formik.setFieldValue("fId", newValue?.label);
                                                    formik.setFieldTouched("fId", true);
                                                    formik.setFieldTouched("fId", false);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label={
                                                        <span>
                                                            {t("text.SelectFileType")} {""}
                                                            
                                                        </span>
                                                    } />
                                                )}
                                            />
                                            {formik.touched.fId &&
                                                formik.errors.fId ? (
                                                <div style={{ color: "red", margin: "5px" }}>
                                                    {formik.errors.fId}
                                                </div>
                                            ) : null}
                                        </Grid>

                                        <Grid item xs={5} sm={5}>
                                            <TextField
                                                id="fileNm"
                                                type="text"
                                                label={
                                                    <span>
                                                        {t("text.FileNumber")} {""}
                                                    </span>
                                                }
                                                placeholder={t("text.FileNumber")}
                                                value={formik.values.fileNm}
                                                size="small"
                                                name="fileNm"
                                                fullWidth
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            
                                        </Grid>

                                        <Grid item xs={2}>
                                            {/*  {permissionData?.isAdd == true ? ( */}
                                            <Button type="submit" variant="contained" size="large">
                                                {editId == "-1" ? t("text.save") : t("text.update")}
                                            </Button>
                                            {/* ) : ( */}
                                            {/*   "" */}
                                            {/* )} */}
                                        </Grid>
                                    </Grid>
                                </form>
                            
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
