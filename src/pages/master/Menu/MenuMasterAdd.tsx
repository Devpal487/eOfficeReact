import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import CustomLabel from "../../../CustomLable";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";

type Props = {};

const MenuMasterAdd = (props: Props) => {
  const [option, setOption] = useState([{ value: "-1", label: "Select Menu" }]);
  const [lang, setLang] = useState<Language>("en");

  let navigate = useNavigate();

  const getMenuName = () => {
    api.post(`Menu/GetParentMenuMaster`).then((res) => {
      const arr = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["menuName"],
          value: res.data.data[index]["menuId"],
        });
      }
      setOption(arr);
    });
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const back = useNavigate();
  const { t } = useTranslation();
  const validationSchema = Yup.object({
    menuName: Yup.string().test(
      "required",
      t("text.reqMenuName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      menuId: -1,
      menuName: "",
      parentId: 0,
      pageUrl: "",
      icon: "",
      displayNo: 0,
      isMenu: false,
      isAdd: false,
      isEdit: false,
      isDel: false,
      isView: false,
      isPrint: false,
      isExport: false,
      isRelease: false,
      isPost: false,
      childId: 0,
      parentName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(`Menu/AddUpdateMenuMaster`, values);
      try {
        // console.log("API Response:", response.data);
        alert(response.data.mesg);
        navigate("/master/MenuMaster");
      } catch (error) {
        alert(response.data.mesg);
      }
    },
  });

  const requiredFields = ["menuName"];

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          border: ".5px solid #2B4593",
        }}
      >
        <CardContent>
          <Grid item xs={12} container spacing={2}>
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{backgroundColor:`var(--grid-headerBackground)`,color: `var(--grid-headerColor)`}}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid
              item
              lg={7}
              md={7}
              xs={7}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.CreateMenuMaster")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>

          <Divider />
          <br />

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={4} item>
                <TranslateTextField
                  label={t("text.EnterMenuName")}
                  value={formik.values.menuName}
                  onChangeText={(text: string) =>
                    handleConversionChange("menuName", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.menuName && formik.errors.menuName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.menuName}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  name="pageUrl"
                  id="pageUrl"
                  label={<CustomLabel text={t("text.EnterPageURL")} />}
                  value={formik.values.pageUrl}
                  placeholder={t("text.EnterPageURL")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.pageUrl && formik.errors.pageUrl
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  name="icon"
                  id="icon"
                  label={<CustomLabel text={t("text.EnterIcon")} />}
                  value={formik.values.icon}
                  placeholder={t("text.EnterIcon")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.icon && formik.errors.icon
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  onOpen={() => {
                    getMenuName();
                  }}
                  size="small"
                  onChange={(event, newValue) => {
                    // console.log(newValue?.value);
                    formik.setFieldValue("parentName", newValue?.label);
                    formik.setFieldValue("parentId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.selectParentMenuName")} />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  name="displayNo"
                  id="displayNo"
                  label={<CustomLabel text={t("text.EnterdisplayNo")} />}
                  value={formik.values.displayNo}
                  placeholder={t("text.EnterdisplayNo")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.displayNo && formik.errors.displayNo
                        ? "red"
                        : "initial",
                  }}
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
                      backgroundColor:`var(--grid-headerBackground)`,
                      color: `var(--grid-headerColor)`,
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

export default MenuMasterAdd;
