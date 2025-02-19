import {
  Box,
  Button,
  CardContent,
  Grid,
  Modal,
  Table,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import CustomLabel from "../../../CustomLable";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import { getISTDate } from "../../../utils/Constant";
import nopdf from "../../../assets/images/imagepreview.jpg";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

type Props = {};

const StudentMasterEdit = (props: Props) => {
  const back = useNavigate();
  const { t } = useTranslation();

  const [fileTypeOption, setFileTypeOption] = useState([
    { value: "-1", label: t("text.SelectCourse") },
  ]);

  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const navigate = useNavigate();
  const { defaultValuestime } = getISTDate();
  const [tableData, setTableData] = useState<any>([]);
  console.log("🚀 ~ StudentMasterEdit ~ tableData:", tableData)

  const [pdf, setPDF] = useState("");
  const [fileName, setfileName] = useState("");
  const [Shows, setShows] = React.useState(false);
  const [selectedPdf, setSelectedPdf] = useState<any>(null);
  const [courseType, setCourseType] = useState("");
  const location = useLocation();

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

  useEffect(() => {
    getFileTypeData();
    if(location.state && location.state.id){
      GetStudentDetailsById(location.state.id);
    }
  }, []);

  const getFileTypeData = async () => {
    const res = await api.post(`CourseMaster/GetCourseMaster`, {
      courseId: -1,
    });
    console.log("check file type", res?.data?.data);
    const arr = [];
    for (let index = 0; index < res.data.data.length; index++) {
      arr.push({
        value: res.data.data[index]["courseId"],
        label: res.data.data[index]["courseName"],
      });
      setFileTypeOption(arr);
    }
  };
  
  const GetStudentDetailsById = async (id:any) => {
    const res = await api.post(`Student/GetStudentDetails`, {
      studentId: id,
    });
    console.log("check file type", res?.data?.data[0]["studentDoc"]);
    if(res.data && res.data.isSuccess){
      let result = res?.data?.data[0]["studentDoc"];
    
      if(result?.length >0){
        const arr = [];
      for (let index = 0; index < result.length; index++) {
        arr.push({
          id:index+1,
        docId: result[index]['docId'],
        studentId: result[index]['studentId'],
        courseId:result[index]['courseId'],
        docName:result[index]['docName'],
        docImage:result[index]['docImage'],
        createdBy: result[index]['createdBy'],
        updatedBy: result[index]['updatedBy'],
        createdOn: (result[index]['createdOn']),
        updatedOn: (result[index]['updatedOn']),
        courseName:result[index]['courseName'],
        });
        console.log('arr',arr)
        setTableData(arr);
      }}
    }
  };

  const formik = useFormik({
    initialValues: {
      studentId: location.state.studentId,
      studentName: location.state.studentName,
      dob: location.state.dob,
      email: location.state.email,
      mobileNo: location.state.mobileNo,
      address: location.state.address,
      courseId: location.state.courseId,
      rollNo: location.state.rollNo,
      aadharNo: location.state.aadharNo,
      remarks: location.state.remarks,
      createdBy: location.state.createdBy,
      updatedBy: location.state.updatedBy,
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
      attachments: location.state.attachments,
      courseName: location.state.courseName,
      studentDoc: [],
    },

    onSubmit: async (values) => {
      if(tableData.length>0){
        values.studentDoc = tableData;
      }
      if(values.studentDoc.length === 0){
       alert("Please attach file for proceed further");
        return;
     }
          //console.log("Before submitting values", values)
      const response = await api.post(
        `Student/AddUpdateStudentDetails`,
        values
      );
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        setToaster(true);
        navigate("/master/StudentDetails");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const handlePanClose1 = () => {
    setShows(false);
    setSelectedPdf(null);
  };

  const modalOpenHandle1 = (pdfView2: any) => {
    setShows(true);
    setSelectedPdf(pdfView2);
  };

  const convertBase64 = (file: Blob) => {
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

  const onTransctionChange = async (event: any) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      var file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setfileName(file.name);
      setPDF(URL.createObjectURL(event.target.files[0]));
      const base64 = await convertBase64(file);
      setPDF(base64 + "");
    }
  };

  const addMoreRow = () => {
    const newRows = {
      id:tableData.length+1,
      docId: -1,
      studentId: -1,
      courseId:formik.values.courseId,
      docName:fileName,
      docImage:pdf,
      createdBy: "",
      updatedBy: "",
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
      courseName:formik.values.courseName,

    };

    setTableData((prevTableData: any) => {
      const updatedTableDataed = [...prevTableData, newRows];
      console.log("🚀 ~ setTableData ~ updatedTableDataed:", updatedTableDataed)
      //formik.setFieldValue("studentDoc", updatedTableDataed);
      return updatedTableDataed;
    });

    setfileName("");
    setPDF("");
  };

  const removeExtraRow = (id: any) => {
    console.log("🚀 ~ removeExtraRow ~ id:", id)
    setTableData((prevTableData: any) => {
      const updatedTableDataed = prevTableData.filter(
        (row: any) => row.docId !== id.docId
      );
      console.log("🚀 ~ setTableData ~ updatedTableDataed:", updatedTableDataed)
      return updatedTableDataed;
    });

  };
  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          border: ".5px solid #2B4593",
          marginTop: "5px",
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
                {t("text.CreateStudentMaster")}
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
            <Grid container spacing={2}>
              {/* <ToastContainer /> */}
              {toaster === false ? "" : <ToastApp />}

              <Grid item lg={4} md={4} xs={12}>
                <TextField
                  id="studentName"
                  name="studentName"
                  label={<CustomLabel text={t("text.StudentName")} />}
                  value={formik.values.studentName}
                  placeholder={t("text.StudentName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid lg={4} md={4} xs={12} item>
                <TextField
                  type="date"
                  label={<CustomLabel text={t("text.DOB")} required={false} />}
                  value={formik.values.dob}
                  name="dob"
                  id="dob"
                  placeholder={t("text.DOB")}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid lg={4} md={4} xs={12} item>
                <TextField
                  //type="date"
                  label={
                    <CustomLabel text={t("text.Email")} required={false} />
                  }
                  value={formik.values.email}
                  name="email"
                  id="email"
                  placeholder={t("text.Email")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} md={4} xs={12}>
                <TextField
                  id="mobileNo"
                  name="mobileNo"
                  label={<CustomLabel text={t("text.MobileNo")} />}
                  value={formik.values.mobileNo}
                  placeholder={t("text.MobileNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} md={4} xs={12}>
                <TextField
                  id="rollNo"
                  name="rollNo"
                  label={<CustomLabel text={t("text.RollNo")} />}
                  value={formik.values.rollNo}
                  placeholder={t("text.RollNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid lg={4} md={4} xs={12} item>
                <TextField
                  label={
                    <CustomLabel text={t("text.AadharNo")} required={false} />
                  }
                  value={formik.values.aadharNo}
                  name="aadharNo"
                  id="aadharNo"
                  placeholder={t("text.AadharNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} md={4} xs={12}>
                <TextField
                  id="address"
                  name="address"
                  label={<CustomLabel text={t("text.Address")} />}
                  value={formik.values.address}
                  placeholder={t("text.Address")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} md={4} xs={12}>
                <TextField
                  id="remarks"
                  name="remarks"
                  label={<CustomLabel text={t("text.Remarks")} />}
                  value={formik.values.remarks}
                  placeholder={t("text.Remarks")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} container spacing={2}>
                <Grid xs={12} lg={4} item>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={fileTypeOption}
                    fullWidth
                    size="small"
                    onChange={(event, newValue: any) => {
                      console.log(newValue?.value);
                      formik.setFieldValue("courseId", newValue?.value);
                      formik.setFieldValue("courseName", newValue?.label);
                      setCourseType(newValue?.label);
                      formik.setFieldTouched("courseId", true);
                      formik.setFieldTouched("courseId", false);
                    }}
                    value={
                      fileTypeOption.find(
                        (opt) => opt.value === formik.values.courseId
                      ) || null
                    }

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <CustomLabel
                            text={t("text.SelectCourse")}
                            required={false}
                          />
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid xs={12} lg={4} item>
                  <TextField
                    id="pdf"
                    name="pdf"
                    label={
                      <CustomLabel
                        text={t("text.Attachments")}
                        required={false}
                      />
                    }
                    // value={pdf}
                    placeholder={t("text.Attachments")}
                    size="small"
                    type="file"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    InputLabelProps={{ shrink: true }}
                    onChange={onTransctionChange}
                    // onChange={(e) => onTransctionChange(e, "docImage")}
                  />
                </Grid>

                <Grid xs={12} lg={2} item>
                  <Button
                    startIcon={<AddCircleIcon />}
                    variant="contained"
                    fullWidth
                    style={{
                      marginBottom: 15,
                      backgroundColor: "info",
                    }}
                    onClick={addMoreRow}
                  >
                    {t("text.add")}
                  </Button>
                </Grid>
              </Grid>

              <Grid xs={12} sm={12} item sx={{ marginTop: "3px" }}>
                <Table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    border: "1px solid black",
                  }}
                >
                  <thead
                    style={{ backgroundColor: "#2196f3", color: "#f5f5f5" }}
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
                        {t("text.FileName")}
                      </th>

                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.CourseName")}
                      </th>

                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.Files")}
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ border: "1px solid black" }}>
                    {tableData?.map((row: any, index: any) => (
                      <tr key={row.id} style={{ border: "1px solid black" }}>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            width: "10vw",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          <DeleteIcon
                            style={{
                              fontSize: "20px",
                              color: "darkred",
                              cursor: "pointer",
                            }}
                            onClick={() => removeExtraRow(row)}
                          />{" "}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            // textAlign: "center",
                            width: "30vw",
                            paddingRight: "5px",
                            paddingLeft: "5px",
                          }}
                        >
                          {row.docName}
                        </td>

                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            // textAlign: "center",
                            width: "30vw",
                            paddingRight: "5px",
                            paddingLeft: "5px",
                          }}
                        >
                          {row.courseName}
                        </td>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                            width: "30vw",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                            padding: "2px",
                          }}
                        >
                          {row.docImage == "" ? (
                            ""
                          ) : (
                            <embed
                              src={row.docImage}
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
                            onClick={() => modalOpenHandle1(row.pdfView2)}
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

                          <Modal open={Shows} onClose={handlePanClose1}>
                            <Box sx={style}>
                              {selectedPdf === "" ? (
                                <img
                                  src={nopdf}
                                  style={{
                                    width: "170vh",
                                    height: "75vh",
                                  }}
                                />
                              ) : (
                                <embed
                                  //alt="preview image"
                                  src={row.docImage}
                                  style={{
                                    width: "170vh",
                                    height: "75vh",
                                    borderRadius: 10,
                                  }}
                                />
                              )}
                            </Box>
                          </Modal>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Grid>

              {/* ---------------Save and Reset Button start----------------- */}
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
              {/* ---------------Save and Reset Button end----------------- */}
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default StudentMasterEdit;
