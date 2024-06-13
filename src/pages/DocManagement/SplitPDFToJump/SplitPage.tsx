import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Modal,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import { Margin } from "@mui/icons-material";
import nopdf from "../../../assets/images/nopdf.png";
import api from "../../../utils/Url";

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

const SplitPage = (props: Props) => {
  const location = useLocation();

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
      formik.setFieldValue("fileName", file.name);
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];
      if (fileExtension.toLowerCase() === "pdf") {
        const base64 = await ConvertBase64(file);
        formik.setFieldValue(params, base64);
        console.log(base64);
      } else {
        alert("Only PDF files are allowed to be uploaded.");
        event.target.value = null;
      }
    }
  };

  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [toaster, setToaster] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [DocFileOption, setDocFileOption] = useState([
    { value: "-1", label: t("text.SelectFileType") },
  ]);
  useEffect(() => {
    console.log("check");
    // const dataString = localStorage.getItem("userdata");
    console.log("location", location);
    console.log("location new", location.state);
    getDocMng();

  }, []);

  const getDocMng = () => {
    const collectData = {
      dPgid: -1,
      pdFid:
        location.state &&
          location.state.pdFid !== undefined &&
          location.state.pdFid !== null
          ? location.state.pdFid
          : -1,
      chiPDFid: -1,
      user_Id: -1,
      userId: -1,
    };
    api
      .post(`DocFPages/GetDocFPages`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            id: res.data.data[index]["dPgid"],
            pgNF: res.data.data[index]["pgNF"],
            pgNU: res.data.data[index]["pgNU"],
            phyIndex: res.data.data[index]["phyIndex"],
            comments: res.data.data[index]["comments"],
            phySNo: res.data.data[index]["phySNo"],
            relOfficer: res.data.data[index]["relOfficer"],
            pdFid: res.data.data[index]["pdFid"],
            fileName: res.data.data[index]["fileName"],
            pdfPath: res.data.data[index]["pdfPath"],
            isSelected: false,
          });
        }
        setTableData(arr);
      });
  };

  //   const getFileType = () => {
  //     const collectData = {
  //       docID: -1,
  //     };
  //     axios
  //       .post(HOST_URL.HOST_URL2 + `OtherDocType/GetOtherDocType`, collectData)
  //       .then((res) => {
  //         const arr = res?.data?.data?.map((item: any) => ({
  //           label: item?.doc_Name,
  //           value: item?.docID,
  //         }));
  //         setDocFileOption(arr);
  //       });
  //   };

  const handleInputChange = (id: number, columnName: string, value: any) => {
    setTableData((prevTableData: any) =>
      prevTableData.map((row: any) =>
        row.id === id ? { ...row, [columnName]: value.label || value } : row
      )
    );
  };
  const formik = useFormik({
    initialValues: {
      divisionid: "",
      txtFPath: "",
      docMid: "",
      fileName: "",
      fileNO: "-1",
      othercomment: "",
      flid: 0,
      user_Id: 0,
      docBase64: "",
      txtmain: "",
      pdfPath: "",
      pdfto: ""
    },

    onSubmit: async (values) => {
      values.docMid = "";
      console.log("Before submission formik values", values);

      try {
        const response = await api.post(`DocMangr/AddPDFMergeflpupload`,
          values
        );
        if (response.data.isSuccess) {
          console.error("response.data.data:", response.data.data);
          formik.setFieldValue("txtFPath", String(response.data.data))

          toast.success(response.data.mesg);
          //navigate('/DocManagement/DocMng');
        } else {
          toast.error(response.data.mesg);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  const back = useNavigate();

  const [pdfid, setPdfid] = useState<any>("");
  const [pdfPath, setPDFPath] = useState("");

  const getFilePath = (id: any) => {
    const collectData = {
      pdFid: id,
      user_id: 0,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`DocFiles/GetDocFiles`, collectData)
      .then((response) => {
        console.log("check", response.data.data[0]["pdfPath"]);
        formik.setFieldValue("txtmain", response.data.data[0]["pdfPath"]);
        formik.setFieldValue("divisionid", String(response.data.data[0]["divisionid"]))
      });
  };
  const dataUpdate = (row: any) => {
    console.log("check row", row);
    setPdfid(row.id);
    formik.setFieldValue("flid", row.id);
    formik.setFieldValue("pdfPath", row.pdfPath);
    formik.setFieldValue("pdfto", row.pgNU);

    getFilePath(row.pdFid);
  };

  const PDFMerge = () => {
    const collectData = {
      flid: formik.values.flid,
      mergepdf: formik.values.pdfPath,
      txtPdfPath: formik.values.txtFPath,
      mfl: formik.values.txtmain,
      txtOutPutPath: formik.values.pdfPath,
      txtPdfNm: formik.values.fileName,
      othercomment: formik.values.othercomment,
      // chiPDFid: -1,
      // user_Id: -1,
      // userId: -1,
    };
    api
      .post( `DocMangr/AddPDFMerge`, collectData)
      .then((res) => {
        const arr: any = [];
        if (res.data.isSuccess == true) {
          toast.success(res.data.mesg)
        } else {
          toast.error(res.data.mesg)
        }
      });
  };
  const MainSplitMerge = () => {
    const collectData = {
      txtmain: formik.values.txtmain,
      filnm: formik.values.fileName,
      pdfto: formik.values.pdfto + "",
      locationid: formik.values.txtFPath,
      txtPdfPath: formik.values.txtFPath
    };
    api
      .post(`DocMangr/MianSplitFileMerge`, collectData)
      .then((res) => {
        console.log(res.data.isSuccess);
        console.log("successMsg", res.data.mesg)

        if (res.data.isSuccess == true) {
          setToaster(true)
          
          toast.success(res.data.mesg)

          setTimeout(() => {
            navigate('/DocManagement/DocumentIndexing');
        }, 1000);
        
        } else {
          setToaster(true)
          toast.error(res.data.mesg)
        }
      });
  };
  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          // border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
           {t("text.SplitPage")}
          </Typography>

          <Grid item sm={4} xs={12}>
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
            <ToastApp />
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} spacing={2}>
                <Table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    border: "1px solid black"
                  }}
                >
                  <thead
                    style={{
                      backgroundColor: "#2196f3",
                      color: "#f5f5f5",
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingBlock: "10",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.SrNo")}
                      </th>

                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.PageFrom")}
                      </th>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.PageTo")}
                      </th>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.PhysicalIndex")}
                      </th>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.Comments")}
                      </th>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.ViewFile")}
                      </th>
                      {/* <th
                              style={{
                                borderLeft: "1px solid black",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }}
                            >
                              {"Search Keywords"}
                            </th> */}
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                         {t("text.AddPdf")}
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ border: "1px solid black" }}>
                    {tableData.map((row: any, index: any) => (
                      <tr key={row.id} style={{ border: "1px solid black" }}>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.pgNF}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.pgNU}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.phyIndex}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.comments}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.fileName}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <Button
                          variant="contained"
                          size="small"
                            onClick={() => dataUpdate(row)}
                            style={{ cursor: "pointer", backgroundColor:"#2196F3", margin:"3px" }}
                          >
                             {t("text.add")}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Grid>
            </Grid>
            <br />
            <Divider />

            <br />

            <Grid item xs={12} container spacing={2}>
              <Grid item md={4} xs={12}>
                <TextField
                  type="file"
                  inputProps={{ accept: "application/pdf" }}
                  InputLabelProps={{ shrink: true }}
                  label={
                    <strong style={{ color: "#000" }}>
                      {t("text.DocUpload")}
                    </strong>
                  }
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => otherDocChangeHandler(e, "docBase64")}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  type="text"
                  // InputLabelProps={{ shrink: true }}
                  id="othercomment"
                  name="othercomment"
                  label= {t("text.EnterRemark")}
                  value={formik.values.othercomment}
                  placeholder= {t("text.EnterRemark")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  type="text"
                  // InputLabelProps={{ shrink: true }}
                  label={t("text.EnterValue")}
                  value={pdfid}
                  placeholder={t("text.EnterValue")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item md={2} xs={6}>
                <Button
                  onClick={() => formik.handleSubmit}
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: "#3D39B5",
                    color: "white",
                  }}
                >
                  {t("text.FileSaved")}
                </Button>
              </Grid>
            </Grid>

            <br />
            <Divider />

            <br />
            <Grid item xs={12} container spacing={2}>
              <Grid item md={3} xs={12}>
                <TextField
                  type="text"
                  // InputLabelProps={{ shrink: true }}
                  id="txtmain"
                  name="txtmain"
                  label={t("text.EnterMainPdf")}
                  value={formik.values.txtmain}
                  placeholder={t("text.EnterMainPdf")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  id="txtFPath"
                  name="txtFPath"
                  label={t("text.EnterPdf")}
                  value={formik.values.txtFPath}
                  placeholder={t("text.EnterPdf")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item md={2} xs={6}>
                <Button
                  onClick={PDFMerge}
                  fullWidth
                  style={{
                    backgroundColor: "#3D39B5",
                    color: "white",
                  }}
                >
                  {t("text.PdfMearge")}
                </Button>
              </Grid>
              <Grid item md={2} xs={6}>
                <Button
                  onClick={MainSplitMerge}
                  fullWidth
                  style={{
                    backgroundColor: "#A26509",
                    color: "white",
                  }}
                >
                 {t("text.SplitMainFile")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default SplitPage;
