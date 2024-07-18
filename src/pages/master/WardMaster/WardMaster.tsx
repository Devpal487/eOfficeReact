import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
  Grid,
  Card,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import {getISTDate, getId} from '../../../utils/Constant' 
import TranslateTextField from "../../../TranslateTextField";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function WardMaster() {
  const UserId = getId();
  const { defaultValuestime } = getISTDate();
  const { t } = useTranslation();
  const [rows, setRows] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ZoneOption, setZoneOption] = useState([{ value: "-1", label: t("text.SelectZone") }]);
  const [editId, setEditId] = useState(-1);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");
  const location = useLocation();

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
            if (pathrow) {
              setPermissionData(pathrow);
              getList();
            }
          }
        }
      }
    }
    getVehicleZone();
  }, [isLoading]);



  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {

    console.log('checkvalue', value)

    const collectData = {
      wardID: value.wardID,
      wardName: value.wardName,
      zoneID: value.zoneID,
      wardCode: value.wardCode,
      isActive: event.target.checked,
      user_ID: value.user_ID,
      sortOrder: value.sortOrder,
      createdDt: defaultValuestime,
      modifyDt: defaultValuestime,
      zoneName: value.zoneName,
    };
    api
      .post(`Ward/AddUpdateWardmaster`, collectData)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          getList();
        } else {
          toast.error(response.data.mesg);
        }
      });
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      wardID: delete_id,
      user_ID: UserId,
    };

    api
      .delete(`Ward/DeleteWardmaster`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        getList();
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

  const getList = () => {
    let collectData;
    if(UserId == 1){
    collectData = {
      "wardID": -1,
      "zoneID": -1,
      "user_ID": "-1",
    };}else{
      collectData = {
        "wardID": -1,
        "zoneID": -1,
        "user_ID": UserId,
      };
    }
    try {
      api
        .post(`Ward/GetWardmaster`, collectData)
        .then((res) => {
          const data = res.data.data;
          const arr = data.map((item: any, index: any) => ({
            ...item,
            serialNo: index + 1,
            id: item.wardID,
          }));
          setRows(arr);
          setIsLoading(false);


          if (data.length > 0) {
            const columns: GridColDef[] = [
              {
                field: "actions",
                headerName: t("text.Action"),
                headerClassName: "MuiDataGrid-colCell",
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
                headerClassName: "MuiDataGrid-colCell",
              },

              {
                field: "zoneName",
                headerName: t("text.zoneName"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "wardName",
                headerName: t("text.wardName"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "wardCode",
                headerName: t("text.wardCode"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
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
                        // label="InActive"
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
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("wardName", row.wardName);
    formik.setFieldValue("wardCode", row.wardCode);
    formik.setFieldValue("zoneID", row.zoneID);

    setEditId(row.id);
  };

  const getVehicleZone = () => {
    const collectData = {
      zoneID: -1,
      user_ID:(UserId),
      isActive: true
    };
    api
      .post(`Zone/GetZonemaster`, collectData)
      .then((res) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["zoneName"],
            value: res.data.data[index]["zoneID"]
          });
        }
        setZoneOption(arr);
      });
  };

  const validationSchema = Yup.object({
    zoneID: Yup.string().test(
      'required',
      t('text.reqZoneName'),
      function (value: any) {
        return value && value.trim() !== '';
      }),
    wardName: Yup.string().test(
      'required',
      t('text.reqWard'),
      function (value: any) {
        return value && value.trim() !== '';
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      "wardID": -1,
      "wardName": "",
      "wardCode": "",
      "zoneID": "",
      "isActive": true,
      "sortOrder": 0,
      "createdDt": defaultValuestime,
      "modifyDt": defaultValuestime,
      "user_ID": UserId,
      "zoneName": ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.wardID = editId;

      const response = await api.post(
        `Ward/AddUpdateWardmaster`,
        values
      );
      if (response.data.isSuccess == true) {
        toast.success(response.data.mesg);
        formik.resetForm();
        setEditId(-1);
        getList();
      } else {
        toast.error(response.data.mesg);
      }
    }
  });

  const requiredFields = ["zoneID", "wardName"];

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  return (
    <>

      <Card
        style={{
          width: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #2B4593 ",
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

         <Grid item xs={12} container spacing={2}>
            <Grid item lg={10} md={10} xs={12}>
            <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.wardMaster")}
          </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}>
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

          <Box height={10} />
          

          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={3}>

              <Grid xs={3} sm={3} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ZoneOption}
                  value={
                    ZoneOption.find(
                      (option: any) => option.value === formik.values.zoneID
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("zoneID", newValue?.value);
                    formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("zoneID", true);
                    formik.setFieldTouched("zoneID", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={<CustomLabel text={t("text.SelectZoneName")} required={requiredFields.includes('zoneID')} />} />
                  )}
                />

                {formik.touched.zoneID && formik.errors.zoneID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.zoneID}
                  </div>
                ) : null}

              </Grid>

              <Grid xs={3.5} sm={3.5} item>
                
              <TranslateTextField
                  label={t("text.enterWardName")}
                  value={formik.values.wardName}
                  onChangeText={(text: string) => handleConversionChange('wardName', text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.wardName && formik.errors.wardName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.wardName}
                  </div>
                ) : null}

              </Grid>

              <Grid xs={3.5} sm={3.5} item>
                <TextField
                  type="text"
                  value={formik.values.wardCode}
                  name="wardCode"
                  id="wardCode"
                  label={<CustomLabel text={t("text.enterWardCode")} />}
                  placeholder={t("text.enterWardCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>


              <Grid item xs={2} sx={{ m: -1 }}>
                {/*  {permissionData?.isAdd == true ? ( */}

                {/* <ButtonWithLoader buttonText={editId == -1 ? t("text.save") : t("text.update")} onClickHandler={handleSubmitWrapper} fullWidth={true}  /> */}
                {/* ) : ( */}
                {/*   "" */}
                {/* )} */}

                {editId === -1 && permissionData?.isAdd && (
  <ButtonWithLoader
    buttonText={t("text.save")}
    onClickHandler={handleSubmitWrapper}
    fullWidth={true}
  />
)}

{editId !== -1 && (
  <ButtonWithLoader
    buttonText={t("text.update")}
    onClickHandler={handleSubmitWrapper}
    fullWidth={true}
  />
)}
              </Grid>
            </Grid>
          </form>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>

          <CustomDataGrid
            isLoading={isLoading}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />

        </Paper>
      </Card>


      <ToastApp />
    </>
  );
}
