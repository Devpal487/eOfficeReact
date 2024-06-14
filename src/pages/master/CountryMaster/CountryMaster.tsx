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
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";


interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function CountryMaster() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addPageShow, setAddPageShow] = useState(false);
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
  }, [isLoading]);

  const routeChangeEdit = (row: any) => {
    console.log("row " + row);

    let path = `/master/CountryMasterEdit`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    let path = `/master/CountryMasterAdd`;
    navigate(path);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      countryId: delete_id,
      
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete( `Country/DeleteCountry`, {data : collectData})
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
        
        countryId:-1
      };
      const response = await api.post(
         `Country/GetCountryMaster`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index:any) => ({
        ...zone,
        serialNo:index+1,
        id: zone.countryId,
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
            field: "countryName",
            headerName: t("text.CountryName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "countryCode",
            headerName: t("text.CountryCode"),
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
            {t("text.CountryMaster")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {permissionData?.isAdd == true && (
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
                size="large"
              >
                {t("text.add")}
              </Button>
            ) }

            {/* {permissionData?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />} size="large">
                {t("text.print")}
              </Button>
            ) : (
              ""
            )} */}
          </Stack>

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
};