// import {
//     Button,
//     Card,
//     CardContent,
//     Grid,
//     TextField,
//     Typography,
//     Divider,
// } from "@mui/material";
// import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// import React, { useState, useEffect, useTransition } from "react";
// import axios from "axios";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import HOST_URL from "../../../utils/Url";
// import Autocomplete from "@mui/material/Autocomplete";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// type Props = {};

// const NodePermissionEdit = (props: Props) => {
//     const location = useLocation();
//     // console.log('location', location.state)

//     const [NodeOption, setNodeOption] = useState([{ value: "-1", label: "Select Node" }]);
//     const { i18n, t } = useTranslation();
//     let navigate = useNavigate();


//     const getNode = () => {
//         const collectData = {
//             "id": -1,
//             "nodeID": -1,
//             "titleID": -1
//         };
//         axios
//             .post(HOST_URL.HOST_URL2 + `NewNodeMaster/GetNewNodeMaster`, collectData)
//             .then((res) => {
//                 const arr = res.data.data.map((item: any) => ({
//                     label: item.name,
//                     value: item.id,
//                 }));
//                 setNodeOption(arr);
//             });
//     };

//     useEffect(() => {
//         getNode();
//     }, []);

//     const back = useNavigate();

//     const validationSchema = Yup.object({
//         nodeName:
//             Yup.string().test(
//                 'required', // Unique name for the test

//                 function (value: any) {
//                     return value && value.trim() !== ''; // Your validation logic here
//                 }),

//     });


//     const formik = useFormik({
//         initialValues: {
//             userId: location.state.userId,
//             nodeId: location.state.nodeId,
//             nodeName: location.state.nodeName,
//             location: location.state.location,
//             parentId: location.state.parentId,
//             isActive: location.state.isActive,
//             displayNo: location.state.displayNo,
//             subNode: location.state.subNode,

//         },
//         validationSchema: validationSchema,
//         onSubmit: async (values) => {
//             const response = await axios.post(
//                 HOST_URL.HOST_URL2 + `NodePermission/AddUpdateNodePermission`,
//                 values
//             );
//             try {
//                 // console.log("API Response:", response.data);
//                 toast.success(response.data.mesg);
//                 navigate("/DocManagement/NodePermission");
//             } catch (error) {
//                 toast.error(response.data.mesg);
//             }
//         },
//     });

//     const requiredFields = ["nodeName"];

//     return (
//         <div>
//             <div
//                 style={{
//                     padding: "-5px 5px",
//                     backgroundColor: "#ffffff",
//                     borderRadius: "5px",
//                     marginTop: "5px",
//                     border: ".5px solid #FF7722",
//                 }}
//             >
//                 <CardContent>
//                     <Typography
//                         variant="h5"
//                         textAlign="center"
//                         style={{ fontSize: "18px", fontWeight: 500 }}
//                     >
//                         Edit Node Permission
//                     </Typography>

//                     <Grid item sm={4} xs={12}>
//                         <Typography style={{ marginTop: "-75px" }}>
//                             <Button
//                                 type="submit"
//                                 onClick={() => back(-1)}
//                                 variant="contained"
//                                 style={{
//                                     marginBottom: 15,
//                                     marginTop: "45px",
//                                     backgroundColor: "blue",
//                                     width: 20,
//                                 }}
//                             >
//                                 <ArrowBackSharpIcon />
//                             </Button>
//                         </Typography>
//                     </Grid>
//                     <Divider />
//                     <br />
//                     <form onSubmit={formik.handleSubmit}>
//                         <Grid container spacing={1}>

//                             <Grid item sm={4} md={4} xs={12}>
//                                 <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     options={NodeOption}
//                                     value={
//                                         NodeOption.find(
//                                             (option: any) => option.value === formik.values.nodeId
//                                         ) || null
//                                     }
//                                     fullWidth
//                                     size="small"
//                                     onChange={(event, newValue: any) => {
//                                         console.log(newValue?.value);

//                                         formik.setFieldValue("nodeId", newValue?.value);
//                                         formik.setFieldTouched("nodeId", true);
//                                         formik.setFieldTouched("nodeId", false);
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             label={
//                                                 <span>
//                                                     Select Node {""}
//                                                     {requiredFields.includes("nodeId") && (
//                                                         <span
//                                                             style={{
//                                                                 color: formik.values.nodeId
//                                                                     ? "green"
//                                                                     : "red",
//                                                             }}
//                                                         >
//                                                             *
//                                                         </span>
//                                                     )}
//                                                 </span>
//                                             }
//                                         />
//                                     )}
//                                 />

//                                 {formik.touched.nodeId && formik.errors.nodeId ? (
//                                     <div style={{ color: "red", margin: "5px" }}>
//                                         {String(formik.errors.nodeId)}
//                                     </div>
//                                 ) : null}
//                             </Grid>




//                             <Grid xs={12} sm={4} item>
//                                 <TextField
//                                     type="text"
//                                     name="nodeName"
//                                     id="nodeName"
//                                     label={
//                                         <span>
//                                             Enter Node Name{" "}
//                                             {requiredFields.includes("nodeName") && (
//                                                 <span
//                                                     style={{
//                                                         color: formik.values.nodeName ? "green" : "red",
//                                                     }}
//                                                 >
//                                                     *
//                                                 </span>
//                                             )}
//                                         </span>
//                                     }
//                                     value={formik.values.nodeName}
//                                     placeholder="Enter Node Name"
//                                     size="small"
//                                     fullWidth
//                                     style={{
//                                         backgroundColor: "white",
//                                         borderColor:
//                                             formik.touched.nodeName && formik.errors.nodeName
//                                                 ? "red"
//                                                 : "initial",
//                                     }}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                 />
//                                 {formik.touched.nodeName && formik.errors.nodeName ? (
//                                     <div style={{ color: "red", margin: "5px" }}>
//                                         {String(formik.errors.nodeName)}
//                                     </div>
//                                 ) : null}
//                             </Grid>

                           



//                             <Grid xs={12} item>
//                                 <div style={{ justifyContent: "space-between", flex: 2 }}>
//                                     <Button
//                                         type="submit"
//                                         variant="contained"
//                                         style={{
//                                             width: "48%",
//                                             backgroundColor: "#059669",
//                                             margin: "1%",
//                                         }}
//                                     >
//                                         {t("text.save")}
//                                     </Button>
//                                     <Button
//                                         type="reset"
//                                         variant="contained"
//                                         style={{
//                                             width: "48%",
//                                             backgroundColor: "#F43F5E",
//                                             margin: "1%",
//                                         }}
//                                         onClick={() => formik.resetForm()}
//                                     >
//                                         {t("text.reset")}
//                                     </Button>
//                                 </div>
//                             </Grid>
//                         </Grid>
//                     </form>
//                 </CardContent>
//             </div>
//         </div>
//     );
// };

// export default NodePermissionEdit;


import React from 'react'

const NodePermissionEdit = () => {
  return (
    <div>NodePermissionEdit</div>
  )
}

export default NodePermissionEdit