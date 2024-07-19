import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Divider,
  Paper,
  Grid,
  SwipeableDrawer,
  Typography,
  TextField,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import ToastApp from "../../../ToastApp";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import PrintIcon from "@mui/icons-material/Print";
import { styled } from "@mui/material/styles";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { DeleteOutline, Margin } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomizedProgressBars from "../../../components/Loader";
import { t } from "i18next";
import api from "../../../utils/Url";
import CustomLabel from "../../../CustomLable";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import Languages from "../../../Languages";


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
  // padding: "2px !important",
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
    // padding: "2px !important",

  },
  "& td, & th": {
    padding: "3px !important", // Ensure all cells in the row have 2px padding
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

function Row({ row, index }: { row: any; index: number }) {
  var someDate = new Date();
  var date = someDate.setDate(someDate.getDate());
  var defaultValues = new Date(date).toISOString().split("T")[0];

  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("lg");
  const [isHovered, setIsHovered] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isHover1, setIsHover1] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModals, setOpenModals] = useState(false);
  const [pdfData, setPDFData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedRow, setSelectedRow] = useState<{
    pdfname: string;
    pfid: string;
  } | null>(null);

  const initialRowData = {
    dPgid: -1,
    pgNF: 0,
    pgNU: 0,
    pdFid: 0,
    comments: "",
    chiPDFid: 0,
    createdate: defaultValues,
    user_Id: 0,
    userId: 0,
    phySNo: "",
    phyIndex: "",
    relOfficer: "",
    createdateNew: defaultValues,
    fileName: "",
    delete: false,
  };

  const [tableData, setTableData] = useState([initialRowData]);
  const [lang, setLang] = useState<Language>("en");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: string
  ) => {
    const { value } = e.target;
    const updatedTableData: any = [...tableData];
    updatedTableData[index][field] = value;
    setTableData(updatedTableData);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseEnters = () => {
    setIsHover(true);
  };

  const handleMouseLeaves = () => {
    setIsHover(false);
  };

  const handleMouseEntered = () => {
    setIsHover1(true);
  };

  const handleMouseLeaveed = () => {
    setIsHover1(false);
  };

  useEffect(() => {

  }, [selectedRow]);

  const handleAddCommentClick = (pdfname: any, pfid: any) => {
    setSelectedRow({ pdfname, pfid });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddCommentClicks = (docMid: any) => {
    getFileData(docMid);
    setOpenModals(true);
  };

  const handleCloseModals = () => {
    setOpenModals(false);
  };

  const textStyle = {
    cursor: "pointer",
    color: isHovered ? "blue" : "black",
    textDecoration: isHovered ? "underline" : "none",
  };

  const textStyles = {
    cursor: "pointer",
    color: isHover ? "blue" : "black",
    textDecoration: isHover ? "underline" : "none",
  };

  const textStyle1 = {
    cursor: "pointer",
    color: isHover1 ? "blue" : "black",
    textDecoration: isHover1 ? "underline" : "none",
  };

  const removeRow = (index: number) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };

  const addMoreRow = () => {
    setTableData([...tableData, { ...initialRowData }]);
  };

  const handleSubmit = async () => {
    var pfid = selectedRow?.pfid;
    console.log(pfid);
    const updatedTableData = tableData.map((rowData: any) => {
      return {
        ...rowData,
        pdFid: selectedRow?.pfid,
        fileName: selectedRow?.pdfname,
      };
    });

    console.log("Data before submitting:", updatedTableData);

    const response = await api.post(
       `DocFPages/AddUpdateDocFPages`,
      { docFPages: updatedTableData }
    );
    if (response.data.isSuccess == true) {
      toast.success(response.data.mesg);
      handleCloseModal();
    } else {
      toast.error(response.data.mesg);
    }


  };

  let navigate = useNavigate();

  const handleOnClick = (row: any) => {
    navigate("/E-Office/SplitPage", {
      state: row,
    });
  };

  const getFileData = (docMid: any) => {
    setIsLoading(true);
    const collectData = {
      pdFid: docMid,
      user_Id: -1
    };

    console.log("collectData " + JSON.stringify(collectData));
    api
      .post( `DocFiles/GetDocFiles`, collectData)
      .then((response) => {
        console.log(
          "check pdf",
          response?.data?.data[0]["pdfBase64"]
        );
        setPDFData(response?.data?.data[0]["pdfBase64"]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  };

  const handleConversionChange = (params: any, text:any) => {
    //formik.setFieldValue(params);
  };

  return (
    <React.Fragment>
      <ToastApp />
      <StyledTableRow sx={{ border: "1px gray grey" }}>

        <TableCell style={{ border: "1px gray grey" }} align="center">
          {index + 1}
        </TableCell>

        <TableCell style={{ border: "1px gray grey" }} align="center">
          <p 
            style={textStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleAddCommentClick(row.pdfName, row.pdFid)}
          >
           {t("text.AddComment")}
          </p>

          <Dialog
            open={openModal}
            keepMounted
            style={{ width: "100%" }}
            aria-describedby="alert-dialog-slide-description"
            TransitionComponent={Transition}
            // onClose={handleCloseModal}
            maxWidth={maxWidth}
          >
            <DialogTitle>
              <IconButton aria-label="close" onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>{" "}
              {row.fileNo}


              <Grid item xs={12} container spacing={2}>
        <Grid item lg={2} md={2} xs={2} marginTop={2}></Grid>
       
        <Grid item lg={3} md={3} xs={3} marginTop={3}>
          <select
            className="language-dropdown"
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
          >
            {Languages.map((l: any) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Grid>
      </Grid>
            </DialogTitle>

            <Grid xs={12} sm={12} item sx={{ margin: "5px" }}>
              <Table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid black",
                }}
              >
                <thead style={{ backgroundColor: "#2196f3", color: "#f5f5f5" }}>
                  <tr>
                    <th
                      style={{
                        borderLeft: "1px solid black",
                        paddingBlock: "10",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      {t("text.PageNoFrom")}
                    </th>
                    <th
                      style={{
                        borderLeft: "1px solid black",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      {t("text.PageNoTo")}
                      
                    </th>
                    <th
                      style={{
                        borderLeft: "1px solid black",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      {t("text.PhysicalSerialNo")}
                    </th>
                    <th
                      style={{
                        borderLeft: "1px solid black",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      {t("text.RelatedOficer")}
                    </th>
                    <th
                      style={{
                        borderLeft: "1px solid black",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      {t("text.PhysicalIndex")}
                      
                    </th>

                    <th
                      style={{
                        borderLeft: "1px solid black",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                       {t("text.Comments")}
                    </th>

                    <th
                      style={{
                        borderLeft: "1px solid black",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        width: "70px",
                      }}
                    >
                       {t("text.Action")}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ border: "1px solid black" }}>
                  {tableData?.map((row: any, index: any) => (
                    <tr key={row.id} style={{ border: "1px solid black" }}>
                      <td
                        style={{
                          borderLeft: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        <TextField
                          type="text"
                          placeholder= {t("text.PageNoFrom")}
                          size="small"
                          fullWidth
                          value={row.pgNF}
                          onChange={(e: any) =>
                            handleInputChange(e, index, "pgNF")
                          }
                        />
                      </td>
                      <td
                        style={{
                          borderLeft: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TextField
                          type="text"
                          placeholder={t("text.PageNoTo")}
                          size="small"
                          fullWidth
                          value={row.pgNU}
                          onChange={(e: any) =>
                            handleInputChange(e, index, "pgNU")
                          }
                        />
                      </td>
                      <td
                        style={{
                          borderLeft: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TextField
                          type="text"
                          placeholder={t("text.PhysicalSerialNo")}
                          size="small"
                          fullWidth
                          value={row.phySNo}
                          onChange={(e: any) =>
                            handleInputChange(e, index, "phySNo")
                          }
                        />
                      </td>
                      <td
                        style={{
                          borderLeft: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TextField
                          type="text"
                          placeholder={t("text.RelatedOficer")}
                          size="small"
                          fullWidth
                          value={row.relOfficer}
                          onChange={(e: any) =>
                            handleInputChange(e, index, "relOfficer")
                          }
                        />
                      </td>
                      <td
                        style={{
                          borderLeft: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TextField
                          type="text"
                          placeholder={t("text.PhysicalIndex")}
                          size="small"
                          fullWidth
                          value={row.phyIndex}
                          onChange={(e: any) =>
                            handleInputChange(e, index, "phyIndex")
                          }
                        />
                      </td>
                      <td
                        style={{
                          borderLeft: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <TranslateTextField
                          label={t("text.Comments")}
                          value={row.comments}
                          onChangeText={(e:any) =>
                           
                            handleInputChange(e, index, "comments")
                          
                          }
                          required={true}
                          lang={lang}
                        />
                      </td>
                      <td
                        style={{
                          borderLeft: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <DeleteOutline
                          style={{
                            fontSize: "20px",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => removeRow(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <br></br>
              <Grid container spacing={2}>
                <Grid item md={8}></Grid>
                <Grid item md={2}>
                  {" "}
                  <Button
                    // startIcon={<AddCircleIcon />}
                    variant="contained"
                    style={{
                      marginBottom: 15,
                      backgroundColor: "info",
                    }}
                    onClick={addMoreRow}
                  >
                    {t("text.AddRow")}
                  </Button>
                </Grid>

                <Grid item md={2}>
                  {" "}
                  <Button
                    // startIcon={<AddCircleIcon />}
                    variant="contained"
                    style={{
                      marginBottom: 15,
                      backgroundColor: "success",
                    }}
                    onClick={handleSubmit}
                  >
                    {t("text.save")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Dialog>

        </TableCell>

        <TableCell style={{ border: "1px gray grey" }} align="center">
          <p
            style={textStyles}
            onMouseEnter={handleMouseEnters}
            onMouseLeave={handleMouseLeaves}
            onClick={() => handleOnClick(row)}
          >
            {t("text.Index")}
          </p>
        </TableCell>

        <TableCell style={{ border: "1px gray grey" }}>
          <p
            style={textStyle1}
            onMouseEnter={handleMouseEntered}
            onMouseLeave={handleMouseLeaveed}
            onClick={() => handleAddCommentClicks(row.pdFid)}
          >
            {row.fileNo}
          </p>

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
                  <Typography fontWeight="600">{row.pdfName}</Typography>
                </>
                <>
                  <IconButton aria-label="close" onClick={handleCloseModals}>
                    <CloseIcon />
                  </IconButton>{" "}
                </>
              </div>
            </DialogTitle>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", margin: 10 }}><CustomizedProgressBars /></div>
            ) : (<>
              {pdfData ? (
                <embed
                  src={pdfData}
                  style={{
                    height: "90vh",
                    width: "100vh",
                    border: "1px solid gray",
                  }}
                />) : (<div style={{ display: 'flex', justifyContent: "center", alignItems: "center", margin: 10 }}>No PDF Available</div>)}
            </>)}
          </Dialog>

        </TableCell>
        <TableCell style={{ border: "1px gray grey" }}>
          {row.fileDef}
        </TableCell>

        {/* <TableCell style={{ border: "1px gray grey" }}>
          {row.subSubject}
        </TableCell>

        <TableCell style={{ border: "1px gray grey" }}>
          {row.keywords}
        </TableCell> */}

        <TableCell  align="center" style={{ border: "1px gray grey" }}>{row.fDate}</TableCell>

        <TableCell  align="center" style={{ border: "1px gray grey" }}>
          {row.cDate}
        </TableCell>

        {/* <TableCell style={{ border: "1px gray grey" }}>
          {row.synopsis}
        </TableCell>

        <TableCell style={{ border: "1px gray grey" }}>{row.complt}</TableCell> */}

      </StyledTableRow>
    </React.Fragment>
  );
}

export default function DocumentIndexing() {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const { t } = useTranslation();

  const [optionSubSubject, setOptionSubSubject] = useState([
    { value: "-1", label:t("text.SelectDevision") },
  ]);

  const [optionDocument, setOptionDocument] = useState([
    { value: "-1", label:t("text.SelectFileType") },
  ]);


  const [optionFileStatus, setOptionFileStatus] = useState([
    { label: t("text.SelectFileStatus") },
  ]);

  const [loading, setLoading] = useState(false);

 

  useEffect(() => {
    getSubSubjectData();
    getDocumentData();
    getFileStatusData();
  }, []);

  const getSubSubjectData = () => {
    const collectData = {
      docMid: -1,
      fileTypId: -1,
      divisionid: -1,
      subsubjId: -1,
      user_Id: -1,
      fileNo: "",
    };

    api
      .post("DocMangr/GetDocMangr", collectData)
      .then((res) => {
        const arr = [];
        console.log("result" + JSON.stringify(res.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["fileNo"],
            value: res.data.data[index]["docMid"],
          });
        }
        setOptionSubSubject(arr);
      });
  };

  const getDocumentData = () => {
    const collectData = {
      "fId": -1,
      "inst_id": -1,
      "user_id": -1,
      "divisionid": -1
    };

    api
      .post("FileType/GetFileType", collectData)
      .then((res) => {
        const arr = [];
        console.log("result" + JSON.stringify(res.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["fName"],
            value: res.data.data[index]["fId"],
          });
        }
        setOptionDocument(arr);
      });
  };

  const getFileStatusData = () => {
    api.post("FileStatus/GetFileStatus").then((res) => {
      const arr = [];
      console.log("result" + JSON.stringify(res.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["fStatus"],
        });
      }
      setOptionFileStatus(arr);
    });
  };

  const handleFilterButtonClick = () => {
    setFilterDrawerOpen(true);
    // console.log("value handleFilterButtonClick", filterDrawerOpen);
  };

  const handleCloseDrawer = () => {
    setFilterDrawerOpen(false);
  };

  interface FormValues {
    toDate: any;
    fromDate: any;
    docMid: any;
    fileTypId: any;
    filestatus: any;
    textSearch: any;
    divisionid: any;
    user_Id: any;
  }

  const initialValues: FormValues = {
    fromDate: null,
    toDate: null,
    fileTypId: 0,
    filestatus: "",
    textSearch: "",
    divisionid: 0,
    docMid: 0,
    user_Id: 0,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      setLoading(true);
      if (
        !values.docMid ||
        !values.fileTypId ||
        !values.divisionid ||
        !values.filestatus ||
        !values.textSearch ||
        !values.user_Id
      ) {
        values.docMid = "";
        values.fileTypId = "";
        values.divisionid = "";
        values.filestatus = "";
        values.textSearch = "";
        values.user_Id = -1;
      }

      if (!values.fromDate) {
        values.fromDate = "";
      }

      if (!values.toDate) {
        values.toDate = "";
      }

      try {
        const response = await api.post(
          `ReferenceDiary/GetDocMangrForIndex`,
          values
        );
        console.log("check data", response.data.data);
        setData(response.data.data);
        // <CustomizedProgressBars />;
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          handleCloseDrawer();
        } else {
          toast.error(response.data.mesg);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    },
  });

  const handlePrint = () => {
    const contentElement = document.getElementById("tabcont");
    if (contentElement) {
      const clonedContent = contentElement.cloneNode(true) as HTMLElement;

      const filterButton = clonedContent.querySelector(".filter-button");
      if (filterButton) {
        filterButton.remove();
      }
      const printButton = clonedContent.querySelector(".print-button");
      if (printButton) {
        printButton.remove();
      }

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.body.appendChild(clonedContent);

        printWindow.print();
      } else {
        console.error("Error: Unable to open print window.");
      }
    }
  };

  return (
    <Card
      style={{
        width: "100%",
        backgroundColor: "#E9FDEE",
        border: ".5px solid #00009c ",
        marginTop: "3vh",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
        style={{ padding: "10px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.DocumentIndexing")}
          </Typography>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <Button
              type="button"
              onClick={() => handleFilterButtonClick()}
              style={{
                backgroundColor: "blue",
                fontSize: "15px",
                color: "#fff",
                textTransform: "none",
                cursor: "pointer",
              }}
            >
              <FilterAltIcon />
              {t("text.Filter")}
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              style={{
                backgroundColor: "blue",
                fontSize: "15px",
                color: "#fff",
                textTransform: "none",
                cursor: "pointer",
              }}
            >
              <PrintIcon />
              {t("text.Print")}
            </Button>
            <iframe
              id="ifmcontentstoprint"
              style={{ height: "0px", width: "0px", position: "absolute" }}
            ></iframe>
          </div>
          <SwipeableDrawer
            anchor="right"
            open={filterDrawerOpen}
            onClose={handleCloseDrawer}
            onOpen={() => { }}
            slotProps={{
              backdrop: {
                style: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              },
            }}
            PaperProps={{
              style: {
                width: 310,
                boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
              },
            }}
            style={{
              zIndex: 1300,
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                margin: "20px 0px",
              }}
              align="center"
            >
              {t("text.DocumentIndexing")}
            </Typography>
            <Divider />

            <div style={{ margin: "20px 0px" }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    marginLeft: "0px",
                  }}
                >
                  <Grid xs={11} sm={11} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={optionSubSubject}
                      fullWidth
                      size="small"
                      onChange={(event, newValue) => {
                        console.log(newValue?.value);

                        formik.setFieldValue("divisionid", newValue?.value);
                        formik.setFieldTouched("divisionid", true);
                        formik.setFieldTouched("divisionid", false);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={<CustomLabel text={t("text.SelectDevision")} />} />
                      )}
                    />
                  </Grid>

                  <Grid xs={11} sm={11} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={optionDocument}
                      fullWidth
                      size="small"
                      onChange={(event, newValue) => {
                        console.log(newValue?.value);

                        formik.setFieldValue("fileTypId", newValue?.value);
                        // formik.setFieldTouched("fileTypId", true);
                        // formik.setFieldTouched("fileTypId", false);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={<CustomLabel text={t("text.SelectFileType")} />} />
                      )}
                    />
                  </Grid>

                  <Grid xs={11} sm={11} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={optionFileStatus}
                      fullWidth
                      size="small"
                      onChange={(event, newValue) => {
                        console.log(newValue?.label);

                        formik.setFieldValue("filestatus", newValue?.label);
                        formik.setFieldTouched("filestatus", true);
                        formik.setFieldTouched("filestatus", false);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={<CustomLabel text={t("text.SelectFileStatus")} />} />
                      )}
                    />
                  </Grid>

                  <Grid xs={11} sm={11} item>
                    <TextField
                      label={<CustomLabel text={t("text.PeriodFrom")} />}
                      size="small"
                      type="date"
                      fullWidth
                      name="fromDate"
                      id="fromDate"
                      onChange={(e: any) => {
                        formik.setFieldValue("fromDate", e.target.value);
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid xs={11} sm={11} item>
                    <TextField
                      label={<CustomLabel text={t("text.PeriodTo")} />}
                      size="small"
                      type="date"
                      fullWidth
                      name="toDate"
                      id="toDate"
                      onChange={(e: any) => {
                        formik.setFieldValue("toDate", e.target.value);
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid xs={11} sm={11} item>
                    <TextField
                      label={<CustomLabel text={t("text.Search")} />}
                      size="small"
                      type="text"
                      fullWidth
                      name="textSearch"
                      id="textSearch"
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid xs={10} item>
                    <div style={{ justifyContent: "space-between", flex: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        style={{
                          width: "37%",
                          // backgroundColor: "#059669",
                          margin: "0.5%",
                        }}
                      >
                        {t("text.Search")}
                      </Button>
                      <Button
                        type="reset"
                        variant="contained"
                        style={{
                          width: "37%",
                          // backgroundColor: "#F43F5E",
                          margin: "0.5%",
                        }}
                        onClick={() => {
                          formik.resetForm();
                        }}
                      >
                       {t("text.Clear")}
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            </div>
          </SwipeableDrawer>
        </div>

        <Divider />
        <br />
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomizedProgressBars />
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                  <StyledTableCell
                    colSpan={11}
                    align="center"
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      border: "1px gray grey",
                      padding: "5px",
                      backgroundColor: "transparent",
                      color: "#000",
                    }}
                  >
                    {t("text.DocumentIndexing")}
                  </StyledTableCell>
                  <TableRow>
                    {/* <StyledTableCell /> */}
                    <StyledTableCell
                      align="center"
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        border: "1px gray grey",
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
                        // padding: "10px",
                      }}
                    >
                      {t("text.Comments")}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        border: "1px gray grey",
                        // padding: "10px",
                      }}
                    >
                      {t("text.ViewIndexPdf")}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        border: "1px gray grey",
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
                        // padding: "10px",
                      }}
                    >
                      {t("text.FileDefinition")}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        border: "1px gray grey",
                        // padding: "10px",
                      }}
                    >
                     {t("text.DateFrom")}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        border: "1px gray grey",
                        // padding: "10px",
                      }}
                    >
                      {t("text.DateTo")}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row: any, index: any) => (
                    <Row key={row.any} row={row} index={index} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </Paper>
    </Card>
  );
}
