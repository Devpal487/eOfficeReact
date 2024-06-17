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
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import FastForwardIcon from '@mui/icons-material/FastForward';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import MessageIcon from '@mui/icons-material/Message';
import MailIcon from '@mui/icons-material/Mail';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { getinstId, getId, getdivisionId } from "../../../utils/Constant";

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

const AuthorityMail = (props: Props) => {

    const { t } = useTranslation();


    const [value, setValue] = useState(0);
    const [MovementTableData, setMovementTableData] = useState<any>([]);

    const [MsgTableData, setMsgTableData] = useState<any>([]);
    const [LetterTableData, setLetterTableData] = useState<any>([]);

    const [ParentInst, setParentInst] = useState<any>([
        { value: "-1", label: t("text.SelectFileNo") },
    ]);

    const [tableLoading, setIsTableLoading] = useState(false);

    //dialog entry
    const [fileID, setFileID] = useState("");



    const userId = getId();


    const handleTab = (event: any, newValue: any) => {
        setValue(newValue);
    };

    useEffect(() => {
         getTableData(1);
        // getMoveTableData();
        //getFileNo();
    }, []);

    // const getFileNo = () => {
    //     const collectData = {
    //         "fnId": -1,
    //         "fId": -1,
    //         "inst_id": -1,
    //         "user_id": -1,
    //         "divisionId": -1
    //     };
    //     api
    //         .post(`FileNumber/GetFileNumber`, collectData)
    //         .then((res) => {
    //             const arr = res.data.data.map((item: any) => ({
    //                 label: item.fileNm,
    //                 value: item.fnId,
    //             }));
    //             setParentInst(arr);
    //         });
    // };

    const getTableData = (type:any) => {
        setIsTableLoading(true);
        const collectData = {
            "hdnAuthMail": userId,
            "Type": type+""


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
            fileLable: ""


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

                            {value <=3  && (
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
                                                            {index +1}
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
                                                            {row.CreatedDate}
                                                           
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