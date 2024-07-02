import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  Divider,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Stack,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  Radio,
  FormLabel,
  Checkbox,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../utils/Url";
import Box from "@mui/material/Box";
import CustomDataGrid from "../../utils/CustomDatagrid";
import { getId, getdivisionId, getinstId } from "../../utils/Constant";
import { toast } from "react-toastify";
import { useFormik } from "formik";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function BulkClosed(rows: any) {
  const [totalFile, setTotalFile] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ReviewModalData, setReviewModalData] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const userId = getId();

  const instId = getinstId();
  // console.log("🚀 ~ ViewEditFile ~ userId:", userId);
  const divId = getdivisionId();
  // console.log("🚀 ~ ViewEditFile ~ divId:", divId);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event: any) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const allFileNos = rows.map((row: any) => row.cFileNo);
      formik.setFieldValue("fileNo", allFileNos.join(","));
    } else {
      formik.setFieldValue("fileNo", "");
    }
  };

  const handleCheckboxChange = (params: any, event: any) => {
    const isChecked = event.target.checked;
    const cFileNo = params.row.cFileNo;

    if (isChecked) {
      formik.setFieldValue("fileNo", cFileNo);
    } else {
      formik.setFieldValue("fileNo", "");
    }
  };

  const formik = useFormik({
    initialValues: {
      // pdFid: -1,
      pdfName: "",
      docMid: 0,
      keywords: "",
      subFtype: "",
      fileNo: 0,
      fileType: 0,
      remark: "",
      fileName: "",
      fId: 0,
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      // const response = await api.post(
      //    `DocFiles/AddUpdateDocFiles`,
      //    values
      // );
    },
  });

  useEffect(() => {
    getAuthDevision();
    fetchTotalFile();
  }, []);

  const SubmitBulk = () => {
    const value = {
      fileNo: formik.values.fileNo,
      lastStatus: "",
    };

    api.post(`AddSp_SubmitBulkClosed`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const getAuthDevision = () => {
    const collectData = {
      divisionid: parseInt(localStorage.getItem("id") + ""),
    };
    api.post(`AuthorityMaster/GetAuthorityDiv`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.authorityType,
        value: item.id,
      }));
      Division = arr;
    });
  };

  var Division: any[];

  const fetchTotalFile = async () => {
    try {
      console.log("Division", Division);
      const collectData = {
        userid: userId,
        divisionId: divId,
        type: "BC",
      };
      console.log("collectData", collectData);
      const response = await api.post(
        `FileMovement/Getsp_FileRoInbox`,
        collectData
      );

      console.log("result", response.data.data);
      const data = response.data.data;
      const DocsWithIds = data.map((doc: any, index: any) => ({
        ...doc,
        serialNo: index + 1,
        id: doc.cFileNo,
        Division: Division,
      }));

      setTotalFile(DocsWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            width: 120,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "All",
            headerName: t("text.All"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",

            renderHeader: () => (
              <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
            ),

            renderCell: (params) => {
              console.log("checkPrams", params);
              return [
                <Checkbox
                  checked={params.value}
                  onChange={(event: any) => handleCheckboxChange(params, event)}
                />,
              ];
            },
          },

          {
            field: "fileNm",
            headerName: t("text.FileNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => {
              return [
                <a
                  onClick={() => navigate("/E-Office/ViewEditFile")}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {params.value}
                </a>,
              ];
            },
          },
          {
            field: "cSubject",
            headerName: t("text.Subject"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "lastStaus",
            headerName: t("text.LastStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "updatedRemark",
            headerName: t("text.UpdatedRemark"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "createdby",
            headerName: t("text.FileCreatedBy"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        "& .MuiDataGrid-colCell": {
          backgroundColor: "#2B4593",
          color: "#fff",
          fontSize: 17,
          fontWeight: 900,
        },
      }}
      style={{ padding: "10px" }}
    >
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
          rows={totalFile}
          columns={adjustedColumns}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialPageSize={5}
        />
      )}

      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={2}>
          <Button
            variant="contained"
            size="large"
            onClick={SubmitBulk}
            sx={{
              mt: 1,
              "&:hover": {
                backgroundColor: "#2B4593", 
              },
            }}
          >
            {t("text.Submit")}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
