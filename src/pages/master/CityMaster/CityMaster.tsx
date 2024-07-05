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
import CustomLabel from "../../../CustomLable";



export default function FileMaster() {
    const { i18n, t } = useTranslation();
    const { defaultValues, defaultValuestime } = getISTDate();

    const [columns, setColumns] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [editId, setEditId] = useState<any>(-1);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    const [fileTypeOption, setFileTypeOption] = useState([{ value: "-1", label: t("text.SelectFileType") }]);


    const [option, setOption] = useState([
        { value: "-1", label: t("text.SelectStateName") },
    ]);




    useEffect(() => {
        const dataString = localStorage.getItem("userdata");

        getList();

        getStateZone();

    }, []);




    const getStateZone = () => {
        const collectData = {
            "stateId": -1,
            "countryId": -1

        };
        api
            .post(`State/GetStateMaster`, collectData)
            .then((res) => {
                const arr = [];
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res.data.data[index]["stateName"],
                        value: res.data.data[index]["stateId"],
                    });
                }
                setOption(arr);
            });
    };



    let delete_id = "";
    const accept = () => {
        const collectData = {
            cityId: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`M10_District/DeleteDistrict`, { data: collectData })
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
            "cityId": -1,
            "stateId": -1
        };
        try {
            api
                .post(`M10_District/GetDistrictMaster`, collectData)
                .then((res) => {
                    console.log("result" + JSON.stringify(res.data.data));
                    const data = res.data.data;
                    const arr = data.map((item: any, index: any) => ({
                        ...item,
                        serialNo: index + 1,
                        id: item.cityId,
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
                            },  {
                                field: "stateName",
                                headerName:  t("text.StateName"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "cityName",
                                headerName:  t("text.DistrictName"),
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
        stateId: Yup.string().test(
            "required",
            "Select State Is Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });
    const [toaster, setToaster] = useState(false);
    const formik = useFormik({
        initialValues: {
            cityId: -1,
            cityName: "",
            stateId: "",
            createdOn: defaultValuestime,
            updatedOn: defaultValuestime,
            createdBy: "-1",
            updatedBy: "-1"
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.cityId = editId;
            // console.log("check", values);

            const response = await api.post(
                `M10_District/AddUpdateDistrictMaster`,
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

    const requiredFields = ["stateId"];


    const routeChangeEdit = (row: any) => {
        formik.setFieldValue("stateId", row.stateId);
        formik.setFieldValue("cityName", row.cityName);

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
                            {t("text.DistrictMaster")}
                        </Typography>
                        <Divider />

                        <Box height={10} />

                        <form onSubmit={formik.handleSubmit}>
                            <Grid item xs={12} container spacing={3}>

                                <Grid xs={5} sm={5} item>

                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={option}
                                        fullWidth
                                        size="small"
                                        onChange={(event, newValue) => {
                                            console.log(newValue?.value);
                                            formik.setFieldValue("stateId", newValue?.value);
                                            formik.setFieldTouched("stateId", true);
                                            formik.setFieldTouched("stateId", false);
                                        }}

                                        value={option.find(opt => opt.value === formik.values.stateId) || null}
                                        // value={}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={<CustomLabel text={t("text.SelectStateName")} required={requiredFields.includes('stateId')} />}

                                            />
                                        )}
                                    />
                                    {formik.touched.stateId && formik.errors.stateId ? (
                                        <div style={{ color: "red", margin: "5px" }}>
                                            {formik.errors.stateId}
                                        </div>
                                    ) : null}
                                </Grid>

                                <Grid item xs={5} sm={5}>
                                    <TextField
                                        label={<CustomLabel text={t("text.EnterDistrictName")} required={requiredFields.includes('cityName')} />}
                                        value={formik.values.cityName}
                                        name="cityName"
                                        id="cityName"
                                        placeholder={t("text.EnterDistrictName")}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.cityName && formik.errors.cityName ? (
                                        <div style={{ color: "red", margin: "5px" }}>
                                            {formik.errors.cityName}
                                        </div>
                                    ) : null}

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
