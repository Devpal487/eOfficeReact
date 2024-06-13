import { Autocomplete, Button, Card, CardContent, Grid,Divider, MenuItem, TextField, Typography, } from '@mui/material'
import React, { useState } from 'react'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import axios from 'axios';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import api from '../../../utils/Url';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from '../../../ToastApp';

type Props = {};

const DepartmentAdd = (props: Props) => {
    let navigate = useNavigate();
    const { i18n, t } = useTranslation();
  
  
    const validationSchema = Yup.object({
      
      departmentName: Yup.string().test(
        'required', 
        t('text.reqdept_name'), 
        function (value:any) {
          return value && value.trim() !== ''; 
        }
      ),
    });
    const[toaster,setToaster]=useState(false);
    const formik = useFormik({
      initialValues: {
        "departmentId": -1,
  "departmentName": "",
  "departmentShortname": "",
  "createdBy": "admin",
  "updatedBy": "admin",
  "createdOn": "2024-04-08T11:18:30.961Z",
  "updatedOn": "2024-04-08T11:18:30.961Z"
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        const response = await api.post( `Department/AddUpdateDepartmentmaster`,
          values
          );
            if (response.data.isSuccess) {
              setToaster(false);
              toast.success(response.data.mesg);
              navigate('/master/DepartmentMaster');
            } else {
              setToaster(true);
              toast.error(response.data.mesg);
            }
          
    }
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
            marginTop:"3vh"
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              textAlign="center"
              style={{ fontSize: "18px", fontWeight: 500 }}
            >
              {t("text.createdeptmaster")}
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
            {toaster===false ?"":<ToastApp/>}
              <Grid item xs={12} container spacing={2}>
                <Grid item lg={6} xs={12}>
                  <TextField
                    id="departmentName"
                    name="departmentName"
                    label={
                      <span>
                        {t("text.enterdeptName")}{" "}{requiredFields.includes('departmentName') && (
                          <span style={{ color: formik.values.departmentName ? 'green' : 'red' }}>*</span>
                        )}
                      </span>
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
                    <div style={{color:"red", margin:"5px"}}>{formik.errors.departmentName}</div>
                  ) : null}
                </Grid>
  
                <Grid item lg={6} xs={12}>
                  <TextField
                    id="departmentShortname"
                    name="departmentShortname"
                    label={t("text.enterdeptCode")}
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

export default DepartmentAdd;