import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  Divider,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Stack,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  Radio,
  FormLabel,
  Checkbox,
  tableCellClasses,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../utils/Url";
import Box from "@mui/material/Box";
import CustomDataGrid from "../../utils/CustomDatagrid";
import { getId, getdivisionId, getinstId } from "../../utils/Constant";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import CustomizedProgressBars from "../../components/Loader";

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

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function BulkClosed() {
  const [totalFile, setTotalFile] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ReviewModalData, setReviewModalData] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [tableLoading, setIsTableLoading] = useState(false);

  const [fileCheck, setFileCheck] = useState<any>("");
  const [StatusCheck, setStatus] = useState<any>("");


  const userId:any = getId();

  const instId:any = getinstId();
 
  const divId:any = getdivisionId();
  
  const [selectAll, setSelectAll] = useState(false);

  // const handleSelectAllChange = (event:any) => {
  //   const isChecked = event.target.checked;
  //   console.log("ischecked", isChecked)
  //   setSelectAll(isChecked);
  //   const updatedRows = totalFile.map((row:any) => ({ ...row, all: isChecked }));
  //   setTotalFile(updatedRows);

  //   if (isChecked) {
  //     const allFileNos = updatedRows.map((row:any) => row.cFileNo);
  //     formik.setFieldValue("fileNo", allFileNos.join(","));
  //   } 
  // };

  // const handleCheckboxChange = (params: any, event: any) => {
  //   const isChecked = event.target.checked;
  //   const cFileNo = params.row.cFileNo;
  //   const lastStaus = params.row.lastStaus;


  //   if (isChecked) {
  //     formik.setFieldValue("fileNo", cFileNo);
  //     formik.setFieldValue("lastStatus", lastStaus);
  //   } else {
  //     formik.setFieldValue("fileNo", "");
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      // pdFid: -1,
      pdfName: "",
      docMid: 0,
      keywords: "",
      subFtype: "",
      fileNo: 0,
      fileType: 0,
      remark: "",
      fileName: "",
      fId: 0,
      lastStatus:""
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      // const response = await api.post(
      //    `DocFiles/AddUpdateDocFiles`,
      //    values
      // );
    },
  });

  useEffect(() => {
    getAuthDevision();
    fetchTotalFile();
  }, []);

  const SubmitBulk = () => {
    const value = {
      fileNo:fileCheck,
      lastStatus:StatusCheck,
    };

    api.post(`FileMovement/AddSp_SubmitBulkClosed`, value).then((res) => {
      if (res.data.isSuccess == true) {
        toast.success(res.data.mesg);
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const getAuthDevision = () => {
    const collectData = {
      divisionid: parseInt(localStorage.getItem("id") + ""),
    };
    api.post(`AuthorityMaster/GetAuthorityDiv`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.authorityType,
        value: item.id,
      }));
      Division = arr;
    });
  };

  var Division: any[];

  // const fetchTotalFile = async () => {
  //   try {
  //     console.log("Division", Division);
  //     const collectData = {
  //       userid: userId,
  //       divisionId: divId,
  //       type: "BC",
  //     };
  //     console.log("collectData", collectData);
  //     const response = await api.post(
  //       `FileMovement/Getsp_FileRoInbox`,
  //       collectData
  //     );

  //     console.log("result", response.data.data);
  //     const data = response.data.data;
  //     const DocsWithIds = data.map((doc: any, index: any) => ({
  //       ...doc,
  //       serialNo: index + 1,
  //       id: doc.cFileNo,
  //       Division: Division,
  //     }));

  //     setTotalFile(DocsWithIds);
  //     setIsLoading(false);

  //     if (data.length > 0) {
  //       const columns: GridColDef[] = [
  //         {
  //           field: "serialNo",
  //           headerName: t("text.SrNo"),
  //           width: 120,
  //           headerClassName: "MuiDataGrid-colCell",
  //         },

  //         {
  //           field: "All",
  //           headerName: t("text.All"),
  //           flex: 1,
  //           headerClassName: "MuiDataGrid-colCell",

  //           renderHeader: () => (
  //             <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
  //           ),

  //           renderCell: (params) => {
  //             console.log("checkPrams", params);
  //             return [
  //               <Checkbox
  //                 checked={params.value}
  //                 onChange={(event: any) => handleCheckboxChange(params, event)}
  //               />,
  //             ];
  //           },
  //         },

  //         {
  //           field: "fileNm",
  //           headerName: t("text.FileNo"),
  //           flex: 1,
  //           headerClassName: "MuiDataGrid-colCell",
  //           renderCell: (params) => {
  //             return [
  //               <a
  //                 onClick={() => navigate("/E-Office/ViewEditFile")}
  //                 style={{
  //                   color: "blue",
  //                   cursor: "pointer",
  //                   textDecoration: "underline",
  //                 }}
  //               >
  //                 {params.value}
  //               </a>,
  //             ];
  //           },
  //         },
  //         {
  //           field: "cSubject",
  //           headerName: t("text.Subject"),
  //           flex: 1,
  //           headerClassName: "MuiDataGrid-colCell",
  //         },
  //         {
  //           field: "lastStaus",
  //           headerName: t("text.LastStatus"),
  //           flex: 1,
  //           headerClassName: "MuiDataGrid-colCell",
  //         },
  //         {
  //           field: "updatedRemark",
  //           headerName: t("text.UpdatedRemark"),
  //           flex: 1,
  //           headerClassName: "MuiDataGrid-colCell",
  //         },

  //         {
  //           field: "createdby",
  //           headerName: t("text.FileCreatedBy"),
  //           flex: 1,
  //           headerClassName: "MuiDataGrid-colCell",
  //         },
  //       ];
  //       setColumns(columns as any);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // const adjustedColumns = columns.map((column: any) => ({
  //   ...column,
  // }));

  const fetchTotalFile = () => {
    setIsTableLoading(true);
    const collectData = {
      userid: userId,
      divisionId: parseInt(divId),
      type: "BC",
    };
    api.post(`FileMovement/Getsp_FileRoInbox`, collectData).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          cFileNo: res.data.data[index]["cFileNo"],
          updatedRemark: res.data.data[index]["updatedRemark"],
          lastStaus: res.data.data[index]["lastStaus"],
          createdby: res.data.data[index]["createdby"],
          cSubject: res.data.data[index]["cSubject"],
          fileNm: res.data.data[index]["fileNm"],
          selected: false,
        });
      }
      setTotalFile(arr);

      // setData(arr)
      setIsTableLoading(false);
    });
  };


  const [checkboxState, setCheckboxState] = useState<any>({});
  
 

  console.log("check data", checkboxState);



  const handleSelectAllChange = (event: { target: { checked: any; }; }) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    const newCheckboxState = totalFile.reduce((acc: { [x: string]: any; }, _: any, index: string | number) => {
      acc[index] = checked;
      return acc;
    }, {});
    setCheckboxState(newCheckboxState);
  };

  const handleCheckboxChange = (index: any, event: React.ChangeEvent<HTMLInputElement>, row: any) => {

    console.log("FIle no checked", row.cFileNo)
    const checked = event.target.checked;
    setFileCheck(row.cFileNo);
    setStatus(row.lastStaus);
    setCheckboxState((prevState: any) => {
      const newState = { ...prevState, [index]: checked };
      setSelectAll(Object.values(newState).every((val) => val));
      return newState;
    });
  };


  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        "& .MuiDataGrid-colCell": {
          backgroundColor: "#2B4593",
          color: "#fff",
          fontSize: 17,
          fontWeight: 900,
        },
      }}
      style={{ padding: "10px" }}
    >
      <Grid xs={12} sm={12} item sx={{ marginTop: "15px" }}>
        <TableContainer
          component={Paper}
          id="tabcont"
          sx={{
            maxHeight: "65vh",
            marginBottom: "10px",
            // border: "1px solid #fff",
          }}
        >
          <Table
            aria-label="customized  table"
            style={{
              // border: "1px gray solid",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <TableHead
              style={{
                // border: "1px gray solid",
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
                    // border: "1px gray grey",
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
                    // border: "1px gray grey",
                    borderLeft: "1px solid #bdbbbb",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                  }}
                >
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />

                  {t("text.All")}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    // border: "1px gray grey",
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
                    // border: "1px gray grey",
                    borderLeft: "1px solid #bdbbbb",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    // padding: "10px",
                  }}
                >
                  {t("text.Subject")}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    // border: "1px gray grey",
                    borderLeft: "1px solid #bdbbbb",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    // padding: "10px",
                  }}
                >
                  {t("text.FileCreatedBy")}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    // border: "1px gray grey",
                    borderLeft: "1px solid #bdbbbb",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    // padding: "10px",
                  }}
                >
                  {t("text.LastStatus")}
                </StyledTableCell>

                <StyledTableCell
                  align="center"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    // border: "1px gray grey",
                    borderLeft: "1px solid #bdbbbb",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    // padding: "10px",
                  }}
                >
                  {t("text.UpdatedRemark")}
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
                {totalFile.map((row: any, index: any) => (
                  


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
                      {/* <Checkbox 
                        //  checked={row.selected}
                        // onChange={(event) => handleCheckboxChange(row, event)}
*/}
                        {/* <Checkbox
                checked={checkboxState[row.cFileNo] || false}
                onChange={(event) => handleCheckboxChange(row.cFileNo, event)}
              /> */}
              <Checkbox
                  checked={checkboxState[index] || false}
                  onChange={(event) => handleCheckboxChange(index, event, row)}
                />
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px gray grey",
                        borderLeft: "1px solid #bdbbbb",
                        borderTop: "1px solid #bdbbbb",
                        padding: "2px",
                      }}
                    >
                      <a
                        onClick={() => navigate("/E-Office/ViewEditFile")}
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {row.fileNm}
                      </a>
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px gray grey",
                        borderLeft: "1px solid #bdbbbb",
                        borderTop: "1px solid #bdbbbb",

                        padding: "2px",
                      }}
                    >
                      {row.cSubject}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px gray grey",
                        borderLeft: "1px solid #bdbbbb",
                        borderTop: "1px solid #bdbbbb",

                        padding: "2px",
                      }}
                    >
                      {row.createdby}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px gray grey",
                        borderLeft: "1px solid #bdbbbb",
                        borderTop: "1px solid #bdbbbb",

                        padding: "2px",
                      }}
                    >
                      {row.lastStaus}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px gray grey",
                        borderLeft: "1px solid #bdbbbb",
                        borderTop: "1px solid #bdbbbb",

                        padding: "2px",
                      }}
                    >
                      {row.updatedRemark}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Grid>


      {/* {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <CustomDataGrid
          isLoading={isLoading}
          rows={totalFile}
          columns={adjustedColumns}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialPageSize={5}
        />
      )} */}

      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={2}>
          <Button
            variant="contained"
            size="large"
            onClick={SubmitBulk}
            sx={{
              mt: 1,
              "&:hover": {
                backgroundColor: "#2B4593", 
              },
            }}
          >
            {t("text.Submit")}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
