import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
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
import {
  getdivisionId,
  getId,
  getinstId,
  getISTDate,
} from "../../../utils/Constant";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";

export default function LetterType() {
  const { i18n, t } = useTranslation();
  const ID = getId();
  let divId = getdivisionId();
  let instId = getinstId();
  let { defaultValuestime } = getISTDate();
  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState(-1);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<any>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");

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
  }, [isLoading, location.pathname]);

  let delete_id = "";
  const accept = () => {
    const collectData = {
      lId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`LetterType/DeleteLetterType`, { data: collectData })
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
      lId: -1,
      inst_id: -1,
      user_id: -1,
      divisionid: -1,
    };
    try {
      api.post(`LetterType/GetLetterType`, collectData).then((res: any) => {
        console.log("result" + JSON.stringify(res.data.data));
        const data = res.data.data;
        const arr = data.map((item: any, index: any) => ({
          ...item,
          serialNo: index + 1,
          id: item.lId,
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
              field: "lName",
              headerName: "Letter Name",
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "lNameShortNM",
              headerName: "Short Name",
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
    lName: Yup.string().test(
      "required",
      t("text.reqlName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {
      lId: -1,
      lName: "",
      lNameShortNM: "",
      inst_id: instId,
      user_id: ID,
      createdDate: defaultValuestime,
      divisionid: divId,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.lId = editId;
      console.log("check", values);
      const response = await api.post(`LetterType/AddUpdateLetterType`, values);
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

  const requiredFields = ["lName"];

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("lName", row.lName);
    formik.setFieldValue("lNameShortNM", row.lNameShortNM);

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
            }}
            style={{ padding: "10px" }}
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
                  {t("text.LetterType")}
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
              <Grid item xs={12} container spacing={2}>
                <Grid xs={5} sm={5} item>
                  <TranslateTextField
                    label={t("text.letterName")}
                    value={formik.values.lName}
                    onChangeText={(text: string) =>
                      handleConversionChange("lName", text)
                    }
                    required={true}
                    lang={lang}
                  />

                  {formik.touched.lName && formik.errors.lName ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.lName}
                    </div>
                  ) : null}
                </Grid>

                <Grid item xs={5} sm={5}>
                  <TextField
                    id="lNameShortNM"
                    type="text"
                    label={<CustomLabel text={t("text.letterShortName")} />}
                    placeholder={t("text.letterShortName")}
                    value={formik.values.lNameShortNM}
                    size="small"
                    name="lNameShortNM"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>

                <Grid item xs={2} sx={{ m: -1 }}>
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
