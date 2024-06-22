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
import CustomDataGrid from "../../utils/CustomDatagrid";
import { getId, getdivisionId, getinstId } from "../../utils/Constant";

interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function Closed() {
    const [totalFile, setTotalFile] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ReviewModalData, setReviewModalData] = useState(false);
    const { t } = useTranslation();
    
    const userId = getId();

    const instId = getinstId();
    // console.log("🚀 ~ ViewEditFile ~ userId:", userId);
    const divId = getdivisionId();
    // console.log("🚀 ~ ViewEditFile ~ divId:", divId);


    const navigate = useNavigate();

    useEffect(() => {
        getAuthDevision();
        fetchTotalFile();
    }, []);


    const routeChangeAdd = (row: any) => {
        let path = "";
        if (row.id == -1) {
            path = `/master/PageCreateAdd`;
        } else {
            path = `/master/PageCreateEdit`;
        }

        navigate(path, {
            state: row,
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
                "userid": userId,
                "divisionId": divId,
                "type": "C"
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
                id: doc.cId,
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
                        field: "fileNm",
                        headerName: "File Number",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                        renderCell: (params) => {
                            return [
                              <a
                                onClick={() => navigate('/E-Office/ViewEditFile')}
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
                        field: "lastUpdatedDate",
                        headerName: "Last Updated Date",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "laststaus",
                        headerName: "Last Status ",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "updatedremark",
                        headerName: "Updated Remark",
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
                    fontWeight: 900
                },
            }}
            style={{ padding: "10px", }}
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
                />)}

        </Paper>
    );
}
