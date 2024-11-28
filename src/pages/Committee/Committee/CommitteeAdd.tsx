import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Modal,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import { getISTDate, getId } from "../../../utils/Constant";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import axios from "axios";
import api from "../../../utils/Url";
import { toast } from "react-toastify";
import nopdf from '../../../assets/images/imagepreview.jpg';
import CustomLabel from "../../../CustomLable";
import * as Yup from "yup";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import Languages from "../../../Languages";



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

const CommitteeAdd = (props: Props) => {
  const { i18n, t } = useTranslation();

  const { defaultValues, defaultValuestime } = getISTDate();
  const ID = getId();

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [lang, setLang] = useState<Language>("en");

  useEffect(()=>{
    formik.setFieldValue("type", "C")
    getIP();
  },[]);
  const getIP =()=>{
    axios.get('http://ipinfo.io')
    .then((res:any)=>{
    formik.setFieldValue("ipAddress",res.data.ip);
  }
)
  }
  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "committeeLogo") {
      setModalImg(formik.values.committeeLogo);
    }
  };
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
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file.");
        return;
    }
      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);

    }
  };

  let navigate = useNavigate();

  const [toaster, setToaster] = useState(false);

  const validationSchema = Yup.object({
   
    committeeName: Yup.string().test(
      "required",
      t("text.reqcommitteeName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    foundedDate: Yup.string().test(
      "required",
      t("text.reqfoundedDates"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      "id": -1,
      "committeeName": "",
      "foundedDate": "",
      "officeId": -1,
      "userId": ID,
      "ipAddress": "",
      "uploadDate": defaultValuestime,
      "committeeLogo": "",
      "committeeDesc": "",
      "type": ""
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {

      console.log("Before submission formik values", values);

      try {
        const response = await api.post(
          `CommitteeMaster/AddUpdateCommitteeMaster`,

          values
        );
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          navigate("/E-Office/CommitteeMaster");
        } else {
          setToaster(true);
          toast.error(response.data.mesg);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
     }
    }
  });

  const requiredFields = ["committeeName", "foundedDate"];
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
          border: ".5px solid #00009c",
          marginTop: "3vh",
        }}
      >
        <CardContent>
        <Grid item xs={12} container spacing={2} >
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{backgroundColor:`var(--grid-headerBackground)`,color: `var(--grid-headerColor)`}}
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
                {t("text.AddCommittee")}
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
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>


              <Grid sm={4} md={4} xs={12}>
                <FormControl
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    marginTop: "13px",
                    marginLeft: "12px",
                  }}
                >
                  <Grid>
                    <FormLabel>Type</FormLabel>
                  </Grid>
                  <Grid>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      defaultValue="C"
                      onChange={(event) => {
                        console.log("radio value check", event.target.value);
                        formik.setFieldValue("type",event.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="C"
                        control={<Radio />}
                        label="Committee"
                      />
                      <FormControlLabel
                        value="G"
                        control={<Radio />}
                        label="Group"
                      />
                    </RadioGroup>
                  </Grid>
                </FormControl>
              </Grid>

              <Grid item sm={4} md={4} xs={12}>
              <TranslateTextField
                  label={t("text.committeeName")}
                  value={formik.values.committeeName}
                  onChangeText={(text: string) =>
                    handleConversionChange("committeeName", text)
                  }
                  required={true}
                  lang={lang}
                />
                  {formik.touched.committeeName && formik.errors.committeeName ? (
                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.committeeName}</div>
                  ) : null}
              </Grid>

              <Grid item sm={4} md={4} xs={12}>
                <TextField
                  id="foundedDate"
                  name="foundedDate"
                  label={<CustomLabel text={t("text.foundedDate")} required={requiredFields.includes('foundedDate')} />}
                  value={formik.values.foundedDate}
                  placeholder={t("text.foundedDate")}
                  size="small"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.foundedDate && formik.errors.foundedDate ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.foundedDate}
                    </div>
                  ) : null}
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
                    label={<CustomLabel text={t("text.AttachedFile")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "committeeLogo")}
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
                    {formik.values.committeeLogo == "" ? (
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
                        src={formik.values.committeeLogo}
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
                      onClick={() => modalOpenHandle("committeeLogo")}
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
                      <div style={{ width: "100%", height: "100%" }}>
                        <img
                          src={modalImg}
                          width="100%"
                          height="100%"
                          style={{ borderRadius: 10 }}
                        />
                      </div>
                    )}
                  </Box>
                </Modal>
              </Grid>
              <Grid xs={12} sm={12} item>
              <TranslateTextField
                  label={t("text.EnterDescriptionofcommittee")}
                  value={formik.values.committeeDesc}
                  onChangeText={(text: string) =>
                    handleConversionChange("committeeDesc", text)
                  }
                  required={true}
                  lang={lang}
                />
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
                    style={{backgroundColor:`var(--grid-headerBackground)`,color: `var(--grid-headerColor)`,marginTop:'10px'}}
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
                    onClick={(e) => formik.resetForm()}
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

export default CommitteeAdd;