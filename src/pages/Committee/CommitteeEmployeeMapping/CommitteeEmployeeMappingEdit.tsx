import {
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import dayjs, { Dayjs } from "dayjs";
import api from "../../../utils/Url";
import CustomLabel from "../../../CustomLable";
import { getISTDate } from "../../../utils/Constant";



type Props = {};

const CommitteeEmployeeMappingAdd = (props: Props) => {
    const { t } = useTranslation();
    const { defaultValuestime } = getISTDate();

    const location = useLocation();

    console.log("location", location)

    const [option, setOption] = useState([
        {
            value: "-1",
            label: t("text.SelectAuthority"),
        },
    ]);

    const [CommitteeName, setCommitteeName] = useState([
        { value: "-1", label: t("text.selectCommGroupname") },
    ]);

    const [UserName, setUserName] = useState([
        { value: "-1", label: t("text.SelectEmployee") },
    ]);

    let navigate = useNavigate();

    const back = useNavigate();

    const getGender = () => {
        const collectData = {
            "id": -1,
            "officeId": -1,
            "under_id": -1,
            "divisionid": -1
        };
        api.post(`AuthorityMaster/GetAuthorityMaster`, collectData).then((res) => {
            const arr = [];
            console.log("result" + JSON.stringify(res.data.data));
            for (let index = 0; index < res.data.data.length; index++) {
                arr.push({
                    label: res.data.data[index]["authorityType"],
                    value: res.data.data[index]["id"],
                });
            }
            setOption(arr);
        });
    };




    const getUserName = () => {
        const collectData = {
            empid: -1,
            userId: "",
            empName: "",
            empMobileNo: "",
            empDesignationId: -1,
            empDeptId: -1,
            empStateId: -1,
            empCountryID: -1,
            empCityId: -1,
            empPincode: 0,
            roleId: "",
        };
        api.post(`EmpMaster/GetEmpmaster`, collectData).then((res) => {
            const arr = [];
            console.log("result" + JSON.stringify(res.data.data));
            for (let index = 0; index < res.data.data.length; index++) {
                arr.push({

                    label: res.data.data[index]["empName"],
                    value: res.data.data[index]["empid"],
                });
            }
            setUserName(arr);
        });
    };

    const getCommittee = () => {
        const collectData = {
            "id": -1,
            "committeeName": "",
            "officeId": -1,
            "userId": "",
            "ipAddress": "",
            "type": ""
        };
        api.post(`CommitteeMaster/GetCommitteeMaster`, collectData).then((res) => {
            const arr = [];
            console.log("result" + JSON.stringify(res.data.data));
            for (let index = 0; index < res.data.data.length; index++) {
                arr.push({

                    label: res.data.data[index]["committeeName"],
                    value: res.data.data[index]["id"],
                });
            }
            setCommitteeName(arr);
        });
    };

    const [toaster, setToaster] = useState(false);

    useEffect(() => {
        getGender();
        getUserName();
        getCommittee();
    }, []);

    const formik = useFormik({
        initialValues: {
            "id": location.state.id,
            "empId": location.state.empId,
            "designationInCommittee": location.state.designationInCommittee,
            "doj": dayjs(location.state.doj).format("YYYY-MM-DD"),
            "dol": dayjs(location.state.dol).format("YYYY-MM-DD"),
            "priority": location.state.priority,
            "committeeId": location.state.committeeId,
            "officeId": location.state.officeId,
            "userId": location.state.userId,
            "ipAddress": location.state.ipAddress,
            "uploadDate": location.state.uploadDate,
            "head": location.state.head,
            "divisionid": parseInt(localStorage.getItem('id') + ""),
            "empName": location.state.empName,
            "authorityName": location.state.authorityName,
        },
        onSubmit: async (values) => {

            const response = await api.post(`CommitteeEmp_Mapping/AddUpdateCommitteeEmp_Mapping`, values);
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                navigate("/E-Office/CommitteeEmployeeMapping");
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }
        },
    });

    const requiredFields = [];

    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                    border: ".5px solid #00009c",
                    marginTop: "3vh",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
                    >
                        {t("text.EditCommitteEmployeeMapping")}
                    </Typography>
                    <Grid xs={4} sm={12} item>
                        <Typography style={{ marginTop: "-75px" }}>
                            <Button
                                type="submit"
                                onClick={() => back(-1)}
                                variant="contained"
                                style={{
                                    marginBottom: 15,
                                    marginTop: "45px",
                                    backgroundColor: "blue",
                                    width: 20,
                                }}
                            >
                                <ArrowBackSharpIcon />
                            </Button>
                        </Typography>
                    </Grid>
                    <Divider />
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        {toaster === false ? "" : <ToastApp />}
                        <Grid item xs={12} container spacing={2}>
                            <Grid xs={12} sm={4} item alignItems="center" justifyContent="center" >
                                <Grid xs={12} sm={4} item alignItems="center" justifyContent="center" >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id="head"
                                                name="head"
                                                value={formik.values.head}
                                                checked={formik.values.head === 'Y'}
                                                onChange={(e) => {
                                                    const newValue = e.target.checked ? 'Y' : 'N';
                                                    formik.setFieldValue('head', newValue);
                                                }}
                                                color="primary"
                                            />
                                        }
                                        label="Head"
                                        labelPlacement="end"
                                    />
                                </Grid>
                            </Grid>

                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={CommitteeName}

                                    value={
                                        CommitteeName.find(
                                            (option: any) => option.value === formik.values.committeeId
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("committeeId", newValue?.value);
                                        formik.setFieldTouched("committeeId", true);
                                        formik.setFieldTouched("committeeId", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.selectCommGroupname")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={UserName}
                                    value={
                                        UserName.find(
                                            (option: any) => option.value === formik.values.empId
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("empId", newValue?.value);
                                        formik.setFieldTouched("empId", true);
                                        formik.setFieldTouched("empId", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectEmployee")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={option}
                                    value={
                                        option.find(
                                            (option: any) => option.value === formik.values.designationInCommittee
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"

                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("designationInCommittee", newValue?.value);
                                        formik.setFieldTouched("designationInCommittee", true);
                                        formik.setFieldTouched("designationInCommittee", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectAuthority")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid xs={12} sm={4} item>
                                <TextField
                                    type="date"
                                    label={<CustomLabel text={t("text.EnterDateOfJoining")} />}
                                    value={formik.values.doj}
                                    name="doj"
                                    InputLabelProps={{ shrink: true }}
                                    id="doj"
                                    placeholder={t("text.EnterDateOfJoining")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid xs={12} sm={4} item>
                                <TextField
                                    type="date"
                                    label={<CustomLabel text={t("text.EnterDateOfLeaving")} />}
                                    value={formik.values.dol}
                                    InputLabelProps={{ shrink: true }}
                                    name="dol"
                                    id="dol"
                                    placeholder={t("text.EnterDateOfLeaving")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid xs={12} item>
                                <div style={{ justifyContent: "space-between", flex: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{
                                            width: "48%",
                                            backgroundColor: "#059669",
                                            margin: "1%",
                                        }}
                                    >
                                        {t("text.save")}
                                    </Button>

                                    <Button
                                        type="reset"
                                        variant="contained"
                                        style={{
                                            width: "48%",
                                            backgroundColor: "#F43F5E",
                                            margin: "1%",
                                        }}
                                        onClick={() => formik.resetForm()}
                                    >
                                        {t("text.reset")}
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};
export default CommitteeEmployeeMappingAdd;
