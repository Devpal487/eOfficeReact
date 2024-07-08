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

type Props = {};

const CertificateAdd = (props: Props) => {
  const back = useNavigate();
  const { t } = useTranslation();
  const [StatusOps, setStatusOps] = useState([
    { value: "-1", label: t("text.SelectStatus") },
  ]);

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCertificate") },
  ]);

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

  useEffect(() => {
    getFileNo();
    getStatus();
  }, []);

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
        setToaster(true)
        navigate("/master/Certificate");
      } else {
        setToaster(true)
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [""];

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
          <Typography
            variant="h5"
            textAlign="center"
            style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.CreateCertificateApply")}
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
            <Grid container spacing={1}>
              {/* <ToastContainer /> */}
              {toaster === false ? "" : <ToastApp />}
            

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  name="name"
                  id="name"
                  label={<CustomLabel text={t("text.Name")} required={false} />}
                  value={formik.values.name}
                  placeholder={t("text.Name")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.name && formik.errors.name
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
                  // value={
                  //   option.find(
                  //     (opt) => opt.value === formik.values.CertificateId
                  //   ) || null
                  // }
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
                  // value={
                  //   option.find(
                  //     (opt) => opt.value === formik.values.CertificateId
                  //   ) || null
                  // }
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
                      formik.touched.address && formik.errors.address
                        ? "red"
                        : "initial",
                  }}
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

export default CertificateAdd;
