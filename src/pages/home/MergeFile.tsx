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
            "txtMergeFileName": formik.values.fileName.toString() || "",
            "userid": userId,
            "fileType": formik.values.fileType,
            "fileSubject": formik.values.remark.toString() || "",
            "mergedBy": 0,
            "fileForMerge": formik.values.fId,
            "authid": 0,
            "divisionId": divId
        };

        api.post(`FileMovement/GetFileMergeReq`, value).then((res) => {
            if (res.data.isSuccess) {
                toast.success(res.data.mesg);
                formik.setFieldValue("fileType", '');
                formik.setFieldValue("fileNo",'');
                formik.setFieldValue("fileName",'');
                formik.setFieldValue("remark",'');
                

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
            "inst_id": -1,
            "user_id": -1,
            "divisionId": -1
        };
        api
            .post(`FileNumber/GetFileNumber`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    fId: item.fId,
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
                        headerName:t("text.All"),
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
                        headerName:t("text.FileNo"),
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
                        headerName: t("text.Subject"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "createdby",
                        headerName: t("text.FileCreatedBy"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "lastStaus",
                        headerName:t("text.LastStatus"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "updatedRemark",
                        headerName:t("text.UpdatedRemark"),
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
                            value={
                                FileOps.find(
                                    (option:any) => option.value === formik.values.fileNo
                                ) || null
                            }
                            fullWidth
                            size="small"
                            onChange={(event, newValue: any) => {
                                console.log(newValue?.value);

                                formik.setFieldValue("fId", newValue?.fId);

                                formik.setFieldValue("fileNo", newValue?.value);
                                formik.setFieldValue("fileName", newValue?.label);

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
                            value={
                                FileTypeOps.find(
                                    (option:any) => option.value === formik.values.fileType
                                ) || null
                            }
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
                            label={<CustomLabel text={t("text.EnterRemark")} />}
                            value={formik.values.remark}
                            placeholder={t("text.EnterRemark")}
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
                        <Button variant="contained" size="large" onClick={MergeFile}>
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
