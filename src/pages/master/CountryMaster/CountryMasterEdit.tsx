import { Button, CardContent, Grid, TextField, Typography, Divider } from '@mui/material';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import HOST_URL from '../../../utils/Url';
import {useTranslation} from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from '../../../utils/Url';

type Props = {};

const CountryMasterEdit = (props: Props) => {

  const [toaster, setToaster] = useState(false);

  const location = useLocation();
  console.log('location', location.state)

  let navigate = useNavigate();
  const{t}=useTranslation();
  
  const back = useNavigate();

  const requiredFields = ['countryName']; 

  const validationSchema = Yup.object({
    countryName: Yup.string().test(
      'required',
      t('text.EnterCountryName'),
      function (value:any) {
        return value && value.trim() !== ''; 
      }
    ),
  });

   
  let ID: any = localStorage.getItem("useR_ID")
  if (ID !== null) {
    ID = ID.replace(/\D/g, '');
    // console.log("useR_ID", parseInt(ID));
  } else {
    toast.error("User ID not Found");
  }

  const formik = useFormik({
    initialValues: {
      countryId: location.state.countryId,
      countryName: location.state.countryName,
      countryCode: location.state.countryCode,
      // nationality: location.state.nationality,
      createdBy: location.state.createdBy,
      updatedBy: location.state.updatedBy,
      createdOn: location.state.createdOn,
      updatedOn: location.state.updatedOn,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      
      const response = await api.post(
        `Country/AddUpdateCountryMaster`,
        values
      );
        if(response.data.isSuccess){
        setToaster(false)
        toast.success(response.data.mesg);
        navigate('/master/CountryMaster');
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
  }});


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
            {t("text.EditCountryMaster")}
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
            <Grid item xs={12} container spacing={2}>
              <Grid lg={6} sm={6} xs={12} item>
                <TextField
                  label={
                    <span>
                      {t("text.EnterCountryName")}{requiredFields.includes('countryName') && (
                        <span style={{ color: formik.values.countryName ? 'green' : 'red' }}>*</span>
                      )}
                    </span>
                  }
                  value={formik.values.countryName}
                  placeholder={t("text.EnterCountryName")}
                  size="small"
                  fullWidth
                  name="countryName"
                  id="countryName"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.countryName && formik.errors.countryName ? (
                  <div style={{color:"red", margin:"5px"}}>{String(formik.errors.countryName)}</div>
                ) : null}
              </Grid>

              <Grid lg={6} sm={6} xs={12} item>
                <TextField
                  label={t("text.EnterCountryCode")}
                  value={formik.values.countryCode}
                  placeholder={t("text.EnterCountryCode")}
                  size="small"
                  fullWidth
                  name="countryCode"
                  id="countryCode"
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
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    formik.resetForm();
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
            {/* </Card> */}
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default CountryMasterEdit;