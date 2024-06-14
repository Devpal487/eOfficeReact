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
import React, { useState, useEffect, useTransition } from "react";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../../utils/Url";
import CustomLabel from "../../../CustomLable";
type Props = {};

const JurisdictionMasterEdit = (props: Props) => {
  const location = useLocation();
  // console.log('location', location.state)
  const { i18n, t } = useTranslation();

  const [NodeOption, setNodeOption] = useState([{ value: "-1", label: t("text.SelectNode") }]);
 
  let navigate = useNavigate();


  const getNode = () => {
    const collectData = {
      "id": -1,
      "nodeID": -1,
      "titleID": -1
    };
    api
      .post( `Master/GetNewNodeMaster`, collectData)
      .then((res) => {
        const arr = res.data.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setNodeOption(arr);
      });
  };

  useEffect(() => {
    getNode();
  }, []);

  const back = useNavigate();

  const validationSchema = Yup.object({
    name:
      Yup.string().test(
        'required', // Unique name for the test

        function (value: any) {
          return value && value.trim() !== ''; // Your validation logic here
        }),

  });


  const formik = useFormik({
    initialValues: {
      id: location.state.id,
      nodeID: location.state.nodeID,
      name: location.state.name,
      titleID: location.state.titleID,

    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
         `Master/AddUpdateNewNodeMaster`,
        values
      );
      try {
        // console.log("API Response:", response.data);
        toast.success(response.data.mesg);
        navigate("/master/Jurisdiction");
      } catch (error) {
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ["name"];

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          marginTop: "5px",
          // border: ".5px solid #FF7722",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.EditJurisdictionMaster")}
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
            <Grid container spacing={1}>

              <Grid item sm={6} md={6} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={NodeOption}
                  value={
                    NodeOption.find(
                      (option: any) => option.value === formik.values.nodeID
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("nodeID", newValue?.value);
                    formik.setFieldTouched("nodeID", true);
                    formik.setFieldTouched("nodeID", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectNode")} required={requiredFields.includes('nodeID')}  />}
                    />
                  )}
                />

                {formik.touched.nodeID && formik.errors.nodeID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.nodeID)}
                  </div>
                ) : null}
              </Grid>




              <Grid sm={6} md={6} xs={12} item>
                <TextField
                  type="text"
                  name="name"
                  id="name"
                  label={<CustomLabel text={t("text.EnterJurisdictionName")} required={requiredFields.includes('name')}  />}
                  value={formik.values.name}
                  placeholder={t("text.EnterJurisdictionName")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.name && formik.errors.name
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.name)}
                  </div>
                ) : null}
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
                    onClick={() => formik.resetForm()}
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

export default JurisdictionMasterEdit;
