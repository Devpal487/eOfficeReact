import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Divider,
    Autocomplete,
    FormControlLabel,
    IconButton,
    Checkbox,
    Tabs,
    Tab,
    Table,
    Drawer,
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Slide,
    colors,
    Box,
    Modal,
    Radio,
    FormControl,
    FormLabel,
    RadioGroup,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import api from "../../../utils/Url";
import MenuIcon from '@mui/icons-material/Menu';
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CustomizedProgressBars from "../../../components/Loader";
import { toast } from "react-toastify";
import { getISTDate } from "../../../utils/Constant";
import Dialog, { DialogProps } from '@mui/material/Dialog';
import ToastApp from "../../../ToastApp";
import { EditIcons, UploadIcons, PasteIcons, PrintIcons, PendingIcons, UpgradeIcons, FileCopyIcons, FilemoveIcons, HighlightIcons, SmsIcons, MakeIcons, ArchiveIcons, CloseIcons } from "../../../utils/icons";
import CustomLabel from "../../../CustomLable";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import FastForwardIcon from '@mui/icons-material/FastForward';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import MessageIcon from '@mui/icons-material/Message';
import MailIcon from '@mui/icons-material/Mail';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { getinstId, getId, getdivisionId } from "../../../utils/Constant";
import ReactQuill from "react-quill";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// const style = {
//     position: "absolute" as "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: "120vh",
//     height: "85vh",
//     bgcolor: "#f5f5f5",
//     border: "1px solid #000",
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 10,
// };


const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

type Props = {};

const AuthorityMail = (props: Props) => {

    const { t } = useTranslation();


    const [value, setValue] = useState(0);
    const [MovementTableData, setMovementTableData] = useState<any>([]);

    const [MsgTableData, setMsgTableData] = useState<any>([]);
    const [LetterTableData, setLetterTableData] = useState<any>([]);

    const [SectionOps, setSectionOps] = useState<any>([
        { value: "-1", label: t("text.SelectSection") },
    ]);

    const [AuthOps, setAuthOps] = useState<any>([
        { value: "-1", label: t("text.SelectSection") },
    ]);

    const [tableLoading, setIsTableLoading] = useState(false);
    const [Awaitopen, setAwaitopen] = useState(false);
    const [pdfView, setPdfView] = useState("");
    const [editorContent, setEditorContent] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState('section');

    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
    };

    const [selectedValue, setSelectedValue] = useState('M');

    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
    };


    const userId = getId();

    const instId: any = getinstId();

    const divId: any = getdivisionId();



    const handleEditorChange = (content: any) => {
        const textWithoutTags = content.replace(/<[^>]*>/g, '').trim(); // Remove HTML tags
        console.log("textWithoutTags", textWithoutTags);
        setEditorContent(textWithoutTags);
    };


    //dialog entry
    const [fileID, setFileID] = useState("");





    const handleTab = (event: any, newValue: any) => {
        setValue(newValue);
    };

    useEffect(() => {
        formik.setFieldValue("letterBy", "M");
        formik.setFieldValue("Auth", "section");
        getTableData(1);

        getSection();
        getAuthority();
    }, []);

    const getSection = () => {
        const collectData = {
            "id": -1,
            "department": "",
            "section": "",
            "instid": -1,
            "sesid": "",
            "uid": ""
        };
        api
            .post(`SectionMaster/GetSectionMaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.section,
                    value: item.id,
                }));
                setSectionOps(arr);
            });
    };

    const getAuthority = () => {
        const collectData = {
            "id": -1,
            "officeId": -1,
            "under_id": -1,
            "divisionid": -1
        };
        api
            .post(`AuthorityMaster/GetAuthorityMaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.authorityType,
                    value: item.id,
                }));
                setAuthOps(arr);
            });
    };

    const handleAWaitOpen = () => {
        console.log("await is clicked");
        setAwaitopen(true);
    };
    const handleAWaitClose = () => {
        setAwaitopen(false);
    };

    const getTableData = (type: any) => {
        setIsTableLoading(true);
        const collectData = {
            "hdnAuthMail": userId,
            "Type": type + ""


        };
        api
            .post(`FileMovement/Getsp_AuthortyMail`, collectData)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res.data.data));
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        FMRId: res.data.data[index]["fmrId"],
                        FNId: res.data.data[index]["fnId"],
                        SId: res.data.data[index]["sId"],
                        AuthorityType: res.data.data[index]["authorityType"],
                        Csubject: res.data.data[index]["csubject"],
                        SendByAuth: res.data.data[index]["sendByAuth"],
                        CreatedDate: res.data.data[index]["createdDate"],
                        Message: res.data.data[index]["Message"],
                        SendBy: res.data.data[index]["SendBy"],
                        SendDate: res.data.data[index]["SendDate"],
                        DSFNAme: res.data.data[index]["SendDate"],
                        fileNm: res.data.data[index]["fileNm"]

                    });
                }
                setMovementTableData(arr);
                setIsTableLoading(false);
            });
    };


    const getMsgTableData = () => {
        setIsTableLoading(true);
        const collectData = {
            "fileNo": formik.values.fileNo,
            "cDocsFlag": "C",
            "type": 2


        };
        api
            .post(`FileNumber/GetViewEditFileNo`, collectData)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res.data.data));
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        id: res.data.data[index]["rid"],
                        rid: res.data.data[index]["rid"],
                        fileNo: res.data.data[index]["fileNo"],
                        fileNm: res.data.data[index]["fileNm"],
                        cFileNm: res.data.data[index]["cFileNm"],
                        date: res.data.data[index]["date"],




                    });
                }
                setMsgTableData(arr);
                setIsTableLoading(false);
            });
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



    const getLetterTableData = () => {
        setIsTableLoading(true);
        const collectData = {
            "fileNo": formik.values.fileNo,
            "cDocsFlag": "C",
            "type": 2


        };
        api
            .post(`FileNumber/GetViewEditFileNo`, collectData)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res.data.data));
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        id: res.data.data[index]["rid"],
                        rid: res.data.data[index]["rid"],
                        fileNo: res.data.data[index]["fileNo"],
                        fileNm: res.data.data[index]["fileNm"],
                        cFileNm: res.data.data[index]["cFileNm"],
                        date: res.data.data[index]["date"],

                    });
                }
                setLetterTableData(arr);
                setIsTableLoading(false);
            });
    };





    let collectData: {
        fileNo: any;
        cDocsFlag: string;
        type: number;
    } | undefined;



    let navigate = useNavigate();



    const requiredFields = ["pdfName"];

    const formik = useFormik({
        initialValues: {
            // pdFid: -1,
            pdfName: "",
            docMid: 0,
            keywords: "",
            subFtype: "",
            pDate: "",
            locatId: 0,
            isMain: "y",
            entryDate: new Date().toISOString().slice(0, 10),
            pdfPath: "",
            pdfPathbyte: "",
            user_id: -1,
            fileNo: "",
            FileDesc: "",
            fileattach_name: "",
            fileLable: "",
            subject: "",
            Authority: 0,
            Section: 0,
            letterBy: "",
            Auth: "",
            base64:""



        },

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


    const receiptsValue = selectedOption === 'section' ? null : (formik.values.Authority?.toString() || "");

    const sidValue = selectedOption === 'section' ? null : (formik.values.Authority || "");


    const addCompose = () => {
        const value = {
            "fmrid": -1,
            "hdnmes": formik.values.letterBy.toString() || "",
            "authorityId": 0,
            "dsid": -1,
            "ddivisionId": 0,
            "dletterNo": "",
            "dSubject": formik.values.subject.toString() || "",
            "userid": userId,
            "instid": instId,
            "dflag": "",
            "status": "",
            "message": "",
            "rcipients": receiptsValue,
            "sid": sidValue,
            "divisionid": divId,
            "sendby": 0,
            "authType": formik.values.Auth.toString() || "",
            "fileName":formik.values.fileattach_name.toString() || "",
            "pdfDoc":formik.values.base64.toString() || "",
        };

        api.post(`FileMovement/Addsp_Authmaillettersendcls`, value).then((res) => {
            if (res.data.isSuccess) {
                toast.success(res.data.mesg);
                handleAWaitClose();
            } else {
                toast.error(res.data.mesg);
            }
        });
    };



    const tabStyle = {
        '&:hover': {
            backgroundColor: '#90CAF9'
        },
        default: {
            backgroundColor: 'transparent',
            '&:hover': {
                backgroundColor: '#f0f0f0'
            },
            color: '#000',
        },
        selected: {
            backgroundColor: '#90CAF9',
            color: '#000 !important',
        },
    };





    const handleRadioChange = (event: any) => {
        const value = event.target.value;
        setSelectedOption(value);
        formik.setFieldValue('Auth', value);
    };





    // console.log("Drawer Items:", items);
    // console.log("Drawer Items:");


    const back = useNavigate();


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
                        {t("text.AthorityMail")}
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
                    <Divider />
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        <Grid item xs={12} container spacing={2}>

                            <Grid item lg={12} xs={12}>
                                <Tabs
                                    value={value}
                                    onChange={handleTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                    variant="fullWidth"
                                >

                                    {/* <Tab
                                       icon={<InboxIcon />}
                                        label="Inbox"
                                        sx={value === 0 ? tabStyle.selected : tabStyle.default}
                                        onClick={getTableData}
                                    /> */}


                                    <Tab
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <InboxIcon />
                                                <Box component="span" ml={1}>
                                                    Inbox
                                                </Box>
                                            </Box>
                                        }
                                        sx={value === 0 ? tabStyle.selected : tabStyle.default}

                                        onClick={(event) => {
                                            getTableData("1");

                                        }}
                                    />

                                    <Tab
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <SendIcon />
                                                <Box component="span" ml={1}>
                                                    Sent
                                                </Box>
                                            </Box>
                                        }
                                        sx={value === 1 ? tabStyle.selected : tabStyle.default}
                                        onClick={(event) => {
                                            getTableData("S");

                                        }}
                                    />


                                    <Tab
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <FastForwardIcon />
                                                <Box component="span" ml={1}>
                                                    Important
                                                </Box>
                                            </Box>
                                        }
                                        sx={value === 2 ? tabStyle.selected : tabStyle.default}
                                        onClick={(event) => {
                                            getTableData("I");

                                        }}
                                    />

                                    <Tab
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <SaveAsIcon />
                                                <Box component="span" ml={1}>
                                                    Draft
                                                </Box>
                                            </Box>
                                        }
                                        sx={value === 3 ? tabStyle.selected : tabStyle.default}
                                        onClick={(event) => {
                                            getTableData("D");

                                        }}
                                    />

                                    <Tab
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <MessageIcon />
                                                <Box component="span" ml={1}>
                                                    Message
                                                </Box>
                                            </Box>
                                        }
                                        sx={value === 4 ? tabStyle.selected : tabStyle.default}
                                        onClick={(event) => {
                                            getTableData("M");

                                        }}
                                    />

                                    <Tab
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <MailIcon />
                                                <Box component="span" ml={1}>
                                                    Letter
                                                </Box>
                                            </Box>
                                        }
                                        sx={value === 5 ? tabStyle.selected : tabStyle.default}
                                        onClick={(event) => {
                                            getTableData("L");

                                        }}
                                    />


                                    <Tab
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <ArrowCircleRightIcon />
                                                <Box component="span" ml={1}>
                                                    Trash
                                                </Box>
                                            </Box>
                                        }
                                        sx={value === 6 ? tabStyle.selected : tabStyle.default}
                                        onClick={(event) => {
                                            getTableData("T");

                                        }}
                                    />

                                </Tabs>
                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <TextField

                                    value={formik.values.fileNo}
                                    name="fileNo"
                                    id="fileNo"
                                    //InputLabelProps={{ shrink: true }}
                                    label={<CustomLabel text={t("text.FileNo")} />}
                                    placeholder={t("text.FileNo")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white", }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                            </Grid>


                            <Grid item lg={2} xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAWaitOpen}
                                    fullWidth
                                >
                                    compose
                                </Button>
                            </Grid>

                            <Modal
                                open={Awaitopen}
                                onClose={handleAWaitClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ ...style, maxHeight: '95vh', overflowY: 'auto' }}>
                                    <IconButton
                                        edge="end"
                                        onClick={handleAWaitClose}
                                        aria-label="close"
                                        sx={{ color: "black", marginLeft: "97%" }}
                                    >
                                        <CloseIcons />
                                    </IconButton>

                                    <Typography
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                    >
                                        New Message/Letter
                                    </Typography>

                                    <Divider />

                                    <Grid
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        sx={{ marginTop: 1 }}
                                    >
                                        <Grid item sm={12} md={12}>
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    aria-label="options"
                                                    name="options"
                                                    defaultValue="M"
                                                    onChange={(event) => {
                                                        console.log("radio value check", event.target.value);
                                                        formik.setFieldValue("letterBy", event.target.value);
                                                    }}
                                                    style={{ display: "flex", flexDirection: "row" }}
                                                >
                                                    <FormControlLabel value="M" control={<Radio />} label="Message" />
                                                    <FormControlLabel value="L" control={<Radio />} label="Letter" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                        <Grid item sm={12} md={12}>
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    aria-label="options"
                                                    name="options"
                                                    value={selectedOption}
                                                    defaultValue="section"
                                                    onChange={handleRadioChange}
                                                    style={{ display: "flex", flexDirection: "row" }}
                                                >
                                                    <FormControlLabel value="section" control={<Radio />} label="Section" />
                                                    <FormControlLabel value="authority" control={<Radio />} label="Authority" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={selectedOption === 'section' ? SectionOps : AuthOps}
                                                fullWidth
                                                size="small"
                                                onChange={(event, newValue: any) => {
                                                    console.log(newValue?.value);
                                                    formik.setFieldValue(selectedOption === 'section' ? "Section" : "Authority", newValue?.value);
                                                    formik.setFieldTouched(selectedOption === 'section' ? "Section" : "Authority", true);
                                                    formik.setFieldTouched(selectedOption === 'section' ? "Section" : "Authority", false);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={<CustomLabel text={selectedOption === 'section' ? t("text.SelectSection") : t("text.SelectAuthority")} />}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                label={<CustomLabel text="Subject" />}
                                                value={formik.values.subject}
                                                placeholder="Subject"
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                fullWidth
                                                name="subject"
                                                id="subject"
                                                style={{ backgroundColor: "white" }}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </Grid>

                                        <Grid container spacing={1} item>
                                            <Grid
                                                xs={12}
                                                md={6}
                                                sm={6}
                                                item
                                                style={{ marginBottom: "30px", marginTop: "30px" }}
                                            >
                                                <TextField
                                                    type="file"
                                                    inputProps={{ accept: "application/pdf" }}
                                                    InputLabelProps={{ shrink: true }}
                                                    label={<strong style={{ color: "#000" }}>{t("text.EnterDocUpload")}</strong>}
                                                    size="small"
                                                    fullWidth
                                                    style={{ backgroundColor: "white" }}
                                                    onChange={(e) => otherDocChangeHandler(e, "base64")}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <ReactQuill
                                                value={editorContent}
                                                onChange={handleEditorChange}
                                                modules={modules}
                                                formats={formats}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ marginY: 2 }} />

                                    <Grid item xs={4}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={addCompose}
                                            fullWidth
                                            style={{ marginLeft: "98%" }}
                                        >
                                            Send
                                        </Button>
                                    </Grid>
                                </Box>
                            </Modal>
                            {/* <Grid item lg={2} xs={12} >
                                <Button
                                    onClick={getTableData}

                                    style={{
                                        backgroundColor: "#059669",
                                        color: "white",
                                        width: "85%"

                                    }}

                                >
                                    {t("text.Search")}
                                </Button>

                                


                            </Grid> */}





                        </Grid>

                        <Divider />
                        <br />

                        <Grid item xs={12} container spacing={2}>

                            {value <= 3 && (
                                <Grid xs={12} sm={12} item>


                                    <Table
                                        style={{
                                            borderCollapse: "collapse",
                                            width: "100%",
                                            border: "1px solid black",

                                        }}
                                    >
                                        <thead
                                            style={{
                                                backgroundColor: "#2196f3",
                                                color: "#f5f5f5",
                                            }}
                                        >
                                            <tr>

                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                        width: "100px",
                                                    }}
                                                >
                                                    {t("text.SrNo")}
                                                </th>
                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",

                                                    }}
                                                >
                                                    {t("text.FromTo")}
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
                                                        width: "100px",
                                                    }}
                                                >
                                                    {t("text.Subject")}
                                                </th>
                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                    }}
                                                >
                                                    {t("text.Date")}
                                                </th>
                                            </tr>
                                        </thead>
                                        {tableLoading ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    margin: 10,
                                                }}
                                            >
                                                <CustomizedProgressBars />
                                            </div>
                                        ) : (
                                            <tbody style={{ border: "1px solid black" }}>

                                                {MovementTableData.map((row: any, index: any) => (
                                                    <tr key={row.id} style={{ border: "1px solid black" }}>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                // textAlign: "center",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </td>

                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.AuthorityType}
                                                        </td>



                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                                // cursor: "pointer",
                                                                // color: "blue",
                                                                //textDecoration: "underline",
                                                            }}

                                                        >
                                                            {row.fileNm}
                                                        </td>


                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.Csubject}

                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {dayjs(row.CreatedDate).format('DD-MM-YYYY')}


                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        )}
                                    </Table>


                                </Grid>

                            )}


                            {value === 4 && (
                                <Grid xs={12} sm={12} item>


                                    <Table
                                        style={{
                                            borderCollapse: "collapse",
                                            width: "100%",
                                            border: "1px solid black",

                                        }}
                                    >
                                        <thead
                                            style={{
                                                backgroundColor: "#2196f3",
                                                color: "#f5f5f5",
                                            }}
                                        >
                                            <tr>


                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                        width: "100px",
                                                    }}
                                                >
                                                    {t("text.Subject")}
                                                </th>
                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                    }}
                                                >
                                                    {t("text.Msg")}
                                                </th>
                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                        width: "100px",
                                                    }}
                                                >
                                                    {t("text.SendBy")}
                                                </th>
                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                    }}
                                                >
                                                    {t("text.SendDate")}
                                                </th>
                                            </tr>
                                        </thead>
                                        {tableLoading ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    margin: 10,
                                                }}
                                            >
                                                <CustomizedProgressBars />
                                            </div>
                                        ) : (
                                            <tbody style={{ border: "1px solid black" }}>

                                                {MovementTableData.map((row: any, index: any) => (
                                                    <tr key={row.id} style={{ border: "1px solid black" }}>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                // textAlign: "center",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {row.Csubject}
                                                        </td>

                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.Message}
                                                        </td>



                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                                color: "blue",
                                                                textDecoration: "underline",
                                                            }}
                                                        >
                                                            {row.SendBy}
                                                        </td>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.SendDate}
                                                            {/* <p onClick={handleReceiveData}>{row.receiver}</p> */}
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        )}
                                    </Table>


                                </Grid>

                            )}

                            {value === 5 && (
                                <Grid xs={12} sm={12} item>


                                    <Table
                                        style={{
                                            borderCollapse: "collapse",
                                            width: "100%",
                                            border: "1px solid black",

                                        }}
                                    >
                                        <thead
                                            style={{
                                                backgroundColor: "#2196f3",
                                                color: "#f5f5f5",
                                            }}
                                        >
                                            <tr>


                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                        width: "100px",
                                                    }}
                                                >
                                                    {t("text.Subject")}
                                                </th>
                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                    }}
                                                >
                                                    {t("text.Msg")}
                                                </th>
                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                        width: "100px",
                                                    }}
                                                >
                                                    {t("text.SendBy")}
                                                </th>
                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                    }}
                                                >
                                                    {t("text.SendDate")}
                                                </th>

                                                <th
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        paddingTop: "5px",
                                                        paddingBottom: "5px",
                                                    }}
                                                >
                                                    {t("text.DSFName")}
                                                </th>
                                            </tr>
                                        </thead>
                                        {tableLoading ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    margin: 10,
                                                }}
                                            >
                                                <CustomizedProgressBars />
                                            </div>
                                        ) : (
                                            <tbody style={{ border: "1px solid black" }}>

                                                {MovementTableData.map((row: any, index: any) => (
                                                    <tr key={row.id} style={{ border: "1px solid black" }}>
                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                // textAlign: "center",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {row.Csubject}
                                                        </td>

                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.Message}
                                                        </td>



                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                                color: "blue",
                                                                textDecoration: "underline",
                                                            }}

                                                        >
                                                            {row.SendBy}
                                                        </td>


                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.SendDate}
                                                            {/* <p onClick={handleReceiveData}>{row.receiver}</p> */}
                                                        </td>

                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.DSFNAme}
                                                            {/* <p onClick={handleReceiveData}>{row.receiver}</p> */}
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        )}
                                    </Table>


                                </Grid>

                            )}






                        </Grid>

                        {/* </Card> */}
                    </form>
                </CardContent>
            </div>
            <ToastApp />
        </div>
    );
};

export default AuthorityMail;