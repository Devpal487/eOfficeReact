import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useState, useEffect, useTransition } from "react";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import CustomLabel from "../../../CustomLable";
import dayjs, { Dayjs } from "dayjs";
import { toast, ToastContainer } from "react-toastify";

import ToastApp from "../../../ToastApp";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";

const containerStyle = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "20px",
  backgroundColor: "#f9f9f9",
};

const headerStyle: any = {
  backgroundColor: "#3cc4d6",
  padding: "10px",
  borderRadius: "5px",
  textAlign: "center",
  fontWeight: "bold",
  color: "#333",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

type Props = {};

const AplicantDetailsEdit = (props: Props) => {
  const location = useLocation();
  // console.log('location', location.state)
  const { i18n, t } = useTranslation();
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

  let navigate = useNavigate();

  const [toaster, setToaster] = useState(false);

  const back = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: location.state.id,
      name: location.state.name,
      rollNo: location.state.rollNo,
      mobileNo: location.state.mobileNo,
      emailId: location.state.emailId,
      dob: dayjs(location.state.dob).format("YYYY-MM-DD"),
      certificateId: location.state.certificateId,
      otp: location.state.otp,
      status: location.state.status,
      address: location.state.address,
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
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          marginTop: "5px",
          border: ".5px solid #2B4593",
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
                {t("text.EditAplicantDetails")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}>
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
            <Grid container spacing={1}>
              {/* <ToastContainer /> */}
              {toaster === false ? "" : <ToastApp />}

              <Grid item xs={12}>
                <div style={containerStyle}>
                  {/* Header */}
                  <div style={headerStyle}>Aplicant Details</div>

                  {/* Form Fields */}
                  <Grid container spacing={2} sx={{ marginTop: "1%" }}>
                    <Grid xs={12} sm={4} item>
                      <TranslateTextField
                        label={t("text.Name")}
                        value={formik.values.name}
                        onChangeText={(text: string) =>
                          handleConversionChange("name", text)
                        }
                        required={true}
                        lang={lang}
                      />
                    </Grid>
                    <Grid xs={12} sm={4} item>
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

                    <Grid xs={12} sm={4} item>
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

                    <Grid xs={12} sm={4} item>
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

                    <Grid xs={12} sm={4} item>
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
                    <Grid xs={12} sm={4} item>
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

                    <Grid xs={12} sm={4} item>
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

                    <Grid xs={12} sm={4} item>
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
                    <Grid xs={12} sm={4} item>
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
                  </Grid>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={1} sx={{ marginTop: "2%" }}>
              <Grid item xs={12}>
                <div style={containerStyle}>
                  {/* Header */}
                  <div style={headerStyle}>Aplicant Details</div>

                  {/* Form Fields */}
                  <Grid container spacing={2} sx={{ marginTop: "1%" }}>
                    <Grid xs={12} sm={4} item>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsCountry}
                        fullWidth
                        size="small"
                        value={
                          IsCountry.find(
                            (opt) => opt.value === formik.values.certificateId
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            "certificateId",
                            newValue?.value
                          );
                          getState(newValue?.value);
                          formik.setFieldTouched("certificateId", true);
                          formik.setFieldTouched("certificateId", false);
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

                    <Grid xs={12} sm={4} item>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsState}
                        fullWidth
                        size="small"
                        value={
                          IsState.find(
                            (opt) => opt.value === formik.values.certificateId
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            "certificateId",
                            newValue?.value
                          );
                          getDistrict(newValue?.value);
                          formik.setFieldTouched("certificateId", true);
                          formik.setFieldTouched("certificateId", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={<CustomLabel text={t("text.SelectState")} />}
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={4} item>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsDistrict}
                        fullWidth
                        size="small"
                        value={
                          IsDistrict.find(
                            (opt) => opt.value === formik.values.certificateId
                          ) || null
                        }
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
                              <CustomLabel text={t("text.SelectDistrict")} />
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={4} item>
                      <TranslateTextField
                        label={t("text.Address")}
                        value={formik.values.address}
                        onChangeText={(text: string) =>
                          handleConversionChange("address", text)
                        }
                        required={true}
                        lang={lang}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={1} sx={{ marginTop: "2%" }}>
            <Grid item xs={12}>
                <div style={containerStyle}>
                  {/* Header */}
                  <div style={headerStyle}>Aplicant Details</div>

                  {/* Form Fields */}
                  <Grid container spacing={2} sx={{ marginTop: "1%" }}>
              <Grid xs={12} sm={6} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  value={
                    option.find(
                      (opt) => opt.value === formik.values.certificateId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue("certificateId", newValue?.value);
                    formik.setFieldTouched("certificateId", true);
                    formik.setFieldTouched("certificateId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.ChooseServices")} />}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6} item>
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
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default AplicantDetailsEdit;
