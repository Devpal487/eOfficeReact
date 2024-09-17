import {
    Button,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import CustomLabel from "../../../CustomLable";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ToastApp from "../../../ToastApp";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import { getISTDate } from "../../../utils/Constant";

type Props = {};

const ServiceMasterEdit = (props: Props) => {
    const back = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    console.log('checklocation',location.state)

    const [fileTypeOption, setFileTypeOption] = useState([
        { value: "-1", label: t("text.SelectFileType") },
    ]);
    const [LetterType, setLetterType] = useState<any>([
        { value: "-1", label: t("text.SelectLetterType") },
    ]);

    const [RootOps, setRootOps] = useState<any>([
        { value: "-1", label: t("text.SelectRoot") },
    ]);

    const [toaster, setToaster] = useState(false);
    const [lang, setLang] = useState<Language>("en");
    const navigate = useNavigate();
    const { defaultValuestime } = getISTDate();


    useEffect(() => {
        getFileTypeData();
        getLetterType();
        getRoot();
    }, []);

    const getFileTypeData = async () => {
        const res = await api.post(`FileType/GetFileType`, {
            fId: -1,
            inst_id: -1,
            user_id: -1,
            divisionid: -1,
        });
        console.log("check file type", res?.data?.data);
        const arr = [];
        for (let index = 0; index < res.data.data.length; index++) {
            arr.push({
                value: res.data.data[index]["fId"],
                label: res.data.data[index]["fName"],
            });
            setFileTypeOption(arr);
        }
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
                    label: item.routeName,
                    value: item.id,
                }));
                setRootOps(arr);
            });
    };



    const formik = useFormik({
        initialValues: {
            serviceId: location.state.serviceId,
            rate: location.state.rate,
            fId: location.state.fId,
            id: location.state.id || null,
            lId: location.state.lId,
            dispatchFees: location.state.dispatchFees,
            validFrom: location.state.validFrom,
            validTo: location.state.validTo,
            isDispatch: location.state.isDispatch,
        },

        onSubmit: async (values) => {
            const response = await api.post(
                `ServiceMaster/AddUpdateServiceMaster`,
                values
            );
            if (response.data.isSuccess) {
                toast.success(response.data.mesg);
                setToaster(true);
                navigate("/master/ServiceMaster");
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }
        },
    });

    const requiredFields = [""];
    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };



    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                    border: ".5px solid #2B4593",
                    marginTop: "5px",
                }}
            >
                <CardContent>
                    <Grid item xs={12} container spacing={2}>
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
                        <Grid
                            item
                            lg={7}
                            md={7}
                            xs={7}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ padding: "20px" }}
                                align="center"
                            >
                                {t("text.ServiceMaster")}
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

                    <Divider />
                    <br />

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            {/* <ToastContainer /> */}
                            {toaster === false ? "" : <ToastApp />}
                            <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={fileTypeOption}
                                    fullWidth
                                    size="small"
                                    value={
                                        fileTypeOption.find(
                                          (opt:any) => opt.value === formik.values.fId
                                        ) || null
                                      }
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("fId", newValue?.value);
                                        formik.setFieldTouched("fId", true);
                                        formik.setFieldTouched("fId", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectFileType")}
                                                    required={requiredFields.includes("fId")}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.fId && formik.errors.fId ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.fId)}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={LetterType}
                                    fullWidth
                                    size="small"
                                    value={
                                        LetterType.find(
                                          (opt:any) => opt.value === formik.values.lId
                                        ) || null
                                      }
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("lId", newValue?.value);

                                        formik.setFieldTouched("lId", true);
                                        formik.setFieldTouched("lId", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={<CustomLabel text={t('text.SelectLetterType')} />} />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={RootOps}
                                    fullWidth
                                    size="small"
                                    value={
                                        RootOps.find(
                                          (opt:any) => opt.value === formik.values.id
                                        ) || null
                                      }
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("id", newValue?.value);

                                        formik.setFieldTouched("id", true);
                                        formik.setFieldTouched("id", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={<CustomLabel text={t('text.SelectRoot')} />} />
                                    )}
                                />
                            </Grid>

                            {/* <Grid item lg={4} md={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={RootOps}
                                    fullWidth
                                    size="small"
                                    value={
                                        RootOps.find(
                                          (opt:any) => opt.value === formik.values.id
                                        ) 
                                      }
                                    onChange={(event, newValue: any) => {
                                        console.log('check root',newValue?.value);

                                        formik.setFieldValue("id", newValue?.value);

                                        formik.setFieldTouched("id", true);
                                        formik.setFieldTouched("id", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={<CustomLabel text={t('text.SelectRoot')} />} />
                                    )}
                                />
                            </Grid> */}

                            <Grid lg={4} md={4} xs={12} item>
                                <TextField
                                    type="date"
                                    label={<CustomLabel text={t('text.Validfrom')} required={false} />}
                                    value={formik.values.validFrom}
                                    name="validFrom"
                                    id="validFrom"
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
                                    label={<CustomLabel text={t('text.Validto')} required={false} />}
                                    value={formik.values.validTo}
                                    name="validTo"
                                    id="validTo"
                                    placeholder={t("text.fileOpenDate")}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    id="rate"
                                    name="rate"
                                    label={<CustomLabel text={t("text.Rate")} />}
                                    value={formik.values.rate}
                                    placeholder={t("text.Rate")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} xs={12}>
                                <TextField
                                    id="dispatchFees"
                                    name="dispatchFees"
                                    label={<CustomLabel text={t("text.DispatchFee")} />}
                                    value={formik.values.dispatchFees}
                                    placeholder={t("text.DispatchFee")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid xs={12} sm={4} lg={4} item
                                alignItems="center"
                                justifyContent="center"
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="isDispatch"
                                            name="isDispatch"
                                            value={formik.values.isDispatch}
                                            //checked={formik.values.forAllUsers === 'Y'}
                                            onChange={(e) => {
                                                console.log("🚀 ~ CreateDigitalContent ~ e:", e)
                                                const newValue = e.target.checked ? true : false;
                                                console.log("🚀 ~ CreateDigitalContent ~ newValue:", newValue)
                                                formik.setFieldValue("isDispatch", newValue);
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <span>
                                            Is Dispatch
                                            {/* <span style={{ color: "red" }}>*</span> */}
                                        </span>
                                    }
                                    labelPlacement="end"
                                // label="Check If Public for All"
                                // labelPlacement="end"
                                />
                            </Grid>

                            <Grid xs={12} item>
                                <div style={{ justifyContent: "space-between", flex: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{
                                            width: "48%",
                                            backgroundColor: "#059669",
                                            margin: "1%",
                                        }}
                                    >
                                        {t("text.save")}
                                    </Button>
                                    <Button
                                        type="reset"
                                        variant="contained"
                                        style={{
                                            width: "48%",
                                            backgroundColor: "#F43F5E",
                                            margin: "1%",
                                        }}
                                        onClick={() => formik.resetForm()}
                                    >
                                        {t("text.reset")}
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default ServiceMasterEdit;
