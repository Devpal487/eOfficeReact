// import {
//     Button,
//     CardContent,
//     Checkbox,
//     FormControlLabel,
//     Grid,
//     TextField,
//     Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import api from "../../../utils/Url";
// import Autocomplete from "@mui/material/Autocomplete";
// import { Divider } from "@mui/material";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import { styled } from "@mui/material/styles";
// import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
// import ToastApp from "../../../ToastApp";
// type Props = {};

// const NodePermissionAdd = (props: Props) => {
//     const [NodeOption, setNodeOption] = useState<any>([
//         { value: "-1", label: "Select Node" },
//     ]);
//     const [UserOption, setUserOption] = useState([
//         { value: "-1", label: "Select User" },
//     ]);
//     const [nodeData, setNodeData] = useState<any>([{ nodeId: 0 }]);

//     let navigate = useNavigate();

//     useEffect(() => {
//         getUser();

//         getNode();
//     }, []);

//     const getUser = () => {
//         const collectData = {
//             useR_ID: "-1",
//         };
//         api.post(`USER/GetUSER`, collectData).then((res) => {
//             const arr = res.data.data.map((item: any) => ({
//                 label: item.firsT_NAME,
//                 value: item.useR_ID,
//             }));
//             setUserOption(arr);
//         });
//     };

//     const getNode = () => {
//         const collectData = {
//             id: -1,
//             nodeID: -1,
//             titleID: -1,
//         };
//         api.post(`NewNodeMaster/GetNewNodeMaster`, collectData).then((res) => {
//             const arr = res.data.data.map((item: any) => ({
//                 label: item.name,
//                 value: item.id,
//             }));
//             const allOption = { label: "Select All", value: "all" };
//             setNodeOption([allOption, ...arr]);
//         });
//     };

//     const back = useNavigate();
//     const { t } = useTranslation();
//     const validationSchema = Yup.object({
//         userId: Yup.string().test(
//             "required",

//             function (value: any) {
//                 return value && value.trim() !== "";
//             }
//         ),
//     });

//     const formik = useFormik({
//         initialValues: {
//             id: -1,
//             userId: "",
//             nodeId: -1,
//             parentId: -1,
//             subNode: [],
//         },
//         validationSchema: validationSchema,
//         onSubmit: async (values) => {
//             values.subNode = nodeData;
//             console.log("Submitting values", values);
//             const response = await api.post(
//                 `NodePermission/AddUpdateNodePermission`,
//                 values
//             );
//             try {
//                 toast.success(response.data.mesg);
//                 navigate("/master/NodePermission");
//             } catch (error) {
//                 toast.error(response.data.mesg);
//             }
//         },
//     });

//     const requiredFields = ["userId"];

//     const [checked, setChecked] = useState<any>([]);

//     const handleToggle = (id: number) => () => {
//         const currentIndex = checked.indexOf(id);
//         const newChecked = [...checked];

//         if (currentIndex === -1) {
//             newChecked.push(id);
//         } else {
//             newChecked.splice(currentIndex, 1);
//         }
//         console.log("newChecked", newChecked);
//         setChecked(newChecked);
//     };
//     const CustomTreeItem = styled(TreeItem)({
//         [`& .${treeItemClasses.iconContainer}`]: {
//             "& .close": {
//                 opacity: 0.3,
//             },
//         },
//     });
//     const renderTree = (nodes: any) => (
//         console.log("nodes.id", nodes.id),
//         (
//             <CustomTreeItem
//                 key={nodes.id}
//                 itemId={String(nodes.id)}
//                 label={
//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 checked={checked.indexOf(nodes.id) !== -1}
//                                 onChange={handleToggle(nodes.id)}
//                             />
//                         }
//                         label={nodes.locationObjectItem}
//                     />
//                 }
//             >
//                 {Array.isArray(nodes.childLocI)
//                     ? nodes.childLocI.map((node: any) => renderTree(node))
//                     : null}
//             </CustomTreeItem>
//         )
//     );

//     return (
//         <div>
//             <div
//                 style={{
//                     padding: "-5px 5px",
//                     backgroundColor: "#FFFFFF",
//                     borderRadius: "5px",
//                     border: ".5px solid #ff7722",
//                 }}
//             >
//                 <CardContent>
//                     <Typography
//                         variant="h5"
//                         textAlign="center"
//                         style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
//                     >
//                         Create Node Permission
//                     </Typography>
//                     <Grid xs={4} sm={12} item>
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
//                         <ToastApp />
//                         <Grid container spacing={1}>
//                             <Grid item sm={6} md={6} xs={12}>
//                                 <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     options={UserOption}
//                                     fullWidth
//                                     size="small"
//                                     onChange={(event, newValue: any) => {
//                                         console.log(newValue?.value);
//                                         formik.setFieldValue("userId", newValue?.value);
//                                         formik.setFieldTouched("userId", true);
//                                         formik.setFieldTouched("userId", false);
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             label={
//                                                 <span>
//                                                     Select User {""}
//                                                     {requiredFields.includes("userId") && (
//                                                         <span
//                                                             style={{
//                                                                 color: formik.values.userId ? "green" : "red",
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

//                                 {formik.touched.userId && formik.errors.userId ? (
//                                     <div style={{ color: "red", margin: "5px" }}>
//                                         {formik.errors.userId}
//                                     </div>
//                                 ) : null}
//                             </Grid>

//                             <Grid xs={12} sm={6} item>

//                                 <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     options={NodeOption}
//                                     fullWidth
//                                     size="small"
//                                     multiple
//                                     disableCloseOnSelect
//                                     getOptionLabel={(option: any) => option.label}
//                                     renderOption={(props, option: any, { selected }) => (
//                                         <li {...props}>
//                                             <Checkbox style={{ marginRight: 8 }} checked={selected} />
//                                             {option.label}
//                                         </li>
//                                     )}
//                                     // onChange={(event, newValue) => {
//                                     //     console.log("check click", newValue);
//                                     //     if (newValue.includes(NodeOption[0])) {
//                                     //         // Select All option selected
//                                     //         // formik.setFieldValue("nodeId", "all");
//                                     //         setNodeData("all");
//                                     //     } else {
//                                     //         setNodeData(newValue.map((option: any) => option.value));
//                                     //     }
//                                     //     // formik.setFieldTouched("nodeId", true);
//                                     // }}

//                                     onChange={(event, newValue) => {
//                                         if (newValue.includes(NodeOption[0])) {
//                                             // Select All option selected
//                                             setNodeData([{ nodeId: "all" }]);
//                                         } else {
//                                             // Regular options selected
//                                             setNodeData(newValue.map((option: any) => ({ nodeId: option.value })));
//                                         }
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             label={
//                                                 <span>
//                                                     Select Node{" "}
//                                                     {requiredFields.includes("nodeId") && (
//                                                         <span
//                                                             style={{
//                                                                 color: formik.values.nodeId ? "green" : "red",
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
//                                         {formik.errors.nodeId}
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

//                                     //onClick={(e:any) =>AddNodeItem()}
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

// export default NodePermissionAdd;


// // import {
// //     Button,
// //     CardContent,
// //     Checkbox,
// //     FormControlLabel,
// //     Grid,
// //     TextField,
// //     Typography,
// // } from "@mui/material";
// // import React, { useEffect, useState } from "react";
// // import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import api from "../../../utils/Url";
// // import Autocomplete from "@mui/material/Autocomplete";
// // import { Divider } from "@mui/material";
// // import { useFormik } from "formik";
// // import * as Yup from "yup";
// // import { useTranslation } from "react-i18next";
// // import { toast } from "react-toastify";
// // import { styled } from "@mui/material/styles";
// // import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
// // import ToastApp from "../../../ToastApp";
// // type Props = {};

// // const NodePermissionAdd = (props: Props) => {
// //     const [NodeOption, setNodeOption] = useState([
// //         { value: "-1", label: "Select Node" },
// //     ]);
// //     const [UserOption, setUserOption] = useState([
// //         { value: "-1", label: "Select User" },
// //     ]);
// //     const [nodeData, setNodeData] = useState<any>([{ nodeId: 0 }]);

// //     let navigate = useNavigate();

// //     useEffect(() => {
// //         getUser();

// //         getNode();
// //     }, []);

// //     const getUser = () => {
// //         const collectData = {
// //             useR_ID: "-1",
// //         };
// //         api.post(`USER/GetUSER`, collectData).then((res) => {
// //             const arr = res.data.data.map((item: any) => ({
// //                 label: item.firsT_NAME,
// //                 value: item.useR_ID,
// //             }));
// //             setUserOption(arr);
// //         });
// //     };

// //     const getNode = () => {
// //         const collectData = {
// //             id: -1,
// //             nodeID: -1,
// //             titleID: -1,
// //         };
// //         api.post(`NewNodeMaster/GetNewNodeMaster`, collectData).then((res) => {
// //             const arr = res.data.data.map((item: any) => ({
// //                 label: item.name,
// //                 value: item.id,
// //             }));
// //             const allOption = { label: "Select All", value: "all" };
// //             setNodeOption([allOption, ...arr]);
// //         });
// //     };

// //     const back = useNavigate();
// //     const { t } = useTranslation();
// //     const validationSchema = Yup.object({
// //         userId: Yup.string().test(
// //             "required",

// //             function (value: any) {
// //                 return value && value.trim() !== "";
// //             }
// //         ),
// //     });

// //     const formik = useFormik({
// //         initialValues: {
// //             id: -1,
// //             userId: "",
// //             nodeId: 0,

// //             parentId: 0,

// //             subNode: [],
// //         },
// //         validationSchema: validationSchema,
// //         onSubmit: async (values) => {
// //             values.subNode = nodeData;
// //             console.log("Submitting values", values);
// //             const response = await api.post(
// //                 `NodePermission/AddUpdateNodePermission`,
// //                 values
// //             );
// //             try {
// //                 // console.log("API Response:", response.data);
// //                 toast.success(response.data.mesg);
// //                 navigate("/master/NodePermission");
// //             } catch (error) {
// //                 toast.error(response.data.mesg);
// //             }
// //         },
// //     });

// //     const requiredFields = ["userId"];

// //     const [checked, setChecked] = useState<any>([]);

// //     const handleToggle = (id: number) => () => {
// //         const currentIndex = checked.indexOf(id);
// //         const newChecked = [...checked];

// //         if (currentIndex === -1) {
// //             newChecked.push(id);
// //         } else {
// //             newChecked.splice(currentIndex, 1);
// //         }
// //         console.log("newChecked", newChecked);
// //         setChecked(newChecked);
// //     };
// //     const CustomTreeItem = styled(TreeItem)({
// //         [`& .${treeItemClasses.iconContainer}`]: {
// //             "& .close": {
// //                 opacity: 0.3,
// //             },
// //         },
// //     });
// //     const renderTree = (nodes: any) => (
// //         console.log("nodes.id", nodes.id),
// //         (
// //             <CustomTreeItem
// //                 key={nodes.id}
// //                 itemId={String(nodes.id)}
// //                 //label={nodes.locationObjectItem}
// //                 label={
// //                     // Array.isArray(nodes.childLocI)?nodes.locationObjectItem:
// //                     <FormControlLabel
// //                         control={
// //                             <Checkbox
// //                                 checked={checked.indexOf(nodes.id) !== -1}
// //                                 onChange={handleToggle(nodes.id)}
// //                             />
// //                         }
// //                         label={nodes.locationObjectItem}
// //                     />
// //                 }
// //             >
// //                 {Array.isArray(nodes.childLocI)
// //                     ? nodes.childLocI.map((node: any) => renderTree(node))
// //                     : null}
// //             </CustomTreeItem>
// //         )
// //     );

// //     return (
// //         <div>
// //             <div
// //                 style={{
// //                     padding: "-5px 5px",
// //                     backgroundColor: "#FFFFFF",
// //                     borderRadius: "5px",
// //                     border: ".5px solid #ff7722",
// //                 }}
// //             >
// //                 <CardContent>
// //                     <Typography
// //                         variant="h5"
// //                         textAlign="center"
// //                         style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
// //                     >
// //                         Create Node Permission
// //                     </Typography>
// //                     <Grid xs={4} sm={12} item>
// //                         <Typography style={{ marginTop: "-75px" }}>
// //                             <Button
// //                                 type="submit"
// //                                 onClick={() => back(-1)}
// //                                 variant="contained"
// //                                 style={{
// //                                     marginBottom: 15,
// //                                     marginTop: "45px",
// //                                     backgroundColor: "blue",
// //                                     width: 20,
// //                                 }}
// //                             >
// //                                 <ArrowBackSharpIcon />
// //                             </Button>
// //                         </Typography>
// //                     </Grid>
// //                     <Divider />
// //                     <br />

// //                     <form onSubmit={formik.handleSubmit}>
// //                         <ToastApp />
// //                         <Grid container spacing={1}>
// //                             <Grid item sm={6} md={6} xs={12}>
// //                                 <Autocomplete
// //                                     disablePortal
// //                                     id="combo-box-demo"
// //                                     options={UserOption}
// //                                     fullWidth
// //                                     size="small"
// //                                     onChange={(event, newValue: any) => {
// //                                         console.log(newValue?.value);
// //                                         formik.setFieldValue("userId", newValue?.value);
// //                                         formik.setFieldTouched("userId", true);
// //                                         formik.setFieldTouched("userId", false);
// //                                     }}
// //                                     renderInput={(params) => (
// //                                         <TextField
// //                                             {...params}
// //                                             label={
// //                                                 <span>
// //                                                     Select User {""}
// //                                                     {requiredFields.includes("userId") && (
// //                                                         <span
// //                                                             style={{
// //                                                                 color: formik.values.userId ? "green" : "red",
// //                                                             }}
// //                                                         >
// //                                                             *
// //                                                         </span>
// //                                                     )}
// //                                                 </span>
// //                                             }
// //                                         />
// //                                     )}
// //                                 />

// //                                 {formik.touched.userId && formik.errors.userId ? (
// //                                     <div style={{ color: "red", margin: "5px" }}>
// //                                         {formik.errors.userId}
// //                                     </div>
// //                                 ) : null}
// //                             </Grid>

// //                             <Grid xs={12} sm={6} item>
// //                                 <Autocomplete
// //                                     disablePortal
// //                                     id="combo-box-demo"
// //                                     options={NodeOption}
// //                                     fullWidth
// //                                     size="small"
// //                                     multiple
// //                                     disableCloseOnSelect
// //                                     getOptionLabel={(option) => option.label}
// //                                     renderOption={(props, option, { selected }) => (
// //                                         <li {...props}>
// //                                             <Checkbox style={{ marginRight: 8 }} checked={selected} />
// //                                             {option.label}
// //                                         </li>
// //                                     )}
// //                                     // onChange={(event, newValue) => {
// //                                     //     console.log("check click", newValue);
// //                                     //     if (newValue.includes(NodeOption[0])) {
// //                                     //         // Select All option selected
// //                                     //         // formik.setFieldValue("nodeId", "all");
// //                                     //         setNodeData("all");
// //                                     //     } else {
// //                                     //         setNodeData(newValue.map((option: any) => option.value));
// //                                     //     }
// //                                     //     // formik.setFieldTouched("nodeId", true);
// //                                     // }}

// //                                     onChange={(event, newValue) => {
// //                                         if (newValue.includes(NodeOption[0])) {
// //                                             // Select All option selected
// //                                             setNodeData([{ nodeId: "all" }]);
// //                                         } else {
// //                                             // Regular options selected
// //                                             setNodeData(newValue.map((option: any) => ({ nodeId: option.value })));
// //                                         }
// //                                     }}
// //                                     renderInput={(params) => (
// //                                         <TextField
// //                                             {...params}
// //                                             label={
// //                                                 <span>
// //                                                     Select Node{" "}
// //                                                     {requiredFields.includes("nodeId") && (
// //                                                         <span
// //                                                             style={{
// //                                                                 color: formik.values.nodeId ? "green" : "red",
// //                                                             }}
// //                                                         >
// //                                                             *
// //                                                         </span>
// //                                                     )}
// //                                                 </span>
// //                                             }
// //                                         />
// //                                     )}
// //                                 />
// //                                 {formik.touched.nodeId && formik.errors.nodeId ? (
// //                                     <div style={{ color: "red", margin: "5px" }}>
// //                                         {formik.errors.nodeId}
// //                                     </div>
// //                                 ) : null}
// //                             </Grid>

// //                             <Grid xs={12} item>
// //                                 <div style={{ justifyContent: "space-between", flex: 2 }}>
// //                                     <Button
// //                                         type="submit"
// //                                         variant="contained"
// //                                         style={{
// //                                             width: "48%",
// //                                             backgroundColor: "#059669",
// //                                             margin: "1%",
// //                                         }}

// //                                     //onClick={(e:any) =>AddNodeItem()}
// //                                     >
// //                                         {t("text.save")}
// //                                     </Button>
// //                                     <Button
// //                                         type="reset"
// //                                         variant="contained"
// //                                         style={{
// //                                             width: "48%",
// //                                             backgroundColor: "#F43F5E",
// //                                             margin: "1%",
// //                                         }}
// //                                         onClick={() => formik.resetForm()}
// //                                     >
// //                                         {t("text.reset")}
// //                                     </Button>
// //                                 </div>
// //                             </Grid>
// //                         </Grid>
// //                     </form>
// //                 </CardContent>
// //             </div>
// //         </div>
// //     );
// // };

// // export default NodePermissionAdd;
// // renderOption={(props, option, { selected }) => (
// //     <li {...props}>
// //         <FormControlLabel
// //             control={
// //                 <Checkbox
// //                     style={{ visibility: option.value === "all" ? "hidden" : "visible" }} // Hide checkbox for "Select All" option
// //                     checked={selected}
// //                     onChange={() => handleToggle(option.value)} // Pass option value to handleToggle
// //                 />
// //             }
// //             label={option.label}
// //         />
// //     </li>
// // )}

import React from 'react'

const NodePermissionAdd = () => {
  return (
    <div>NodePermissionAdd</div>
  )
}

export default NodePermissionAdd