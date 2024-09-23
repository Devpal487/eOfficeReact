import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import CustomLabel from "../../../CustomLable";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ToastApp from "../../../ToastApp";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import OtpPopup from "../../../utils/OtpPopup";
import Institute from "../../../assets/images/aktu.png";

const containerStyle = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  justifyContent: "center",
  
  
  //padding: "20px",
  backgroundColor: "#f9f9f9",
};

const headerStyle: any = {
  backgroundColor: "rgb(183, 28, 28)",
  padding: "10px",
  borderRadius: "5px",
  textAlign: "left",  // Changed to left
  fontWeight: "bold",
  color: "#ffff",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

type Props = {};

const AplicantDetailsAdd = (props: Props) => {
  const back = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectInstitute") },
  ]);

  const [IsCountry, setCountry] = useState([
    { value: "-1", label: t("text.SelectCountry") },
  ]);

  const [IsState, setState] = useState([
    { value: "-1", label: t("text.SelectState") },
  ]);

  const [IsDistrict, setDistrict] = useState([
    { value: "-1", label: t("text.SelectCity") },
  ]);

  useEffect(() => {
    getFileNo();
    getCountry();
  }, []);

  const getFileNo = () => {
    const collectData = {
      id: -1,
    };
    api
      .post(`Institute_Master/GetInstitute_Master`, collectData)
      .then((res) => {
        const arr = [];
        // console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["insname"],
            value: res.data.data[index]["id"],
          });
        }
        setOption(arr);
      });
  };

  const getCountry = () => {
    const collectData = {
      countryId: -1,
    };
    api.post(`Country/GetCountryMaster`, collectData).then((res) => {
      const arr = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["countryName"],
          value: res.data.data[index]["countryId"],
        });
      }
      setCountry(arr);
    });
  };

  const getState = (CountId: any) => {
    const collectData = {
      stateId: -1,
      countryId: CountId,
    };
    api.post(`State/GetStateMaster`, collectData).then((res) => {
      const arr = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["stateName"],
          value: res.data.data[index]["stateId"],
        });
      }
      setState(arr);
    });
  };

  const getDistrict = (StateID: any) => {
    const collectData = {
      cityId: -1,
      stateId: StateID,
    };
    api.post(`M10_District/GetDistrictMaster`, collectData).then((res) => {
      const arr = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["cityName"],
          value: res.data.data[index]["cityId"],
        });
      }
      setDistrict(arr);
    });
  };

  const [toaster, setToaster] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: -1,
      name: "",
      rollNo: "",
      mobileNo: "",
      emailId: "",
      dob: "",
      otp: 0,
      certificateId: 0,
      status: 0,
      address: "",
    },

    onSubmit: async (values) => {
      const response = await api.post(
        `CertificateApply/AddUpdateCertificateApply`,
        values
      );
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        setToaster(true);

        navigate("/master/AplicantDetails");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [""];
  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          border: ".5px solid #2B4593",
        }}
      >
        <CardContent>
          <Grid item xs={12} container spacing={2}>
            {/* <Grid item lg={2} md={2} xs={2} marginTop={2}>
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
            </Grid> */}
            <Grid
              item
              lg={12}
              md={12}
              xs={12}
             sx={{backgroundColor:"rgb(183, 28, 28)",width:"100%"}}
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "10px",color:"#ffff",display:"flex" }}
                align="left"

              >
                <img
                    src={Institute}
                    alt="Institute Logo"
                    style={{ marginRight: 8, height: 24 }}
                  />{" "}
                  Institute ERP
              </Typography>
            </Grid>

           
          </Grid>

          <Divider />
          <br />

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} sx={{ marginTop: "2%" }}>
              {/* <ToastContainer /> */}
              {toaster === false ? "" : <ToastApp />}

              <Grid item xs={12} sm={12}>
                <Typography style={{color:"black",fontWeight:"600",fontSize:"17px"}}>Aplicant Details</Typography>
              </Grid>

              <Grid item xs={12} >
                <div style={containerStyle}>
                  {/* Header */}
                  <div style={headerStyle}>Aplicant Details</div>

                  {/* Form Fields */}
                  <Grid container spacing={2} sx={{ marginTop: "1%",justifyContent:"center" }}>
                    <Grid xs={12} sm={3.5} item>
                    <TextField
                        type="text"
                        name="name"
                        id="name"
                        label={<CustomLabel text={t("text.Name")} />}
                        value={formik.values.name}
                        placeholder={t("text.Name")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.rollNo && formik.errors.rollNo
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid xs={12} sm={3.5} item>
                      <TextField
                        type="text"
                        name="rollNo"
                        id="rollNo"
                        label={<CustomLabel text={t("text.RollNo")} />}
                        value={formik.values.rollNo}
                        placeholder={t("text.RollNo")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.rollNo && formik.errors.rollNo
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>

                    <Grid xs={12} sm={3.5} item>
                      <TextField
                        type="text"
                        name="rollNo"
                        id="rollNo"
                        label={<CustomLabel text={t("text.EnrollmentNo")} />}
                        value={formik.values.rollNo}
                        placeholder={t("text.EnrollmentNo")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.rollNo && formik.errors.rollNo
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>

                    <Grid xs={12} sm={3.5} item>
                      <TextField
                        type="text"
                        name="rollNo"
                        id="rollNo"
                        label={<CustomLabel text={t("text.FatherName")} />}
                        value={formik.values.rollNo}
                        placeholder={t("text.FatherName")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.rollNo && formik.errors.rollNo
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>

                    <Grid xs={12} sm={3.5} item>
                      <TextField
                        type="text"
                        name="mobileNo"
                        id="mobileNo"
                        label={<CustomLabel text={t("text.MobNo")} />}
                        value={formik.values.mobileNo}
                        placeholder={t("text.MobNo")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.mobileNo && formik.errors.mobileNo
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid xs={12} sm={3.5} item>
                      <TextField
                        type="text"
                        name="emailId"
                        id="emailId"
                        label={<CustomLabel text={t("text.Email")} />}
                        value={formik.values.emailId}
                        placeholder={t("text.Email")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.emailId && formik.errors.emailId
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>

                    <Grid xs={12} sm={3.5} item>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={option}
                        fullWidth
                        size="small"
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            "certificateId",
                            newValue?.value
                          );
                          formik.setFieldTouched("certificateId", true);
                          formik.setFieldTouched("certificateId", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.InstituteName")} />
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={3.5} item>
                      <TextField
                        type="date"
                        name="dob"
                        id="dob"
                        InputLabelProps={{ shrink: true }}
                        label={<CustomLabel text={t("text.DOB")} />}
                        value={formik.values.dob}
                        placeholder={t("text.DOB")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.dob && formik.errors.dob
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid xs={12} sm={3.5} item>
                      <TextField
                        type="number"
                        name="otp"
                        id="otp"
                        label={<CustomLabel text={t("text.AdharNo")} />}
                        value={formik.values.otp}
                        placeholder={t("text.AdharNo")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.otp && formik.errors.otp
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>

                    <Grid xs={12} sm={12} item></Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "2%" }}>
              <Grid item xs={12}>
                <div style={containerStyle}>
                  {/* Header */}
                  <div style={headerStyle}>Postel Address</div>

                  {/* Form Fields */}
                  <Grid container spacing={2} sx={{ margin: "1%",justifyContent: "center" }}>
                  <Grid xs={12} sm={3.5} item>
                      <Autocomplete
                        disablePortal
                        id="country-autocomplete"
                        options={IsCountry}
                        fullWidth
                        size="small"
                        onChange={(event, newValue) => {
                          formik.setFieldValue("country", newValue?.value);
                          getState(newValue?.value);
                          formik.setFieldTouched("country", true);
                          formik.setFieldTouched("country", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.SelectCountry")} />
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={3.5} item>
                      <Autocomplete
                        disablePortal
                        id="state-autocomplete"
                        options={IsState}
                        fullWidth
                        size="small"
                        onChange={(event, newValue) => {
                          formik.setFieldValue("state", newValue?.value);
                          getDistrict(newValue?.value);
                          formik.setFieldTouched("state", true);
                          formik.setFieldTouched("state", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={<CustomLabel text={t("text.SelectState")} />}
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={3.5} item>
                      <Autocomplete
                        disablePortal
                        id="district-autocomplete"
                        options={IsDistrict}
                        fullWidth
                        size="small"
                        onChange={(event, newValue) => {
                          formik.setFieldValue("district", newValue?.value);
                          formik.setFieldTouched("district", true);
                          formik.setFieldTouched("district", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={<CustomLabel text={t("text.SelectCity")} />}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={10.5} >
                    <TextField
                        type="text"
                        name="address"
                        id="address"
                        label={<CustomLabel text={t("text.Address")} />}
                        value={formik.values.address}
                        placeholder={t("text.Address")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.rollNo && formik.errors.address
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: "2%" }}>
              <Grid item xs={12}>
                <div style={containerStyle}>
                  {/* Header */}
                  <div style={headerStyle}>Choose Services</div>

                  {/* Form Fields */}
                  <Grid container spacing={2} sx={{ margin: "1%",justifyContent: "center" }}>
                    <Grid xs={12} sm={5.25} item>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={option}
                        fullWidth
                        size="small"
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            "certificateId",
                            newValue?.value
                          );
                          formik.setFieldTouched("certificateId", true);
                          formik.setFieldTouched("certificateId", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.ChooseServices")} />
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={5.25} item>
                      <TextField
                        type="text"
                        name="emailId"
                        id="emailId"
                        label={<CustomLabel text={t("text.Rate")} />}
                        value={formik.values.emailId}
                        placeholder={t("text.Rate")}
                        size="small"
                        fullWidth
                        style={{
                          
                          borderColor:
                            formik.touched.emailId && formik.errors.emailId
                              ? "red"
                              : "initial",
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ marginTop: "2%" }}>
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

export default AplicantDetailsAdd;
