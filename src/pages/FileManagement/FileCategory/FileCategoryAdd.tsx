import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastApp from "../../../ToastApp";
import { toast } from "react-toastify";
import api from "../../../utils/Url";

type Props = {};

const FileCategoryAdd = (props: Props) => {
  const { t } = useTranslation();

  const [toaster, setToaster] = useState(false);

  const [option, setOption] = useState([
    { value: "-1", label: t("text.FileCateDesc") },
  ]);
  let navigate = useNavigate();
  const validationSchema = Yup.object({

    fileCatDesc: Yup.string().test(
      "required",
      t("text.FileCatDescRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

  });
  const formik = useFormik({
    initialValues: {
      "fileCatid": -1,
      "fileCatDesc": ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `FileCategory/AddUpdateFileCategory`,
        values
      );
      try {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/FileManagement/FileCategory");
      } catch (error) {
        setToaster(true);
        toast.error(response.data.mesg);

      }
    },
  });

  const requiredFields = ["fileCatDesc"];

  const back = useNavigate();
  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          marginTop: "5px",
          // border: ".5px solid #FF7722",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.CreateFileCategory")}
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
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>


              <Grid lg={6} sm={6} xs={12} item>
                <TextField
                  label={
                    <span>
                      {t("text.EnterFileCategory")} {" "}
                      {requiredFields.includes("fileCatDesc") && (
                        <span
                          style={{
                            color: formik.values.fileCatDesc ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.fileCatDesc}
                  name="fileCatDesc"
                  id="fileCatDesc"
                  placeholder={t("text.EnterFileCategory")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fileCatDesc && formik.errors.fileCatDesc ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.fileCatDesc}
                  </div>
                ) : null}
              </Grid>

             
<Grid item xs={12} container spacing={2} sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>

              <Grid item lg={6} sm={6} xs={12}>
                {/* <Grid> */}
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: "#059669",
                      color: "white",
                      marginTop: "2px",
                    }}
                  >
                    {t("text.save")}
                  </Button>
                {/* </Grid> */}
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "2px",
                  }}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    formik.resetForm();
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
              </Grid>
            </Grid>
            {/* </Card> */}
          </form>
        </CardContent>

      </div>
    </div>
  )
}
export default FileCategoryAdd;
