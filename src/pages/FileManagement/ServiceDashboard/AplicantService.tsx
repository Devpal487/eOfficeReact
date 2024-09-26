import React from "react";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useTranslation } from "react-i18next";
import Institute from "../../../assets/images/aktu.png";
import "./ServiceDashboard.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getISTDate } from "../../../utils/Constant";
import api from "../../../utils/Url";
import { toast } from "react-toastify";

export default function AplicantService() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const TokenId = localStorage.getItem("tokenId");
  let { defaultValuestime } = getISTDate();

  const routeChangeEdit = (row:any) => {
    console.log("row " + row);

    let path = `/AplicantDetailsAdd`;
    navigate(path, {
      state: row,
    });
  };

  const formik = useFormik({
    initialValues: {
      studentId: -1,
      rollNo: "",
    },

    onSubmit: async (values: any) => {
      const response = await api.post(`Student/GetStudentDetails`, values);
      if (response.data.data) {
        // toast.success(response.data.mesg);

        routeChangeEdit(response.data.data);

        console.log("🚀 ~ onSubmit: ~ response.data.data:", response.data.data);
      } else {
        //setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "0" }}>
        <form onSubmit={formik.handleSubmit}>
          <Card className="card">
            <Paper
              sx={{ width: "100%", overflow: "hidden" }}
              style={{ padding: "0" }}
            >
              <ConfirmDialog />
              <Grid item xs={12} container spacing={2}>
                <Grid item lg={12} md={12} xs={12} className="header">
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className="header-text"
                    align="left"
                  >
                    <img
                      src={Institute}
                      alt="Institute Logo"
                      style={{ marginRight: 8, height: 24 }}
                    />{" "}
                    Institute ERP
                  </Typography>
                </Grid>
              </Grid>
              <Divider />
              <Box height={10} />

              <Grid item xs={12} container spacing={2}>
                <Grid item xs={1} sm={1}></Grid>
                <Grid item xs={11} sm={11}>
                  <Typography className="title" style={{ fontSize: "20px" }}>
                    Aplicant Service Aplication Form
                  </Typography>
                </Grid>
                <Grid item xs={1.5} sm={1.5}></Grid>

                <Grid item xs={9} sm={9}>
                  <div className="services-container">
                    <div className="services-header">
                      <Typography fontWeight="600" fontSize={17}>
                        Aplicant Details
                      </Typography>
                    </div>

                    <Grid
                      container
                      spacing={2}
                      style={{ marginBottom: 16, justifyContent: "center" }}
                    >
                      <Grid item xs={3.5}>
                        <TextField
                          fullWidth
                          label="Token No."
                          variant="outlined"
                          value={TokenId}
                          placeholder="Token No."
                          onChange={formik.handleChange}
                          InputProps={{
                            readOnly: true, // Make the text field read-only
                          }}
                          InputLabelProps={{
                            sx: { color: "rgb(183, 28, 28)" },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderTop: "none",
                              borderLeft: "none",
                              borderRight: "none",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderTop: "none",
                                borderLeft: "none",
                                borderRight: "none",
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField
                          fullWidth
                          name="rollNo"
                          id="rollNo"
                          value={formik.values.rollNo}
                          onChange={formik.handleChange}
                          label="Roll No"
                          variant="outlined"
                          placeholder="Roll No"
                          InputLabelProps={{
                            sx: { color: "rgb(183, 28, 28)" },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderTop: "none",
                              borderLeft: "none",
                              borderRight: "none",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderTop: "none",
                                borderLeft: "none",
                                borderRight: "none",
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={3.5} sx={{ marginTop: "2%" }}>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          style={{
                            backgroundColor: "rgb(183, 28, 28)",
                            color: "white",
                          }}
                          // onClick={() => {
                          //   navigate("/AplicantDetailsAdd");
                          // }}
                        >
                          Search
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item xs={1.5} sm={1.5}></Grid>

                <Grid item xs={12} sm={12}></Grid>
              </Grid>
            </Paper>
          </Card>
        </form>
      </Grid>
    </>
  );
}
