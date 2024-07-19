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


type Props = {};

const CertificateEdit = (props: Props) => {
  const location = useLocation();
  // console.log('location', location.state)
  const { i18n, t } = useTranslation();

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCertificate") },
  ]);
  const [StatusOps, setStatusOps] = useState([
    { value: "-1", label: t("text.SelectStatus") },
  ]);
  const [lang, setLang] = useState<Language>("en");

  const getFileNo = () => {
    const collectData = {
      fnId: -1,
      fId: -1,
      inst_id: -1,
      user_id: -1,
      divisionId: -1,
    };
    api.post(`FileNumber/GetFileNumber`, collectData).then((res) => {
      const arr = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["fileNm"],
          value: res.data.data[index]["fnId"],
        });
      }
      setOption(arr);
    });
  };

  const getStatus = () => {
    const collectData = {
      fnId: -1,
      fId: -1,
      inst_id: -1,
      user_id: -1,
      divisionId: -1,
    };
    api.post(`FileNumber/GetFileNumber`, collectData).then((res) => {
      const arr = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["fileNm"],
          value: res.data.data[index]["fnId"],
        });
      }
      setStatusOps(arr);
    });
  };

  let navigate = useNavigate();

  useEffect(() => {
    getFileNo();
    getStatus();
  }, []);

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
          setToaster(true)
          navigate("/master/Certificate");
        } else {
          setToaster(true)
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
        <Grid item xs={12} container spacing={2} >
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
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.EditCertificateApply")}
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
            {toaster === false ? "" : <ToastApp />}
           
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
                  label={<CustomLabel text={t("text.OTP")} />}
                  value={formik.values.otp}
                  placeholder={t("text.OTP")}
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

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  value={
                    option.find(
                      (opt) => opt.value === formik.values.certificateId
                    ) || null
                  }
                  size="small"
                  onChange={(event, newValue) => {
                    // console.log(newValue?.value);
                    // formik.setFieldValue("parentName", newValue?.label);
                    formik.setFieldValue("certificateId", newValue?.value);
                    formik.setFieldTouched("certificateId", true);
                    formik.setFieldTouched("certificateId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectCertificate")} />}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StatusOps}
                  fullWidth
                  value={
                    StatusOps.find(
                      (opt) => opt.value === formik.values.status
                    ) || null
                  }
                  size="small"
                  onChange={(event, newValue) => {
                    // console.log(newValue?.value);
                    // formik.setFieldValue("parentName", newValue?.label);
                    formik.setFieldValue("status", newValue?.value);
                    formik.setFieldTouched("status", true);
                    formik.setFieldTouched("status", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectStatus")} />}
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

export default CertificateEdit;
