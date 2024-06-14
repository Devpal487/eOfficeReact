import { Autocomplete, Button, Card, CardContent, Grid, Divider, MenuItem, TextField, Typography, } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/Url';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from '../../../ToastApp';
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from '../../../CustomLable';

type Props = {};

const SectionMasterAdd = (props: Props) => {
    let navigate = useNavigate();
    const { i18n, t } = useTranslation();

    const [FileOption, setFileOption] = useState<any>([
        { value: "-1", label: t("text.SelectDepartment") },
    ]);

    const [toaster, setToaster] = useState(false);

    const { defaultValues, defaultValuestime } = getISTDate();


    useEffect(() => {
        getDepartment();
       
       
    }, []);

    const getDepartment = () => {
        const collectData = {
          "departmentId": -1,
        };
        api
            .post(`Department/GetDepartmentmaster`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.departmentName,
                    value: item.departmentId,
                }));
                setFileOption(arr);
            });
    };




    



    const formik = useFormik({
        initialValues: {
            "id": -1,
            "department": "",
            "section": "",
            "instid": 0,
            "sesid": "",
            "uid": ""
        },
      
        onSubmit: async (values) => {
            const response = await api.post(
                `SectionMaster/AddUpdateSectionMaster`,
                values
            );
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                navigate('/master/SectionMaster');
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }

        }
    });

    const requiredFields = [];

    const back = useNavigate();

    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    border: ".5px solid #FF7722",
                    marginTop: "3vh"
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        style={{ fontSize: "18px", fontWeight: 500 }}
                    >
                        {t("text.CreateSectionMaster")}
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

                            <Grid item lg={6} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={FileOption}
                                    // value={
                                    //     FileOption.find(
                                    //         (option:any) => option.value+"" === formik.values.department
                                    //     ) || null
                                    // }
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("department", newValue?.value+"");

                                        formik.setFieldTouched("department", true);
                                        formik.setFieldTouched("department", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectDepartment")} />}
                                        />
                                    )}
                                />

                            </Grid>

                            <Grid item lg={6} xs={12}>
                                <TextField
                                    id="section"
                                    name="section"
                                    label={<CustomLabel text={t("text.Section")} />}
                                    value={formik.values.section}
                                    placeholder={t("text.Section")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <Grid>
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
                            </Grid>
                            <Grid item lg={6} sm={6} xs={12}>
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

export default SectionMasterAdd;