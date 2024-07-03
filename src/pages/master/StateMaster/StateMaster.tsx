import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function StateMaster() {
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [editId, setEditId] = useState(-1);
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  let navigate = useNavigate();

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
            console.log("data", pathrow);
            if (pathrow) {
              setPermissionData(pathrow);
              fetchZonesData();
            }
          }
        }
      }
    }
    getCountryName();
  }, [isLoading]);


  const getCountryName = () => {
    const collectData = {
      countryId: -1,
    };
    api
      .post(`Country/GetCountryMaster`, collectData)
      .then((res) => {
        const arr = [];
        //console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["countryName"],
            value: res.data.data[index]["countryId"],
          });
        }
        setOption(arr);
      });
  };

  const validationSchema = Yup.object({
    countryName: Yup.string().test(
      'required',
      t('text.reqcountryName'),
      function (value: any) {
        return value && value.trim() !== '';
      }),
    stateName: Yup.string().test(
      'required',
      t('text.reqstateName'),
      function (value: any) {
        return value && value.trim() !== '';
      }
    ),
  });


  const formik = useFormik({
    initialValues: {
      stateId: -1,
      stateName: "",
      stateCode: "",
      countryId: "",
      countryName: "",
      createdBy: "",
      updatedBy: "",
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.stateId = editId;

      const response = await api.post(
        `State/AddUpdateStateMaster`,
        values
      );
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        fetchZonesData();
        formik.resetForm();
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ['stateName', "countryName"];


  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("stateName", row.stateName);
    formik.setFieldValue("stateCode", row.stateCode);
    formik.setFieldValue("countryId", row.countryId);

    setEditId(row.id);
  };

  const routeChangeAdd = () => {
    let path = `/master/StateMasterAdd`;
    navigate(path);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      stateId: delete_id,
      countryId: 0,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`State/DeleteState`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          fetchZonesData();
        } else {
          toast.error(response.data.mesg);
        }
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
        stateId: -1,
        countryId: -1
      };
      const response = await api.post(
        `State/GetStateMaster`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.stateId,
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
                  {/* <Switch
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
                  /> */}
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
            field: "stateName",
            headerName: t("text.StateName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "stateCode",
            headerName: t("text.StateCode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "countryName",
            headerName: t("text.CountryName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          // {
          //   field: "isActive",
          //   headerName: t("text.Status"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   renderCell: (params) => [
          //     <Stack direction="row" spacing={1}>
          //       {params.row.isActive ? (
          //         <Chip
          //           label={t("text.Active")}
          //           color="success"
          //           style={{ fontSize: "14px" }}
          //         />
          //       ) : (
          //         <Chip
          //           label={t("text.InActive")}
          //           color="error"
          //           style={{ fontSize: "14px" }}
          //         />
          //       )}
          //     </Stack>,
          //   ],
          // },
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

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
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
            {t("text.StateMaster")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true && (
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
                size="large"
              >
                {t("text.add")}
              </Button>
            ) } */}

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

              <Grid xs={3} sm={3} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  value={
                    option.find(
                      (option: any) => option.value === formik.values.countryId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    console.log(newValue);

                    formik.setFieldValue("countryId", newValue?.value);
                    formik.setFieldValue("countryName", newValue?.label);
                    // formik.setFieldTouched("zoneID", true); 
                  }}
                  renderInput={(params) => (
                    <TextField {...params}
                      label={<CustomLabel text={t("text.SelectCountryName")} required={requiredFields.includes('countryName')} />} />)}
                />
                {formik.touched.countryName && formik.errors.countryName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.countryName}
                  </div>
                ) : null}

              </Grid>

              <Grid item xs={3.5} sm={3.5}>
                <TextField
                  label={<CustomLabel text={t("text.EnterStateName")} required={requiredFields.includes('stateName')} />}
                  value={formik.values.stateName}
                  name="stateName"
                  id="stateName"
                  placeholder={t("text.EnterStateName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.stateName && formik.errors.stateName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.stateName}
                  </div>
                ) : null}

              </Grid>

              <Grid xs={3.5} sm={3.5} item>
                <TextField
                  label={<CustomLabel text={t("text.EnterStateCode")} />}
                  value={formik.values.stateCode}
                  name="stateCode"
                  id="stateCode"
                  placeholder={t("text.EnterStateCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>


              <Grid item xs={2} sx={{ m: -1 }}>
                {/*  {permissionData?.isAdd == true ? ( */}

                <ButtonWithLoader buttonText={editId == -1 ? t("text.save") : t("text.update")} onClickHandler={handleSubmitWrapper} fullWidth={true} />
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
};