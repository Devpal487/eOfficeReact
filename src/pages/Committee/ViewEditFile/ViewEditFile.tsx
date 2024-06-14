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
import { EditIcons, UploadIcons, PasteIcons, PrintIcons, PendingIcons, UpgradeIcons, FileCopyIcons, FilemoveIcons, HighlightIcons, SmsIcons, MakeIcons, ArchiveIcons } from "../../../utils/icons";
import CustomLabel from "../../../CustomLable";
import FindInPageIcon from '@mui/icons-material/FindInPage';


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "120vh",
    height: "85vh",
    bgcolor: "#f5f5f5",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 10,
};

type Props = {};

const ViewEditFile = (props: Props) => {

    const { t } = useTranslation();

    const [getFileNumber, setGetFileNumber] = useState(false);
    const [value, setValue] = useState(0);
    const [MovementTableData, setMovementTableData] = useState<any>([]);
    const [fileMovementTableData, setFileMovementTableData] = useState<any>([]);
    const [pdfView, setPdfView] = useState("");
    const { defaultValuestime } = getISTDate();
    const [ParentInst, setParentInst] = useState<any>([
        { value: "-1", label: t("text.SelectFileNo") },
    ]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [isHover1, setIsHover1] = useState(false);
    const [pdfData, setPDFData] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setIsTableLoading] = useState(false);
    const [openModals, setOpenModals] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const [fileMovementDetailopen, setFileMovementDetailOpen] = useState(false);
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('md');

    //dialog entry
    const [fileID, setFileID] = useState("");

    const handlefileMovementDetailOpen = () => {
        setFileMovementDetailOpen(true);
        setIsDrawerOpen(true);
    };

    const handlefileMovementDetailClose = () => {
        setFileMovementDetailOpen(false);
        setIsDrawerOpen(true);
    };

    const handleMouseOver = (index: any) => {
        setActiveItem(index);
    };

    const handleMouseOut = () => {
        setActiveItem(null);
    };

    const listItemStyle = (index: any) => ({
        cursor: 'pointer',
        padding: '5px 15px',
        margin: "1%",
        color: 'black',
        borderRadius: '10px',
        border: '1px solid #dcdcdc',
        transition: 'all 0.3s ease',
        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
        justifyContent: 'space-between',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        borderRightStyle: 'solid',
        activeStyle: {
            backgroundColor: '#b3c7c4',
            color: '#00009c',
        }
    });


    const activeStyle = {
        backgroundColor: '#b1ccc8',
        color: '#00009c',
    };

    const toggleDrawer = (open: any) => (event: any) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const toggleRightDrawer = () => {
        setRightOpen(!rightOpen);
        setIsDrawerOpen(true);

    };

    const toggleRight = () => {
        setRightOpen(!rightOpen);
        setIsDrawerOpen(false);

    };

    const handleTab = (event: any, newValue: any) => {
        setValue(newValue);
    };

    useEffect(() => {
        // getTableData();
        // getMoveTableData();
        getFileNo();
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
                    label: item.fileNm,
                    value: item.fnId,
                }));
                setParentInst(arr);
            });
    };

    const getTableData = () => {
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
                setMovementTableData(arr);
                setIsTableLoading(false);
            });
    };


    const getMoveTableData = () => {
        // setIsTableLoading(true);
        const collectData = {
            "fileNo": formik.values.fileNo,
            "cDocsFlag": "C",
            "type": 2


        };
        api
            .post(`FileNumber/GetFileMovementDetail`, collectData)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res.data.data));
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        //id: res.data.data[index]["rid"],
                        designation: res.data.data[index]["designation"],
                        lastStatus: res.data.data[index]["lastStatus"],
                        fileRdate: res.data.data[index]["fileRdate"],
                        updateremark: res.data.data[index]["updateremark"],
                        authorityLevel: res.data.data[index]["authorityLevel"],




                    });
                }
                setFileMovementTableData(arr);
                // setIsTableLoading(false);
            });
    };


    const farwordData = () => {

        const value = {

            "eid": localStorage.getItem("useR_ID"),
            "fileNo":formik.values.fileLable.toString() || "",
            "remark": 0,
            "hdnjurisdiction":parseInt(localStorage.getItem('id') + ""),
            "hdnFilNu":formik.values.fileNo,
            "hdnAuthMail": "",
            "status": ""
            // "caId": -1,
            // "cId": 0,
            // "fileNo": 0,
            // "cFileNm": "",
            // "cFileDesc": formik.values.FileDesc.toString() || "",
            // "cDocsFlag": formik.values.fileattach_name.toString() || "",
            // "inst_id": 0,
            // "user_id": 0,
            // "createdDate": defaultValuestime,
            // "rId": 0,
            // "divisionid": parseInt(localStorage.getItem('id') + ""),
        };
        api
            .post(`FileMovement/SP_ForwardFileApi`, value)
            .then((res) => {
                if (res.data.isSuccess) {


                    toast.success(res.data.mesg);



                }


            });
    };

    let collectData: {
        fileNo: any;
        cDocsFlag: string;
        type: number;
    } | undefined;



    let navigate = useNavigate();

    const handleCheckboxChange = (event: any) => {
        setGetFileNumber(event.target.checked);
        if (event.target.checked) {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

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
            fileLable:""


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


    const LetterSubmit = () => {

        const value = {
            "caId": -1,
            "cId": 0,
            "fileNo": 0,
            "cFileNm": "",
            "cFileDesc": formik.values.FileDesc.toString() || "",
            "cDocsFlag": formik.values.fileattach_name.toString() || "",
            "inst_id": 0,
            "user_id": 0,
            "createdDate": defaultValuestime,
            "rId": 0,
            "divisionid": parseInt(localStorage.getItem('id') + ""),
        };
        api
            .post(`CreateNewFileAttach/AddUpdateCreateNewFileAttach`, value)
            .then((res) => {
                if (res.data.isSuccess) {

                    // getFileNo();
                    // formik.setFieldValue('rFileNumber', res.data.insertedId);  
                    toast.success(res.data.mesg);



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
        },
        selected: {
            backgroundColor: '#90CAF9',
        },
    };

    const getFileData = (rid: any) => {
        console.log("RID", rid)
        setIsLoading(true);
        const collectData = {
            "rid": rid,
            "rlId": -1,
            "rFileType": -1,
            "inst_id": -1,
            "user_id": "",
            "fromdate": "1900-06-13T14:09:45.560Z",
            "todate": defaultValuestime,
            "refNo": -1,
            "divisionid": -1,
            "type": 1
        };

        console.log("collectData " + JSON.stringify(collectData));
        api
            .post(`ReferenceDiary/GetReferenceDiary`, collectData)
            .then((response) => {
                console.log(
                    "check pdf",
                    response?.data?.data[0]["pdfBase64"]
                );
                setPDFData(response?.data?.data[0]["pdfBase64"]);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    };

    const handleMouseEntered = () => {
        setIsHover1(true);
    };

    const handleMouseLeaveed = () => {
        setIsHover1(false);
    };

    const handleAddCommentClicks = (row: any) => {
        getFileData(row.rid);
        setOpenModals(true);
    };

    const handleCloseModals = () => {
        setOpenModals(false);
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
            console.log(file);
            const fileNameParts = file.name.split(".");
            const fileExtension = fileNameParts[fileNameParts.length - 1];

            if (fileExtension.toLowerCase() === "pdf") {
                const fileURL = URL.createObjectURL(file);
                console.log("file check", fileURL);
                setPdfView(fileURL);
                const base64 = await ConvertBase64(file);
                formik.setFieldValue(params, base64);


            } else {
                alert("Only PDF files are allowed to be uploaded.");
                event.target.value = null;
            }
        }
    };

    const items = [
        { text: " Split Pdf", icon: <EditIcons />, onClick: () => { navigate("/Committee/SplitPDF"); console.log("Clicked SplitPdf"); } },
        { text: " Upload Letters", icon: <UploadIcons />, onClick: () => { toggleRight(); console.log("Clicked UploadLetters"); } },
        { text: " Make Correspondence", icon: <MakeIcons />, onClick: () => { navigate("/Committee/Correspondence"); console.log("Clicked MakeCorrespondence"); } },
        { text: " FLRD", icon: <PasteIcons />, },
        { text: " Print", icon: <PrintIcons />, },
        { text: " Update Remark", icon: <UpgradeIcons />, onClick: () => { console.log("Clicked UpdateRemark"); } },
        { text: " Pending PUC", icon: <PendingIcons />, onClick: () => { console.log("Clicked PendingPUC"); } },
        {
            text: " File Movement Details", icon: <FilemoveIcons />,
            onClick: () => {



                if (formik.values.fileNo) {
                    handlefileMovementDetailOpen();
                    getMoveTableData();
                } else {
                    toast.error("Please select file Number");
                }

            }
        },
        { text: " Moved To Awaited List", icon: <FileCopyIcons />, onClick: () => { console.log("Clicked MovedToAwaitedList"); } },
        { text: " Moved To Parked Or Archived List", icon: <ArchiveIcons />, onClick: () => { console.log("Clicked MovedToParkedOrAchiveList"); } },
        { text: " Close The File", icon: <HighlightIcons />, onClick: () => { console.log("Clicked MovedToParkedOrAchiveList"); } },
        { text: " File Summary", icon: <SmsIcons />, onClick: () => { console.log("Clicked FileSummery"); } },
    ];

    // console.log("Drawer Items:", items);
    // console.log("Drawer Items:");


    const back = useNavigate();

    const handleForwardData = async () => {
        //toast.success("forward clicked");
        farwordData();
       
    }
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
                        {t("text.ViewEditFile")}
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
                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={ParentInst}
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
                                        formik.setFieldValue("fileLable", newValue?.lable);

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

                            <Grid item lg={2} xs={12} >
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

                                {/* <FindInPageIcon onClick={getTableData}

                                    style={{
                                        backgroundColor: "#059669",
                                        color: "white",

                                    }}
                                /> */}


                            </Grid>


                            <Grid item lg={6} xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={getFileNumber}
                                            onChange={handleCheckboxChange}
                                            name="getFileNumber"
                                            color="primary"
                                        />
                                    }
                                    label={t("text.GetFileNoRFID")}
                                />

                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>{"File Number Information"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t("text.HereIsContentOfFileNo")} (RFID).
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="rfid"
                                            label="RFID"
                                            type="text"
                                            fullWidth
                                        // onChange={handleTextFieldChange}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button color="primary">{t("text.Submit")}</Button>
                                        <Button onClick={handleClose} color="primary">
                                            {t("text.Close")}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Grid>


                            <Grid item lg={12} xs={12}>
                                <Tabs
                                    value={value}
                                    onChange={handleTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                    variant="fullWidth"
                                >

                                    <Tab
                                        label="Notesheet"
                                        sx={value === 0 ? tabStyle.selected : tabStyle.default}
                                    />
                                    <Tab
                                        label="Correspondence"
                                        sx={value === 1 ? tabStyle.selected : tabStyle.default}
                                    />
                                    <Tab
                                        label="Report"
                                        sx={value === 2 ? tabStyle.selected : tabStyle.default}
                                    />
                                    <Tab
                                        label="Other1"
                                        sx={value === 3 ? tabStyle.selected : tabStyle.default}
                                    />
                                    <Tab
                                        label="Other2"
                                        sx={value === 4 ? tabStyle.selected : tabStyle.default}
                                    />
                                    <Tab
                                        label="Other3"
                                        sx={value === 5 ? tabStyle.selected : tabStyle.default}
                                    />
                                </Tabs>
                            </Grid>
                        </Grid>

                        <Divider />
                        <br />

                        <Grid item xs={12} container spacing={2}>
                            <Grid xs={12} sm={12} item>
                                <IconButton
                                    onClick={toggleDrawer(true)}
                                    style={{ marginBottom: "10px", marginLeft: "30px" }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Drawer
                                    anchor="left"
                                    open={isDrawerOpen}
                                    // onClose={toggleDrawer(false)}
                                    style={{ zIndex: 1300 }}
                                >

                                    <div style={{
                                        backgroundColor: "#00009c",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        height: "50px"
                                    }}>
                                        <Typography fontWeight="600" align="center" color="#fff" sx={{ margin: 6 }}>Menu </Typography>
                                        <IconButton
                                            edge="end"
                                            onClick={toggleDrawer(false)}
                                            aria-label="close"
                                            sx={{ color: "#fff", position: "absolute", right: 20, top: 5 }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                    <Divider />
                                    <div
                                        role="presentation"
                                        onClick={toggleDrawer(false)}
                                        onKeyDown={toggleDrawer(false)}
                                        style={{ width: "300px" }}
                                    >
                                        <List>
                                            {items.map((item, index) => (
                                                <ListItem
                                                    key={index}
                                                    sx={{
                                                        ...listItemStyle(index),
                                                        ...(activeItem === index && activeStyle),
                                                        "&:hover": {
                                                            backgroundColor: "#b1ccc8",
                                                        },
                                                        width: "95%",
                                                    }}
                                                    onMouseOver={() => handleMouseOver(index)}
                                                    onMouseOut={handleMouseOut}
                                                    onClick={item.onClick}
                                                >
                                                    {item.icon}{" "}
                                                    <ListItemText primary={item.text} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </div>
                                </Drawer>
                                {/* {fileID === "" ? <>{toast.error("First Select File Number then proceed further process...")}</> :  */}
                                <>
                                    <Dialog
                                        open={fileMovementDetailopen}
                                        // onClose={handlefileMovementDetailClose}
                                        fullWidth={fullWidth}
                                        maxWidth={maxWidth}
                                    // sx={{backgroundColor:"#f4f4f5"}}
                                    >
                                        <DialogTitle
                                            // style={{ cursor: "move" }}
                                            // id="draggable-dialog-title"
                                            sx={{
                                                backgroundColor: "#f4f4f5", display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Typography fontWeight="600">File Movement Details for :- <i>#{fileID}</i> </Typography>
                                            <IconButton
                                                edge="end"
                                                onClick={handlefileMovementDetailClose}
                                                aria-label="close"
                                                sx={{ color: "#000", position: "absolute", right: 17, top: 3 }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </DialogTitle>
                                        <Divider />
                                        <DialogContent
                                            sx={{ backgroundColor: "#f4f4f5" }}
                                        >
                                            <DialogContentText>
                                                <Table
                                                    style={{
                                                        borderCollapse: "collapse",
                                                        width: "97%",
                                                        border: "1px solid black",
                                                        // marginLeft: "30px",
                                                    }}
                                                >
                                                    <thead
                                                        style={{
                                                            backgroundColor: "#00009c",
                                                            color: "#f5f5f5",
                                                        }}
                                                    >
                                                        <tr>
                                                            <th
                                                                style={{
                                                                    borderLeft: "1px solid black",
                                                                    paddingBlock: "10",
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
                                                                    width: "100px",
                                                                }}
                                                            >
                                                                Authority
                                                            </th>
                                                            <th
                                                                style={{
                                                                    borderLeft: "1px solid black",
                                                                    paddingTop: "5px",
                                                                    paddingBottom: "5px",
                                                                }}
                                                            >
                                                                Route Status
                                                            </th>
                                                            <th
                                                                style={{
                                                                    borderLeft: "1px solid black",
                                                                    paddingTop: "5px",
                                                                    paddingBottom: "5px",
                                                                    width: "100px",
                                                                }}
                                                            >
                                                                File Rec. on
                                                            </th>
                                                            <th
                                                                style={{
                                                                    borderLeft: "1px solid black",
                                                                    paddingTop: "5px",
                                                                    paddingBottom: "5px",
                                                                }}
                                                            >
                                                                File Movement Remark
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ border: "1px solid black" }}>
                                                        {fileMovementTableData.map((row: any, index: any) => (
                                                            <tr key={row.id} style={{ border: "1px solid black" }}>
                                                                <td
                                                                    style={{
                                                                        borderLeft: "1px solid black",
                                                                        borderTop: "1px solid black",
                                                                        // textAlign: "center",
                                                                        padding: "2px",
                                                                    }}
                                                                >
                                                                    {row.SrNo}
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        borderLeft: "1px solid black",
                                                                        borderTop: "1px solid black",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {row.designation}
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        borderLeft: "1px solid black",
                                                                        borderTop: "1px solid black",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {row.lastStatus}
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        borderLeft: "1px solid black",
                                                                        borderTop: "1px solid black",
                                                                        textAlign: "center",
                                                                        cursor: "pointer",
                                                                        color: isHover1 ? "blue" : "black",
                                                                        textDecoration: isHover1 ? "underline" : "none",
                                                                    }}
                                                                >
                                                                    {row.fileRdate}
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        borderLeft: "1px solid black",
                                                                        borderTop: "1px solid black",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {row.updateremark}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </DialogContentText>
                                        </DialogContent>

                                        <DialogActions
                                            sx={{ backgroundColor: "#f4f4f5", justifyContent: 'center' }}

                                        >
                                            <Button autoFocus onClick={handleClose}>
                                                Backward
                                            </Button>
                                            <Button autoFocus onClick={handleForwardData}>
                                                Forward
                                            </Button>
                                            <Button autoFocus onClick={handleClose}>
                                                View Routes
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </>
                                {/* } */}
                                <Table
                                    style={{
                                        borderCollapse: "collapse",
                                        width: "97%",
                                        border: "1px solid black",
                                        marginLeft: "30px",
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
                                                {t("text.FileNo")}
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
                                                {t("text.File")}
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
                                                        {row.fileNo}
                                                    </td>

                                                    <td
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            borderTop: "1px solid black",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {row.fileNm}
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
                                                        <a onMouseEnter={handleMouseEntered}
                                                            onMouseLeave={handleMouseLeaveed}
                                                            onClick={() => handleAddCommentClicks(row)}> {row.cFileNm}</a>
                                                    </td>

                                                    <Dialog
                                                        open={openModals}
                                                        keepMounted
                                                        aria-describedby="alert-dialog-slide-description"
                                                        TransitionComponent={Transition}
                                                        maxWidth="xl"
                                                    >
                                                        <DialogTitle sx={{}}>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                }}
                                                            >
                                                                <>
                                                                    <Typography fontWeight="600">
                                                                        {row.cFileNm}
                                                                    </Typography>
                                                                </>
                                                                <>
                                                                    <IconButton
                                                                        aria-label="close"
                                                                        onClick={handleCloseModals}
                                                                    >
                                                                        <CloseIcon />
                                                                    </IconButton>{" "}
                                                                </>
                                                            </div>
                                                        </DialogTitle>
                                                        {isLoading ? (
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
                                                            <>
                                                                {pdfData ? (
                                                                    <embed
                                                                        src={pdfData}
                                                                        style={{
                                                                            height: "90vh",
                                                                            width: "100vh",
                                                                            border: "1px solid gray",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                            margin: 10,
                                                                        }}
                                                                    >
                                                                        No PDF Available
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </Dialog>

                                                    <td
                                                        style={{
                                                            borderLeft: "1px solid black",
                                                            borderTop: "1px solid black",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {row.date}
                                                        {/* <p onClick={handleReceiveData}>{row.receiver}</p> */}
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    )}
                                </Table>

                                <Drawer
                                    anchor="right"
                                    open={rightOpen}
                                    //onClose={() => setRightOpen(false)}
                                    style={{ zIndex: 1300, }}
                                >
                                    <div style={{
                                        backgroundColor: "#00009c",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        height: "50px"
                                    }}>
                                        <Typography fontWeight="600" align="center" color="#fff" sx={{ margin: 6 }}>Upload Letter </Typography>
                                        <IconButton
                                            edge="end"
                                            onClick={toggleRightDrawer}
                                            aria-label="close"
                                            sx={{ color: "#fff", position: "absolute", right: 20, top: 5 }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                    <Divider />
                                    {/* Content of your right drawer */}
                                    <div
                                        role="presentation"
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        style={{ width: "400px", padding: "20px" }}
                                    >

                                        <Grid item lg={12} xs={12}>
                                            <TextField
                                                type="file"
                                                // value={formik.values.fileattach_name}
                                                inputProps={{ accept: "application/pdf" }}
                                                InputLabelProps={{ shrink: true }}
                                                label={<CustomLabel text={t("text.EnterDocUpload")} />}
                                                size="small"
                                                fullWidth
                                                style={{ backgroundColor: "white" }}
                                                onChange={(e) =>
                                                    otherDocChangeHandler(e, "fileattach_name")
                                                }
                                            />
                                        </Grid>

                                        <Grid item lg={12} xs={12} style={{ marginTop: "10%" }}>
                                            <TextField
                                                label={<CustomLabel text={t("text.EnterFileDescription")} />}
                                                value={formik.values.FileDesc}
                                                placeholder={t("text.EnterFileDescription")}
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                fullWidth
                                                name="FileDesc"
                                                id="FileDesc"
                                                type="text"
                                                style={{ backgroundColor: "white" }}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </Grid>

                                        <Grid
                                            item
                                            lg={12}
                                            xs={12}
                                            style={{
                                                marginTop: "5%",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    LetterSubmit();
                                                    setRightOpen(false);
                                                }}
                                            >
                                                {t("text.Upload")}
                                            </Button>
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>
                        </Grid>

                        {/* </Card> */}
                    </form>
                </CardContent>
            </div>
            <ToastApp />
        </div>
    );
};

export default ViewEditFile;