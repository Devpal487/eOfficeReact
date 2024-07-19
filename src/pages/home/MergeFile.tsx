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
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  tableCellClasses,
  TableBody,
  TableCell,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../utils/Url";
import Box from "@mui/material/Box";
import CustomDataGrid from "../../utils/CustomDatagrid";
import { getId, getdivisionId, getinstId } from "../../utils/Constant";
import { useFormik } from "formik";
import CustomLabel from "../../CustomLable";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import CustomizedProgressBars from "../../components/Loader";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../TranslateTextField";
import Languages from "../../Languages";

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

export default function MergeFile() {
  const [totalFile, setTotalFile] = useState<any>([]);

  const { t } = useTranslation();
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ReviewModalData, setReviewModalData] = useState(false);
  const [FileOps, setFileOps] = useState<any>([
    { value: "-1", label: t("text.SelectFileNo") },
  ]);

  const [FileTypeOps, setFileTypeOps] = useState<any>([
    { value: "-1", label: t("text.SelectFileType") },
  ]);

  const [tableLoading, setIsTableLoading] = useState(false);

  const [fileCheck, setFileCheck] = useState<any>("");
  const [lang, setLang] = useState<Language>("en");

  const userId: any = getId();

  const instId: any = getinstId();
  // console.log("🚀 ~ ViewEditFile ~ userId:", userId);
  const divId: any = getdivisionId();
  // console.log("🚀 ~ ViewEditFile ~ divId:", divId);

  // const [selectAll, setSelectAll] = useState(false);
  // const [Data, setData] = useState<any>([]);

  // const handleSelectAllChange = (event:any) => {
  //   const isChecked = event.target.checked;
  //   setSelectAll(isChecked);
  //   const updatedData = Data.map((row:any) => ({ ...row, selected: isChecked }));
  //   setData(updatedData);
  //   const selectedFileNos = isChecked ? updatedData.map((row:any) => row.cFileNo) : [];
  //   formik.setFieldValue("fileNo", selectedFileNos);
  // };

  // const handleCheckboxChange = (row:any, event:any) => {
  //   const isChecked = event.target.checked;
  //   const updatedData = Data.map((item:any) =>
  //     item.cFileNo === row.cFileNo ? { ...item, selected: isChecked } : item
  //   );
  //   setData(updatedData);

  //   const selectedFileNos = updatedData.filter((item:any) => item.selected).map((item:any) => item.cFileNo);
  //   formik.setFieldValue("fileNo", selectedFileNos);
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
      fileNm: "",
    },
    // validationSchema: validationSchema,
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

  const MergeFile = () => {
    const value = {
      txtMergeFileName: formik.values.fileNm.toString() || "",
      userid: userId,
      fileType: formik.values.fileType,
      fileSubject: formik.values.remark.toString() || "",
      mergedBy: parseInt(userId),
      fileForMerge: fileCheck,
      authid: 0,
      divisionId: parseInt(divId),
      inst_id: parseInt(instId),
    };

    api.post(`FileMovement/GetFileMergeReq`, value).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        formik.setFieldValue("fileType", "");
        formik.setFieldValue("fileNo", "");
        formik.setFieldValue("fileNm", "");
        formik.setFieldValue("remark", "");
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const navigate = useNavigate();

  // const handleCheckboxChange = (params: any) => {
  //     // Handle checkbox change logic here
  //     console.log('Row data:', params.row);
  // };

  useEffect(() => {
    getAuthDevision();
    fetchTotalFile();
    getFileNo();
    getFileType();
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
        fId: item.fId,
        label: item.fileNm,
        value: item.fnId,
      }));
      setFileOps(arr);
    });
  };

  const getFileType = () => {
    const collectData = {
      fId: -1,
      inst_id: 1,
      user_id: -1,
      divisionid: 1,
    };
    api.post(`FileType/GetFileType`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.fName,
        value: item.fId,
      }));
      setFileTypeOps(arr);
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
  //       divisionId:parseInt(divId),
  //       type: "MF",
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
  //      // all: false,
  //     }));

  //     setTotalFile(DocsWithIds);
  //     setIsLoading(false);

  //     if (data.length > 0) {
  //       const columns: GridColDef[] = [
  //         // {
  //         //   field: "serialNo",
  //         //   headerName: t("text.SrNo"),
  //         //   width: 120,
  //         //   headerClassName: "MuiDataGrid-colCell",
  //         // },
  //         {
  //           field: "all",
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
  //           field: "createdby",
  //           headerName: t("text.FileCreatedBy"),
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
      type: "MF",
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
  const [selectAll, setSelectAll] = useState(false);

  // useEffect(() => {
  //   const initialCheckboxState = totalFile.reduce((acc: { [x: string]: boolean; }, file: { cFileNo: string | number; }) => {
  //     acc[file.cFileNo] = false;
  //     return acc;
  //   }, {});
  //   setCheckboxState(initialCheckboxState);
  // }, [totalFile]);

  console.log("check data", checkboxState);

  // const handleSelectAllChange = (event: { target: { checked: any; }; }) => {
  //   console.log("check data 400", event);
  //   const checked = event.target.checked;
  //   setSelectAll(checked);
  //   const newCheckboxState = totalFile.reduce((acc: { [x: string]: any; }, file: { cFileNo: string | number; }) => {
  //     acc[file.cFileNo] = checked;
  //     return acc;
  //   }, {});
  //   setCheckboxState(newCheckboxState);
  // };

  // const handleCheckboxChange = (cFileNo: any, event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("check data 411", event);
  //   const checked = event.target.checked;
  //   setCheckboxState((prevState:any) => {
  //     const newState = { ...prevState, [cFileNo]: checked };
  //     setSelectAll(Object.values(newState).every((val) => val));
  //     return newState;
  //   });
  // };

  const handleSelectAllChange = (event: { target: { checked: any } }) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    const newCheckboxState = totalFile.reduce(
      (acc: { [x: string]: any }, _: any, index: string | number) => {
        acc[index] = checked;
        return acc;
      },
      {}
    );
    setCheckboxState(newCheckboxState);
  };

  const handleCheckboxChange = (
    index: any,
    event: React.ChangeEvent<HTMLInputElement>,
    cFileNo: any
  ) => {
    console.log("FIle no checked", cFileNo);
    const checked = event.target.checked;
    setFileCheck(cFileNo);
    setCheckboxState((prevState: any) => {
      const newState = { ...prevState, [index]: checked };
      setSelectAll(Object.values(newState).every((val) => val));
      return newState;
    });
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
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
      <Grid item xs={12} container spacing={2}>
        <Grid item lg={2} md={2} xs={2} marginTop={2}></Grid>
        <Grid
          item
          lg={7}
          md={7}
          xs={7}
          alignItems="center"
          justifyContent="center"
        ></Grid>

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

      <Divider />
      <br />
      <form>
        <Grid item xs={12} container spacing={3}>
          <Grid xs={6} sm={6} item>
            <TranslateTextField
              label={t("text.fileName")}
              value={formik.values.fileNm}
              onChangeText={(text: string) =>
                handleConversionChange("fileNm", text)
              }
              required={true}
              lang={lang}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={FileTypeOps}
              value={
                FileTypeOps.find(
                  (option: any) => option.value === formik.values.fileType
                ) || null
              }
              fullWidth
              size="small"
              onChange={(event, newValue: any) => {
                console.log(newValue?.value);

                formik.setFieldValue("fileType", newValue?.value);

                formik.setFieldTouched("fileType", true);
                formik.setFieldTouched("fileType", false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={<CustomLabel text={t("text.SelectFileType")} />}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TranslateTextField
              label={t("text.EnterRemark")}
              value={formik.values.remark}
              onChangeText={(text: string) =>
                handleConversionChange("remark", text)
              }
              required={true}
              lang={lang}
            />
          </Grid>
          <Grid item xs={2}>
            {/*  {permissionData?.isAdd == true ? ( */}
            <Button variant="contained" size="large" onClick={MergeFile}>
              {/* {editId == -1 ? t("text.save") : t("text.update")} */}

              {t("text.save")}
            </Button>
            {/* ) : ( */}
            {/*   "" */}
            {/* )} */}
          </Grid>
        </Grid>
      </form>

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
                        onChange={(event) =>
                          handleCheckboxChange(index, event, row.cFileNo)
                        }
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
    </Paper>
  );
}
