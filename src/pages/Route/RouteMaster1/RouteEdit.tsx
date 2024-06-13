import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Divider,
    TextField,
    CardContent,
    Typography,
    Tab, Tabs,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import api from "../../../utils/Url";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import auth from '../../../assets/images/authority.png'
import comm from '../../../assets/images/committee.png'
import grp from '../../../assets/images/group.png'

export default function RouteEdit() {
    const back = useNavigate();
    const { i18n, t } = useTranslation();

    const [fileOption, setFileOption] = useState([{ value: "-1", label: t("text.FileType") }]);
    const [departmentOption, setDepartmentOption] = useState([{ value: "-1", label: t("text.FileType") }]);
    const [authorityOption, setAuthorityOpotion] = useState([{ value: "-1", label: "Select Authority" }]);
    const [committeeOption, setCommitteeOption] = useState([{ value: "-1", label: "Select Committee" }]);

    const [selectedValue, setSelectedValue] = useState<any>(null);
    const numberOfCards = parseInt(selectedValue);

    const [nodeType, setNodeType] = useState<any>([{ value: 1, label: "Authority" }]);
    const nodeTypeOptions = [
        { value: 1, label: "Authority" },
        { value: 2, label: "Committee" },
        { value: 3, label: "Group" },
    ];
    const [cardTabValues, setCardTabValues] = useState<Array<number>>(Array.from({ length: numberOfCards }, () => 0));

    const [isCommitteeChecked, setIsCommitteeChecked] = useState(false);

    useEffect(() => {
        getFileData();
        getDepartmentData();
        getAuthorityData();
    }, []);

    const getFileData = async () => {
        const collectData = {
            "fId": -1,
            "inst_id": -1,
            "user_id": -1,
            "divisionid": -1
        }

        await api.post(`FileType/GetFileType`, collectData)
            .then((res: any) => {
                const arr: any = [];
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res.data.data[index]["fName"],
                        value: res.data.data[index]["fId"]
                    })
                }
                setFileOption(arr);
            })
    }

    const getDepartmentData = async () => {
        const collectData = {
            "departmentId": -1
        }

        await api.post(`Department/GetDepartmentmaster`, collectData)
            .then((res: any) => {
                const arr: any = [];
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res.data.data[index]["departmentName"],
                        value: res.data.data[index]["departmentId"]
                    })
                }
                setDepartmentOption(arr);
            })
    }

    const getAuthorityData = async () => {
        const collectData = {
            "id": -1,
            "officeId": -1,
            "under_id": -1,
            "divisionid": -1
        }

        await api.post(`AuthorityMaster/GetAuthorityMaster`, collectData)
            .then((res: any) => {
                const arr: any = [];
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res.data.data[index]["authorityType"],
                        value: res.data.data[index]["departidmentId"]
                    })
                }
                setAuthorityOpotion(arr);
            })
    }

    const getCommitteeData = async () => {
        const collectData = {
            "id": -1,
            "committeeName": "",
            "officeId": -1,
            "userId": "",
            "ipAddress": "",
            "type": ""
        }

        await api.post(`CommitteeMaster/GetCommitteeMaster`, collectData)
            .then((res: any) => {
                const arr: any = [];
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res.data.data[index]["committeeName"],
                        value: res.data.data[index]["id"]
                    })
                }
                setCommitteeOption(arr);
            })
    }


    const handleCheckboxChange = (event: any) => {
        getCommitteeData();
        setIsCommitteeChecked(event.target.checked);
    };


    const handleNodeTypeChange = (newValue: any, cardIndex: number) => {
        const updatedNodeTypes = [...nodeType];
        updatedNodeTypes[cardIndex] = newValue?.value;
        setNodeType(updatedNodeTypes);
    };

    const handleCardTabChange = (newValue: number, cardIndex: number) => {
        const updatedTabValues = [...cardTabValues];
        updatedTabValues[cardIndex] = newValue;
        console.log("check values", updatedTabValues);
        setCardTabValues(updatedTabValues);
    };


    const formik = useFormik({
        initialValues: {
            sId: "-1",
            subject: "",
            userId: "",
            createdDate: "2024-04-16T07:38:31.368Z",
            user_id: 1,
            inst_id: 1,
            srn: 0,
            FileType: ""
        },
        onSubmit: async (values) => {
            // console.log("check", values);

            // const response = await axios.post(
            //     HOST_URL.HOST_URL2 + `SubjectMasterForPdf/AddUpdateSubjectMasterForPdf`,
            //     values
            // );
            // if (response.data.isSuccess) {
            //     setToaster(false);
            //     toast.success(response.data.mesg);
            //     formik.resetForm();
            //     getList();
            //     setEditId("-1");
            // } else {
            //     setToaster(true);
            //     toast.error(response.data.mesg);
            // }

        },
    });

    const handleAutocompleteChange = (event: React.SyntheticEvent, value: any) => {
        setSelectedValue(value);
    };


    const renderCards = () => {
        if (selectedValue === null) {
            return null;
        }

        const numberOfCards = parseInt(selectedValue);

        const cards = Array.from({ length: numberOfCards }, (_, index) => (
            <Grid item xs={4} key={index}>
                <Card style={{ marginBottom: '10px', marginTop: "10px", backgroundColor: "#f4f4f7" }}>
                    <CardContent >
                        <CardContent sx={{ padding: 0 }}>
                            <Grid style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2>Level {index + 1}</h2>
                                <Grid xs={5} item>
                                    <Autocomplete
                                        disablePortal
                                        id={`node-type-combo-box-${index}`}
                                        fullWidth
                                        size="small"
                                        options={nodeTypeOptions}
                                        onChange={(event, newValue) => handleNodeTypeChange(newValue, index)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Node Type" />
                                        )}
                                    />

                                </Grid>
                            </Grid>
                        </CardContent>

                        <Divider />
                        <br />

                        <Box sx={{ bgcolor: 'background.paper' }}>
                            <Tabs
                                value={nodeType[index] === 1}
                                onChange={(event, newValue) => handleCardTabChange(newValue, index)}
                                variant="scrollable"
                                scrollButtons={false}
                                aria-label="scrollable prevent tabs example"
                            >
                                {nodeType[index] === 1 && (<Tab label="Authority" value={1} />)}
                                {nodeType[index] === 2 && (<Tab label="Committe" value={2} />)}
                                {nodeType[index] === 3 && (<Tab label="Group" value={3} />)}
                                <Tab label="Committe/Group Parameters" value={0} />
                            </Tabs>
                        </Box>

                        <br />

                        {cardTabValues[index] === 0 ? (<>
                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={12} container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>Authority is required to transfer file over : </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>Mode</Typography>
                                    </Grid>
                                    <Grid item xs={4}>

                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>Priority</Typography>
                                    </Grid>
                                </Grid>
                                <Divider />

                                <Grid container item xs={12} gap={2}>
                                    <Grid item xs={3}>
                                        <FormControl component="fieldset">

                                            <FormGroup aria-label="position" row>
                                                <FormControlLabel
                                                    value="SubRoute"
                                                    control={<Checkbox />}
                                                    label="Sub Route"
                                                    labelPlacement="end"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="subRoute name"
                                            placeholder="subRoute name"
                                            value="" />
                                    </Grid>
                                    <Grid xs={3} item>

                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            // options={ZoneOption}
                                            fullWidth
                                            size="small"
                                            options={[0, 1, 2,]}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select Priority" />
                                            )}
                                        />

                                    </Grid>
                                </Grid>

                                <Grid container item xs={12} gap={2}>
                                    <Grid item xs={3}>
                                        <FormControl component="fieldset">

                                            <FormGroup aria-label="position" row>
                                                <FormControlLabel
                                                    value="Committee"
                                                    // control={<Checkbox />}
                                                    control={<Checkbox onChange={handleCheckboxChange} />}
                                                    label="Committee"
                                                    labelPlacement="end"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        {isCommitteeChecked ? (
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                // open={isCommitteeChecked}
                                                // onOpen={getCommitteeData}
                                                options={committeeOption}
                                                fullWidth
                                                size="small"
                                                onChange={formik.handleChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Select Committee Name" />
                                                )}
                                            />) : (<TextField
                                                fullWidth
                                                size="small"
                                                label=""
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />)}
                                    </Grid>
                                    <Grid xs={3} item>

                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            // options={ZoneOption}
                                            fullWidth
                                            size="small"
                                            options={[0, 1, 2,]}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select Priority" />
                                            )}
                                        />

                                    </Grid>
                                </Grid>

                                <Grid container item xs={12} gap={2}>
                                    <Grid item xs={3}>
                                        <FormControl component="fieldset">

                                            <FormGroup aria-label="position" row>
                                                <FormControlLabel
                                                    value="Group"
                                                    control={<Checkbox />}
                                                    label="Group"
                                                    labelPlacement="end"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="Group name"
                                            placeholder="Group name"
                                            value="" />
                                    </Grid>
                                    <Grid xs={3} item>

                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            // options={ZoneOption}
                                            fullWidth
                                            size="small"
                                            options={[0, 1, 2,]}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select Priority" />
                                            )}
                                        />

                                    </Grid>
                                </Grid>
                            </Grid>
                        </>) : (
                            <>
                                {nodeType[index] === 1 && (
                                    <>
                                        <Grid item xs={12} container spacing={2} marginBottom={5}>
                                            <Grid xs={6} item>

                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={departmentOption}
                                                    fullWidth
                                                    size="small"
                                                    // value={selectedValue}
                                                    onChange={formik.handleChange}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Select Department" />
                                                    )}
                                                />

                                            </Grid>

                                            <Grid xs={6} item>

                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    fullWidth
                                                    size="small"
                                                    options={[2, 3, 4, 5, 6, 7]}
                                                    value={selectedValue}
                                                    // onChange={handleAutocompleteChange}

                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Select Section" />
                                                    )}
                                                />

                                            </Grid>

                                            <Grid xs={6} item>

                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    fullWidth
                                                    size="small"
                                                    options={authorityOption}
                                                    onChange={formik.handleChange}
                                                    // value={selectedValue}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Select Authority" />
                                                    )}
                                                />

                                            </Grid>

                                            <Grid xs={6} item>
                                                <TextField
                                                    id="zoneName"
                                                    name="zoneName"
                                                    label="Employee Name"
                                                    //   value={formik.values.zoneName}
                                                    placeholder="Employee Name"
                                                    size="small"
                                                    fullWidth
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>

                                            <Grid xs={6} item alignItems="center" justifyContent="center">
                                                <img src={auth} alt="Authority" height="100px" />
                                            </Grid>

                                            <Grid xs={6} item>
                                                <TextField
                                                    id="zoneName"
                                                    name="zoneName"
                                                    label="Designation"
                                                    //   value={formik.values.zoneName}
                                                    placeholder="Designation"
                                                    size="small"
                                                    fullWidth
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} container spacing={2}>

                                                <Grid xs={4} item>
                                                    <FormControl component="fieldset">

                                                        <FormGroup aria-label="position" row>
                                                            <FormLabel component="legend" defaultValue="email">Notify by :</FormLabel>
                                                            <FormControlLabel
                                                                value="email"
                                                                control={<Checkbox />}
                                                                label="E-Mail"
                                                                labelPlacement="end"
                                                            />

                                                            <FormControlLabel
                                                                value="sms"
                                                                control={<Checkbox />}
                                                                label="SMS"
                                                                labelPlacement="end"
                                                            />
                                                        </FormGroup>
                                                    </FormControl>
                                                </Grid>

                                                <Grid xs={4} item>
                                                    <TextareaAutosize
                                                        aria-label="empty textarea"
                                                        placeholder="Enter Message"
                                                        style={{
                                                            width: "200px",
                                                            fontSize: " 1.075rem",
                                                            fontWeight: "400",
                                                            lineHeight: "6",
                                                            padding: "8px 12px",
                                                            borderRadius: "4px",
                                                        }}
                                                        //   value={formik.values.descriptionOfTender}
                                                        onChange={(e:any)=>{
                                                            console.log("message", e.target.value);
                                                            formik.setFieldValue("message", e.target.value)
                                                        }}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </Grid>

                                            </Grid >
                                        </Grid>
                                    </>
                                )}
                                {nodeType[index] === 2 && (
                                    <>
                                        <Grid item xs={12} container spacing={2} marginBottom={5}>
                                            <Grid xs={6} item container alignItems="center" justifyContent="center">
                                                <img src={comm} alt="Committee" height="100px" />
                                            </Grid>
                                            <Grid item xs={6} container spacing={2}>
                                                <Grid item lg={12} xs={12}>
                                                    <TextField
                                                        id="zoneName"
                                                        name="zoneName"
                                                        label="Enter Committee Name"
                                                        //   value={formik.values.zoneName}
                                                        placeholder="Enter Committee Name"
                                                        size="small"
                                                        fullWidth
                                                    //   onChange={formik.handleChange}
                                                    //   onBlur={formik.handleBlur}
                                                    />
                                                </Grid>

                                                <Grid item lg={12} xs={12}>
                                                    <TextField
                                                        id="zoneCode"
                                                        name="zoneCode"
                                                        label="Enter Description"
                                                        //   value={formik.values.zoneCode}
                                                        placeholder="Enter Description"
                                                        size="small"
                                                        fullWidth
                                                    //   onChange={formik.handleChange}
                                                    //   onBlur={formik.handleBlur}
                                                    />
                                                </Grid>
                                            </Grid>


                                            <Grid item xs={12} container spacing={2}>

                                                <Grid xs={4} item>
                                                    <FormControl component="fieldset">

                                                        <FormGroup aria-label="position" row>
                                                            <FormLabel component="legend" defaultValue="email">Notify by :</FormLabel>
                                                            <FormControlLabel
                                                                value="email"
                                                                control={<Checkbox />}
                                                                label="E-Mail"
                                                                labelPlacement="end"
                                                            />

                                                            <FormControlLabel
                                                                value="sms"
                                                                control={<Checkbox />}
                                                                label="SMS"
                                                                labelPlacement="end"
                                                            />
                                                        </FormGroup>
                                                    </FormControl>
                                                </Grid>

                                                <Grid xs={4} item>
                                                    <TextareaAutosize
                                                        aria-label="empty textarea"
                                                        placeholder="Enter Message"
                                                        style={{
                                                            width: "200px",
                                                            fontSize: " 1.075rem",
                                                            fontWeight: "400",
                                                            lineHeight: "6",
                                                            padding: "8px 12px",
                                                            borderRadius: "4px",
                                                        }}
                                                        //   value={formik.values.descriptionOfTender}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </Grid>

                                                {/* </Grid> */}
                                            </Grid >
                                        </Grid>

                                    </>
                                )}
                                {nodeType[index] === 3 && (
                                    <>
                                        <Grid item xs={12} container spacing={2} marginBottom={5}>
                                            <Grid xs={6} item container alignItems="center" justifyContent="center">
                                                <img src={grp} alt="Group" height="50px" />
                                            </Grid>
                                            <Grid item xs={6} container spacing={2}>
                                                <Grid item lg={12} xs={12}>
                                                    <TextField
                                                        id="zoneName"
                                                        name="zoneName"
                                                        label="Enter Group Name"
                                                        //   value={formik.values.zoneName}
                                                        placeholder="Enter Group Name"
                                                        size="small"
                                                        fullWidth
                                                    //   onChange={formik.handleChange}
                                                    //   onBlur={formik.handleBlur}
                                                    />
                                                </Grid>

                                                <Grid item lg={12} xs={12}>
                                                    <TextField
                                                        id="zoneCode"
                                                        name="zoneCode"
                                                        label="Enter Description"
                                                        //   value={formik.values.zoneCode}
                                                        placeholder="Enter Description"
                                                        size="small"
                                                        fullWidth
                                                    //   onChange={formik.handleChange}
                                                    //   onBlur={formik.handleBlur}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} container spacing={2}>

                                                <Grid xs={4} item>
                                                    <FormControl component="fieldset">

                                                        <FormGroup aria-label="position" row>
                                                            <FormLabel component="legend" defaultValue="email">Notify by :</FormLabel>
                                                            <FormControlLabel
                                                                value="email"
                                                                control={<Checkbox />}
                                                                label="E-Mail"
                                                                labelPlacement="end"
                                                            />

                                                            <FormControlLabel
                                                                value="sms"
                                                                control={<Checkbox />}
                                                                label="SMS"
                                                                labelPlacement="end"
                                                            />
                                                        </FormGroup>
                                                    </FormControl>
                                                </Grid>

                                                <Grid xs={4} item>
                                                    <TextareaAutosize
                                                        aria-label="empty textarea"
                                                        placeholder="Enter Message"
                                                        style={{
                                                            width: "200px",
                                                            fontSize: " 1.075rem",
                                                            fontWeight: "400",
                                                            lineHeight: "6",
                                                            padding: "8px 12px",
                                                            borderRadius: "4px",
                                                        }}
                                                        //   value={formik.values.descriptionOfTender}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </Grid>

                                                {/* </Grid> */}
                                            </Grid >
                                        </Grid>
                                    </>
                                )}

                            </>)}
                    </CardContent>
                </Card>
            </Grid>
        ));

        return (
            <Grid container spacing={2}>
                {cards}
            </Grid>
        );
    };


    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    //   border: ".5px solid #FF7722",
                    marginTop: "3vh"
                }}
            >

                <CardContent>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        style={{ fontSize: "18px", fontWeight: 500 }}
                    >
                        Create Route
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
                        <Grid item xs={12} container spacing={3}>

                            <Grid xs={5} item>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={fileOption}
                                    value={
                                        fileOption.find(
                                            (option: any) => option.value === formik.values.FileType
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("FileType", newValue?.value);
                                        formik.setFieldTouched("FileType", true);
                                        formik.setFieldTouched("FileType", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={
                                            <span>
                                                {t("text.FileType")} {""}

                                            </span>
                                        } />
                                    )}
                                />
                            </Grid>

                            <Grid xs={5} item>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    // options={ZoneOption}
                                    fullWidth
                                    size="small"
                                    options={[1, 2, 3, 4, 5, 6, 7]}
                                    value={selectedValue}
                                    onChange={handleAutocompleteChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select level" />
                                    )}
                                />

                            </Grid>
                            <Grid item xs={12} container>
                                {renderCards()}
                            </Grid>
                            <Grid item xs={2}>
                                {/*  {permissionData?.isAdd == true ? ( */}
                                <Button type="submit" fullWidth variant="contained" size="large">
                                    {t("text.save")}
                                </Button>
                                {/* ) : ( */}
                                {/*   "" */}
                                {/* )} */}
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
                <ToastApp />
            </div>
        </div>
    );
};