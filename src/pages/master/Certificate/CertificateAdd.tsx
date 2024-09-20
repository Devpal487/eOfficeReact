import {
  Box,
  Button,
  CardContent,
  Checkbox,
  Grid,
  ListItemText,
  Modal,
  Paper,
  PaperProps,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
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
import Draggable from "react-draggable";
import CustomizedProgressBars from "../../../components/Loader";
import PaymentComponent from "../../../utils/PaymentComponent";
import nopdf from "../../../assets/images/imagepreview.jpg";
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

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    padding: "5px !important",
    backgroundColor: "#00009c",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "2px !important",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "& td, & th": {
    padding: "3px !important",
  },
}));

type Props = {};

const CertificateAdd = (props: Props) => {
  const back = useNavigate();
  const { t } = useTranslation();
  const [StatusOps, setStatusOps] = useState([
    { value: "-1", label: t("text.SelectStatus") },
  ]);

  const [services, setServices] = useState([]);
  const [rates, setRates] = useState([]);
  const [dispatches, setDispatches] = useState([]);

  const totalRate = rates.reduce((acc, rate) => acc + rate, 0);
  const totalDispatch = dispatches.reduce((acc, dispatch) => acc + dispatch, 0);
  const netPayment = totalRate + totalDispatch;

  const [isOtpPopupVisible, setOtpPopupVisible] = useState(false);
  const [tableLoading, setIsTableLoading] = useState(false);

  //console.log("checkID", { service, IsRate, IsDispatch });
  const [PaymentData, setPaymentData] = useState([]);

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCertificate") },
  ]);

  const [lang, setLang] = useState<Language>("en");
  const [isRecord, setIsRecord] = useState(false);
  const [isOtpVerified, setOtpVerified] = useState(false);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [isId, setId] = useState();

  const [toaster, setToaster] = useState(false);
  const [isData, setData] = useState<any>();

  const [isServiceId, setServiceId] = useState<any>();

  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "aadharImage") {
      setModalImg(formik.values.aadharImage);
    }
  };

  const ConvertBase64 = (file: Blob) => {
    console.log(file);
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
      if (!fileExtension.toLowerCase().match(/(jpg|jpeg|png)$/)) {
        alert("Only image files (jpg, jpeg,png) are allowed to be uploaded.");
        event.target.value = null;
        return;
      }

      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);
    }
  };

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

  // const getPayment = (ServId: any) => {
  //   setIsTableLoading(true);
  //   const collectData = {
  //     serviceId: ServId,
  //     fId: -1,
  //   };
  //   api.post(`ServiceMaster/GetServiceMaster`, collectData).then((res) => {
  //     const arr: any = [];
  //     // console.log("result" + JSON.stringify(res.data.data));
  //     for (let index = 0; index < res.data.data.length; index++) {
  //       arr.push({
  //         fName: res.data.data[index]["fName"],
  //         id: res.data.data[index]["serviceId"],
  //         rate: res.data.data[index]["rate"],
  //         dispatchFees: res.data.data[index]["dispatchFees"],
  //       });
  //     }
  //     setPaymentData(arr);
  //     setIsTableLoading(false);
  //   });
  // };

  useEffect(() => {
    getFileNo();
    getStatus();
  }, []);

  const navigate = useNavigate();

  


  const formik = useFormik({
    initialValues: {
      id: -1,
      name: "",
      rollNo: "",
      mobileNo: "",
      emailId: "",
      dob: "",
      otp: "",
      certificateId: 0,
      status: 0,
      address: "",
      aadharNo: "",
      aadharImage: "",
    },

    onSubmit: async (values) => {
      setData(formik.values);
      const response = await api.post(
        `CertificateApply/AddUpdateCertificateApply`,
        values
      );
      if (response.data.isSuccess) {
        // toast.success(response.data.mesg);
        // setToaster(true);

        setOtpPopupVisible(true);
        setId(response.data.data);
        
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
                {t("text.CreateCertificateApply")}
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
            <Grid container spacing={1}>
              {/* <ToastContainer /> */}
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

              <Grid xs={12} sm={4} item>
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    width: "100%",
                    backgroundColor: "blue",
                    margin: "1%",
                  }}
                >
                  Apply
                </Button>
              </Grid>

              <Grid xs={12} sm={4} item></Grid>

              <Grid xs={12} sm={4} item></Grid>

              {isOtpVerified && (
                <>
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
                        label={<CustomLabel text={t("text.AdharUpload")} />}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={(e) =>
                          otherDocChangeHandler(e, "aadharImage")
                        }
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
                        {formik.values.aadharImage == "" ? (
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
                            src={formik.values.aadharImage}
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
                          onClick={() => modalOpenHandle("aadharImage")}
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
                        formik.setFieldValue("certificateId", newValue?.value);
                        formik.setFieldTouched("certificateId", true);
                        formik.setFieldTouched("certificateId", false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <CustomLabel text={t("text.SelectCertificate")} />
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

                  <Grid xs={12} sm={4} item>
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

                        setServiceId(newValue.length > 0 ? newValue[0].value : null);


                        // Update Formik values
                        formik.setFieldValue(
                          "certificateId",
                          newValue.map((item: any) => item.value)
                        );

                        setIsRecord(true);
                        // getPayment(newValue?.value);
                        formik.setFieldTouched("certificateId", true);
                        formik.setFieldTouched("certificateId", false);
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
                </>
              )}
            </Grid>

            {isOtpVerified && (
              <>
                <Grid container spacing={2} sx={{ marginTop: "2%" }}>
                  {isRecord && (
                    <>
                      <Grid item xs={12}>
                        <div style={containerStyle}>
                          {/* Header */}
                          <div style={headerStyle}>Payment Details</div>

                          {/* Form Fields */}
                          <Grid container spacing={1} sx={{ marginTop: "1%" }}>
                            <Grid xs={12} sm={12} item>
                              <TableContainer
                                component={Paper}
                                id="tabcont"
                                sx={{
                                  maxHeight: "65vh",
                                  marginBottom: "10px",
                                  border: "1px solid #fff",
                                }}
                              >
                                <Table
                                  aria-label="customized  table"
                                  style={{
                                    border: "1px gray solid",
                                    borderCollapse: "collapse",
                                    width: "100%",
                                  }}
                                >
                                  <TableHead
                                    style={{
                                      border: "1px gray solid",
                                      borderCollapse: "collapse",
                                      position: "sticky",
                                    }}
                                  >
                                    <TableRow>
                                      {/* <StyledTableCell /> */}

                                      <StyledTableCell
                                        align="center"
                                        style={{
                                          fontSize: 15,
                                          fontWeight: 500,
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          paddingTop: "5px",
                                          paddingBottom: "5px",
                                          // padding: "10px",
                                        }}
                                      >
                                        {t("text.Service")}
                                      </StyledTableCell>
                                      <StyledTableCell
                                        align="center"
                                        style={{
                                          fontSize: 15,
                                          fontWeight: 500,
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          paddingTop: "5px",
                                          paddingBottom: "5px",
                                          // padding: "10px",
                                        }}
                                      >
                                        {t("text.Rate")}
                                      </StyledTableCell>

                                      <StyledTableCell
                                        align="center"
                                        style={{
                                          fontSize: 15,
                                          fontWeight: 500,
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          paddingTop: "5px",
                                          paddingBottom: "5px",
                                          // padding: "10px",
                                        }}
                                      >
                                        {t("text.DispatchFee")}
                                      </StyledTableCell>
                                    </TableRow>
                                  </TableHead>
                                  {/* {tableLoading ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 10,
                              }}
                            >
                              <CustomizedProgressBars />
                            </div>
                          ) : ( */}
                                  <TableBody>
                                    {services.map((service, index) => (
                                      <StyledTableRow
                                        key={index}
                                        sx={{
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          borderTop: "1px solid #bdbbbb",
                                          padding: "2px",
                                        }}
                                      >
                                        <TableCell
                                          style={{
                                            border: "1px gray grey",
                                            borderLeft: "1px solid #bdbbbb",
                                            borderTop: "1px solid #bdbbbb",
                                            padding: "2px",
                                          }}
                                        >
                                          {service}
                                        </TableCell>

                                        <TableCell
                                          style={{
                                            border: "1px gray grey",
                                            borderLeft: "1px solid #bdbbbb",
                                            borderTop: "1px solid #bdbbbb",
                                            padding: "2px",
                                          }}
                                          align="center"
                                        >
                                          {rates[index]}
                                        </TableCell>

                                        <TableCell
                                          style={{
                                            border: "1px gray grey",
                                            borderLeft: "1px solid #bdbbbb",
                                            borderTop: "1px solid #bdbbbb",
                                            padding: "2px",
                                          }}
                                          align="center"
                                        >
                                          {dispatches[index]}
                                        </TableCell>
                                      </StyledTableRow>
                                    ))}

                                    <StyledTableRow
                                      sx={{
                                        border: "1px gray grey",
                                        borderLeft: "1px solid #bdbbbb",
                                        borderTop: "1px solid #bdbbbb",
                                        padding: "2px",
                                        backgroundColor: "#f5f5f5",
                                      }}
                                    >
                                      <TableCell
                                        style={{
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          borderTop: "1px solid #bdbbbb",
                                          padding: "2px",
                                          fontWeight: "bold",
                                          textAlign: "center",
                                        }}
                                      >
                                        Total Fee
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          borderTop: "1px solid #bdbbbb",
                                          padding: "2px",
                                        }}
                                        align="center"
                                      >
                                        {totalRate}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          borderTop: "1px solid #bdbbbb",
                                          padding: "2px",
                                        }}
                                        align="center"
                                      >
                                        {totalDispatch}
                                      </TableCell>
                                    </StyledTableRow>

                                    <StyledTableRow
                                      sx={{
                                        border: "1px gray grey",
                                        borderLeft: "1px solid #bdbbbb",
                                        borderTop: "1px solid #bdbbbb",
                                        padding: "2px",
                                        backgroundColor: "#f5f5f5",
                                      }}
                                    >
                                      <TableCell
                                        style={{
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          borderTop: "1px solid #bdbbbb",
                                          padding: "2px",
                                          fontWeight: "bold",
                                          textAlign: "center",
                                        }}
                                      >
                                        Net Payment
                                      </TableCell>
                                      <TableCell
                                        colSpan={2}
                                        style={{
                                          border: "1px gray grey",
                                          borderLeft: "1px solid #bdbbbb",
                                          borderTop: "1px solid #bdbbbb",
                                          fontWeight: "bold",
                                          padding: "2px",
                                        }}
                                        align="center"
                                      >
                                        {netPayment}
                                      </TableCell>
                                    </StyledTableRow>
                                  </TableBody>

                                  {/* )} */}
                                </Table>
                              </TableContainer>
                            </Grid>

                            <Grid xs={12} sm={12} item>
                              <PaymentComponent
                                dispatchFee={totalDispatch}
                                rate={totalRate}
                                netPayment={netPayment}
                                isData={isData}
                                serviceId= {isServiceId}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </Grid>
                    </>
                  )}
                </Grid>
              </>
            )}

            {isOtpVerified && (
              <>
                <Grid container spacing={1}>
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
              </>
            )}

            <OtpPopup
              isVisible={isOtpPopupVisible}
              onClose={() => setOtpPopupVisible(false)}
              onOtpVerified={(isVerified) => setOtpVerified(isVerified)}
              isId={isId}
              isData={isData}
            />
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default CertificateAdd;
