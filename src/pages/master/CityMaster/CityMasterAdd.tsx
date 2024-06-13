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


type Props = {};

const CityMasterAdd = (props: Props) => {

  const { t } = useTranslation();
  const [toaster, setToaster] = useState(false);
  const { defaultValues, defaultValuestime } = getISTDate();

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectStateName") },
  ]);

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
      cityId: -1,
      cityName: "",
      stateId: "",

      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
      createdBy: "-1",
      updatedBy: "-1",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
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
            {t("text.CreateDistrictMaster")}
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
                    console.log(newValue?.value);
                    formik.setFieldValue("stateId", newValue?.value);
                    formik.setFieldTouched("stateId", true);
                    formik.setFieldTouched("stateId", false);
                  }}
                  // value={}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectStateName")} {""}
                          {requiredFields.includes("stateId") && (
                            <span
                              style={{
                                color: formik.values.stateId
                                  ? "green"
                                  : "red",
                              }}
                            >
                              *
                            </span>
                          )}
                        </span>
                      }
                    />
                  )}
                />
                {formik.touched.stateId && formik.errors.stateId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.stateId}
                  </div>
                ) : null}
              </Grid>

              <Grid lg={6} sm={6} xs={12} item>
                <TextField
                  label={
                    <span>
                      {t("text.EnterDistrictName")}{" "}
                      {requiredFields.includes("cityName") && (
                        <span
                          style={{
                            color: formik.values.cityName ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
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
                    {formik.errors.cityName}
                  </div>
                ) : null}
              </Grid>


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
            {/* </Card> */}
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default CityMasterAdd;
