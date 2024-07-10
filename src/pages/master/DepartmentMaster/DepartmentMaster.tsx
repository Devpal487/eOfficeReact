import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { getISTDate } from "../../../utils/Constant";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function DepartmentMaster() {
  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();

  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState<any>(-1);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
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
  }, [isLoading]);

  let delete_id = "";
  const accept = () => {
    const collectData = {
      departmentId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`Department/DeleteDepartmentmaster`, { data: collectData })
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
    const collectData = {
      "departmentId": -1,
      "departmentName": ""
    };
    try {
      api
        .post(`Department/GetDepartmentmaster`, collectData)
        .then((res) => {
          console.log("result" + JSON.stringify(res.data.data));
          const data = res.data.data;
          const arr = data.map((item: any, index: any) => ({
            ...item,
            serialNo: index + 1,
            id: item.departmentId,
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
                  console.log("Is Edit Allowed:", permissionData?.isEdit);
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
                field: "departmentName",
                headerName: t("text.deptName"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "departmentShortname",
                headerName: t("text.ShortName"),
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
  const validationSchema = Yup.object({
    departmentName: Yup.string().test(
      "required",
      t("text.reqdeptName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });
  const [toaster, setToaster] = useState(false);
  const formik = useFormik({
    initialValues: {

      "departmentId": -1,
      "departmentName": "",
      "departmentShortname": "",
      "createdBy": "admin",
      "updatedBy": "admin",
      "createdOn": defaultValuestime,
      "updatedOn": defaultValuestime
      

    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.departmentId = editId;

      const response = await api.post(
        `Department/AddUpdateDepartmentmaster`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        formik.resetForm();
        getList();
        setEditId("-1");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }

    },
  });

  const requiredFields = ["departmentName"];


  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("departmentName", row.departmentName);
    formik.setFieldValue("departmentShortname", row.departmentShortname);
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
                backgroundColor: "#2B4593",
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
              {t("text.deptMaster")}
            </Typography>
            <Divider />

            <Box height={10} />
           
            <form onSubmit={formik.handleSubmit}>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    id="departmentName"
                    name="departmentName"
                    label={<CustomLabel text={t("text.enterdeptName")} required={requiredFields.includes('departmentName')} />}
                    value={formik.values.departmentName}
                    placeholder={t("text.enterdeptName")}
                    size="small"
                    fullWidth
                    style={{
                      backgroundColor: 'white',
                      borderColor: formik.touched.departmentName && formik.errors.departmentName ? 'red' : 'initial',
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.departmentName && formik.errors.departmentName ? (
                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.departmentName}</div>
                  ) : null}
                </Grid>


                <Grid item xs={4}>
                  <TextField
                    id="departmentShortname"
                    name="departmentShortname"
                    label={<CustomLabel text={t("text.enterdeptCode")} />}
                    value={formik.values.departmentShortname}
                    placeholder={t("text.enterdeptCode")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={2}  sx={{m:-1}}>
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
            {/* </Grid> */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            {/* </Stack> */}
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
