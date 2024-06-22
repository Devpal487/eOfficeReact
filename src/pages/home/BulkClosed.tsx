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
    FormLabel,
    Checkbox
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

export default function BulkClosed() {
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
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectAllChange = (event: any) => {
        const checked = event.target.checked;
        setSelectAll(checked);
        // if (checked) {
        //     setSelectedRows(data.map((row:any) => row.id));
        // } else {
        //     setSelectedRows([]);
        // }
    };



    const handleCheckboxChange = (params: any) => {
        // Handle checkbox change logic here
        console.log('Row data:', params.row);
    };

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
                "userid": userId,
                "divisionId": divId,
                "type": "BC"
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
                        headerName: "All",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",

                        renderHeader: () => (
                            <Checkbox
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                        ),

                        renderCell: (params) => {

                            console.log('checkPrams', params)
                            return [
                                <Checkbox
                                    checked={params.value}
                                    onChange={(params: any) => handleCheckboxChange(params)}
                                />
                            ]
                        },
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
                        field: "cSubject",
                        headerName: "Subject",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "lastStaus",
                        headerName: "Last Status ",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "updatedRemark",
                        headerName: "Updated Remark",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    {
                        field: "createdby",
                        headerName: "File Created By",
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
