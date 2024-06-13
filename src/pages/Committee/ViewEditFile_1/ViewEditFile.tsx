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
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Checkbox,
    Tabs,
    Tab,
    Table,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import nopdf from "../../../assets/images/nopdf.png";
import api from "../../../utils/Url";
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';




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

    const [isModalOpen, setIsModalOpen] = useState(false);




    const [ParentInst, setParentInst] = useState<any>([
        { value: "-1", label: t("text.SelectParentInstitute") },
    ]);


    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [pageFrom, setPageFrom] = useState<any>('');
    const [pageTo, setPageTo] = useState<any>('');
    const [goToPage, setGoToPage] = useState<any>('');
    const [open, setOpen] = useState(false);



    const toggleDrawer = (open: any) => (event: any) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const toggleRightDrawer = () => {
        setRightDrawerOpen(!rightDrawerOpen);
        setIsDrawerOpen(false);

    };




    const handleTab = (event: any, newValue: any) => {
        setValue(newValue);
    };

    useEffect(() => {
        getTableData();
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
        const collectData = {
            "fileNo": formik.values.fileNo || -1,
            "cDocsFlag": "c",
            "type": 1

            // fDate: formik.values.fDate.toString() || "",
            // toDate: formik.values.perUt.toString() || "",
            // filestatus: "",
            // textSearch: formik.values.textSearch.toString() || "",
            // docMid: formik.values.docMid.toString() || "",
            // fileTypId: "",
            // divisionid: "",
            // user_Id: -1,
        };
        api
            .post(`FileNumber/GetViewEditFileNo`, collectData)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res.data.data));
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        id: res.data.data[index]["pdFid"],

                        synopsis: res.data.data[index]["synopsis"],
                        fileType: res.data.data[index]["fileType"],
                        subject: res.data.data[index]["subject"],
                        fDate: res.data.data[index]["fDate"],
                        perUt: res.data.data[index]["perUt"],



                    });
                }
                setMovementTableData(arr);
            });
    };






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
        },
        selected: {
            backgroundColor: '#90CAF9',
        },
    };






    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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
                        View Edit File
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

                                        formik.setFieldTouched("fileNo", true);
                                        formik.setFieldTouched("fileNo", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectParentInstitute")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />
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
                                    label="Get File Number(RFID)"
                                />

                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <DialogTitle>{"File Number Information"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Here is content of File Number (RFID).
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Close
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
                            <Grid xs={12} sm={12} item >
                                <IconButton
                                    onClick={toggleDrawer(true)}
                                    style={{ marginBottom: '10px', marginLeft: '30px' }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Drawer
                                    anchor='left'
                                    open={isDrawerOpen}
                                    onClose={toggleDrawer(false)}
                                    style={{ zIndex: 1300 }}


                                >
                                    {/* Content of your sidebar */}
                                    <div
                                        role="presentation"
                                        onClick={toggleDrawer(false)}
                                        onKeyDown={toggleDrawer(false)}
                                        style={{ width: '250px', padding: '20px', }}
                                    >
                                        <List>
                                            <ListItem onClick={toggleRightDrawer}>
                                                <ListItemText primary="Split PDF" />
                                            </ListItem>
                                            <ListItem >
                                                <ListItemText primary="Upload Letters" />
                                            </ListItem>
                                            <ListItem >
                                                <ListItemText primary="Make Correspondence" />
                                            </ListItem>
                                            <ListItem >
                                                <ListItemText primary="FLRD" />
                                            </ListItem>
                                            <ListItem >
                                                <ListItemText primary="Print" />
                                            </ListItem>

                                            <ListItem onClick={handleOpenModal}>
                                                <ListItemText primary="Frq. Needed File" />
                                            </ListItem>
                                        </List>
                                    </div>
                                </Drawer>

                                <Drawer
                                    anchor='right'
                                    open={rightDrawerOpen}
                                    onClose={() => setRightDrawerOpen(false)}
                                    style={{ zIndex: 1300 }}
                                >
                                    {/* Content of your right drawer */}
                                    <div
                                        role="presentation"
                                        onClick={e => e.stopPropagation()}
                                        onKeyDown={e => e.stopPropagation()}
                                        style={{ width: '400px', padding: '20px' }}
                                    >


                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                style={{ marginTop: '10px', backgroundColor: "#4DB6AC" }}
                                            >
                                                First
                                            </Button>
                                            <IconButton>
                                                <NavigateBeforeIcon />
                                            </IconButton>
                                            <IconButton>
                                                <NavigateNextIcon />
                                            </IconButton>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                style={{ marginTop: '10px', backgroundColor: "#4DB6AC" }}
                                            >
                                                Last
                                            </Button>
                                        </div>

                                        <TextField
                                            label="Page From"
                                            value={pageFrom}
                                            onChange={(e) => setPageFrom(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            size="small"
                                        />
                                        <TextField
                                            label="Page To"
                                            value={pageTo}
                                            onChange={(e) => setPageTo(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            size="small"
                                        />
                                        <TextField
                                            label="Go To Page"
                                            value={goToPage}
                                            onChange={(e) => setGoToPage(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            size="small"
                                        />

                                        <TextField
                                            label="Comments"
                                            size="small"

                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                // Handle your button click logic here
                                                console.log('Page From:', pageFrom);
                                                console.log('Page To:', pageTo);
                                                console.log('Go To Page:', goToPage);
                                            }}
                                            style={{ marginTop: '20px' }}
                                        >
                                            Search
                                        </Button>


                                    </div>
                                </Drawer>


                                <Modal
                                    open={isModalOpen}
                                    onClose={handleCloseModal}
                                    aria-labelledby="modal-title"
                                    aria-describedby="modal-description"
                                >
                                    <Box sx={style}>
                                        <Button onClick={handleCloseModal}>Close</Button>
                                        <Typography id="modal-title" variant="h5" component="h2" align="center" marginBottom="2%">
                                            Frequency Needed File
                                        </Typography>
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
                                                            paddingBlock: "10",
                                                            paddingTop: "5px",
                                                            paddingBottom: "5px",
                                                            width: "100px",
                                                        }}
                                                    >
                                                        {t("text.SN")}
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



                                                </tr>
                                            </thead>
                                            <tbody style={{ border: "1px solid black" }}>
                                                {MovementTableData.map((row: any, index: any) => (
                                                    <tr key={row.id} style={{ border: "1px solid black" }}>



                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                // textAlign: "center",
                                                                padding: "2px"
                                                            }}
                                                        >
                                                            {row.SN}
                                                        </td>






                                                        <td
                                                            style={{
                                                                borderLeft: "1px solid black",
                                                                borderTop: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {row.File}
                                                        </td>



                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>



                                    </Box>
                                </Modal>




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
                                                    paddingBlock: "10",
                                                    paddingTop: "5px",
                                                    paddingBottom: "5px",
                                                    width: "100px",
                                                }}
                                            >
                                                {t("text.RefrenceNo")}
                                            </th>

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
                                    <tbody style={{ border: "1px solid black" }}>
                                        {MovementTableData.map((row: any, index: any) => (
                                            <tr key={row.id} style={{ border: "1px solid black" }}>



                                                <td
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        borderTop: "1px solid black",
                                                        // textAlign: "center",
                                                        padding: "2px"
                                                    }}
                                                >
                                                    {row.RefrenceNo}
                                                </td>



                                                <td
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        borderTop: "1px solid black",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {row.FileNo}
                                                </td>

                                                <td
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        borderTop: "1px solid black",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {row.FileName}
                                                </td>

                                                <td
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        borderTop: "1px solid black",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {row.File}
                                                </td>

                                                <td
                                                    style={{
                                                        borderLeft: "1px solid black",
                                                        borderTop: "1px solid black",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {row.Date}
                                                    {/* <p onClick={handleReceiveData}>{row.receiver}</p> */}
                                                </td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>


                            </Grid>

                        </Grid>




                        {/* </Card> */}
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default ViewEditFile;
