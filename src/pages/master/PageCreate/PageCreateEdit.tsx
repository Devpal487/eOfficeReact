import { Button, CardContent, Grid, TextField, Typography, Divider, Autocomplete, Modal, Box, Select, MenuItem, FormControlLabel, Radio, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, RadioGroup, Table } from '@mui/material';
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
    const [fileName, setfileName] = useState("");
    const [pdf, setPDF] = useState("");
    const [pdfView, setPdfView] = useState("");
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
                    rootID: item.id,
                    label: item.routeName,
                    value: item.id,
                }));
                setRootOps(arr);
            });
    };



    const getRootPreview = async () => {
       
        const collectData = {
            "id": formik.values.rootID || -1,
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
            rlId: location.state.rlId,
            inst_id: location.state.inst_id,
            user_id: location.state.user_id,
            refNo: location.state.refNo,
            divisionid: location.state.divisionid,

        };

        api
            .post(`ReferenceDiary/GetReferenceDiary`, collectData)
            .then((res) => {
                console.log("result" + JSON.stringify(res.data.data[0]["fileattach_name"]));

                const Doc = res.data.data[0]["fileattach_name"];
                formik.setFieldValue("fileattach_name", Doc);
            });
    };


    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const handlePanClose = () => {
        setPanOpen(false);
    };
    const modalOpenHandle = (event: any) => {
        setPanOpen(true);
        if (event === "fileattach_name") {
            setModalImg(formik.values.fileattach_name);
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
    // const otherDocChangeHandler = async (event: any, params: any) => {
    //   if (event.target.files && event.target.files[0]) {
    //     const file = event.target.files[0];
    //     const base64 = await ConvertBase64(file);
    //     formik.setFieldValue(params, base64);
    //   }
    // }

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

    const requiredFields = ['pdfName,rPhone'];

    const validationSchema = Yup.object({


        rPhone: Yup.string()
            // .test(
            //     'required',
            //     t('text.reqMobNo'),
            //     function (value: any) {
            //         return value && value.trim() !== '';
            //     }
            // )
            .matches(/^[0-9]*$/, t('text.EnterNoOnly'))
            .max(10, t('text.EnterMaxTenDigits'))


    });


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
            FileType: 0,
            rootID :-1

        },
        validationSchema: validationSchema,
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

    const addMoreRow = () => {
        const newRows = {
            id: tableData.length + 1,
            pdFid: -1,
            pdfName: fileName,
            docMid: -1,

            subFtype: "",

            isMain: "",

            user_id: -1,
            pdfPath: pdf,
            pdfView: pdfView,
            srn: -1,
            isDelete: false,
        };

        setTableData((prevTableData: any) => {
            const updatedTableDataed = [...prevTableData, newRows];
            return updatedTableDataed;
        });
        console.log(newRows);

        setfileName("");
        setPDF("");

    };

    const removeExtraRow = (id: any) => {
        setTableData((prevTableData: any) => {
            const updatedTableDataed = prevTableData.filter(
                (row: any) => row.id !== id
            );
            return updatedTableDataed;
        });
    };



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

                            <Grid md={12} item >
                                <Box display="flex" justifyContent="center" alignItems="center">

                                    <FormControlLabel
                                        value="received"
                                        control={<Radio checked={selectedOption === 'received'} onChange={handleRadioChange} />}
                                        label={t("text.Received")}
                                    />
                                    <FormControlLabel
                                        value="dispatch"
                                        control={<Radio checked={selectedOption === 'dispatch'} onChange={handleRadioChange} />}
                                        label={t("text.Dispatch")}
                                    />
                                    <FormControlLabel
                                        value="received/dispatch"
                                        control={<Radio checked={selectedOption === 'received/dispatch'} onChange={handleRadioChange} />}
                                        label={t("text.RecOrDisp")}
                                    />

                                </Box>

                            </Grid>



                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={LetterType}
                                    value={
                                        LetterType.find(
                                            (option: any) => option.value === formik.values.rlId
                                        ) || null
                                    }
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
                                                    {t("text.SelectLetterType")} {""}
                                                    {requiredFields.includes("rlId") && (
                                                        <span
                                                            style={{
                                                                color: formik.values.rlId ? "green" : "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    )}
                                                </span>
                                            }
                                        />
                                    )}
                                />

                                {formik.touched.rlId && formik.errors.rlId ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.rlId)}
                                    </div>
                                ) : null}
                            </Grid>

                            {selectedOption !== 'dispatch' && (

                                <Grid item lg={4} xs={12}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={PriorityOps}
                                        value={
                                            PriorityOps.find(
                                                (option: any) => option.value + "" === formik.values.rPriority
                                            ) || null
                                        }
                                        fullWidth
                                        size="small"
                                        onChange={(event, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("rPriority", newValue?.value + "");

                                            formik.setFieldTouched("rPriority", true);
                                            formik.setFieldTouched("rPriority", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={
                                                    <span>
                                                        {t("text.SelectPriority")} {""}
                                                        {requiredFields.includes("rPriority") && (
                                                            <span
                                                                style={{
                                                                    color: formik.values.rPriority ? "green" : "red",
                                                                }}
                                                            >
                                                                *
                                                            </span>
                                                        )}
                                                    </span>
                                                }
                                            />
                                        )}
                                    />

                                    {formik.touched.rPriority && formik.errors.rPriority ? (
                                        <div style={{ color: "red", margin: "5px" }}>
                                            {String(formik.errors.rPriority)}
                                        </div>
                                    ) : null}
                                </Grid>

                            )}


                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={LanguageOption}
                                    value={
                                        LanguageOption.find(
                                            (option: any) => option.value + "" === formik.values.rLanguage
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rLanguage", newValue?.value + "");

                                        formik.setFieldTouched("rLanguage", true);
                                        formik.setFieldTouched("rLanguage", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectLanguage")} {""}
                                                    {requiredFields.includes("rLanguage") && (
                                                        <span
                                                            style={{
                                                                color: formik.values.rLanguage ? "green" : "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    )}
                                                </span>
                                            }
                                        />
                                    )}
                                />

                                {formik.touched.rLanguage && formik.errors.rLanguage ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.rLanguage)}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={FileOption}
                                    value={
                                        FileOption.find(
                                            (option: any) => option.value === formik.values.rFileType
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rFileType", newValue?.value);

                                        formik.setFieldTouched("rFileType", true);
                                        formik.setFieldTouched("rFileType", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectFileType")} {""}
                                                    {requiredFields.includes("rFileType") && (
                                                        <span
                                                            style={{
                                                                color: formik.values.rFileType ? "green" : "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    )}
                                                </span>
                                            }
                                        />
                                    )}
                                />

                                {formik.touched.rFileType && formik.errors.rFileType ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.rFileType)}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={FileNoOps}
                                    value={
                                        FileNoOps.find(
                                            (option: any) => option.value === formik.values.rFileNumber
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


                                            label={
                                                <span>
                                                    {t("text.SelectFileNo")} {""}
                                                    {requiredFields.includes("rFileNumber") && (
                                                        <span
                                                            style={{
                                                                color: formik.values.rFileNumber ? "green" : "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    )}
                                                </span>
                                            }

                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            color="primary"
                                                            aria-label="add"
                                                            sx={{
                                                                backgroundColor: '#77A979',
                                                                '&:hover': { backgroundColor: '#B2EBF2' },
                                                                color: "#fff",
                                                                marginLeft: '110%',
                                                                padding: '4px',
                                                                fontSize: '16px',
                                                                width: '30px',
                                                                height: '30px'
                                                            }}
                                                            onClick={() => {
                                                                if (formik.values.rFileType) {
                                                                    handleClickOpen();
                                                                } else {
                                                                    alert("Please select file type");
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





                            {/* <Grid md={4} item>
                                <TextField
                                    label={t("text.FileNo")}
                                    value={formik.values.rFileNumber}
                                    placeholder={t("text.FileNo")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    name="rFileNumber"
                                    id="rFileNumber"
                                    type="text"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}

                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="add"
                                                    sx={{
                                                        backgroundColor: '#77A979',
                                                        '&:hover': { backgroundColor: '#B2EBF2' },
                                                        color: "#fff",
                                                        marginLeft: '8px',
                                                        padding: '4px',
                                                        fontSize: '16px',
                                                        width: '30px',
                                                        height: '30px'
                                                    }}
                                                    onClick={() => {
                                                        if (formik.values.rFileType) {
                                                            handleClickOpen();
                                                        } else {
                                                            alert("Please select file type");
                                                        }
                                                    }}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid> */}

                            <Dialog open={open} onClose={handleClose} sx={{ width: '100%', height: '100%' }}>
                                <DialogTitle>Select Option</DialogTitle>


                                <DialogContent>

                                    <RadioGroup value={selectedValue} onChange={handleButtonChange}>
                                        <FormControlLabel value="automatic" control={<Radio />} label="Automatic" />
                                        <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                                    </RadioGroup>


                                    {selectedValue === 'automatic' && (
                                        <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>

                                            <Grid item xs={6}>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={SectionOption}
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
                                                                    {t("text.SelectSection")} {""}
                                                                    {requiredFields.includes("rlId") && (
                                                                        <span
                                                                            style={{
                                                                                color: formik.values.rlId ? "green" : "red",
                                                                            }}
                                                                        >
                                                                            *
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            }
                                                        />
                                                    )}
                                                />

                                            </Grid>

                                            <Grid item xs={6}>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={FileOption}
                                                    // value={
                                                    //     ZoneOption.find(
                                                    //         (option) => option.value === formik.values.fileTypeId
                                                    //     ) || null
                                                    // }
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
                                                            label={
                                                                <span>
                                                                    {t("text.SelectFileType")} {""}
                                                                    {requiredFields.includes("rFileType") && (
                                                                        <span
                                                                            style={{
                                                                                color: formik.values.rFileType ? "green" : "red",
                                                                            }}
                                                                        >
                                                                            *
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            }
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
                                                <Button variant="contained" color="primary" onClick={handleButtonClick} >
                                                    Generate
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
                                                <Button variant="contained" color="primary" onClick={() => {
                                                    handleClose();
                                                    fileSubmit();
                                                }}>
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}


                                    {selectedValue === 'manual' && (
                                        <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
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
                                                <Button variant="contained" color="primary" onClick={handleClose}>
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>





                            <Grid md={4} item>
                                <TextField
                                    label={
                                        <span>
                                            {t("text.EnterLetterNumber")} {requiredFields.includes('rLetterNumber') && (
                                                <span style={{ color: formik.values.rLetterNumber ? 'green' : 'red' }}>*</span>
                                            )}
                                        </span>
                                    }
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
                                {formik.touched.rLetterNumber && formik.errors.rLetterNumber ? (
                                    <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.rLetterNumber)}</div>
                                ) : null}
                            </Grid>

                            {selectedOption !== 'dispatch' && (
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

                            {selectedOption !== 'dispatch' && (
                                <Grid md={4} item>
                                    <TextField
                                        id="rPhone"
                                        name="rPhone"
                                        label={
                                            <span>
                                                {t("text.EnterMobNo")}{" "}{requiredFields.includes('rPhone') && (
                                                    <span style={{ color: formik.values.rPhone ? 'green' : 'red' }}>*</span>
                                                )}
                                            </span>
                                        }
                                        value={formik.values.rPhone}
                                        placeholder={t("text.EnterMobNo")}
                                        size="small"
                                        fullWidth
                                        style={{
                                            backgroundColor: 'white',
                                            borderColor: formik.touched.rPhone && formik.errors.rPhone ? 'red' : 'initial',
                                        }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.rPhone && formik.errors.rPhone ? (
                                        <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.rPhone)}</div>
                                    ) : null}
                                </Grid>

                            )}

                            {/* <Grid md={4} item>
                                <TextField
                                    label={t("text.EnterTc")}
                                    value={formik.values.tcNo}
                                    placeholder={t("text.EnterTc")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    name="tcNo"
                                    id="tcNo"
                                    type="text"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid> */}

                            <Grid md={4} item container alignItems="center">
                                <TextField
                                    label={t("text.SendTo")}
                                    value={formik.values.letterBy}
                                    placeholder={t("text.SendTo")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    name="letterBy"
                                    id="letterBy"
                                    type="text"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputProps={{
                                        endAdornment: selectedOption === 'dispatch' && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="add"
                                                    sx={{
                                                        backgroundColor: '#77A979',
                                                        '&:hover': { backgroundColor: '#B2EBF2' },
                                                        color: "#fff",
                                                        marginLeft: '8px',
                                                        padding: '4px',
                                                        fontSize: '16px',
                                                        width: '30px',
                                                        height: '30px'
                                                    }}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={RootOps}
                                    value={
                                        RootOps.find(
                                            (option: any) => option.value === formik.values.routeID
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rootID", newValue?.rootID);

                                        formik.setFieldValue("routeID", newValue?.value);

                                        formik.setFieldTouched("routeID", true);
                                        formik.setFieldTouched("routeID", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectRoot")} {""}
                                                    {requiredFields.includes("routeID") && (
                                                        <span
                                                            style={{
                                                                color: formik.values.routeID ? "green" : "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    )}
                                                </span>
                                            }

                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            color="primary"
                                                            aria-label="add"
                                                            sx={{
                                                                backgroundColor: '#5b6cde',
                                                                '&:hover': { backgroundColor: '#B2EBF2' },
                                                                color: "#fff",
                                                                marginLeft: '110%',
                                                                padding: '4px',
                                                                fontSize: '16px',
                                                                width: '30px',
                                                                height: '30px'
                                                            }}
                                                            onClick={() => {
                                                                if (formik.values.routeID) {
                                                                    getRootPreview();
                                                                } else {
                                                                    alert("Please select root");
                                                                }
                                                            }}
                                                                
                                                          
                                                        >
                                                            <VisibilityIcon/>
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
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
                                        onChange={(e) => otherDocChangeHandler(e, "fileattach_name")}
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
                                        {formik.values.fileattach_name == "" ? (
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
                                                //alt="preview image"

                                                src={formik.values.fileattach_name}
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
                                            onClick={() => modalOpenHandle("fileattach_name")}
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
                                                src={modalImg}
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



                            <Grid item xs={12} container spacing={2}>



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

                            </Grid>





                            {/* <Grid container spacing={2}> */}
                            <Grid xs={12} sm={12} item sx={{ marginTop: "3px" }}>
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
                                            </th>

                                            <th
                                                style={{
                                                    borderLeft: "1px solid black",
                                                    paddingTop: "5px",
                                                    paddingBottom: "5px",
                                                }}
                                            >
                                                {t("text.FileName")}
                                            </th>
                                            <th
                                                style={{
                                                    borderLeft: "1px solid black",
                                                    paddingTop: "5px",
                                                    paddingBottom: "5px",
                                                }}
                                            >
                                                {t("text.PdfFile")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ border: "1px solid black" }}>
                                        {tableData?.map((row: any, index: any) => (
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
                                                        onClick={() => removeExtraRow(row.id)}
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
                                                    {row.pdfName}
                                                </td>
                                                <td
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        borderTop: "1px solid black",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {row.pdfView == "" ? (
                                                        ""
                                                    ) : (
                                                        <embed
                                                            src={row.pdfView}
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
                                                        onClick={() => modalOpenHandle1(row.pdfView)}
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

                                                    <Modal open={Shows} onClose={handlePanClose1}>
                                                        <Box sx={style}>
                                                            {Img == "" ? (
                                                                <img
                                                                    src={nopdf}
                                                                    style={{
                                                                        width: "170vh",
                                                                        height: "75vh",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <embed
                                                                    //alt="preview image"
                                                                    src={Img}
                                                                    style={{
                                                                        width: "170vh",
                                                                        height: "75vh",
                                                                        borderRadius: 10,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Modal>



                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Grid>
                            {/* </asGrid> */}






                            <Grid item xs={12} spacing={2} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid xs={6} style={{ margin: '6px' }}>
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

                                <Grid xs={6} style={{ margin: '6px' }}>
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
                        {/* </Card> */}
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default PageCreateEdit;
