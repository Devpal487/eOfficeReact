import React, { useEffect, useState } from "react";
import {
DataGrid,
GridColDef,
GridToolbar,
} from "@mui/x-data-grid";
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
    FormLabel
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../utils/Url";
import Box from "@mui/material/Box";

interface MenuPermission {
isAdd: boolean;
isEdit: boolean;
isPrint: boolean;
isDel: boolean;
}

export default function Notifications() {
    const [totalFile, setTotalFile] = useState([]);
const [columns, setColumns] = useState<any>([]);
const [isLoading, setIsLoading] = useState(true);
const [ReviewModalData, setReviewModalData] = useState(false);
const { t } = useTranslation();

const navigate = useNavigate();

useEffect(() => {
    getAuthDevision();
    fetchTotalFile();
}, []);

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
        inst_id: 1,
        divid: parseInt(localStorage.getItem("id") + ""),
        refNoYr: parseInt(new Date().getFullYear() + ""),
        pstart: 0,
    };
    console.log("collectData", collectData);
    const response = await api.post(
        `RefferenceNumber/GetRefferenceNo`,
        collectData
    );

    console.log("result", response.data.data);
    const data = response.data.data;
    const DocsWithIds = data.map((doc: any, index: any) => ({
        ...doc,
        serialNo: index + 1,
        id: doc.rid,
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
            headerName: "All",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
        },
        {
            field: "rFileNumber",
            headerName: "File Number",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
        },
        {
            field: "Subject",
            headerName: " Subject",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
        },
        {
            field: "Current Status",
            headerName: "Current Status ",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
        },
        {
            field: "Updated Remark",
            headerName: "Updated Remark",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
        },

        {
            field: "File Created By",
            headerName: "File Created By",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
        },
        {
            field: "Status",
            headerName: "Status",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
        }

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
          fontWeight:900
        },
      }}
      style={{ padding: "10px",}}
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
            <Box>
        <br />
        <div style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
{/*             
            <DataGrid
            rows={totalFile}
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
            /> */}
            No Record Found
        </div>

        </Box>)}
    
    </Paper>
);
}
