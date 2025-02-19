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
import { useNavigate } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import { Margin } from "@mui/icons-material";
import nopdf from '../../../assets/images/nopdf.png'
import moment from 'moment';
import api from "../../../utils/Url";
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import Languages from "../../../Languages";


// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "180vh",
//   height: "85vh",
//   bgcolor: "#f5f5f5",
//   border: "1px solid #000",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 10,
// };





type Props = {};

const SplitPDF = (props: Props) => {

  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const { defaultValuestime } = getISTDate();
  const [lang, setLang] = useState<Language>("en");


  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [toaster, setToaster] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
 
  const [DocOption, setDocOption] = useState([{ value: "-1", label: t("text.SelectDoc") }]);


  function formatDate(dateString: any) {
    if (!dateString) return ""; // Return empty string if date is not provided
    return moment(dateString).format('DD-MM-YYYY');
  }


  useEffect(() => {
    const dataString = localStorage.getItem("userdata");

    getDoc();
  }, []);




  const getDocMng = () => {
    const collectData = {
      fromDate: formik.values.fDate.toString() || "",
      toDate: formik.values.perUt.toString() || "",
      filestatus: "",
      textSearch: formik.values.textSearch.toString() || "",
      docMid: formik.values.docMid.toString() || "",
      fileTypId: "",
      divisionid: "",
      user_Id: -1,


    };
    api
      .post(`ReferenceDiary/GetDocMangrForIndex`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            id: res.data.data[index]["docMid"],
            fileNo: res.data.data[index]["fileNo"],
            docMid: res.data.data[index]["docMid"],
            fileDef: res.data.data[index]["fileDef"],
            synopsis: res.data.data[index]["synopsis"],
            fileType: res.data.data[index]["fileType"],
            subject: res.data.data[index]["subject"],
            fDate: res.data.data[index]["fDate"],
            perUt: res.data.data[index]["perUt"],
            ismain: res.data.data[index]["ismain"],
            pdfName: res.data.data[index]["pdfName"],
            docFile: res.data.data[index]["docFile"],
            // pdFid: res.data.data[index]["pdFid"],
            complt: res.data.data[index]["complt"],
            partNo: res.data.data[index]["partNo"],
            comments: res.data.data[index]["comments"],
            pgNF: res.data.data[index]["pgNF"],
            pgNu: res.data.data[index]["pgNu"],
            phySNo: res.data.data[index]["phySNo"],
            phyIndex: res.data.data[index]["phyIndex"],
            relOfficer: res.data.data[index]["relOfficer"],
            subSubject: res.data.data[index]["subSubject"],
            insname: res.data.data[index]["insname"],
            userid: res.data.data[index]["userid"],
            keywords: res.data.data[index]["keywords"],
            doc_name: res.data.data[index]["doc_name"],
            perFr: res.data.data[index]["perFr"],
            cDate: res.data.data[index]["cDate"],
            entryDate: res.data.data[index]["entryDate"],
            filename: res.data.data[index]["filename"],
            pagecount: res.data.data[index]["pagecount"],
            divisionid: res.data.data[index]["divisionid"],

            isSelected: false,
          });
        }
        setTableData(arr);
      });
  };





  const AddSplitPdf = () => {
    var array1 = [];

    for (let index = 0; index < tableData.length; index++) {
      const rowData = tableData[index];
      var array2 = [];
      console.log(rowData);
      console.log(rowData.divisionid);
      console.log(rowData.fileNo);
      if (rowData.isSelected == true) {
        array2.push({ "chkSplit": true, "pdfName": rowData.pdfName, "pdFid": rowData.pdFid })
        array1.push({ "docMid": rowData.docMid, "divisionid": rowData.divisionid, docMangrSplits: array2 })
      }

    }
    const collectData = {
      docMangrReqForSplit: array1

    };

    api.post(`SplitPdf/AddUpdateSplitPdf`, collectData)
      .then(response => {


        if (response.data.status == 1) {

          console.log("Split PDF API response:", response);
          toast.success("Split PDF API successfully called");
          setTableData([]);
        } else {


          toast.error("Error calling Split PDF API");
        }

      })
      .catch(error => {
        console.error("Error in Split PDF API:", error);
        toast.error("Error calling Split PDF API");


      });
  }


 


  const getDoc = () => {
    const collectData = {
      "rid": -1,
      "rlId": -1,
      "rFileType": -1,
      "inst_id": -1,
      "user_id": "",
      "fromdate":"2020-06-01T08:43:55.854Z",
      "todate": defaultValuestime,
      "refNo": -1,
      "divisionid": -1,
      "type": 1

    };
    api
      .post(`ReferenceDiary/GetReferenceDiary`, collectData)
      .then((res) => {
        const arr = res.data.data.map((item: any) => ({
          label: item.rFileNumber,
          value: item.rid
        }));
        setDocOption(arr);
      })

  };



 







  // const handleInputChange = (id: number, columnName: string, value: any) => {
  //   setTableData((prevTableData: any) =>
  //     prevTableData.map((row: any) =>
  //       row.id === id ? { ...row, [columnName]: value.label || value } : row
  //     )
  //   );
  // };


  const handleInputChange = (id: number, columnName: string, checked: boolean) => {
    setTableData((prevTableData: any) =>
      prevTableData.map((row: any) =>
        row.id === id ? { ...row, [columnName]: checked } : row
      )
    );
  };


  const formik = useFormik({
    initialValues: {
      docMid: "",
      fileNo: "",
      fileDef: "",
      synopsis: "",
      fDate: "",
      complt: "",
      fileType: "",
      subj: "",
      partNo: "",
      pFileNo: "",
      userId: "",
      perFr: "",
      perUt: "",
      authPersn: "",
      subsubjId: 0,
      sub_Subject_Name: "",
      divisionid: 0,
      division_name: "",
      textSearch: "",
      filestatus: "",
      fileTypId: "",
      createdate: "",
      user_Id: 1,
    },

    onSubmit: async (values) => {

      console.log("Before submission formik values", values)

      // Handle form submission

    },
  });















  const handleCheckboxChange = (row: any) => {
    setSelectedRow(row);
    if (selectedRows.includes(row.id)) {
      setSelectedRows(selectedRows.filter((id: any) => id !== row.id));
    } else {

      setSelectedRows([...selectedRows, row.id]);
    }
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };











  const back = useNavigate();

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #2B4593",
          marginTop: "3vh"
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
                {t("text.SplitPdfToJump")}
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
            <ToastApp />
            <Grid item xs={12} container spacing={2}>

              {/* <Grid item md={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DocFileOption}
                  value={
                    DocFileOption.find(
                      (option) => (option.value) === formik.values.fileTypId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    if (newValue) {
                      formik.setFieldValue("fileTypId", newValue?.value);
                      formik.setFieldValue("fileNo", newValue?.label);
                      formik.setFieldTouched("fileTypId", true);
                      formik.setFieldTouched("fileTypId", false);
                    } else {
                      formik.setFieldValue("fileTypId", -1);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={
                      <span>
                        {t("text.SelectDocType")} {""}
                        
                      </span>
                    } />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StatusOption}
                  value={
                    StatusOption.find(
                      (option: any) => (option.value+"") === formik.values.filestatus
                    ) || null
                  }

                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("filestatus", newValue?.value);

                    formik.setFieldTouched("filestatus", true);
                    formik.setFieldTouched("filestatus", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={
                      <span>
                        Select Status {""}

                      </span>
                    } />
                  )}
                />

                {formik.touched.filestatus && formik.errors.filestatus ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.filestatus}
                  </div>
                ) : null}
              </Grid> */}

              <Grid item lg={3} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DocOption}
                  // value={
                  //   StatusOption.find(
                  //     (option: any) => (option.value+"") === formik.values.filestatus
                  //   ) || null
                  // }

                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("docMid", newValue?.value);

                    formik.setFieldTouched("docMid", true);
                    formik.setFieldTouched("docMid", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={<CustomLabel text={t("text.SelectDoc")} />} />
                  )}
                />

                {formik.touched.docMid && formik.errors.docMid ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.docMid}
                  </div>
                ) : null}
              </Grid>



              <Grid item md={3} xs={12}>
              <TranslateTextField
                          label={t("text.Search")}
                          value={formik.values.textSearch}
                          onChangeText={(text: string) =>
                            handleConversionChange("textSearch", text)
                          }
                          required={true}
                          lang={lang}
                        />
              </Grid>


              <Grid item md={2} xs={12}>
                <TextField
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  id="fDate"
                  name="fDate"
                  label={<CustomLabel text={t("text.FromDate")} />}
                  value={formik.values.fDate}
                  placeholder={t("text.FromDate")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>


              <Grid item md={2} xs={12}>
                <TextField
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  id="perUt"
                  name="perUt"
                  label={<CustomLabel text={t("text.DateTo")} />}
                  value={formik.values.perUt}
                  placeholder={t("text.DateTo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>



              <Grid item md={2} xs={6} >
                <Button
                  onClick={getDocMng}
                  fullWidth
                  style={{
                    backgroundColor: "#059669",
                    color: "white",

                  }}

                >
                  {t("text.Search")}
                </Button>
              </Grid>
              <Grid item xs={12} spacing={2} >

                <Table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    border: "1px solid black",

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
                        {t("text.Action")}
                      </th>

                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.FileNo")}
                      </th>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.FileDef")}
                      </th>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.InstituteName")}
                      </th>
                     
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.Subject")}
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
                        {t("text.DateFrom")}
                      </th>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.DateTo")}
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ border: "1px solid black" }}>
                    {tableData.map((row: any, index: any) => (
                      <tr
                        key={row.id}
                        style={{ border: "1px solid black" }}
                      >
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >


                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}

                            checked={
                              row.isSelected
                                ? true
                                : false
                            }
                            defaultChecked={false}
                            onChange={(e) =>
                              handleInputChange(
                                row.id,
                                "isSelected",
                                e.target.checked
                              )
                            }


                          // onChange={() => handleCheckboxChange(row)}
                          // onChange={(e) =>
                          //   handleSelectAll("isAdd", e.target.checked)
                          // }
                          />
                        </td>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >

                          {row.fileNo}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.fileDef}
                        </td>


                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.insname}
                        </td>

                       

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.subject}
                        </td>


                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {formatDate(row.fDate)}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {formatDate(row.cDate)}

                        </td>


                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Grid>




            </Grid>

            <Grid
              item
              xs={12}
              spacing={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Grid xs={6} style={{ margin: "6px" }}>
                <Button
                  type="submit"
                  onClick={AddSplitPdf}
                  fullWidth
                  style={{
                    backgroundColor: "#059669",
                    color: "white",
                    marginTop: "10px",

                  }}
                >
                  {t("text.SplitPage")}
                </Button>
              </Grid>
            </Grid>

          </form>

        </CardContent>
      </div>
    </div>
  );
};

export default SplitPDF;