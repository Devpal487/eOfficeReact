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

const PdfCounter = (props: Props) => {
  const { i18n, t } = useTranslation();
  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState("-1");
  // const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [folderPath, setFolderPath] = useState("");
  const [folderContent, setFolderContent] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [optionFileName, setOptionFileName] = useState([
    { value: "-1", label: t("text.SelectFileName"), path: "" },
  ]);

  useEffect(() => {
    getCheckModeData();
  }, []);

  const getCheckModeData = () => {
    const collectData = {
      pdFid: -1,
      user_id: 0,
    };

    api
      .post( "DocFiles/GetDocFiles", collectData)
      .then((res) => {
        const arr = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            path: res.data.data[index]["pdfPath"],
            label: res.data.data[index]["pdfName"],
            value: res.data.data[index]["pdFid"],
          });
        }
        setOptionFileName(arr);
      });
  };


  const handleFolderPathChange = (event: any) => {
    setFolderPath(event.target.value);
  };

  const getFolderContent = async () => {
    try {
      const response = await axios.post("/getFolderContent", { folderPath });
      setFolderContent(response.data.files);
    } catch (error) {
      console.error("Error fetching folder content:", error);
    }
  };

  const handleCountClick = async () => {
    try {
      const response = await api.post("/count", { folderPath });
      alert(`Total count of files in folder: ${response.data.count}`);
    } catch (error) {
      console.error("Error counting files:", error);
    }
  };

  const handleViewClick = () => {
    // Open modal to display folder content
    setViewModalOpen(true);
  };

  const handleUpdateClick = async () => {
    try {
      await api.post("/updateDocManager", { folderPath });
      alert("Doc Manager updated successfully");
    } catch (error) {
      console.error("Error updating Doc Manager:", error);
    }
  };

  const handleResetClick = () => {
    setFolderPath("");
    setFolderContent([]);
  };

  const [toaster, setToaster] = useState(false);
  const formik = useFormik({
    initialValues: {
      sNo: -1,
      pageSize: 0,
      pdfName: "",
      filePath: "",
      
    },
    onSubmit: async (values) => {
      console.log("check", values);
      const response = await api.post(`SplitPdf/GetPageCountOfPdf`,
        values
      );
      console.log(response.data.status)
      if (response.data.status==1) {
        setToaster(true);
        toast.success(response.data.message);
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const requiredFields = ["pdfName"];





  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #42AEEE",
          marginTop: "3vh"
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.PdfCounter")}
          </Typography>

          <Grid item sm={4} xs={12}>
            <Typography style={{ marginTop: "-75px" }}>
              <Button
                type="submit"
                //onClick={() => back(-1)}
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
              <Grid item lg={6} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={optionFileName}
                  fullWidth
                  // value={CheckMode}
                  size="small"
                  onChange={(event: any, newValue) => {
                    console.log(newValue);
                    formik.setFieldValue("filePath", newValue?.path);
                    formik.setFieldValue("pdfName", newValue?.label);
                  }}
                  style={{ backgroundColor: "white" }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.SelectFileName")} />
                  )}
                />
              </Grid>

              <Grid item lg={6} xs={12}>
                <TextField

                  label={t("text.EnterFolderPath")}
                  value={formik.values.filePath}
                  placeholder={t("text.EnterFolderPath")}
                  size="small"
                  fullWidth
                  name="filePath"
                  id="filePath"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                // id="folderPath"
                // fullWidth
                // label="Enter Folder Path"
                // size="small"
                // value={formik.values.filePath}
                // onChange={handleFolderPathChange}
                />
              </Grid>




            </Grid>
            <Grid item lg={4} xs={12} style={{ marginLeft: "37%", marginTop: "2%" }}>
              <Button
                variant="contained"
                onClick={(e: any) => formik.handleSubmit(e)}
                style={{
                  backgroundColor: "#42AEEE",

                  width: "250px"
                }}
              >
                {t("text.Count")}
              </Button>
            </Grid>
          </form>

        </CardContent>
      </div>
    </div>
  );
};

export default PdfCounter;