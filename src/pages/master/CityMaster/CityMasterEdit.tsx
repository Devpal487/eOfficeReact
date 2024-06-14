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
import api from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";


type Props = {};

const CityMasterEdit = (props: Props) => {

  const { t } = useTranslation();
  const [toaster, setToaster] = useState(false);
  const { defaultValues, defaultValuestime } = getISTDate();


  const location = useLocation();
  console.log("location", location.state);

  const [option, setOption] = useState([{ value: "-1", label: t("text.SelectStateName") }]);
  let navigate = useNavigate();


  useEffect(() => {
    getStateZone();
  }, []);

  const getStateZone = () => {
    const collectData = {
      "stateId": -1,
      "countryId": -1
    };
    api
      .post(`State/GetStateMaster`, collectData)
      .then((res) => {
        const arr = [];
        // console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["stateName"],
            value: res.data.data[index]["stateId"],
          });
        }
        setOption(arr);
      });
  };

  const validationSchema = Yup.object({
    stateId: Yup.string().test(
      "required",
      t("text.reqstateName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    cityName: Yup.string().test(
      "required",
      t("text.reqdistrictName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      cityId: location.state.cityId,
      cityName: location.state.cityName,
      stateId: location.state.stateId,
      createdOn: location.state.createdOn,
      updatedOn: location.state.updatedOn,
      createdBy: location.state.createdBy,
      updatedBy: location.state.updatedBy,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.createdOn = defaultValuestime;
      values.updatedOn =defaultValuestime;

      const response = await api.post(`M10_District/AddUpdateDistrictMaster`,
        values
      );
      try {
       toast.success(response.data.mesg);
        setToaster(false);
        navigate("/master/CityMaster");
      } catch (error) {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ["stateId", "cityName"];

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
            {t("text.EditDistrictMaster")}
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
                  value={option.find(opt => opt.value === formik.values.stateId) || null}
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("stateId", newValue?.value);
                    formik.setFieldTouched("stateId", true);
                  }}
                  // value={}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectStateName")} required={requiredFields.includes('stateId')}  />}
                    />
                  )}
                />
                {formik.errors.stateId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.stateId)}
                  </div>
                ) : null}
              </Grid>

              <Grid lg={6} sm={6} xs={12} item>
                <TextField
                  label={<CustomLabel text={t("text.EnterDistrictName")} required={requiredFields.includes('cityName')}  />}
                  value={formik.values.cityName}
                  name="cityName"
                  id="cityName"
                  placeholder={t("text.EnterDistrictName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.cityName && formik.errors.cityName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.cityName)}
                  </div>
                ) : null}
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
            {/* </Card> */}
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default CityMasterEdit;


