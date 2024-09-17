import {
    Box,
    Button,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    ListItemText,
    Modal,
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
import { getISTDate } from "../../../utils/Constant";
import nopdf from "../../../assets/images/imagepreview.jpg";


type Props = {};

const StudentMasterAdd = (props: Props) => {
    const back = useNavigate();
    const { t } = useTranslation();

    const [fileTypeOption, setFileTypeOption] = useState([
        { value: "-1", label: t("text.SelectFileType") },
    ]);

    const [toaster, setToaster] = useState(false);
    const [lang, setLang] = useState<Language>("en");
    const navigate = useNavigate();
    const { defaultValuestime } = getISTDate();
    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const [Opens, setOpen] = React.useState(false);
    const [Img, setImg] = useState("");
  
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
    }, []);

    const getFileTypeData = async () => {
        const res = await api.post(`FileType/GetFileType`, {
            fId: -1,
            inst_id: -1,
            user_id: -1,
            divisionid: -1,
        });
        console.log("check file type", res?.data?.data);
        const arr = [];
        for (let index = 0; index < res.data.data.length; index++) {
            arr.push({
                value: res.data.data[index]["fId"],
                label: res.data.data[index]["fName"],
            });
            setFileTypeOption(arr);
        }
    };

    const formik = useFormik({
        initialValues: {
            StudentId: -1,
            StudentName: "",
            DOB: defaultValuestime,
            Email: "",
            MobileNo: "",
            CourseName: "",
            CourseCompletionDate: defaultValuestime,
            Address: "",
            ServiceId: 0,
            Attachments: "",
            Remarks: ""
        },

        onSubmit: async (values) => {
            const response = await api.post(
                `StudentMaster/AddUpdateStudentMaster`,
                values
            );
            if (response.data.isSuccess) {
                toast.success(response.data.mesg);
                setToaster(true);
                navigate("/master/StudentMaster");
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

    const otherDocChangeHandler = async (event: any, params: any) => {

        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          const fileNameParts = file.name.split(".");
          const fileExtension = fileNameParts[fileNameParts.length - 1];
          if (!fileExtension.toLowerCase().match(/(jpg|jpeg)$/)) {
            alert("Only image files (jpg, jpeg) are allowed to be uploaded.");
            event.target.value = null;
            return;
          }
    
          const base64 = await ConvertBase64(file);
          formik.setFieldValue(params, base64);
          console.log(base64);
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

      const modalOpenHandle = (event: any) => {
        setPanOpen(true);
        if (event === "Attachments") {
          setModalImg(formik.values.Attachments);
        }
      };
      const handlePanClose = () => {
        setPanOpen(false);
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
                            {/* <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={fileTypeOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("fId", newValue?.value);
                                        formik.setFieldTouched("fId", true);
                                        formik.setFieldTouched("fId", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectFileType")}
                                                    required={requiredFields.includes("fId")}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.fId && formik.errors.fId ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.fId}
                                    </div>
                                ) : null}
                            </Grid> */}

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    id="StudentName"
                                    name="StudentName"
                                    label={<CustomLabel text={t("text.StudentName")} />}
                                    value={formik.values.StudentName}
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
                                    label={<CustomLabel text={t('text.DOB')} required={false} />}
                                    value={formik.values.DOB}
                                    name="DOB"
                                    id="DOB"
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
                                    label={<CustomLabel text={t('text.Email')} required={false} />}
                                    value={formik.values.Email}
                                    name="Email"
                                    id="Email"
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
                                    id="MobileNo"
                                    name="MobileNo"
                                    label={<CustomLabel text={t("text.MobileNo")} />}
                                    value={formik.values.MobileNo}
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
                                    id="CourseName"
                                    name="CourseName"
                                    label={<CustomLabel text={t("text.CourseName")} />}
                                    value={formik.values.CourseName}
                                    placeholder={t("text.CourseName")}
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
                                    label={<CustomLabel text={t('text.CourseCompletionDate')} required={false} />}
                                    value={formik.values.CourseCompletionDate}
                                    name="CourseCompletionDate"
                                    id="CourseCompletionDate"
                                    placeholder={t("text.CourseCompletionDate")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    id="Address"
                                    name="Address"
                                    label={<CustomLabel text={t("text.Address")} />}
                                    value={formik.values.Address}
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
                                    id="Remarks"
                                    name="Remarks"
                                    label={<CustomLabel text={t("text.Remarks")} />}
                                    value={formik.values.Remarks}
                                    placeholder={t("text.Remarks")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

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
                                        label={<CustomLabel text={t("text.AttachedImage")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "Attachments")}
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
                                        {formik.values.Attachments == "" ? (
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
                                                src={formik.values.Attachments}
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
                                            onClick={() => modalOpenHandle("Attachments")}
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

export default StudentMasterAdd;
