import {
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Navigate, useNavigate } from "react-router-dom";
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

type Props = {};

const CommitteeEmployeeMappingEdit= (props: Props) => {
    const { t } = useTranslation();

    const [option, setOption] = useState([
        {
            value: "-1",
            label: t("text.SelectGender"),
        },
    ]);
    const [option1, setOption1] = useState([
        { value: "-1", label: t("text.SelectRole") },
    ]);
    const [option2, setOption2] = useState([
        { value: "-1", label: t("text.SelectUserType") },
    ]);
    const [UserName, setUserName] = useState([
        { value: "-1", label: t("text.SelectEmployee") },
    ]);

    let navigate = useNavigate();

    const back = useNavigate();

    const getGender = () => {
        const collectData = {
            genderID: -1,
        };
        api.post(`Gender/GetGenderMaster`, collectData).then((res) => {
            const arr = [];
            console.log("result" + JSON.stringify(res.data.data));
            for (let index = 0; index < res.data.data.length; index++) {
                arr.push({
                    label: res.data.data[index]["genderName"],
                    value: res.data.data[index]["genderID"],
                });
            }
            setOption(arr);
        });
    };

    const getRole = () => {
        const collectData = {
            roleId: "-1",
        };
        api.post(`RoleMaster/GetRoleMaster`, collectData).then((res) => {
            const arr = [];
            console.log("result" + JSON.stringify(res.data.data));
            for (let index = 0; index < res.data.data.length; index++) {
                arr.push({
                    label: res.data.data[index]["roleName"],
                    value: res.data.data[index]["roleId"],
                });
            }
            setOption1(arr);
        });
    };

    const getUserType = () => {
        const collectData = {
            useR_TYPE_ID: -1,
        };
        api.post(`USER_TYPE/GetUSER_TYPE`, collectData).then((res) => {
            const arr = [];
            console.log("result" + JSON.stringify(res.data.data));
            for (let index = 0; index < res.data.data.length; index++) {
                arr.push({
                    label: res.data.data[index]["useR_TYPE_NAME"],
                    value: res.data.data[index]["useR_TYPE_ID"],
                });
            }
            setOption2(arr);
        });
    };

    const [toaster, setToaster] = useState(false);

    useEffect(() => {
        getRole();
        getGender();
        getUserType();
    }, []);

    const validationSchema = Yup.object({
        firsT_NAME: Yup.string().test(
            "required",
            // "First Name Required",
            t("text.reqFirst"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),

        logiN_NAME: Yup.string().test(
            "required",
            // "login ID Required",
            t("text.reqLogin"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        password: Yup.string().test(
            "required",
            // "Password Required",
            t("text.reqPassword"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        cuR_MOBILE: Yup.string()
            // .required("Mobile Number Required")
            .required(t("text.reqMobile"))
            .test(
                // "is-valid-mobile",
                t("text.validMobile"),
                // "Invalid mobile number format",
                t("text.InvalidMobile"),
                function (value: any) {
                    const trimmedValue = value.trim();
                    if (trimmedValue && trimmedValue.length === 10) {
                        if (trimmedValue.charAt(0) === "0") {
                            return false;
                        }
                        return true;
                    }
                    return false;
                }
            ),
        email: Yup.string()
            // .required("Email ID Required")
            .required(t("text.reqEmail"))
            .test(
                // "is-valid-email",
                t("text.validEmai"),
                t("text.InvalidEmail"),
                // "Invalid email format",
                function (value: any) {
                    const trimmedValue = value.trim();
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
                }
            ),
        dob: Yup.string().test(
            "required",
            // "Date of Birth Required",
            t("text.reqDate"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        gendeR_ID: Yup.string().test(
            "required",
            // "Gender Required",
            t("text.reqGender"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        useR_TYPE_ID: Yup.string().test(
            "required",
            // "User Type Required",
            t("text.reqUser"),

            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        rolename: Yup.string().test(
            "required",
            // "Role Required",
            t("text.reqRole"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });

    const formik = useFormik({
        initialValues: {
            useR_ID: "-1",
            ranK_ID: "",
            suR_NAME: "",
            firsT_NAME: "",
            middlE_NAME: "",
            shorT_NAME: "",
            useR_CODE: "",
            dob: "",
            doa: "",
            doj: "",
            gendeR_ID: "",
            cuR_PHONE: "",
            cuR_MOBILE: "",
            email: "",
            iS_ACTIVE: true,
            iS_DELETED: false,
            useR_TYPE_ID: "",
            otp: "",
            logiN_NAME: "",
            password: "",
            rolename: "",
            employeeID: 0,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.doa = "1900-01-01T07:47:27.349Z";
            values.doj = "1900-01-01T07:47:27.349Z";

            const response = await api.post(`USER/AddUpdateUSER`, values);
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }
            navigate("/UserManagement/UserManagement");
        },
    });

    const requiredFields = [
        "firsT_NAME",

        "logiN_NAME",
        "password",
        "cuR_MOBILE",
        "email",
        "dob",
        "gendeR_ID",
        "useR_TYPE_ID",
        "rolename",
    ];

    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                    border: ".5px solid #ff7722",
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
                            

                            <Grid xs={12} sm={4} item>
                            <TextField
                                    type="text"
                                    label={<CustomLabel text={t("text.EnterCommitteeOrGroupName")} />}
                                    value={formik.values.firsT_NAME}
                                    name="firsT_NAME"
                                    id="firsT_NAME"
                                    placeholder={t("text.EnterCommitteeOrGroupName")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>


                            <Grid xs={12} sm={4} item alignItems="center" sx={{}}>
                                <input type="checkbox" aria-label="Head" placeholder="Head"/>
                                <label>{t("text.Head")}</label>
                            </Grid>

                            <Grid xs={12} sm={4} item>
                            </Grid>

                            <Grid xs={12} sm={4} item>
                            <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={option}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("gendeR_ID", newValue?.value);
                                        formik.setFieldTouched("gendeR_ID", true);
                                        formik.setFieldTouched("gendeR_ID", false);
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
                                        formik.setFieldValue("gendeR_ID", newValue?.value);
                                        formik.setFieldTouched("gendeR_ID", true);
                                        formik.setFieldTouched("gendeR_ID", false);
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
                                    value={formik.values.firsT_NAME}
                                    name="firsT_NAME"
                                    InputLabelProps={{ shrink: true }}
                                    id="firsT_NAME"
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
                                     value={formik.values.firsT_NAME}
                                    InputLabelProps={{ shrink: true }}
                                    name="firsT_NAME"
                                     id="firsT_NAME"
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
                                        {t("text.update")}
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
export default CommitteeEmployeeMappingEdit
