import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  Divider,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Stack,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  Radio,
  FormLabel,
  Modal,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../utils/Url";
import Box from "@mui/material/Box";
import CustomDataGrid from "../../utils/CustomDatagrid";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import ButtonWithLoader from "../../utils/ButtonWithLoader";
import { CloseIcons } from "../../utils/icons";
import { ConfirmDialog } from "primereact/confirmdialog";
import CustomLabel from "../../CustomLable";
import { getId, getdivisionId, getinstId } from "../../utils/Constant";
import * as Yup from "yup";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function WorkPlace() {
  const [totalFile, setTotalFile] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ReviewModalData, setReviewModalData] = useState(false);
  const [minDueDate, setMinDueDate] = useState("");

  const userId = getId();

  const instId: any = getinstId();
  // console.log("🚀 ~ ViewEditFile ~ userId:", userId);
  const divId: any = getdivisionId();
  // console.log("🚀 ~ ViewEditFile ~ divId:", divId);

  const [selectedDivision, setSelectedDivision] = useState("-1");

  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    // getAuthDevision();
    fetchTotalFile();
  }, []);

  const validationSchema = Yup.object().shape({
    moveDate: Yup.date().required("Moved Date is required"),
    dueDate: Yup.date()
      .required("Due Date is required")
      .min(Yup.ref("moveDate"), "Due Date must be after Moved Date"),
  });

  const formik = useFormik({
    initialValues: {
      rSendAdrs: "",
      id: "",
      rRemark: "",
      rFileNumber: "",
      rid: "",
      rDealHands: "",
      rDealHandlabel: "",
      fileNo: 0,
      dueDate: "",
      moveDate: new Date().toISOString().substring(0, 10),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {},
  });

  const handleMoveDateChange = (event: any) => {
    const moveDate = event.target.value;
    formik.setFieldValue("moveDate", moveDate);
    formik.setFieldValue("dueDate", "");
    setMinDueDate(moveDate);
  };

  const handleCloseReviewModal = () => {
    setReviewModalData(false);
    formik.setFieldValue("rDealHands", "");
    formik.setFieldValue("rDealHandlabel", "");
  };

  const getSpMovement = async () => {
    // setLoading(true);
    const value = {
      hdnFilNu: formik.values.fileNo,
      inst_id: parseInt(instId),
      userid: userId,
      moveddate: formik.values.moveDate.toString() || "",
      duedate: formik.values.dueDate ? formik.values.dueDate.toString() : null,
      remark: formik.values.rRemark.toString() || "",
      routeId: 0,
      authorityLevel: 0,
      workPlaceFlag: formik.values.rDealHandlabel.toString(),
      remId: 0,
      divisionId: parseInt(divId),
      message: "",
    };

    await api.post(`FileMovement/sp_movetoawait`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        fetchTotalFile();
        handleCloseReviewModal();
        formik.setFieldValue("rRemark", "");
        formik.resetForm();
        //setLoading(false);
      } else {
        toast.error(res.data.mesg);
        //setLoading(false);
      }
      // setLoading(false);
    });
  };

  const routeChangeAdd = (row: any) => {
    let path = "";
    if (row.id == -1) {
      path = `/master/PageCreateAdd`;
    } else {
      path = `/master/PageCreateEdit`;
    }

    navigate(path, {
      state: row,
    });
  };

  // const getAuthDevision = () => {
  //     const collectData = {
  //         divisionid: parseInt(localStorage.getItem("id") + ""),
  //     };
  //     api.post(`AuthorityMaster/GetAuthorityDiv`, collectData).then((res) => {
  //         const arr = res.data.data.map((item: any) => ({
  //             label: item.authorityType,
  //             value: item.id,
  //         }));
  //         Division = arr;
  //     });
  // };

  const arr = [
    { label: "awaited", value: "1" },
    { label: "Closed", value: "2" },
    { label: "Parked/Archived", value: "3" },
  ];

  Division = arr;

  var Division: any[];

  const fetchTotalFile = async () => {
    try {
      console.log("Division", Division);
      const collectData = {
        userid: userId,
        divisionId: parseInt(divId),
        type: "WP",
      };
      console.log("collectData", collectData);
      const response = await api.post(
        `FileMovement/Getsp_FileRoInbox`,
        collectData
      );

      console.log("result", response.data.data);
      const data = response.data.data;
      const DocsWithIds = data.map((doc: any, index: any) => ({
        ...doc,
        serialNo: index + 1,
        id: doc.fnId,
        Division: Division,
      }));

      setTotalFile(DocsWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            width: 120,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "fileNm",
            headerName: t("text.FileNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => {
              return [
                <a
                  onClick={() => navigate("/E-Office/ViewEditFile")}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {params.value}
                </a>,
              ];
            },
          },
          {
            field: "cSubject",
            headerName: t("text.Subject"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "fileStatus",
            headerName: t("text.FileStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "createdby",
            headerName: t("text.CreatedBy"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "updatedRemark",
            headerName: t("text.UpdatedRemark"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "rLetterSentOn",
            headerName: t("text.SentTo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => {
              return (
                <Select
                  value={selectedDivision}
                  onChange={(event: any) => {
                    if (!params.row.fileNm) {
                      toast.error(
                        "Please first assign File Name then proceed further...."
                      );
                    } else {
                      console.log("file number", params.row.fnId);
                      setReviewModalData(true);

                      const value = event.target.value;

                      setSelectedDivision(value);

                      // formik.setFieldValue("id", params.row.fnId);
                      formik.setFieldValue("fileNo", params.row.fnId);
                      //formik.setFieldValue("rid", params.row.rid);

                      const selectedDivision = params.row.Division.find(
                        (item: any) => item.value === event.target.value
                      );
                      if (selectedDivision) {
                        formik.setFieldValue(
                          "rDealHands",
                          selectedDivision.value
                        );
                        formik.setFieldValue(
                          "rDealHandlabel",
                          selectedDivision.label
                        );
                      } else {
                        formik.setFieldValue("rDealHands", "");
                        formik.setFieldValue("rDealHandlabel", "");
                      }
                    }
                  }}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="-1">Select Division</MenuItem>
                  {params?.row?.Division?.map((item: any) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              );
            },
          },
          {
            field: "ReviewFile",
            headerName: t("text.ReviewFile"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => {
              console.log("checkPrams", params);
              return [
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/E-Office/ViewEditFile")}
                  style={{ height: "80%" }}
                >
                  {t("text.ViewEdit")}
                </Button>,
              ];
            },
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        "& .MuiDataGrid-colCell": {
          backgroundColor: "#2B4593",
          color: "#fff",
          fontSize: 17,
          fontWeight: 900,
        },
      }}
      style={{ padding: "10px" }}
    >
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <CustomDataGrid
          isLoading={isLoading}
          rows={totalFile}
          columns={adjustedColumns}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialPageSize={5}
        />
      )}

      {ReviewModalData && (
        <Modal open={true}>
          <Card
            style={{
              width: "80%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#E9FDEE",
              border: ".5px solid #42AEEE",
              marginTop: "35vh",
              marginLeft: "10%",
            }}
          >
            <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
                "& .MuiDataGrid-colCell": {
                  backgroundColor: "#42AEEE",
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 900,
                },
              }}
              style={{ padding: "10px", justifyContent: "center" }}
            >
              <Grid
                xs={12}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight={600} color="#000" fontSize="20px">
                  Remark to {formik.values.rDealHandlabel} for the Letter
                </Typography>
                <IconButton
                  onClick={() => setReviewModalData(false)}
                  aria-label="close"
                >
                  <CloseIcons />
                </IconButton>
              </Grid>

              <ConfirmDialog />
              <Divider />
              <Box height={10} />
              <Stack
                direction="column"
                spacing={2}
                className="my-2 mb-2"
                justifyContent={"center"}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ marginTop: 2 }}
                >
                  <Grid item xs={5}>
                    <TextField
                      type="date"
                      label={<CustomLabel text="Moved Date" />}
                      value={formik.values.moveDate}
                      placeholder="Moved Date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="moveDate"
                      id="moveDate"
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.moveDate &&
                        Boolean(formik.errors.moveDate)
                      }
                      helperText={
                        formik.touched.moveDate && formik.errors.moveDate
                      }
                    />
                  </Grid>

                  {selectedDivision !== "2" && selectedDivision !== "3" && (
                    <Grid item xs={5}>
                      <TextField
                        type="date"
                        label={<CustomLabel text="Due Date" />}
                        value={formik.values.dueDate}
                        placeholder="Due Date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        name="dueDate"
                        id="dueDate"
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.dueDate &&
                          Boolean(formik.errors.dueDate)
                        }
                        helperText={
                          formik.touched.dueDate && formik.errors.dueDate
                        }
                        inputProps={{ min: minDueDate }}
                      />
                    </Grid>
                  )}
                </Grid>

                <TextField
                  label={<CustomLabel text="Remark" required={false} />}
                  value={formik.values.rRemark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Remark"
                  name="rRemark"
                  id="rRemark"
                  size="medium"
                  style={{ backgroundColor: "white", width: "100%" }}
                  fullWidth
                  multiline
                  rows={4}
                />

                <ButtonWithLoader
                  buttonText="Move"
                  onClickHandler={getSpMovement}
                />
              </Stack>
            </Paper>
          </Card>
        </Modal>
      )}
    </Paper>
  );
}
