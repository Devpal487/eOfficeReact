import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { getISTDate } from "../../../utils/Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function StatusMaster() {
  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();

  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState<any>(-1);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [FileOption, setFileOption] = useState<any>([
    { value: "-1", label: t("text.SelectDepartment") },
  ]);

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectStateName") },
  ]);

  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

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
              getList();
            }
          }
        }
      }
    }
    getDepartment();
  }, []);

  const getDepartment = () => {
    const collectData = {
      departmentId: -1,
      departmentName: "",
    };
    api.post(`Department/GetDepartmentmaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.departmentName,
        value: item.departmentId,
      }));
      setFileOption(arr);
    });
  };

  let delete_id = "";
  const accept = () => {
    const collectData = {
      id: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`SectionMaster/DeleteSectionMaster`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          getList();
        } else {
          toast.error(response.data.mesg);
        }
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

  const getList = () => {
    const collectData = {
      id: -1,
      department: "",
      section: "",
      instid: -1,
      sesid: "",
      uid: "",
    };
    try {
      api.post(`SectionMaster/GetSectionMaster`, collectData).then((res) => {
        console.log("result" + JSON.stringify(res.data.data));
        const data = res.data.data;
        const arr = data.map((item: any, index: any) => ({
          ...item,
          serialNo: index + 1,
          id: item.id,
        }));
        setRows(arr);
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
              field: "department",
              headerName: t("text.Department"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },

            {
              field: "section",
              headerName: t("text.Section"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
          ];
          setColumns(columns as any);
        }
      });
      // setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setIsLoading(false);
    }
  };

  const [toaster, setToaster] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: -1,
      department: "",
      section: "",
      instid: 0,
      sesid: "",
      uid: "",

      // cityId: -1,
      // cityName: "",
      // stateId: "",

      // createdOn: defaultValuestime,
      // updatedOn: defaultValuestime,
      // createdBy: "-1",
      // updatedBy: "-1",
    },

    onSubmit: async (values) => {
      values.id = editId;
      // console.log("check", values);

      const response = await api.post(
        `SectionMaster/AddUpdateSectionMaster`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        formik.resetForm();
        getList();
        setEditId(-1);
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [];

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("department", row.department);
    formik.setFieldValue("section", row.section);

    setEditId(row.id);
  };

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593 ",
            marginTop: "5px",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              "& .MuiDataGrid-colCell": {
                backgroundColor: "#00009C",
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
              },
            }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog />
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ padding: "20px" }}
              align="left"
            >
              {t("text.StatusMaster")}
            </Typography>
            <Divider />

            <Box height={10} />

            <form onSubmit={formik.handleSubmit}>
              <Grid item xs={12} container spacing={3}>
                <Grid xs={5} sm={5} item>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={FileOption}
                    value={
                      FileOption.find(
                        (option: any) =>
                          option.value + "" === formik.values.department
                      ) || null
                    }
                    fullWidth
                    size="small"
                    onChange={(event, newValue: any) => {
                      console.log(newValue?.value);

                      formik.setFieldValue("department", newValue?.value + "");

                      formik.setFieldTouched("department", true);
                      formik.setFieldTouched("department", false);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <CustomLabel text={t("text.SelectDepartment")} />
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={5} sm={5}>
                  <TextField
                    id="section"
                    name="section"
                    label={<CustomLabel text={t("text.Status")} />}
                    value={formik.values.section}
                    placeholder={t("text.Status")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>

                <Grid item xs={2} >
                  {/*  {permissionData?.isAdd == true ? ( */}
                  {/* <Button type="submit" variant="contained" size="large">
                    {editId == "-1" ? t("text.save") : t("text.update")}
                  </Button> */}

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
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                initialPageSize={5}
              />
            )}
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}