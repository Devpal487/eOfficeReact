import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import api, { HOST_URL } from "../utils/Url";
import knn from "../assets/images/qq (1).png";
import data1 from "../assets/images/wfm.webp";

import { toast } from "react-toastify";
import ToastApp from "../ToastApp";

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  let navigate = useNavigate();

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const getNodeData = async (id: any) => {
    const collectData = {
      id: -1,
      nodeID: -1,
      titleID: -1,
      user_Id: id,
    };
    const response = await api.post(
      `NewNodeMaster/GetNewNodeMasterHeirarical`,
      collectData
    );
    if (response.data.isSuccess) {
      localStorage.setItem("id", JSON.stringify(response.data.data[0]["id"]));
      localStorage.setItem("nodeID", JSON.stringify(response.data.data[0]["nodeID"]));
      localStorage.setItem("nodeName",JSON.stringify(response.data.data[0]["name"]));
      localStorage.setItem("inst_id", "1");
      toast.success(response.data.mesg);
    } else {
      toast.error(response.data.mesg);
    }
  };

  const handleButtonClick = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      try {
        const response = await formik.submitForm();
        if (response.isSuccess) {
          if (response.data[0]["userPermission"] == null) {
            toast.error("User Permission is null");
          } else {
            localStorage.setItem("userdata", JSON.stringify(response.data));
            localStorage.setItem("inst_id", "1");
            localStorage.setItem(
              "useR_ID",
              JSON.stringify(response.data[0]["userdetail"][0]["useR_ID"])
            );
            sessionStorage.setItem(
              "token",
              JSON.stringify(response.data[0]["token"])
            );
            formik.resetForm();
            navigate(`/home`);
            toast.success(response.data.mesg);
          }
          timer.current = setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 1000);
        } else {
          toast.error(response.data.mesg);
          setLoading(false);
        }
      } catch (error) {
        toast.error("Login Failed");
        setLoading(false);
      }
    }
  };

  const validationSchema = Yup.object({
    useR_ID: Yup.string().required("Username Required"),
    password: Yup.string().required("Password Required"),
  });

  const formik = useFormik({
    initialValues: {
      useR_ID: "",
      password: "",
      collageID: "1",
      packageID: "1",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await axios.post(HOST_URL + `Auth/USERLOGIN`, values);
      if (response.data.isSuccess) {
        localStorage.setItem("userdata", JSON.stringify(response.data.data));
        localStorage.setItem(
          "useR_ID",
          JSON.stringify(response.data.data[0]["userdetail"][0]["useR_ID"])
        );
        sessionStorage.setItem(
          "token",
          JSON.stringify(response.data.data[0]["token"])
        );
        getNodeData(response.data.data[0]["userdetail"][0]["useR_ID"]);
        toast.success(response.data.mesg);
        formik.resetForm();
        navigate(`/home`);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  return (
    <>
      <div
        className={`loginContainer`}
        style={{ backgroundColor: "rgba(245,245,245,0.7)" }}
      >
        <div className="forms-container">
          <div className="signin-signup">
            <form
              action="#"
              onSubmit={formik.handleSubmit}
              className="sign-in-form loginForm"
            >
              <img
                alt="Active"
                src={knn}
                style={{ height: "15vh", width: "15vh", marginBottom: "20px" }}
              />
              <div>
                <h3 className="loginh3" style={{ fontSize: "25px" }}>
                  {" "}
                  Workflow Management System
                </h3>
              </div>
              <br />
              <div className="input-field">
                <FontAwesomeIcon
                  icon={faUser}
                  className="my-auto mx-auto"
                  style={{ alignSelf: "center", paddingLeft: "12px" }}
                />
                <input
                  className="LoginInput"
                  type="text"
                  name="useR_ID"
                  id="useR_ID"
                  value={formik.values.useR_ID}
                  required
                  placeholder="username"
                  onChange={formik.handleChange}
                />
              </div>
              <div className="input-field">
                <FontAwesomeIcon
                  icon={faLock}
                  className="my-auto mx-auto"
                  style={{ alignSelf: "center", paddingLeft: "12px" }}
                />
                <input
                  className="LoginInput"
                  type="password"
                  required
                  name="password"
                  id="password"
                  value={formik.values.password}
                  placeholder="password"
                  onChange={formik.handleChange}
                />
              </div>
              <div
                className="input-field"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  gap: 10,
                  backgroundColor: "rgb(250 250 250)",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  disabled={loading}
                  onClick={handleButtonClick}
                >
                  {loading ? (
                    <CircularProgress size={24} style={{ color: "green" }} />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  // sx={buttonSx}
                  disabled={loading}
                  onClick={(e) => formik.resetForm()}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <div
                style={{ backgroundSize: "cover", mixBlendMode: "multiply" }}
              >
                <img
                  alt="Active"
                  src={data1}
                  style={{ height: "60vh", width: "80vh" }}
                />
              </div>
            </div>
          </div>
        </div>
        <ToastApp />
      </div>
    </>
  );
}

// import "./index.css";
// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { HOST_URL } from "../utils/Url";
// import knn from '../assets/images/qq (1).png'
// import data1 from '../assets/images/data.png'
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";
// import ToastApp from "../ToastApp";

// function LoginPage() {

//   let navigate = useNavigate();

//   const validationSchema = Yup.object({
//     useR_ID: Yup.string().test(
//       "required",
//       "Username Required",
//       function (value: any) {
//         return value && value.trim() !== "";
//       }
//     ),
//     password: Yup.string().test(
//       "required",
//       "Password Required",
//       function (value: any) {
//         return value && value.trim() !== "";
//       }
//     ),
//   });

//   const formik = useFormik({
//     initialValues: {
//       useR_ID: "",
//       password: "",
//       collageID: "1",
//       packageID: "1",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       const response = await axios.post(
//         HOST_URL + `USER/USERLOGIN`,
//         values
//       );
//       if (response.data.isSuccess) {
//         localStorage.setItem("userdata", JSON.stringify(response.data.data));
//         localStorage.setItem("useR_ID", JSON.stringify(response.data.data[0]["userdetail"][0]["useR_ID"]));
//         sessionStorage.setItem("token", JSON.stringify(response.data.data[0]["token"]));
//         formik.resetForm();
//         navigate(`/home`);
//         toast.success(response.data.mesg);
//       } else {
//         toast.error(response.data.mesg);
//       }
//     },
//   });

//   return (
//     <>
//       <div
//         className={`loginContainer`}
//         style={{
//           backgroundColor: "rgba(245,245,245,0.7)",
//         }}
//       >
//         <div className="forms-container">
//           <div className="signin-signup">
//             <form
//               action="#"
//               onSubmit={formik.handleSubmit}
//               className="sign-in-form loginForm"
//             >
//               <img
//                 alt="Active"
//                 src={knn}
//                 style={{ height: "15vh", width: "15vh", marginBottom: "20px" }}
//               />
//               <div>
//                 <h3 className="loginh3" style={{fontSize:"25px"}}> Panchshaala : File Tracking System</h3>
//               </div>
//               <br />
//               <div className="input-field">
//                 <FontAwesomeIcon
//                   icon={faUser}
//                   className="my-auto mx-auto"
//                   style={{ alignSelf: "center", paddingLeft: "12px" }}
//                 />
//                 <input
//                   className="LoginInput"
//                   type="text"
//                   name="useR_ID"
//                   id="useR_ID"
//                   value={formik.values.useR_ID}
//                   required
//                   placeholder="username"
//                   onChange={formik.handleChange}
//                 />
//               </div>

//               <div className="input-field">
//                 <FontAwesomeIcon
//                   icon={faLock}
//                   className="my-auto mx-auto"
//                   style={{ alignSelf: "center", paddingLeft: "12px" }}
//                 />
//                 <input
//                   className="LoginInput"
//                   type="password"
//                   required
//                   name="password"
//                   id="password"
//                   value={formik.values.password}
//                   placeholder="password"
//                   onChange={formik.handleChange}
//                 />
//               </div>
//               <div
//                 className="input-field"
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "space-around",
//                   gap: 10,
//                   backgroundColor: "rgb(250 250 250)",
//                 }}
//               >
//                 <button type="submit" className="btn">
//                   Sign In
//                 </button>

//                 <button
//                   type="reset"
//                   className="btnreset"
//                   onClick={(e) => formik.resetForm()}
//                 >
//                   Reset
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//         <div className="panels-container">
//           <div className="panel left-panel">
//             <div className="content">
//               <div
//                 style={{ backgroundSize: "cover", mixBlendMode: "multiply" }}
//               >
//                 <img
//                   alt="Active"
//                   src={data1}
//                   style={{ height: "60vh", width: "80vh" }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <ToastApp />
//       </div>
//     </>
//   );
// }

// export default LoginPage;
