import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";

type Props = {};

const WardMasterAdd = (props: Props) => {

  useEffect(() => {
    getVehicleZone();
  }, [])

  const getVehicleZone = () => {
    const collectData = {
      zoneID: -1,
      user_ID: parseInt(ID),
      isActive: true
    };
    api
      .post(`Zone/GetZonemaster`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["zoneName"],
            value: res.data.data[index]["zoneID"]
          });
        }
        setZoneOption(arr);
      });
  };
  const { t } = useTranslation();

  const [ZoneOption, setZoneOption] = useState([{ value: "-1", label: t("text.SelectZone") }]);


  let navigate = useNavigate();

  const back = useNavigate();
  const [toaster, setToaster] = useState(false);

  const validationSchema = Yup.object({
    zoneName: Yup.string().test(
      'required',
      t('text.reqZoneName'),
      function (value: any) {
        return value && value.trim() !== '';
      }),
    wardName: Yup.string().test(
      'required',
      t('text.reqWard'),
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

      "wardID": -1,
      "wardName": "",
      "wardCode": "",
      "zoneID": 0,
      "isActive": true,
      "sortOrder": 0,
      "createdDt": "2024-05-15T13:09:13.523Z",
      "modifyDt": "2024-05-15T13:09:13.523Z",
      "user_ID": parseInt(ID),
      "zoneName": ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `Ward/AddUpdateWardmaster`,
        values
      );

      if (response.data.isSuccess == true) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/master/WardMaster");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }


      // try {
      //     // console.log("API Response:", response.data);
      //     alert(response.data.mesg);
      //     navigate("/master/WardMaster");
      //   } catch (error) {
      //     // console.error("API Error:", error);
      //     alert(response.data.mesg);
      //   }
    },
  });

  const requiredFields = ["zoneName", "wardName"];

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          border: ".5px solid #ff7722",
          marginTop: "3vh"
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.createWardMaster")}
          </Typography>
          <Grid xs={4} sm={12} item>
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
            <Grid container spacing={1}>
              <Grid xs={12} sm={4} item>

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ZoneOption}
                  // value={
                  //   ZoneOption.find(
                  //     (option) => option.value === formik.values.zoneID
                  //   ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("zoneID", newValue?.value);
                    formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("zoneID", true);
                    formik.setFieldTouched("zoneID", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={
                      <span>
                        {t("text.SelectZoneName")} {""}
                        {requiredFields.includes('zoneName') && (
                          <span style={{ color: formik.values.zoneName ? 'green' : 'red' }}>*</span>
                        )}
                      </span>
                    } />
                  )}
                />

                {formik.touched.zoneName && formik.errors.zoneName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.zoneName}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  name="wardName"
                  id="wardName"
                  label={
                    <span>
                      {t("text.enterWardName")} {requiredFields.includes('wardName') && (
                        <span style={{ color: formik.values.wardName ? 'green' : 'red' }}>*</span>
                      )}
                    </span>
                  }
                  value={formik.values.wardName}
                  placeholder={t("text.enterWardName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", borderColor: formik.touched.wardName && formik.errors.wardName ? 'red' : 'initial', }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.wardName && formik.errors.wardName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.wardName}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  value={formik.values.wardCode}
                  name="wardCode"
                  id="wardCode"
                  label={t("text.enterWardCode")}
                  placeholder={t("text.enterWardCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={12} item>
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#059669",
                      margin: "1%",
                    }}
                  >
                    {t("text.save")}
                  </Button>
                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={formik.handleReset}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>

        </CardContent>
      </div>
    </div>
  );
};

export default WardMasterAdd;