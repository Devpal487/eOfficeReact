import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Paper from "@mui/material/Paper";
import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useTranslation } from "react-i18next";
import Institute from "../../../assets/images/aktu.png";
import "./ServiceDashboard.css"; // Import the CSS file

export default function ServiceDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  const services = [
    { id: 1, process: "Generate token" },
    { id: 2, process: "Fill form" },
    { id: 3, process: "Pay fee or Double Verify your payment" },
    { id: 4, process: "Check Status" },
    { id: 5, process: "Know your Application Id" },
  ];

  const handleGoClick = (id:any) => {
    switch (id) {
      case 1: // Generate token
        navigate("/TokenGenration");
        break;
      case 2: // Fill form
        navigate("/FillForm"); // Replace with actual route
        break;
      case 3: // Pay fee
        navigate("/PayFee"); // Replace with actual route
        break;
      case 4: // Check Status
        navigate("/CheckStatus"); // Replace with actual route
        break;
      case 5: // Know your Application Id
        navigate("/KnowApplicationId"); // Replace with actual route
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "0" }}>
        <Card className="card">
          <Paper sx={{ width: "100%", overflow: "hidden" }} style={{ padding: "0" }}>
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
                <Typography className="title">Student Services-Dashboard</Typography>
              </Grid>
              <Grid item xs={1} sm={1}></Grid>

              <Grid item xs={10} sm={10}>
                <div className="services-container">
                  <div className="services-header">
                    <Typography fontWeight="600" fontSize={17}>
                      Services
                    </Typography>
                  </div>

                  <TableContainer className="table-container">
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              border: "1px gray grey",
                              borderLeft: "1px solid #bdbbbb",
                              borderTop: "1px solid #bdbbbb",
                            }}
                          >
                            {t("text.SrNo")}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              border: "1px gray grey",
                              borderLeft: "1px solid #bdbbbb",
                              borderTop: "1px solid #bdbbbb",
                            }}
                          >
                            Process
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              border: "1px gray grey",
                              borderLeft: "1px solid #bdbbbb",
                              borderTop: "1px solid #bdbbbb",
                              borderRight: "1px solid #bdbbbb",
                            }}
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell
                              style={{
                                textAlign: "center",
                                border: "1px gray grey",
                                borderLeft: "1px solid #bdbbbb",
                                borderTop: "1px solid #bdbbbb",
                              }}
                            >
                              {service.id}
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: "center",
                                border: "1px gray grey",
                                borderLeft: "1px solid #bdbbbb",
                                borderTop: "1px solid #bdbbbb",
                              }}
                            >
                              {service.process}
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: "center",
                                border: "1px gray grey",
                                borderLeft: "1px solid #bdbbbb",
                                borderTop: "1px solid #bdbbbb",
                                borderRight: "1px solid #bdbbbb",
                              }}
                            >
                              <Typography
                                color="primary"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleGoClick(service.id)} // Pass service ID
                              >
                                Go
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
              <Grid item xs={1} sm={1}></Grid>
              <Grid item xs={1} sm={1}></Grid>

              <Grid item xs={10} sm={10} sx={{ marginTop: "2%" }}>
                <div className="important-instruction">
                  <div className="instruction-header">
                    <Typography fontWeight="600" fontSize={17}>
                      Important Instruction:
                    </Typography>
                  </div>

                  <Typography className="notice">
                    <span style={{ color: "red" }}>Notice :</span>
                    <span>
                      Applicant's are requested to make the payment within 7
                      days otherwise your application has been cancelled.
                    </span>
                  </Typography>

                  <Typography
                    fontWeight="300"
                    fontSize={14}
                    style={{ marginLeft: "1%" }}
                  >
                    <span style={{ fontWeight: "600" }}>1 :</span>
                    <span>
                      {" "}
                      Student service has been open from Monday to Thursday
                      only.
                    </span>
                  </Typography>

                  <Typography
                    fontWeight="300"
                    fontSize={14}
                    style={{ marginLeft: "1%" }}
                  >
                    <span style={{ fontWeight: "600" }}>2 :</span>
                    <span>
                      In case of any difficulty related to filling of Student
                      Service Application form, please email to{" "}
                      <span style={{ fontWeight: "600" }}>
                        studentHelp@aktu.ac.in.
                      </span>{" "}
                      with subject{" "}
                      <span style={{ fontWeight: "600" }}>
                        STUDENT SERVICE APPLICATION Form Issue
                      </span>
                    </span>
                  </Typography>

                  <Typography
                    fontWeight="300"
                    fontSize={14}
                    style={{ marginLeft: "1%" }}
                  >
                    <span style={{ fontWeight: "600" }}>3 :</span>
                    <span>
                      {" "}
                      Student are requested to check the application status
                      after making the payment.
                    </span>
                  </Typography>

                  <Typography
                    fontWeight="300"
                    fontSize={14}
                    style={{ marginLeft: "1%" }}
                  >
                    <span style={{ fontWeight: "600" }}>4 :</span>
                    <span>
                      {" "}
                      Each and every Payment ID has been displayed on payment
                      page after entering the details of application.
                    </span>
                  </Typography>

                  <Typography
                    fontWeight="300"
                    fontSize={14}
                    style={{ marginLeft: "1%" }}
                  >
                    <span style={{ fontWeight: "600" }}>5 :</span>
                    <span>
                      {" "}
                      Double verification is used to update the payment status
                      from bank.
                    </span>
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={1} sm={1}></Grid>
              <Grid item xs={12} sm={12}></Grid>
            </Grid>
          </Paper>
        </Card>
      </Grid>
    </>
  );
}