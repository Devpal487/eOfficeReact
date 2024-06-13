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
  RadioGroup,
  FormControlLabel,
  Radio,
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

const UpdatePDF = (props: Props) => {
  const [panOpens, setPanOpen] = React.useState(false);
  const [tableData, setTableData] = useState<any>([]);


  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [toaster, setToaster] = useState(false);

  const [DocTypeOption, setDocTypeOption] = useState([{ value: "-1", label: t("text.SelectDocType") }]);



  useEffect(() => {
    //const dataString = localStorage.getItem("userdata");

    getDocType();
  }, []);



  const getDocType = () => {
    const collectData = {
      docID: -1,
      parentDocId: -1,
      userId: "",
    };
    api
      .post(`OtherDocType/GetOtherDocType`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["doc_Name"],
            value: res.data.data[index]["docID"],
          });
        }
        setDocTypeOption(arr);
      });
  };

  const GetDocMangr = () => {
    const collectData = {
      docMid: -1,
      fileTypId: formik.values.docID,
      divisionid: -1,
      subsubjId: -1,
      user_Id: -1,
      fileNo: "",
    };
    api
      .post( `DocMangr/GetDocMangr`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            id: res.data.data[index]["docMid"],
            fileNo: res.data.data[index]["fileNo"],
            docMid: res.data.data[index]["docMid"],
            fileDef: res.data.data[index]["fileDef"],
            isSelected: false,
          });
        }

        setTableData(arr);
      });
  };
  const handleInputChange = (id: number, columnName: string, value: any) => {
    setTableData((prevTableData: any) =>
      prevTableData.map((row: any) =>
        row.id === id ? { ...row, [columnName]: value.label || value } : row
      )
    );
  };
  const formik = useFormik({
    initialValues: {
      docID: -1,
      doc_Name: "",
      udatePdfFiles: [
        {
          docID: 0,
          doc_Name: "",
        },
      ],
    },
    onSubmit: async (values) => {
      console.log("Before submission formik tableData", tableData);
      console.log("Before submission formik values", values);

      var array = [];
      console.log(tableData.length);
      for (var i = 0; i < tableData.length; i++) {
        var docMid = tableData[i]["docMid"];
        var fileDef = tableData[i]["fileDef"];
        console.log("docMid", docMid);
        console.log("fileDef", fileDef);
        if (tableData[i]["isSelected"]) {
          array.push({ docID: docMid, doc_Name: fileDef });
        }
      }
      values.udatePdfFiles = array;
      // Handle form submission
      try {
        const response = await api.post(`DocMangr/UpdatePdfFileName`,
          values
        );
        if (response.data.isSuccess) {


          toast.success(response.data.mesg);
          setTableData((prevTableData: any[]) =>
            prevTableData.map((row: any) => ({ ...row, isSelected: false }))
          );
          setTableData([]);

        } else {

          toast.error(response.data.mesg);
        }
      } catch (error) {
        // console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  const back = useNavigate();

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
           {t("text.UpdatePdf")}
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
              <Grid container spacing={2} item>
                <Grid
                  xs={12}
                  md={4}
                  sm={4}
                  item
                // style={{ marginBottom: "30px", marginTop: "30px" }}
                >
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={DocTypeOption}
                    value={
                      DocTypeOption.find(
                        (option) =>
                          parseInt(option.value) === formik.values.docID
                      ) || null
                    }
                    fullWidth
                    size="small"
                    onChange={(event, newValue) => {
                      console.log(newValue?.value);
                      if (newValue) {
                        formik.setFieldValue("docID", newValue?.value);
                        formik.setFieldValue("parentDoc_Name", newValue?.label);
                        formik.setFieldTouched("docID", true);
                        formik.setFieldTouched("docID", false);
                      } else {
                        formik.setFieldValue("docID", -1);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <span>
                            {t("text.SelectDocType")} {""}
                          </span>
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item md={6} lg={6} xs={12}>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      defaultValue="For Rename"
                    >
                      <FormControlLabel
                        value={t("text.ForRename")}
                        control={<Radio />}
                        label={t("text.ForRename")}
                      />
                      <FormControlLabel
                        value={t("text.ForShiftCategory")}
                        control={<Radio />}
                        label={t("text.ForShiftCategory")}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item md={2} xs={2}>
                  <Button
                    onClick={GetDocMangr}
                    fullWidth
                    style={{
                      backgroundColor: "#059669",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.Search")}
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12} spacing={2}>
                <Table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    border: "1px solid black",
                    // marginLeft: "20px",
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
                        {t("text.PdfFileName")}
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
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={row.isSelected ? true : false}
                            defaultChecked={false}
                            onChange={(e) =>
                              handleInputChange(
                                row.id,
                                "isSelected",
                                e.target.checked
                              )
                            }
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
                          <TextField
                            size="small"
                            fullWidth
                            type="text"
                            value={row.fileDef}
                            onChange={(e) =>
                              handleInputChange(
                                row.id,
                                "fileDef",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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

                <Grid xs={6} style={{ margin: "6px" }}>
                  <Button
                    type="reset"
                    fullWidth
                    style={{
                      backgroundColor: "#F43F5E",
                      color: "white",
                      marginTop: "10px",
                    }}
                    onClick={(e) =>{ 
                     
                      formik.resetForm();
                      setTableData([]);
                    }}
                  >
                    {t("text.reset")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default UpdatePDF;
