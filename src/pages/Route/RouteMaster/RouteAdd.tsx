import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  TextField,
  CardContent,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import api from "../../../utils/Url";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import auth from "../../../assets/images/authority.png";
import comm from "../../../assets/images/committee.png";
import grp from "../../../assets/images/group.png";
import { getISTDate } from "../../../utils/Constant";
import { toast } from "react-toastify";
import { getdivisionId } from "../../../utils/Constant";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import Languages from "../../../Languages";



export default function RouteAdd() {
  const back = useNavigate();
  let navigate = useNavigate();
  let DivId = getdivisionId(); //nodeId

  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();
  const [fileOption, setFileOption] = useState([
    { value: "-1", label: t("text.FileType") },
  ]);
  const [departmentOption, setDepartmentOption] = useState([
    { value: "-1", label: t("text.FileType") },
  ]);
  const [authorityOption, setAuthorityOpotion] = useState([
    { value: "-1", label: "Select Authority" },
  ]);
  const [committeeOption, setCommitteeOption] = useState([
    { value: "-1", label: "Select Committee" },
  ]);
  const [committeeGroupOption, setCommitteeGroupOption] = useState([
    { value: "-1", label: "Select Group" },
  ]);
  const [sectionOption, setSectionOption] = useState([
    { value: "-1", label: "Select Section" },
  ]);

  const [selectedValue, setSelectedValue] = useState<any>(null);
  const numberOfCards = parseInt(selectedValue);

  const [nodeType, setNodeType] = useState<any>([
    { value: 1, label: "Authority" },
  ]);
  const [nodeTypetemp, setNodeTypetemp] = useState<any>([
    { value: 1, label: "Authority" },
  ]);
  const nodeTypeOptions = [
    { value: 1, label: "Authority", short: "A" },
    { value: 2, label: "Committee", short: "C" },
    { value: 3, label: "Group", short: "G" },
  ];
  const [toaster, setToaster] = useState(false);

  const [issubRouteCheck, setIssubRouteCheck] = useState<any>(0);
  const [isCommitteeChecked, setIsCommitteeChecked] = useState<any>(0);
  const [isCommitteeGroupChecked, setIsCommitteeGroupChecked] = useState<any>(0);
  const [routeMembercycles, setRouteMembercycles] = useState<any>();
  const nodeId: any = localStorage.getItem("id");

  const [commGroupdetail , setCommGroupDetail] = useState<any>([])
  const [groupdetail , setGroupDetail] = useState<any>([])
  const [lang, setLang] = useState<Language>("en");
 
  useEffect(() => {
    getFileData();
    getDepartmentData();
    getAuthorityData();
    getCommitteeData();
    getCommitteeGroupData();
    
  }, []);
  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };
  const getFileData = async () => {
    const collectData = {
      fId: -1,
      inst_id: -1,
      user_id: -1,
      divisionid: -1,
    };

    await api.post(`FileType/GetFileType`, collectData).then((res: any) => {
      const arr: any = [];
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["fName"],
          value: res.data.data[index]["fId"],
        });
      }
      setFileOption(arr);
    });
  };

  const getSectionData = async (id:any) => {
    const collectData = {
     "id": -1,
    "department": id?.toString(),
    "section": "",
    "instid": -1,
    "sesid": "",
    "uid": ""
    };

    await api
      .post(`SectionMaster/GetSectionMaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["section"],
            value: res.data.data[index]["id"],
          });
        }
        setSectionOption(arr);
      });
  };

  const getDepartmentData = async () => {
    const collectData = {
      departmentId: -1,
      departmentName:""
    };

    await api
      .post(`Department/GetDepartmentmaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["departmentName"],
            value: res.data.data[index]["departmentId"],
          });
        }
        setDepartmentOption(arr);
      });
  };

  const getAuthorityData = async () => {
    const collectData = {
      id: -1,
      officeId: -1,
      under_id: -1,
      divisionid: -1,
    };

    await api
      .post(`AuthorityMaster/GetAuthorityMaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["authorityType"],
            value: res.data.data[index]["id"],
          });
        }
        setAuthorityOpotion(arr);
      });
  };

  const getCommitteeData = async () => {
    const collectData = {
      id: -1,
      committeeName: "",
      officeId: -1,
      userId: "",
      ipAddress: "",
      type: "C",
    };

    await api
      .post(`CommitteeMaster/GetCommitteeMaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["committeeName"],
            value: res.data.data[index]["id"],
          });
        }
        setCommitteeOption(arr);
      });
  };

  const getCommitteeGroupData = async () => {
    const collectData = {
      id: -1,
      committeeName: "",
      officeId: -1,
      userId: "",
      ipAddress: "",
      type: "G",
    };

    await api
      .post(`CommitteeMaster/GetCommitteeMaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["committeeName"],
            value: res.data.data[index]["id"],
          });
        }
        setCommitteeGroupOption(arr);
      });
  };

  const getCommitteeGroupDetail = async (id:any) => {
    const collectData = {
      id: id,
      committeeName: "",
      officeId: -1,
      userId: "",
      ipAddress: "",
      type: "",
    };

    await api
      .post(`CommitteeMaster/GetCommitteeMaster`, collectData)
      .then((res: any) => {
        setCommGroupDetail(res.data.data|| [])
      });
  };

  const getGroupsDetail = async (id:any) => {
    const collectData = {
      id: id,
      committeeName: "",
      officeId: -1,
      userId: "",
      ipAddress: "",
      type: "",
    };

    await api
      .post(`CommitteeMaster/GetCommitteeMaster`, collectData)
      .then((res: any) => {
        setGroupDetail(res.data.data|| [])
      });
  };

  const handleCheckboxSubRouteChange = (event: any, index:any) => {
    // console.log("🚀 ~ handleCheckboxChange ~ event:", event.target.checked === true ? 1:0)
    let num :any =  event.target.checked === true ? 1:0;
    // console.log("🚀 ~ handleCheckboxSubRouteChange ~ num:", num)
    setRouteMembercycles((prev:any) => {
      const updatedArray = [...prev];
      updatedArray[index] = {
        ...updatedArray[index],
        subRouteCheck: num,
      };
      return updatedArray;
    });
  };

  const handleCheckboxChange = (event: any, index:any) => {
    setIsCommitteeChecked(event.target.checked);
    let num :any =  event.target.checked === true ? 1:0;
    setRouteMembercycles((prev:any) => {
      const updatedArray = [...prev];
      updatedArray[index] = {
        ...updatedArray[index],
        committeeCheck: num,
      };
      return updatedArray;
    });
  };

  const handleCheckboxesChange = (event: any,  index:any) => {
    setIsCommitteeGroupChecked(event.target.checked);
    let num :any =  event.target.checked === true ? 1:0;
    setRouteMembercycles((prev:any) => {
      const updatedArray = [...prev];
      updatedArray[index] = {
        ...updatedArray[index],
        groupCheck: num,
      };
      return updatedArray;
    });
  };

  const handleNodeTypeChange = (newValue: any, cardIndex: number) => {
    const updatedNodeTypes = [...nodeType];
    updatedNodeTypes[cardIndex] = newValue?.value;
    setNodeTypetemp(newValue);
    setNodeType(updatedNodeTypes);
    var tabindex = newValue?.value;
    handleCardTabChange(newValue, cardIndex, tabindex);
  };


  const handleparameterPriorityChange = (event: React.SyntheticEvent<Element, Event>, value: number | null, index: number) => {
    setRouteMembercycles((prev:any) => {
      const updatedArray = [...prev];
      updatedArray[index] = {
        ...updatedArray[index],
        parameterPriority: value?.toString(),
      };
      return updatedArray;
    });
  };

  const handlecommitteePriorityChange = (event: React.SyntheticEvent<Element, Event>, value: number | null, index: number) => {
    setRouteMembercycles((prev:any) => {
      const updatedArray = [...prev];
      updatedArray[index] = {
        ...updatedArray[index],
        committeePriority: value,
      };
      return updatedArray;
    });
  };

  const handlegroupPriorityChange = (event: React.SyntheticEvent<Element, Event>, value: number | null, index: number) => {
    setRouteMembercycles((prev:any) => {
      const updatedArray = [...prev];
      updatedArray[index] = {
        ...updatedArray[index],
        groupPriority: value,
      };
      return updatedArray;
    });
  };


  
  const handleCardTabChange = (
    newValue: any,
    cardIndex: number,
    tabindex: number
  ) => {
    const updatedRouteMembercycless = [...routeMembercycles];
    console.log("Updated routeMembercycless:", newValue);
    console.log("Updated cardIndex:", cardIndex);
    updatedRouteMembercycless[cardIndex] = {
      ...updatedRouteMembercycless[cardIndex],

      arrivalDate: defaultValuestime,
      authorityLevel: cardIndex + 1,
      uploadDate: defaultValuestime,

      nodeModes: newValue?.label == "undefined" || newValue?.label == undefined ? "Authority" : newValue?.label,
      nodeMode: newValue?.label == "undefined" || newValue?.label == undefined? "A" : newValue?.short,
      nodeMod: newValue?.value == "undefined" || newValue?.value == undefined? 1 : newValue?.value,

      tabindex: tabindex,
      nodeType: newValue?.value == "undefined" || newValue?.value == undefined? 1 : newValue?.value,
    };
    console.log("Updated routeMembercycless:", updatedRouteMembercycless);
    setRouteMembercycles(updatedRouteMembercycless);
    console.log("Updated routeMembercycless:", routeMembercycles);
  };

  const formik = useFormik({
    initialValues: {
      id: -1,
      routeName: "",
      totalLevel: 0,
      officeId: 1,
      uplodDate: defaultValuestime,
      routeMembercycless: [],
    },
    onSubmit: async (values) => {
      values.routeMembercycless = routeMembercycles;
      console.log("check", values);
      const response = await api.post(
        `RouteMemberCycle/AddUpdateRouteMemberCycle`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/E-Office/Route");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });



  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    value: any
  ) => {
    formik.setFieldValue("totalLevel", value);

    var arr = Array.from({ length: value }, (_, index) => ({
      id: -1,
      authorityId: 0,
      email: "",
      sms: "",
      arrivalDate: defaultValuestime,
      message: "",
      authorityLevel: index + 1,
      routeId: 0,
      officeId: 1,
      uploadDate: defaultValuestime,
      subRoute: "",
      committee: 0,
      memGroup: 0,
      nodeMod: 1,
      nodeModes: "Authority",
      nodeMode: "A",
      committeeOrGroupId: 0,
      auth_DeptId: 0,
      auth_SectionId: 0,
      tabindex: 1,
      nodeType: 1,
      divisionid: DivId,
      parameterPriority: "",
      authName: "",
      auth_DeptName: "",
      auth_SectionName: "",
      subRouteCheck: 0,
      committeeCheck: 0,
      groupCheck: 0,
      committeePriority: 0,
      groupPriority: 0,
    }));
    console.log("arr onchange", arr);
    setRouteMembercycles(arr);
    // const updatedRouteMembercycless = [...routeMembercycles];
    //setRouteMembercycles(updatedRouteMembercycless);
    console.log("routeMembercycles onchange", routeMembercycles);
    setSelectedValue(value);
  };



  const renderCards = () => {
    if (selectedValue === null) {
      return null;
    }

    const numberOfCards = parseInt(selectedValue);

    const cards = Array.from({ length: numberOfCards }, (_, index) => (
      <Grid item xs={12} md={6} lg={4} key={index}>
        <Card style={{ backgroundColor: "#FEFEFA", border:"0.5px solid #000", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" }}>
          <CardContent>
            <CardContent sx={{ padding: 0 , marginBottom:0}}>
              <Grid
                container
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Level {index + 1}</h2>
                <Grid xs={6} item>
                  <Autocomplete
                    disablePortal
                    disableClearable
                    id={`node-type-combo-box-${index}`}
                    fullWidth
                    size="small"
                    style={{ background: "white" }}
                    value={routeMembercycles[index]?.nodeModes}
                    options={nodeTypeOptions}
                    onChange={(event, newValue) =>
                      handleNodeTypeChange(newValue, index)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select Node Type" />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <br />

            <Box sx={{ bgcolor: "background.paper" }}>
              <Tabs
                value={routeMembercycles[index].tabindex}
                variant="scrollable"
                scrollButtons={false}
                aria-label="lab API tabs example"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#01796F', 
              height: 2, 
            },
            '& .MuiTab-root': { 
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '0.8rem', 
              backgroundColor: '#F0FFFF',
              borderRadius:"10px",
              gap:"15px",
               color:"#1976d2",
              '&:hover': {
                backgroundColor: '#F0FFFF',
                color:"#000"
              },
            },
            '& .Mui-selected': {
              color: '#006D6F',
            },
          }}
              >

                {routeMembercycles[index].nodeType === 1 && (
                  <Tab
                    label="Authority"
                    onClick={() => {
                      console.log("routeMembercycles", routeMembercycles);
                      handleCardTabChange(
                        { value: 1, label: "Authority", short: "A" },
                        index,
                        1
                      );
                    }}
                    value={1}
                    sx={{
                      backgroundColor:
                        routeMembercycles[index].tabindex === 1
                          ? "#F8F8FF"
                          : "inherit",
                      // color:
                      //   routeMembercycles[index].tabindex === 1
                      //     ? "white"
                      //     : "white",
                    }}
                  />
                )}
                {routeMembercycles[index].nodeType === 2 && (
                  <Tab
                    label="Committee"
                    onClick={() => {
                      handleCardTabChange(
                        { value: 2, label: "Committee", short: "C" },
                        index,
                        2
                      );
                    }}
                    value={2}
                    sx={{
                      backgroundColor:
                        routeMembercycles[index].tabindex === 2
                          ? "#F8F8FF"
                          : "inherit",
                      color:
                        routeMembercycles[index].tabindex === 2
                          ? "white"
                          : "inherit",
                    }}
                  />
                )}
                {routeMembercycles[index].nodeType === 3 && (
                  <Tab
                    label="Group"
                    onClick={() => {
                      handleCardTabChange(
                        { value: 3, label: "Group", short: "G" },
                        index,
                        3
                      );
                    }}
                    value={3}
                    sx={{
                      backgroundColor:
                        routeMembercycles[index].tabindex === 3
                          ? "#F8F8FF"
                          : "inherit",
                      color:
                        routeMembercycles[index].tabindex === 3
                          ? "white"
                          : "inherit",
                    }}
                  />
                )}
                
                <Tab
                  label="Committee/Group Parameters"
                  onClick={() => {
                    handleCardTabChange(
                     nodeTypetemp,
                      index,
                      0
                    );
                    console.log(routeMembercycles[index].tabindex);
                  }}
                  value={0}
                  sx={{
                    backgroundColor:
                      routeMembercycles[index].tabindex === 0
                        ? "#F8F8FF"
                        : "inherit",
                    // color:
                    //   routeMembercycles[index].tabindex === 0
                    //     ? "white"
                    //     : "inherit",
                  }}
                />
              </Tabs>
            </Box>

            <br />
            {routeMembercycles.length > 0 && (
              <>
                {routeMembercycles[index].tabindex == 0 ? (
                  <>
                    <Grid item xs={12} md={12} lg={12} container spacing={2}>
                      <Grid item xs={12} md={12} lg={12} container spacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                          <Typography>
                            Authority is required to transfer file over :{" "}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography align="center" sx={{fontWeight:600}}>Mode</Typography>
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                          <Typography align="center" sx={{fontWeight:600}}>Priority</Typography>
                        </Grid>
                      </Grid>
                      <Divider />

                      <Grid container item xs={12} gap={1}>
                        <Grid item xs={3}>
                          <FormControl >
                            <FormGroup row>
                              <FormControlLabel
                                value="SubRoute"
                                control={<Checkbox 
                                  // checked={routeMembercycles.subRouteCheck === 1}
                                  onChange={(event) => handleCheckboxSubRouteChange(event, index)}
                                  />}
                                label="Sub Route"
                                labelPlacement="end"
                                sx={{
                                  '& .MuiFormControlLabel-label': {
                                    fontSize: '0.75rem', // Custom font size
                                  },
                                }}

                              />
                            </FormGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            id="SubRoute"
                            name="subRoute"
                            size="small"
                            fullWidth
                            label="SubRoute Name"
                            placeholder="SubRoute Name"
                            style={{ background: "white" }}
                            onChange={(e:any)=>{
                              routeMembercycles[index].subRoute =
                              e.target.value;
                            }}
                          />
                        </Grid>
                        <Grid xs={3} item>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            // options={ZoneOption}
                            fullWidth
                            style={{ background: "white" }}
                            size="small"
                            options={[0, 1, 2]}
                            onChange={(event, value) => handleparameterPriorityChange(event, value, index)}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Priority" />
                            )}
                            
                          />
                        </Grid>
                      </Grid>

                      <Grid container item xs={12} gap={1}>
                        <Grid item xs={3}>
                          <FormControl>
                            <FormGroup row>
                              <FormControlLabel
                                value="Committee"
                                // control={<Checkbox />}
                                control={
                                  <Checkbox onChange={(event) => handleCheckboxChange(event, index)}/>
                                }
                                label="Committee"
                                labelPlacement="end"
                                sx={{
                                  '& .MuiFormControlLabel-label': {
                                    fontSize: '0.75rem', // Custom font size
                                  },
                                }}/>
                            </FormGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                          {isCommitteeChecked ? (
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={committeeOption}
                              fullWidth
                              style={{ background: "white" }}
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                console.log(newValue);
                                //formik.setFieldValue("committee", newValue?.value)
                                routeMembercycles[index].committee =
                                  newValue?.value;
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Committee Name"
                                />
                              )}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              size="small"
                              label=""
                              style={{ background: "white" }}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          )}
                        </Grid>
                        <Grid xs={3} item>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            // options={ZoneOption}
                            fullWidth
                            style={{ background: "white" }}
                            size="small"
                            options={[0, 1, 2]}
                            onChange={(event, value) => handlecommitteePriorityChange(event, value, index)}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Priority" />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Grid container item xs={12} gap={1}>
                        <Grid item xs={3}>
                          <FormControl>
                            <FormGroup row>
                              <FormControlLabel
                                value="Group"
                                control={
                                  <Checkbox onChange={(event) => handleCheckboxesChange(event, index)}/>
                                }
                                label="Group"
                                labelPlacement="end"
                                sx={{
                                  '& .MuiFormControlLabel-label': {
                                    fontSize: '0.75rem', // Custom font size
                                  },
                                }}/>
                            </FormGroup>
                          </FormControl>
                        </Grid>

                        <Grid item xs={5}>
                          {isCommitteeGroupChecked ? (
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={committeeGroupOption}
                              fullWidth
                              style={{ background: "white" }}
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                console.log(newValue);
                                // formik.setFieldValue("memGroup", newValue?.value)
                                routeMembercycles[index].memGroup =
                                  newValue?.value;
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Group Name"
                                />
                              )}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              size="small"
                              label=""
                              style={{ background: "white" }}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          )}
                        </Grid>

                        <Grid xs={3} item>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            style={{ background: "white" }}
                            // options={ZoneOption}
                            fullWidth
                            size="small"
                            options={[0, 1, 2]}
                            onChange={(event, value) => handlegroupPriorityChange(event, value, index)}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Priority" />
                            )}
                          />
                        </Grid>

                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    {routeMembercycles[index].tabindex === 1 && (
                      <div style={{ backgroundColor: "background.paper" }}>
                        <Grid
                          item
                          xs={12}
                          container
                          spacing={0.5}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Grid
                            xs={4}
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                          >
                            <img src={auth} alt="Authority" height="90px" />
                          </Grid>
                          <Grid item xs={8} container spacing={0.5}>
                            <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={departmentOption}
                                fullWidth
                                size="small"
                                style={{ background: "white" }}
                                onChange={(e: any, newValue: any) => {
                                  if(newValue != "" ){
                                    routeMembercycles[index].auth_DeptId =
                                    newValue?.value;
                                    routeMembercycles[index].auth_DeptName =
                                    newValue?.label;
                                    getSectionData(newValue?.value);
                                  }
                                    
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Department"
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                fullWidth
                                size="small"
                                options={sectionOption}
                                style={{ background: "white" }}
                                onChange={(e: any, newValue: any) => {
                                  console.log("section value", newValue);
                                  routeMembercycles[index].auth_SectionId =
                                    newValue?.value;
                                    routeMembercycles[index].auth_SectionName =
                                    newValue?.label;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Section"
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                fullWidth
                                size="small"
                                options={authorityOption}
                                // value={
                                //   authorityOption.find(
                                //     (option) =>
                                //       option.value ===
                                //       routeMembercycles[index].authorityId
                                //   ) || null
                                // }
                                // onChange={formik.handleChange}
                                onChange={(e: any, newValue: any) => {
                                  console.log("section value", newValue);
                                  //  setAuthSection(newValue?.value)
                                  routeMembercycles[index].authorityId =
                                    newValue?.value;
                                    routeMembercycles[index].authName =
                                    newValue?.label;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                style={{ background: "white" }}
                                // value={selectedValue}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Authority"
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                          <Grid xs={6} item alignContent="center">
                            {/* <TextField
                                                    id="zoneName"
                                                    name="zoneName"
                                                    label="Employee Name"
                                                    //value={formik.values.zoneName}
                                                    placeholder="Employee Name"
                                                    style={{ background: "white" }}
                                                    size="small"
                                                    fullWidth
                                                    InputProps={{ readOnly: true }}
                                                /> */}
                            NA
                          </Grid>

                          <Grid xs={6} item alignContent="center">
                            {/* <TextField
                                                    id="zoneName"
                                                    name="zoneName"
                                                    label="Designation"
                                                    //   value={formik.values.zoneName}
                                                    placeholder="Designation"
                                                    style={{ background: "white" }}
                                                    size="small"
                                                    fullWidth
                                                    InputProps={{ readOnly: true }}
                                                /> */}
                            NA
                          </Grid>

                          {/* <Grid item xs={12} container spacing={1}> */}
                            <Grid xs={12} item>
                              <FormControl>
                                <FormGroup row>
                                  <FormLabel defaultValue="Y" sx={{marginTop:1, mr:2}}>
                                    Notify by :
                                  </FormLabel>
                                  <FormControlLabel
                                    value="Y"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].email =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].email = "N";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="E-Mail"
                                    checked={
                                      routeMembercycles[index]?.email ===
                                      "Y"
                                    }
                                  />

                                  <FormControlLabel
                                    value="Y"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].sms =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].sms = "N";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="SMS"
                                    checked={
                                      routeMembercycles[index]?.sms === "Y"
                                    }
                                  />
                                </FormGroup>
                              </FormControl>
                            </Grid>

                            <Grid xs={12} item>
                              <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Enter Message"
                                style={{
                                  width: "100%",
                                  fontSize: " 1.075rem",
                                  fontWeight: "400",
                                  borderRadius: "4px",
                                  lineHeight:"2"
                                }}
                                value={routeMembercycles[index].message}
                                onChange={(event) => {
                                  routeMembercycles[index].message =
                                    event.target.value;
                                  formik.setFieldValue(
                                    "message",
                                    event.target.value
                                  );
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                // onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                          {/* </Grid> */}
                        </Grid>
                      </div>
                    )}
                    {routeMembercycles[index].tabindex === 2 && (
                      <>
                        <Grid
                          item
                          xs={12}
                          container
                          spacing={1}
                        >
                           <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={committeeOption}
                                style={{ background: "white" }}
                                fullWidth
                                size="small"
                                onChange={(event: any, newValue: any) => {
                                  console.log(
                                    newValue?.value);
                                    if(newValue != ""){
                                      routeMembercycles[index].committeeOrGroupId =
                                      newValue?.value;
                                      getCommitteeGroupDetail(newValue?.value)
                                    }
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={<span>{"Committee"}</span>}
                                  />
                                )}
                              />
                            </Grid>
                          <Grid
                            xs={4}
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                          >
                            <img src={commGroupdetail.length > 0 ? commGroupdetail[0]?.committeeLogo :comm} alt="Committee" width="100px" height="75px" />

                          </Grid>
                          <Grid item xs={8} container spacing={1}>
                            {/* <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={committeeOption}
                                style={{ background: "white" }}
                                fullWidth
                                size="small"
                                onChange={(event: any, newValue: any) => {
                                  console.log(
                                    newValue?.value,
                                    event.target.value
                                  );
                                  routeMembercycles[index].committeeOrGroupId =
                                    newValue?.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={<span>{"Committee"}</span>}
                                  />
                                )}
                              />
                            </Grid> */}

                            <Grid item lg={12} xs={12}>
                              <TextField
                                label="Enter Description"
                                placeholder="Enter Description"
                                size="small"
                                style={{ background: "white" }}
                                fullWidth
                                value={commGroupdetail.length > 0 ? commGroupdetail[0]?.committeeDesc : ''}
                                InputLabelProps={{shrink:true}}
                                disabled={true}
                              />
                            </Grid>
                          </Grid>

                          <Grid xs={12} item>
                              <FormControl>
                                <FormGroup row>
                                  <FormLabel defaultValue="Y" sx={{marginTop:1, mr:2}}>
                                    Notify by :
                                  </FormLabel>
                                  <FormControlLabel
                                    value="Y"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].email =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].email = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="E-Mail"
                                    checked={
                                      routeMembercycles[index]?.email ===
                                      "Y"
                                    }
                                  />

                                  <FormControlLabel
                                    value="N"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].sms =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].sms = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="SMS"
                                    checked={
                                      routeMembercycles[index]?.sms === "N"
                                    }
                                  />
                                </FormGroup>
                              </FormControl>
                            </Grid>

                            <Grid xs={12} item>
                              <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Enter Message"
                                style={{
                                  width: "100%",
                                  fontSize: " 1.075rem",
                                  fontWeight: "400",
                                  borderRadius: "4px",
                                  lineHeight:"3"
                                }}
                                value={routeMembercycles[index].message}
                                onChange={(event) => {
                                  routeMembercycles[index].message =
                                    event.target.value;
                                  formik.setFieldValue(
                                    "message",
                                    event.target.value
                                  );
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                // onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                        </Grid>
                      </>
                    )}
                    {routeMembercycles[index].tabindex === 3 && (
                      <>
                        <Grid
                          item
                          xs={12}
                          container
                          spacing={1}
                        >
                          <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={committeeGroupOption}
                                fullWidth
                                size="small"
                                onChange={(event: any, newValue: any) => {
                                  console.log(newValue?.value);
                                  if(newValue != ""){
                                    routeMembercycles[index].committeeOrGroupId =
                                    newValue?.value;
                                    getGroupsDetail(newValue?.value)
                                  }
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                style={{ background: "white" }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={<span>{"Select Group"}</span>}
                                  />
                                )}
                              />
                            </Grid>
                          <Grid
                            xs={4}
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                          >
                            {/* <img src={grp} alt="Group" height="75px" /> */}
                            <img src={groupdetail.length > 0 ? groupdetail[0]?.committeeLogo :comm} alt="Committee" width="100px" height="75px" />
                          </Grid>
                          <Grid item xs={8} container spacing={1}>
                            {/* <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={committeeGroupOption}
                                fullWidth
                                size="small"
                                onChange={(event: any, newValue: any) => {
                                  console.log(newValue?.value);
                                  routeMembercycles[index].committeeOrGroupId =
                                    newValue?.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                style={{ background: "white" }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={<span>{"Select Group"}</span>}
                                  />
                                )}
                              />
                            </Grid> */}

                            <Grid item lg={12} xs={12}>
                              <TextField
                                label="Enter Description"
                                style={{ background: "white" }}
                                placeholder="Enter Description"
                                size="small"
                                fullWidth
                                value={groupdetail.length > 0 ? groupdetail[0]?.committeeDesc : ''}
                                InputLabelProps={{shrink:true}}
                                disabled={true}
                              />
                            </Grid>
                          </Grid>
                           
                           <Grid xs={12} item>
                              <FormControl>
                                <FormGroup row>
                                  <FormLabel defaultValue="Y" sx={{marginTop:1, mr:2}}>
                                    Notify by :
                                  </FormLabel>
                                  <FormControlLabel
                                    value="Y"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].email =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].email = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="E-Mail"
                                    checked={
                                      routeMembercycles[index]?.email ===
                                      "Y"
                                    }
                                  />

                                  <FormControlLabel
                                    value="N"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].sms =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].sms = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="SMS"
                                    checked={
                                      routeMembercycles[index]?.sms === "N"
                                    }
                                  />
                                </FormGroup>
                              </FormControl>
                            </Grid>

                            <Grid xs={12} item>
                              <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Enter Message"
                                style={{
                                  width: "100%",
                                  fontSize: " 1.075rem",
                                  fontWeight: "400",
                                  borderRadius: "4px",
                                  lineHeight:"3"
                                }}
                                value={routeMembercycles[index].message}
                                onChange={(event) => {
                                  routeMembercycles[index].message =
                                    event.target.value;
                                  formik.setFieldValue(
                                    "message",
                                    event.target.value
                                  );
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    ));

    return (
      <Grid container spacing={1.2}>
        {cards}
      </Grid>
    );
  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          border: ".5px solid #00009c",
          marginTop: "3vh",
        }}
      >
        <CardContent>
        <Grid item xs={12} container spacing={2} >
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.createRoute")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Divider />
          <br />

          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={3}>
              <Grid xs={6} item>
              <TranslateTextField
                  label="Enter Route Name"
                  value={formik.values.routeName}
                  onChangeText={(text: string) =>
                    handleConversionChange("routeName", text)
                  }
                  required={true}
                  lang={lang}
                />
              </Grid>

              <Grid xs={6} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  fullWidth
                  size="small"
                  options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
                  value={selectedValue}
                  onChange={handleAutocompleteChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Select level" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} container>
                {renderCards()}
              </Grid>
              <Grid item xs={2}>
                {/*  {permissionData?.isAdd == true ? ( */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                >
                  {t("text.save")}
                </Button>
                {/* ) : ( */}
                {/*   "" */}
                {/* )} */}
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <ToastApp />
      </div>
    </div>
  );
};