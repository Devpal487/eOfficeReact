import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Button,
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
import ReusableFormSection from "../../../ReusableFormSection";
import LanguageSelector from "../../../LanguageSelector";
import TextConverter from "../../../TextConverter";
import CustomDataGrid from "../../../utils/CustomDatagrid";
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

  const [selectedLang, setSelectedLang] = useState<string>('English');
  const [inputValue, setInputValue] = useState<string>('');

  const [language, setLanguage] = useState('English');

  let navigate = useNavigate();
  const { t } = useTranslation();


  const handleLangChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLang(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input value based on the selected language
    setInputValue(selectedLang.toLowerCase().startsWith('hi') ? convertToHindi(event.target.value) : event.target.value);
  };

  const convertToHindi = (text: string): string => {
    // Your conversion logic from English to Hindi here
    return text;
  };


  useEffect(() => {
    // const dataString = localStorage.getItem("userdata");
    //   if (dataString) {
    //     const data = JSON.parse(dataString);
    //     if (data && data.length > 0) {
    //       const userPermissionData = data[0]?.userPermission;
    //       if (userPermissionData && userPermissionData.length > 0) {
    //         const menudata = userPermissionData[0]?.parentMenu;
    //         for (let index = 0; index < menudata.length; index++) {
    //           const childMenudata = menudata[index]?.childMenu;
    //           const pathrow = childMenudata.find(
    //             (x: any) => x.path === location.pathname
    //           );
    //           console.log("data", pathrow);
    //           if (pathrow) {
    //             setPermissionData(pathrow);
    fetchZonesData();
    //         }
    //       }
    //     }
    //   }
    // }
  }, [isLoading]);


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
      user_ID: -1,
      sortOrder: 0,
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
    formik.setFieldValue("zoneName", row.zoneName);
    formik.setFieldValue("zoneCode", row.zoneCode);

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
        isActive: true
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
                  {/* {permissionData?.isEdit ? ( */}
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  />
                  {/* ) : (
                    ""
                  )}
                  {permissionData?.isDel ? ( */}
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
                  {/* ) : (
                    ""
                  )} */}
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
        formik.resetForm();
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

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.zoneMaster")}
          </Typography>
          <Divider />

          <Box height={10} />
          <div>
            <LanguageSelector onLanguageChange={setLanguage} />
            <TextConverter selectedLanguage={language} />
          </div>

          <Stack direction="row" spacing={2} classes="my-2 mb-2">

          </Stack>

          <ReusableFormSection
            radioGroupId="langSelect"
            defaultValue={selectedLang}
            onLangChange={handleLangChange}
          />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />

          <Grid sm={4} md={4} xs={12}>
            <FormControl
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginTop: "13px",
                marginLeft: "12px",
              }}
            >
              <Grid>
                <FormLabel>Type</FormLabel>
              </Grid>
              <Grid>
                <RadioGroup
                  row
                  id="rblLang"
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue="English"
                >
                  <FormControlLabel
                    value="English"
                    control={<Radio />}
                    label="English"
                  />
                  <FormControlLabel
                    value="Hindi"
                    control={<Radio />}
                    label="Hindi"
                  />
                </RadioGroup>
              </Grid>
            </FormControl>
          </Grid>

          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={3}>

              <Grid xs={5} sm={5} item>
                <TextField
                  id="zoneName"
                  name="zoneName"
                  label={<CustomLabel text={t("text.enterZoneName")} required={requiredFields.includes('zoneName')} />}
                  value={formik.values.zoneName}
                  placeholder={t("text.enterZoneName")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: 'white',
                    borderColor: formik.touched.zoneName && formik.errors.zoneName ? 'red' : 'initial',
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.zoneName && formik.errors.zoneName ? (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.zoneName}</div>
                ) : null}

              </Grid>

              <Grid item xs={5} sm={5}>
                <TextField
                  id="zoneCode"
                  name="zoneCode"
                  label={<CustomLabel text={t("text.enterZoneCode")} />}
                  value={formik.values.zoneCode}
                  placeholder={t("text.enterZoneCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

              </Grid>


              <Grid item xs={2} sx={{ m: -1 }}>
                {/*  {permissionData?.isAdd == true ? ( */}

                <ButtonWithLoader buttonText={editId == -1 ? t("text.save") : t("text.update")} onClickHandler={handleSubmitWrapper} fullWidth={true}/>
                {/* ) : ( */}
                {/*   "" */}
                {/* )} */}
              </Grid>
            </Grid>
          </form>

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
