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
    Checkbox,
    Autocomplete
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../utils/Url";
import Box from "@mui/material/Box";
import CustomDataGrid from "../../utils/CustomDatagrid";
import { getId, getdivisionId, getinstId } from "../../utils/Constant";
import { useFormik } from "formik";
import CustomLabel from "../../CustomLable";
import { toast } from "react-toastify";

interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function MergeFile() {
    const [totalFile, setTotalFile] = useState([]);

    const { t } = useTranslation();
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ReviewModalData, setReviewModalData] = useState(false);
    const [FileOps, setFileOps] = useState<any>([
        { value: "-1", label: t("text.SelectFileNo") },
    ]);

    const [FileTypeOps, setFileTypeOps] = useState<any>([
        { value: "-1", label: t("text.SelectFileType") },
    ]);


    const userId = getId();

    const instId = getinstId();
    // console.log("🚀 ~ ViewEditFile ~ userId:", userId);
    const divId = getdivisionId();
    // console.log("🚀 ~ ViewEditFile ~ divId:", divId);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any>();

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        console.log(checked)
        setSelectAll(checked);
        const newSelectedItems: any = {};
        totalFile.forEach((file: any) => {
            newSelectedItems[file.id] = checked;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        console.log("checked", event)
        const checked = event.target.checked;
        setSelectedItems((prevSelectedItems: any) => ({
            ...prevSelectedItems,
            [id]: checked
        }));
        const allChecked = totalFile.every((file: any) => selectedItems[file.id]);
        setSelectAll(allChecked);
    };
    const formik = useFormik({
        initialValues: {
            // pdFid: -1,
            pdfName: "",
            docMid: 0,
            keywords: "",
            subFtype: "",
            fileNo:0,
           fileType:0,
           remark:"",

        },
        // validationSchema: validationSchema,
        onSubmit: async (values) => {
            // const response = await api.post(
            //    `DocFiles/AddUpdateDocFiles`,
            //    values
            // );
            // try {
            //     alert(response.data.mesg);
            //     navigate("/DocManagement/DocFiles");
            // } catch (error) {
            //     alert(response.data.mesg);
            // }
        },
    });



    const MergeFile = () => {
        const value = {
            "txtMergeFileName": "",
            "userid":userId,
            "fileType":formik.values.fileType,
            "fileSubject": "",
            "mergedBy": 0,
            "fileForMerge": 0,
            "authid": 0,
            "divisionId":divId
        };

        api.post(`FileMovement/GetFileMergeReq`, value).then((res) => {
            if (res.data.isSuccess) {
                toast.success(res.data.mesg);

            } else {
                toast.error(res.data.mesg);
            }
        });
    };





    const navigate = useNavigate();

    // const handleCheckboxChange = (params: any) => {
    //     // Handle checkbox change logic here
    //     console.log('Row data:', params.row);
    // };


    useEffect(() => {
        getAuthDevision();
        fetchTotalFile();
        getFileNo();
        getFileType();
    }, []);


    const getFileNo = () => {
        const collectData = {
            "fnId": -1,
            "fId": -1,
            "inst_id": 1,
            "user_id": -1,
            "divisionId": 1
        };
        api
            .post(`FileNumber/GetFileNumber`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.fileNm,
                    value: item.fnId,
                }));
                setFileOps(arr);
            });
    };


    const getFileType = () => {
        const collectData = {
            "fId": -1,
            "inst_id": 1,
            "user_id": -1,
            "divisionid": 1
        };
        api
            .post(`FileType/GetFileType`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.fName,
                    value: item.fId,
                }));
                setFileTypeOps(arr);
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
                                color="primary"
                            />
                        ),
                        renderCell: (params) => {

                            // console.log('checkPrams', params)
                            return [
                                <Checkbox
                                    checked={selectedItems}
                                    onChange={(event) => handleCheckboxChange(event, params.id as string)}
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

                    <Grid xs={6} sm={6} item>

                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={FileOps}
                            // value={
                            //     ZoneOption.find(
                            //         (option) => option.value === formik.values.fileTypeId
                            //     ) || null
                            // }
                            fullWidth
                            size="small"
                            onChange={(event, newValue: any) => {
                                console.log(newValue?.value);

                                formik.setFieldValue("fileNo", newValue?.value);

                                formik.setFieldTouched("fileNo", true);
                                formik.setFieldTouched("fileNo", false);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.SelectFileNo")} />}
                                />
                            )}
                        />




                    </Grid>

                    <Grid item xs={6} sm={6}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={FileTypeOps}
                            // value={
                            //     ZoneOption.find(
                            //         (option) => option.value === formik.values.fileTypeId
                            //     ) || null
                            // }
                            fullWidth
                            size="small"
                            onChange={(event, newValue: any) => {
                                console.log(newValue?.value);

                                formik.setFieldValue("fileType", newValue?.value);

                                formik.setFieldTouched("fileType", true);
                                formik.setFieldTouched("fileType", false);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.SelectFileType")} />}
                                />
                            )}
                        />



                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Enter Remark"
                            value={formik.values.remark}
                            placeholder="Enter Remark"
                            id="remark"
                            name="remark"
                            size="small"
                            fullWidth
                            style={{ backgroundColor: "white" }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                    </Grid>
                    <Grid item xs={2}>
                        {/*  {permissionData?.isAdd == true ? ( */}
                        <Button type="submit" variant="contained" size="large" onClick={MergeFile}>
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
