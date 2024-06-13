import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Modal,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import { getISTDate, getId } from "../../../utils/Constant";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import axios from "axios";
import api from "../../../utils/Url";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import nopdf from '../../../assets/images/imagepreview.jpg'

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

type Props = {};

const CommitteeEdit = (props: Props) => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  console.log("location", location.state);
  const { defaultValues, defaultValuestime } = getISTDate();
  const ID = getId();

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");

  useEffect(()=>{
    getIP();
    getIMageData(location.state.id);
  },[]);

  const getIP =()=>{
    axios.get('http://ipinfo.io')
    .then((res:any)=>{
    formik.setFieldValue("ipAddress",res.data.ip);
  }
)
  }

  const getIMageData = async (id:any) => {
        const collectData = {
            "id": id,
            "committeeName": "",
            "officeId": 0,
            "userId": "",
            "ipAddress": "",
            "type": ""
        };
        console.log("collectData", collectData)
        const response = await api.post(`CommitteeMaster/GetCommitteeMaster`,collectData);
        console.log("result", response.data.data[0]["committeeLogo"])
        const data = response.data.data[0]["committeeLogo"];
        if(data != null ){
          formik.setFieldValue("committeeLogo", data)
        }else(
          toast.error("Committee Logo was not attached")
        )
      }

  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "committeeLogo") {
      setModalImg(formik.values.committeeLogo);
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
      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);

    }
  };

  let navigate = useNavigate();

  const [toaster, setToaster] = useState(false);

  // const validationSchema = Yup.object({
  //   chackNo: Yup.string().test(
  //     "required",
  //     t("text.reqChackNo"),
  //     function (value: any) {
  //       return value && value.trim() !== "";
  //     }
  //   ),
  //   fileName: Yup.string().test(
  //     "required",
  //     t("text.reqFileName"),
  //     function (value: any) {
  //       return value && value.trim() !== "";
  //     }
  //   ),
  // });

  const formik = useFormik({
    initialValues: {
      "id": location.state.id,
      "committeeName": location.state.committeeName,
      "foundedDate": dayjs(location.state.foundedDate).format("YYYY-MM-DD"),
      "officeId": location.state.officeId,
      "userId": ID,
      "ipAddress": "",
      "uploadDate": defaultValuestime,
      "committeeLogo": location.state.committeeLogo,
      "committeeDesc": location.state.committeeDesc,
      "type": location.state.type
    },
    // validationSchema: validationSchema,

    onSubmit: async (values) => {

      console.log("Before submission formik values", values);

      try {
        const response = await api.post(
          `CommitteeMaster/AddUpdateCommitteeMaster`,

          values
        );
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          navigate("/Committee/CommitteeMaster");
        } else {
          setToaster(true);
          toast.error(response.data.mesg);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }}
  });

  const requiredFields = ["fileName", "chackNo"];

  const back = useNavigate();

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.AddCommittee")}
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


              <Grid sm={4} md={4} xs={12}>
                <FormControl
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    marginTop: "13px",
                    marginLeft: "12px",
                  }}
                >
                  <Grid>
                    <FormLabel>Type</FormLabel>
                  </Grid>
                  <Grid>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      // defaultValue="1"
                      value={formik.values.type}
                      onChange={(event) => {
                        console.log("radio value check", event.target.value);
                        formik.setFieldValue("type",event.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="C"
                        control={<Radio />}
                        label="Committee"
                      />
                      <FormControlLabel
                        value="G"
                        control={<Radio />}
                        label="Group"
                      />
                    </RadioGroup>
                  </Grid>
                </FormControl>
              </Grid>

              <Grid item sm={4} md={4} xs={12}>
                <TextField
                  id="committeeName"
                  name="committeeName"
                  label={
                    <span>
                      {t("text.committeeName")}{" "}
                    </span>
                  }
                  value={formik.values.committeeName}
                  placeholder={t("text.committeeName")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item sm={4} md={4} xs={12}>
                <TextField
                  id="foundedDate"
                  name="foundedDate"
                  label={t("text.foundedDate")}
                  value={formik.values.foundedDate}
                  placeholder={t("text.foundedDate")}
                  size="small"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
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
                    //   inputProps={{ accept: "application/pdf" }}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.AttachedFile")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "committeeLogo")}
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
                    {formik.values.committeeLogo == "" ? (
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
                        src={formik.values.committeeLogo}
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
                      onClick={() => modalOpenHandle("committeeLogo")}
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
                        //   src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%" }}>
                        <img
                          src={modalImg}
                          // type="application/pdf"
                          width="100%"
                          height="100%"
                          style={{ borderRadius: 10 }}
                        />
                      </div>
                    )}
                  </Box>
                </Modal>
              </Grid>
              <Grid xs={12} sm={12} item>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder={t("text.EnterDescriptionofcommittee")}
                  name="committeeDesc"
                  id="committeeDesc"
                  style={{
                    width: "100%",
                    fontSize: " 1.075rem",
                    fontWeight: "400",
                    // lineHeight: "5",
                    padding: "8px 12px",
                    borderRadius: "4px",
                  }}
                  value={formik.values.committeeDesc}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid
                item
                xs={12}
                spacing={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Grid xs={6} style={{ margin: "6px" }}>
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

                <Grid xs={6} style={{ margin: "6px" }}>
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
            </Grid>
          </form>
        </CardContent>
        <ToastApp/>
      </div>
    </div>
  );
};

export default CommitteeEdit;


// import {
//     Button,
//     CardContent,
//     Grid,
//     TextField,
//     Typography,
//     Divider,
//     Modal,
//     Box,
//     FormControl,
//     FormHelperText,
//     InputLabel,
//     RadioGroup,
//     FormControlLabel,
//     Radio,
//     FormLabel
//   } from "@mui/material";
//   import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
//   import React, { useEffect, useState } from "react";
//   import { useNavigate } from "react-router-dom";
//   import { useFormik } from "formik";
//   import * as Yup from "yup";
//   import { useTranslation } from "react-i18next";
//   import { toast } from "react-toastify";
//   import ToastApp from "../../../ToastApp";
//   import api from "../../../utils/Url";
//   import { getISTDate } from "../../../utils/Constant";
//   import { TextareaAutosize } from "@mui/base/TextareaAutosize";

  
//   const style = {
//     position: "absolute" as "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: "180vh",
//     height: "85vh",
//     bgcolor: "#f5f5f5",
//     border: "1px solid #000",
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 10,
//   };
  
//   type Props = {};
  
//   const statusOption = [
//     { value: "1", label: "N/A" },
//     { value: "2", label: "Issue" },
//   ];
  
//   const CommitteeEdit = (props: Props) => {
//     const { i18n, t } = useTranslation();
  
//     const [TypeOption, setTypeOption] = useState<any>([
//       { value: "-1", label: t("text.SelectFileType") },
//     ]);
//     const [GroupOption, setGroupOption] = useState<any>([
//       { value: "-1", label: t("text.SelectFileGroup") },
//     ]);
//     const [CategoryOption, setCategoryOption] = useState<any>([
//       { value: "-1", label: t("text.SelectFileCategory") },
//     ]);
//     const [ClassOption, setClassOption] = useState<any>([
//       { value: "-1", label: t("text.SelectFileClass") },
//     ]);
//     const [SubjectOption, setSubjectOption] = useState<any>([
//       { value: "-1", label: t("text.SelectFileSubject") },
//     ]);
//     const [SenderOption, setSenderOption] = useState<any>([
//       { value: "-1", label: t("text.senderID") },
//     ]);
//     const [LocationOption, setLocationOption] = useState<any>([
//       { value: "-1", label: t("text.currentLocation") },
//     ]);
//     const [nodeOption, setNodeOption] = useState<any>([
//       { value: "-1", label: t("text.nodeID") },
//     ]);
  
//     const [prevRecord, setPrevRecord] = useState<any>("");
//     const [error, setError] = useState("");
//     const [error1, setError1] = useState("");
//     const [error2, setError2] = useState("");
  
//     const { defaultValues, defaultValuestime } = getISTDate();
  
//     useEffect(() => {
//       getFileType();
//       getFileGroup();
//       getCategory();
//       getFileCla();
//       getFileSub();
//       getSender();
//       getLocation();
//       getjurdiscation();
//       getPrevFileData();
//     }, []);
  
  
  
//     const getPrevFileData = async () => {
//       const collectData = {
//         fileID: -1,
//         fileType: -1,
//         fileGroup: -1,
//         fileCategory: -1,
//         fileClass: -1,
//         fileSubject: -1,
//         show: true,
//         exportOption: "string",
//       };
//       const response = await api.post(
//         `FileDetail/GetLastDataFileDetails`,
//         collectData
//       );
//       setPrevRecord(response.data.data);
//       console.log("check", response.data.data);
//     };
  
//     const getFileType = () => {
//       const collectData = {
//         fileTypeId: -1,
//       };
//       api.post(`FileType/GetFileType`, collectData).then((res) => {
//         const arr = res.data.data.map((item: any) => ({
//           label: item.fileTypeName,
//           value: item.fileTypeId,
//         }));
//         setTypeOption(arr);
//       });
//     };
  
//     const getFileGroup = () => {
//       const collectData = {
//         fileGroupid: -1,
//       };
//       api.post(`FileGroup/GetFileGroup`, collectData).then((res) => {
//         const arr = res.data.data.map((item: any) => ({
//           label: item.fileGroupName,
//           value: item.fileGroupid,
//         }));
//         setGroupOption(arr);
//       });
//     };
  
//     const getCategory = () => {
//       const collectData = {
//         fileCatid: -1,
//       };
//       api.post(`FileCategory/GetFileCategory`, collectData).then((res) => {
//         const arr = res.data.data.map((item: any) => ({
//           label: item.fileCatDesc,
//           value: item.fileCatid,
//         }));
//         setCategoryOption(arr);
//       });
//     };
  
//     const getFileCla = () => {
//       const collectData = {
//         fileClassid: -1,
//       };
//       api.post(`FileClass/GetFileClass`, collectData).then((res) => {
//         const arr = res.data.data.map((item: any) => ({
//           label: item.classDescription,
//           value: item.fileClassid,
//         }));
//         setClassOption(arr);
//       });
//     };
  
//     const getFileSub = () => {
//       const collectData = {
//         id: -1,
//       };
//       api.post(`FileSubject/GetFileSubject`, collectData).then((res) => {
//         const arr = res.data.data.map((item: any) => ({
//           label: item.fileSubjectName,
//           value: item.id,
//         }));
//         setSubjectOption(arr);
//       });
//     };
  
//     const getSender = () => {
//       const collectData = {
//         useR_ID: "-1",
//       };
//       api.post(`USER/GetUSER`, collectData).then((res) => {
//         const arr = res.data.data.map((item: any) => ({
//           label: item.firsT_NAME + item.middlE_NAME + item.suR_NAME,
//           value: item.useR_ID,
//         }));
//         setSenderOption(arr);
//       });
//     };
  
//     const getLocation = () => {
//       const collectData = {
//         id: -1,
//       };
//       api.post(`LocationItems/GetMappedLocation`, collectData).then((res) => {
//         const arr = res.data.data.map((item: any) => ({
//           label: item.location,
//           value: item.id,
//         }));
//         setLocationOption(arr);
//       });
//     };
  
//     const getjurdiscation = () => {
//       const collectData = {
//         "id": -1,
//         "nodeID": -1,
//         "titleID": -1
//       };
//       api.post(`NewNodeMaster/GetNewNodeMaster`, collectData).then((res) => {
//         const arr = res?.data?.data?.map((item: any) => ({
//           label: item.name,
//           value: item.id,
//         }));
//         setNodeOption(arr);
//       });
//     };
  
  
//     const [panOpens, setPanOpen] = React.useState(false);
//     const [modalImg, setModalImg] = useState("");
//     const handlePanClose = () => {
//       setPanOpen(false);
//     };
//     const modalOpenHandle = (event: any) => {
//       setPanOpen(true);
//       if (event === "fileDoc") {
//         setModalImg(formik.values.fileDoc);
//       }
//     };
//     const ConvertBase64 = (file: Blob) => {
//       return new Promise((resolve, reject) => {
//         const fileReader = new FileReader();
//         fileReader.readAsDataURL(file);
//         fileReader.onload = () => {
//           resolve(fileReader.result);
//         };
//         fileReader.onerror = (error) => {
//           reject(error);
//         };
//       });
//     };
  
//     const otherDocChangeHandler = async (event: any, params: any) => {
//       if (event.target.files && event.target.files[0]) {
//         const file = event.target.files[0];
//         const fileNameParts = file.name.split(".");
//         const fileExtension = fileNameParts[fileNameParts.length - 1];
//           const base64 = await ConvertBase64(file);
//           formik.setFieldValue(params, base64);
//           console.log(base64);
      
//       }
//     };
  
//     let navigate = useNavigate();
  
//     const [toaster, setToaster] = useState(false);
  
//     const validationSchema = Yup.object({
//       chackNo: Yup.string().test(
//         "required",
//         t("text.reqChackNo"),
//         function (value: any) {
//           return value && value.trim() !== "";
//         }
//       ),
//       fileName: Yup.string().test(
//         "required",
//         t("text.reqFileName"),
//         function (value: any) {
//           return value && value.trim() !== "";
//         }
//       ),
//     });
  
//     let ID: any = localStorage.getItem("useR_ID");
//     if (ID !== null) {
//       ID = ID.replace(/\D/g, "");
//     }
  
//     const formik = useFormik({
//       initialValues: {
//         fileID: -1,
//         type:"",
//         committeeName: "",
//         foundedDate: "",
//         fileDoc: "",
//       },
//       validationSchema: validationSchema,
  
//       onSubmit: async (values) => {
       
//         console.log("Before submission formik values", values);
  
//         try {
//           const response = await api.post(
//             `FileDetail/AddUpdateFileDetails`,
  
//             values
//           );
//           if (response.data.isSuccess) {
//             toast.success(response.data.mesg);
//             navigate("/Library/FileDetail");
//           } else {
//             setToaster(true);
//             toast.error(response.data.mesg);
//           }
//         } catch (error) {
//           toast.error("An error occurred. Please try again.");
//         }
     
//     }
//   });
  
//     const requiredFields = ["fileName", "chackNo"];
  
//     const back = useNavigate();
  
//     return (
//       <div>
//         <div
//           style={{
//             padding: "-5px 5px",
//             backgroundColor: "#ffffff",
//             borderRadius: "5px",
//             border: ".5px solid #FF7722",
//             marginTop: "3vh",
//           }}
//         >
//           <CardContent>
//             <Typography
//               variant="h5"
//               textAlign="center"
//               style={{ fontSize: "18px", fontWeight: 500 }}
//             >
//               {t("text.EditCommittee")}
//             </Typography>
  
//             <Grid item sm={4} xs={12}>
//               <Typography style={{ marginTop: "-75px" }}>
//                 <Button
//                   type="submit"
//                   onClick={() => back(-1)}
//                   variant="contained"
//                   style={{
//                     marginBottom: 15,
//                     marginTop: "45px",
//                     backgroundColor: "blue",
//                     width: 20,
//                   }}
//                 >
//                   <ArrowBackSharpIcon />
//                 </Button>
//               </Typography>
//             </Grid>
//             <Divider />
//             <br />
//             <form onSubmit={formik.handleSubmit}>
//               {toaster === false ? "" : <ToastApp />}
//               <Grid item xs={12} container spacing={2}>
//               {/* <Grid item lg={12} xs={12}>
//                                 <FormControl>
//                                     <FormLabel id="demo-row-radio-buttons-group-label">Type</FormLabel>
//                                     <RadioGroup
//                                         row
//                                         aria-labelledby="demo-row-radio-buttons-group-label"
//                                         name="row-radio-buttons-group"
//                                         defaultValue="Committee"
//                                     >
//                                         <FormControlLabel value="Committee" control={<Radio />} label="Committee" />
//                                         <FormControlLabel value="Group" control={<Radio />} label="Group" />
//                                     </RadioGroup>
//                                 </FormControl>

//                             </Grid> */}

//                             <Grid sm={4} md={4} xs={12}>
//                 <FormControl
//                   style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 20,
//                     marginTop: "13px",
//                     marginLeft: "12px",
//                   }}
//                 >
//                   <Grid>
//                     <FormLabel>Type</FormLabel>
//                   </Grid>
//                   <Grid>
//                     <RadioGroup
//                       row
//                       aria-labelledby="demo-row-radio-buttons-group-label"
//                       name="row-radio-buttons-group"
//                       defaultValue="Committee"
//                       onChange={(event) => {
//                         //const isActive = event.target.value === "Yes";
                        
//                       }}
//                     >
//                       <FormControlLabel
//                         value="Committee" 
//                         control={<Radio />}
//                         label="Committee"
//                       />
//                       <FormControlLabel
//                         value="Group"
//                         control={<Radio />}
//                         label = "Group"
//                       />
//                     </RadioGroup>
//                   </Grid>
//                 </FormControl>
//               </Grid>
                
//                 <Grid item sm={4} md={4} xs={12}>
//                   <TextField
//                     id="committeeName"
//                     name="committeeName"
//                     label={
//                       <span>
//                         {t("text.committeeName")}{" "}
//                       </span>
//                     }
//                     value={formik.values.committeeName}
//                     placeholder={t("text.committeeName")}
//                     size="small"
//                     fullWidth
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   {/* {formik.touched.fileName && formik.errors.fileName ? (
//                     <div style={{ color: "red", margin: "5px" }}>
//                       {formik.errors.fileName}
//                     </div>
//                   ) : null} */}
//                 </Grid>
  
//                 <Grid item sm={4} md={4} xs={12}>
//                   <TextField
//                     id="foundedDate"
//                     name="foundedDate"
//                     label={t("text.foundedDate")}
//                     value={formik.values.foundedDate}
//                     placeholder={t("text.foundedDate")}
//                     size="small"
//                     type="date"
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                     style={{ backgroundColor: "white" }}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                 </Grid>
  
                
//                 <Grid container spacing={1} item>
//                   <Grid
//                     xs={12}
//                     md={4}
//                     sm={4}
//                     item
//                     style={{ marginBottom: "30px", marginTop: "30px" }}
//                   >
//                     <TextField
//                       type="file"
//                     //   inputProps={{ accept: "application/pdf" }}
//                       InputLabelProps={{ shrink: true }}
//                       label={
//                         <strong style={{ color: "#000" }}>
//                           {t("text.AttachedFile")}
//                         </strong>
//                       }
//                       size="small"
//                       fullWidth
//                       style={{ backgroundColor: "white" }}
//                       onChange={(e) => otherDocChangeHandler(e, "fileDoc")}
//                     />
//                   </Grid>
//                   <Grid xs={12} md={4} sm={4} item></Grid>
  
//                   <Grid xs={12} md={4} sm={4} item>
//                     <Grid
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-around",
//                         alignItems: "center",
//                         margin: "10px",
//                       }}
//                     >
//                       {formik.values.fileDoc == "" ? (
//                         <img
//                         //   src={nopdf}
//                           style={{
//                             width: 150,
//                             height: 100,
//                             border: "1px solid grey",
//                             borderRadius: 10,
//                           }}
//                         />
//                       ) : (
//                         <embed
//                           src={formik.values.fileDoc}
//                           style={{
//                             width: 150,
//                             height: 100,
//                             border: "1px solid grey",
//                             borderRadius: 10,
//                             padding: "2px",
//                           }}
//                         />
//                       )}
//                       <Typography
//                         onClick={() => modalOpenHandle("fileDoc")}
//                         style={{
//                           textDecorationColor: "blue",
//                           textDecorationLine: "underline",
//                           color: "blue",
//                           fontSize: "15px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         {t("text.Preview")}
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                   <Modal open={panOpens} onClose={handlePanClose}>
//                     <Box sx={style}>
//                       {modalImg == "" ? (
//                         <img
//                         //   src={nopdf}
//                           style={{
//                             width: "170vh",
//                             height: "75vh",
//                           }}
//                         />
//                       ) : (
//                         <div style={{ width: "100%", height: "100%" }}>
//                           <img
//                             src={modalImg}
//                             // type="application/pdf"
//                             width="100%"
//                             height="100%"
//                             style={{ borderRadius: 10 }}
//                           />
//                         </div>
//                       )}
//                     </Box>
//                   </Modal>
//                 </Grid>
//                 <Grid xs={12} sm={12} item>
//                 <TextareaAutosize
//                   aria-label="empty textarea"
//                   placeholder={t("text.EnterDescriptionofcommittee")}
//                   name="descriptionOfTender"
//                   id="descriptionOfTender"
//                   style={{
//                     width: "100%",
//                     fontSize: " 1.075rem",
//                     fontWeight: "400",
//                     // lineHeight: "5",
//                     padding: "8px 12px",
//                     borderRadius: "4px",
//                   }}
//                 //   value={formik.values.descriptionOfTender}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </Grid>
//                 <Grid
//                   item
//                   xs={12}
//                   spacing={2}
//                   style={{ display: "flex", justifyContent: "center" }}
//                 >
//                   <Grid xs={6} style={{ margin: "6px" }}>
//                     <Button
//                       type="submit"
//                       fullWidth
//                       style={{
//                         backgroundColor: "#059669",
//                         color: "white",
//                         marginTop: "10px",
//                       }}
//                     >
//                       {t("text.update")}
//                     </Button>
//                   </Grid>
  
//                   <Grid xs={6} style={{ margin: "6px" }}>
//                     <Button
//                       type="reset"
//                       fullWidth
//                       style={{
//                         backgroundColor: "#F43F5E",
//                         color: "white",
//                         marginTop: "10px",
//                       }}
//                       onClick={(e) => formik.resetForm()}
//                     >
//                       {t("text.reset")}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </form>
//           </CardContent>
//         </div>
//       </div>
//     );
//   };
  
//   export default CommitteeEdit;