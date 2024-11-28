import {
  Button,
  CardContent,
  Checkbox,
  Grid,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useLocation, useNavigate } from "react-router-dom";
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
import dayjs, { Dayjs } from "dayjs";
import { getISTDate } from "../../../utils/Constant";

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
  textAlign: "left", // Changed to left
  fontWeight: "bold",
  color: "#ffff",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

type Props = {};

const AplicantDetailsAdd = (props: Props) => {
  const back = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const location = useLocation();
  const studentData = location.state?.[0] || {};

  console.log("checkLocation", location.state);

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectInstitute") },
  ]);

  const [StatusOps, setStatusOps] = useState([
    { value: "-1", label: t("text.SelectStatus") },
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

  let { defaultValuestime } = getISTDate();

  const [services, setServices] = useState([]);
  const [rates, setRates] = useState([]);
  const [dispatches, setDispatches] = useState([]);

  const totalRate = rates.reduce((acc, rate) => acc + rate, 0);
  const totalDispatch = dispatches.reduce((acc, dispatch) => acc + dispatch, 0);
  const netPayment = totalRate + totalDispatch;

  useEffect(() => {
    getFileNo();
    getCountry();
    getStatus();
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

  const getStatus = () => {
    const collectData = {
      serviceId: -1,
      fId: -1,
    };
    api.post(`ServiceMaster/GetServiceMaster`, collectData).then((res) => {
      const arr = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["fName"],
          value: res.data.data[index]["serviceId"],
          dispatchFees: res.data.data[index]["dispatchFees"],
          rate: res.data.data[index]["rate"],
        });
      }
      setStatusOps(arr);
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
      studentId: studentData.studentId || -1,
      studentName: studentData.studentName || "",
      dob: studentData.dob ? dayjs(studentData.dob).format("YYYY-MM-DD") : "",
      email: studentData.email || "",
      mobileNo: studentData.mobileNo || "",
      address: studentData.address || "", // Set from studentData if available
      courseId: studentData.courseId !== undefined ? studentData.courseId : 0, // Ensuring courseId is set
      rollNo: studentData.rollNo || "",
      aadharNo: studentData.aadharNo || "",
      remarks: studentData.remarks || "",
      createdBy: studentData.createdBy || "",
      updatedBy: studentData.updatedBy || "",
      createdOn: studentData.createdOn || defaultValuestime,
      updatedOn: studentData.updatedOn || defaultValuestime,
      attachments: studentData.attachments || "",
      courseName: studentData.courseName || "",
      studentDoc: studentData.studentDoc?.length
        ? studentData.studentDoc.map((doc: any) => ({
            docId: doc.docId !== undefined ? doc.docId : -1,
            studentId: doc.studentId !== undefined ? doc.studentId : -1,
            courseId: doc.courseId !== undefined ? doc.courseId : 0,
            docName: doc.docName || "",
            docImage: doc.docImage || "",
            createdBy: doc.createdBy || "",
            updatedBy: doc.updatedBy || "",
            createdOn: doc.createdOn || defaultValuestime,
            updatedOn: doc.updatedOn || defaultValuestime,
            courseName: doc.courseName || "",
          }))
        : [
            {
              docId: -1,
              studentId: -1,
              courseId: 0,
              docName: "",
              docImage: "",
              createdBy: "",
              updatedBy: "",
              createdOn: defaultValuestime,
              updatedOn: defaultValuestime,
              courseName: "",
            },
          ],
    },

    onSubmit: async (values) => {
      console.log("value", values);
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
              sx={{ backgroundColor: "rgb(183, 28, 28)", width: "100%" }}
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "10px", color: "#ffff", display: "flex" }}
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
                <Typography
                  style={{
                    color: "black",
                    fontWeight: "600",
                    fontSize: "17px",
                  }}
                >
                  Aplicant Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <div style={containerStyle}>
                  {/* Header */}
                  <div style={headerStyle}>Aplicant Details</div>

                  {/* Form Fields */}
                  <Grid
                    container
                    spacing={2}
                    sx={{ marginTop: "1%", justifyContent: "center" }}
                  >
                    <Grid xs={12} sm={3.5} item>
                      <TextField
                        type="text"
                        name="studentName"
                        id="studentName"
                        label={<CustomLabel text={t("text.Name")} />}
                        value={formik.values.studentName}
                        placeholder={t("text.Name")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.studentName &&
                            formik.errors.studentName
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
                        // value={formik.values.rollNo}
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
                        name="email"
                        id="email"
                        label={<CustomLabel text={t("text.Email")} />}
                        value={formik.values.email}
                        placeholder={t("text.Email")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.email && formik.errors.email
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
                        name="aadharNo"
                        id="aadharNo"
                        label={<CustomLabel text={t("text.AdharNo")} />}
                        value={formik.values.aadharNo}
                        placeholder={t("text.AdharNo")}
                        size="small"
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderColor:
                            formik.touched.aadharNo && formik.errors.aadharNo
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
                  <Grid
                    container
                    spacing={2}
                    sx={{ margin: "1%", justifyContent: "center" }}
                  >
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

                    <Grid item xs={12} sm={10.5}>
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
                  <Grid
                    container
                    spacing={2}
                    sx={{ margin: "1%", justifyContent: "center" }}
                  >
                    <Grid xs={12} sm={5.25} item>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        multiple
                        options={StatusOps}
                        fullWidth
                        // value={
                        //   option.find(
                        //     (opt) => opt.value === formik.values.CertificateId
                        //   ) || null
                        // }
                        size="small"
                        onChange={(event, newValue: any) => {
                          console.log(
                            "🚀 ~ CertificateAdd ~ newValue:",
                            newValue
                          );
                          // Extract selected values
                          const selectedServices = newValue.map(
                            (item: any) => item.label
                          );
                          const selectedRates = newValue.map(
                            (item: any) => item.rate
                          );
                          const selectedDispatches = newValue.map(
                            (item: any) => item.dispatchFees
                          );

                          // Update state
                          setServices(selectedServices);
                          setRates(selectedRates);
                          setDispatches(selectedDispatches);

                          // setServiceId(
                          //   newValue.length > 0 ? newValue[0].value : null
                          // );

                          const serviceID = newValue.map((item: any) => ({
                            serviceId: item.value,
                            multiId: -1,
                            id: -1,
                          }));
                          console.log("🚀 ~ serviceID ~ serviceID:", serviceID);

                          formik.setFieldValue("subService", serviceID);

                          formik.setFieldTouched("subService", true);
                          formik.setFieldTouched("subService", false);
                        }}
                        disableCloseOnSelect
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            <ListItemText primary={option.label} />
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.SelectServices")} />
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
                        value={netPayment}
                        placeholder={t("text.Rate")}
                        size="small"
                        fullWidth
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

export default AplicantDetailsAdd;
