import Paper from "@mui/material/Paper";
import {
  Box,
  Divider,
  Stack,
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
import ToastApp from "../../../ToastApp";

export default function ServiceDashboard() {
  const { t } = useTranslation();

  const services = [
    { id: 1, process: "Generate token" },
    { id: 2, process: "Fill form" },
    { id: 3, process: "Pay fee or Double Verify your payment" },
    { id: 4, process: "Check Status" },
    { id: 5, process: "Know your Application Id" },
  ];

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593",
            marginTop: "5px",
          }}
        >
          <Paper
            sx={{ width: "100%", overflow: "hidden" }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog />
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={10} md={10} xs={12}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
                >
                  {t("text.ServiceDashboard")}
                </Typography>
              </Grid>
            </Grid>

            <Divider />
            <Box height={10} />

            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={12}>
                <div
                  style={{
                    border: "1px solid black",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    borderRadius: "1px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#d41717",
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                      justifyContent: "space-between",
                      padding: "16px",
                      marginBottom: "16px",
                      height: "auto",
                    }}
                  >
                    <Typography fontWeight="600" fontSize={17}>
                      Services
                    </Typography>
                  </div>
                  <TableContainer
                    style={{
                      maxHeight: 400,
                      overflowY: "auto",
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      width: "93%",
                      marginBottom: "2%",

                      margin: "0 auto",

                      border: "#473838",
                    }}
                  >
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
                              <Typography color="primary">Go</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: "2%" }}>
                <div
                  style={{
                    border: "1px solid black",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    borderRadius: "1px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#d41717",
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                      justifyContent: "space-between",
                      padding: "16px",
                      marginBottom: "16px",
                      height: "auto",
                    }}
                  >
                    <Typography fontWeight="600" fontSize={17}>
                      Important Instruction:
                    </Typography>
                  </div>

                  <Typography
                    fontWeight="600"
                    fontSize={17}
                    style={{
                      color: "#f54556",
                      display: "inline-block",
                      animation: "bounce 1.5s infinite",
                    }}
                  >
                    <span style={{ color: "red" }}>Notice :</span>
                    <span>
                      Applicant's are requested to make the payment within 7
                      days otherwise your application has been cancelled.
                    </span>
                  </Typography>

                  <Typography fontWeight="300" fontSize={14} style={{marginLeft:"1%"}}>
                    <span
                      style={{ color: "1px solid black", fontWeight: "600" }}
                    >
                      1 :
                    </span>
                    <span>
                      {" "}
                      Student service has been open from Monday to Thursday
                      only.
                    </span>
                  </Typography>

                  <Typography fontWeight="300" fontSize={14} style={{marginLeft:"1%"}}>
                    <span
                      style={{ color: "1px solid black", fontWeight: "600" }}
                    >
                      2 :
                    </span>
                    <span>
                      In case of any difficulty related to filling of Student
                      Service Application form, please email to{" "}
                      <span
                        style={{ color: "1px solid black", fontWeight: "600" }}
                      >
                        studentHelp@aktu.ac.in.
                      </span>{" "}
                      with subject{" "}
                      <span
                        style={{ color: "1px solid black", fontWeight: "600" }}
                      >
                        STUDENT SERVICE APPLICATION Form Issue
                      </span>
                    </span>
                  </Typography>

                  <Typography fontWeight="300" fontSize={14}  style={{marginLeft:"1%"}}>
                    <span
                      style={{ color: "1px solid black", fontWeight: "600" }}
                    >
                      3 :
                    </span>
                    <span>
                      {" "}
                      Student are requested to check the application status
                      after making the payment.
                    </span>
                  </Typography>

                  <Typography fontWeight="300" fontSize={14} style={{marginLeft:"1%"}}>
                    <span
                      style={{ color: "1px solid black", fontWeight: "600" }}
                    >
                      4 :
                    </span>
                    <span>
                      {" "}
                      Each and every Payment ID has been displayed on payment
                      page after entering the details of application.
                    </span>
                  </Typography>

                  <Typography fontWeight="300" fontSize={14} style={{marginLeft:"1%"}}>
                    <span
                      style={{ color: "1px solid black", fontWeight: "600" }}
                    >
                      5 :
                    </span>
                    <span>
                      {" "}
                      Double verification is used to update the payment status
                      from bank.
                    </span>
                  </Typography>

                  <style>{`
      @keyframes bounce {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(10px); }
      }
    `}</style>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
