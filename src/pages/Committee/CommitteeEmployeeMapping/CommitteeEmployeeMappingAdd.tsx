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
import { Navigate, useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import CustomLabel from "../../../CustomLable";
import { getdivisionId, getId, getinstId,getISTDate } from "../../../utils/Constant";
import axios from "axios";


type Props = {};

const CommitteeEmployeeMappingAdd = (props: Props) => {
    const { t } = useTranslation();

    const ID = getId();
    let divId = getdivisionId();
    let instId = getinstId();
    let {defaultValuestime} = getISTDate();


    const [option, setOption] = useState([
        {
            value: "-1",
            label: t("text.SelectAuthority"),
        },
    ]);

    const [UserName, setUserName] = useState([
        { value: "-1", label: t("text.SelectEmployee") },
    ]);

    const [CommitteeName, setCommitteeName] = useState([
        { value: "-1", label: t("text.selectCommGroupname") },
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
        getIP();
        getGender();
        getUserName();
        getCommittee();
    }, []);

    const getIP =()=>{
        axios.get('http://ipinfo.io')
        .then((res:any)=>{
        formik.setFieldValue("ipAddress",res.data.ip);
      }
    )
      }

    const formik = useFormik({
        initialValues: {
            "id": -1,
            "empId": 0,
            "designationInCommittee": 0,
            "doj": "",
            "dol": "",
            "priority": 0,
            "committeeId": 0,
            "inst_id": instId,
            "officeId": 1,
            "userId": ID,
            "ipAddress": "",
            "uploadDate": defaultValuestime,
            "head": "",
            "divisionid": divId,
            "empName": "",
            "authorityName": ""
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
                        {t("text.AddCommitteEmployeeMapping")}
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
                                    backgroundColor:`var(--grid-headerBackground)`,
                                    color: `var(--grid-headerColor)`,
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

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="head"
                                            name="head"
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

                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={CommitteeName}
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
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("empId", newValue?.value);
                                        formik.setFieldValue("empName", newValue?.label);
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
                                    fullWidth
                                    size="small"

                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("designationInCommittee", newValue?.value);
                                        formik.setFieldValue("authorityName", newValue?.label);
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
                                            backgroundColor:`var(--grid-headerBackground)`,
                                            color: `var(--grid-headerColor)`,
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