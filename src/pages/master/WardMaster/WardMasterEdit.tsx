import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
type Props = {};

const WardMasterEdit = (props: Props) => {
  const { t } = useTranslation();
  const [option, setOption] = useState([{ value: "-1", label: t("text.selectZone") }]);

  let navigate = useNavigate();
  const [toaster, setToaster] = useState(false);
  const location = useLocation();
  console.log("location", location.state);

  useEffect(() => {
    getVehicleZone();
  }, []);

  const validationSchema = Yup.object({
    zoneID:
      Yup.string().test(
        'required',
        t('text.reqZoneName'),
        function (value: any) {
          return value && value.trim() !== '';
        }),
    // Yup.string().required("* Zone Name is required"),
    wardName:
      Yup.string().test(
        'required',
        t('text.reqWard'),
        function (value: any) {
          return value && value.trim() !== '';
        }
      ),
    //  Yup.string().required("* Ward Name is required"),
  });

  let ID: any = localStorage.getItem("useR_ID")
  if (ID !== null) {
    ID = ID.replace(/\D/g, '');
    // console.log("useR_ID", parseInt(ID));
  } else {
    toast.error("User ID not Found");
  }


  console.log(location.state.zoneID)
  const formik = useFormik({
    initialValues: {
      wardID: location.state.id,
      zoneID: location.state.zoneID || null,
      wardName: location.state.wardName,
      wardCode: location.state.wardCode,
      sortOrder: location.state.sortOrder,
      isActive: location.state.Status,
      user_ID: location.state.user_ID,
      createdDt: location.state.createdDt,
      modifyDt: location.state.modifyDt,
      zoneName: location.state.zoneName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `Ward/AddUpdateWardmaster`,
        values
      );

      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/master/WardMaster");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }


      // try {
      //       // console.log("API Response:", response.data);
      //       alert(response.data.mesg);
      //       navigate("/master/WardMaster");
      //     } catch (error) {
      //       // console.error("API Error:", error);
      //       alert(response.data.mesg);
      //     }
    },
  });

  const requiredFields = ["zoneID", "wardName"];


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
            value: res.data.data[index]["zoneID"],
          });
        }
        setOption(arr);
      });
  };

  const back = useNavigate();

  return (
    <div>
      <div style={{ padding: '-5px 5px', marginTop: "3vh", backgroundColor: '#ffffff', borderRadius: '5px', border: '.5px solid #FF7722' }}>

        <CardContent>
          <Typography variant='h5' textAlign="center" style={{ fontSize: '18px', fontWeight: 500 }}>
            {t("text.editWardMaster")}
          </Typography>


          <Grid item sm={4} xs={12} >
            <Typography style={{ marginTop: '-75px', }}>
              <Button type='submit' onClick={() => back(-1)} variant='contained' style={{ marginBottom: 15, marginTop: '45px', backgroundColor: 'blue', width: 20 }}><ArrowBackSharpIcon /></Button>
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
                  options={option}
                  fullWidth
                  // onOpen={() => {
                  //     getVehicleZone();
                  //   }}
                  //       value={
                  //         ZoneOption.find(
                  //     (option) => option.value === formik.values.zoneName
                  //   ) || null
                  // }
                  value={option.find(opt => opt.value === formik.values.zoneID) || null}
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
                        {t("text.SelectZoneName")}  {requiredFields.includes('zoneID') && (
                          <span style={{ color: formik.values.zoneID ? 'green' : 'red' }}>*</span>
                        )}
                      </span>
                    } />
                  )}
                />

                {formik.errors.zoneID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.zoneID)}
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
                    {String(formik.errors.wardName)}
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
                  required
                  style={{ backgroundColor: "white", }}
                  // onChange={wardcodeChangeHandler}
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
                    {t("text.update")}
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

export default WardMasterEdit;


