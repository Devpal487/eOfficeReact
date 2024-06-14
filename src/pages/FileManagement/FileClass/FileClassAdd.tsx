import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Divider,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../../../utils/Url";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastApp from "../../../ToastApp";
import { toast } from "react-toastify";

type Props = {};

const FileClassAdd = (props: Props) => {

    let navigate = useNavigate();

    const { t } = useTranslation();

    const[toaster,setToaster]=useState(false);

    const requiredFields = ['classDescription'];

    const validationSchema = Yup.object({
        classDescription: Yup.string().test(
            'required',
            t('text.ReqclassDescription'),

            function (value: any) {
                return value && value.trim() !== '';
            }
        ),
    });

    const formik = useFormik({
        initialValues: {
            fileClassid: -1,
            classDescription:"",
            shortName: "",
            weedingOutAuthority: "",
          
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            const response = await api.post(
                `FileClass/AddUpdateFileClass`,
                values
            );
            try {
                setToaster(false);
                toast.success(response.data.mesg);
                navigate('/FileManagement/FileClass');
            } catch (error) {
                setToaster(true);
                toast.error(response.data.mesg);
            }
        },
    });

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
                        {t("text.CreateFileClass")}
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
                    {toaster===false ?"":<ToastApp/>}
                        <Grid item xs={12} container spacing={2}>
                            <Grid lg={6} sm={6} xs={12} item>
                                <TextField
                                    label={
                                        <span>
                                            {t("text.EnterClassDescription")}{" "}{requiredFields.includes('classDescription') && (
                                                <span style={{ color: formik.values.classDescription ? 'green' : 'red' }}>*</span>
                                            )}
                                        </span>
                                    }
                                    value={formik.values.classDescription}
                                    placeholder={t("text.EnterClassDescription")}
                                    size="small"
                                    fullWidth
                                    name="classDescription"
                                    id="classDescription"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.classDescription && formik.errors.classDescription ? (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.classDescription}</div>
                                ) : null}
                            </Grid>

                            <Grid lg={6} sm={6} xs={12} item>
                                <TextField
                                    label={t("text.EnterShortName")}
                                    value={formik.values.shortName}
                                    placeholder={t("text.EnterShortName")}
                                    size="small"
                                    fullWidth
                                    name="shortName"
                                    id="shortName"
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid lg={6} sm={6} xs={12} item>
                                <TextField
                                    label={t("text.EnterWeedingOutAuthority")}
                                    value={formik.values.weedingOutAuthority}
                                    name="weedingOutAuthority"
                                    id="weedingOutAuthority"
                                    placeholder={t("text.EnterWeedingOutAuthority")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
<Grid item xs={12} container spacing={2} sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                            <Grid item lg={6} sm={6} xs={12}>
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
                            <Grid item lg={6} sm={6} xs={12}>
                                <Button
                                    type="reset"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#F43F5E",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                        formik.resetForm();
                                    }}
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

export default FileClassAdd;
