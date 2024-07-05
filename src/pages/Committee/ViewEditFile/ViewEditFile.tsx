import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Autocomplete,
  FormControlLabel,
  IconButton,
  Checkbox,
  Tabs,
  Tab,
  Table,
  Drawer,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  Modal,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  TableCell,
  TableBody,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import api from "../../../utils/Url";
import MenuIcon from "@mui/icons-material/Menu";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CustomizedProgressBars from "../../../components/Loader";
import { toast } from "react-toastify";
import { getISTDate } from "../../../utils/Constant";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import ToastApp from "../../../ToastApp";
import {
  EditIcons,
  UploadIcons,
  PasteIcons,
  PrintIcons,
  PendingIcons,
  UpgradeIcons,
  FileCopyIcons,
  FilemoveIcons,
  HighlightIcons,
  SmsIcons,
  MakeIcons,
  ArchiveIcons,
  CloseIcons,
} from "../../../utils/icons";
import CustomLabel from "../../../CustomLable";
import moment from "moment";

import { getinstId, getId, getdivisionId } from "../../../utils/Constant";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MapIcon from "@mui/icons-material/Map";
import AddIcon from "@mui/icons-material/Add";
import nopdf from "../../../assets/images/imagepreview.jpg";

import Paper from "@mui/material/Paper";
import ReactQuill from "react-quill";
import NoteSheet from "./NoteSheet";
import Correspondence from "./Correspondence";
import Other from "./Other";
import Corress from "../Correspondence/Correspondence";

import Report from "./Report";

import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    padding: "5px !important",
    backgroundColor: "#00009c",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "2px !important",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "& td, & th": {
    padding: "3px !important",
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",

  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
};

const AntennaOption = [
  { label: "Antenna-1", value: "A1" },
  { label: "Antenna-2", value: "A2" },
  { label: "Antenna-3", value: "A3" },
  { label: "Antenna-4", value: "A4" },
];

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

type Props = {};

const ViewEditFile: React.FC = (props: Props) => {
  const { t } = useTranslation();
  const userId = getId();

  const instId: any = getinstId();
  // console.log("🚀 ~ ViewEditFile ~ userId:", userId);
  const divId: any = getdivisionId();
  // console.log("🚀 ~ ViewEditFile ~ divId:", divId);

  const [getFileNumber, setGetFileNumber] = useState(false);
  const [value, setValue] = useState(0);
  const [MovementTableData, setMovementTableData] = useState<any>([]);
  const [fileMovementTableData, setFileMovementTableData] = useState<any>([]);
  const [pdfView, setPdfView] = useState("");
  const { defaultValuestime } = getISTDate();
  const [ParentInst, setParentInst] = useState<any>([
    { value: "-1", label: t("text.SelectFileNo") },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isHover1, setIsHover1] = useState(false);
  const [pdfData, setPDFData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setIsTableLoading] = useState(false);
  const [openModals, setOpenModals] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [fileMovementDetailopen, setFileMovementDetailOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("lg");

  const [Awaitopen, setAwaitopen] = useState(false);
  const [Parkopen, setParkopen] = useState(false);
  const [Moveopen, setMoveopen] = useState(false);
  const [Sumopen, setSumopen] = useState(false);

  const [openDraggable, setOpenDraggable] = useState(false);
  const [remarkForward, setRemarkForward] = useState("");
  const handleClickOpenDraggable = () => {
    setOpenDraggable(true);
  };

  const handleCloseDraggable = () => {
    setOpenDraggable(false);
    // setNodeId("");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAWaitOpen = () => {
    console.log("await is clicked");
    setAwaitopen(true);
  };
  const handleAWaitClose = () => {
    setAwaitopen(false);
  };

  const handleParkOpen = () => {
    setParkopen(true);
  };
  const handleParkClose = () => {
    setParkopen(false);
  };

  const handleMoveOpen = () => {
    setMoveopen(true);
  };
  const handleMoveClose = () => {
    setMoveopen(false);
  };

  const handleSumOpen = () => {
    setSumopen(true);
  };
  const handleSumClose = () => {
    setSumopen(false);
  };

  //dialog entry
  const [fileID, setFileID] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileOpenDates, setFileOpenDates] = useState("");
  const [fileTransfered, setFileTransfered] = useState("");
  const [lastStatus, setLastStatus] = useState("");

  const [panOpens, setPanOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");

  const [nodeId, setNodeId] = useState<any>("");
  const [route2, setRoute2] = useState<any>("");
  const [letterRID, setLetterRID] = useState<any>("");
  const [authorityLevel, setAuthorityLevel] = useState<any>("");
  const [minDueDate, setMinDueDate] = useState("");
  const [NoteOpen, setNoteOpen] = useState(false);
  const [CoreOpen, setCoreOpen] = useState(false);
  const [ReportOpen, setReportOpen] = useState(false);
  const [OtherOpen, setOtherOpen] = useState(false);
  const [editorContent, setEditorContent] = useState<string>("");

  const handleEditorChange = (content: any) => {
    const textWithoutTags = content.replace(/<[^>]*>/g, "").trim(); // Remove HTML tags
    console.log("textWithoutTags", textWithoutTags);
    setEditorContent(textWithoutTags);
  };

  const handleNotesheet = () => {
    setNoteOpen(true);
  };

  const handleNoteClose = () => {
    setNoteOpen(false);
  };

  const handleCorress = () => {
    setCoreOpen(true);
  };

  const handleCoreClose = () => {
    setCoreOpen(false);
  };

  const handleReport = () => {
    setReportOpen(true);
  };

  const handleReportClose = () => {
    setReportOpen(false);
  };

  const handleOther = () => {
    setOtherOpen(true);
  };

  const handleOtherClose = () => {
    setOtherOpen(false);
  };

  const handlefileMovementDetailOpen = () => {
    setFileMovementDetailOpen(true);
    setIsDrawerOpen(true);
  };

  const handlefileMovementDetailClose = () => {
    setFileMovementDetailOpen(false);
    setIsDrawerOpen(true);
  };

  const handleMouseOver = (index: any) => {
    setActiveItem(index);
  };

  const handleMouseOut = () => {
    setActiveItem(null);
  };

  const listItemStyle = (index: any) => ({
    cursor: "pointer",
    padding: "5px 15px",
    margin: "1%",
    color: "black",
    borderRadius: "10px",
    border: "1px solid #dcdcdc",
    transition: "all 0.3s ease",
    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    justifyContent: "space-between",
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
    borderRightStyle: "solid",
    activeStyle: {
      backgroundColor: "#b3c7c4",
      color: "#00009c",
    },
  });

  const activeStyle = {
    backgroundColor: "#b1ccc8",
    color: "#00009c",
  };

  const toggleDrawer = (open: any) => (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const toggleRightDrawer = () => {
    setRightOpen(!rightOpen);
    setIsDrawerOpen(true);
    setFilebase64("");
  };

  const toggleRight = () => {
    setRightOpen(!rightOpen);
    setIsDrawerOpen(false);
  };

  const handleTab = (event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    getFileNo();
  }, []);

  const getFileNo = () => {
    const collectData = {
      fnId: -1,
      fId: -1,
      inst_id: -1,
      user_id: -1,
      divisionId: -1,
    };
    api.post(`FileNumber/GetFileNumber`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.fileNm,
        value: item.fnId,
      }));
      setParentInst(arr);
    });
  };

  const getTableData = (id: any) => {
    setIsTableLoading(true);
    const collectData = {
      fileNo: id,
      cDocsFlag: "C",
      type: 2,
    };
    api.post(`FileNumber/GetViewEditFileNo`, collectData).then((res) => {
      const arr: any = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          cAid: res.data.data[index]["cAid"],
          id: res.data.data[index]["rid"],
          rid: res.data.data[index]["rid"],
          fileNo: res.data.data[index]["fileNo"],
          fileNm: res.data.data[index]["fileNm"],
          cFileNm: res.data.data[index]["cFileNm"],
          date: res.data.data[index]["date"],
        });
        setFileOpenDates(res.data.data[index]["cFileOpenDate"]);
        setFileTransfered(res.data.data[index]["cFileTranfer"]);
        setLastStatus(res.data.data[index]["lastStaus"]);
        setRoute2(res.data.data[index]["routeId"]);
        setAuthorityLevel(res.data.data[index]["authorityLevel"]);
        setLetterRID(res.data.data[index]["rid"]);
      }
      setMovementTableData(arr);
      setIsTableLoading(false);
    });
  };

  const getDescriptionForNodeMode = (nodeMode: any) => {
    switch (nodeMode) {
      case "A":
        return "Authority";
      case "C":
        return "Committee ";
      case "G":
        return "Group";
      case "P":
        return "CommitteeGroup Parameters";
      default:
        return "";
    }
  };

  const getMoveTableData = () => {
    // setIsTableLoading(true);
    const collectData = {
      fileNo: formik.values.fileNo,
      cDocsFlag: "C",
      type: 2,
    };
    api.post(`FileNumber/GetFileMovementDetail`, collectData).then((res) => {
      const arr: any = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          id: res.data.data[index]["rid"],
          designation: res.data.data[index]["designation"],
          lastStatus: res.data.data[index]["lastStatus"],
          fileRdate: res.data.data[index]["fileRdate"],
          updateremark: res.data.data[index]["updateremark"],
          authorityLevel: res.data.data[index]["authorityLevel"],
          routeName: res.data.data[index]["routeName"],
          routeID: res.data.data[index]["routeID"],
        });
        setNodeId(res.data.data[index]["routeID"]);
      }
      setFileMovementTableData(arr);
      // setIsTableLoading(false);
    });
  };

  const farwordData = () => {
    const value = {
      eid: userId,
      fileNo: fileName,
      remark: remarkForward,
      hdnjurisdiction: divId,
      hdnFilNu: fileID,
      hdnAuthMail: userId,
      status: "",
      type: 1,
    };
    // console.log("🚀 ~ farwordData ~ value:", value);
    api.post(`FileMovement/SP_ForwardFileApi`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handlefileMovementDetailClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const backwardData = () => {
    const value = {
      eid: userId,
      fileNo: fileName,
      remark: remarkForward,
      hdnjurisdiction: divId,
      hdnFilNu: fileID,
      hdnAuthMail: userId,
      status: "",
      type: 2,
    };
    // console.log("🚀 ~ farwordData ~ value:", value);
    api.post(`FileMovement/SP_ForwardFileApi`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handlefileMovementDetailClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const MoveAwait = () => {
    let value;
    if (
      route2 != null &&
      route2 != "" &&
      authorityLevel != null &&
      authorityLevel != ""
    ) {
      value = {
        hdnFilNu: formik.values.fileNo,
        inst_id: parseInt(instId),
        userid: userId,
        moveddate: formik.values.moveDate.toString() || "",
        duedate: formik.values.dueDate.toString() || "",
        remark: "A",
        routeId: parseInt(route2),
        authorityLevel: authorityLevel,
        workPlaceFlag: "awaited",
        remId: 0,
        divisionId: parseInt(divId),
        message: "",
      };
    } else {
      toast.error("No Route or Authority for this File...");
    }
    // console.log("🚀 ~ farwordData ~ value:", value);
    api.post(`FileMovement/sp_movetoawait`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handleAWaitClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const MoveParked = () => {
    let value;
    if (
      route2 != null &&
      route2 != "" &&
      authorityLevel != null &&
      authorityLevel != ""
    ) {
      value = {
        hdnFilNu: formik.values.fileNo,
        inst_id: parseInt(instId),
        userid: userId,
        moveddate: formik.values.moveDate.toString() || "",
        duedate: formik.values.dueDate.toString() || "",
        remark: "P",
        routeId: parseInt(route2),
        authorityLevel: authorityLevel,
        workPlaceFlag: "Parked/Archived",
        remId: 0,
        divisionId: parseInt(divId),
        message: "",
      };
    } else {
      toast.error("No Route or Authority for this File...");
    }
    api.post(`FileMovement/sp_movetoawait`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handleParkClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const MoveClose = () => {
    let value;
    if (
      route2 != null &&
      route2 != "" &&
      authorityLevel != null &&
      authorityLevel != ""
    ) {
      value = {
        hdnFilNu: formik.values.fileNo,
        inst_id: parseInt(instId),
        userid: userId,
        moveddate: formik.values.moveDate.toString() || "",
        duedate: formik.values.dueDate.toString() || "",
        remark: "C",
        routeId: parseInt(route2),
        authorityLevel: authorityLevel,
        workPlaceFlag: "Closed",
        remId: 0,
        divisionId: parseInt(divId),
        message: "",
      };
    } else {
      toast.error("No Route or Authority for this File...");
    }

    api.post(`FileMovement/sp_movetoawait`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handleMoveClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const UpdateSummary = () => {
    const value = {
      cFileNo: fileID,
      movedDate: null,
      remark: formik.values.SumRemark.toString() || "",
      dueDate: null,
      flag: lastStatus,
      instId: parseInt(instId),
      userId: userId,
      divisionId: parseInt(divId),
    };

    api.post(`FileMovement/Updatesp_FileSummeryUpdate`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handleSumClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const getRouteView = async (id: any) => {
    console.log("🚀 ~ getRouteView ~ id:", id);
    handleClickOpenDraggable();
    let collectData;
    if (id != null && id != "") {
      collectData = {
        id: id,
        authorityId: -1,
        routeId: -1,
        officeId: -1,
        committeeOrGroupId: -1,
        auth_DeptId: -1,
        auth_SectionId: -1,
      };
    } else {
      toast.error("Route is null");
    }
    console.log("🚀 ~ getRouteView ~ collectData:", collectData);
    await api
      .post(`RouteMemberCycle/GetRouteMemberCycle`, collectData)
      .then((res: any) => {
        setNodeId(res.data.data);
      });
  };

  let navigate = useNavigate();

  const handleCheckboxChange = (event: any) => {
    setGetFileNumber(event.target.checked);
    if (event.target.checked) {
      setOpen(true);
    }
  };

  // const handleClose = () => {
  //     setOpen(false);
  // };

  const requiredFields = ["pdfName"];

  const validationSchema = Yup.object().shape({
    moveDate: Yup.date().required("Moved Date is required"),
    dueDate: Yup.date()
      .required("Due Date is required")
      .min(Yup.ref("moveDate"), "Due Date must be after Moved Date"),
  });

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
      FileDesc: "",
      fileattach_name: "",
      fileLable: "",
      moveDate: new Date().toISOString().substring(0, 10),
      dueDate: "",
      parkDate: "",
      closeDate: "",
      remark: "",
      uploading: "",
      antenna: "",
      SumRemark: "",
    },
    validationSchema: validationSchema,
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

  const handleMoveDateChange = (event: any) => {
    const moveDate = event.target.value;
    formik.setFieldValue("moveDate", moveDate);
    formik.setFieldValue("dueDate", "");
    setMinDueDate(moveDate);
  };

  const [cfileNm, setCfileNm] = useState("");
  const [cFileDesc, setCFileDesc] = useState("");
  const [filebase64, setFilebase64] = useState("");

  const LetterSubmit = () => {
    let value;

    console.log("🚀 ~ LetterSubmit ~ fileID:", fileID);
    console.log("🚀 ~ LetterSubmit ~ letterRID:", letterRID);
    if (fileID != "" && letterRID != "" && letterRID != null) {
      value = {
        caId: -1,
        cId: 0,
        fileNo: fileID,
        cFileNm: cfileNm,
        cFileDesc: cFileDesc,
        cDocsFlag: "",
        inst_id: instId,
        user_id: userId,
        createdDate: defaultValuestime,
        rId: letterRID,
        divisionid: divId,
        pdfPath: "",
        pdfBase64: filebase64,
      };
    } else {
      toast.error("Please select file number...");
    }
    api
      .post(`CreateNewFileAttach/AddUpdateCreateNewFileAttach`, value)
      .then((res) => {
        if (res.data.isSuccess) {
          // getFileNo();
          // formik.setFieldValue('rFileNumber', res.data.insertedId);
          toast.success(res.data.mesg);
          getTableData(formik.values.fileNo);
          setFilebase64("");
        }
      });
  };

  const tabStyle = {
    default: {
      backgroundColor: "#00009c",
      color: "#fff",
      fontWeight: "normal",

      // '&:hover': {
      //   backgroundColor: '#f0f0f0',
      // },
    },
    selected: {
      backgroundColor: "#f0f0f0",
      // color: '#00009c',
      fontWeight: "bold",
    },
  };

  const getFileData = (row: any) => {
    console.log("🚀 ~ getFileData ~ cAid:", row);
    setIsLoading(true);
    let collectData;

    if (row?.rid == null || row?.rid === "") {
      if (row?.cAid != null && row?.cAid !== "") {
        collectData = {
          caId: row?.cAid,
          cId: -1,
        };
      } else {
        toast.error("Some issues... Please try next time");
      }

      api
        .post(`CreateNewFileAttach/GetCreateNewFileAttach`, collectData)
        .then((response) => {
          if (response?.data?.data[0]["pdfBase64"] != null) {
            setPDFData(response?.data?.data[0]["pdfBase64"]);
            setIsLoading(false);
          } else {
            toast.error("No PDF Attached");
          }
        });
    } else {
      if (row?.rid != null && row?.rid !== "") {
        collectData = {
          rid: row?.rid,
          rlId: -1,
          rFileType: -1,
          inst_id: -1,
          user_id: "",
          fromdate: "2020-06-19T09:34:14.829Z",
          todate: "2024-06-19T09:34:14.829Z",
          refNo: -1,
          divisionid: -1,
          type: 1,
        };
      } else {
        toast.error("Some issues... Please try next time");
      }

      api
        .post(`ReferenceDiary/GetReferenceDiary`, collectData)
        .then((response) => {
          if (response?.data?.data[0]["pdfBase64"] != null) {
            setPDFData(response?.data?.data[0]["pdfBase64"]);
            setIsLoading(false);
          } else {
            toast.error("No PDF Attached");
          }
        });
    }
  };

  const handleMouseEntered = () => {
    setIsHover1(true);
  };

  const handleMouseLeaveed = () => {
    setIsHover1(false);
  };
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const handleAddCommentClicks = (row: any) => {
    console.log("🚀 ~ handleAddCommentClicks ~ row:", row);
    getFileData(row);
    setSelectedRow(row);
    setOpenModals(true);
  };

  const handleCloseModals = () => {
    setOpenModals(false);
    setSelectedRow(null);
    setPDFData("");
  };

  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "uploading") {
      setModalImg(formik.values.uploading);
    }
  };

  const ConvertBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const otherDocChangeHandler = async (event: any, params: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);
    }
  };

  const items = [
    {
      text: " Split Pdf",
      icon: <EditIcons />,
      onClick: () => {
        navigate("/Committee/SplitPDF");
      },
    },
    {
      text: " Upload Letters",
      icon: <UploadIcons />,
      onClick: () => {
        toggleRight();
      },
    },
    {
      text: " Make Correspondence",
      icon: <MakeIcons />,
      onClick: () => {
        navigate("/E-Office/Correspondence");
      },
    },
    { text: " FLRD", icon: <PasteIcons /> },
    { text: " Print", icon: <PrintIcons /> },
    { text: " Update Remark", icon: <UpgradeIcons /> },
    { text: " Pending PUC", icon: <PendingIcons /> },
    {
      text: " File Movement Details",
      icon: <FilemoveIcons />,
      onClick: () => {
        if (formik.values.fileNo) {
          handlefileMovementDetailOpen();
          getMoveTableData();
        } else {
          toast.error("Please select file Number");
        }
      },
    },
    {
      text: " Moved To Awaited List",
      icon: <FileCopyIcons />,

      onClick: () => {
        if (formik.values.fileNo) {
          handleAWaitOpen();
        } else {
          toast.error("Please select file Number");
        }
      },
    },
    {
      text: " Moved To Parked/Archived List",
      icon: <ArchiveIcons />,

      onClick: () => {
        if (formik.values.fileNo) {
          handleParkOpen();
        } else {
          toast.error("Please select file Number");
        }
      },
    },
    {
      text: " Close The File",
      icon: <HighlightIcons />,

      onClick: () => {
        if (formik.values.fileNo) {
          handleMoveOpen();
        } else {
          toast.error("Please select file Number");
        }
      },
    },
    {
      text: "File Summary",
      icon: <SmsIcons />,
      onClick: () => {
        if (formik.values.fileNo) {
          handleSumOpen();
        } else {
          toast.error("Please select file Number");
        }
      },
    },
  ];

  const back = useNavigate();

  const handleForwardData = async () => {
    farwordData();
  };

  const handleBackwardData = async () => {
    backwardData();
  };

  const addNoteSheet = () => {
    const value = {
      fileId: -1,
      fileNo: fileName,
      fNid: fileID,
      fileType: "",
      fileCont: "",
      nodeId: 1,
      dateSave: defaultValuestime,
      reviewFlag: "N",
      uploading: formik.values.uploading.toString() || "",
      uploadingbyte: "",
    };

    api.post(`Correspondance/AddUpdateCorrespondance`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handleNoteClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const addCorrespondence = () => {
    const value = {
      fileId: -1,
      fileNo: fileName,
      fNid: fileID,
      fileType: "",
      fileCont: "",
      nodeId: 1,
      dateSave: defaultValuestime,
      reviewFlag: "C",
      uploading: formik.values.uploading.toString() || "",
      uploadingbyte: "",
    };

    api.post(`Correspondance/AddUpdateCorrespondance`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handleCoreClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const addReport = () => {
    const value = {
      fileId: -1,
      fileNo: fileName,
      fNid: fileID,
      fileType: "",
      fileCont: "",
      nodeId: 1,
      dateSave: defaultValuestime,
      reviewFlag: "R",
      uploading: formik.values.uploading.toString() || "",
      uploadingbyte: "",
    };

    api.post(`Correspondance/AddUpdateCorrespondance`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handleReportClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const addOther = () => {
    const value = {
      fileId: -1,
      fileNo: fileName,
      fNid: fileID,
      fileType: "",
      fileCont: "",
      nodeId: 1,
      dateSave: defaultValuestime,
      reviewFlag: "O",
      uploading: formik.values.uploading.toString() || "",
      uploadingbyte: "",
    };

    api.post(`Correspondance/AddUpdateCorrespondance`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        handleReportClose();
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          marginTop: "5px",
          border: ".5px solid #2B4593",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.ViewEditFile")}
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
            <Grid item xs={12} container spacing={1}>
              <Grid item lg={3} md={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ParentInst}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue);
                    formik.setFieldValue("fileNo", newValue?.value);
                    if (newValue?.value != null) {
                      getTableData(newValue?.value);
                    }
                    setFileID(newValue?.value);
                    setFileName(newValue?.label);
                    formik.setFieldValue("fileLable", newValue?.lable);
                    formik.setFieldTouched("fileNo", true);
                    formik.setFieldTouched("fileNo", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectFileNo")} />}
                    />
                  )}
                />
              </Grid>

              <Grid
                item
                lg={3}
                md={4}
                xs={12}
                display="flex"
                alignItems="center"
              >
                <Typography fontWeight={600}>File Open Date: </Typography>{" "}
                <p> {fileOpenDates}</p>
              </Grid>

              <Grid
                item
                lg={3}
                md={4}
                xs={12}
                display="flex"
                alignItems="center"
              >
                <Typography fontWeight={600}>File Transfer: </Typography>{" "}
                <p> {fileTransfered}</p>
              </Grid>

              <Grid
                item
                lg={3}
                md={4}
                xs={12}
                display="flex"
                alignItems="center"
              >
                <Typography fontWeight={600}>Status: </Typography>{" "}
                <p> {lastStatus}</p>
              </Grid>

              <Grid item lg={3} md={4} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getFileNumber}
                      onChange={handleCheckboxChange}
                      name="getFileNumber"
                      color="primary"
                    />
                  }
                  label={t("text.GetFileNoRFID")}
                />

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <IconButton
                      edge="end"
                      onClick={handleClose}
                      aria-label="close"
                      sx={{ color: "black", marginLeft: "97%" }}
                    >
                      <CloseIcons />
                    </IconButton>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      {t("text.RfidSCanForFile")}
                    </Typography>

                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid item xs={4}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={AntennaOption}
                          fullWidth
                          size="small"
                          value={
                            AntennaOption.find(
                              (option: any) =>
                                option.value === formik.values.antenna
                            ) || null
                          }
                          onChange={(event, newValue: any) => {
                            console.log(newValue?.value);

                            formik.setFieldValue(
                              "antenna",
                              newValue?.value + ""
                            );

                            formik.setFieldTouched("antenna", true);
                            formik.setFieldTouched("antenna", false);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("text.SelectAntenna")}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <FormControlLabel
                          control={<Checkbox name="remember" color="primary" />}
                          label="Remember "
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <Button variant="contained" color="primary" fullWidth>
                          Scan
                        </Button>
                      </Grid>

                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => {
                            formik.resetForm();
                          }}
                        >
                          Reset
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </Grid>
              <br />
              <Grid xs={12} sm={12} item>
                <IconButton onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
              </Grid>

              <Grid item lg={12} xs={12}>
                <Tabs
                  value={value}
                  onChange={handleTab}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                  variant="fullWidth"
                  sx={{
                    minHeight: "50px",
                    maxHeight: "50px",
                    alignItems: "center",
                  }}
                >
                  
                  <Tab
                    label="Files"
                    sx={value === 0 ? tabStyle.selected : tabStyle.default}
                   
                   
                  />


                  <Tab
                    label="Notesheet"
                    sx={value === 1 ? tabStyle.selected : tabStyle.default}
                    icon={
                      <IconButton
                        onClick={() => {
                          if (formik.values.fileNo) {
                            handleNotesheet();
                          } else {
                            toast.error("Please select file Number");
                          }
                        }}
                        size="small"
                        sx={{
                          backgroundColor: value === 1 ? "skyblue" : "white",
                          color: "black",
                          "&:hover": {
                            backgroundColor: value === 1 ? "skyblue" : "white",
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                    iconPosition="end"
                  />
                  <Tab
                    label="Correspondence"
                    sx={value === 2 ? tabStyle.selected : tabStyle.default}
                    icon={
                      <IconButton
                        onClick={() => {
                          if (formik.values.fileNo) {
                            handleCorress();
                          } else {
                            toast.error("Please select file Number");
                          }
                        }}
                        size="small"
                        sx={{
                          backgroundColor: value === 2 ? "skyblue" : "white",
                          color: "black",
                          "&:hover": {
                            backgroundColor: value === 2 ? "skyblue" : "white",
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                    iconPosition="end"
                  />
                  <Tab
                    label="Report"
                    sx={value === 3 ? tabStyle.selected : tabStyle.default}
                    icon={
                      <IconButton
                        onClick={() => {
                          if (formik.values.fileNo) {
                            handleReport();
                          } else {
                            toast.error("Please select file Number");
                          }
                        }}
                        size="small"
                        sx={{
                          backgroundColor: value === 3 ? "skyblue" : "white",
                          color: "black",
                          "&:hover": {
                            backgroundColor: value === 3 ? "skyblue" : "white",
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                    iconPosition="end"
                  />
                  <Tab
                    label="Other"
                    sx={value === 4 ? tabStyle.selected : tabStyle.default}
                    icon={
                      <IconButton
                        onClick={() => {
                          if (formik.values.fileNo) {
                            handleOther();
                          } else {
                            toast.error("Please select file Number");
                          }
                        }}
                        size="small"
                        sx={{
                          backgroundColor: value === 4 ? "skyblue" : "white",
                          color: "black",
                          "&:hover": {
                            backgroundColor: value === 4 ? "skyblue" : "white",
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                    iconPosition="end"
                  />
                </Tabs>

                <Modal open={NoteOpen} onClose={handleNoteClose}>
                  <Box sx={{ ...style, maxHeight: "80vh", overflowY: "auto" }}>
                    <IconButton
                      edge="end"
                      onClick={handleNoteClose}
                      aria-label="close"
                      sx={{ color: "black", marginLeft: "97%" }}
                    >
                      <CloseIcons />
                    </IconButton>

                    <Typography fontWeight="600" fontSize={20}>
                      Add Notesheet for :-{" "}
                      <i>
                        #{fileID}-{fileName}
                      </i>{" "}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />

                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid container spacing={1} item>
                        <Grid
                          xs={12}
                          md={6}
                          sm={6}
                          item
                          style={{ marginBottom: "30px", marginTop: "30px" }}
                        >
                          <TextField
                            type="file"
                            inputProps={{ accept: "application/pdf" }}
                            InputLabelProps={{ shrink: true }}
                            label={
                              <CustomLabel text={t("text.AttachedFile")} />
                            }
                            size="small"
                            fullWidth
                            style={{ backgroundColor: "white" }}
                            onChange={(e) =>
                              otherDocChangeHandler(e, "uploading")
                            }
                          />
                        </Grid>

                        <Grid xs={12} md={6} sm={6} item>
                          <Grid
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              margin: "10px",
                            }}
                          >
                            {formik.values.uploading == "" ? (
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
                              <embed
                                src={formik.values.uploading}
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
                              onClick={() => modalOpenHandle("uploading")}
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
                          <Box sx={{ ...style, overflowY: "auto" }}>
                            {modalImg == "" ? (
                              <img
                                src={nopdf}
                                style={{
                                  width: "130vh",
                                  height: "75vh",
                                }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%" }}>
                                <embed
                                  src={modalImg}
                                  width="100%"
                                  height="100%"
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            )}
                          </Box>
                        </Modal>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <ReactQuill
                          value={editorContent}
                          onChange={handleEditorChange}
                          modules={modules}
                          formats={formats}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label={<CustomLabel text="Remark" />}
                          value={formik.values.remark}
                          placeholder="Remark"
                          size="small"
                          fullWidth
                          name="remark"
                          id="remark"
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ marginY: 2 }} />

                    <Grid item xs={4} sx={{marginLeft:"30%" }}>
                     
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={addNoteSheet}
                          fullWidth
                        >
                          Save
                        </Button>
                      
                    </Grid>
                  </Box>
                </Modal>
                <Modal open={CoreOpen} onClose={handleCoreClose}>
                  <Box sx={{ ...style, maxHeight: "80vh", overflowY: "auto" }}>
                    <IconButton
                      edge="end"
                      onClick={handleCoreClose}
                      aria-label="close"
                      sx={{ color: "black", marginLeft: "97%" }}
                    >
                      <CloseIcons />
                    </IconButton>

                    <Typography fontWeight="600" fontSize={20}>
                      Add Correspondence for :-{" "}
                      <i>
                        #{fileID}-{fileName}
                      </i>{" "}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />

                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid container spacing={1} item>
                        <Grid
                          xs={12}
                          md={6}
                          sm={6}
                          item
                          style={{ marginBottom: "30px", marginTop: "30px" }}
                        >
                          <TextField
                            type="file"
                            inputProps={{ accept: "application/pdf" }}
                            InputLabelProps={{ shrink: true }}
                            label={
                              <CustomLabel text={t("text.AttachedFile")} />
                            }
                            size="small"
                            fullWidth
                            style={{ backgroundColor: "white" }}
                            onChange={(e) =>
                              otherDocChangeHandler(e, "uploading")
                            }
                          />
                        </Grid>

                        <Grid xs={12} md={6} sm={6} item>
                          <Grid
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              margin: "10px",
                            }}
                          >
                            {formik.values.uploading == "" ? (
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
                              <embed
                                src={formik.values.uploading}
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
                              onClick={() => modalOpenHandle("uploading")}
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
                          <Box sx={{ ...style, overflowY: "auto" }}>
                            {modalImg == "" ? (
                              <img
                                src={nopdf}
                                style={{
                                  width: "130vh",
                                  height: "75vh",
                                }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%" }}>
                                <embed
                                  src={modalImg}
                                  width="100%"
                                  height="100%"
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            )}
                          </Box>
                        </Modal>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <ReactQuill
                          value={editorContent}
                          onChange={handleEditorChange}
                          modules={modules}
                          formats={formats}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label={<CustomLabel text="Remark" />}
                          value={formik.values.remark}
                          placeholder="Remark"
                          size="small"
                          fullWidth
                          name="remark"
                          id="remark"
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ marginY: 2 }} />

                    <Grid item xs={4} sx={{marginLeft:"30%" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addCorrespondence}
                        fullWidth
                      >
                        Save
                      </Button>
                    </Grid>
                  </Box>
                </Modal>

                <Modal open={ReportOpen} onClose={handleReportClose}>
                  <Box sx={{ ...style, maxHeight: "80vh", overflowY: "auto" }}>
                    <IconButton
                      edge="end"
                      onClick={handleReportClose}
                      aria-label="close"
                      sx={{ color: "black", marginLeft: "97%" }}
                    >
                      <CloseIcons />
                    </IconButton>

                    <Typography fontWeight="600" fontSize={20}>
                      Add Report for :-{" "}
                      <i>
                        #{fileID}-{fileName}
                      </i>{" "}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid container spacing={1} item>
                        <Grid
                          xs={12}
                          md={6}
                          sm={6}
                          item
                          style={{ marginBottom: "30px", marginTop: "30px" }}
                        >
                          <TextField
                            type="file"
                            inputProps={{ accept: "application/pdf" }}
                            InputLabelProps={{ shrink: true }}
                            label={
                              <CustomLabel text={t("text.AttachedFile")} />
                            }
                            size="small"
                            fullWidth
                            style={{ backgroundColor: "white" }}
                            onChange={(e) =>
                              otherDocChangeHandler(e, "uploading")
                            }
                          />
                        </Grid>

                        <Grid xs={12} md={6} sm={6} item>
                          <Grid
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              margin: "10px",
                            }}
                          >
                            {formik.values.uploading == "" ? (
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
                              <embed
                                src={formik.values.uploading}
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
                              onClick={() => modalOpenHandle("uploading")}
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
                              <div style={{ width: "100%", height: "100%" }}>
                                <embed
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

                      <Grid item xs={12} sm={12}>
                        {/* <QuillEditor /> */}
                        <ReactQuill
                          value={editorContent}
                          onChange={handleEditorChange}
                          modules={modules}
                          formats={formats}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label={<CustomLabel text="Remark" />}
                          value={formik.values.remark}
                          placeholder="Remark"
                          size="small"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          name="remark"
                          id="remark"
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ marginY: 2 }} />

                    <Grid item xs={4}  sx={{marginLeft:"30%" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addReport}
                        fullWidth
                      >
                        Save
                      </Button>
                    </Grid>
                  </Box>
                </Modal>

                <Modal open={OtherOpen} onClose={handleOtherClose}>
                  <Box sx={{ ...style, maxHeight: "80vh", overflowY: "auto" }}>
                    <IconButton
                      edge="end"
                      onClick={handleOtherClose}
                      aria-label="close"
                      sx={{ color: "black", marginLeft: "97%" }}
                    >
                      <CloseIcons />
                    </IconButton>

                    <Typography fontWeight="600" fontSize={20}>
                      Add other for :-{" "}
                      <i>
                        #{fileID}-{fileName}
                      </i>{" "}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />

                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid container spacing={1} item>
                        <Grid
                          xs={12}
                          md={6}
                          sm={6}
                          item
                          style={{ marginBottom: "30px", marginTop: "30px" }}
                        >
                          <TextField
                            type="file"
                            inputProps={{ accept: "application/pdf" }}
                            InputLabelProps={{ shrink: true }}
                            label={
                              <CustomLabel text={t("text.AttachedFile")} />
                            }
                            size="small"
                            fullWidth
                            style={{ backgroundColor: "white" }}
                            onChange={(e) =>
                              otherDocChangeHandler(e, "uploading")
                            }
                          />
                        </Grid>

                        <Grid xs={12} md={6} sm={6} item>
                          <Grid
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              margin: "10px",
                            }}
                          >
                            {formik.values.uploading == "" ? (
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
                              <embed
                                src={formik.values.uploading}
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
                              onClick={() => modalOpenHandle("uploading")}
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
                              <div style={{ width: "100%", height: "100%" }}>
                                <embed
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

                      <Grid item xs={12} sm={12}>
                        {/* <QuillEditor /> */}
                        <ReactQuill
                          value={editorContent}
                          onChange={handleEditorChange}
                          modules={modules}
                          formats={formats}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label={<CustomLabel text="Remark" />}
                          value={formik.values.remark}
                          placeholder="Remark"
                          size="small"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          name="remark"
                          id="remark"
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ marginY: 2 }} />

                    <Grid item xs={4} sx={{marginLeft:"30%" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addOther}
                        fullWidth
                      >
                        Save
                      </Button>
                    </Grid>
                  </Box>
                </Modal>
              </Grid>
            </Grid>

            <Divider />
            <br />
            {value === 0 && (
              <Grid xs={12} sm={12} item>
                <Drawer
                  anchor="left"
                  open={isDrawerOpen}
                  style={{ zIndex: 1300 }}
                >
                  <div
                    style={{
                      backgroundColor: "#00009c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "50px",
                    }}
                  >
                    <Typography
                      fontWeight="600"
                      align="center"
                      color="#fff"
                      sx={{ margin: 6 }}
                    >
                      Menu{" "}
                    </Typography>
                    <IconButton
                      edge="end"
                      onClick={toggleDrawer(false)}
                      aria-label="close"
                      sx={{
                        color: "#fff",
                        position: "absolute",
                        right: 20,
                        top: 5,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <Divider />
                  <div
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                    style={{ width: "300px" }}
                  >
                    <List>
                      {items.map((item, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            ...listItemStyle(index),
                            ...(activeItem === index && activeStyle),
                            "&:hover": {
                              backgroundColor: "#b1ccc8",
                            },
                            width: "95%",
                          }}
                          onMouseOver={() => handleMouseOver(index)}
                          onMouseOut={handleMouseOut}
                          onClick={item.onClick}
                        >
                          {item.icon} <ListItemText primary={item.text} />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </Drawer>

                {/*  Moved To Awaited */}
                <Modal
                  open={Awaitopen}
                  onClose={handleAWaitClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Moved To Awaited
                    </Typography>

                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid item xs={4}>
                        <TextField
                          type="date"
                          label={<CustomLabel text="Moved Date" />}
                          value={formik.values.moveDate}
                          placeholder="Moved Date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          name="moveDate"
                          id="moveDate"
                          style={{ backgroundColor: "white" }}
                          onChange={handleMoveDateChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.moveDate &&
                            Boolean(formik.errors.moveDate)
                          }
                          helperText={
                            formik.touched.moveDate && formik.errors.moveDate
                          }
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          type="date"
                          label={<CustomLabel text="Due Date" />}
                          value={formik.values.dueDate}
                          placeholder="Due Date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          name="dueDate"
                          id="dueDate"
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.dueDate &&
                            Boolean(formik.errors.dueDate)
                          }
                          helperText={
                            formik.touched.dueDate && formik.errors.dueDate
                          }
                          inputProps={{ min: minDueDate }}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={MoveAwait}
                          fullWidth
                        >
                          Moved
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>

                {/*  Moved To Parked */}
                <Modal
                  open={Parkopen}
                  onClose={handleParkClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Moved To Parked
                    </Typography>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid item xs={6}>
                        <TextField
                          type="date"
                          label={<CustomLabel text="Moved Date" />}
                          value={formik.values.parkDate}
                          placeholder="Moved Date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          name="parkDate"
                          id="parkDate"
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={MoveParked}
                          fullWidth
                        >
                          Moved
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>

                {/* Close the file */}
                <Modal
                  open={Moveopen}
                  onClose={handleMoveClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Close the file
                    </Typography>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid item xs={6}>
                        <TextField
                          type="date"
                          label={<CustomLabel text="Moved Date" />}
                          value={formik.values.closeDate}
                          placeholder="Moved Date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          name="closeDate"
                          id="closeDate"
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={MoveClose}
                          fullWidth
                        >
                          Moved
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>

                <Modal
                  open={Sumopen}
                  onClose={handleSumClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      File Summary/Comments (Desending Order)
                    </Typography>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid item xs={10}>
                        <TextField
                          // type="date"
                          label={<CustomLabel text="Enter Text" />}
                          value={formik.values.SumRemark}
                          placeholder="Enter Text Here......."
                          size="small"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          multiline
                          rows={4}
                          name="SumRemark"
                          id="SumRemark"
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={UpdateSummary}
                          fullWidth
                        >
                          save
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>

                {/* {fileID === "" ? <>{toast.error("First Select File Number then proceed further process...")}</> :  */}
                <>
                  {/* File Movement Details */}
                  <Dialog
                    open={fileMovementDetailopen}
                    // onClose={handlefileMovementDetailClose}
                    fullWidth={fullWidth}
                    maxWidth={maxWidth}
                  >
                    <DialogTitle
                      // style={{ cursor: "move" }}
                      // id="draggable-dialog-title"
                      sx={{
                        backgroundColor: "#f4f4f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography fontWeight="600" fontSize={20}>
                        File Movement Details for :-{" "}
                        <i>
                          #{fileID}-{fileName}
                        </i>{" "}
                      </Typography>
                      <IconButton
                        edge="end"
                        onClick={handlefileMovementDetailClose}
                        aria-label="close"
                        sx={{
                          color: "#000",
                          position: "absolute",
                          right: 17,
                          top: 3,
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <Divider />

                    <DialogContent
                      sx={{ backgroundColor: "#f4f4f5", height: "250px" }}
                    >
                      <DialogContentText>
                        <Table
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            border: "1px solid black",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#00009c",
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
                                  // width: "100px",
                                }}
                              >
                                {t("text.SrNo")}
                              </th>

                              <th
                                style={{
                                  borderLeft: "1px solid black",
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                  // width: "100px",
                                }}
                              >
                                Authority
                              </th>
                              <th
                                style={{
                                  borderLeft: "1px solid black",
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                }}
                              >
                                Route Status
                              </th>
                              <th
                                style={{
                                  borderLeft: "1px solid black",
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                  width: "100px",
                                }}
                              >
                                File Rec. on
                              </th>
                              <th
                                style={{
                                  borderLeft: "1px solid black",
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                }}
                              >
                                File Movement Remark
                              </th>
                            </tr>
                          </thead>
                          <tbody style={{ border: "1px solid black" }}>
                            {fileMovementTableData.map(
                              (row: any, index: any) => (
                                <tr
                                  key={row.id}
                                  style={{ border: "1px solid black" }}
                                >
                                  <td
                                    style={{
                                      borderLeft: "1px solid black",
                                      borderTop: "1px solid black",
                                      textAlign: "center",
                                      padding: "2px",
                                      color: "#000",
                                    }}
                                  >
                                    {index + 1}
                                  </td>

                                  <td
                                    style={{
                                      borderLeft: "1px solid black",
                                      borderTop: "1px solid black",
                                      textAlign: "center",
                                      color: "#000",
                                    }}
                                  >
                                    {row.designation}
                                  </td>

                                  <td
                                    style={{
                                      borderLeft: "1px solid black",
                                      borderTop: "1px solid black",
                                      textAlign: "center",
                                      color: "#000",
                                    }}
                                  >
                                    {row.routeName}
                                  </td>

                                  <td
                                    style={{
                                      borderLeft: "1px solid black",
                                      borderTop: "1px solid black",
                                      textAlign: "center",
                                      color: "#000",
                                    }}
                                  >
                                    {moment(row.fileRdate).format("DD-MM-YYYY")}
                                  </td>
                                  <td
                                    style={{
                                      borderLeft: "1px solid black",
                                      borderTop: "1px solid black",
                                      textAlign: "center",
                                      color: "#000",
                                    }}
                                  >
                                    {row.updateremark}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                      </DialogContentText>
                    </DialogContent>

                    <DialogContent
                      sx={{ backgroundColor: "#f4f4f5", width: "100%" }}
                    >
                      <Grid item>
                        <TextField
                          // value=
                          size="small"
                          label={
                            <CustomLabel
                              text={"Enter Remark "}
                              required={false}
                            />
                          }
                          placeholder="Enter Remark "
                          fullWidth
                          onChange={(e: any) => {
                            console.log("🚀 ~ ViewEditFile ~ e:", e);
                            setRemarkForward(e.target.value);
                          }}
                        />
                      </Grid>
                    </DialogContent>

                    <Divider />
                    <DialogActions
                      sx={{
                        backgroundColor: "#f4f4f5",
                        justifyContent: "center",
                        padding: "16px",
                        gap: "10px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBackwardData}
                        sx={{
                          textTransform: "none",
                          borderRadius: "8px",
                        }}
                      >
                        Backward
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleForwardData}
                        sx={{
                          textTransform: "none",
                          borderRadius: "8px",
                        }}
                      >
                        Forward
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MapIcon />}
                        onClick={() => getRouteView(nodeId)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "8px",
                        }}
                      >
                        View Routes
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    open={openDraggable}
                    // onClose={handleClose}
                    // PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                  >
                    <DialogTitle
                      // style={{ cursor: "move" }}
                      // id="draggable-dialog-title"
                      width="lg"
                      sx={{
                        backgroundColor: "#f4f4f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography fontWeight="600" fontSize={20}>
                        View Routes Details of :-{" "}
                        {nodeId && nodeId.length > 0 && (
                          <>
                            {nodeId?.map((item: any, index: any) => (
                              <i key={index}>
                                #{item.id}-{item.routeName}
                              </i>
                            ))}
                          </>
                        )}
                      </Typography>
                      <IconButton
                        edge="end"
                        onClick={handleCloseDraggable}
                        aria-label="close"
                        sx={{
                          color: "#000",
                          position: "absolute",
                          right: 17,
                          top: 3,
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {nodeId && nodeId[0]?.routeMembercycless && (
                          <div>
                            {nodeId[0]?.routeMembercycless?.map(
                              (item: any, index: any) => (
                                <div key={index}>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 20,
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>Level : {item.authorityLevel}</div>
                                      <div>
                                        Route Name :{" "}
                                        {getDescriptionForNodeMode(
                                          item.nodeMode
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </DialogContentText>
                    </DialogContent>
                  </Dialog>
                </>
                {/* } */}

                <TableContainer
                  component={Paper}
                  id="tabcont"
                  sx={{
                    maxHeight: "65vh",
                    marginBottom: "10px",
                    border: "1px solid #fff",
                  }}
                >
                  <Table
                    aria-label="customized  table"
                    style={{
                      border: "1px gray solid",
                      borderCollapse: "collapse",
                      width: "100%",
                    }}
                  >
                    <TableHead
                      style={{
                        border: "1px gray solid",
                        borderCollapse: "collapse",
                        position: "sticky",
                      }}
                    >
                      <TableRow>
                        {/* <StyledTableCell /> */}
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            border: "1px gray grey",
                            borderLeft: "1px solid #bdbbbb",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            // padding: "10px",
                          }}
                        >
                          {t("text.SrNo")}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            border: "1px gray grey",
                            borderLeft: "1px solid #bdbbbb",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            // padding: "10px",
                          }}
                        >
                          {t("text.FileNo")}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            border: "1px gray grey",
                            borderLeft: "1px solid #bdbbbb",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            // padding: "10px",
                          }}
                        >
                          {t("text.FileName")}
                        </StyledTableCell>

                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            border: "1px gray grey",
                            borderLeft: "1px solid #bdbbbb",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            // padding: "10px",
                          }}
                        >
                          {t("text.Date")}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {tableLoading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          margin: 10,
                        }}
                      >
                        <CustomizedProgressBars />
                      </div>
                    ) : (
                      <TableBody>
                        {MovementTableData.map((row: any, index: any) => (
                          //<Row key={row.any} row={row} index={index} />

                          <StyledTableRow
                            sx={{
                              border: "1px gray grey",
                              borderLeft: "1px solid #bdbbbb",
                              borderTop: "1px solid #bdbbbb",

                              padding: "2px",
                            }}
                          >
                            <TableCell
                              style={{
                                border: "1px gray grey",
                                borderLeft: "1px solid #bdbbbb",
                                borderTop: "1px solid #bdbbbb",

                                padding: "2px",
                              }}
                              align="center"
                            >
                              {index + 1}
                            </TableCell>

                            <TableCell
                              style={{
                                border: "1px gray grey",
                                borderLeft: "1px solid #bdbbbb",
                                borderTop: "1px solid #bdbbbb",

                                padding: "2px",
                              }}
                            >
                              {row.fileNm}
                            </TableCell>

                            <TableCell
                              style={{
                                border: "1px gray grey",
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                                borderLeft: "1px solid #bdbbbb",
                                borderTop: "1px solid #bdbbbb",

                                padding: "2px",
                              }}
                            >
                              <a
                                onMouseEnter={handleMouseEntered}
                                onMouseLeave={handleMouseLeaveed}
                                onClick={() => handleAddCommentClicks(row)}
                              >
                                {" "}
                                {row.cFileNm}
                              </a>
                            </TableCell>

                            <Dialog
                              open={openModals}
                              keepMounted
                              aria-describedby="alert-dialog-slide-description"
                              TransitionComponent={Transition}
                              maxWidth="xl"
                            >
                              <DialogTitle sx={{}}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <>
                                    <Typography fontWeight="600">
                                      {/* // {row.cFileNm} */}
                                      {selectedRow ? selectedRow.cFileNm : ""}
                                    </Typography>
                                  </>
                                  <>
                                    <IconButton
                                      aria-label="close"
                                      onClick={handleCloseModals}
                                    >
                                      <CloseIcon />
                                    </IconButton>{" "}
                                  </>
                                </div>
                              </DialogTitle>
                              {isLoading ? (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: 10,
                                  }}
                                >
                                  <CustomizedProgressBars />
                                </div>
                              ) : (
                                <>
                                  {pdfData ? (
                                    <embed
                                      src={pdfData}
                                      style={{
                                        height: "90vh",
                                        width: "100vh",
                                        border: "1px solid gray",
                                      }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: 10,
                                      }}
                                    >
                                      No PDF Available
                                    </div>
                                  )}
                                </>
                              )}
                            </Dialog>

                            <TableCell
                              style={{
                                border: "1px gray grey",
                                borderLeft: "1px solid #bdbbbb",
                                borderTop: "1px solid #bdbbbb",

                                padding: "2px",
                              }}
                              align="center"
                            >
                              {dayjs(row.date).format("DD-MM-YYYY")}
                            </TableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>

                <Drawer
                  anchor="right"
                  open={rightOpen}
                  //onClose={() => setRightOpen(false)}
                  style={{ zIndex: 1300 }}
                >
                  <div
                    style={{
                      backgroundColor: "#00009c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "50px",
                    }}
                  >
                    <Typography
                      fontWeight="600"
                      align="center"
                      color="#fff"
                      sx={{ margin: 6 }}
                    >
                      Upload Letter{" "}
                    </Typography>
                    <IconButton
                      edge="end"
                      onClick={toggleRightDrawer}
                      aria-label="close"
                      sx={{
                        color: "#fff",
                        position: "absolute",
                        right: 20,
                        top: 5,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <Divider />
                  {/* Content of your right drawer */}
                  <div
                    role="presentation"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    style={{ width: "400px", padding: "20px" }}
                  >
                    <Grid item lg={12} xs={12}>
                      <TextField
                        type="file"
                        inputProps={{ accept: "application/pdf" }}
                        InputLabelProps={{ shrink: true }}
                        label={<CustomLabel text={t("text.EnterDocUpload")} />}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={async (event: any) => {
                          if (event.target.files && event.target.files[0]) {
                            const file = event.target.files[0];
                            setCfileNm(file.name);
                            const fileNameParts = file.name.split(".");
                            const fileExtension =
                              fileNameParts[fileNameParts.length - 1];

                            if (fileExtension.toLowerCase() === "pdf") {
                              const fileURL = URL.createObjectURL(file);
                              setPdfView(fileURL);
                              const base64 = await ConvertBase64(file);
                              // console.log(
                              //     "🚀 ~ ViewEditFile ~ base64:",
                              //     base64
                              // );
                              setFilebase64(base64);
                            } else {
                              alert(
                                "Only PDF files are allowed to be uploaded."
                              );
                              event.target.value = null;
                            }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item lg={12} xs={12} style={{ marginTop: "10%" }}>
                      <TextField
                        label={
                          <CustomLabel text={t("text.EnterFileDescription")} />
                        }
                        placeholder={t("text.EnterFileDescription")}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        type="text"
                        style={{ backgroundColor: "white" }}
                        onChange={(e: any) => {
                          setCFileDesc(e.target.value);
                        }}
                      />
                    </Grid>
                    <br></br>
                    <br></br>
                    {filebase64 && (
                      <Grid item lg={12} xs={12}>
                        <embed
                          src={filebase64}
                          style={{
                            height: "70vh",
                            width: "100%",
                            border: "1px solid gray",
                          }}
                        />
                      </Grid>
                    )}

                    <Grid
                      item
                      lg={12}
                      xs={12}
                      style={{
                        marginTop: "5%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          LetterSubmit();
                          setRightOpen(false);
                        }}
                      >
                        {t("text.Upload")}
                      </Button>
                    </Grid>
                  </div>
                </Drawer>
              </Grid>
            )}
            {value === 1 && <NoteSheet fileID={fileID} />}
            {value === 2 && <Correspondence fileID={fileID} />}
            {value === 3 && <Report fileID={fileID} />}
            {value === 4 && <Other fileID={fileID} />}
          </form>
        </CardContent>
      </div>
      <ToastApp />
    </div>
  );
};

export default ViewEditFile;
