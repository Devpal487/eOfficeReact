import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  FormLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId } from "../../../utils/Constant";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomLabel from "../../../CustomLable";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import EnglishToHindiConverter from "../../../EnglishToHindiConverter";
import InputModeSelector from "../../../InputModeSelector";
import { InputModeProvider } from "../../../text";
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ZoneMaster() {
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const dataString = localStorage.getItem("userdata");
    if (dataString) {
      const data = JSON.parse(dataString);
      if (data && data.length > 0) {
        const userPermissionData = data[0]?.userPermission;
        if (userPermissionData && userPermissionData.length > 0) {
          const menudata = userPermissionData[0]?.parentMenu;
          for (let index = 0; index < menudata.length; index++) {
            const childMenudata = menudata[index]?.childMenu;
            const pathrow = childMenudata.find(
              (x: any) => x.path === location.pathname
            );
            // console.log("data", pathrow);
            if (pathrow) {
              setPermissionData(pathrow);
              fetchZonesData();
            }
          }
        }
      }
    }
  }, [isLoading]);

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);

  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    // console.log(value)
    const collectData = {
      zoneID: value.id,
      zoneName: value.zoneName,
      zoneCode: value.zoneCode,
      isActive: event.target.checked,
      user_ID: Userid,
      sortOrder: value.sortOrder,
    };
    api
      .post(`Zone/AddUpdateZonemaster`, collectData)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          fetchZonesData();
        } else {
          toast.error(response.data.mesg);
        }
      });
  };

  const routeChangeEdit = (row: any) => {
    console.log(row);
    formik.setFieldValue("zoneID", row.zoneID);
    formik.setFieldValue("zoneName", row.zoneName);
    formik.setFieldValue("zoneCode", row.zoneCode);
    formik.setFieldValue("isActive", row.isActive);
    setEditId(row.id);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      zoneID: delete_id,
      user_ID: Userid,
      "isActive": true
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`Zone/DeleteZonemaster`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        fetchZonesData();
      });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    delete_id = del_id;
    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
        zoneID: -1,
        user_ID: Userid,
        // isActive: true
      };
      const response = await api.post(
        `Zone/GetZonemaster`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.zoneID,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            // headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 150,

            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  {permissionData?.isEdit ? (
                    <EditIcon
                      style={{
                        fontSize: "20px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      className="cursor-pointer"
                      onClick={() => routeChangeEdit(params.row)}
                    />
                  ) : (
                    ""
                  )}
                  {permissionData?.isDel ? (
                    <DeleteIcon
                      style={{
                        fontSize: "20px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handledeleteClick(params.row.id);
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <Switch
                    checked={Boolean(params.row.isActive)}
                    style={{
                      color: params.row.isActive ? "green" : "#FE0000",
                    }}
                    onChange={(value: any) =>
                      handleSwitchChange(value, params.row)
                    }
                    inputProps={{
                      "aria-label": "Toggle Switch",
                    }}
                  />
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "zoneName",
            headerName: t("text.zoneName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "zoneCode",
            headerName: t("text.zoneCode"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "isActive",
            headerName: t("text.Status"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => [
              <Stack direction="row" spacing={1}>
                {params.row.isActive ? (
                  <Chip
                    label={t("text.Active")}
                    color="success"
                    style={{ fontSize: "14px" }}
                  />
                ) : (
                  <Chip
                    label={t("text.InActive")}
                    color="error"
                    style={{ fontSize: "14px" }}
                  />
                )}
              </Stack>,
            ],
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



  const validationSchema = Yup.object({

    zoneName: Yup.string().test(
      'required',
      t('text.reqZoneName'),
      function (value: any) {
        return value && value.trim() !== '';
      }
    ),
  });

  const requiredFields = ['zoneName'];

  const formik = useFormik({
    initialValues: {
      zoneID: -1,
      zoneName: "",
      zoneCode: "",
      sortOrder: 0,
      isActive: true,
      user_ID: Userid,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.zoneID = editId;
      const response = await api.post(
        `Zone/AddUpdateZonemaster`,
        values
      );
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        formik.setFieldValue("zoneName", "");
        formik.setFieldValue("zoneCode", "");
        fetchZonesData();
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);

      }

    }
  });

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
          marginTop: "3vh"
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",

          }}
          style={{ padding: "10px", }}
        >
          <ConfirmDialog />

          <Grid container spacing={2}>
            <InputModeProvider>
              <Grid item md={10} >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
                >
                  {t("text.zoneMaster")}
                </Typography>
              </Grid>

              <Grid item md={2} sx={{ padding: "20px" }}>
                <InputModeSelector />
              </Grid>
{/* 
              <Divider /> */}

              <Box height={10} />

              <form onSubmit={formik.handleSubmit} style={{ marginLeft: "20px" }}>
                <Grid item xs={12} container spacing={3}>

                  <Grid xs={5} sm={5} item>
                    <EnglishToHindiConverter
                      fieldname1="zoneName"
                      fieldname2="zoneName"
                      textFieldLabel={<CustomLabel text={t("text.enterZoneName")} required={requiredFields.includes('zoneName')} />}
                      value={formik.values.zoneName}
                      englishPlaceholder={t("text.enterZoneName")}
                      hindiPlaceholder={t("text.enterZoneName")}
                      size="small"
                      fullWidth={true}
                      onChange={(text: any) => handleConversionChange("zoneName", text)}
                    />
                    {formik.touched.zoneName && formik.errors.zoneName ? (
                      <div style={{ color: "red", margin: "5px" }}>{formik.errors.zoneName}</div>
                    ) : null}

                  </Grid>

                  <Grid item xs={5} sm={5}>
                    <EnglishToHindiConverter
                      fieldname1="zoneCode"
                      fieldname2="zoneCode"
                      textFieldLabel={<CustomLabel text={t("text.enterZoneCode")} />}
                      value={formik.values.zoneCode}
                      englishPlaceholder={t("text.enterZoneCode")}
                      hindiPlaceholder={t("text.enterZoneCode")}
                      size="small"
                      fullWidth={true}
                      // style={{ backgroundColor: "white" }}
                      onChange={(text: any) => handleConversionChange("zoneCode", text)}
                    // onBlur={formik.handleBlur}
                    />

                  </Grid>


                  <Grid item xs={2} sx={{ m: -1 }}>
                    {/* {permissionData?.isAdd == true ? ( */}



                    <ButtonWithLoader buttonText={editId == -1 ? t("text.save") : t("text.update")} onClickHandler={handleSubmitWrapper} fullWidth={true} />
                    {/* ) : ( */}
                    {/*   "" */}
                    {/* )} */}

                  </Grid>
                </Grid>
              </form>
            </InputModeProvider>

          </Grid>

          <br/>
          <Divider/>
          <br/>

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
              rows={zones}
              columns={adjustedColumns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              initialPageSize={5}
            />)}
        </Paper>
      </Card>
      <ToastApp />

    </>
  );
}