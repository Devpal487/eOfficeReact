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
import { getISTDate, getId } from "../../../utils/Constant";
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


export default function Jurisdiction() {
  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();
  const userId = getId();
  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState<any>(-1);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [fileTypeOption, setFileTypeOption] = useState([{ value: "-1", label: t("text.SelectFileType") }]);

  const [NodeOption, setNodeOption] = useState([{ value: "-1", label: t("text.SelectNode") }]);

  const [permissionData, setPermissionData] = useState<any>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });


  const getNode = () => {
    const collectData = {
      "id": -1,
      "nodeID": -1,
      "titleID": -1,
      "user_Id": ""
    };
    api
      .post(`NewNodeMaster/GetNewNodeMaster`, collectData)
      .then((res) => {
        const arr = res.data.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setNodeOption(arr);
      });
  };




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
            console.log("childMenudata", childMenudata);
            console.log("location.pathname", location.pathname);

            const pathrow = childMenudata.find(
              (x: any) => x.path === location.pathname
            );
            if (pathrow) {
              console.log("data", pathrow);
              setPermissionData(pathrow);
              getList();
              break;
            }
          }
        }
      }
    }

  }, [location.pathname]);
  
  console.log("permissionData", permissionData?.isAdd);

  useEffect(()=>{
  getNode();
},[])

  let delete_id = "";
  const accept = () => {
    const collectData = {
      id: delete_id,
    };
    // console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`NewNodeMaster/DeleteNewNodeMaster`, { data: collectData })
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
      "id": -1,
      "nodeID": -1,
      "titleID": -1,
      "user_Id": ""
    };
    try {
      api
        .post(`NewNodeMaster/GetNewNodeMaster`, collectData)
        .then((res) => {
          // console.log("result" + JSON.stringify(res.data.data));
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
                field: "nodeName",
                headerName: "Node ",
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "name",
                headerName: "Jurisdiction",
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
    nodeID: Yup.string().test(
      "required",
      "Select Node Required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });
  const [toaster, setToaster] = useState(false);
  const formik = useFormik({
    initialValues: {

      "id": -1,
      "nodeID": 0,
      "name": "",
      "titleID": 0,
      "user_Id": userId,
      "childnode": []
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.id = editId;
      // console.log("check", values);

      const response = await api.post(
        `NewNodeMaster/AddUpdateNewNodeMaster`,
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

  const requiredFields = ["nodeID"];


  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("nodeID", row.nodeID);
    formik.setFieldValue("name", row.name);

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
              {t("text.JurisdictionMaster")}
            </Typography>
            <Divider />

            <Box height={10} />

            <form onSubmit={formik.handleSubmit}>
              <Grid item xs={12} container spacing={3}>

                <Grid xs={5} sm={5} item>

                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={NodeOption}
                    value={
                      NodeOption.find(
                        (option: any) => option.value === formik.values.nodeID) || null
                    }
                    fullWidth
                    size="small"
                    onChange={(event, newValue: any) => {
                      console.log(newValue?.value);

                      formik.setFieldValue("nodeID", newValue?.value);
                      formik.setFieldTouched("nodeID", true);
                      formik.setFieldTouched("nodeID", false);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<CustomLabel text={t("text.SelectNode")} required={requiredFields.includes('nodeID')} />}
                      />
                    )}
                  />

                  {formik.touched.nodeID && formik.errors.nodeID ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.nodeID}
                    </div>
                  ) : null}
                </Grid>

                <Grid item xs={5} sm={5}>
                  <TextField
                    type="text"
                    name="name"
                    id="name"
                    label={<CustomLabel text={t("text.EnterJurisdictionName")} required={requiredFields.includes('name')} />}
                    value={formik.values.name}
                    placeholder={t("text.EnterJurisdictionName")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white", borderColor: formik.touched.name && formik.errors.name ? 'red' : 'initial', }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.name}
                    </div>
                  ) : null}
                </Grid>

                <Grid item xs={2}>
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
