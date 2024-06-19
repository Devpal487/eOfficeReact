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

export default function MergeFile() {
    const [totalFile, setTotalFile] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ReviewModalData, setReviewModalData] = useState(false);
    const { t } = useTranslation();

    const [newFileNumber, setNewFileNumber] = useState("");
    const [fileType, setFileType] = useState("");
    const [remarks, setRemarks] = useState("");


    const userId = getId();

    const instId = getinstId();
    // console.log("🚀 ~ ViewEditFile ~ userId:", userId);
    const divId = getdivisionId();
    // console.log("🚀 ~ ViewEditFile ~ divId:", divId);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectAllChange = (event:any) => {
        const checked = event.target.checked;
        setSelectAll(checked);
        // if (checked) {
        //     setSelectedRows(data.map((row:any) => row.id));
        // } else {
        //     setSelectedRows([]);
        // }
    };

    




    const navigate = useNavigate();

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
                "type": "MF"
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
                        field: "all",
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
                        headerName: "File Name",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "cSubject",
                        headerName: " Subject",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "createdby",
                        headerName: "File Created By",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "lastStaus",
                        headerName: "Last Status",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "updatedRemark",
                        headerName: "Updated Remark",
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
                    fontWeight: 900
                },
            }}
            style={{ padding: "10px", }}
        >

            <form >
                <Grid item xs={12} container spacing={3}>

                    <Grid xs={5} sm={5} item>
                        <TextField
                            label="Enter New File Name (for Merge)"
                            //   value={formik.values.zoneName}
                            placeholder="Enter New File Name (for Merge)"
                            size="small"
                            fullWidth
                            style={{ backgroundColor: 'white' }}
                        //   onChange={formik.handleChange}
                        //   onBlur={formik.handleBlur}
                        />
                    </Grid>

                    <Grid item xs={5} sm={5}>
                        <TextField
                            label="Enter File Type"
                            //   value={formik.values.zoneCode}
                            placeholder="Enter File Type"
                            size="small"
                            fullWidth
                            style={{ backgroundColor: "white" }}
                        //   onChange={formik.handleChange}
                        //   onBlur={formik.handleBlur}
                        />

                    </Grid>

                    <Grid item xs={5} sm={5}>
                        <TextField
                            label="Enter Remark"
                            //   value={formik.values.zoneCode}
                            placeholder="Enter Remark"
                            size="small"
                            fullWidth
                            style={{ backgroundColor: "white" }}
                        //   onChange={formik.handleChange}
                        //   onBlur={formik.handleBlur}
                        />

                    </Grid>
                    <Grid item xs={2}>
                        {/*  {permissionData?.isAdd == true ? ( */}
                        <Button type="submit" variant="contained" size="large">
                            {/* {editId == -1 ? t("text.save") : t("text.update")} */}
                            {t("text.save")}
                        </Button>
                        {/* ) : ( */}
                        {/*   "" */}
                        {/* )} */}
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
                    rows={totalFile}
                    columns={adjustedColumns}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    initialPageSize={5}
                />)}

        </Paper>
    );
}
