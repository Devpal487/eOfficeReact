import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../../../utils/Url";
import ToastApp from "../../../ToastApp";

type Props = {};

const StateMasterAdd = (props: Props) => {
  const [toaster, setToaster] = useState(false);

  let navigate = useNavigate();
  const { t } = useTranslation();

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);

  useEffect(() => {
    getCountryName();
  }, [])

  const getCountryName = () => {
    const collectData = {
      countryId: -1,
    };
    api
      .post(`Country/GetCountryMaster`, collectData)
      .then((res) => {
        const arr = [];
        //console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["countryName"],
            value: res.data.data[index]["countryId"],
          });
        }
        setOption(arr);
      });
  };

  const validationSchema = Yup.object({
    countryName: Yup.string().test(
      'required',
      t('text.reqcountryName'),
      function (value: any) {
        return value && value.trim() !== '';
      }),
    stateName: Yup.string().test(
      'required',
      t('text.reqstateName'),
      function (value: any) {
        return value && value.trim() !== '';
      }
    ),
  });

  let ID: any = localStorage.getItem("useR_ID")
  if (ID !== null) {
    ID = ID.replace(/\D/g, '');
  } else {
    toast.error("User ID not Found");
  }


  const formik = useFormik({
    initialValues: {
      stateId: -1,
      stateName: "",
      stateCode: "",
      countryId: "",
      countryName: "",
      createdBy: "",
      updatedBy: "",
      createdOn: "2024-04-09T09:38:12.623Z",
      updatedOn: "2024-04-09T09:38:12.623Z"
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      await api.post(
        `State/AddUpdateStateMaster`,
        values
      )
      .then((response)=>{
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
      })
    },
  });

  const requiredFields = ['stateName', "countryName"];

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
            {t("text.CreateStateMaster")}
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
              <Grid lg={6} sm={6} xs={12} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue);

                    formik.setFieldValue("countryId", newValue?.value);
                    formik.setFieldValue("countryName", newValue?.label);
                    // formik.setFieldTouched("zoneID", true); 
                  }}
                  renderInput={(params) => (
                    <TextField {...params}
                      label={
                        <span>
                          {t("text.SelectCountryName")} {""}
                          {requiredFields.includes('countryName') && (
                            <span style={{ color: formik.values.countryName ? 'green' : 'red' }}>*</span>
                          )}
                        </span>
                      } />)}
                />
                {formik.touched.countryName && formik.errors.countryName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.countryName}
                  </div>
                ) : null}
              </Grid>

              <Grid lg={6} sm={6} xs={12} item>
                <TextField
                  label={
                    <span>
                      {t("text.EnterStateName")} {requiredFields.includes('stateName') && (
                        <span style={{ color: formik.values.stateName ? 'green' : 'red' }}>*</span>
                      )}
                    </span>
                  }
                  value={formik.values.stateName}
                  name="stateName"
                  id="stateName"
                  placeholder={t("text.EnterStateName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.stateName && formik.errors.stateName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.stateName}
                  </div>
                ) : null}
              </Grid>
              <br />
              <Grid lg={6} sm={6} xs={12} item>
                <TextField
                  label={t("text.EnterStateCode")}
                  value={formik.values.stateCode}
                  name="stateCode"
                  id="stateCode"
                  placeholder={t("text.EnterStateCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} container spacing={2} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Grid item lg={6} sm={6} xs={12}>
                  {/* <Grid> */}
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
                  {/* </Grid> */}
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
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default StateMasterAdd;
