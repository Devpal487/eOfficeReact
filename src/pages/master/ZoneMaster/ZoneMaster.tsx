import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import axios from "axios";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import ZoneMasterAdd from "./ZoneMasterAdd";
import {getId} from '../../../utils/Constant'; 
import { useFormik } from "formik";
import * as Yup from "yup";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ZoneMaster() {
  // const ID = getId();
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

  const routeChangeAdd = () => {
    let path = `/master/ZoneMasterAdd`;
    navigate(path);
    // setAddPageShow(true);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      zoneID: delete_id,    
      user_ID: ID,
      "isActive": true
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete( `Zone/DeleteZonemaster`, {data:collectData})
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
    // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
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

  const fetchZonesData = async () => {
    try {
      const collectData = {
        zoneID: -1,
        user_ID: ID,
        isActive: true
      };
      const response = await api.post(
         `Zone/GetZonemaster`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index:any) => ({
        ...zone,
        serialNo:index+1,
        id: zone.zoneID,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
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
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "zoneName",
            headerName: t("text.zoneName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "zoneCode",
            headerName: t("text.zoneCode"),
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
      // setLoading(false);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  let ID: any = localStorage.getItem("useR_ID")
  if (ID !== null) {
    ID = ID.replace(/\D/g, '');
    // console.log("useR_ID", parseInt(ID));
  } else {
    toast.error("User ID not Found");
  }


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
      user_ID: parseInt(ID),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.zoneID = editId;
      const response = await api.post(
        `Zone/AddUpdateZonemaster`,
        values
      );
      if (response.data.isSuccess) {
        // setToaster(false);
        toast.success(response.data.mesg);
        formik.resetForm();
        fetchZonesData();
        setEditId(-1);

        // navigate('/master/ZoneMaster');
      } else {
        // setToaster(true);
        toast.error(response.data.mesg);

      }

    }
  });
  
  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
          marginTop:"3vh"
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
              fontWeight:900 
            },
          }}
          style={{ padding: "10px",}}
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

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true && ( */}
              {/* <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
                size="large"
              >
                {t("text.add")}
              </Button> */}
            {/* ) } */}

            {/* {permissionData?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />} size="large">
                {t("text.print")}
              </Button>
            ) : (
              ""
            )} */}
          </Stack>
          <form onSubmit={formik.handleSubmit}>
                                    <Grid item xs={12} container spacing={3}>

                                        <Grid xs={5} sm={5} item>
                                        <TextField
                  id="zoneName"
                  name="zoneName"
                  label={
                    <span>
                      {t("text.enterZoneName")}{requiredFields.includes('zoneName') && (
                        <span style={{ color: formik.values.zoneName ? 'green' : 'red' }}>*</span>
                      )}
                    </span>
                  }
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
                  label={t("text.enterZoneCode")}
                  value={formik.values.zoneCode}
                  placeholder={t("text.enterZoneCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                                            
                                        </Grid>

                                        <Grid item xs={2}>
                                            {/*  {permissionData?.isAdd == true ? ( */}
                                            <Button type="submit" variant="contained" size="large">
                                                {editId == -1 ? t("text.save") : t("text.update")}
                                            </Button>
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
              <Box>
          <br />
          <div style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
            
            <DataGrid
              rows={zones}
              columns={adjustedColumns}
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
