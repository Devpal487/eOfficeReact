import { Autocomplete, Button, Card, CardContent, Divider, Grid, MenuItem, TextField, Typography, } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import axios from 'axios';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import api from '../../../utils/Url';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from '../../../ToastApp';
import CustomLabel from '../../../CustomLable';

type Props = {};

const DepartmentEdit = (props: Props) => {
  console.log("useLocation " + useLocation());
  const location = useLocation();
  console.log("location", location.state);

  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [toaster, setToaster] = useState(false);
  const validationSchema = Yup.object({
    // zoneName: Yup.string().required("* Enter Zone Name should be required"),
    departmentName: Yup.string().test(
      'required', // Unique name for the test
      t('text.req'), // Translation for "* Enter Zone Name required"
      function (value: any) {
        return value && value.trim() !== ''; // Your validation logic here
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      departmentId: location.state.departmentId,
      departmentName: location.state.departmentName,
      departmentShortname: location.state.departmentShortname,
      "createdBy": location.state.createdBy,
      "updatedBy": location.state.updatedBy,
      "createdOn": location.state.createdOn,
      "updatedOn": location.state.updatedOn
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      const response = await api.post(`Department/AddUpdateDepartmentmaster`,
        values
      );
      // console.log("API Response:", response.data);
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate('/master/DepartmentMaster');
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }

    },
  });

  const requiredFields = ['departmentName'];


  const back = useNavigate();
  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh"
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.editdeptmaster")}
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
              <Grid item lg={6} xs={12}>
                <TextField
                  id="departmentName"
                  name="departmentName"
                  label={
                    <strong style={{ color: "#000" }}>
                      {t("text.enterdeptName")}{" "}{requiredFields.includes('departmentName') && (
                        <span style={{ color: formik.values.departmentName ? 'green' : 'red' }}>*</span>
                      )}
                    </strong>
                  }
                  value={formik.values.departmentName}
                  placeholder={t("text.enterdeptName")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: 'white',
                    borderColor: formik.touched.departmentName && formik.errors.departmentName ? 'red' : 'initial',
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.departmentName && formik.errors.departmentName ? (
                  <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.departmentName)}</div>
                ) : null}
              </Grid>

              <Grid item lg={6} xs={12}>
                <TextField
                  id="departmentShortname"
                  name="departmentShortname"
                  label={<strong style={{ color: "#000" }}>{t("text.enterdeptCode")}</strong>}
                  value={formik.values.departmentShortname}
                  placeholder={t("text.enterdeptCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
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
                  onClick={(e) => formik.resetForm()}
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

export default DepartmentEdit;