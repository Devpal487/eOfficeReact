import React, { useState } from "react";
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
import TokenPopUp from "../../../utils/TokenPopUp";

export default function TokenGenration() {
  const { t } = useTranslation();

  const [isOtpPopupVisible, setOtpPopupVisible] = useState(false);

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "0" }}>
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
                  Token Generation
                </Typography>
              </Grid>
              <Grid item xs={1.5} sm={1.5}></Grid>

              <Grid item xs={9} sm={9}>
                <div className="services-container">
                  <div className="services-header">
                    <Typography fontWeight="600" fontSize={17}>
                      Token for aplicants
                    </Typography>
                  </div>

                  <Grid
                    container
                    spacing={2}
                    style={{ marginBottom: 16, justifyContent: "center" }}
                  >
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
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
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        placeholder="Mobile Number"
                        variant="outlined"
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
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        placeholder="Email"
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

                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Adhar Number"
                        placeholder="Adhar Number"
                        variant="outlined"
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
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    style={{ marginBottom: 16, justifyContent: "center" }}
                  >
                    <Grid item xs={4}>
                      <Button
                        variant="contained"
                        fullWidth
                        style={{ backgroundColor: "#03a1fc", color: "white" }}
                        onClick={() => {
                          setOtpPopupVisible(true);
                        }}
                      >
                        Generate OTP
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={1.5} sm={1.5}></Grid>

              <Grid item xs={12} sm={12}></Grid>
            </Grid>

            <TokenPopUp
              isVisible={isOtpPopupVisible}
              onClose={() => setOtpPopupVisible(false)}
            />
          </Paper>
        </Card>
      </Grid>
    </>
  );
}
