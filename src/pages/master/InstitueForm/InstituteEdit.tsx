import { Button, CardContent, Grid, TextField, Typography, Divider, Autocomplete, Modal, Box, Select, MenuItem, FormControlLabel, Radio, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, RadioGroup, Checkbox, ListItemText, FormControl, FormLabel, Popover } from '@mui/material';
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
import { ColorLens as ColorLensIcon } from "@mui/icons-material";
import { SketchPicker } from "react-color";


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


const Options = [
    { label: 'Yes', value: '1' },
    { label: 'No', value: '2' },
];


const MenuOptions = [
    { label: 'Amimation', value: '1' },
    { label: 'Normal', value: '2' },
];



type Props = {};

const InstituteEdit = (props: Props) => {
    const { t } = useTranslation();

    const location = useLocation();
    console.log('location', location.state)

    const [CountryOps, setCountryOps] = useState<any>([
        { value: "-1", label: t("text.SelectCountry") },
    ]);

    const [StateOps, setStateOps] = useState<any>([
        { value: "-1", label: t("text.SelectState") },
    ]);

    const [CityOps, setCityOps] = useState<any>([
        { value: "-1", label: t("text.SelectCity") },
    ]);


    const [StRole, setStRole] = useState<any>([
        { value: "-1", label: t("text.SelectStudentRoles") },
    ]);

    const [EmpRole, setEmpRole] = useState<any>([
        { value: "-1", label: t("text.SelectEmployeeRoles") },
    ]);


    const [ParentInst, setParentInst] = useState<any>([
        { value: "-1", label: t("text.SelectParentInstitute") },
    ]);


    const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
    const [colorPickerOver, setColorPickerOver] = useState(null);



    const handleIconClick = (event: any) => {
        setColorPickerAnchor(event.currentTarget);
    };

    const handleIconClick1 = (event: any) => {
        setColorPickerOver(event.currentTarget);
    };

    const handleColorChange = (color: any) => {
        formik.setFieldValue("mBackColor", color.hex);
    };

    const handleColorChange1 = (color: any) => {
        formik.setFieldValue("mOverColor", color.hex);
    };


    const handlePopoverClose = () => {
        setColorPickerAnchor(null);
    };

    const handlePopoverClose1 = () => {
        setColorPickerOver(null);
    };

    

    const open = Boolean(colorPickerAnchor);
    const open1 = Boolean(colorPickerOver);
    const id = open ? "color-popover" : undefined;
    const id1 = open1 ? "color-popover" : undefined;














    useEffect(() => {
        getCountry();
        getState();
        getCity();
        getStRoles();
        getEmpRoles();
        getParentInst();
        getLogoById();
        getimgbyid();
        getHeaderById();
        getFooterById();
        getReportById();

    }, [])



    const getCountry = () => {
        const collectData = {
            "countryId": -1
        };
        api
            .post(`Country/GetCountryMaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.countryName,
                    value: item.countryId,
                }));
                setCountryOps(arr);
            });
    };

    const getState = () => {
        const collectData = {
            "stateId": -1,
            "countryId": -1
        };
        api
            .post(`State/GetStateMaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.stateName,
                    value: item.stateId,
                }));
                setStateOps(arr);
            });
    };

    const getCity = () => {
        const collectData = {
            "cityId": -1,
            "stateId": -1
        };
        api
            .post(`M10_District/GetDistrictMaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.cityName,
                    value: item.cityId,
                }));
                setCityOps(arr);
            });
    };


    const getStRoles = () => {
        const collectData = {
            "roleId": "-1"
        };
        api
            .post(`Auth/GetRoleMaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.roleName,
                    value: item.roleId,
                }));
                setStRole(arr);
            });
    };


    const getEmpRoles = () => {
        const collectData = {
            "roleId": "-1"
        };
        api
            .post(`Auth/GetRoleMaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.roleName,
                    value: item.roleId,
                }));
                setEmpRole(arr);
            });
    };


    const getParentInst = () => {
        const collectData = {
            "id": -1
        };
        api
            .post(`Institute_Master/GetInstitute_Master`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.insname,
                    value: item.id,
                }));
                setParentInst(arr);
            });
    };



    const getLogoById = () => {
        const collectData = {
            id: location.state.id,

        };

        api
            .post(`Institute_Master/GetInstitute_Master`, collectData)
            .then((res) => {
                // console.log(
                //   "result" + JSON.stringify(res.data.data[0]["signatureFile"])
                // );

                const Doc = res.data.data[0]["instLogo"];
                if (Doc) {
                    formik.setFieldValue("instLogo", Doc);
                }
            });
    };




    const getimgbyid = () => {
        const collectData = {
            id: location.state.id,

        };

        api
            .post(`Institute_Master/GetInstitute_Master`, collectData)
            .then((res) => {
                console.log("result" + JSON.stringify(res.data.data[0]["instImage"]));


                const Doc = res.data.data[0]["instImage"];
                formik.setFieldValue("instImage", Doc);
            });
    };

    const getReportById = () => {
        const collectData = {
            id: location.state.id,

        };

        api
            .post(`Institute_Master/GetInstitute_Master`, collectData)
            .then((res) => {
                // console.log(
                //   "result" + JSON.stringify(res.data.data[0]["signatureFile"])
                // );

                const Doc = res.data.data[0]["reportheaderimg"];
                if (Doc) {
                    formik.setFieldValue("reportheaderimg", Doc);
                }
            });
    };

    const getFooterById = () => {
        const collectData = {
            id: location.state.id,

        };

        api
            .post(`Institute_Master/GetInstitute_Master`, collectData)
            .then((res) => {
                // console.log(
                //   "result" + JSON.stringify(res.data.data[0]["signatureFile"])
                // );

                const Doc = res.data.data[0]["reportfooterimg"];
                if (Doc) {
                    formik.setFieldValue("reportfooterimg", Doc);
                }
            });
    };


    const getHeaderById = () => {
        const collectData = {
            id: location.state.id,

        };

        api
            .post(`Institute_Master/GetInstitute_Master`, collectData)
            .then((res) => {
                // console.log(
                //   "result" + JSON.stringify(res.data.data[0]["signatureFile"])
                // );

                const Doc = res.data.data[0]["reportHeader"];
                if (Doc) {
                    formik.setFieldValue("reportHeader", Doc);
                }
            });
    };






    const [panOpens, setPanOpen] = React.useState(false);
    const [Opens, setOpen] = React.useState(false);
    const [OpenImg, setOpenImg] = React.useState(false);
    const [OpenFooter, setOpenFooter] = React.useState(false);
    const [OpenHeader, setOpenHeader] = React.useState(false);




    const [modalImg, setModalImg] = useState("");

    const [Img, setImg] = useState("");
    const handlePanClose = () => {
        setPanOpen(false);
    };
    const modalOpenHandle = (event: any) => {
        setPanOpen(true);
        if (event === "instLogo") {
            setModalImg(formik.values.instLogo);
        }
    };

    const handlePanClose1 = () => {
        setOpen(false);
    };
    const modalOpenHandle1 = (event: any) => {
        setOpen(true);
        if (event === "instImage") {
            setImg(formik.values.instImage);
        }
    };


    const handlePanClose2 = () => {
        setOpenImg(false);
    };
    const modalOpenHandle2 = (event: any) => {
        setOpenImg(true);
        if (event === "reportheaderimg") {
            setImg(formik.values.reportheaderimg);
        }
    };

    const handlePanClose3 = () => {
        setOpenFooter(false);
    };
    const modalOpenHandle3 = (event: any) => {
        setOpenFooter(true);
        if (event === "reportfooterimg") {
            setImg(formik.values.reportfooterimg);
        }
    };


    const handlePanClose4 = () => {
        setOpenHeader(false);
    };
    const modalOpenHandle4 = (event: any) => {
        setOpenHeader(true);
        if (event === "reportHeader") {
            setImg(formik.values.reportHeader);
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
            if (fileExtension.toLowerCase() != "file") {
                const base64 = await ConvertBase64(file);
                formik.setFieldValue(params, base64);
                console.log(base64);
            } else {
                // Display an error message indicating that only PDF files are allowed
                alert("Only  files are allowed to be uploaded.");
                // Optionally, you can clear the file input field
                event.target.value = null;
            }
        }
    };









    let navigate = useNavigate();


    const back = useNavigate();

    const validationSchema = Yup.object({

        esYear: Yup.string()
            .test(
                'required',
                t('text.reqYearOfEstablishment'),
                function (value: any) {
                    return value && value.trim() !== '';
                }
            )
            .matches(/^[0-9]+$/, t('text.EnterNoOnly')),



        phone: Yup.string()
            .test(
                'required',
                t('text.reqMobNo'),
                function (value: any) {
                    return value && value.trim() !== '';
                }
            )
            .matches(/^[0-9]+$/, t('text.EnterNoOnly'))
            .min(10, t('text.reqMinTenDigits')),

        noOfTeachers: Yup.string()
            .test(
                'required',
                t('text.reqNoOfTeachers'),
                function (value: any) {
                    return value && value.trim() !== '';
                }
            )
            .matches(/^[0-9]+$/, t('text.EnterNoOnly')),

        session_year: Yup.string()
            .test(
                'required',
                t('text.reqSessionYear'),
                function (value: any) {
                    return value && value.trim() !== '';
                }
            )
            .matches(/^[0-9]+$/, t('text.EnterNoOnly')),

        reAttenDuration: Yup.string()
            .test(
                'required',
                t('text.reqReAtendenceDuration'),
                function (value: any) {
                    return value && value.trim() !== '';
                }
            )
            .matches(/^[0-9]+$/, t('text.EnterNoOnly')),







    });



    const [toaster, setToaster] = useState(false);
    const formik = useFormik({
        initialValues: {
            id: location.state.id,
            insname: location.state.insname,
            shortName: location.state.shortName,
            country: location.state.country,
            state: location.state.state,
            city: location.state.city,
            district: location.state.district,
            esYear: location.state.esYear,
            collegeCategory: location.state.collegeCategory,
            principal: location.state.principal,
            collegeStatus: location.state.collegeStatus,
            resiAddress: location.state.resiAddress,
            phone: location.state.phone,
            officeNo: location.state.officeNo,
            resiNo: location.state.resiNo,
            pincode: location.state.pincode,
            email: location.state.email,

            fax: location.state.fax,
            website: location.state.website,
            districtArea: location.state.districtArea,
            letterBy: location.state.letterBy,
            oredrremark: location.state.oredrremark,
            tcNo: location.state.tcNo,
            fileattach_name: location.state.fileattach_name,
            divisionid: location.state.divisionid,
            pucPending: location.state.pucPending,
            statusPG: location.state.statusPG,
            facultiesName: location.state.facultiesName,
            noOfTeachers: location.state.noOfTeachers,
            datefrom: dayjs(location.state.datefrom).format("YYYY-MM-DD"),
            date_R: dayjs(location.state.date_R).format("YYYY-MM-DD"),
            grade: location.state.grade,
            fb: location.state.fb,
            user_id: location.state.user_id,
            inst_ID: location.state.inst_ID,
            session_year: location.state.session_year,
            rememberInst: location.state.rememberInst,
            inst_type: location.state.inst_type,
            registrar: location.state.registrar,
            address: location.state.address,
            reAttenDuration: location.state.reAttenDuration,
            enableAutoStuCredentials: location.state.enableAutoStuCredentials,
            defaultStuRoles: location.state.defaultStuRoles,
            enableAutoEmpCredentials: location.state.enableAutoEmpCredentials,
            defaultEmpRoles: location.state.defaultEmpRoles,
            enableBiometric: location.state.enableBiometric,
            enableDualBiometric: location.state.enableDualBiometric,
            menuType: location.state.menuType,
            mBackColor: location.state.mBackColor,
            mOverColor: location.state.mOverColor,
            repoHeader: location.state.repoHeader,
            projNm: location.state.projNm,
            shoAcadSess: location.state.shoAcadSess,
            shoFincYr: location.state.shoFincYr,
            editAcadSess: location.state.editAcadSess,
            editFincYr: location.state.editFincYr,
            jurisdictionDefault: location.state.jurisdictionDefault,
            instLogobyte: location.state.instLogobyte,
            instImagebyte: location.state.instImagebyte,
            reportheaderimgbyte: location.state.reportheaderimgbyte,
            reportfooterimgbyte: location.state.reportfooterimgbyte,
            reportHeaderbyte: location.state.reportHeaderbyte,
            reportheaderimg: location.state.reportheaderimg,
            reportfooterimg: location.state.reportfooterimg,
            reportHeader: location.state.reportHeader,
            parent_inst: location.state.parent_inst,
            instImage: location.state.instImage,
            instLogo: location.state.instLogo,






        },

        validationSchema: validationSchema,

        onSubmit: async (values) => {
            const response = await api.post(`Institute_Master/AddUpdateInstitute_Master`,
                values
            );
            if (response.data.isSuccess) {
                setToaster(false);

                toast.success(response.data.mesg);
                navigate("/master/Institute");
            } else {

                setToaster(true);

                toast.error(response.data.mesg);
            }

        }
    });


    const requiredFields = ['esYear,phone,noOfTeachers,session_year,reAttenDuration'];


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
                        {t("text.EditInstitute")}
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
                        {toaster === false ? "" : <ToastApp />}
                        <Grid item xs={12} container spacing={2}>

                            <Grid item md={12} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <FormControl component="fieldset" style={{ padding: "1%", border: "1px solid #ccc", borderRadius: "5px", flex: '1' }}>
                                    <FormLabel component="legend"> {t("text.ShowAcademicSession")}</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="academicSession"
                                        name="shoAcadSess"
                                        id="shoAcadSess"
                                        value={formik.values.shoAcadSess}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="Y" control={<Radio />} label={t("text.Yes")} />
                                        <FormControlLabel value="N" control={<Radio />} label={t("text.No")} />
                                    </RadioGroup>
                                </FormControl>

                                <FormControl component="fieldset" style={{ padding: "1%", border: "1px solid #ccc", borderRadius: "5px", flex: '1' }}>
                                    <FormLabel component="legend">{t("text.ShowFinancialYear")}</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="shoFincYr"
                                        name="shoFincYr"
                                        id="shoFincYr"
                                        value={formik.values.shoFincYr}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="Y" control={<Radio />} label={t("text.Yes")} />
                                        <FormControlLabel value="N" control={<Radio />} label={t("text.No")} />
                                    </RadioGroup>
                                </FormControl>


                                <FormControl component="fieldset" style={{ padding: "1%", border: "1px solid #ccc", borderRadius: "5px", flex: '1' }}>
                                    <FormLabel component="legend">{t("text.EditAcademicSession")}</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="editAcadSess"
                                        name="editAcadSess"
                                        id="editAcadSess"
                                        value={formik.values.editAcadSess}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="Y" control={<Radio />} label={t("text.Yes")} />
                                        <FormControlLabel value="N" control={<Radio />} label={t("text.No")} />
                                    </RadioGroup>
                                </FormControl>

                                <FormControl component="fieldset" style={{ padding: "1%", border: "1px solid #ccc", borderRadius: "5px", flex: '1' }}>
                                    <FormLabel component="legend">{t("text.EditableFinancialYear")}</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="editFincYr"
                                        name="editFincYr"
                                        id="editFincYr"
                                        value={formik.values.editFincYr}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="Y" control={<Radio />} label={t("text.Yes")} />
                                        <FormControlLabel value="N" control={<Radio />} label={t("text.No")} />
                                    </RadioGroup>
                                </FormControl>

                                <FormControl component="fieldset" style={{ padding: "1%", border: "1px solid #ccc", borderRadius: "5px", flex: '1' }}>
                                    <FormLabel component="legend">{t("text.DefaultJurisdiction")}</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="jurisdictionDefault"
                                        name="jurisdictionDefault"
                                        id="jurisdictionDefault"
                                        value={formik.values.jurisdictionDefault}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="Y" control={<Radio />} label={t("text.Yes")} />
                                        <FormControlLabel value="N" control={<Radio />} label={t("text.No")} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item md={12}>

                                <FormControl component="fieldset">
                                    <FormLabel component="legend">{t("text.OrgType")}</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="inst_type"
                                        name="inst_type"
                                        id="inst_type"
                                        value={formik.values.inst_type}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="S" control={<Radio />} label={t("text.School")} />
                                        <FormControlLabel value="C" control={<Radio />} label={t("text.College")} />
                                        <FormControlLabel value="U" control={<Radio />} label={t("text.University")} />
                                        <FormControlLabel value="I" control={<Radio />} label={t("text.Institute")} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>


                            <Grid md={4} item>
                                <TextField

                                    label={t("text.InstituteName")}
                                    value={formik.values.insname}
                                    placeholder={t("text.InstituteName")}
                                    size="small"

                                    fullWidth
                                    name="insname"
                                    id="insname"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid md={4} item>
                                <TextField

                                    label={t("text.ShortName")}
                                    value={formik.values.shortName}
                                    placeholder={t("text.ShortName")}
                                    size="small"

                                    fullWidth
                                    name="shortName"
                                    id="shortName"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>



                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={CountryOps}
                                    value={
                                        CountryOps.find(
                                            (option: any) => option.value + "" === formik.values.country
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("country", newValue?.value + "");

                                        formik.setFieldTouched("country", true);
                                        formik.setFieldTouched("country", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectCountry")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />


                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={StateOps}
                                    value={
                                        StateOps.find(
                                            (option: any) => option.value + "" === formik.values.state
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("state", newValue?.value + "");

                                        formik.setFieldTouched("state", true);
                                        formik.setFieldTouched("state", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectState")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />


                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={CityOps}
                                    value={
                                        CityOps.find(
                                            (option: any) => option.value + "" === formik.values.city
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("city", newValue?.value + "");

                                        formik.setFieldTouched("city", true);
                                        formik.setFieldTouched("city", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectCity")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />


                            </Grid>



                            <Grid md={4} item>
                                <TextField

                                    label={t("text.Address")}
                                    value={formik.values.address}
                                    placeholder={t("text.Address")}
                                    size="small"

                                    fullWidth
                                    name="address"
                                    id="address"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.District")}
                                    value={formik.values.district}
                                    placeholder={t("text.District")}
                                    size="small"

                                    fullWidth
                                    name="district"
                                    id="district"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField
                                    id="esYear"
                                    name="esYear"
                                    label={
                                        <span>
                                            {t("text.YearOfEstablishment")}{" "}{requiredFields.includes('esYear') && (
                                                <span style={{ color: formik.values.esYear ? 'green' : 'red' }}>*</span>
                                            )}
                                        </span>
                                    }
                                    value={formik.values.esYear}
                                    placeholder={t("text.YearOfEstablishment")}
                                    size="small"
                                    fullWidth
                                    style={{
                                        backgroundColor: 'white',
                                        borderColor: formik.touched.esYear && formik.errors.esYear ? 'red' : 'initial',
                                    }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.esYear && formik.errors.esYear ? (
                                    <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.esYear)}</div>
                                ) : null}
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.Category")}
                                    value={formik.values.collegeCategory}
                                    placeholder={t("text.Category")}
                                    size="small"

                                    fullWidth
                                    name="collegeCategory"
                                    id="collegeCategory"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.Principal")}
                                    value={formik.values.principal}
                                    placeholder={t("text.Principal")}
                                    size="small"

                                    fullWidth
                                    name="principal"
                                    id="principal"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.collegeStatus")}
                                    value={formik.values.collegeStatus}
                                    placeholder={t("text.collegeStatus")}
                                    size="small"

                                    fullWidth
                                    name="collegeStatus"
                                    id="collegeStatus"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.ResidencialAddress")}
                                    value={formik.values.resiAddress}
                                    placeholder={t("text.ResidencialAddress")}
                                    size="small"

                                    fullWidth
                                    name="resiAddress"
                                    id="resiAddress"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField
                                    id="phone"
                                    name="phone"
                                    label={
                                        <span>
                                            {t("text.MobNo")}{" "}{requiredFields.includes('phone') && (
                                                <span style={{ color: formik.values.phone ? 'green' : 'red' }}>*</span>
                                            )}
                                        </span>
                                    }
                                    value={formik.values.phone}
                                    placeholder={t("text.MobNo")}
                                    size="small"
                                    fullWidth
                                    style={{
                                        backgroundColor: 'white',
                                        borderColor: formik.touched.phone && formik.errors.phone ? 'red' : 'initial',
                                    }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.phone && formik.errors.phone ? (
                                    <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.phone)}</div>
                                ) : null}
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.OficeNO")}
                                    value={formik.values.officeNo}
                                    placeholder={t("text.OficeNO")}
                                    size="small"

                                    fullWidth
                                    name="officeNo"
                                    id="officeNo"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.ResiNO")}
                                    value={formik.values.resiNo}
                                    placeholder={t("text.ResiNo")}
                                    size="small"

                                    fullWidth
                                    name="resiNo"
                                    id="resiNo"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.PinCode")}
                                    value={formik.values.pincode}
                                    placeholder={t("text.PinCode")}
                                    size="small"

                                    fullWidth
                                    name="pincode"
                                    id="pincode"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.Email")}
                                    value={formik.values.email}
                                    placeholder={t("text.Email")}
                                    size="small"

                                    fullWidth
                                    name="email"
                                    id="email"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid md={4} item>
                                <TextField

                                    label={t("text.Fax")}
                                    value={formik.values.fax}
                                    placeholder={t("text.Fax")}
                                    size="small"

                                    fullWidth
                                    name="fax"
                                    id="fax"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.Website")}
                                    value={formik.values.website}
                                    placeholder={t("text.Website")}
                                    size="small"

                                    fullWidth
                                    name="website"
                                    id="website"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.DistrictArea")}
                                    value={formik.values.districtArea}
                                    placeholder={t("text.DistrictArea")}
                                    size="small"

                                    fullWidth
                                    name="districtArea"
                                    id="districtArea"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid md={4} item>
                                <TextField

                                    label={t("text.StatusPg")}
                                    value={formik.values.statusPG}
                                    placeholder={t("text.StatusPg")}
                                    size="small"

                                    fullWidth
                                    name="statusPG"
                                    id="statusPG"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField

                                    label={t("text.Registrar")}
                                    value={formik.values.registrar}
                                    placeholder={t("text.Registrar")}
                                    size="small"

                                    fullWidth
                                    name="registrar"
                                    id="registrar"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid md={4} item>
                                <TextField

                                    label={t("text.NameOfFaculties")}
                                    value={formik.values.facultiesName}
                                    placeholder={t("text.NameOfFaculties")}
                                    size="small"

                                    fullWidth
                                    name="facultiesName"
                                    id="facultiesName"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid md={4} item>
                                <TextField
                                    id="noOfTeachers"
                                    name="noOfTeachers"
                                    label={
                                        <span>
                                            {t("text.NoOfTeachers")}{" "}{requiredFields.includes('noOfTeachers') && (
                                                <span style={{ color: formik.values.noOfTeachers ? 'green' : 'red' }}>*</span>
                                            )}
                                        </span>
                                    }
                                    value={formik.values.noOfTeachers}
                                    placeholder={t("text.NoOfTeachers")}
                                    size="small"
                                    fullWidth
                                    style={{
                                        backgroundColor: 'white',
                                        borderColor: formik.touched.noOfTeachers && formik.errors.noOfTeachers ? 'red' : 'initial',
                                    }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.noOfTeachers && formik.errors.noOfTeachers ? (
                                    <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.noOfTeachers)}</div>
                                ) : null}
                            </Grid>
                            <Grid md={4} item>
                                <TextField
                                    type="date"
                                    label={t("text.DateFrom")}
                                    value={formik.values.datefrom}
                                    placeholder={t("text.DateFrom")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    name="datefrom"
                                    id="datefrom"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField
                                    type="date"
                                    label={t("text.AccesedByNaac")}
                                    value={formik.values.date_R}
                                    placeholder={t("text.AccesedByNaac")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    name="date_R"
                                    id="date_R"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid md={4} item>
                                <TextField
                                    id="session_year"
                                    name="session_year"
                                    label={
                                        <span>
                                            {t("text.SessionYear")}{" "}{requiredFields.includes('session_year') && (
                                                <span style={{ color: formik.values.session_year ? 'green' : 'red' }}>*</span>
                                            )}
                                        </span>
                                    }
                                    value={formik.values.session_year}
                                    placeholder={t("text.SessionYear")}
                                    size="small"
                                    fullWidth
                                    style={{
                                        backgroundColor: 'white',
                                        borderColor: formik.touched.session_year && formik.errors.session_year ? 'red' : 'initial',
                                    }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.session_year && formik.errors.session_year ? (
                                    <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.session_year)}</div>
                                ) : null}
                            </Grid>
                            <Grid md={4} item>
                                <TextField
                                    id="reAttenDuration"
                                    name="reAttenDuration"
                                    label={
                                        <span>
                                            {t("text.ReAtendenceDuration")}{" "}{requiredFields.includes('reAttenDuration') && (
                                                <span style={{ color: formik.values.reAttenDuration ? 'green' : 'red' }}>*</span>
                                            )}
                                        </span>
                                    }
                                    value={formik.values.reAttenDuration}
                                    placeholder={t("text.ReAtendenceDuration")}
                                    size="small"
                                    fullWidth
                                    style={{
                                        backgroundColor: 'white',
                                        borderColor: formik.touched.reAttenDuration && formik.errors.reAttenDuration ? 'red' : 'initial',
                                    }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.reAttenDuration && formik.errors.reAttenDuration ? (
                                    <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.reAttenDuration)}</div>
                                ) : null}
                            </Grid>

                        </Grid>


                        <br />
                        <Divider />
                        <br />

                        <Grid item xs={12} container spacing={2}>


                            <Grid item md={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={Options}
                                    value={
                                        Options.find(
                                            (option: any) => option.value + "" === formik.values.enableAutoStuCredentials
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("enableAutoStuCredentials", newValue?.value + "");

                                        formik.setFieldTouched("enableAutoStuCredentials", true);
                                        formik.setFieldTouched("enableAutoStuCredentials", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.EnableAutoStuCredentials")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid item md={6} >
                                <Autocomplete
                                    multiple
                                    disablePortal
                                    id="combo-box-demo"
                                    options={StRole}
                                    getOptionLabel={(option: any) => option.label}
                                    // value={
                                    //     StRole.find(
                                    //         (option:any) => option.value+"" === formik.values.defaultStuRoles
                                    //     ) || null
                                    // }
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("defaultStuRoles", newValue?.value + "");

                                        formik.setFieldTouched("defaultStuRoles", true);
                                        formik.setFieldTouched("defaultStuRoles", false);
                                    }}
                                    fullWidth
                                    size="small"
                                    disableCloseOnSelect

                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            <ListItemText primary={option.label} />
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectStudentRoles")}
                                                </span>
                                            }
                                        />
                                    )}
                                />

                            </Grid>



                        </Grid>

                        <Grid item xs={12} container spacing={2} style={{ marginTop: "2%" }}>


                            <Grid item md={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={Options}
                                    value={
                                        Options.find(
                                            (option: any) => option.value + "" === formik.values.enableAutoEmpCredentials
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("enableAutoEmpCredentials", newValue?.value + "");

                                        formik.setFieldTouched("enableAutoEmpCredentials", true);
                                        formik.setFieldTouched("enableAutoEmpCredentials", false);
                                    }}


                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.EnableAutoEmpCredentials")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid item md={6} >
                                <Autocomplete
                                    multiple
                                    disablePortal
                                    id="combo-box-demo"
                                    options={EmpRole}
                                    getOptionLabel={(option: any) => option.label}
                                    // value={
                                    //     ZoneOption.find(
                                    //         (option) => option.value === formik.values.fileTypeId
                                    //     ) || null
                                    // }
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("defaultEmpRoles", newValue?.value + "");

                                        formik.setFieldTouched("defaultEmpRoles", true);
                                        formik.setFieldTouched("defaultEmpRoles", false);
                                    }}
                                    fullWidth
                                    size="small"
                                    disableCloseOnSelect

                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            <ListItemText primary={option.label} />
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectEmployeeRoles")}
                                                </span>
                                            }
                                        />
                                    )}
                                />

                            </Grid>



                        </Grid>


                        <br />
                        <Divider />
                        <br />



                        <Grid item xs={12} container spacing={2} style={{ marginTop: "2%" }}>


                            <Grid item md={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={Options}
                                    value={
                                        Options.find(
                                            (option: any) => option.value + "" === formik.values.enableBiometric
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("enableBiometric", newValue?.value + "");

                                        formik.setFieldTouched("enableBiometric", true);
                                        formik.setFieldTouched("enableAutoStuCredentials", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.EnableBiometric")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item md={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={Options}
                                    value={
                                        Options.find(
                                            (option: any) => option.value + "" === formik.values.enableDualBiometric
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("enableDualBiometric", newValue?.value + "");

                                        formik.setFieldTouched("enableDualBiometric", true);
                                        formik.setFieldTouched("enableDualBiometric", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.EnableDualBiometric")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={MenuOptions}
                                    value={
                                        MenuOptions.find(
                                            (option: any) => option.value + "" === formik.values.menuType
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("menuType", newValue?.value + "");

                                        formik.setFieldTouched("menuType", true);
                                        formik.setFieldTouched("menuType", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.MenuType")} {""}

                                                </span>
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item md={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={ParentInst}
                                    value={
                                        ParentInst.find(
                                            (option: any) => option.value === formik.values.parent_inst
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("parent_inst", newValue?.value);

                                        formik.setFieldTouched("parent_inst", true);
                                        formik.setFieldTouched("parent_inst", false);
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

                            <Grid item md={4}>
                                <TextField
                                    label={t("text.MenuBackColor")}
                                    value={formik.values.mBackColor}
                                    placeholder={t("text.MenuBackColor")}
                                    size="small"
                                    fullWidth
                                    name="mBackColor"
                                    id="mBackColor"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleIconClick}>
                                                    <ColorLensIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={colorPickerAnchor}
                                    onClose={handlePopoverClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                >
                                    <SketchPicker color={formik.values.mBackColor} onChangeComplete={handleColorChange} />
                                </Popover>
                            </Grid>


                            <Grid item md={4}>
                                <TextField

                                    label={t("text.MenuOverColor")}
                                    value={formik.values.mOverColor}
                                    placeholder={t("text.MenuOverColor")}
                                    size="small"

                                    fullWidth
                                    name="mOverColor"
                                    id="mOverColor"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}

                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleIconClick1}>
                                                    <ColorLensIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Popover
                                    id={id1}
                                    open={open1}
                                    anchorEl={colorPickerOver}
                                    onClose={handlePopoverClose1}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                >
                                    <SketchPicker color={formik.values.mOverColor} onChangeComplete={handleColorChange1} />
                                </Popover>
                            </Grid>



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
                                    inputProps={{ accept: "image/*" }}
                                    InputLabelProps={{ shrink: true }}
                                    label={
                                        <strong style={{ color: "#000" }}>
                                            {t("text.Attachedlogo")}
                                        </strong>
                                    }
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={(e) => otherDocChangeHandler(e, "instLogo")}
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
                                    {formik.values.instLogo == "" ? (
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
                                        <img
                                            src={formik.values.instLogo}
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
                                        onClick={() => modalOpenHandle("instLogo")}
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
                                        <img
                                            alt="preview image"
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
                                    inputProps={{ accept: "image/*" }}
                                    InputLabelProps={{ shrink: true }}
                                    label={
                                        <strong style={{ color: "#000" }}>
                                            {t("text.UploadImage")}
                                        </strong>
                                    }
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={(e) => otherDocChangeHandler(e, "instImage")}
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
                                    {formik.values.instImage == "" ? (
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
                                        <img
                                            src={formik.values.instImage}
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
                                        onClick={() => modalOpenHandle1("instImage")}
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


                            <Modal open={Opens} onClose={handlePanClose1}>
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
                                        <img
                                            alt="preview image"
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
                                    inputProps={{ accept: "image/*" }}
                                    InputLabelProps={{ shrink: true }}
                                    label={
                                        <strong style={{ color: "#000" }}>
                                            {t("text.ReportHeaderImg")}
                                        </strong>
                                    }
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={(e) => otherDocChangeHandler(e, "reportheaderimg")}
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
                                    {formik.values.reportheaderimg == "" ? (
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
                                        <img
                                            src={formik.values.reportheaderimg}
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
                                        onClick={() => modalOpenHandle2("reportheaderimg")}
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


                            <Modal open={OpenImg} onClose={handlePanClose2}>
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
                                        <img
                                            alt="preview image"
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
                                    inputProps={{ accept: "image/*" }}
                                    InputLabelProps={{ shrink: true }}
                                    label={
                                        <strong style={{ color: "#000" }}>
                                            {t("text.ReportFooterImg")}
                                        </strong>
                                    }
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={(e) => otherDocChangeHandler(e, "reportfooterimg")}
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
                                    {formik.values.reportfooterimg == "" ? (
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
                                        <img
                                            src={formik.values.reportfooterimg}
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
                                        onClick={() => modalOpenHandle3("reportfooterimg")}
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


                            <Modal open={OpenFooter} onClose={handlePanClose3}>
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
                                        <img
                                            alt="preview image"
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
                                    inputProps={{ accept: "image/*" }}
                                    InputLabelProps={{ shrink: true }}
                                    label={
                                        <strong style={{ color: "#000" }}>
                                            {t("text.ReportFooter")}
                                        </strong>
                                    }
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={(e) => otherDocChangeHandler(e, "reportHeader")}
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
                                    {formik.values.reportHeader == "" ? (
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
                                        <img
                                            src={formik.values.reportHeader}
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
                                        onClick={() => modalOpenHandle4("reportHeader")}
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


                            <Modal open={OpenHeader} onClose={handlePanClose4}>
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
                                        <img
                                            alt="preview image"
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
                        </Grid>






                        <Grid
                            item
                            xs={12}
                            spacing={2}
                            container
                            style={{ display: "flex", marginTop: "5%" }}
                        >
                            <Grid md={6} item>
                                <Button
                                    type="submit"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#059669",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                >
                                    {t("text.update")}
                                </Button>
                            </Grid>

                            <Grid md={6} item>
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


                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default InstituteEdit;
