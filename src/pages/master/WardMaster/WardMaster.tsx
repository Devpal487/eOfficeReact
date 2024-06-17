import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Grid,
  Card
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function WardMaster() {
  const UserId = getId();
  const defaultValuestime = getISTDate();
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
  }, [isLoading]);

  useEffect(() => {
    getVehicleZone();
  }, []);


  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {

    console.log('checkvalue',value)

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

  // Delete Action Option

  let delete_id = "";

  const accept = () => {
    const collectData = {
      wardID: delete_id,
      user_ID: UserId,
    };
    console.log("collectData " + JSON.stringify(collectData));
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
    // console.log(del_id + " del_id ");
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
    const collectData = {
      "wardID": -1,
      "zoneID": -1,
      "user_ID": UserId,
      // "isActive": true,
    };
    try {
      api
        .post(`Ward/GetWardmaster`, collectData)
        .then((res) => {
          console.log("result" + JSON.stringify(res.data.data));
          const data = res.data.data;
          const arr = data.map((item: any, index: any) => ({
            ...item,
            serialNo: index + 1,
            id: item.wardID,
          }));
          // console.log(arr);
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
                field: "zoneName",
                headerName: t("text.zoneName"),
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
      // setIsLoading(false);
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
      user_ID: UserId,
      isActive: true
    };
    api
      .post(`Zone/GetZonemaster`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["zoneName"],
            value: res.data.data[index]["zoneID"]
          });
        }
        setZoneOption(arr);
      });
  };

  const requiredFields = ["zoneID", "wardName"];


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
      "zoneID": 0,
      "isActive": true,
      "sortOrder": 0,
      "createdDt": new Date().toISOString().slice(0, 10),
      "modifyDt": new Date().toISOString().slice(0, 10),
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
        // setToaster(false);
        toast.success(response.data.mesg);
        formik.resetForm();
        setEditId(-1);
        getList();

        // navigate("/master/WardMaster");
      } else {
        // setToaster(true);
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
            "& .MuiDataGrid-colCell": {
              backgroundColor: "#2B4593",
              color: "#fff",
              fontSize: 17,
              fontWeight: 900
            },
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
            {t("text.wardMaster")}
          </Typography>
          <Divider />

          {/* Search and ADD buttone Start */}
          <Box height={10} />
          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true ? (
                <Button
                  onClick={routeChangeAdd}
                  variant="contained"
                  endIcon={<AddCircleIcon />} 
                  size="large"
                >
                  {t("text.add")}
                </Button>
              ) : (
                ""
              )} */}
            {/* {permissionData?.isPrint == true ? (
                <Button variant="contained" 
                endIcon={<PrintIcon />}
                size="large">
                  {t("text.print")}
                </Button>
              ) : (
                ""
              )} */}
          </Stack>

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
                    <TextField {...params} label={<CustomLabel text={t("text.SelectZoneName")} required={requiredFields.includes('zoneName')} />} />
                  )}
                />

                {formik.touched.zoneName && formik.errors.zoneName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.zoneName}
                  </div>
                ) : null}

              </Grid>

              <Grid xs={3} sm={3} item>
                <TextField
                  type="text"
                  name="wardName"
                  id="wardName"
                  label={<CustomLabel text={t("text.enterWardName")} required={requiredFields.includes('enterWardName')} />}
                  value={formik.values.wardName}
                  placeholder={t("text.enterWardName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", borderColor: formik.touched.wardName && formik.errors.wardName ? 'red' : 'initial', }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.wardName && formik.errors.wardName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.wardName}
                  </div>
                ) : null}

              </Grid>

              <Grid xs={3} sm={3} item>
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


              <Grid item xs={3} sx={{ m: -1 }}>
                {/*  {permissionData?.isAdd == true ? ( */}

                <ButtonWithLoader  buttonText={editId == -1 ? t("text.save") : t("text.update")} onClickHandler={handleSubmitWrapper} />
                {/* ) : ( */}
                {/*   "" */}
                {/* )} */}
              </Grid>
            </Grid>
          </form>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>


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
            <Box>
              <br></br>
              <div style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  autoHeight
                  slots={{
                    toolbar: GridToolbar,
                  }}
                  rowSpacingType="border"
                  pagination={true}
                  pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                    value: size,
                    label: `${size}`,
                  }))}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                />
              </div>
            </Box>)}
        </Paper>
      </Card>

      <ToastApp />
    </>
  );
}
