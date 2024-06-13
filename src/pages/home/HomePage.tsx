import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Typography,
  Divider,
  Button,
  TextField,
  Stack,    
  IconButton,
  Paper,
  CircularProgress,
   FormControl,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  Radio,
  FormLabel
} from "@mui/material";
import "./style.css";
import api from "../../utils/Url";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { ConfirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";
import ReviewOficer from "./ReviewOficer";
import { useFormik } from "formik";
import { getId } from "../../utils/Constant";
import { CloseIcons } from "../../utils/icons";
import ToastApp from "../../ToastApp";

export const options1 = {
  pieHole: 0.25,
  is3D: false,
  legend: "top",
};


export default function HomePage() {
  const { t } = useTranslation();
  const userid = getId();
  const[switchType, setSwitchType] = useState("1");
  const [ReviewModalData, setReviewModalData] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [year, setYear] = useState("");
  const [columns, setColumns] = useState<any>([]);
  const [totalFile, setTotalFile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [refno, setRefNo]= useState("");
  const [refNoYr , setRefNoYr ]= useState("");

  var Division: any[];
 

  const startrefrence = async () => {
    const collectDatas = {
      divid: parseInt(localStorage.getItem("id") + ""),
      inst_id: 1,
      pstart: parseInt(referenceNo),
      refNoYr: parseInt(year),
    };
    // console.log(collectDatas);
    let noticeFile: any = [];
    await api
      .post(`RefferenceNumber/GetRefferenceNo`, collectDatas)
      .then((res) => {
        if (res.data.isSuccess) {
          // console.log("result", res.data.data);
          const data = res.data.data;
          const DocsWithIds = data.map((doc: any, index: any) => ({
            ...doc,
            serialNo: index + 1,
            id: doc.rid,
          }));

          setTotalFile(DocsWithIds);
          setIsLoading(false);
          toast.success("Refference No genrate successFully ");
        } else {
          toast.error(" ");
        }
      });
    try {
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const handleCloseReviewModal = () => {
    setReviewModalData(false);
    formik.setFieldValue("rDealHands", "");
    formik.setFieldValue("rDealHandlabel", "");
  };

  useEffect(() => {
    getAuthDevision();
    setTimeout(() => {
      fetchTotalFile();
    }, 5000);

    const tokenDataString: any = sessionStorage.getItem("token");
  }, []);

  const navigate = useNavigate();

  const routeChangeAdd = (row: any) => {
    let path = "";
    if (row.id == -1) {
      console.log(row)
      path = `/master/PageCreateAdd`;
    } else {
      console.log(row)
      path = `/master/PageCreateEdit`;
    }

    navigate(path, {
      state: row,
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

  const formik = useFormik({
    initialValues: {
      rSendAdrs: '',
      id: "",
      rRemark: "",
      rFileNumber: "",
      rid: "",
      rDealHands: "",
      rDealHandlabel:""

    },
    onSubmit: async (values) => { },
  });
  

  const getSpMovement = () => {

    const value = {
      "eid": userid?.toString(),
      "hdnFileNumber": formik.values.rFileNumber.toString() || "",
      "hdnRId": formik.values.rid.toString() || "",
      "hdnAuth": formik.values.rDealHands.toString() || "",
      "txtRemark": formik.values.rRemark.toString() || "",
      "i": "1",
      "fid": "",
    };
    api
      .post(`FileMovement/SP_Movefile`, value)
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success(res.data.mesg);
          fetchTotalFile();
          handleCloseReviewModal();
          formik.setFieldValue("rRemark","");
          formik.resetForm();
        }else{
          toast.error(res.data.mesg);
        }
      });
  };

  const fetchTotalFile = async () => {
    try {
      const collectData = {
        inst_id: 1,
        divid: parseInt(localStorage.getItem("id") + ""),
        refNoYr: parseInt(new Date().getFullYear() + ""),
        pstart: 0,
      };
      const response = await api.post(
        `RefferenceNumber/GetRefferenceNo`,
        collectData
      );
      const data = response.data.data;
      const DocsWithIds = data.map((doc: any, index: any) => ({
        ...doc,
        serialNo: index + 1,
        id: doc.rid,
        Division: Division,
      }));

      const sortedData = DocsWithIds.sort((a: { rid: number; }, b: { rid: number; }) => (a.rid === -1 ? -1 : b.rid === -1 ? 1 : 0));

      setTotalFile(sortedData);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          // {
          //   field: "serialNo",
          //   headerName: t("text.SrNo"),
          //   width: 100,
          //   headerClassName: "MuiDataGrid-colCell",
          // },

          {
            field: "rNumber",
            headerName: "R Number",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => {
              return [
                <a
                  onClick={() => routeChangeAdd(params.row)}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {params.value}
                </a>,
              ];
            },
          },

          {
            field: "rReceivedDate",
            headerName: "Received/Dispatch",
            width: 400,
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "rPriority",
            headerName: "Priority",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "rSubject",
            headerName: "Subject ",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "rFileNumber",
            headerName: "File Number",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "rDealHands",
            headerName: "Movement",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "rSendAdrs",
            headerName: "Moved To",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => {
              return [
                <Select
                  onChange={(event) => {
                    setReviewModalData(true);
                    setRefNo(params.row.refNo);
                    setRefNoYr(params.row.refNoYr);
                    formik.setFieldValue("id", params.row.id);
                    formik.setFieldValue("rFileNumber", params.row.rFileNumber);
                    formik.setFieldValue("rid", params.row.rid);
                    formik.setFieldValue("rDealHands", params.row.Division[0]["value"]);
                    formik.setFieldValue("rDealHandlabel", params.row.Division[0]["label"]);
                  }}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="" >Select Division</MenuItem>
                  {params.row.Division.map((item: any) => (
                      <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                    ))}
                </Select>
              ]
            },
          },
          {
            field: "letterBy",
            headerName: "Letter From/Letter To",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "rLetterSentOn",
            headerName: "Letter Send From",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "refNoYr",
            headerName: "Refrence Number Year ",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "attachMentCount",
            headerName: "Attachement Count ",
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  return (
    <div  style={{
      padding: "5px 5px",
      backgroundColor: "#ffffff",
      borderRadius: "5px",
      marginTop: "5px",
      border: ".5px solid #00009c",
  }}>
    <ToastApp/>
      <div
        style={{
          backgroundColor:"#fff",
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          padding: "5px",
          borderRadius: "12px"
        }}
      >

              <Grid sm={12} md={12} xs={12} >
                <FormControl
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 50,
                    // marginTop: "13px",
                    marginLeft: "12px",
                    marginRight: "12px",
                  }}
                >
                  <Grid>
                    <FormLabel>Switch to:</FormLabel>
                  </Grid>
                  <Grid  sx={{
                            marginLeft:"40px"
                          }} >
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      defaultValue="1"
                      onChange={(event:any) => {
                        setSwitchType(event.target.value);
                      }}
                      >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label={t("text.RefrenceNoDiary")}
                        />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Review Officer Inbox"
                          sx={{
                            marginLeft:"40px"
                          }}
                      />
                    </RadioGroup>
                  </Grid>
                </FormControl>
              </Grid>

      </div>
    

{ReviewModalData && (
                <Modal open={true} >
                  <Card
                    style={{
                      width: "80%",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#E9FDEE",
                      border: ".5px solid #42AEEE",
                      marginTop: "35vh",
                      marginLeft: "10%"
                    }}
                  >
                    <Paper
                      sx={{
                        width: "100%",
                        overflow: "hidden",
                        "& .MuiDataGrid-colCell": {
                          backgroundColor: "#42AEEE",
                          color: "#fff",
                          fontSize: 17,
                          fontWeight: 900
                        }
                      }}
                      style={{ padding: "10px", justifyContent: "center" }}
                    >
                      <Grid xs={12} display="flex" alignItems="center" justifyContent="space-between" >

                      <Typography fontWeight={600} color="#000" fontSize="20px">Remark to {formik.values.rDealHandlabel} for the Letter {refno}--{refNoYr}</Typography>
                      {/* <Typography color="#000" ><CloseIcons/></Typography> */}
                      <IconButton
                                            // edge="end"
                                            onClick={handleCloseReviewModal}
                                            aria-label="close"
                                            //sx={{ color: "#fff", position: "absolute", right: 20, top: 5 }}
                                        >
                                            <CloseIcons/>
                                        </IconButton>
                      </Grid>

                      <ConfirmDialog />
                      <Divider />
                      <Box height={10} />
                      <Stack direction="column" spacing={2} classes="my-2 mb-2" justifyContent={"center"}>
                        <TextField
                          label={t("text.Remark")}
                          value={formik.values.rRemark}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={t("text.Remark")}
                          name="rRemark"
                          id="rRemark"
                          
                          size="medium"
                          style={{ backgroundColor: "white", width: '100%' }}
                          fullWidth
                          multiline
                          rows={4}
                        />
                        <Box display="flex" justifyContent="flex-end" width="100%" >
                          <Button
                            variant="contained"

                            size="large"
                            sx={{
                              borderRadius: '8px',
                              backgroundColor: '#34a362',

                              width: "15%"
                            }}
                            onClick={() =>{
                              startrefrence();
                              getSpMovement();
                            }}
                          >
                            Move
                          </Button>
                        </Box>
                      </Stack>
                    </Paper>
                  </Card>
                </Modal>
              )}



        {switchType === "1" && (
          <>
                <Grid sm={6} md={6} xs={6} sx={{backgroundColor:"#f0f0f0", marginTop:"10px", padding:"10px", border: "1px solid #ccc", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease",borderRadius:"12px"}} display="flex" alignItems="center" justifyContent="space-around">
                      <Grid xs={2}>
                      <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#059669",
                        color: "white"
                      }}
                      //onClick={(e:any) => handleSave(id, name)} 
                    >
                      Create New File
                    </Button>
                      </Grid>

                      <Grid xs={2}>
                      <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#059669",
                        color: "white"
                      }}
                      //onClick={(e:any) => handleSave(id, name)} 
                    >
                      View File
                    </Button>
                      </Grid>

                      <Grid xs={2}>
                      <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#059669",
                        color: "white"
                      }}
                      //onClick={(e:any) => handleSave(id, name)} 
                    >
                      FLRD
                    </Button>
                      </Grid>

                      <Grid xs={2}>
                      <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#059669",
                        color: "white"
                      }}
                      //onClick={(e:any) => handleSave(id, name)} 
                    >
                      Misc. Docs
                    </Button>
                      </Grid>

                      <form >
                    <Grid item xs={12} container spacing={3}>

                      <Grid xs={5} sm={5} item>
                        <TextField
                          label="Enter Ref. No."
                          // value={formik.values.zoneName}
                          placeholder="Enter Ref. No."
                          size="small"
                          fullWidth
                          style={{backgroundColor: 'white'}}
                          // onChange={formik.handleChange}
                          // onBlur={formik.handleBlur}
                        />
                      </Grid>

                      <Grid item xs={5} sm={5}>
                        <TextField
                          // id="zoneCode"
                          // name="zoneCode"
                          label="Enter Year"
                          // value={formik.values.zoneCode}
                          placeholder="Enter Year"
                          size="small"
                          fullWidth
                          style={{ backgroundColor: "white" }}
                          // onChange={formik.handleChange}
                          // onBlur={formik.handleBlur}
                        />

                      </Grid>

                      <Grid item xs={2}>
                        <Button type="submit" variant="contained" size="large">
                          Start
                        </Button>
                      </Grid>
                    </Grid>
                      </form>
                  </Grid>
                  <br/>
                  <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            "& .MuiDataGrid-colCell": {
              backgroundColor: "#2B4593",
              color: "#fff",
              fontSize: 17,
              fontWeight:900
            },
          }}
          style={{ padding: "10px",}}
        >
          <ConfirmDialog />

                      {isLoading ? (
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
                        <Box>
                          <div
                            style={{
                              width: "100%",
                              backgroundColor: "#FFF",
                            }}
                          >
                            <DataGrid
                              rows={totalFile}
                              columns={adjustedColumns}
                              autoHeight
                              slots={{
                                toolbar: GridToolbar,
                              }}
                              rowSpacingType="border"
                              pagination={true}
                              pageSizeOptions={[5, 10, 25, 50, 100].map(
                                (size) => ({
                                  value: size,
                                  label: `${size}`,
                                })
                              )}
                              initialState={{
                                pagination: {
                                  paginationModel: { pageSize: 5 },
                                },
                              }}
                              slotProps={{
                                toolbar: {
                                  showQuickFilter: true,
                                },
                              }}
                              scrollbarSize={20} 
                            />
                          </div>
                        </Box>
                      )}


                  </Paper>
                </>
        )}

{switchType === "2" && (<ReviewOficer/>)}
    </div>
  );
}
