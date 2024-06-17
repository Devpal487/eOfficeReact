import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from 'dayjs';
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";

type Props = {};

const UserManagementEdit = (props: Props) => {

  const location = useLocation();
  console.log("location", location.state);
  const { t } = useTranslation();

  const [option, setOption] = useState([{
    value: "-1", label:
      t("text.SelectGender")
  }]);
  const [option1, setOption1] = useState<any>([{ value: "-1", label: t("text.SelectRole"), user_ID:"-1" }]);
  const [option2, setOption2] = useState([{ value: "-1", label: t("text.SelectUserType") }]);
  const [UserName, setUserName] = useState([{ value: "-1", label: t("text.SelectEmployee") }]);
  const [toaster, setToaster] = useState(false);
  const [roletype, setRoleType] =useState<any>([])

  let navigate = useNavigate();

  const back = useNavigate();

  // useEffect(() => {
  //   console.log("roletype updated:", roletype);
  // }, [roletype]);

  useEffect(() => {
    getRole();
    getGender();
    getUserType();
    getUserName();
    // console.log("usertypeID", location.state.useR_TYPE_ID)
    getRolebyid(location.state.useR_ID);
  }, []);

  const getRolebyid = (id:any) => {
    const collectData = {
      useR_ID: id,
    };
    api
      .post( `Auth/GetUSER`, collectData)
      .then((res) => {
        if (res.data && res.data.data.length > 0){
        // console.log("result" + JSON.stringify(res.data.data[0]["subRole"]));
        const roleIDs = res?.data?.data[0]["subRole"];
        console.log("roleIDs" ,roleIDs);
        formik.setFieldValue("subRole",roleIDs);
        console.log("roletype" ,roletype);
        }
      });
  };

  const getGender = () => {
    const collectData = {
      genderID: -1,
    };
    api
      .post( `Gender/GetGenderMaster`, collectData)
      .then((res) => {
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
    api
      .post( `Auth/GetRoleMaster`, collectData)
      .then((res) => {
        const arr = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["roleName"],
            value: res.data.data[index]["roleId"],
            user_ID:res.data.data[index]["user_ID"]
          });
        }
        setOption1(arr);
      });
  };

  const getUserType = () => {
    const collectData = {
      useR_TYPE_ID: -1,
    };
    api
      .post( `Auth/GetUSER_TYPE`, collectData)
      .then((res) => {
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

  const getUserName = () => {
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
      .post( `EmpMaster/GetEmpmaster`, collectData)
      .then((res) => {
        const arr = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            firsT_NAME: res.data.data[index]["empName"],
            useR_CODE: res.data.data[index]["empCode"],
            cuR_MOBILE: res.data.data[index]["empMobileNo"],
            email: res.data.data[index]["email"],
            dob: res.data.data[index]["empDob"],
            gendeR_ID: res.data.data[index]["gender"],
            roleId: res.data.data[index]["roleId"],
            // useR_TYPE_ID: res.data.data[index]["useR_TYPE_ID"],
            label: res.data.data[index]["empName"],
            value: res.data.data[index]["empid"],
          });
        }
        setUserName(arr);
      });
  };

  const validationSchema = Yup.object({
    
    logiN_NAME: Yup.string().test(
      "required",
      t("text.reqLogin"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    password: Yup.string().test(
      "required",
      t("text.reqPassword"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    cuR_MOBILE: Yup.string()
      .required(t("text.reqMobile"))
      .test(
        t("text.validMobile"),
        t("text.InvalidMobile"),
        function (value: any) {
          const trimmedValue = value.trim();
          if (trimmedValue && trimmedValue.length === 10) {
            if (trimmedValue.charAt(0) === '0') {
              return false;
            }
            return true;
          }
          return false;
        }
      ),
    email: Yup.string()
      .required(t("text.reqEmail"))
      .test(
        t("text.validEmai"),
        t("text.InvalidEmail"),
        function (value: any) {
          const trimmedValue = value.trim();
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
        }
      ),
    dob: Yup.string().test(
      "required",
      t("text.reqDate"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    gendeR_ID: Yup.string().test(
      "required",
      t("text.reqGender"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    useR_TYPE_ID: Yup.string().test(
      "required",
      t("text.reqUser"),

      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    subRole: Yup.array().test(
      "required",
      t("text.reqRole"),
      function (value) {
        return value && value.length > 0;
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      useR_ID: location.state.useR_ID,
      ranK_ID: location.state.ranK_ID,
      suR_NAME: location.state.suR_NAME,
      firsT_NAME: location.state.firsT_NAME,
      middlE_NAME: location.state.middlE_NAME,
      shorT_NAME: location.state.shorT_NAME,
      useR_CODE: location.state.useR_CODE,
      dob: dayjs(location.state.dob).format("YYYY-MM-DD"),
      doa: "",
      doj: "",
      gendeR_ID: location.state.gendeR_ID,
      cuR_PHONE: "",
      cuR_MOBILE: location.state.cuR_MOBILE,
      email: location.state.email,
      iS_ACTIVE: location.state.iS_ACTIVE,
      iS_DELETED: location.state.iS_DELETED,
      useR_TYPE_ID: location.state.useR_TYPE_ID,
      otp: "",
      logiN_NAME: location.state.logiN_NAME,
      password: location.state.password,
      rolename: "",
      employeeID:location.state.employeeID,
      user_Type_Name:location.state.user_Type_Name,
      subRole:[]
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.doa = `"1900-01-01T07:47:27.349Z"`;
      values.doj = "1900-01-01T07:47:27.349Z";
      //values.subRole= roletype;

      const errors = await formik.validateForm();

    console.log("Validation errors:", errors);

    if (Object.keys(errors).length === 0) {
      console.log("Submitting form with values:", values);
    } else {
      console.log("Form has validation errors. Cannot submit.");
    }
      const response = await api.post(`Auth/AddUpdateUSER`,values);
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/UserManagement/UserManagement");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [
  
    "logiN_NAME",
    "password",
    "cuR_MOBILE",
    "email",
    "dob",
    "gendeR_ID",
    "useR_TYPE_ID",
    "subRole",
  ];

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          border: ".5px solid #ff7722",
          marginTop: "3vh"
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.EditUserManegment")}
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
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={UserName}
                  

                  fullWidth

                  value={
                    UserName.find(
                      (option:any) => option.value === formik.values.employeeID
                    ) || null
                  }
                  // value={CheckMode}
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue);
                    formik.setFieldValue("firsT_NAME", newValue?.firsT_NAME);
                    formik.setFieldValue("useR_CODE", newValue?.useR_CODE);
                    formik.setFieldValue("cuR_MOBILE", newValue?.cuR_MOBILE);
                    formik.setFieldValue("email", newValue?.email);
                    formik.setFieldValue("dob", newValue?.dob);
                    formik.setFieldValue("gendeR_ID", parseInt(newValue?.gendeR_ID));
                    formik.setFieldValue("employeeID", newValue?.value)
                    formik.setFieldValue("User_NAME", newValue?.label);
                    formik.setFieldValue("ranK_ID", newValue?.roleId);
                  }}
                  style={{ backgroundColor: "white" }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.SelectEmployee")} />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={4} item></Grid>
              <Grid xs={12} sm={4} item></Grid>


              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={
                    <span>
                      {t("text.EnterFirstName")} {" "}
                      {requiredFields.includes("firsT_NAME") && (
                        <span
                          style={{
                            color: formik.values.firsT_NAME ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.firsT_NAME}
                  name="firsT_NAME"
                  id="firsT_NAME"
                  placeholder={t("text.EnterFirstName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={
                    <span>
                      {t("text.EnterLoginName")}{" "}
                      {requiredFields.includes("logiN_NAME") && (
                        <span
                          style={{
                            color: formik.values.logiN_NAME ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  name="logiN_NAME"
                  id="logiN_NAME"
                  value={formik.values.logiN_NAME}
                  placeholder={t("text.EnterLoginName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.logiN_NAME && formik.errors.logiN_NAME ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.logiN_NAME)}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="password"
                  label={
                    <span>
                      {t("text.EnterPassword")} {" "}
                      {requiredFields.includes("password") && (
                        <span
                          style={{
                            color: formik.values.password ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.password}
                  name="password"
                  id="password"
                  placeholder={t("text.EnterPassword")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.password)}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={
                    <span>
                      {t("text.EnterMobileNo")}{" "}
                      {requiredFields.includes("cuR_MOBILE") && (
                        <span
                          style={{
                            color: formik.values.cuR_MOBILE ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  inputProps={{ maxLength: 10 }}
                  name="cuR_MOBILE"
                  id="cuR_MOBILE"
                  value={formik.values.cuR_MOBILE}
                  placeholder={t("text.EnterMobileNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="email"
                  label={
                    <span>
                      {t("text.EnterEmailId")}{" "}
                      {requiredFields.includes("email") && (
                        <span
                          style={{
                            color: formik.values.email ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  name="email"
                  id="email"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.email}
                  placeholder={t("text.EnterEmailId")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputProps={{readOnly:true}}
                />
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="Date"
                  InputLabelProps={{ shrink: true }}
                  label={
                    <span>
                      {t("text.EnterDateOfBirth")} {" "}
                      {requiredFields.includes("dob") && (
                        <span
                          style={{ color: formik.values.dob ? "green" : "red" }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  name="dob"
                  id="dob"
                  placeholder={t("text.EnterDateOfBirth")}
                  value={dayjs(formik.values.dob).format("YYYY-MM-DD")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.dob && formik.errors.dob ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.dob}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  value={
                    option.find(
                      (option:any) => option.value === formik.values.gendeR_ID
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue("gendeR_ID", newValue?.value);
                    formik.setFieldTouched("gendeR_ID", true);
                    formik.setFieldTouched("gendeR_ID", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectGender")} {""}
                          {requiredFields.includes("gendeR_ID") && (
                            <span
                              style={{
                                color: formik.values.gendeR_ID
                                  ? "green"
                                  : "red",
                              }}
                            >
                              *
                            </span>
                          )}
                        </span>
                      }
                    />
                  )}
                />
                {formik.touched.gendeR_ID && formik.errors.gendeR_ID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.gendeR_ID)}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option1}
                  fullWidth
                  multiple
                  size="small"
                  value={option1.filter((opt: any) =>
                    formik.values.subRole.some((role: any) => role.rolE_ID === opt.value)
                  )}
                  onChange={(event:any, newValue:any) => {
                    formik.setFieldValue(
                      "subRole",
                      newValue.map((option: any) => ({
                        rolE_ID: option.value,
                        useR_ID:" ",
                      }))
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectRole")} {""}
                          {requiredFields.includes("subRole") && (
                            <span
                              style={{
                                color: formik.touched.subRole && formik.errors.subRole ? "red" : "green",
                              }}
                            >
                              *
                            </span>
                          )}
                        </span>
                      }
                    />
                  )}
                />
                {formik.touched.subRole && formik.errors.subRole ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.subRole}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option2}
                  fullWidth
                  size="small"
                  value={
                    option2.find(
                      (option:any) => option.value === formik.values.useR_TYPE_ID
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    
                    formik.setFieldValue("useR_TYPE_ID", newValue?.value);
                    formik.setFieldTouched("useR_TYPE_ID", true);
                    formik.setFieldTouched("useR_TYPE_ID", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectUserType")} {""}
                          {requiredFields.includes("useR_TYPE_ID") && (
                            <span
                              style={{
                                color: formik.values.useR_TYPE_ID
                                  ? "green"
                                  : "red",
                              }}
                            >
                              *
                            </span>
                          )}
                        </span>
                      }
                    />
                  )}
                />
                {formik.touched.useR_TYPE_ID && formik.errors.useR_TYPE_ID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.useR_TYPE_ID)}
                  </div>
                ) : null}
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
export default UserManagementEdit;
