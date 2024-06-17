import { Button, FormControl, FormLabel, CardContent, Grid, TextField, Typography, Divider, Autocomplete, Modal, Box, Select, MenuItem, FormControlLabel, Radio, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, RadioGroup, Table, Collapse } from '@mui/material';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import HOST_URL from '../../../utils/Url';
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import nopdf from '../../../assets/images/nopdf.png'
import dayjs, { Dayjs } from "dayjs";
import api from '../../../utils/Url';
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SwipeableDrawerRoute from "./SwipeableDrawerRoute";
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';


const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "180vh",
    height: "85vh",
    bgcolor: "#f5f5f5",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 10,
};


const LanguageOption = [
    { label: 'Hindi', value: 'Hindi' },
    { label: 'English', value: 'English' },
    { label: 'Hindi & English', value: 'Hindi & English' },
];

const PriorityOps = [
    { label: 'Most Immediate', value: '1' },
    { label: 'Immediate', value: '2' },
    { label: 'Ordanary', value: '3' },
];

type Props = {};

const PageCreateEdit = (props: Props) => {
    const { t } = useTranslation();

    const location = useLocation();
    console.log('location', location.state)




    const [LetterType, setLetterType] = useState<any>([
        { value: "-1", label: t("text.SelectLetterType") },
    ]);


    const [drawerOpenUser, setDrawerOpenUser] = useState(false);

    const [drawerData, setDrawerData] = useState<any>([]);




    const [FileOption, setFileOption] = useState<any>([
        { value: "-1", label: t("text.SelectFileType") },

    ]);

    const [SectionOption, setSectionOption] = useState<any>([
        { value: "-1", label: t("text.SelectSection") },
    ]);

    const [FileNoOps, setFileNoOps] = useState<any>([
        { value: "-1", label: t("text.SelectFileNo") },
    ]);

    const [RootOps, setRootOps] = useState<any>([
        { value: "-1", label: t("text.SelectRoot") },
    ]);

    const [tableData, setTableData] = useState<any>([]);
    const [pDate, setPDate] = useState("");
    const [keywords, setKeywords] = useState("");
    const [pdf, setPDF] = useState("");
    const [fileName, setfileName] = useState("");


    const [tableData1, setTableData1] = useState<any>([]);
    const [EmpCode, setEmpCode] = useState("");
    const [Remark, setRemark] = useState("");
    const [AuditNo, setAuditNo] = useState("");
    const [SeniorityNo, setSeniorityNo] = useState("");
    const [RetirementDate, setRetirementDate] = useState("");
    const [DateOfApproval, setDateOfApproval] = useState("");
    const [DateOfIssue, setDateOfIssue] = useState("");
    const [DateOfCheck, setDateOfCheck] = useState("");
    const [SentenceNo, setSentenceNo] = useState("");

    const [openCollaps, setopenCollaps] = useState(false);

    const handleCollapse = () => {
        setopenCollaps(prevOpen => !prevOpen);
    };

    const [Shows, setShows] = React.useState(false);
    const [Img, setImg] = useState<any>("");


    const handlePanClose1 = () => {
        setShows(false);
    };
    const modalOpenHandle1 = (event: any) => {
        setShows(true);

        setImg(event);

    };






    const [selectedOption, setSelectedOption] = useState('received');

    const [mergedValue, setMergedValue] = useState('')

    const [selectedYear, setSelectedYear] = useState('');
    const [sNo, setSNo] = useState('');

    const handleRadioChange = (event: any) => {
        setSelectedOption(event.target.value);
    };


    const handleSNoChange = (event: any) => {
        setSNo(event.target.value);
    };



    // Generate an array of previous years
    const previousYears = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 1; year >= currentYear - 100; year--) {
        previousYears.push(year);
    }

    const handleButtonClick = () => {
        const mergedFieldValue = `${formik.values.rlId || ''}-${formik.values.rFileType || ''}-${selectedYear || ''}-${sNo || ''}`;
        setMergedValue(mergedFieldValue);
        formik.setFieldValue('rFileNumber', mergedFieldValue);
    };

    const handleYearChange = (event: any) => {
        setSelectedYear(event.target.value);
    };


    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('manual');
    const [rootid, setRootid] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleButtonChange = (event: any) => {
        setSelectedValue(event.target.value);
    };









    useEffect(() => {


        getimgbyid();
        getFileType();
        getSection();
        getFileNo();
        getLetterType();
        getRoot();


    }, [])


    const getRoot = () => {
        const collectData = {
            "id": -1,
            "authorityId": -1,
            "routeId": -1,
            "officeId": -1,
            "committeeOrGroupId": -1,
            "auth_DeptId": -1,
            "auth_SectionId": -1
        };
        api
            .post(`RouteMemberCycle/GetRouteMemberCycle`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.routeName,
                    value: item.id,
                }));
                setRootOps(arr);
            });
    };



    const getRootPreview = async () => {

        const collectData = {
            "id": rootid || -1,
            "authorityId": -1,
            "routeId": -1,
            "officeId": -1,
            "committeeOrGroupId": -1,
            "auth_DeptId": -1,
            "auth_SectionId": -1
        }
        console.log("collectData", collectData);

        const response = await api.post(
            `RouteMemberCycle/GetRouteMemberCycle`,
            collectData
        );

        console.log("getData", response.data.data);

        setDrawerData(response.data.data);
        setDrawerOpenUser(true);
    }

    const getLetterType = () => {
        const collectData = {
            "lId": -1,
            "inst_id": -1,
            "user_id": -1,
            "divisionid": -1
        };
        api
            .post(`LetterType/GetLetterType`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.lName,
                    value: item.lId,
                }));
                setLetterType(arr);
            });
    };

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
                    label: item.fileNm,
                    value: item.fnId,
                }));
                setFileNoOps(arr);
            });
    };

    const getSection = () => {
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
                setSectionOption(arr);
            });
    };

    const getFileType = () => {
        const collectData = {
            "fId": -1,
            "inst_id": -1,
            "user_id": -1,
            "divisionid": -1
        };
        api
            .post(`FileType/GetFileType`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.fName,
                    value: item.fId,
                }));
                setFileOption(arr);
            });
    };






    const getimgbyid = () => {
        const collectData = {
            rid: location.state.rid,
            rlId: -1,
            inst_id: -1,
            user_id: "",
            refNo: -1,
            divisionid: -1,
            "rFileType": -1,
            "fromdate": "2020-06-13T08:17:35.332Z",
            "todate": "2024-06-13T08:17:35.332Z",
            "type": 1

        };

        api
            .post(`ReferenceDiary/GetReferenceDiary`, collectData)
            .then((res) => {
                const Doc = res.data.data[0]["pdfBase64"];
                const routeIDs = res.data.data[0]["routeID"];
                console.log("🚀 ~ .then ~ routeIDs:", routeIDs)
                // console.log("🚀 ~ .then ~ Doc:", Doc)
                formik.setFieldValue("pdfBase64", Doc);
                formik.setFieldValue("routeID", routeIDs);
            });
    };

    const [pdfView, setPdfView] = useState("");

    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const handlePanClose = () => {
        setPanOpen(false);
    };
    const modalOpenHandle = (event: any) => {
        setPanOpen(true);
        if (event === "pdfBase64") {
            setModalImg(formik.values.pdfBase64);
        }
    };
    const ConvertBase64 = (file: Blob) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };


    const otherDocChangeHandler = async (event: any, params: any) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const fileNameParts = file.name.split(".");
            const fileExtension = fileNameParts[fileNameParts.length - 1];
            if (fileExtension.toLowerCase() === "pdf") {
                const base64 = await ConvertBase64(file);
                formik.setFieldValue(params, base64);
                console.log(base64);
            } else {
                // Display an error message indicating that only PDF files are allowed
                alert("Only PDF files are allowed to be uploaded.");
                // Optionally, you can clear the file input field
                event.target.value = null;
            }
        }
    };



    let navigate = useNavigate();

    const back = useNavigate();

    const [toaster, setToaster] = useState(false);

    const formik = useFormik({
        initialValues: {
            rid: location.state.id,
            rlId: location.state.rlId,
            rLetterNumber: location.state.rLetterNumber,
            rPriority: location.state.rPriority,
            rFileType: location.state.rFileType,
            rLetterSentOn: dayjs(location.state.rLetterSentOn).format("YYYY-MM-DD"),
            rReceivedDate: dayjs(location.state.rReceivedDate).format("YYYY-MM-DD"),
            dairyDate: dayjs(location.state.dairyDate).format("YYYY-MM-DD"),
            rFileNumber: location.state.rFileNumber,
            rLanguage: location.state.rLanguage,
            rDealHands: location.state.rDealHands,
            rSendAdrs: location.state.rSendAdrs,
            rPhone: location.state.rPhone,
            rSubject: location.state.rSubject,
            rRemark: location.state.rRemark,
            inst_id: location.state.inst_id,
            user_id: location.state.user_id,
            createdDate: dayjs(location.state.createdDate).format("YYYY-MM-DD"),
            refNo: location.state.refNo,
            refNoYr: location.state.refNoYr,
            attachMentCount: location.state.attachMentCount,
            letterBy: location.state.letterBy,
            oredrremark: location.state.oredrremark,
            tcNo: location.state.tcNo,
            fileattach_name: location.state.fileattach_name,
            divisionid: location.state.divisionid,
            pucPending: location.state.pucPending,
            routeID: location.state.routeID,
            type: location.state.type,
            FileType: location.state.FileType,
            pdfPath: location.state.pdfpath,
            pdfBase64: location.state.pdfBase64,
            fileOpenDate: dayjs(location.state.fileOpenDate).format("YYYY-MM-DD"),
            types: location.state.types

        },
        onSubmit: async (values: any) => {

            if (values.rFileType && (!values.rFileNumber || !values.rLetterNumber)) {
                setToaster(true);
                toast.error('  If select FileType Then Please fill the File Number and Letter Number');
                return;
            }

            console.log("values check", values)


            const response = await api.post(`ReferenceDiary/AddUpdateReferenceDiary`,
                values
            );
            if (response.data.isSuccess) {
                setToaster(false);


                toast.success(response.data.mesg);
                navigate(-1);
            } else {
                setToaster(true);

                toast.error(response.data.mesg);
            }

        }
    });

    const fileSubmit = () => {



        const value = {
            "fnId": -1,
            "fId": formik.values.FileType || "",
            "fileNm": formik.values.rFileNumber.toString() || "",
            "inst_id": 0,
            "user_id": 0,
            "createdDate": "2024-05-27T11:34:42.443Z",
            "divisionId": 0
        };
        api
            .post(`FileNumber/AddUpdateFileNumber`, value)
            .then((res) => {
                if (res.data.isSuccess === true) {

                    getFileNo();
                    formik.setFieldValue('rFileNumber', res.data.insertedId);

                    setTimeout(() => {
                        toast.success(res.data.mesg);

                    }, 400);

                }


            });
    };

    const convertBase64 = (file: Blob) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
    const onTransctionChange = async (event: any) => {
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            var file = event.target.files[0];
            // console.log("file name", file.name)
            const fileURL = URL.createObjectURL(file);
            console.log("file check", fileURL);
            setPdfView(fileURL);
            setfileName(file.name);
            setPDF(URL.createObjectURL(event.target.files[0]));
            const base64 = await convertBase64(file);
            console.log("base64 " + base64);
            setPDF(base64 + "");
        }
    };


    const addMoreRow1 = () => {
        const newRows = {
            id: tableData1.length + 1,
            pdFid: -1,

            docMid: -1,
            keywords: keywords,
            Remark: Remark,

            EmpCode: EmpCode,
            AuditNo: AuditNo,
            SeniorityNo: SeniorityNo,
            RetirementDate: RetirementDate,
            DateOfApproval: DateOfApproval,
            DateOfIssue: DateOfIssue,
            DateOfCheck: DateOfCheck,
            SentenceNo: SentenceNo,

            isMain: "",

            user_id: -1,

            srn: -1,
            isDelete: false,
        };

        setTableData1((prevTableData: any) => {
            const updatedTableDataed = [...prevTableData, newRows];
            return updatedTableDataed;
        });
        console.log(newRows);



        setKeywords("");
        setEmpCode("");
        setRemark("");
        setAuditNo("");
        setSeniorityNo("");
        setRetirementDate("");
        setDateOfApproval("");
        setDateOfIssue("");
        setDateOfCheck("");
        setSentenceNo("");


    };

    const removeExtraRow1 = (id: any) => {
        setTableData1((prevTableData: any) => {
            const updatedTableDataed = prevTableData.filter(
                (row: any) => row.id !== id
            );
            return updatedTableDataed;
        });
    };

    useEffect(() => {
        if (!formik.values.letterBy) {
            formik.setFieldValue('letterBy', 'received');
        }
    }, [formik.values.letterBy, formik.setFieldValue]);





    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    marginTop: "5px",
                    border: ".5px solid #FF7722",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        style={{ fontSize: "18px", fontWeight: 500 }}
                    >
                        {t("text.PageCreateEdit")}
                    </Typography>

                    <Grid item sm={4} xs={12}>
                        <Typography style={{ marginTop: "-75px" }}>
                            <Button
                                type="submit"
                                onClick={() => back(-1)}
                                variant="contained"
                                style={{
                                    marginBottom: 15,
                                    marginTop: "45px",
                                    backgroundColor: "blue",
                                    width: 20,
                                }}
                            >
                                <ArrowBackSharpIcon />
                            </Button>
                        </Typography>
                    </Grid>

                    <SwipeableDrawerRoute
                        open={drawerOpenUser}
                        onClose={() =>
                            setDrawerOpenUser(!drawerOpenUser)}
                        userData={drawerData}
                    />


                    <Divider />
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        {toaster === false ? "" : <ToastApp />}
                        <Grid item xs={12} container spacing={2}>
                            <Grid sm={5} md={5} item>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <FormControlLabel
                                        value="received"
                                        control={
                                            <Radio
                                                id="letterBy"
                                                name="letterBy"
                                                checked={formik.values.letterBy === "received"}
                                                onChange={formik.handleChange}
                                                value="received"
                                            />
                                        }
                                        label={t("text.Received")}
                                    />
                                    <FormControlLabel
                                        value="dispatch"
                                        control={
                                            <Radio
                                                id="letterBy"
                                                name="letterBy"
                                                checked={formik.values.letterBy === "dispatch"}

                                                onChange={formik.handleChange}
                                                value="dispatch"
                                            />
                                        }
                                        label={t("text.Dispatch")}
                                    />
                                    <FormControlLabel
                                        value="received/dispatch"
                                        control={
                                            <Radio
                                                id="letterBy"
                                                name="letterBy"
                                                checked={formik.values.letterBy === "received/dispatch"}
                                                onChange={formik.handleChange}
                                                value="received/dispatch"
                                            />
                                        }
                                        label={t("text.RecOrDisp")}
                                    />
                                </Box>
                            </Grid>

                            <Grid sm={5} md={5} xs={12}>
                                <FormControl
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 20,
                                        marginTop: "13px",
                                        marginLeft: "12px",
                                    }}
                                >
                                    <Grid>
                                        <FormLabel>Submit Files For</FormLabel>
                                    </Grid>
                                    <Grid>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            defaultValue="A"
                                            onChange={(event) => {
                                                console.log("radio value check", event.target.value);
                                                formik.setFieldValue("types", event.target.value);
                                            }}
                                        >
                                            <FormControlLabel
                                                value="A"
                                                control={<Radio />}
                                                label="Approval"
                                            />
                                            <FormControlLabel
                                                value="G"
                                                control={<Radio />}
                                                label="General"
                                            />
                                        </RadioGroup>
                                    </Grid>
                                </FormControl>
                            </Grid>

                            <Grid sm={2} md={2} xs={12}></Grid>

                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={LetterType}
                                    fullWidth
                                    size="small"
                                    value={LetterType.find((opt: any) => opt.value == formik.values.rlId) || null}
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rlId", newValue?.value);

                                        formik.setFieldTouched("rlId", true);
                                        formik.setFieldTouched("rlId", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={t("text.SelectLetterType")} />
                                    )}
                                />
                            </Grid>

                            {selectedOption !== "dispatch" && (
                                <Grid item lg={4} xs={12}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={PriorityOps}
                                        fullWidth
                                        value={PriorityOps.find((opt: any) => opt.value == formik.values.rPriority) || null}
                                        size="small"
                                        onChange={(event, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("rPriority", newValue?.value + "");

                                            formik.setFieldTouched("rPriority", true);
                                            formik.setFieldTouched("rPriority", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={t("text.SelectPriority")} />
                                        )}
                                    />
                                </Grid>
                            )}

                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={LanguageOption}
                                    fullWidth
                                    value={LanguageOption.find((opt: any) => opt.value == formik.values.rLanguage) || null}
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rLanguage", newValue?.value + "");

                                        formik.setFieldTouched("rLanguage", true);
                                        formik.setFieldTouched("rLanguage", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={t("text.SelectLanguage")} />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={FileOption}
                                    fullWidth
                                    value={FileOption.find((opt: any) => opt.value == formik.values.rFileType) || null}
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rFileType", newValue?.value);

                                        formik.setFieldTouched("rFileType", true);
                                        formik.setFieldTouched("rFileType", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={t("text.SelectFileType")} />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={FileNoOps}
                                    value={
                                        FileNoOps.find(
                                            (option: any) =>
                                                option.value === formik.values.rFileNumber
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rFileNumber", newValue?.value);

                                        formik.setFieldTouched("rFileNumber", true);
                                        formik.setFieldTouched("rFileNumber", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            id="rFileNumber"
                                            name="rFileNumber"
                                            label={t("text.SelectFileNo")}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            color="primary"
                                                            aria-label="add"
                                                            sx={{
                                                                backgroundColor: "#77A979",
                                                                "&:hover": { backgroundColor: "#B2EBF2" },
                                                                color: "#fff",
                                                                marginLeft: "110%",
                                                                padding: "4px",
                                                                fontSize: "16px",
                                                                width: "30px",
                                                                height: "30px",
                                                            }}
                                                            onClick={() => {
                                                                if (formik.values.rFileType) {
                                                                    handleClickOpen();
                                                                } else {
                                                                    toast.error("Please select file type");
                                                                }
                                                            }}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Dialog
                                open={open}
                                onClose={handleClose}
                                sx={{ width: "100%", height: "100%" }}
                            >
                                <DialogTitle>{t("text.GenerateFileNo")}</DialogTitle>

                                <DialogContent>
                                    <RadioGroup
                                        value={selectedValue}
                                        onChange={handleButtonChange}
                                    >
                                        <FormControlLabel
                                            value="automatic"
                                            control={<Radio />}
                                            label="Automatic"
                                        />
                                        <FormControlLabel
                                            value="manual"
                                            control={<Radio />}
                                            label="Manual"
                                        />
                                    </RadioGroup>

                                    {selectedValue === "automatic" && (
                                        <Grid
                                            container
                                            spacing={2}
                                            alignItems="center"
                                            sx={{ marginTop: 2 }}
                                        >
                                            <Grid item xs={6}>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={SectionOption}
                                                    fullWidth
                                                    size="small"
                                                    onChange={(event, newValue: any) => {
                                                        console.log(newValue?.value);
                                                        formik.setFieldValue("rlId", newValue?.label);
                                                        formik.setFieldTouched("rlId", true);
                                                        formik.setFieldTouched("rlId", false);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={t("text.SelectSection")}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={FileOption}
                                                    fullWidth
                                                    size="small"
                                                    onChange={(event, newValue: any) => {
                                                        console.log(newValue?.value);

                                                        formik.setFieldValue("FileType", newValue?.value);

                                                        formik.setFieldValue("rFileType", newValue?.label);

                                                        formik.setFieldTouched("rFileType", true);
                                                        formik.setFieldTouched("rFileType", false);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={t("text.SelectFileType")}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField
                                                    select
                                                    label="Select Year"
                                                    value={selectedYear}
                                                    onChange={handleYearChange}
                                                    fullWidth
                                                    size="small"
                                                >
                                                    {previousYears.map((year) => (
                                                        <MenuItem key={year} value={year}>
                                                            {year}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField
                                                    id="sNo"
                                                    label="sNo"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    value={sNo}
                                                    onChange={handleSNoChange}
                                                />
                                            </Grid>

                                            <Grid item xs={6} sx={{ marginLeft: "40%" }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleButtonClick}
                                                >
                                                    {t("text.Generate")}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={8}>
                                                <TextField
                                                    label={t("text.FileNo")}
                                                    value={mergedValue}
                                                    placeholder={t("text.FileNo")}
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                    name="rFileNumber"
                                                    id="rFileNumber"
                                                    style={{ backgroundColor: "white" }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        handleClose();
                                                        fileSubmit();
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}

                                    {selectedValue === "manual" && (
                                        <Grid
                                            container
                                            spacing={2}
                                            alignItems="center"
                                            sx={{ marginTop: 2 }}
                                        >
                                            <Grid item xs={8}>
                                                <TextField
                                                    label={t("text.FileNo")}
                                                    value={formik.values.rFileNumber}
                                                    placeholder={t("text.FileNo")}
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                    name="rFileNumber"
                                                    id="rFileNumber"
                                                    style={{ backgroundColor: "white" }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        handleClose();
                                                        fileSubmit();
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>

                            <Grid md={4} item>
                                <TextField
                                    label={t("text.EnterLetterNumber")}
                                    value={formik.values.rLetterNumber}
                                    placeholder={t("text.EnterLetterNumber")}
                                    size="small"
                                    fullWidth
                                    name="rLetterNumber"
                                    id="rLetterNumber"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            {selectedOption !== "dispatch" && (
                                <Grid md={4} item>
                                    <TextField
                                        type="date"
                                        label={t("text.LetterSentOn")}
                                        value={formik.values.rLetterSentOn}
                                        placeholder={t("text.rLetterSentOn")}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        name="rLetterSentOn"
                                        id="rLetterSentOn"
                                        style={{ backgroundColor: "white" }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>
                            )}

                            <Grid md={4} item>
                                <TextField
                                    type="date"
                                    label={t("text.ReceivedData")}
                                    value={formik.values.rReceivedDate}
                                    name="rReceivedDate"
                                    id="rReceivedDate"
                                    placeholder={t("text.ReceivedData")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid md={4} item>
                                <TextField
                                    type="date"
                                    label={t("text.fileOpenDate")}
                                    value={formik.values.fileOpenDate}
                                    name="fileOpenDate"
                                    id="fileOpenDate"
                                    placeholder={t("text.fileOpenDate")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            {selectedOption !== "dispatch" && (
                                <Grid md={4} item>
                                    <TextField
                                        id="rPhone"
                                        name="rPhone"
                                        label={t("text.EnterMobNo")}
                                        value={formik.values.rPhone}
                                        placeholder={t("text.EnterMobNo")}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>
                            )}

                            {/* <Grid md={4} item container alignItems="center">
                                <TextField
                                    label={t("text.SendTo")}
                                    value={formik.values.letterBy}
                                    placeholder={t("text.SendTo")}
                                    size="small"
                                    fullWidth
                                    name="letterBy"
                                    id="letterBy"
                                    type="text"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputProps={{
                                        endAdornment: selectedOption === "dispatch" && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="add"
                                                    sx={{
                                                        backgroundColor: "#77A979",
                                                        "&:hover": { backgroundColor: "#B2EBF2" },
                                                        color: "#fff",
                                                        marginLeft: "8px",
                                                        padding: "4px",
                                                        fontSize: "16px",
                                                        width: "30px",
                                                        height: "30px",
                                                    }}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid> */}

                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={RootOps}
                                    fullWidth
                                    value={RootOps.find((opt: any) => opt.value == formik.values.routeID) || null}
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log("🚀 ~ PageCreateEdit ~ newValue:", newValue)
                                        formik.setFieldValue("rootID", newValue?.value);
                                        setRootid(newValue?.value);
                                        formik.setFieldValue("routeID", newValue?.value);
                                        formik.setFieldTouched("routeID", true);
                                        formik.setFieldTouched("routeID", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t("text.SelectRoot")}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            color="primary"
                                                            aria-label="add"
                                                            sx={{
                                                                backgroundColor: "#5b6cde",
                                                                "&:hover": { backgroundColor: "#B2EBF2" },
                                                                color: "#fff",
                                                                marginLeft: "110%",
                                                                padding: "4px",
                                                                fontSize: "16px",
                                                                width: "30px",
                                                                height: "30px",
                                                            }}
                                                            onClick={() => {
                                                                if (rootid != "") {
                                                                    getRootPreview();
                                                                } else {
                                                                    toast.error("Please select root");
                                                                }
                                                            }}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid md={12} item>
                                <TextField
                                    label={t("text.LetterRemark")}
                                    value={formik.values.rRemark}
                                    placeholder={t("text.LetterRemark")}
                                    size="small"
                                    fullWidth
                                    name="rRemark"
                                    id="rRemark"
                                    type="text"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid md={12} item>
                                <TextField
                                    label={t("text.SendFrom")}
                                    value={formik.values.rSendAdrs}
                                    placeholder={t("text.SendFrom")}
                                    size="small"
                                    fullWidth
                                    name="rSendAdrs"
                                    id="rSendAdrs"
                                    type="text"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid md={12} item>
                                <TextField
                                    label={t("text.Subject")}
                                    value={formik.values.rSubject}
                                    placeholder={t("text.Subject")}
                                    size="small"
                                    fullWidth
                                    name="rSubject"
                                    id="rSubject"
                                    type="text"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid container spacing={1} item>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sm={4}
                                    item
                                    style={{ marginBottom: "30px", marginTop: "30px" }}
                                >
                                    <TextField
                                        type="file"
                                        inputProps={{ accept: "application/pdf" }}
                                        InputLabelProps={{ shrink: true }}
                                        label={
                                            <strong style={{ color: "#000" }}>
                                                {t("text.EnterDocUpload")}
                                            </strong>
                                        }
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "pdfBase64")}
                                    />
                                </Grid>
                                <Grid xs={12} md={4} sm={4} item></Grid>

                                <Grid xs={12} md={4} sm={4} item>
                                    <Grid
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            alignItems: "center",
                                            margin: "10px",
                                        }}
                                    >
                                        {formik.values.pdfBase64 == "" ? (
                                            <img
                                                src={nopdf}
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        ) : (
                                            <embed
                                                src={formik.values.pdfBase64}
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                    padding: "2px",
                                                }}
                                            />
                                        )}
                                        <Typography
                                            onClick={() => modalOpenHandle("pdfBase64")}
                                            style={{
                                                textDecorationColor: "blue",
                                                textDecorationLine: "underline",
                                                color: "blue",
                                                fontSize: "15px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {t("text.Preview")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Modal open={panOpens} onClose={handlePanClose}>
                                    <Box sx={style}>
                                        {modalImg == "" ? (
                                            <img
                                                src={nopdf}
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                }}
                                            />
                                        ) : (
                                            <embed
                                                // alt="preview image"
                                                src={formik.values.pdfBase64}
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Modal>
                            </Grid>

                            <Divider />
                            <br />

                            {/* <Grid item xs={12} container spacing={2}>
                                <Grid xs={12} lg={2.5} item>
                                    <TextField
                                        id="pdf"
                                        name="pdf"
                                        label={t("text.AttachedFile")}
                                        // value={pdf}
                                        placeholder={t("text.AttachedFile")}
                                        size="small"
                                        type="file"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={onTransctionChange}
                                    />
                                </Grid>

                                <Grid xs={12} lg={2} item>
                                    <Button
                                        startIcon={<AddCircleIcon />}
                                        variant="contained"
                                        fullWidth
                                        style={{
                                            marginBottom: 15,
                                            backgroundColor: "info",
                                        }}
                                        onClick={addMoreRow}
                                    >
                                        {t("text.add")}
                                    </Button>
                                </Grid>
                            </Grid> */}

                            <Grid xs={12} sm={12} item sx={{ marginTop: "3px", overflow: "auto" }}>
                                <div>
                                    <IconButton onClick={handleCollapse} style={{ backgroundColor: "#2196f3", color: "#fff", marginBottom: "5px" }} >
                                        {openCollaps ? <KeyboardArrowUpTwoToneIcon /> : <ExpandMoreTwoToneIcon />}

                                    </IconButton>
                                    <strong style={{ textDecoration: 'underline' }}>{openCollaps ? 'Close' : 'Open'} Employee Table</strong>
                                    <Collapse in={openCollaps}>
                                        <Table
                                            style={{
                                                borderCollapse: "collapse",
                                                width: "100%",
                                                border: "1px solid black",
                                            }}
                                        >
                                            <thead
                                                style={{ backgroundColor: "#2196f3", color: "#f5f5f5" }}
                                            >
                                                <tr>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            paddingBlock: "10",
                                                            paddingTop: "5px",
                                                            paddingBottom: "5px",

                                                        }}
                                                    >
                                                        {t("text.Action")}

                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <IconButton
                                                                color="primary"
                                                                aria-label="add"
                                                                sx={{
                                                                    backgroundColor: '#47cc4c',
                                                                    '&:hover': { backgroundColor: '#B2EBF2' },
                                                                    color: "#fff",
                                                                    marginLeft: '18%',
                                                                    padding: '4px',
                                                                    fontSize: '16px',
                                                                    width: '30px',
                                                                    height: '30px'
                                                                }}
                                                                onClick={addMoreRow1}
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </div>
                                                    </th>

                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"


                                                        }}
                                                    >
                                                        {t("text.EmpName")}

                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="EmpName"
                                                                name="EmpName"
                                                                label={t("text.EmpName")}
                                                                value={keywords}
                                                                placeholder={t("text.EmpName")}

                                                                size="small"
                                                                type="text"
                                                                fullWidth
                                                                style={{ backgroundColor: "white", margin: "1%" }}
                                                                onChange={(e: any) => setKeywords(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.EmpCode")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="EmpCode"
                                                                name="EmpCode"
                                                                label={t("text.EmpCode")}
                                                                value={EmpCode}
                                                                placeholder={t("text.EmpCode")}
                                                                size="small"
                                                                type="text"
                                                                fullWidth
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setEmpCode(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>

                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.Remark")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="Remark"
                                                                name="Remark"
                                                                label={t("text.Remark")}
                                                                value={Remark}
                                                                placeholder={t("text.Remark")}
                                                                size="small"
                                                                type="text"
                                                                fullWidth
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setRemark(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.AuditNo")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="AuditNo"
                                                                name="AuditNo"
                                                                label={t("text.AuditNo")}
                                                                value={AuditNo}
                                                                placeholder={t("text.AuditNo")}
                                                                size="small"
                                                                type="text"
                                                                fullWidth
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setAuditNo(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.SeniorityNo")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="SeniorityNo"
                                                                name="SeniorityNo"
                                                                label={t("text.SeniorityNo")}
                                                                value={SeniorityNo}
                                                                placeholder={t("text.SeniorityNo")}
                                                                size="small"
                                                                type="text"
                                                                fullWidth
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setSeniorityNo(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.RetirementDate")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField

                                                                id="RetirementDate"
                                                                name="RetirementDate"
                                                                //label={t("text.RetirementDate")}
                                                                value={RetirementDate}
                                                                placeholder={t("text.RetirementDate")}
                                                                size="small"
                                                                type="date"
                                                                InputLabelProps={{ shrink: true }}
                                                                fullWidth
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setRetirementDate(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.DateOfApproval")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="DateOfApproval"
                                                                name="DateOfApproval"
                                                                // label={t("text.DateOfApproval")}
                                                                value={DateOfApproval}
                                                                placeholder={t("text.DateOfApproval")}
                                                                size="small"
                                                                type="date"
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setDateOfApproval(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.DateOfIssue")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="DateOfIssue"
                                                                name="DateOfIssue"
                                                                //  label={t("text.DateOfIssue")}
                                                                value={DateOfIssue}
                                                                placeholder={t("text.DateOfIssue")}
                                                                size="small"
                                                                type="date"
                                                                InputLabelProps={{ shrink: true }}
                                                                fullWidth
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setDateOfIssue(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.DateOfReceiptOfCheck")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="DateOfCheck"
                                                                name="DateOfCheck"
                                                                // label={t("text.DateOfReceiptOfCheck")}
                                                                value={DateOfCheck}
                                                                placeholder={t("text.DateOfReceiptOfCheck")}
                                                                size="small"
                                                                type="date"
                                                                InputLabelProps={{ shrink: true }}
                                                                fullWidth
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setDateOfCheck(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>

                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.SentenceNoOrDate")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                id="SentenceNo"
                                                                name="SentenceNo"

                                                                value={SentenceNo}
                                                                placeholder={t("text.SentenceNo")}
                                                                size="small"
                                                                type="text"

                                                                fullWidth
                                                                style={{ backgroundColor: "white" }}
                                                                onChange={(e: any) => setSentenceNo(e.target.value)}
                                                            />
                                                        </div>


                                                    </th>


                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.Designation")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>

                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                style={{ backgroundColor: "white" }}
                                                                options={LetterType}
                                                                // value={
                                                                //     ZoneOption.find(
                                                                //         (option) => option.value === formik.values.fileTypeId
                                                                //     ) || null
                                                                // }
                                                                fullWidth
                                                                size="small"
                                                                onChange={(event, newValue: any) => {
                                                                    console.log(newValue?.value);

                                                                    formik.setFieldValue("rlId", newValue?.value);

                                                                    formik.setFieldTouched("rlId", true);
                                                                    formik.setFieldTouched("rlId", false);
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={
                                                                            <span>
                                                                                {t("text.Designation")} {""}

                                                                            </span>
                                                                        }
                                                                    />
                                                                )}
                                                            />

                                                        </div>


                                                    </th>

                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.UpdateStatus")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>

                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                style={{ backgroundColor: "white" }}
                                                                options={LetterType}
                                                                // value={
                                                                //     ZoneOption.find(
                                                                //         (option) => option.value === formik.values.fileTypeId
                                                                //     ) || null
                                                                // }
                                                                fullWidth
                                                                size="small"
                                                                onChange={(event, newValue: any) => {
                                                                    console.log(newValue?.value);

                                                                    formik.setFieldValue("rlId", newValue?.value);

                                                                    formik.setFieldTouched("rlId", true);
                                                                    formik.setFieldTouched("rlId", false);
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={
                                                                            <span>
                                                                                {t("text.UpdateStatus")} {""}

                                                                            </span>
                                                                        }
                                                                    />
                                                                )}
                                                            />

                                                        </div>


                                                    </th>
                                                    <th
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                            width: "200px",
                                                            minWidth: "200px",
                                                            maxWidth: "200px",
                                                            display: "table-cell"
                                                        }}
                                                    >
                                                        {t("text.Clarification")}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>

                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                style={{ backgroundColor: "white" }}
                                                                options={LetterType}
                                                                // value={
                                                                //     ZoneOption.find(
                                                                //         (option) => option.value === formik.values.fileTypeId
                                                                //     ) || null
                                                                // }
                                                                fullWidth
                                                                size="small"
                                                                onChange={(event, newValue: any) => {
                                                                    console.log(newValue?.value);

                                                                    formik.setFieldValue("rlId", newValue?.value);

                                                                    formik.setFieldTouched("rlId", true);
                                                                    formik.setFieldTouched("rlId", false);
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={
                                                                            <span>
                                                                                {t("text.SelectClarification")} {""}

                                                                            </span>
                                                                        }
                                                                    />
                                                                )}
                                                            />

                                                        </div>


                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ border: "1px solid black" }}>
                                                {tableData1?.map((row: any, index: any) => (
                                                    <tr key={row.id} style={{ border: "1px solid black" }}>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {" "}
                                                            <DeleteIcon
                                                                style={{
                                                                    fontSize: "20px",
                                                                    color: "darkred",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => removeExtraRow1(row.id)}
                                                            />{" "}
                                                            {/* <input type="checkbox" /> */}
                                                        </td>


                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.keywords}
                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.EmpCode}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.Remark}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.AuditNo}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.SeniorityNo}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.RetirementDate}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.DateOfApproval}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.DateOfIssue}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.DateOfCheck}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.SentenceNo}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.Designation}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.UpdateStatus}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.Clarification}

                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Collapse>
                                </div>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                spacing={2}
                                style={{ display: "flex", justifyContent: "center" }}
                            >
                                <Grid xs={6} style={{ margin: "6px" }}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        style={{
                                            backgroundColor: "#059669",
                                            color: "white",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {t("text.save")}
                                    </Button>
                                </Grid>

                                <Grid xs={6} style={{ margin: "6px" }}>
                                    <Button
                                        type="reset"
                                        fullWidth
                                        style={{
                                            backgroundColor: "#F43F5E",
                                            color: "white",
                                            marginTop: "10px",
                                        }}
                                        onClick={(e) => formik.resetForm()}
                                    >
                                        {t("text.reset")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default PageCreateEdit;
