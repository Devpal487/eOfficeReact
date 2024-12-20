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
import axios from "axios";
import CustomLabel from "../../../CustomLable";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import TranslateTextField from "../../../TranslateTextField";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function AuthorityMaster() {
  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();

  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState<any>("-1");
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>("en");

  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  useEffect(() => {
    getIP();
  }, []);

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

  const getIP = () => {
    axios.get("http://ipinfo.io").then((res: any) => {
      formik.setFieldValue("ipAddress", res.data.ip);
    });
  };

  let delete_id = "";
  const accept = () => {
    const collectData = {
      id: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`AuthorityMaster/DeleteAuthorityMaster`, { data: collectData })
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
      id: -1,
      officeId: -1,
      under_id: -1,
      divisionid: -1,
    };
    try {
      api
        .post(`AuthorityMaster/GetAuthorityMaster`, collectData)
        .then((res) => {
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
                field: "authorityType",
                headerName: t("text.AuthorityType"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "remark",
                headerName: t("text.Remark"),
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
    authorityType: Yup.string().test(
      "required",
      t("text.reqAuthorityType"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });
  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: -1,
      authorityType: "",
      remark: "",
      uploadDate: defaultValuestime,
      ipAddress: "",
      officeId: 0,
      under_id: 0,
      divisionid: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.id = editId;
      // console.log("check", values);

      const response = await api.post(
        `AuthorityMaster/AddUpdateAuthorityMaster`,
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

  const requiredFields = ["authorityType"];

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("authorityType", row.authorityType);
    formik.setFieldValue("remark", row.remark);
    setEditId(row.id);
  };

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
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

            <Grid item xs={12} container spacing={1}>
              <Grid item lg={10} md={10} xs={12}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
                >
                  {t("text.AuthorityMaster")}
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
              {toaster === false ? "" : <ToastApp />}
              <Grid item xs={12} container spacing={3}>
                <Grid xs={5} sm={5} item>
                <TranslateTextField
                  label={t("text.EnterAuthorityType")}
                  value={formik.values.authorityType}
                  onChangeText={(text: string) => handleConversionChange('authorityType', text)}
                  required={true}
                  lang={lang}
                />
                  {formik.touched.authorityType &&
                  formik.errors.authorityType ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.authorityType}
                    </div>
                  ) : null}
                </Grid>

                <Grid item xs={5} sm={5}>
                <TranslateTextField
                  label={t("text.Remark")}
                  value={formik.values.remark}
                  onChangeText={(text: string) => handleConversionChange('remark', text)}
                  required={false}
                  lang={lang}
                />
                </Grid>

                <Grid item xs={2} sx={{ m: -1 }}>
                  {editId === "-1" && permissionData?.isAdd && (
                    <ButtonWithLoader
                      buttonText={t("text.save")}
                      onClickHandler={handleSubmitWrapper}
                      fullWidth={true}
                    />
                  )}

                  {editId !== "-1" && (
                    <ButtonWithLoader
                      buttonText={t("text.update")}
                      onClickHandler={handleSubmitWrapper}
                      fullWidth={true}
                    />
                  )}
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
