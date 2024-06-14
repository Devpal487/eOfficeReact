import { Button, Card, CardContent, Grid, TextField, Typography, Divider } from '@mui/material';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../../../utils/Url';
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from '../../../CustomLable';


type Props = {};

const GenderMasterEdit = (props: Props) => {

  const location = useLocation();
  console.log('location', location.state)

  let navigate = useNavigate();
  const { t } = useTranslation();

  const [toaster, setToaster] = useState(false);

  const validationSchema = Yup.object({

    genderName: Yup.string().test(
      "required",
      t("text.reqGenderName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      genderID: location.state.id,
      genderName: location.state.genderName,
      genderCode: location.state.genderCode
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `Gender/AddUpdateGenderMaster`,
        values
      );
      try {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/master/GenderMaster");
      } catch (error) {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ["genderName"];


  const back = useNavigate();
  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          marginTop: "5px",
          border: ".5px solid #FF7722",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.EditGenderMaster")}
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
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={6} sm={6} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.EnterGenderName")} required={requiredFields.includes('genderName')} />}
                  value={formik.values.genderName}
                  placeholder={t("text.EnterGenderName")}
                  size="small"
                  name="genderName"
                  id="genderName"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.genderName && formik.errors.genderName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.genderName)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <TextField
                  label={<CustomLabel text={t("text.EnterGenderCode")} />}
                  value={formik.values.genderCode}
                  name="genderCode"
                  id="genderCode"
                  placeholder={t("text.EnterGenderCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: "#059669",
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.update")}
                </Button>
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    formik.resetForm();
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default GenderMasterEdit;

