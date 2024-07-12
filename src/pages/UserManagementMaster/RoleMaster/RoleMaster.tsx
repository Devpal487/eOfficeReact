import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HOST_URL from "../../../utils/Url";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import { getId } from '../../../utils/Constant';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import CustomDataGrid from "../../../utils/CustomDatagrid";


const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "90vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  overflowX: "auto",
};

function createData(
  srno: number,
  id: string,
  roleName: string,
  rolePermission: string
): any {
  return { srno, id, roleName, rolePermission };
}

function childMenuCreateData(
  roleId: string,
  menuId: string,
  menuName: string,
  parentId: number,
  // pageUrl: string,
  // icon: string,
  // displayNo: number,
  //isMenu: boolean,
  isAdd: boolean,
  isEdit: boolean,
  isDel: boolean,
  isView: boolean,
  isPrint: boolean,
  isExport: boolean,
  isRelease: boolean,
  isPost: boolean
): any {
  return {
    roleId,
    menuId,
    menuName,
    // pageUrl,
    // icon,
    // displayNo,
    // isMenu,
    isAdd,
    isEdit,
    isDel,
    isView,
    isPrint,
    isExport,
    isRelease,
    isPost,
    parentId,
  };
}

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function RoleMaster() {
  const ID = getId();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<any>([]);
  const [records, setRecords] = useState(rows);
  const [childMenuRecords, setChildMenuRecords] = useState(rows);
  const [enteredrolename, setEnteredrolename] = useState("");
  const [editID, setEditID] = useState("-1");
  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const location = useLocation();
  const { i18n, t } = useTranslation();


  const validationSchema = Yup.object({
    roleName: Yup.string().test(
      "required",
      t("text.reqRoleName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });
  const formik = useFormik({
    initialValues: {
      roleId: "",
      roleName: "",
      user_ID: ID,
      rolePermission: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.rolePermission = childMenuRecords;
      values.roleId = editID;
      const response = await api.post(
        `Auth/AddUpdateRoleMaster`,
        values
      );
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        navigate("/UserManagement/RoleMaster");
        setOpen(false);
        getList();
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ["roleName"];

  let delete_id = "";

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
            }
          }
        }
      }
    }
    getList();
  }, [isLoading]);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setEnteredrolename("");
    setEditID("-1");
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    getModalList();
  };


  const getList = async () => {
    try {
      const collectData = {
        roleId: "-1"
      };
      const response = await api.post(
        `Auth/GetRoleMaster`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.roleId,
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
            field: "roleName",
            headerName: t("text.RoleName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
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

  const getModalList = () => {
    api.post("Menu/GetChildMenuMaster").then((res) => {
      const arr = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push(
          childMenuCreateData(
            "0",
            res.data.data[index]["menuId"],
            res.data.data[index]["menuName"],
            res.data.data[index]["parentId"],
            // res.data.data[index]["pageUrl"],
            // res.data.data[index]["icon"],
            // res.data.data[index]["displayNo"],
            //res.data.data[index]["isMenu"],
            res.data.data[index]["isAdd"],
            res.data.data[index]["isEdit"],
            res.data.data[index]["isDel"],
            res.data.data[index]["isView"],
            res.data.data[index]["isPrint"],
            res.data.data[index]["isExport"],
            res.data.data[index]["isRelease"],
            res.data.data[index]["isPost"]
          )
        );
      }
      // console.log(arr);
      setRows(arr);
      setChildMenuRecords(arr);
      // console.log(records);
    });
  };

  const getRolebyID = (id: any) => {
    const collectData = {
      roleId: id,
    };
    api
      .post("Auth/GetRoleMaster", collectData)
      .then((res) => {
        const arr = [];
        // console.log("result get rolemaster" + JSON.stringify(res.data.data[0]["rolePermission"]));
        for (
          let index = 0;
          index < res.data.data[0]["rolePermission"].length;
          index++
        ) {
          arr.push(
            childMenuCreateData(
              "0",
              res.data.data[0]["rolePermission"][index]["menuId"],
              res.data.data[0]["rolePermission"][index]["menuName"],
              res.data.data[0]["rolePermission"][index]["parentId"],
              // res.data.data[0]["rolePermission"][index]["pageUrl"],
              // res.data.data[0]["rolePermission"][index]["icon"],
              // res.data.data[0]["rolePermission"][index]["displayNo"],
              //res.data.data[0]["rolePermission"][index]["isMenu"],
              res.data.data[0]["rolePermission"][index]["isAdd"],
              res.data.data[0]["rolePermission"][index]["isEdit"],
              res.data.data[0]["rolePermission"][index]["isDel"],
              res.data.data[0]["rolePermission"][index]["isView"],
              res.data.data[0]["rolePermission"][index]["isPrint"],
              res.data.data[0]["rolePermission"][index]["isExport"],
              res.data.data[0]["rolePermission"][index]["isRelease"],
              res.data.data[0]["rolePermission"][index]["isPost"]
            )
          );
        }
        // console.log(arr);
        //setRows(arr);
        setChildMenuRecords(null);
        setChildMenuRecords(arr);
        // console.log("records");
        // console.log(arr);
      });
  };

  const accept = () => {
    const collectData = {
      "roleId": delete_id,
    };
    // console.log(collectData);
    api
      .delete("Auth/DeleteRoleMaster", { data: collectData })
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
    //toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });

  };
  const handledeleteClick = (del_id: any) => {
    // console.log(del_id);
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

  const routeChangeEdit = (row: any) => {
    console.log("🚀 ~ 421 ~ routeChangeEdit ~ row:", row)
    // let path = `/master/TaxMasterEdit`;
    // navigate(path, {
    //   state: row,
    // });
    console.log(row.roleName);

    //getModalList();
    setEditID(row.id);
    setOpen(true);
    getRolebyID(row.id);
    formik.values.roleId = row.id;
    //setEnteredrolename(row.roleName);
    formik.values.roleName = row.roleName;
  };

  /// NExt Page
  let navigate = useNavigate();
  const routeChangeAdd = () => {
    let path = `/master/TaxMasterAdd`;
    // navigate(path);
  };

  const handleSelectAll = (value: string, evnt: any) => {
    // console.log(value)
    // console.log(evnt)
    if (value == "isAdd") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isAdd: evnt,
        }))
      );
    } else if (value == "isEdit") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isEdit: evnt,
        }))
      );
    } else if (value == "isDel") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isDel: evnt,
        }))
      );
    } else if (value == "isView") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isView: evnt,
        }))
      );
    } else if (value == "isPrint") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isPrint: evnt,
        }))
      );
    } else if (value == "isExport") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isExport: evnt,
        }))
      );
    } else if (value == "isRelease") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isRelease: evnt,
        }))
      );
    } else if (value == "isPost") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isPost: evnt,
        }))
      );
    }
  };

  const handleCheckboxChange = (id: any, header: string) => {
    if (header == "isAdd") {
      //   console.log(header)
      // console.log(id)
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isAdd: !item.isAdd } : item
        )
      );
    } else if (header == "isEdit") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isEdit: !item.isEdit } : item
        )
      );
    } else if (header == "isDel") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isDel: !item.isDel } : item
        )
      );
    } else if (header == "isView") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isView: !item.isView } : item
        )
      );
    } else if (header == "isPrint") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isPrint: !item.isPrint } : item
        )
      );
    } else if (header == "isExport") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isExport: !item.isExport } : item
        )
      );
    } else if (header == "isRelease") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isRelease: !item.isRelease } : item
        )
      );
    } else if (header == "isPost") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isPost: !item.isPost } : item
        )
      );
    }
  };

  const numberToBoolean = (num: any) => {
    return num !== 0;
  };
  return (
    <>
      <Grid item lg={6} sm={6} xs={12}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid #00009c",
            marginTop:"5px"
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              "& .MuiDataGrid-colCell": {
                backgroundColor: "#00009C",
                color: "#fff",
                fontSize: 17,
                fontWeight: 900
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
              {t("text.RoleMaster")}
            </Typography>
            <Divider />
            <Box height={10} />
            <Stack direction="row" spacing={2} classes="my-2 mb-2">
              {/* {permissionData?.isAdd == true ? ( */}
              <Button
                onClick={handleOpen}
                variant="contained"
                endIcon={<AddCircleIcon />}
              >
                {t("text.add")}
              </Button>
              {/* ) : (
                ""
              )} */}



            </Stack>
            <Modal open={open} style={{ height: "600px" }}>
              <Box sx={style}>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: 8,
                    color: (theme) => theme.palette.grey[900],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid md={5} item>
                      <TextField
                        type="text"
                        value={formik.values.roleName}
                        label={
                          <span>
                            {t("text.enterRoleName")}{" "}
                            {requiredFields.includes("roleName") && (
                              <span
                                style={{
                                  color: formik.values.roleName
                                    ? "green"
                                    : "red",
                                }}
                              >
                                *
                              </span>
                            )}
                          </span>
                        }
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        name="roleName"
                        id="roleName"
                        style={{ marginBottom: "10px" }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.roleName && formik.errors.roleName ? (
                        <div style={{ color: "red", margin: "5px" }}>
                          {formik.errors.roleName}
                        </div>
                      ) : null}
                    </Grid>

                    <Grid item lg={3} sm={3}>
                      <Grid>
                        <Button
                          type="submit"
                          fullWidth
                          style={{
                            backgroundColor: "#059669",
                            color: "white",
                            marginBottom: "10px",
                            marginTop: "3px",
                          }}
                        >
                          {editID == "-1" ? t("text.save") : t("text.update")}
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item lg={3} sm={3}>
                      <Button
                        type="reset"
                        fullWidth
                        style={{
                          backgroundColor: "#F43F5E",
                          color: "white",
                          marginBottom: "10px",
                          marginTop: "3px",
                        }}
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          formik.resetForm();
                        }}
                      >
                        {t("text.reset")}
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid md={12} item>
                      <TableContainer sx={{ maxHeight: "65vh" }}>
                        <table
                          style={{
                            width: "100%",
                            border: "1px solid black",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead style={{ position: "sticky" }}>
                            <tr
                              style={{
                                border: "1px solid black",
                                fontSize: "2.7vh",
                                fontWeight: "500",
                                background: "#4169E1",
                                color: "white",
                                textAlign: "center",
                              }}
                            >
                              <td>{t("text.MenuName")}</td>
                              <td>
                                {t("text.Add")} <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={childMenuRecords.every(
                                    (item: any) => item.isAdd
                                  )}
                                  onChange={(e) =>
                                    handleSelectAll("isAdd", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Edit")} <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={childMenuRecords.every(
                                    (item: any) => item.isEdit
                                  )}
                                  onChange={(e) =>
                                    handleSelectAll("isEdit", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.delete")} <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={childMenuRecords.every(
                                    (item: any) => item.isDel
                                  )}
                                  onChange={(e) =>
                                    handleSelectAll("isDel", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.View")} <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={childMenuRecords.every(
                                    (item: any) => item.isView
                                  )}
                                  onChange={(e) =>
                                    handleSelectAll("isView", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Print")} <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={childMenuRecords.every(
                                    (item: any) => item.isPrint
                                  )}
                                  onChange={(e) =>
                                    handleSelectAll("isPrint", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Export")} <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={childMenuRecords.every(
                                    (item: any) => item.isExport
                                  )}
                                  onChange={(e) =>
                                    handleSelectAll(
                                      "isExport",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Release")} <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={childMenuRecords.every(
                                    (item: any) => item.isRelease
                                  )}
                                  onChange={(e) =>
                                    handleSelectAll(
                                      "isRelease",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Post")} <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={childMenuRecords.every(
                                    (item: any) => item.isPost
                                  )}
                                  onChange={(e) =>
                                    handleSelectAll("isPost", e.target.checked)
                                  }
                                />
                              </td>
                            </tr>
                          </thead>
                          <tbody style={{ color: "#000000" }}>
                            {childMenuRecords.map(
                              (rows: any, key: string | number) => {
                                console.log(childMenuRecords);
                                return (
                                  <>
                                    {
                                      <tr
                                        style={{
                                          border: "1px solid black",
                                          fontSize: "2.7vh",
                                          // fontWeight: "600",
                                          // color: "white",
                                        }}
                                      >
                                        {/* <td
                                      style={{
                                        padding: "10px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {rows.srno}
                                    </td> */}
                                        <td style={{ padding: "10px" }}>
                                          {rows.menuName}
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                          <input
                                            type="checkbox"
                                            onChange={() =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isAdd"
                                              )
                                            }
                                            //checked={numberToBoolean(parseInt(childMenuRecords[key]['isAdd']))  ? true : false}
                                            checked={
                                              childMenuRecords[key]["isAdd"]
                                                ? true
                                                : false
                                            }
                                            name="isAdd"
                                            className="isAdd"
                                          />
                                        </td>

                                        <td style={{ textAlign: "center" }}>
                                          <input
                                            type="checkbox"
                                            onChange={() =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isEdit"
                                              )
                                            }
                                            checked={
                                              childMenuRecords[key]["isEdit"]
                                                ? true
                                                : false
                                            }
                                            name="isEdit"
                                            className="isEdit"
                                          />
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                          <input
                                            type="checkbox"
                                            onChange={() =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isDel"
                                              )
                                            }
                                            checked={
                                              childMenuRecords[key]["isDel"]
                                                ? true
                                                : false
                                            }
                                            name="isDel"
                                            className="isDel"
                                          />
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                          <input
                                            type="checkbox"
                                            onChange={() =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isView"
                                              )
                                            }
                                            checked={
                                              childMenuRecords[key]["isView"]
                                                ? true
                                                : false
                                            }
                                            name="isView"
                                            className="isView"
                                          />
                                        </td>

                                        <td style={{ textAlign: "center" }}>
                                          <input
                                            type="checkbox"
                                            onChange={() =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isPrint"
                                              )
                                            }
                                            checked={
                                              childMenuRecords[key]["isPrint"]
                                                ? true
                                                : false
                                            }
                                            name="isPrint"
                                            className="isPrint"
                                          />
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                          <input
                                            type="checkbox"
                                            onChange={() =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isExport"
                                              )
                                            }
                                            checked={
                                              childMenuRecords[key]["isExport"]
                                                ? true
                                                : false
                                            }
                                            name="isExport"
                                            className="isExport"
                                          />
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                          <input
                                            type="checkbox"
                                            onChange={() =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isRelease"
                                              )
                                            }
                                            checked={
                                              childMenuRecords[key]["isRelease"]
                                                ? true
                                                : false
                                            }
                                            name="isRelease"
                                            className="isRelease"
                                          />
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                          <input
                                            type="checkbox"
                                            onChange={() =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isPost"
                                              )
                                            }
                                            checked={
                                              childMenuRecords[key]["isPost"]
                                                ? true
                                                : false
                                            }
                                            name="isPost"
                                            className="isPost"
                                          />
                                        </td>
                                      </tr>
                                    }
                                  </>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Modal>
            {/* Search END */}

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
              />
            )}
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
