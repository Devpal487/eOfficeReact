import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Modal,
  Box,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import nopdf from "../../assets/images/imagepreview.jpg";
import dayjs, { Dayjs } from "dayjs";
import api from "../../utils/Url";
import Languages from "../../Languages";
import TranslateTextField from "../../TranslateTextField";
import { Language } from "react-transliterate";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

type Props = {};

const EmployeeEdit = (props: Props) => {
  const { i18n, t } = useTranslation();

  const [EmpDesignation, setEmpDesignation] = useState<any>([
    { value: "-1", label: t("text.SelectDesignation") },
  ]);
  const [Department, setDepartment] = useState<any>([
    { value: "-1", label: t("text.SelectDepartment") },
  ]);
  const [StateOption, setStateOption] = useState<any>([
    { value: "-1", label: t("text.SelectState") },
  ]);
  const [Country, setCountry] = useState<any>([
    { value: "-1", label: t("text.SelectCountry") },
  ]);
  const [City, setCity] = useState<any>([
    { value: "-1", label: t("text.SelectCity") },
  ]);
  const [Gender, setGender] = useState<any>([
    { value: "-1", label: t("text.SelectGender") },
  ]);
  const [Role, setRole] = useState<any>([
    { value: "-1", label: t("text.SelectRole") },
  ]);
  const [lang, setLang] = useState<Language>("en");

  const location = useLocation();
  console.log("location", location.state);

  useEffect(() => {
    getGender();
    getRole();
    getEmpDesignation();
    getDepartment();
   // getState();
    getCountry();
   // getCity();
    getimgbyid();
    getSignById();
    formik.setFieldValue("empStateId", location.state.empStateId);
  }, []);

  const getEmpDesignation = () => {
    const collectData = {
      designationId: -1,
    };
    api.post(`Designation/GetDesignationmaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.designationName,
        value: item.designationId,
      }));
      setEmpDesignation(arr);
    });
  };

  const getDepartment = () => {
    const collectData = {
      departmentId: -1,
      departmentName: "",
    };
    api.post(`Department/GetDepartmentmaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.departmentName,
        value: item.departmentId,
      }));
      setDepartment(arr);
    });
  };
  const getState = (countryId:any) => {
    const collectData = {
      stateId: -1,
      countryId:countryId,
    };
    api.post(`State/GetStateMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.stateName,
        value: item.stateId,
      }));
      setStateOption(arr);
    });
  };

  const getCountry = () => {
    const collectData = {
      countryId: -1,
    };
    api.post(`Country/GetCountryMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.countryName,
        value: item.countryId,
      }));
      setCountry(arr);
    });
  };

  const getCity = (stateId:any) => {
    const collectData = {
      cityId: -1,
      stateId:stateId,
    };
    api.post(`M10_District/GetDistrictMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.cityName,
        value: item.cityId,
      }));
      setCity(arr);
    });
  };

  const getGender = () => {
    const collectData = {
      genderID: -1,
    };
    api.post(`Gender/GetGenderMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.genderName,
        value: item.genderID,
      }));
      setGender(arr);
    });
  };

  const getRole = () => {
    const collectData = {
      roleId: "-1",
    };
    api.post(`Auth/GetRoleMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.roleName,
        value: item.roleId,
      }));
      console.log(" arr ", arr);
      setRole(arr);
    });
  };

  const getimgbyid = () => {
    const collectData = {
      empid: location.state.empid,
      userId: location.state.userId,
      empName: location.state.empName,
      empMobileNo: location.state.empMobileNo,
      empDesignationId: location.state.empDesignationId,
      empDeptId: location.state.empDeptId,
      empStateId: location.state.empStateId,
      empCountryID: location.state.empCountryID,
      empCityId: location.state.empCityId,
      empPincode: location.state.empPincode,
      roleId: location.state.roleId,
    };

    api.post(`EmpMaster/GetEmpmaster`, collectData).then((res) => {
      console.log("result" + JSON.stringify(res.data.data[0]["imageFile"]));

      const Doc = res.data.data[0]["imageFile"];
      formik.setFieldValue("imageFile", Doc);
    });
  };

  const getSignById = () => {
    const collectData = {
      empid: location.state.empid,
      userId: location.state.userId,
      empName: location.state.empName,
      empMobileNo: location.state.empMobileNo,
      empDesignationId: location.state.empDesignationId,
      empDeptId: location.state.empDeptId,
      empStateId: location.state.empStateId,
      empCountryID: location.state.empCountryID,
      empCityId: location.state.empCityId,
      empPincode: location.state.empPincode,
      roleId: location.state.roleId,
    };

    api.post(`EmpMaster/GetEmpmaster`, collectData).then((res) => {
      console.log("result" + JSON.stringify(res.data.data[0]["signatureFile"]));

      const Doc = res.data.data[0]["signatureFile"];
      formik.setFieldValue("signatureFile", Doc);
    });
  };

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "imageFile") {
      setModalImg(formik.values.imageFile);
    }
  };

  const handlePanClose1 = () => {
    setOpen(false);
  };
  const modalOpenHandle1 = (event: any) => {
    setOpen(true);
    if (event === "signatureFile") {
      setImg(formik.values.signatureFile);
    }
  };

  const ConvertBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const otherDocChangeHandler = async (event: any, params: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];
      if (fileExtension.toLowerCase() != "file") {
        const base64 = await ConvertBase64(file);
        formik.setFieldValue(params, base64);
        console.log(base64);
      } else {
        alert("Only  files are allowed to be uploaded.");
        event.target.value = null;
      }
    }
  };

  let navigate = useNavigate();

  const [toaster, setToaster] = useState(false);

  const [option, setOption] = useState([
    {
      value: "-1",
      label: t("text.SelectGender"),
    },
  ]);

  const validationSchema = Yup.object({
    empName: Yup.string().test(
      "required",
      t("text.EmpNameRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empCode: Yup.string().test(
      "required",
      t("text.EmpCodeRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empFatherName: Yup.string().test(
      "required",
      t("text.FatherNameRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empMobileNo: Yup.string().test(
      "required",
      t("text.MobNoRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empPanNumber: Yup.string()
      .matches(/^[A-Z]{3}[A-ZHPTCF][A-Z]\d{4}[A-Z]$/, "Invalid PAN format")
      .required(t("text.PanNoRequired")),

    empDob: Yup.string().test(
      "required",
      t("text.DobRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    empJoiningDate: Yup.string().test(
      "required",
      t("text.JoiningDateRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empDesignationId: Yup.string().test(
      "required",
      t("text.DesignationRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empDeptId: Yup.string().test(
      "required",
      t("text.DepartmentRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empPerAddress: Yup.string().test(
      "required",
      t("text.PermanentAddressRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empPincode: Yup.string().test(
      "required",
      t("text.PincodeRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    empAddharNo: Yup.string()
      .required(t("text.AdharNoRequired"))
      .test("len", "Aadhaar number must be exactly 12 digits", (val: any) =>
        val ? val.replace(/\D/g, "").length === 12 : true
      ),
    email: Yup.string()
      .required(t("text.reqEmail"))
      .test("is-valid-email", "Invalid email format", function (value: any) {
        const trimmedValue = value.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
      }),
  });

  const formik = useFormik({
    initialValues: {
      empid: location.state.empid,
      empName: location.state.empName,
      empCode: location.state.empCode,
      empPerAddress: location.state.empPerAddress,
      empLocalAddress: location.state.empLocalAddress,
      empFatherName: location.state.empFatherName,
      empspauseName: location.state.empspauseName,
      empMotherName: location.state.empMotherName,
      empMobileNo: location.state.empMobileNo,
      empStatus: location.state.empStatus,
      empPanNumber: location.state.empPanNumber,
      empAddharNo: location.state.empAddharNo,
      empDob: dayjs(location.state.empDob).format("YYYY-MM-DD"),
      empJoiningDate: dayjs(location.state.empJoiningDate).format("YYYY-MM-DD"),
      empretirementDate: dayjs(location.state.empretirementDate).format(
        "YYYY-MM-DD"
      ),
      empPincode: location.state.empPincode,
      roleId: location.state.roleId,
      imageFile: location.state.imageFile,
      signatureFile: location.state.signatureFile,
      email: location.state.email,
      dlno: location.state.dlno,
      gender: location.state.gender,
      sortOrder: location.state.sortOrder,
      isActive: location.state.isActive,
      user_ID: location.state.user_ID,
      empDesignationId: location.state.empDesignationId,
      empDeptId: location.state.empDeptId,
      empStateId: location.state.empStateId,
      empCountryID: location.state.empCountryID,
      empCityId: location.state.empCityId,
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== "")
      );

      const response = await api.post(
        `EmpMaster/AddUpdateEmpmaster`,
        filteredValues
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/Employee/EmployeeMaster");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [
    "empName",
    "empCode",
    "empPerAddress",
    "empFatherName",
    "empMobileNo",
    "empPanNumber",
    "empDob",
    "empJoiningDate",
    "empDesignationId",
    "empDeptId",
    "empAddharNo",
    "email",
    "empPincode",
  ];

  const back = useNavigate();

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };


  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",

          border: ".5px solid #00009c",

          marginTop: "3vh",
        }}
      >
        <CardContent>

          <Grid item xs={12} container spacing={2}>
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid
              item
              lg={7}
              md={7}
              xs={7}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.EditEmployeeRegistration")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>

          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={4} xs={12}>
              <TranslateTextField
                  label={t("text.EnterEmployeeName")}
                  value={formik.values.empName}
                  onChangeText={(text: string) =>
                    handleConversionChange("empName", text)
                  }
                  required={false}
                  lang={lang}
                />
                {formik.touched.empName && formik.errors.empName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empName)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="empCode"
                  name="empCode"
                  label={
                    <span>
                      {t("text.EnterEmployeeCode")}{" "}
                      {requiredFields.includes("empCode") && (
                        <span
                          style={{
                            color: formik.values.empCode ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.empCode}
                  placeholder={t("text.EnterEmployeeCode")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.empCode && formik.errors.empCode
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.empCode && formik.errors.empCode ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empCode)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.EnterFatherName")}
                  value={formik.values.empFatherName}
                  onChangeText={(text: string) =>
                    handleConversionChange("empFatherName", text)
                  }
                  required={false}
                  lang={lang}
                />
                {formik.touched.empFatherName && formik.errors.empFatherName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empFatherName)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
              <TranslateTextField
                  label={t("text.EnterSpauseName")}
                  value={formik.values.empspauseName}
                  onChangeText={(text: string) =>
                    handleConversionChange("empspauseName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
              <TranslateTextField
                  label={t("text.EnterMotherName")}
                  value={formik.values.empMotherName}
                  onChangeText={(text: string) =>
                    handleConversionChange("empMotherName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="empMobileNo"
                  name="empMobileNo"
                  inputProps={{ min: "0", maxLength: 10 }}
                  type="number"
                  label={
                    <span>
                      {t("text.EnterMobileNo")}{" "}
                      {requiredFields.includes("empMobileNo") && (
                        <span
                          style={{
                            color: formik.values.empMobileNo ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.empMobileNo}
                  placeholder={t("text.EnterMobileNo")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.empMobileNo && formik.errors.empMobileNo
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.empMobileNo && formik.errors.empMobileNo ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empMobileNo)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="email"
                  name="email"
                  label={
                    <span>
                      {t("text.EnterEmail")}{" "}
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
                  value={formik.values.email}
                  placeholder={t("text.EnterEmail")}
                  inputProps={{}}
                  size="small"
                  type="email"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.email)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="empPanNumber"
                  name="empPanNumber"
                  label={
                    <span>
                      {t("text.EnterPanNo")}{" "}
                      {requiredFields.includes("empPanNumber") && (
                        <span
                          style={{
                            color: formik.values.empPanNumber ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.empPanNumber}
                  placeholder={t("text.EnterPanNo")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.empPanNumber && formik.errors.empPanNumber
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.empPanNumber && formik.errors.empPanNumber ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empPanNumber)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="empAddharNo"
                  name="empAddharNo"
                  label={
                    <span>
                      {t("text.EnterAdharNumber")}{" "}
                      {requiredFields.includes("empAddharNo") && (
                        <span
                          style={{
                            color: formik.values.empAddharNo ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.empAddharNo}
                  placeholder={t("text.EnterAdharNumber")}
                  type="number"
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  inputProps={{ maxLength: 12 }}
                />
                {formik.touched.empAddharNo && formik.errors.empAddharNo ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empAddharNo)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="empDob"
                  type="date"
                  name="empDob"
                  label={
                    <span>
                      {t("text.EnterDOB")}{" "}
                      {requiredFields.includes("empDob") && (
                        <span
                          style={{
                            color: formik.values.empDob ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.empDob}
                  placeholder={t("text.EnterDOB")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.empDob && formik.errors.empDob
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.empDob && formik.errors.empDob ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.empDob}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="empJoiningDate"
                  name="empJoiningDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  label={
                    <span>
                      {t("text.EnterJoiningDate")}{" "}
                      {requiredFields.includes("empJoiningDate") && (
                        <span
                          style={{
                            color: formik.values.empJoiningDate
                              ? "green"
                              : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.empJoiningDate}
                  placeholder={t("text.EnterJoiningDate")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.empJoiningDate &&
                      formik.errors.empJoiningDate
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.empJoiningDate &&
                formik.errors.empJoiningDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.empJoiningDate}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="empretirementDate"
                  name="empretirementDate"
                  label={t("text.EnterRetirementDate")}
                  value={formik.values.empretirementDate}
                  placeholder={t("text.EnterRetirementDate")}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  type="date"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={EmpDesignation}
                  fullWidth
                  style={{
                    backgroundColor: "white",
                  }}
                  size="small"
                  value={
                    EmpDesignation.find(
                      (option: any) =>
                        option.value === formik.values.empDesignationId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("empDesignationId", newValue?.value);
                    formik.setFieldTouched("empDesignationId", true);
                    formik.setFieldTouched("empDesignationId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectDesignation")}{" "}
                          {requiredFields.includes("empDesignationId") && (
                            <span
                              style={{
                                color: formik.values.empDesignationId
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
                {formik.touched.empDesignationId &&
                formik.errors.empDesignationId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empDesignationId)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Department}
                  fullWidth
                  size="small"
                  value={
                    Department.find(
                      (option: any) => option.value === formik.values.empDeptId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("empDeptId", newValue?.value);
                    formik.setFieldTouched("empDeptId", true);
                    formik.setFieldTouched("empDeptId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectDepartment")}{" "}
                          {requiredFields.includes("empDeptId") && (
                            <span
                              style={{
                                color: formik.values.empDeptId
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
                {formik.touched.empDeptId && formik.errors.empDeptId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empDeptId)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Country}
                  fullWidth
                  size="small"
                  value={
                    Country.find(
                      (option: any) =>
                        option.value === formik.values.empCountryID
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("empCountryID", newValue?.value);
                    formik.setFieldTouched("empCountryID", true);
                    formik.setFieldTouched("empCountryID", false);
                    getState(newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectCountry")} {""}
                          {requiredFields.includes("empCountryID") && (
                            <span
                              style={{
                                color: formik.values.empCountryID
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
                {formik.touched.empCountryID && formik.errors.empCountryID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empCountryID)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StateOption}
                  fullWidth
                  size="small"
                  value={
                    StateOption.find(
                      (option: any) => option.value === formik.values.empStateId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("empStateId", newValue?.value);
                    formik.setFieldTouched("empStateId", true);
                    formik.setFieldTouched("empStateId", false);
                    getCity(newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectState")} {""}
                          {requiredFields.includes("empStateId") && (
                            <span
                              style={{
                                color: formik.values.empStateId
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
                {formik.touched.empStateId && formik.errors.empStateId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empStateId)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={City}
                  fullWidth
                  size="small"
                  value={
                    City.find(
                      (option: any) => option.value === formik.values.empCityId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("empCityId", newValue?.value);
                    formik.setFieldTouched("empCityId", true);
                    formik.setFieldTouched("empCityId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectCity")} {""}
                          {requiredFields.includes("cityId") && (
                            <span
                              style={{
                                color: formik.values.empCityId
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
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Role}
                  fullWidth
                  size="small"
                  value={
                    Role.find(
                      (option: any) => option.value === formik.values.roleId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("roleId", newValue?.value + "");
                    formik.setFieldTouched("roleId", true);
                    formik.setFieldTouched("roleId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectRole")} {""}
                          {requiredFields.includes("roleId") && (
                            <span
                              style={{
                                color: formik.values.roleId ? "green" : "red",
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
                {formik.touched.roleId && formik.errors.roleId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.roleId)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Gender}
                  fullWidth
                  size="small"
                  value={
                    Gender.find(
                      (option: any) =>
                        option.value + "" === formik.values.gender
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("gender", newValue?.value + "");
                    formik.setFieldTouched("gender", true);
                    formik.setFieldTouched("gender", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectGender")} {""}
                          {requiredFields.includes("gender") && (
                            <span
                              style={{
                                color: formik.values.gender ? "green" : "red",
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
                {formik.touched.gender && formik.errors.gender ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.gender)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
              <TranslateTextField
                  label={t("text.EnterLocalAddress")}
                  value={formik.values.empLocalAddress}
                  onChangeText={(text: string) =>
                    handleConversionChange("empLocalAddress", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
              <TranslateTextField
                  label={t("text.EnterPermanentAddress")}
                  value={formik.values.empPerAddress}
                  onChangeText={(text: string) =>
                    handleConversionChange("empPerAddress", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.empPerAddress && formik.errors.empPerAddress ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empPerAddress)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="empPincode"
                  name="empPincode"
                  label={
                    <span>
                      {t("text.EnterPincode")}{" "}
                      {requiredFields.includes("empPincode") && (
                        <span
                          style={{
                            color: formik.values.empPincode ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.empPincode}
                  placeholder={t("text.EnterPincode")}
                  inputProps={{ maxLength: 6 }}
                  size="small"
                  type="number"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.empPincode && formik.errors.empPincode ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.empPincode)}
                  </div>
                ) : null}
              </Grid>

              <Grid container spacing={1} item>
                <Grid
                  xs={12}
                  md={4}
                  sm={4}
                  item
                  style={{ marginBottom: "30px", marginTop: "30px" }}
                >
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.AttachedImage")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "imageFile")}
                  />
                </Grid>
                <Grid xs={12} md={4} sm={4} item></Grid>

                <Grid xs={12} md={4} sm={4} item>
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      margin: "10px",
                    }}
                  >
                    {formik.values.imageFile == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <img
                        src={formik.values.imageFile}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                          padding: "2px",
                        }}
                      />
                    )}
                    <Typography
                      onClick={() => modalOpenHandle("imageFile")}
                      style={{
                        textDecorationColor: "blue",
                        textDecorationLine: "underline",
                        color: "blue",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {t("text.Preview")}
                    </Typography>
                  </Grid>
                </Grid>
                <Modal open={panOpens} onClose={handlePanClose}>
                  <Box sx={style}>
                    {modalImg == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={modalImg}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
              </Grid>

              <Grid container spacing={1} item>
                <Grid
                  xs={12}
                  md={4}
                  sm={4}
                  item
                  style={{ marginBottom: "30px", marginTop: "30px" }}
                >
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.AttachedSignature")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "signatureFile")}
                  />
                </Grid>
                <Grid xs={12} md={4} sm={4} item></Grid>

                <Grid xs={12} md={4} sm={4} item>
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      margin: "10px",
                    }}
                  >
                    {formik.values.signatureFile == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <img
                        src={formik.values.signatureFile}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                          padding: "2px",
                        }}
                      />
                    )}
                    <Typography
                      onClick={() => modalOpenHandle1("signatureFile")}
                      style={{
                        textDecorationColor: "blue",
                        textDecorationLine: "underline",
                        color: "blue",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {t("text.Preview")}
                    </Typography>
                  </Grid>
                </Grid>

                <Modal open={Opens} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {Img == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={Img}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: "#059669",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.save")}
                  </Button>
                </Grid>
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default EmployeeEdit;
