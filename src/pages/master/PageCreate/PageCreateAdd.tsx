import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Divider,
    Autocomplete,
    Modal,
    Box,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    FormControl,
    FormLabel,
    Collapse
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import nopdf from "../../../assets/images/nopdf.png";
import api from "../../../utils/Url";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast,ToastContainer } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { getISTDate } from "../../../utils/Constant";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getinstId, getId, getdivisionId } from "../../../utils/Constant";
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import SwipeableDrawerRoute from "../../Route/RouteMaster/SwipeableDrawerRoute";
import CustomLabel from "../../../CustomLable";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import Languages from "../../../Languages";


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
    { label: "Hindi", value: "Hindi" },
    { label: "English", value: "English" },
    { label: "Hindi & English", value: "Hindi & English" },
];

const PriorityOps = [
    { label: "Most Immediate", value: "1" },
    { label: "Immediate", value: "2" },
    { label: "Ordanary", value: "3" },
];

type Props = {};

const PageCreateAdd = (props: Props) => {
    const location = useLocation();
    // console.log("location", location.state);
    const userid = getId();
    // console.log("🚀 ~ PageCreateAdd ~ userid:", userid)
    const instid = getinstId();
    const divId = getdivisionId();

    const { t } = useTranslation();
    const { defaultValuestime } = getISTDate();
    const [pdfView, setPdfView] = useState("");
    const [pdfView2, setPdfView2] = useState("");
    const [LetterType, setLetterType] = useState<any>([
        { value: "-1", label: t("text.SelectLetterType") },
    ]);

    const [designationOption, setDesignationOption] = useState<any>([
        { value: "-1", label: t("text.SelectDesignation") },
    ]);

    const [FileOption, setFileOption] = useState<any>([
        { value: "-1", label: t("text.SelectFileType") },
    ]);

    const [userOption, setUserOption] = useState<any>([
        { value: "-1", label: t("text.SelectUser") },
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

    const updateStatus = [
        {value:-1, label:"---select---"},
        {value:1, label:"Achieved Status"},
        {value:2, label:"Waiting"},

    ];

    const clarification = [
        {value:-1, label:"---select---"},
        {value:1, label:"Explanation"},
        {value:2, label:"Large Scale Investigation"},

    ]

    const [drawerOpenUser, setDrawerOpenUser] = useState(false);

    const [drawerData, setDrawerData] = useState<any>([]);

    const [mergedValue, setMergedValue] = useState("");

    const [selectedYear, setSelectedYear] = useState("");
    const [sNo, setSNo] = useState("");
      const [keywords, setKeywords] = useState("");

    const [tableData, setTableData] = useState<any>([]);
  
    const [pdf, setPDF] = useState("");
    const [fileName, setfileName] = useState("");
    const [rootid, setRootid] = useState("");

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
    const [dropDrownList1, setDropDrownList1] = useState<any>("");
    const [dropDrownList2, setDropDrownList2] = useState<any>("");
    const [dropDrownList3, setDropDrownList3] = useState<any>("");
    const [openCollaps, setopenCollaps] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState<any>(null);
    

    const handleCollapse = () => {
        setopenCollaps(prevOpen => !prevOpen);
    };

    const [Shows, setShows] = React.useState(false);
    const [Img, setImg] = useState<any>("");

    const handlePanClose1 = () => {
        setShows(false);
        setSelectedPdf(null);
    };
    const modalOpenHandle1 = (pdfView2:any) => {
        setShows(true);
        setSelectedPdf(pdfView2);
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
        const mergedFieldValue = `${formik.values.rlId || ""}-${formik.values.rFileType || ""
            }-${selectedYear || ""}-${sNo || ""}`;
        setMergedValue(mergedFieldValue);
        formik.setFieldValue("rFileNumber", mergedFieldValue);
    };

    const handleYearChange = (event: any) => {
        setSelectedYear(event.target.value);
    };

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("manual");

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
        formik.setFieldValue("letterBy","received");
        getLetterType();
        getFileType();
        getFileNo();
        getSection();
        getRoot();
        getUser();
        getDesignation();
    }, []);


    const getDesignation = () => {
        const collectData = {
           "designationId": -1
        };
        api.post(`Designation/GetDesignationmaster`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.designationName,
                value: item.designationId,
            }));
            setDesignationOption(arr);
        });
    };


    const getLetterType = () => {
        const collectData = {
            lId: -1,
            inst_id: -1,
            user_id: -1,
            divisionid: -1,
        };
        api.post(`LetterType/GetLetterType`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.lName,
                value: item.lId,
            }));
            setLetterType(arr);
        });
    };

    const getUser = () => {
        const collectData = {
            user_id: "-1"
        };
        api.post(`Auth/GetUSER`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.firsT_NAME,
                value: item.useR_ID,
            }));
           
            setUserOption(arr);
        });
    };

    const getFileNo = () => {
        const collectData = {
            fnId: -1,
            fId: -1,
            inst_id: -1,
            user_id: -1,
            divisionId: -1,
        };
        api.post(`FileNumber/GetFileNumber`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.fileNm,
                value: item.fnId,
            }));
            setFileNoOps(arr);
        });
    };

    const getSection = () => {
        const collectData = {
            id: -1,
            nodeID: -1,
            titleID: -1,
            user_Id: "",
        };
        api.post(`NewNodeMaster/GetNewNodeMaster`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.name,
                value: item.id,
            }));
            setSectionOption(arr);
        });
    };

    const getFileType = () => {
        const collectData = {
            fId: -1,
            inst_id: -1,
            user_id: -1,
            divisionid: -1,
        };
        api.post(`FileType/GetFileType`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.fName,
                value: item.fId,
            }));
            setFileOption(arr);
        });
    };

    const getRoot = () => {
        const collectData = {
            id: -1,
            authorityId: -1,
            routeId: -1,
            officeId: -1,
            committeeOrGroupId: -1,
            auth_DeptId: -1,
            auth_SectionId: -1,
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
        let collectData;
        if (rootid != "") {
            collectData = {
                id: rootid || -1,
                authorityId: -1,
                routeId: -1,
                officeId: -1,
                committeeOrGroupId: -1,
                auth_DeptId: -1,
                auth_SectionId: -1,
            };
        }
        // console.log("collectData", collectData);

        const response = await api.post(
            `RouteMemberCycle/GetRouteMemberCycle`,
            collectData
        );

        // console.log("getData", response.data.data);

        setDrawerData(response.data.data);
        setDrawerOpenUser(true);
    };

    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const handlePanClose = () => {
        setPanOpen(false);
    };

    const [lang, setLang] = useState<Language>("en");

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
                const fileURL = URL.createObjectURL(file);
                formik.setFieldValue("fileattach_name", file.name);
                setPdfView(fileURL);
                const base64 = await ConvertBase64(file);
                formik.setFieldValue(params, base64);
            } else {
                toast.error("Only PDF files are allowed to be uploaded.");
                event.target.value = null;
            }
        }
    };

    let navigate = useNavigate();


    const [toaster, setToaster] = useState(false);

    const formik = useFormik({
        initialValues: {
            rid: -1,
            rlId: 0,
            rLetterNumber: "",
            rPriority: "",
            rLetterSentOn:new Date().toISOString().slice(0, 10),
            rReceivedDate:new Date().toISOString().slice(0, 10),
            dairyDate: defaultValuestime,
            rFileType: 0,
            rFileNumber: 0,
            rLanguage: "",
            rDealHands: 0,
            rSendAdrs: "",
            rPhone: "",
            rSubject: "",
            rRemark: "",
            inst_id: instid,
            user_id: userid,
            createdDate: defaultValuestime,
            refNo: location?.state?.refNo || 0,
            refNoYr: location?.state?.refNoYr || 0,
            attachMentCount: 0,
            letterBy: "",
            oredrremark: "",
            tcNo: "",
            pdfName: "",
            fileattach_name: "",
            divisionid: parseInt(localStorage.getItem("id") + ""),
            pucPending: "y",
            routeID: 0,
            type: 0,
            FileType: 0,
            pdfPath: "",
            pdfBase64: "",
            fileOpenDate:new Date().toISOString().slice(0, 10),
            types: "",
            type_EmpTypeRowTran:[],
            multipleFileAttachTran:[]
        },
        onSubmit: async (values: any) => {
            if (values.rFileType && (!values.rFileNumber || !values.rLetterNumber)) {
                setToaster(true);
                toast.error(
                    "  If select FileType Then Please fill the File Number and Letter Number"
                );
                return;
            };

            if (values.rPhone === "") {
                values.rPhone = null;
            };

            values.type_EmpTypeRowTran = tableData;
            values.multipleFileAttachTran = tableData1;

            
            console.log("values check", values);
            try {
                const response = await api.post(`ReferenceDiary/AddUpdateReferenceDiary`, values);
                if (response.data.isSuccess) {

                    setTimeout(() => {
                        toast.success(response.data.mesg);
                    }, 500);
                   
                   // setToaster(true);
                    
                        navigate(-1);
                    
                } else {
                   // setToaster(true);
                    toast.error(response.data.mesg);
                }
            } catch (error) {
                setToaster(true);
                toast.error("An error occurred while submitting the form.");
            }
        },
    });

    const [fids, setFids] = useState("");

    const fileSubmit = () => {
        const value = {
            fnId: -1,
            fId: fids || "",
            fileNm: formik.values.rFileNumber.toString() || "",
            inst_id: instid,
            user_id: userid,
            createdDate: "2024-05-27T11:34:42.443Z",
            divisionId: divId,
        };
        api.post(`FileNumber/AddUpdateFileNumber`, value).then((res) => {
            if (res.data.isSuccess === true) {
                getFileNo();
                formik.setFieldValue("rFileNumber", res.data.insertedId);

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
            // console.log("file check", fileURL);
            setPdfView2(fileURL);
            setfileName(file.name);
            setPDF(URL.createObjectURL(event.target.files[0]));
            const base64 = await convertBase64(file);
            // console.log("base64 " + base64);
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
            pdfView2: pdfView2,
            srn: -1,
            isDelete: false,
        };

        setTableData((prevTableData: any) => {
            const updatedTableDataed = [...prevTableData, newRows];
            return updatedTableDataed;
        });

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

    

    const addMoreRow1 = () => {
        const newRows = {
            id: tableData1.length + 1,
            hdnid: -1,
            emp: keywords,
            empcode: EmpCode,
            remark: Remark,
            audit: AuditNo,
            seniority: SeniorityNo,
            dofRetirementNo: RetirementDate,
            adate: DateOfApproval,
            sdate: DateOfIssue,
            jdate: DateOfCheck,
            number: SentenceNo,
            dropDrownList1:dropDrownList1?.value,
            Designation:dropDrownList1?.label,
            dropDrownList2:dropDrownList2?.value,
            UpdateStatus:dropDrownList2?.label,
            dropDrownList3:dropDrownList3?.value,
            Clarification:dropDrownList3?.label,
            isDelete: false,
        };
        console.log("🚀 ~ addMoreRow1 ~ newRows:", newRows)
        setTableData1((prevTableData: any) => {
            const updatedTableDataed = [...prevTableData, newRows];
            return updatedTableDataed;
        });
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

    const back = useNavigate();

    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
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
                <Grid item xs={12} container spacing={2} >
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.CreateLetterOrType")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
                    <SwipeableDrawerRoute
                        open={drawerOpenUser}
                        onClose={() => setDrawerOpenUser(!drawerOpenUser)}
                        userData={drawerData}
                    />
                    <Divider />
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        {/* {toaster === false ? "" : <ToastApp />} */}
                        <ToastContainer />
                        <Grid item xs={12} container spacing={2}>
                                <Grid item sm={6} md={6} xs={12}>
                                    <FormControl 
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 20,
                                        marginTop: "13px",
                                    }}>
                                    <Grid>
                                        <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        defaultValue="received"
                                        onChange={(event) => {
                                            console.log("radio value check", event.target.value);
                                            formik.setFieldValue("letterBy",event.target.value);
                                            // console.log("🚀 ~ PageCreateAdd ~ formik.values.letterBy:", formik.values.letterBy)
                                        }}
                                        >
                                        <FormControlLabel
                                            value="received"
                                            control={<Radio />}
                                            label={t("text.Received")}
                                        />
                                        <FormControlLabel
                                            value="dispatch"
                                            control={<Radio />}
                                            label={t("text.Dispatch")}
                                        />
                                        <FormControlLabel
                                            value="received/dispatch"
                                            control={<Radio />}
                                            label={t("text.RecOrDisp")}
                                        />
                                        </RadioGroup>
                                    </Grid>
                                    </FormControl>
                                </Grid>

                            <Grid item sm={6} md={6} xs={12}>
                                <FormControl
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 20,
                                        marginTop: "13px",
                                        // marginLeft: "12px",
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
                                            defaultValue="G"
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

                            {/* <Grid sm={2} md={2} xs={12}></Grid> */}

                            <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={LetterType}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rlId", newValue?.value);

                                        formik.setFieldTouched("rlId", true);
                                        formik.setFieldTouched("rlId", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={<CustomLabel text={t('text.SelectLetterType')}  />} />
                                    )}
                                />
                            </Grid>

                            {formik.values.letterBy !== "dispatch" && formik.values.letterBy !== "received/dispatch" && (
                                <Grid item lg={4} md={4} xs={12}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={PriorityOps}
                                        fullWidth
                                        size="small"
                                        onChange={(event, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("rPriority", newValue?.value + "");

                                            formik.setFieldTouched("rPriority", true);
                                            formik.setFieldTouched("rPriority", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text={t('text.SelectPriority')}  />} />
                                        )}
                                    />
                                </Grid>
                            )}

                            <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={LanguageOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("rLanguage", newValue?.value + "");

                                        formik.setFieldTouched("rLanguage", true);
                                        formik.setFieldTouched("rLanguage", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={<CustomLabel text={t('text.SelectLanguage')}  />} />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={FileOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("rFileType", newValue?.value);
                                        setFids(newValue?.value);
                                        formik.setFieldTouched("rFileType", true);
                                        formik.setFieldTouched("rFileType", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={<CustomLabel text={t('text.SelectFileType')}  />} />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
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
                                            label={<CustomLabel text={t('text.SelectFileNo')}  />}
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
                                                            label={<CustomLabel text={t('text.SelectSection')}  />}
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
                                                            label={<CustomLabel text={t('text.SelectFileType')}  />}
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
                                                    label={<CustomLabel text={t('text.FileNo')} required={false} />}
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
                                                    {t('text.Submit')}
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
                                                    label={<CustomLabel text={t('text.FileNo')} required={false} />}
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
                                                   {t('text.Submit')}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>

                            <Grid lg={4} md={4} xs={12} item>
                                <TextField
                                    label={<CustomLabel text={t('text.EnterLetterNumber')} required={false} />}
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

                            {formik.values.letterBy !== "dispatch" && formik.values.letterBy !== "received/dispatch"  && (
                                <Grid lg={4} md={4} xs={12} item>
                                    <TextField
                                        type="date"
                                        label={<CustomLabel text={t('text.LetterSentOn')} required={false} />}
                                        value={formik.values.rLetterSentOn}
                                        placeholder={t("text.LetterSentOn")}
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

                            <Grid lg={4} md={4} xs={12} item>
                                <TextField
                                    type="date"
                                    label={<CustomLabel text={t('text.ReceivedData')} required={false} />}
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

                            <Grid lg={4} md={4} xs={12} item>
                                <TextField
                                    type="date"
                                    label={<CustomLabel text={t('text.fileOpenDate')} required={false} />}
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

                            {formik.values.letterBy !== "dispatch" && formik.values.letterBy !== "received/dispatch"  && (
                                <Grid lg={4} md={4} xs={12} item>
                                    <TextField
                                        id="rPhone"
                                        name="rPhone"
                                        label={<CustomLabel text={t('text.EnterMobNo')} required={false} />}
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

                            {formik.values.letterBy !== "dispatch" && formik.values.letterBy !== "received/dispatch"  && (
                                <Grid lg={4} md={4} xs={12} item>
                                    <TextField
                                        label={<CustomLabel text={t('text.SendTo')} required={false} />}
                                        // value={formik.values.rSendAdrs}
                                        placeholder={t("text.SendTo")}
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
                            )}

                            {formik.values.letterBy !== "received" && (
                                <Grid item lg={4} md={4} xs={12}>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={userOption}
                                                    fullWidth
                                                    size="small"
                                                    onChange={(event, newValue: any) => {
                                                        console.log(newValue?.value);

                                                        formik.setFieldValue("", newValue?.value);

                                                        formik.setFieldValue("", newValue?.label);

                                                        // formik.setFieldTouched("rFileType", true);
                                                        // formik.setFieldTouched("rFileType", false);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={<CustomLabel text={t('text.SendTo')} required={false} />}
                                                        />
                                                    )}
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
  {formik.values.letterBy !== "dispatch" && formik.values.letterBy !== "received/dispatch" && (
                            <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={RootOps}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("rootID", newValue?.rootID);
                                        setRootid(newValue?.rootID);
                                        formik.setFieldValue("routeID", newValue?.value);
                                        formik.setFieldTouched("routeID", true);
                                        formik.setFieldTouched("routeID", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t('text.SelectRoot')} required={false} />}
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
  )}
                            
                            <Grid md={12} item>
                            <TranslateTextField
                          label={t("text.Subject")}
                          value={formik.values.rSubject}
                          onChangeText={(text: string) =>
                            handleConversionChange("rSubject", text)
                          }
                          required={true}
                          lang={lang}
                        />
                            </Grid>

                           

                            <Grid md={12} item>
                            <TranslateTextField
                          label={t("text.SentBy")}
                          value={formik.values.rSendAdrs}
                          onChangeText={(text: string) =>
                            handleConversionChange("rSendAdrs", text)
                          }
                          required={true}
                          lang={lang}
                        />
                               
                            </Grid>


                            <Grid md={12} item>
                            <TranslateTextField
                          label={t("text.Discription")}
                          value={formik.values.rRemark}
                          onChangeText={(text: string) =>
                            handleConversionChange("rRemark", text)
                          }
                          required={true}
                          lang={lang}
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
                                        label={<CustomLabel text={t('text.EnterDocUpload')} required={false} />}
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
                                                src={pdfView}
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
                                                src={pdfView}
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

                            
                            <Grid item xs={12} container spacing={2}>
                                <Grid xs={12} lg={2.5} item>
                                    <TextField
                                        id="pdf"
                                        name="pdf"
                                        label={<CustomLabel text={t('text.AttachedFile')} required={false} />}
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
                                                        width:"10vw",
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
                                                </td>

                                                <td
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        borderTop: "1px solid black",
                                                        // textAlign: "center",
                                                        width:"30vw",
                                                        paddingRight:"5px",
                                                        paddingLeft:"5px"
                                                    }}
                                                >
                                                    {row.pdfName}
                                                </td>
                                                <td
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        borderTop: "1px solid black",
                                                        textAlign: "center",
                                                        width:"30vw",
                                                        display:"flex",
                                                        alignItems:"center",
                                                        justifyContent:"space-around",
                                                        padding:"2px"
                                                    }}
                                                >
                                                    {row.pdfView2 == "" ? (
                                                        ""
                                                    ) : (
                                                        <embed
                                                            src={row.pdfView2}
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
                                                        onClick={() => modalOpenHandle1(row.pdfView2)}
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
                                                        {selectedPdf  === "" ? (
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
                                                                    src={selectedPdf}
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
                                                style={{ backgroundColor: "#f5f5f5", color: "#000" }}
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
                                                            display: "table-cell",
                                                            gap:10

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
                                                                options={designationOption}
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
                                                                    setDropDrownList1(newValue);
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
                                                                options={updateStatus}
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
                                                                    setDropDrownList2(newValue);
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
                                                                options={clarification}
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
                                                                    setDropDrownList3(newValue);
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
                                                            {row.emp}
                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.empcode}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.remark}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.audit}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.seniority}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.dofRetirementNo}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.adate}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.sdate}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.jdate}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.number}

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
                    <ToastContainer />
                </CardContent>
            </div>
        </div>
    );
};
export default PageCreateAdd;