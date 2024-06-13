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
import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";


type Props = {};

const ZoneMasterAdd = (props: Props) => {

  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [toaster, setToaster] = useState(false);
  const validationSchema = Yup.object({

    zoneName: Yup.string().test(
      'required',
      t('text.reqZoneName'),
      function (value: any) {
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
      zoneID: -1,
      zoneName: "",
      zoneCode: "",
      sortOrder: 0,
      isActive: true,
      user_ID: parseInt(ID),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `Zone/AddUpdateZonemaster`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate('/master/ZoneMaster');
      } else {
        setToaster(true);
        toast.error(response.data.mesg);

      }

    }
  });

  const requiredFields = ['zoneName'];

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
            {t("text.createZoneMaster")}
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
                  id="zoneName"
                  name="zoneName"
                  label={
                    <span>
                      {t("text.enterZoneName")}{requiredFields.includes('zoneName') && (
                        <span style={{ color: formik.values.zoneName ? 'green' : 'red' }}>*</span>
                      )}
                    </span>
                  }
                  value={formik.values.zoneName}
                  placeholder={t("text.enterZoneName")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: 'white',
                    borderColor: formik.touched.zoneName && formik.errors.zoneName ? 'red' : 'initial',
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.zoneName && formik.errors.zoneName ? (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.zoneName}</div>
                ) : null}
              </Grid>

              <Grid item lg={6} xs={12}>
                <TextField
                  id="zoneCode"
                  name="zoneCode"
                  label={t("text.enterZoneCode")}
                  value={formik.values.zoneCode}
                  placeholder={t("text.enterZoneCode")}
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

export default ZoneMasterAdd;