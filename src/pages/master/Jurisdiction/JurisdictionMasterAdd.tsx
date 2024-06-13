import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../../utils/Url";
type Props = {};

const JurisdictionMasterAdd = (props: Props) => {
  const { i18n ,t } = useTranslation();

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
      id: -1,
      nodeID: 0,
      name: "",
      titleID: 0,

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
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          // border: ".5px solid #ff7722",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.CreateJurisdictionMaster")}
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
            <Grid container spacing={1}>

              <Grid item sm={6} md={6} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={NodeOption}
                  // value={
                  //   CategoryOption.find(
                  //         (option:any) => option.value === prevRecord[0]?.fileCategory) || null
                  // }
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
                      label={
                        <span>
                          {t("text.SelectNode")} {""}
                          {requiredFields.includes("nodeID") && (
                            <span
                              style={{
                                color: formik.values.nodeID
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

                {formik.touched.nodeID && formik.errors.nodeID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.nodeID}
                  </div>
                ) : null}
              </Grid>

              <Grid sm={6} md={6} xs={12} item>
                <TextField
                  type="text"
                  name="name"
                  id="name"
                  label={
                    <span>
                      {t("text.EnterJurisdictionName")} {requiredFields.includes('name') && (
                        <span style={{ color: formik.values.name ? 'green' : 'red' }}>*</span>
                      )}
                    </span>
                  }
                  value={formik.values.name}
                  placeholder={t("text.EnterJurisdictionName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", borderColor: formik.touched.name && formik.errors.name ? 'red' : 'initial', }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.name}
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

export default JurisdictionMasterAdd;
