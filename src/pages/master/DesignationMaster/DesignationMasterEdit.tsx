import { Autocomplete, Button, Card, CardContent, Grid,Divider, MenuItem, TextField, Typography, } from '@mui/material'
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
import { getISTDate } from "../../../utils/Constant";

type Props = {};

const DesignationMasterEdit = (props: Props) => {
    let navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const location = useLocation();
    console.log("location", location.state);
    const[toaster,setToaster]=useState(false);
  
  const { defaultValues, defaultValuestime } = getISTDate();

    const validationSchema = Yup.object({
      
      designationName: Yup.string().test(
        'required', 
        t('text.reqdesignname'), 
        function (value:any) {
          return value && value.trim() !== ''; 
        }
      ),
    });
  
    const formik = useFormik({
      initialValues: {
        designationId: location.state.id,
        designationName: location.state.designationName,
        designationCode: location.state.designationCode,
        "createdBy": location.state.createdBy,
        "updatedBy": location.state.updatedBy,
        "createdOn": defaultValuestime,
        "updatedOn": defaultValuestime
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        const response = await api.post(
          `Designation/AddUpdateDesignationmaster`,
          values
          );
            if (response.data.isSuccess) {
              setToaster(false);
              toast.success(response.data.mesg);
              navigate('/master/DesignationMaster');
            } else {
              setToaster(false);
              toast.error(response.data.mesg);
            }
     
    }
  });
  
    const requiredFields = ['designationName']; 
  
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
              {t("text.editdesMaster")}
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
                    id="designationName"
                    name="designationName"
                    label={
                      <span>
                        {t("text.enterDesName")}{" "}{requiredFields.includes('designationName') && (
                          <span style={{ color: formik.values.designationName ? 'green' : 'red' }}>*</span>
                        )}
                      </span>
                    }
                    value={formik.values.designationName}
                    placeholder={t("text.enterDesName")}
                    size="small"
                    fullWidth
                    style={{
                      backgroundColor: 'white',
                      borderColor: formik.touched.designationName && formik.errors.designationName ? 'red' : 'initial',
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.designationName && formik.errors.designationName ? (
                    <div style={{color:"red", margin:"5px"}}>{String(formik.errors.designationName)}</div>
                  ) : null}
                </Grid>
  
                <Grid item lg={6} xs={12}>
                  <TextField
                    id="designationCode"
                    name="designationCode"
                    label={t("text.entershortCode")}
                    value={formik.values.designationCode}
                    placeholder={t("text.entershortCode")}
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
                       {t("text.update")}
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

export default DesignationMasterEdit;