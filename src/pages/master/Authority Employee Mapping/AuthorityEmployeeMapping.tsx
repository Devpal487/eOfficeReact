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
import axios from "axios";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import dayjs, { Dayjs } from "dayjs";


const selectStatus = [
    { label: 'Active', value: 'Y' },
    { label: 'InActive', value: 'N' },

];



export default function AuthorityEmployeeMapping() {
    const { i18n, t } = useTranslation();
    const { defaultValues, defaultValuestime } = getISTDate();

    const [columns, setColumns] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [editId, setEditId] = useState<any>(-1);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    const [selectEmployeeName, setSelectEmployeeName] = useState([{ value: "-1", label: t("text.SelectEmployeeName") }]);
    const [selectAuthority, setSelectAuthority] = useState([{ value: "-1", label: t("text.selectAuthority") }]);

    const [selectDepartment, setSelectDepartment] = useState([{ value: "-1", label: t("text.SelectDepartment") }]);
    const [selectSection, setSelectSection] = useState([{ value: "-1", label: t("text.SelectSection") }]);

    useEffect(() => {
        const dataString = localStorage.getItem("userdata");
        getList();
        getIP();
        getEmployee();
        getAuthority();

        getDepartment();
        getSection();
    }, []);

    const getEmployee = () => {
        const collectData = {
            "empid": -1,
            "userId": "",
            "empName": "",
            "empMobileNo": "",
            "empDesignationId": -1,
            "empDeptId": -1,
            "empStateId": -1,
            "empCountryID": -1,
            "empCityId": -1,
            "empPincode": 0,
            "roleId": ""
        };
        api
            .post(`EmpMaster/GetEmpmaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.empName,
                    value: item.empid,
                }));
                setSelectEmployeeName(arr);
            });
    };


    const getAuthority = () => {
        const collectData = {
            "id": -1,
            "officeId": -1,
            "under_id": -1,
            "divisionid": -1
        };
        api
            .post(`AuthorityMaster/GetAuthorityMaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.authorityType,
                    value: item.id,
                }));
                setSelectAuthority(arr);
            });
    };




    const getDepartment = () => {
        const collectData = {
            "departmentId": -1
        };
        api
            .post(`Department/GetDepartmentmaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.departmentName,
                    value: item.departmentId,
                }));
                setSelectDepartment(arr);
            });
    };

    const getSection = () => {
        const collectData = {
            "id": -1,

        };
        api
            .post(`SectionMaster/GetDesignationmaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.section,
                    value: item.id,
                }));
                setSelectSection(arr);
            });
    };




    const getIP = () => {
        axios.get('http://ipinfo.io')
            .then((res: any) => {
                formik.setFieldValue("ipAddress", res.data.ip);
            }
            )
    }

    let delete_id = "";
    const accept = () => {
        const collectData = {
            id: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`EmployeesAuthority/DeleteEmployeesAuthority`, { data: collectData })
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
            "empId": -1,
            "authorityId": -1,
            "officeId": -1,
            "deptId": -1,
            "sectionId": -1,
            "divisionid": -1
        }
        try {
            api.post(`EmployeesAuthority/GetEmployeesAuthority`, collectData)
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
                                field: "empName",
                                headerName: t("text.EmployeeName"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "authorityName",
                                headerName: t("text.Authority"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },

                            {
                                field: "doj",
                                headerName: t("text.DateOfJoining"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                                renderCell:(params)=>{
                                    return dayjs(params.row.doj).format("DD-MM-YYYY");
                                }
                            },

                            {
                                field: "authorityStatus",
                                headerName: t("text.Status"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            }

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
        authorityId: Yup.string().test(
            "required",
            t("text.reqAuthorityType"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });
    const [toaster, setToaster] = useState(false);

    const formik = useFormik({
        initialValues: {

            "id": -1,
            "empId": -1,
            "authorityId": 0,
            "uploadDate": defaultValuestime,
            "ipAddress": "",
            "officeId": 0,
            "doj": dayjs("").format("YYYY-MM-DD"),
            "authorityStatus": "",
            "dol": defaultValuestime,
            "deptId": -1,
            "sectionId": 0,
            "divisionid": 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.id = editId;
            // console.log("check", values);

            const response = await api.post(
                `EmployeesAuthority/AddUpdateEmployeesAuthority`,
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

    const requiredFields = ["authorityId"];


    const routeChangeEdit = (row: any) => {

        console.log("checkEdit",row)
        formik.setFieldValue("empId", row.empId);
        formik.setFieldValue("authorityId", row.authorityId);
        formik.setFieldValue("uploadDate", row.uploadDate);
        formik.setFieldValue("ipAddress", row.ipAddress);
        formik.setFieldValue("officeId", row.officeId);
        formik.setFieldValue("doj", row.doj);
        formik.setFieldValue("authorityStatus", row.authorityStatus);
        formik.setFieldValue("dol", row.dol);
        formik.setFieldValue("deptId", row.deptId);
        formik.setFieldValue("sectionId", row.sectionId);
        formik.setFieldValue("divisionid", row.divisionid);
        setEditId(row.id);
    };

    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
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
                            Authority Employee Mapping
                        </Typography>
                        <Divider />

                        <Box height={10} />


                        <form onSubmit={formik.handleSubmit}>
                            <Grid item xs={12} container spacing={3}>


                                <Grid xs={4} sm={4} item>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={selectEmployeeName}

                                        value={
                                            selectEmployeeName.find(
                                                (option:any) => option.value === formik.values.empId
                                            ) || null
                                        }
                                        fullWidth
                                        size="small"
                                        onChange={(event: any, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("empId", newValue?.value);
                                            // formik.setFieldValue("empId", newValue?.label);
                                            formik.setFieldTouched("empId", true);
                                            formik.setFieldTouched("empId", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text={t("text.SelectEmployeeName")} required={requiredFields.includes('authorityId')} />} />
                                        )}
                                    />

                                </Grid>

                                <Grid item xs={4} sm={4}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={selectAuthority}
                                        value={
                                            selectAuthority.find(
                                                (option:any) => option.value === formik.values.authorityId
                                            ) || null
                                        }
                                        fullWidth
                                        size="small"
                                        onChange={(event: any, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("authorityId", newValue?.value);
                                            // formik.setFieldValue("authorityId", newValue?.label);
                                            formik.setFieldTouched("authorityId", true);
                                            formik.setFieldTouched("authorityId", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text={t("text.SelectAuthority")} required={false} />} />
                                        )}
                                    />

                                </Grid>

                                <Grid xs={4} sm={4} item>
                                    <TextField
                                        type="date"
                                        value={dayjs(formik.values.doj).format("YYYY-MM-DD")}
                                        name="doj"
                                        id="doj"
                                        InputLabelProps={{ shrink: true }}
                                        label={<CustomLabel text={t("text.EnterJoiningDate")} />}
                                        placeholder={t("text.EnterJoiningDate")}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white", }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>


                                <Grid item xs={4} sm={4}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={selectStatus}
                                        value={
                                            selectStatus.find(
                                                (option:any) => option.value === formik.values.authorityStatus
                                            ) || null
                                        }
                                        fullWidth
                                        size="small"
                                        onChange={(event: any, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("authorityStatus", newValue?.value);
                                            // formik.setFieldValue("authorityStatus", newValue?.label);
                                            formik.setFieldTouched("authorityStatus", true);
                                            formik.setFieldTouched("authorityStatus", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text={t("text.SelectStatus")} required={false} />} />
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={4} sm={4}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={selectDepartment}
                                        value={
                                            selectDepartment.find(
                                                (option:any) => option.value === formik.values.deptId
                                            ) || null
                                        }
                                        fullWidth
                                        size="small"
                                        onChange={(event: any, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("deptId", newValue?.value);
                                            // formik.setFieldValue("deptId", newValue?.label);
                                            formik.setFieldTouched("deptId", true);
                                            formik.setFieldTouched("deptId", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text={t("text.SelectDepartment")} required={false} />} />
                                        )}
                                    />

                                </Grid>

                                <Grid item xs={4} sm={4}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={selectSection}
                                        value={
                                            selectSection.find(
                                                (option:any) => option.value === formik.values.sectionId
                                            ) || null
                                        }
                                        fullWidth
                                        size="small"
                                        onChange={(event: any, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("sectionId", newValue?.value);
                                            //  formik.setFieldValue("sectionId", newValue?.label);
                                            formik.setFieldTouched("sectionId", true);
                                            formik.setFieldTouched("sectionId", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text={t("text.SelectSection")} required={false} />} />
                                        )}
                                    />

                                </Grid>


                                <Grid item xs={2} sx={{ m: -1 }}>
                                    {/*  {permissionData?.isAdd == true ? ( */}

                                    <ButtonWithLoader buttonText={editId == -1 ? t("text.save") : t("text.update")} onClickHandler={handleSubmitWrapper} />
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
                            <Box>
                                <br></br>
                                <div style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
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
                            </Box>
                        )}
                    </Paper>
                </Card>
            </Grid>
            <ToastApp />
        </>
    );
}
